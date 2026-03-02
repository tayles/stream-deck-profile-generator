import KeyboardKeysJson from '../data/keyboard-keys.json';
import type { Hotkey } from '../types/manifest-types';
import type { NormalizedHotkey } from './normalize-utils';

/**
 * A map of KeyboardEvent.key values to their platform-specific key codes, scraped from MDN.
 */
export interface KeyboardKeys {
  [k: string]: KeyboardKeyInfo;
}

export type KeyboardKey = string;
export type SingleChar = string;

/**
 * Information about a single keyboard key across platforms.
 */
export interface KeyboardKeyInfo {
  /**
   * The KeyboardEvent.key value (e.g. Alt, Control, F1).
   */
  key: KeyboardKey;
  /**
   * A plain-text description of the key's function.
   */
  description: string;
  /**
   * Windows virtual key name and code (VK_* or APPCOMMAND_* prefix).
   */
  windows: KeyCodeEntry | null;
  /**
   * macOS virtual key name and code (kVK_* prefix).
   */
  mac: KeyCodeEntry | null;
  /**
   * Qt key name and code (Qt::Key_* prefix).
   */
  qt: KeyCodeEntry | null;
  /**
   * Android key name and code (KEYCODE_* prefix).
   */
  android: KeyCodeEntry | null;
  /**
   * A Unicode symbol representing this key (e.g. ⌘, ⇧, ⌥, ⎋).
   */
  unicode?: string;
  /**
   * Common alternative names or aliases for this key (e.g. Option for Alt on Mac, Return for Enter).
   */
  alternativeNames?: string[];
}
/**
 * A platform-specific key name and its virtual key code.
 */
export interface KeyCodeEntry {
  /**
   * The platform-specific key name (e.g. VK_MENU, kVK_Option, Qt::Key_Alt, KEYCODE_ALT_LEFT).
   */
  name: string;
  /**
   * The virtual key code, typically a hex string (e.g. 0x12) or decimal number.
   */
  code: string;
}

export const KEYBOARD_KEYS: KeyboardKeys = (KeyboardKeysJson as any).keys as KeyboardKeys;

export const MODIFIER_KEYS: KeyboardKey[] = ['Control', 'Alt', 'Shift', 'Meta', 'Fn'] as const;

/**
 * Common alternative names / aliases for keyboard keys.
 */
export const ALTERNATIVE_NAMES: Record<KeyboardKey, string[]> = {
  // Modifier keys
  Alt: ['Option'],
  AltGraph: ['AltGr'],
  CapsLock: ['Caps'],
  Control: ['Ctrl', '^'],
  Meta: ['Command', 'Cmd', 'Windows', 'Win', '⊞'],

  NumLock: ['Num'],
  ScrollLock: ['ScrLk'],

  // Whitespace keys
  Enter: ['Return', '⏎'],
  ' ': ['Space', 'Spacebar'],

  // Navigation keys
  ArrowDown: ['Down'],
  ArrowLeft: ['Left'],
  ArrowRight: ['Right'],
  ArrowUp: ['Up'],

  PageDown: ['PgDn'],
  PageUp: ['PgUp'],

  // Editing keys
  Backspace: ['Bksp'],
  Delete: ['Del'],
  Insert: ['Ins'],

  // Function keys
  F1: ['Fn1'],
  F2: ['Fn2'],
  F3: ['Fn3'],
  F4: ['Fn4'],
  F5: ['Fn5'],
  F6: ['Fn6'],
  F7: ['Fn7'],
  F8: ['Fn8'],
  F9: ['Fn9'],
  F10: ['Fn10'],
  F11: ['Fn11'],
  F12: ['Fn12'],
  F13: ['Fn13'],
  F14: ['Fn14'],
  F15: ['Fn15'],
  F16: ['Fn16'],
  F17: ['Fn17'],
  F18: ['Fn18'],
  F19: ['Fn19'],
  F20: ['Fn20'],

  // UI keys
  ContextMenu: ['Menu', 'Apps'],
  Escape: ['Esc'],
  PrintScreen: ['PrtSc', 'PrtScn', 'SysRq'],
  Pause: ['Break'],

  // Multimedia keys
  MediaFastForward: ['FastForward', 'FF'],

  MediaPlayPause: ['Play/Pause'],
  MediaRecord: ['Record', 'Rec'],
  MediaRewind: ['Rewind', 'RW'],

  MediaTrackNext: ['Next'],
  MediaTrackPrevious: ['Previous'],

  // Audio keys
  AudioVolumeMute: ['Mute'],

  // Browser keys

  BrowserForward: ['Forward'],

  BrowserRefresh: ['Refresh', 'Reload'],
  BrowserSearch: ['Search'],

  BrowserFavorites: ['Favorites', 'Bookmarks'],

  // Application keys
  LaunchCalculator: ['Calculator', 'Calc'],
  LaunchMail: ['Mail', 'Email'],
  LaunchMusicPlayer: ['Music'],
  LaunchWebBrowser: ['Browser', 'Web'],

  // Numpad keys
  Decimal: ['NumpadDecimal'],
  Multiply: ['NumpadMultiply'],
  Add: ['NumpadAdd'],
  Subtract: ['NumpadSubtract'],
  Divide: ['NumpadDivide'],
  Separator: ['NumpadSeparator'],
};

