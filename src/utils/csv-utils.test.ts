import { describe, expect, test } from 'bun:test';

import { parseCsv } from './csv-utils';

describe('csv-utils', () => {
  describe('parseCsv', () => {
    test('parses basic CSV with all columns', () => {
      const csv = `Hotkey,Label,Page,Id,Color
Ctrl+C,Copy,Edit,copy,red
Ctrl+V,Paste,Edit,paste,blue`;

      const result = parseCsv(csv);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        hotkey: 'Ctrl+C',
        label: 'Copy',
        page: 'Edit',
        id: 'copy',
        color: 'red',
      });
      expect(result[1]).toEqual({
        hotkey: 'Ctrl+V',
        label: 'Paste',
        page: 'Edit',
        id: 'paste',
        color: 'blue',
      });
    });

    test('parses CSV with only required columns', () => {
      const csv = `Hotkey,Label
Ctrl+C,Copy
Ctrl+V,Paste`;

      const result = parseCsv(csv);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        hotkey: 'Ctrl+C',
        label: 'Copy',
      });
    });

    test('handles case-insensitive headers', () => {
      const csv = `HOTKEY,LABEL,PAGE
Ctrl+C,Copy,Edit`;

      const result = parseCsv(csv);

      expect(result).toHaveLength(1);
      expect(result[0]!.hotkey).toBe('Ctrl+C');
    });

    test('handles mixed order headers', () => {
      const csv = `Label,Hotkey,Color
Copy,Ctrl+C,red`;

      const result = parseCsv(csv);

      expect(result[0]).toEqual({
        hotkey: 'Ctrl+C',
        label: 'Copy',
        color: 'red',
      });
    });

    test('handles quoted values with commas', () => {
      const csv = `Hotkey,Label
Ctrl+C,"Copy, Paste"`;

      const result = parseCsv(csv);

      expect(result[0]!.label).toBe('Copy, Paste');
    });

    test('handles escaped quotes', () => {
      const csv = `Hotkey,Label
Ctrl+C,"Say ""Hello""" `;

      const result = parseCsv(csv);

      expect(result[0]!.label).toBe('"Say "Hello""');
    });

    test('skips empty lines', () => {
      const csv = `Hotkey,Label

Ctrl+C,Copy

Ctrl+V,Paste
`;

      const result = parseCsv(csv);

      expect(result).toHaveLength(2);
    });

    test('throws error for empty CSV', () => {
      expect(() => parseCsv('')).toThrow('CSV file is empty');
    });

    test('throws error for missing Hotkey column', () => {
      const csv = `Label,Page
Copy,Edit`;

      expect(() => parseCsv(csv)).toThrow('CSV must have a "Hotkey" column');
    });

    test('throws error for missing Label column', () => {
      const csv = `Hotkey,Page
Ctrl+C,Edit`;

      expect(() => parseCsv(csv)).toThrow('CSV must have a "Label" column');
    });

    test('throws error for missing required field value', () => {
      const csv = `Hotkey,Label
,Copy`;

      expect(() => parseCsv(csv)).toThrow('Hotkey is required');
    });

    test('throws error for column count mismatch', () => {
      const csv = `Hotkey,Label,Page
Ctrl+C,Copy`;

      expect(() => parseCsv(csv)).toThrow('Invalid Record Length');
    });

    test('handles empty optional fields', () => {
      const csv = `Hotkey,Label,Page,Id,Color
Ctrl+C,Copy,,,`;

      const result = parseCsv(csv);

      expect(result[0]).toEqual({
        hotkey: 'Ctrl+C',
        label: 'Copy',
      });
    });
  });
});
