import { DEVICES, type DeviceId } from '../types/device-types';
import type { Action, Hotkey, PageManifest, RootManifest } from '../types/manifest-types';
import type { HotkeyDescriptor, LabelPosition, LabelStyle } from '../types/types';
import { generateLabel, generateUUID } from './hotkey-utils';
import { MODIFIER_MAPPINGS, KEY_MAPPINGS, MODIFIER_FLAGS } from './keyboard-utils';

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

export function generateRootManifest(
  name: string,
  pageIds: string[],
  pinnedPageId: string,
  deviceId: DeviceId,
  appPath?: string,
): RootManifest {
  const model = DEVICES[deviceId].model;
  return {
    AppIdentifier: appPath,
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
        OutlineThickness: 3,
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
  // Strategy: Replace + with | only when it's between non-plus characters
  // This preserves standalone + as a key
  let normalized = hotkey.trim();

  // Split by spaces first
  const spaceParts = normalized.split(/\s+/);

  // Then process each part to handle + as delimiter
  const parts: string[] = [];
  for (const spacePart of spaceParts) {
    if (spacePart === '+') {
      // Standalone + is a key
      parts.push('+');
    } else if (spacePart.includes('+')) {
      // Split by + but only if there are other characters
      const plusParts = spacePart.split('+').filter(p => p.length > 0);
      parts.push(...plusParts);
    } else {
      parts.push(spacePart);
    }
  }

  const modifiers: string[] = [];
  let key: string | null = null;

  for (const part of parts) {
    if (!part) continue; // Skip empty parts

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
