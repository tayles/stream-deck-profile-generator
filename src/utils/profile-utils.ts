import { DEVICES, type DeviceId } from '../types/device-types';
import type { Action, PageManifest, RootManifest } from '../types/manifest-types';
import type { HotkeyDescriptor, LabelPosition, LabelStyle } from '../types/types';
import { generateLabel, generateUUID } from './hotkey-utils';
import { generateHotkeys } from './keyboard-utils';
import { normalizeHotkeyCommand } from './normalize-utils';

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
  const normalized = normalizeHotkeyCommand(hotkey.hotkey);
  const hotkeys = generateHotkeys(normalized);
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
        Title: generateLabel(hotkey.label, normalized, labelStyle),
        TitleAlignment: labelPosition,
        TitleColor: textColor,
      },
    ],
    UUID: 'com.elgato.streamdeck.system.hotkey',
  };
}

export function generateCoordinates(row: number, column: number): string {
  return `${column},${row}`;
}
