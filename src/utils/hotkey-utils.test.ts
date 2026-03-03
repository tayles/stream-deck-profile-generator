import { describe, expect, test } from 'bun:test';

import { generateId, generateLabel, generateUUID } from './hotkey-utils';
import { normalizeHotkeyCommand } from './normalize-utils';

describe('hotkey-utils', () => {
  describe('generateLabel', () => {
    test('replaces Control with ⌃', () => {
      const result = generateLabel('Copy', normalizeHotkeyCommand('Control+C'), 'both');
      expect(result).toBe('Copy\n⌃ C');
    });

    test('replaces Ctrl with ⌃', () => {
      const result = generateLabel('Copy', normalizeHotkeyCommand('Ctrl+C'), 'both');
      expect(result).toBe('Copy\n⌃ C');
    });

    test('replaces Option with ⌥', () => {
      const result = generateLabel('Hide', normalizeHotkeyCommand('Option+H'), 'both');
      expect(result).toBe('Hide\n⌥ H');
    });

    test('replaces Alt with ⌥', () => {
      const result = generateLabel('Hide', normalizeHotkeyCommand('Alt+H'), 'both');
      expect(result).toBe('Hide\n⌥ H');
    });

    test('replaces Shift with ⇧', () => {
      const result = generateLabel('New', normalizeHotkeyCommand('Shift+N'), 'both');
      expect(result).toBe('New\n⇧ N');
    });

    test('replaces Command with ⌘', () => {
      const result = generateLabel('Save', normalizeHotkeyCommand('Command+S'), 'both');
      expect(result).toBe('Save\n⌘ S');
    });

    test('replaces Cmd with ⌘', () => {
      const result = generateLabel('Save', normalizeHotkeyCommand('Cmd+S'), 'both');
      expect(result).toBe('Save\n⌘ S');
    });

    test('replaces multiple modifiers', () => {
      const result = generateLabel('Paste', normalizeHotkeyCommand('Control+Shift+V'), 'both');
      expect(result).toBe('Paste\n⌃ ⇧ V');
    });

    test('replaces all modifiers', () => {
      const result = generateLabel(
        'Test',
        normalizeHotkeyCommand('Control+Option+Shift+Command+P'),
        'both',
      );
      expect(result).toBe('Test\n⌃ ⌥ ⇧ ⌘ P');
    });

    test('handles case insensitive replacement', () => {
      const result = generateLabel('Test', normalizeHotkeyCommand('CTRL+SHIFT+A'), 'both');
      expect(result).toBe('Test\n⌃ ⇧ A');
    });

    test('handles labelStyle "none"', () => {
      const result = generateLabel('Copy', normalizeHotkeyCommand('Ctrl+C'), 'none');
      expect(result).toBe('');
    });

    test('handles labelStyle "label"', () => {
      const result = generateLabel('Copy File', normalizeHotkeyCommand('Ctrl+C'), 'label');
      expect(result).toBe('Copy\nFile');
    });

    test('handles labelStyle "hotkey"', () => {
      const result = generateLabel('Copy', normalizeHotkeyCommand('Ctrl+C'), 'hotkey');
      expect(result).toBe('⌃ C');
    });

    test('handles labelStyle "both"', () => {
      const result = generateLabel('Copy', normalizeHotkeyCommand('Ctrl+C'), 'both');
      expect(result).toBe('Copy\n⌃ C');
    });

    test('preserves already present Unicode symbols', () => {
      const result = generateLabel('Copy', normalizeHotkeyCommand('⌘+C'), 'hotkey');
      expect(result).toBe('⌘ C');
    });

    test('formats label with newlines', () => {
      const result = generateLabel('Copy File Name', normalizeHotkeyCommand('Ctrl+C'), 'label');
      expect(result).toBe('Copy\nFile\nName');
    });
  });

  describe('generateId', () => {
    test('converts to lowercase and replaces spaces with hyphens', () => {
      const result = generateId('Copy File');
      expect(result).toBe('copy-file');
    });

    test('handles multiple spaces', () => {
      const result = generateId('Open  New   Window');
      expect(result).toBe('open-new-window');
    });

    test('handles already lowercase', () => {
      const result = generateId('save');
      expect(result).toBe('save');
    });
  });

  describe('generateUUID', () => {
    test('generates consistent UUID for same seed', () => {
      const uuid1 = generateUUID('test');
      const uuid2 = generateUUID('test');
      expect(uuid1).toBe(uuid2);
    });

    test('generates different UUIDs for different seeds', () => {
      const uuid1 = generateUUID('test1');
      const uuid2 = generateUUID('test2');
      expect(uuid1).not.toBe(uuid2);
    });

    test('generates valid UUID v4 format', () => {
      const uuid = generateUUID('test');
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });
  });
});
