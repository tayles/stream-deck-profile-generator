import { createHash } from "node:crypto";
import type { LabelStyle } from "../types/types";
import { formatHotkeyCommand } from "./keyboard-utils";

export function generateUUID(seed: string): string {
  // Hash the seed string using SHA256 for a consistent and secure output
  const hash = createHash('sha256').update(seed).digest('hex');

  // Format the hash into a UUID v4 structure
  // UUID v4 has a specific structure: 8-4-4-4-12 hexadecimal digits
  // The version (4) and variant (8, 9, A, or B) bits need to be set correctly.
  const uuid = [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(12, 15), // Set version to 4
    '8' + hash.substring(15, 18), // Set variant to 8 (RFC 4122)
    hash.substring(18, 30),
  ].join('-');

  return uuid;
}

export function generateId(label: string): string {
  return `${label.toLowerCase().replace(/\s+/g, "-")}`;
}

export function generateLabel(label: string, hotkey: string, labelStyle: LabelStyle): string {
  const formattedLabel = label.replaceAll(/\s+/g, "\n").trim();
  
  // Replace modifier key names with Unicode symbols
  const formattedHotkey = formatHotkeyCommand(hotkey);
  
  switch (labelStyle) {
    case 'none':
      return '';
    case 'label':
      return formattedLabel;
    case 'hotkey':
      return formattedHotkey;
    case 'both':
    default:
      return `${formattedLabel}\n${formattedHotkey}`.trim();
  }
}
