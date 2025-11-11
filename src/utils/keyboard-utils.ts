// Key mappings for macOS virtual key codes
export const KEY_MAPPINGS = {
  // Letters (uppercase)
  A: { vKey: 0, qtKey: 65, nativeCode: 0 },
  B: { vKey: 11, qtKey: 66, nativeCode: 11 },
  C: { vKey: 8, qtKey: 67, nativeCode: 8 },
  D: { vKey: 2, qtKey: 68, nativeCode: 2 },
  E: { vKey: 14, qtKey: 69, nativeCode: 14 },
  F: { vKey: 3, qtKey: 70, nativeCode: 3 },
  G: { vKey: 5, qtKey: 71, nativeCode: 5 },
  H: { vKey: 4, qtKey: 72, nativeCode: 4 },
  I: { vKey: 34, qtKey: 73, nativeCode: 34 },
  J: { vKey: 38, qtKey: 74, nativeCode: 38 },
  K: { vKey: 40, qtKey: 75, nativeCode: 40 },
  L: { vKey: 37, qtKey: 76, nativeCode: 37 },
  M: { vKey: 46, qtKey: 77, nativeCode: 46 },
  N: { vKey: 45, qtKey: 78, nativeCode: 45 },
  O: { vKey: 31, qtKey: 79, nativeCode: 31 },
  P: { vKey: 35, qtKey: 80, nativeCode: 35 },
  Q: { vKey: 12, qtKey: 81, nativeCode: 12 },
  R: { vKey: 15, qtKey: 82, nativeCode: 15 },
  S: { vKey: 1, qtKey: 83, nativeCode: 1 },
  T: { vKey: 17, qtKey: 84, nativeCode: 17 },
  U: { vKey: 32, qtKey: 85, nativeCode: 32 },
  V: { vKey: 9, qtKey: 86, nativeCode: 9 },
  W: { vKey: 13, qtKey: 87, nativeCode: 13 },
  X: { vKey: 7, qtKey: 88, nativeCode: 7 },
  Y: { vKey: 16, qtKey: 89, nativeCode: 16 },
  Z: { vKey: 6, qtKey: 90, nativeCode: 6 },

  // Numbers
  '0': { vKey: 29, qtKey: 48, nativeCode: 29 },
  '1': { vKey: 18, qtKey: 49, nativeCode: 18 },
  '2': { vKey: 19, qtKey: 50, nativeCode: 19 },
  '3': { vKey: 20, qtKey: 51, nativeCode: 20 },
  '4': { vKey: 21, qtKey: 52, nativeCode: 21 },
  '5': { vKey: 23, qtKey: 53, nativeCode: 23 },
  '6': { vKey: 22, qtKey: 54, nativeCode: 22 },
  '7': { vKey: 26, qtKey: 55, nativeCode: 26 },
  '8': { vKey: 28, qtKey: 56, nativeCode: 28 },
  '9': { vKey: 25, qtKey: 57, nativeCode: 25 },

  // Special characters and punctuation
  SPACE: { vKey: 49, qtKey: 32, nativeCode: 49 },
  ' ': { vKey: 49, qtKey: 32, nativeCode: 49 },
  TAB: { vKey: 48, qtKey: 16777217, nativeCode: 48 },
  '⇥': { vKey: 48, qtKey: 16777217, nativeCode: 48 },
  RETURN: { vKey: 36, qtKey: 16777220, nativeCode: 36 },
  ENTER: { vKey: 36, qtKey: 16777220, nativeCode: 36 },
  '⏎': { vKey: 36, qtKey: 16777220, nativeCode: 36 },
  DELETE: { vKey: 51, qtKey: 16777219, nativeCode: 51 },
  BACKSPACE: { vKey: 51, qtKey: 16777219, nativeCode: 51 },
  '⌫': { vKey: 51, qtKey: 16777219, nativeCode: 51 },
  ESCAPE: { vKey: 53, qtKey: 16777216, nativeCode: 53 },
  ESC: { vKey: 53, qtKey: 16777216, nativeCode: 53 },
  CAPSLOCK: { vKey: 57, qtKey: 16777252, nativeCode: 57 },
  '⇪': { vKey: 57, qtKey: 16777252, nativeCode: 57 },

  // Punctuation and symbols
  '-': { vKey: 27, qtKey: 45, nativeCode: 27 },
  '=': { vKey: 24, qtKey: 61, nativeCode: 24 },
  '+': { vKey: 24, qtKey: 61, nativeCode: 24 }, // Plus is Shift+= but uses same key code as =
  '[': { vKey: 33, qtKey: 91, nativeCode: 33 },
  ']': { vKey: 30, qtKey: 93, nativeCode: 30 },
  '\\': { vKey: 42, qtKey: 92, nativeCode: 42 },
  ';': { vKey: 41, qtKey: 59, nativeCode: 41 },
  "'": { vKey: 39, qtKey: 39, nativeCode: 39 },
  '`': { vKey: 50, qtKey: 96, nativeCode: 50 },
  ',': { vKey: 43, qtKey: 44, nativeCode: 43 },
  '.': { vKey: 47, qtKey: 46, nativeCode: 47 },
  '/': { vKey: 44, qtKey: 47, nativeCode: 44 },

  // Arrow keys
  LEFT: { vKey: 123, qtKey: 16777234, nativeCode: 123 },
  '←': { vKey: 123, qtKey: 16777234, nativeCode: 123 },
  RIGHT: { vKey: 124, qtKey: 16777236, nativeCode: 124 },
  '→': { vKey: 124, qtKey: 16777236, nativeCode: 124 },
  UP: { vKey: 126, qtKey: 16777235, nativeCode: 126 },
  '↑': { vKey: 126, qtKey: 16777235, nativeCode: 126 },
  DOWN: { vKey: 125, qtKey: 16777237, nativeCode: 125 },
  '↓': { vKey: 125, qtKey: 16777237, nativeCode: 125 },

  // Function keys
  F1: { vKey: 122, qtKey: 16777264, nativeCode: 122 },
  F2: { vKey: 120, qtKey: 16777265, nativeCode: 120 },
  F3: { vKey: 99, qtKey: 16777266, nativeCode: 99 },
  F4: { vKey: 118, qtKey: 16777267, nativeCode: 118 },
  F5: { vKey: 96, qtKey: 16777268, nativeCode: 96 },
  F6: { vKey: 97, qtKey: 16777269, nativeCode: 97 },
  F7: { vKey: 98, qtKey: 16777270, nativeCode: 98 },
  F8: { vKey: 100, qtKey: 16777271, nativeCode: 100 },
  F9: { vKey: 101, qtKey: 16777272, nativeCode: 101 },
  F10: { vKey: 109, qtKey: 16777273, nativeCode: 109 },
  F11: { vKey: 103, qtKey: 16777274, nativeCode: 103 },
  F12: { vKey: 111, qtKey: 16777275, nativeCode: 111 },

  // Keypad numbers
  KP0: { vKey: 82, qtKey: 16777264, nativeCode: 82 },
  KP1: { vKey: 83, qtKey: 16777265, nativeCode: 83 },
  KP2: { vKey: 84, qtKey: 16777266, nativeCode: 84 },
  KP3: { vKey: 85, qtKey: 16777267, nativeCode: 85 },
  KP4: { vKey: 86, qtKey: 16777268, nativeCode: 86 },
  KP5: { vKey: 87, qtKey: 16777269, nativeCode: 87 },
  KP6: { vKey: 88, qtKey: 16777270, nativeCode: 88 },
  KP7: { vKey: 89, qtKey: 16777271, nativeCode: 89 },
  KP8: { vKey: 91, qtKey: 16777272, nativeCode: 91 },
  KP9: { vKey: 92, qtKey: 16777273, nativeCode: 92 },

  // Additional special keys
  HOME: { vKey: 115, qtKey: 16777232, nativeCode: 115 },
  END: { vKey: 119, qtKey: 16777233, nativeCode: 119 },
  PAGEUP: { vKey: 116, qtKey: 16777238, nativeCode: 116 },
  PAGEDOWN: { vKey: 121, qtKey: 16777239, nativeCode: 121 },
  HELP: { vKey: 114, qtKey: 16777304, nativeCode: 114 },

  // Common key name aliases
  PGUP: { vKey: 116, qtKey: 16777238, nativeCode: 116 },
  PGDN: { vKey: 121, qtKey: 16777239, nativeCode: 121 },
  DEL: { vKey: 51, qtKey: 16777219, nativeCode: 51 },
  BS: { vKey: 51, qtKey: 16777219, nativeCode: 51 },
  RET: { vKey: 36, qtKey: 16777220, nativeCode: 36 },
};

