import { describe, expect, test } from 'bun:test';
import { formatHotkeyCommand } from './keyboard-utils';

describe('keyboard-utils', () => {
describe('formatHotkeyCommand', () => {
    test('replaces Control with ⌃', () => {
      const result = formatHotkeyCommand('Control+C');
      expect(result).toBe('⌃+C');
    });

    test('replaces Ctrl with ⌃', () => {
      const result = formatHotkeyCommand('Ctrl+C');
      expect(result).toBe('⌃+C');
    });

    test('replaces Option with ⌥', () => {
      const result = formatHotkeyCommand('Option+H');
      expect(result).toBe('⌥+H');
    });

    test('replaces Alt with ⌥', () => {
      const result = formatHotkeyCommand('Alt+H');
      expect(result).toBe('⌥+H');
    });

    test('replaces Shift with ⇧', () => {
      const result = formatHotkeyCommand('Shift+N');
      expect(result).toBe('⇧+N');
    });

    test('replaces Command with ⌘', () => {
      const result = formatHotkeyCommand('Command+S');
      expect(result).toBe('⌘+S');
    });

    test('replaces Cmd with ⌘', () => {
      const result = formatHotkeyCommand('Cmd+S');
      expect(result).toBe('⌘+S');
    });

    test('replaces multiple modifiers', () => {
      const result = formatHotkeyCommand('Control+Shift+V');
      expect(result).toBe('⌃+⇧+V');
    });

    test('replaces all modifiers', () => {
      const result = formatHotkeyCommand('Control+Option+Shift+Command+P');
      expect(result).toBe('⌃+⌥+⇧+⌘+P');
    });

    test('handles case insensitive replacement', () => {
      const result = formatHotkeyCommand('CTRL+SHIFT+A');
      expect(result).toBe('⌃+⇧+A');
    });
  });
});
