import { describe, expect, test } from 'bun:test';
import { groupByPage } from './layout-utils';

describe('layout-utils', () => {
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

      const result = groupByPage(data, 3, 5); // 15 per page normally, but reserves space for navigation
      
      // With 20 items and 2+ pages, reserves 1 space per page for Next button
      // So 14 items per page: Page 1 has 14, Page 2 has 6
      expect(Object.keys(result)).toEqual(['Page 1', 'Page 2']);
      expect(result['Page 1']).toHaveLength(14); // 15 - 1 for Next button
      expect(result['Page 2']).toHaveLength(6); // Remaining items
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

    test('reserves space for navigation buttons with 2 pages', () => {
      // With 2 pages, should reserve 1 space for Next button
      const data = Array.from({ length: 16 }, (_, i) => ({
        hotkey: `Ctrl+${i}`,
        label: `Action ${i}`,
      }));

      const result = groupByPage(data, 3, 5); // 15 slots total
      
      // Should create 2 pages with 14 items per page (15 - 1 for Next button)
      expect(Object.keys(result)).toEqual(['Page 1', 'Page 2']);
      expect(result['Page 1']).toHaveLength(14);
      expect(result['Page 2']).toHaveLength(2);
    });

    test('reserves space for navigation buttons with 3+ pages', () => {
      // With 3+ pages, should reserve 2 spaces for Previous and Next buttons
      const data = Array.from({ length: 30 }, (_, i) => ({
        hotkey: `Ctrl+${i}`,
        label: `Action ${i}`,
      }));

      const result = groupByPage(data, 3, 5); // 15 slots total
      
      // Should create pages with 13 items per page (15 - 2 for navigation buttons)
      expect(Object.keys(result)).toEqual(['Page 1', 'Page 2', 'Page 3']);
      expect(result['Page 1']).toHaveLength(13);
      expect(result['Page 2']).toHaveLength(13);
      expect(result['Page 3']).toHaveLength(4);
    });

    test('does not reserve space for navigation with single page', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        hotkey: `Ctrl+${i}`,
        label: `Action ${i}`,
      }));

      const result = groupByPage(data, 3, 5); // 15 slots total
      
      // Single page should use full capacity
      expect(Object.keys(result)).toEqual(['Page 1']);
      expect(result['Page 1']).toHaveLength(10);
    });
  });
});