// Modifier mappings with symbols and aliases
export const MODIFIER_MAPPINGS = {
  // Control symbols and aliases
  '⌃': 'ctrl',
  CTRL: 'ctrl',
  CONTROL: 'ctrl',

  // Option/Alt symbols and aliases
  '⌥': 'option',
  OPT: 'option',
  OPTION: 'option',
  ALT: 'option',

  // Shift symbols and aliases
  '⇧': 'shift',
  SHIFT: 'shift',

  // Command symbols and aliases
  '⌘': 'cmd',
  CMD: 'cmd',
  COMMAND: 'cmd',
};

// Modifier bit flags
export const MODIFIER_FLAGS = {
  ctrl: 1,
  option: 2,
  shift: 4,
  cmd: 8,
};

export function formatHotkeyCommand(hotkey: string): string {
  return hotkey
    .replace(/\bControl\b/gi, '⌃')
    .replace(/\bCtrl\b/gi, '⌃')
    .replace(/\bOption\b/gi, '⌥')
    .replace(/\bAlt\b/gi, '⌥')
    .replace(/\bShift\b/gi, '⇧')
    .replace(/\bCommand\b/gi, '⌘')
    .replace(/\bCmd\b/gi, '⌘')
    .replace(/\bEnter\b/gi, '⏎')
    .replace(/\bReturn\b/gi, '⏎')
    .replace(/\bBackspace\b/gi, '⌫')
    .replace(/\bTab\b/gi, '⇥')
    .replace(/\bCaps Lock\b/gi, '⇪')
    .replace(/\bLeft\b/gi, '←')
    .replace(/\bRight\b/gi, '→')
    .replace(/\bUp\b/gi, '↑')
    .replace(/\bDown\b/gi, '↓');
}
