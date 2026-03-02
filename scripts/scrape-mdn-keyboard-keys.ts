/**
 * Scrapes MDN Keyboard Event Key Values page and returns a map of KeyboardEvent.key data.
 *
 * Parses the raw markdown (which contains HTML tables) from the MDN content repo
 * and extracts key values with platform-specific virtual keycodes.
 *
 * Usage: bun scripts/scrape-mdn-keyboard-keys.ts
 *
 * @see https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/ui_events/keyboard_event_key_values/index.md
 */

import { ALTERNATIVE_NAMES, UNICODE_SYMBOLS } from '../src/utils/hotkey-aliases';
import { type KeyboardKeyInfo, type KeyCodeEntry } from '../src/utils/keyboard-utils';

const MDN_RAW_URL =
  'https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/ui_events/keyboard_event_key_values/index.md';

/**
 * Strip HTML tags and decode common entities, returning plain text.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract code entries from a cell's HTML by joining <code> tag text with
 * surrounding parenthetical codes that appear outside the tags.
 *
 * Converts e.g.:
 *   <code>VK_MENU</code> (0x12)<br /><code>VK_LMENU</code> (0xA4)
 * into:
 *   ["VK_MENU (0x12)", "VK_LMENU (0xA4)"]
 */
function extractCodeEntries(html: string): string[] {
  const results: string[] = [];
  // Match <code>NAME</code> optionally followed by (CODE)
  // Note: MDN source sometimes splits the closing tag across lines: </code\n>
  // Also, code values should only be hex (0x...) or decimal numbers — use a
  // tight capture to avoid grabbing broken HTML from MDN source typos.
  const regex = /<code[^>]*>([\s\S]*?)<\/code\s*>\s*(?:\((0x[0-9A-Fa-f]+|\d+)\))?/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const name = stripHtml(match[1]!).trim();
    const code = match[2]?.trim() ?? '';
    if (name) {
      results.push(code ? `${name} (${code})` : name);
    }
  }
  return results;
}

/**
 * Find a code entry matching the given prefix from a list of entries.
 * Entries may be "NAME (CODE)" or just "NAME".
 */
function parseCodeEntry(entries: string[], prefix: string): KeyCodeEntry | null {
  for (const text of entries) {
    if (!text.startsWith(prefix)) continue;
    // Match NAME (CODE) pattern
    const match = text.match(/^(\S+)\s*\(([^)]+)\)/);
    if (match) {
      return { name: match[1]!, code: match[2]! };
    }
    // Name only (no code in parens)
    const nameOnly = text.match(/^(\S+)/);
    if (nameOnly) {
      return { name: nameOnly[1]!, code: '' };
    }
  }
  return null;
}

/**
 * Extract the key name from the first <td> cell.
 * Handles patterns like: <code>"Alt"</code> [4]
 * and edge cases like: <code>"AudioVolumeUp" [1]</code>
 */
function extractKeyName(cellHtml: string): string | null {
  const entries = extractCodeEntries(cellHtml);
  if (entries.length === 0) return null;

  let key = entries[0]!;
  // Remove footnote references like [4] BEFORE removing quotes
  key = key.replace(/\s*\[\d+\]/g, '');
  // Remove surrounding quotes
  key = key.replace(/^["']|["']$/g, '');
  // Remove any deprecated inline markers
  key = key.replace(/\s*\{\{deprecated_inline\}\}/gi, '');
  // Trim outer whitespace, but preserve a key that is itself a whitespace character (e.g. Space = " ")
  key = key.trim() || key;

  return key || null;
}

/**
 * Extract description text from the second <td> cell.
 * Strips HTML, footnotes, and notes.
 */
function extractDescription(cellHtml: string): string {
  // Remove <div class="note*">...</div> blocks and their contents
  let html = cellHtml.replace(/<div\s+class="note[^"]*">[\s\S]*?<\/div>\s*<\/div>/g, '');
  html = html.replace(/<div\s+class="notecard[^"]*">[\s\S]*?<\/div>/g, '');
  let text = stripHtml(html);
  // Remove footnote refs
  text = text.replace(/\s*\[\d+\]/g, '');
  // Clean up extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

/**
 * Extract <td> cells from a <tr> row.
 * Handles multi-line HTML by matching opening/closing td tags.
 */
function extractTdCells(trHtml: string): string[] {
  const cells: string[] = [];
  const regex = /<td[^>]*>([\s\S]*?)<\/td>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(trHtml)) !== null) {
    cells.push(match[1]!);
  }
  return cells;
}

/**
 * Extract <tr> rows from a <tbody> section.
 */
function extractTbodyRows(tableHtml: string): string[] {
  const tbodyMatch = tableHtml.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/);
  if (!tbodyMatch) return [];

  const rows: string[] = [];
  const regex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(tbodyMatch[1]!)) !== null) {
    rows.push(match[1]!);
  }
  return rows;
}

