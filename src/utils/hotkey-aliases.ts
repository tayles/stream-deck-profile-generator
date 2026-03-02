import type { KeyboardKey } from './keyboard-utils';

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
  Subtract: '−',
  // Add: '+',
  // Divide: '÷',
  // Decimal: '.',
  // Separator: ',',
};

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
