import {
  KEYBOARD_KEYS,
  type KeyboardKey,
  LOOKUP_MAP,
  MODIFIER_KEYS,
  type SingleChar,
} from './keyboard-utils';

export interface NormalizedHotkey {
  modifiers: KeyboardKey[];
  key: KeyboardKey | SingleChar;
}

/**
 * Parse a hotkey string into modifiers and a key.
 *
 * Splits on `+` or whitespace, resolves aliases and unicode symbols via LOOKUP_MAP,
 * and normalizes modifier names. Multi-char tokens must exist in LOOKUP_MAP.
 * Throws if an unrecognized token or multiple non-modifier keys are found.
 */
export function normalizeHotkeyCommand(hotkey: string): NormalizedHotkey {
  if (hotkey.trim() === '+') return { modifiers: [], key: '+' };
  if (hotkey === ' ') return { modifiers: [], key: ' ' };

  let toParse = hotkey.trim();
  let mainKeyOverride: string | undefined = undefined;

  // Extract '+' as the main key from trailing '+' (e.g. 'Control++' or 'Control +')
  if (toParse.endsWith('+')) {
    mainKeyOverride = '+';
    toParse = toParse.slice(0, -1).trim();
  }

  const parts = toParse.includes('+')
    ? toParse
        .split('+')
        .map(s => s.trim())
        .filter(Boolean)
    : toParse.trim().split(/\s+/).filter(Boolean);

  if (mainKeyOverride) parts.push(mainKeyOverride);

  const modifiers: KeyboardKey[] = [];
  let key = '';

  for (const part of parts) {
    const resolved = LOOKUP_MAP[part.toLowerCase()];

    if (resolved && MODIFIER_KEYS.includes(resolved)) {
      modifiers.push(resolved);
      continue;
    }

    if (key) throw new Error(`Multiple keys: "${key}" and "${part}"`);

    if (part.length > 1 && !resolved) {
      throw new Error(`Unrecognized key: "${part}"`);
    }

    if (resolved) {
      key = resolved;
    } else {
      key = modifiers.length > 0 && /[a-z]/.test(part) ? part.toUpperCase() : part;
    }
  }

  return { modifiers, key };
}

/**
 * Use unicode symbols where possible, join with spaces
 */
export function formatHotkeys(keys: KeyboardKey[]): string {
  return keys
    .filter(Boolean)
    .map(k => KEYBOARD_KEYS[k]?.unicode ?? k)
    .join(' ');
}