/**
 * Check if a table has the standard 6-column key value layout.
 * These tables have headers: KeyboardEvent.key, Description, Windows, Mac, Linux, Android
 */
function isKeyValueTable(tableHtml: string): boolean {
  return (
    tableHtml.includes('KeyboardEvent.key') &&
    tableHtml.includes('Windows') &&
    tableHtml.includes('Android')
  );
}

export async function scrapeKeyboardKeys(): Promise<Map<string, KeyboardKeyInfo>> {
  console.log('Fetching MDN keyboard key values...');
  const response = await fetch(MDN_RAW_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }
  const markdown = await response.text();

  const keyMap = new Map<string, KeyboardKeyInfo>();

  // Extract all <table> blocks
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/g;
  let tableMatch: RegExpExecArray | null;

  while ((tableMatch = tableRegex.exec(markdown)) !== null) {
    const tableHtml = tableMatch[0];

    // Only process key value tables (skip dead key tables, etc.)
    if (!isKeyValueTable(tableHtml)) continue;

    const rows = extractTbodyRows(tableHtml);

    for (const rowHtml of rows) {
      const cells = extractTdCells(rowHtml);
      if (cells.length < 6) continue;

      const key = extractKeyName(cells[0]!);
      if (!key) continue;

      // ignore Unidentified
      if (key === 'Unidentified') continue;

      // Skip range entries like "0" through "9"
      if (cells[0]!.includes('through')) continue;

      const description = extractDescription(cells[1]!);

      // Windows: cells[2] — look for VK_ or APPCOMMAND_ prefix
      const winEntries = extractCodeEntries(cells[2]!);
      const windows =
        parseCodeEntry(winEntries, 'VK_') ?? parseCodeEntry(winEntries, 'APPCOMMAND_');

      // Mac: cells[3] — look for kVK_ prefix
      const macEntries = extractCodeEntries(cells[3]!);
      const mac = parseCodeEntry(macEntries, 'kVK_');

      // Linux/Qt: cells[4] — extract Qt:: entries only
      const linuxEntries = extractCodeEntries(cells[4]!);
      const qt = parseCodeEntry(linuxEntries, 'Qt::');

      // Android: cells[5] — look for KEYCODE_ prefix
      const androidEntries = extractCodeEntries(cells[5]!);
      const android = parseCodeEntry(androidEntries, 'KEYCODE_');

      const info: KeyboardKeyInfo = { key, description, windows, mac, qt, android };
      const unicode = UNICODE_SYMBOLS[key];
      if (unicode) {
        info.unicode = unicode;
      }
      const altNames = ALTERNATIVE_NAMES[key];
      if (altNames) {
        info.alternativeNames = altNames;
      }
      keyMap.set(key, info);
    }
  }

  return keyMap;
}

// --- Main ---
const keyMap = await scrapeKeyboardKeys();

console.log(`\nParsed ${keyMap.size} keyboard keys:\n`);

// Print a formatted summary
for (const [, info] of keyMap) {
  const parts = [
    `Key: ${info.key}`,
    info.description.length > 80
      ? `Desc: ${info.description.substring(0, 77)}...`
      : `Desc: ${info.description}`,
    info.unicode ? `Unicode: ${info.unicode}` : null,
    info.windows
      ? `Win: ${info.windows.name}${info.windows.code ? ` (${info.windows.code})` : ''}`
      : null,
    info.mac ? `Mac: ${info.mac.name}${info.mac.code ? ` (${info.mac.code})` : ''}` : null,
    info.qt ? `Qt: ${info.qt.name}${info.qt.code ? ` (${info.qt.code})` : ''}` : null,
    info.android
      ? `Android: ${info.android.name}${info.android.code ? ` (${info.android.code})` : ''}`
      : null,
  ]
    .filter(Boolean)
    .join(' | ');
  console.log(parts);
}

// Write the full map as JSON
const outputPath = 'src/data/keyboard-keys.json';
const jsonOutput = {
  $schema: './keyboard-keys.schema.json',
  keys: Object.fromEntries(keyMap),
};
await Bun.write(outputPath, JSON.stringify(jsonOutput, null, 2));
console.log(`\nWritten ${keyMap.size} keys to ${outputPath}`);
