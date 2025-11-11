import { DEVICES, type DeviceId } from '../types/device-types';
import type { Action, Hotkey, PageManifest, RootManifest } from '../types/manifest-types';
import type { HotkeyDescriptor, LabelPosition, LabelStyle } from '../types/types';
import { generateLabel, generateUUID } from './hotkey-utils';

// Key mappings for macOS virtual key codes
const KEY_MAPPINGS = {
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
  RETURN: { vKey: 36, qtKey: 16777220, nativeCode: 36 },
  ENTER: { vKey: 36, qtKey: 16777220, nativeCode: 36 },
  DELETE: { vKey: 51, qtKey: 16777219, nativeCode: 51 },
  BACKSPACE: { vKey: 51, qtKey: 16777219, nativeCode: 51 },
  ESCAPE: { vKey: 53, qtKey: 16777216, nativeCode: 53 },
  ESC: { vKey: 53, qtKey: 16777216, nativeCode: 53 },

  // Punctuation and symbols
  '-': { vKey: 27, qtKey: 45, nativeCode: 27 },
  '=': { vKey: 24, qtKey: 61, nativeCode: 24 },
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
  RIGHT: { vKey: 124, qtKey: 16777236, nativeCode: 124 },
  UP: { vKey: 126, qtKey: 16777235, nativeCode: 126 },
  DOWN: { vKey: 125, qtKey: 16777237, nativeCode: 125 },

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
const MODIFIER_MAPPINGS = {
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
const MODIFIER_FLAGS = {
  ctrl: 1,
  option: 2,
  shift: 4,
  cmd: 8,
};

export function generateProfileFolderId(profileId: string): string {
  return (
    (
      (profileId.replace(/-/g, '') + '000') // remove hyphens and pad length to be divisible by 5 bits
        .match(/.{5}/g) || []
    ) // split into groups of 5 digits, since JS can't represent integers larger than 53 bits
      .map(s => parseInt(s, 16).toString(32).padStart(4, '0')) // convert to base32
      .join('')
      .substring(0, 26) // remove padding we added earlier
      .toUpperCase()
      .replace(/V/g, 'W')
      .replace(/U/g, 'V') + 'Z'
  ); // all folder ids end in this suffix
}

/**
 * Attempt to decode a profile folder ID back into its original UUID.
 * @deprecated
 */
export function decodeProfileFolderId(folderId: string): string {
  const base32 = folderId
    .slice(0, -1) // remove trailing 'Z'
    .replace(/W/g, 'V')
    .replace(/V/g, 'U')
    .toLowerCase();

  const hex = (base32.match(/.{4}/g) || [])
    .map(s => parseInt(s, 32).toString(16).padStart(5, '0')) // convert back to hex
    .join('')
    .slice(0, -3); // remove padding

  return (
    hex
      .match(/.{8}|.{4}|.{4}|.{4}|.{12}/g) // split into UUID sections
      ?.join('-') || ''
  );
}

export function generatePageId(): string {
  return '';
}

export function generateRootManifest(
  name: string,
  pageIds: string[],
  pinnedPageId: string,
  deviceId: DeviceId,
  appId?: string,
): RootManifest {
  const model = DEVICES[deviceId].model;
  return {
    AppIdentifier: appId,
    Device: {
      Model: model,
      UUID: '',
    },
    Name: name,
    Pages: {
      Current: pageIds[0]!,
      Default: pinnedPageId,
      Pages: pageIds,
    },
    Version: '2.0',
  };
}

export function generatePageManifest(
  name: string,
  hotkeys: HotkeyDescriptor[],
  rows: number = 3,
  cols: number = 5,
  fontSize: number = 14,
  textColor: string = '#ffffff',
  labelStyle: LabelStyle = 'both',
  labelPosition: LabelPosition = 'middle',
): PageManifest {
  const actions: { [key: string]: Action } = {};
  hotkeys.forEach((hotkey, index) => {
    const action = generateActionFromHotkeyDescriptor(
      hotkey,
      fontSize,
      textColor,
      labelStyle,
      labelPosition,
    );
    const coords = generateCoordinates(Math.floor(index / cols), index % cols);
    actions[coords] = action;
  });

  return {
    Controllers: [
      {
        Actions: actions,
        Type: 'Keypad',
      },
    ],
    Icon: '',
    Name: name,
  };
}

/**
 * Display navigation buttons in the bottom right corner
 */
export function generatePinnedPageManifest(
  showPrevious: boolean = true,
  showNext: boolean = true,
  rows: number = 3,
  cols: number = 5,
): PageManifest {
  const actions: { [key: string]: Action } = {};
  if (showPrevious) {
    const prevButtonCoords = generateCoordinates(rows - 1, cols - 2);

    actions[prevButtonCoords] = {
      ActionID: generateUUID('previous-page'),
      LinkedTitle: true,
      Name: 'Previous Page',
      Plugin: {
        Name: 'Pages',
        UUID: 'com.elgato.streamdeck.page',
        Version: '1.0',
      },
      Settings: {},
      State: 0,
      States: [{}],
      UUID: 'com.elgato.streamdeck.page.previous',
    };
  }
  if (showNext) {
    const nextButtonCoords = generateCoordinates(rows - 1, cols - 1);

    actions[nextButtonCoords] = {
      ActionID: generateUUID('next-page'),
      LinkedTitle: true,
      Name: 'Next Page',
      Plugin: {
        Name: 'Pages',
        UUID: 'com.elgato.streamdeck.page',
        Version: '1.0',
      },
      Settings: {},
      State: 0,
      States: [{}],
      UUID: 'com.elgato.streamdeck.page.next',
    };
  }

  return {
    Controllers: [
      {
        Actions: actions,
        Type: 'Keypad',
      },
    ],
    Icon: '',
    Name: '',
  };
}

export function generateActionFromHotkeyDescriptor(
  hotkey: HotkeyDescriptor,
  fontSize: number = 14,
  textColor: string = '#ffffff',
  labelStyle: LabelStyle = 'both',
  labelPosition: LabelPosition = 'middle',
): Action {
  const hotkeys = generateHotkeys(hotkey.hotkey);
  return {
    ActionID: generateUUID(hotkey.id),
    LinkedTitle: true,
    Name: 'Hotkey',
    Plugin: {
      Name: 'Activate a Key Command',
      UUID: 'com.elgato.streamdeck.system.hotkey',
      Version: '1.0',
    },
    Settings: {
      Coalesce: true,
      Hotkeys: hotkeys,
    },
    State: 0,
    States: [
      {
        FontFamily: '',
        FontSize: fontSize,
        FontStyle: '',
        FontUnderline: false,
        Image: `Images/${hotkey.id}.png`,
        OutlineThickness: 2,
        ShowTitle: labelStyle !== 'none',
        Title: generateLabel(hotkey.label, hotkey.hotkey, labelStyle),
        TitleAlignment: labelPosition,
        TitleColor: textColor,
      },
    ],
    UUID: 'com.elgato.streamdeck.system.hotkey',
  };
}

export function generateHotkeys(hotkey: string): Hotkey[] {
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

export function generateHotkey(hotkey: string): Hotkey {
  // Parse hotkey string inline
  const parts = hotkey
    .trim()
    .split(/\s+/)
    .map(part => part.trim());
  const modifiers: string[] = [];
  let key: string | null = null;

  for (const part of parts) {
    // Check for modifiers first (case-insensitive)
    const upperPart = part.toUpperCase();
    const normalizedModifier = MODIFIER_MAPPINGS[upperPart as keyof typeof MODIFIER_MAPPINGS];
    if (normalizedModifier) {
      modifiers.push(normalizedModifier);
    } else {
      // Check for keys - try original case first, then uppercase
      if (KEY_MAPPINGS[part as keyof typeof KEY_MAPPINGS]) {
        key = part;
      } else if (KEY_MAPPINGS[upperPart as keyof typeof KEY_MAPPINGS]) {
        key = upperPart;
      }
      // For single letters, convert to uppercase for consistency
      else if (part.length === 1 && /[a-zA-Z]/.test(part)) {
        key = part.toUpperCase();
      }
    }
  }

  // Generate key modifiers inline
  const keyModifiers = modifiers.reduce((flags, modifier) => {
    return flags | (MODIFIER_FLAGS[modifier as keyof typeof MODIFIER_FLAGS] || 0);
  }, 0);

  // Generate key codes inline
  const keyMapping = key ? KEY_MAPPINGS[key as keyof typeof KEY_MAPPINGS] : null;
  const nativeCode = keyMapping?.nativeCode ?? -1;
  const qtKeyCode = keyMapping?.qtKey ?? 33554431;
  const vKeyCode = keyMapping?.vKey ?? -1;

  return {
    KeyCmd: modifiers.includes('cmd'),
    KeyCtrl: modifiers.includes('ctrl'),
    KeyModifiers: keyModifiers,
    KeyOption: modifiers.includes('option'),
    KeyShift: modifiers.includes('shift'),
    NativeCode: nativeCode,
    QTKeyCode: qtKeyCode,
    VKeyCode: vKeyCode,
  };
}

export function generateCoordinates(row: number, column: number): string {
  return `${column},${row}`;
}
