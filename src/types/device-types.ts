export const DEVICES = {
  mk: {
    name: 'Stream Deck',
    model: '20GBA9901',
    rows: 3,
    columns: 5,
  },
  xl: {
    name: 'Stream Deck XL',
    model: '20GAT9901',
    rows: 4,
    columns: 8,
  },
  mini: {
    name: 'Stream Deck Mini',
    model: '20GAI9901',
    rows: 2,
    columns: 3,
  },
  plus: {
    name: 'Stream Deck +',
    model: '20GBD9901',
    rows: 2,
    columns: 4,
  },
  neo: {
    name: 'Stream Deck Neo',
    model: '20GBJ9901',
    rows: 2,
    columns: 4,
  },
  mobile: {
    name: 'Stream Deck Mobile',
    model: 'VSD/WiFi',
    rows: 3,
    columns: 5,
  },
} as const;

export type DeviceId = keyof typeof DEVICES;
export type Device = typeof DEVICES[DeviceId];