export const LOOKUP_MAP: Record<string, KeyboardKey> = Object.values(KEYBOARD_KEYS).reduce(
  (map, info) => {
    const set = (k: string) => {
      const lower = k.toLowerCase();
      if (map[lower]) {
        throw new Error(`Duplicate key mapping for "${k}": "${map[lower]}" and "${info.key}"`);
      }
      map[lower] = info.key;
    };
    set(info.key);
    if (info.unicode) set(info.unicode);
    if (info.alternativeNames) {
      for (const alt of info.alternativeNames) {
        set(alt);
      }
    }
    return map;
  },
  {} as Record<string, KeyboardKey>,
);

/**
 * Unicode symbols for common keyboard keys.
 * Sources: Unicode Technical Note #28, Apple HIG, ISO 9995-7
 */
export const UNICODE_SYMBOLS: Record<KeyboardKey, string> = {
  // Modifier keys
  Alt: '⌥',
  AltGraph: '⎇',
  CapsLock: '⇪',
  Control: '⌃',
  Meta: '⌘',
  Shift: '⇧',
  Super: '❖',
  NumLock: '⇭',
  ScrollLock: '⤓',

  // Whitespace keys
  Enter: '↵',
  Tab: '⇥',
  ' ': '␣',

  // Navigation keys
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  ArrowUp: '↑',
  End: '⇲',
  Home: '⇱',
  PageDown: '⇟',
  PageUp: '⇞',

  // Editing keys
  Backspace: '⌫',
  Clear: '⌧',
  Delete: '⌦',
  Insert: '⎀',

  // UI keys
  ContextMenu: '☰',
  Escape: '⎋',
  Help: '?⃝',
  Pause: '⎉',
  PrintScreen: '⎙',

  // Device keys
  BrightnessDown: '🔅',
  BrightnessUp: '🔆',
  Eject: '⏏',
  Power: '⏻',
  PowerOff: '⭘',

  // Multimedia keys
  ChannelDown: '⏷',
  ChannelUp: '⏶',
  MediaFastForward: '⏩',
  MediaPause: '⏸',
  MediaPlay: '▶',
  MediaPlayPause: '⏯',
  MediaRecord: '⏺',
  MediaRewind: '⏪',
  MediaStop: '⏹',
  MediaTrackNext: '⏭',
  MediaTrackPrevious: '⏮',

  // Audio keys
  AudioVolumeDown: '🔉',
  AudioVolumeMute: '🔇',
  AudioVolumeUp: '🔊',
  MicrophoneVolumeMute: '🎙',

  // Media controller keys

  // Browser keys
  BrowserBack: '⏴',
  BrowserForward: '⏵',
  BrowserHome: '⌂',
  BrowserSearch: '🔍',

  // Application keys
  Close: '✕',
  Save: '💾',
  ZoomIn: '🔎',

  // Numpad keys
  Multiply: '×',
  // Add: '+',
  Subtract: '−',
  // Divide: '÷',
  // Decimal: '.',
  // Separator: ',',
};

