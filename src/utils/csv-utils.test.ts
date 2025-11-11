import { describe, expect, test } from 'bun:test';
import { parseCsv, groupByPage } from './csv-utils';

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
      
      expect(result[0]!.label).toBe('Say "Hello"');
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

      expect(() => parseCsv(csv)).toThrow('Expected 3 columns');
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

  describe('groupByPage', () => {
    test('groups by named pages', () => {
      const data = [
        { hotkey: 'Ctrl+C', label: 'Copy', page: 'Edit' },
        { hotkey: 'Ctrl+V', label: 'Paste', page: 'Edit' },
        { hotkey: 'Ctrl+F', label: 'Find', page: 'Search' },
      ];

      const result = groupByPage(data, 3, 5);
      
      expect(Object.keys(result)).toEqual(['Edit', 'Search']);
      expect(result.Edit).toHaveLength(2);
      expect(result.Search).toHaveLength(1);
    });

    test('auto-generates pages for unnamed rows', () => {
      const data = [
        { hotkey: 'Ctrl+C', label: 'Copy' },
        { hotkey: 'Ctrl+V', label: 'Paste' },
      ];

      const result = groupByPage(data, 3, 5);
      
      expect(Object.keys(result)).toEqual(['Page 1']);
      expect(result['Page 1']).toHaveLength(2);
    });

    test('splits unnamed rows into multiple pages based on size', () => {
      const data = Array.from({ length: 20 }, (_, i) => ({
        hotkey: `Ctrl+${i}`,
        label: `Action ${i}`,
      }));

      const result = groupByPage(data, 3, 5); // 15 per page
      
      expect(Object.keys(result)).toEqual(['Page 1', 'Page 2']);
      expect(result['Page 1']).toHaveLength(15);
      expect(result['Page 2']).toHaveLength(5);
    });

    test('places named pages before auto-generated pages', () => {
      const data = [
        { hotkey: 'Ctrl+C', label: 'Copy', page: 'Edit' },
        { hotkey: 'Ctrl+F', label: 'Find' },
        { hotkey: 'Ctrl+V', label: 'Paste' },
      ];

      const result = groupByPage(data, 3, 5);
      
      const pageNames = Object.keys(result);
      expect(pageNames[0]).toBe('Edit');
      expect(pageNames[1]).toBe('Page 1');
    });

    test('generates IDs for hotkeys without explicit IDs', () => {
      const data = [
        { hotkey: 'Ctrl+C', label: 'Copy' },
        { hotkey: 'Ctrl+V', label: 'Paste', id: 'custom-paste' },
      ];

      const result = groupByPage(data, 3, 5);
      
      const hotkeys = result['Page 1']!;
      expect(hotkeys[0]!.id).toBe('copy');
      expect(hotkeys[1]!.id).toBe('custom-paste');
    });

    test('preserves color in hotkey descriptors', () => {
      const data = [
        { hotkey: 'Ctrl+C', label: 'Copy', color: 'red' },
      ];

      const result = groupByPage(data, 3, 5);
      
      expect(result['Page 1']![0]!.color).toBe('red');
    });

    test('assigns sequential indices across all pages', () => {
      const data = [
        { hotkey: 'Ctrl+C', label: 'Copy', page: 'Page A' },
        { hotkey: 'Ctrl+V', label: 'Paste', page: 'Page A' },
        { hotkey: 'Ctrl+F', label: 'Find', page: 'Page B' },
      ];

      const result = groupByPage(data, 3, 5);
      
      expect(result['Page A']![0]!.index).toBe(0);
      expect(result['Page A']![1]!.index).toBe(1);
      expect(result['Page B']![0]!.index).toBe(2);
    });

    test('handles empty data', () => {
      const result = groupByPage([], 3, 5);
      expect(Object.keys(result)).toHaveLength(0);
    });
  });
});
