export const DEVICES = {
  mk: {
    name: 'Stream Deck',
    model: '20GBA9901',
    rows: 3,
    columns: 5,
  },
  xl: {
    name: 'Stream Deck XL',
    model: '',
    rows: 4,
    columns: 8,
  },
  mini: {
    name: 'Stream Deck Mini',
    model: '',
    rows: 2,
    columns: 3,
  },
  plus: {
    name: 'Stream Deck +',
    model: '',
    rows: 4,
    columns: 6,
  },
  neo: {
    name: 'Stream Deck Neo',
    model: '',
    rows: 6,
    columns: 10,
  },
  mobile: {
    name: 'Stream Deck Mobile',
    model: '',
    rows: 3,
    columns: 5,
  },
} as const;

export type DeviceId = keyof typeof DEVICES;
export type Device = typeof DEVICES[DeviceId];