// Modifier bit flags (Stream Deck SDK convention)
export const MODIFIER_FLAGS: Record<KeyboardKey, number> = {
  Shift: 1,
  Control: 2,
  Alt: 4,
  Meta: 8,
  Fn: 4096,
};

/**
 * macOS ANSI keyboard virtual key codes for common characters.
 * Maps printable characters to their physical key codes on a US ANSI layout.
 * For shifted characters (e.g. '+'), maps to the unshifted physical key ('=').
 */
const MAC_ANSI_KEYCODES: Record<string, { macCode: number; qtCode: number }> = {
  // Letters
  A: { macCode: 0x00, qtCode: 65 },
  B: { macCode: 0x0b, qtCode: 66 },
  C: { macCode: 0x08, qtCode: 67 },
  D: { macCode: 0x02, qtCode: 68 },
  E: { macCode: 0x0e, qtCode: 69 },
  F: { macCode: 0x03, qtCode: 70 },
  G: { macCode: 0x05, qtCode: 71 },
  H: { macCode: 0x04, qtCode: 72 },
  I: { macCode: 0x22, qtCode: 73 },
  J: { macCode: 0x26, qtCode: 74 },
  K: { macCode: 0x28, qtCode: 75 },
  L: { macCode: 0x25, qtCode: 76 },
  M: { macCode: 0x2e, qtCode: 77 },
  N: { macCode: 0x2d, qtCode: 78 },
  O: { macCode: 0x1f, qtCode: 79 },
  P: { macCode: 0x23, qtCode: 80 },
  Q: { macCode: 0x0c, qtCode: 81 },
  R: { macCode: 0x0f, qtCode: 82 },
  S: { macCode: 0x01, qtCode: 83 },
  T: { macCode: 0x11, qtCode: 84 },
  U: { macCode: 0x20, qtCode: 85 },
  V: { macCode: 0x09, qtCode: 86 },
  W: { macCode: 0x0d, qtCode: 87 },
  X: { macCode: 0x07, qtCode: 88 },
  Y: { macCode: 0x10, qtCode: 89 },
  Z: { macCode: 0x06, qtCode: 90 },
  // Digits
  '0': { macCode: 0x1d, qtCode: 48 },
  '1': { macCode: 0x12, qtCode: 49 },
  '2': { macCode: 0x13, qtCode: 50 },
  '3': { macCode: 0x14, qtCode: 51 },
  '4': { macCode: 0x15, qtCode: 52 },
  '5': { macCode: 0x17, qtCode: 53 },
  '6': { macCode: 0x16, qtCode: 54 },
  '7': { macCode: 0x1a, qtCode: 55 },
  '8': { macCode: 0x1c, qtCode: 56 },
  '9': { macCode: 0x19, qtCode: 57 },
  // Symbols (unshifted physical key)
  '-': { macCode: 0x1b, qtCode: 45 },
  '=': { macCode: 0x18, qtCode: 61 },
  '[': { macCode: 0x21, qtCode: 91 },
  ']': { macCode: 0x1e, qtCode: 93 },
  '\\': { macCode: 0x2a, qtCode: 92 },
  ';': { macCode: 0x29, qtCode: 59 },
  "'": { macCode: 0x27, qtCode: 39 },
  '`': { macCode: 0x32, qtCode: 96 },
  ',': { macCode: 0x2b, qtCode: 44 },
  '.': { macCode: 0x2f, qtCode: 46 },
  '/': { macCode: 0x2c, qtCode: 47 },
  // Shifted characters → map to their physical (unshifted) key
  '+': { macCode: 0x18, qtCode: 61 }, // = key
  _: { macCode: 0x1b, qtCode: 45 }, // - key
  '!': { macCode: 0x12, qtCode: 49 }, // 1 key
  '@': { macCode: 0x13, qtCode: 50 }, // 2 key
  '#': { macCode: 0x14, qtCode: 51 }, // 3 key
  $: { macCode: 0x15, qtCode: 52 }, // 4 key
  '%': { macCode: 0x17, qtCode: 53 }, // 5 key
  '&': { macCode: 0x1a, qtCode: 55 }, // 7 key
  '*': { macCode: 0x1c, qtCode: 56 }, // 8 key
  '(': { macCode: 0x19, qtCode: 57 }, // 9 key
  ')': { macCode: 0x1d, qtCode: 48 }, // 0 key
  '{': { macCode: 0x21, qtCode: 91 }, // [ key
  '}': { macCode: 0x1e, qtCode: 93 }, // ] key
  '|': { macCode: 0x2a, qtCode: 92 }, // \ key
  ':': { macCode: 0x29, qtCode: 59 }, // ; key
  '"': { macCode: 0x27, qtCode: 39 }, // ' key
  '~': { macCode: 0x32, qtCode: 96 }, // ` key
  '<': { macCode: 0x2b, qtCode: 44 }, // , key
  '>': { macCode: 0x2f, qtCode: 46 }, // . key
  '?': { macCode: 0x2c, qtCode: 47 }, // / key
};

