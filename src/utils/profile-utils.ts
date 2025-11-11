import type { DeviceId } from '../types/device-types';
import type { Action, Hotkey, PageManifest, RootManifest } from '../types/manifest-types';
import type { HotkeyDescriptor, LabelPosition, LabelStyle } from '../types/types';
import { generateLabel, generateUUID } from './hotkey-utils';

export function generateProfileFolderId(profileId: string): string {
  return ((profileId.replace(/-/g, '')+'000') // remove hyphens and pad length to be divisible by 5 bits
    .match(/.{5}/g) || []) // split into groups of 5 digits, since JS can't represent integers larger than 53 bits
    .map(s => parseInt(s, 16).toString(32).padStart(4, '0')) // convert to base32
    .join('')
    .substring(0, 26) // remove padding we added earlier
    .toUpperCase()
    .replace(/V/g, 'W')
    .replace(/U/g, 'V')
    +'Z' // all folder ids end in this suffix
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
  return {
    AppIdentifier: appId,
    Device: {
      Model: deviceId,
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

export function generatePageManifest(name: string, hotkeys: HotkeyDescriptor[]): PageManifest {
  const actions: { [key: string]: Action } = {};
  hotkeys.forEach((hotkey, index) => {
    const action = generateActionFromHotkeyDescriptor(hotkey);
    const coords = generateCoordinates(Math.floor(index / 3), index % 3);
    actions[coords] = action;
  });

  return {
    Name: name,
    Icon: '',
    Controllers: [
      {
        Actions: actions,
        Type: 'Keypad',
      },
    ],
  };
}

export function generatePinnedPageManifest(): PageManifest {
  return {
    Name: '',
    Icon: '',
    Controllers: [
      {
        Actions: {
          '4,0': {
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
          },
          '4,2': {
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
          },
        },
        Type: 'Keypad',
      },
    ],
  };
}

export function generateActionFromHotkeyDescriptor(hotkey: HotkeyDescriptor, fontSize: number = 14, labelStyle: LabelStyle = 'both', labelPosition: LabelPosition = 'middle'): Action {
  const hotkeys = generateHotkeys(hotkey.hotkey);
  return {
    ActionID: hotkey.id,
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
        TitleColor: '#ffffff',
      },
    ],
    UUID: 'com.elgato.streamdeck.system.hotkey',
  };
}

export function generateHotkeys(hotkey: string): Hotkey[] {
  return [];
}

export function generateCoordinates(row: number, column: number): string {
  return `${row},${column}`;
}