/**
 * Convert a hex string
 *
 * @example
 *   0x01000022 -> 16777250
 */
export function parseHex(code: string): number {
  return parseInt(code, 16);
}

export function generateHotkey(hotkey: NormalizedHotkey): Hotkey {
  const { modifiers, key } = hotkey;

  // Generate key modifiers inline
  const keyModifiers = modifiers.reduce((flags, modifier) => {
    return flags | (MODIFIER_FLAGS[modifier] || 0);
  }, 0);

  // Generate key codes from available data
  const keyMapping = key ? KEYBOARD_KEYS[key] : null;
  const charCodes =
    key?.length === 1 ? (MAC_ANSI_KEYCODES[key.toUpperCase()] ?? MAC_ANSI_KEYCODES[key]) : null;

  let nativeCode: number;
  let qtKeyCode: number;
  let vKeyCode: number;

  if (!key) {
    // Modifier-only: no key pressed
    nativeCode = -1;
    qtKeyCode = 33554431;
    vKeyCode = -1;
  } else if (keyMapping?.mac?.code) {
    // Named key in JSON with mac code
    nativeCode = parseHex(keyMapping.mac.code);
    qtKeyCode = keyMapping.qt?.code ? parseHex(keyMapping.qt.code) : 33554431;
    vKeyCode = nativeCode;
  } else if (charCodes) {
    // Single character with known macOS ANSI keycode
    nativeCode = charCodes.macCode;
    qtKeyCode = charCodes.qtCode;
    vKeyCode = charCodes.macCode;
  } else {
    // Fallback for unknown keys
    nativeCode = key.length === 1 ? 0 : -1;
    qtKeyCode = key.length === 1 ? key.charCodeAt(0) : 33554431;
    vKeyCode = key.length === 1 ? 0 : -1;
  }

  return {
    KeyCmd: modifiers.includes('Meta'),
    KeyCtrl: modifiers.includes('Control'),
    KeyModifiers: keyModifiers,
    KeyOption: modifiers.includes('Alt'),
    KeyShift: modifiers.includes('Shift'),
    NativeCode: nativeCode,
    QTKeyCode: qtKeyCode,
    VKeyCode: vKeyCode,
  };
}

export function generateHotkeys(hotkey: NormalizedHotkey): Hotkey[] {
  // First hotkey contains the actual key combination
  const mainHotkey = generateHotkey(hotkey);

  // Remaining 3 hotkeys are empty placeholders
  const emptyHotkey: Hotkey = {
    KeyCmd: false,
    KeyCtrl: false,
    KeyModifiers: 0,
    KeyOption: false,
    KeyShift: false,
    NativeCode: -1,
    QTKeyCode: 33554431,
    VKeyCode: -1,
  };

  return [mainHotkey, emptyHotkey, emptyHotkey, emptyHotkey];
}
