import { describe, expect, test } from 'bun:test';
import { generateHotkeys, generateHotkey } from './profile-utils';

describe('profile-utils', () => {
  describe('generateHotkeys', () => {
    test('for "⌃ ⌥ ⇧ ⌘ P"', () => {
      expect(generateHotkeys('⌃ ⌥ ⇧ ⌘ P')).toEqual([
        {
          KeyCmd: true,
          KeyCtrl: true,
          KeyModifiers: 15,
          KeyOption: true,
          KeyShift: true,
          NativeCode: 35,
          QTKeyCode: 80,
          VKeyCode: 35,
        },
        {
          KeyCmd: false,
          KeyCtrl: false,
          KeyModifiers: 0,
          KeyOption: false,
          KeyShift: false,
          NativeCode: -1,
          QTKeyCode: 33554431,
          VKeyCode: -1,
        },
        {
          KeyCmd: false,
          KeyCtrl: false,
          KeyModifiers: 0,
          KeyOption: false,
          KeyShift: false,
          NativeCode: -1,
          QTKeyCode: 33554431,
          VKeyCode: -1,
        },
        {
          KeyCmd: false,
          KeyCtrl: false,
          KeyModifiers: 0,
          KeyOption: false,
          KeyShift: false,
          NativeCode: -1,
          QTKeyCode: 33554431,
          VKeyCode: -1,
        },
      ]);
    });

    test('Handles aliases', () => {
      expect(generateHotkeys('Ctrl Option Shift Command P')).toEqual([
        {
          KeyCmd: true,
          KeyCtrl: true,
          KeyModifiers: 15,
          KeyOption: true,
          KeyShift: true,
          NativeCode: 35,
          QTKeyCode: 80,
          VKeyCode: 35,
        },
        {
          KeyCmd: false,
          KeyCtrl: false,
          KeyModifiers: 0,
          KeyOption: false,
          KeyShift: false,
          NativeCode: -1,
          QTKeyCode: 33554431,
          VKeyCode: -1,
        },
        {
          KeyCmd: false,
          KeyCtrl: false,
          KeyModifiers: 0,
          KeyOption: false,
          KeyShift: false,
          NativeCode: -1,
          QTKeyCode: 33554431,
          VKeyCode: -1,
        },
        {
          KeyCmd: false,
          KeyCtrl: false,
          KeyModifiers: 0,
          KeyOption: false,
          KeyShift: false,
          NativeCode: -1,
          QTKeyCode: 33554431,
          VKeyCode: -1,
        },
      ]);
    });
  });

  describe('generateHotkey', () => {
    test('handles lowercase letters', () => {
      const result = generateHotkey('⌘ a');
      expect(result).toEqual({
        KeyCmd: true,
        KeyCtrl: false,
        KeyModifiers: 8,
        KeyOption: false,
        KeyShift: false,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('handles special characters', () => {
      const result = generateHotkey('Ctrl -');
      expect(result).toEqual({
        KeyCmd: false,
        KeyCtrl: true,
        KeyModifiers: 1,
        KeyOption: false,
        KeyShift: false,
        NativeCode: 27,
        QTKeyCode: 45,
        VKeyCode: 27,
      });
    });

    test('handles function keys', () => {
      const result = generateHotkey('F1');
      expect(result).toEqual({
        KeyCmd: false,
        KeyCtrl: false,
        KeyModifiers: 0,
        KeyOption: false,
        KeyShift: false,
        NativeCode: 122,
        QTKeyCode: 16777264,
        VKeyCode: 122,
      });
    });

    test('handles arrow keys', () => {
      const result = generateHotkey('⌘ LEFT');
      expect(result).toEqual({
        KeyCmd: true,
        KeyCtrl: false,
        KeyModifiers: 8,
        KeyOption: false,
        KeyShift: false,
        NativeCode: 123,
        QTKeyCode: 16777234,
        VKeyCode: 123,
      });
    });

    test('handles space key', () => {
      const result = generateHotkey('⌘ SPACE');
      expect(result).toEqual({
        KeyCmd: true,
        KeyCtrl: false,
        KeyModifiers: 8,
        KeyOption: false,
        KeyShift: false,
        NativeCode: 49,
        QTKeyCode: 32,
        VKeyCode: 49,
      });
    });

    test('handles enter key', () => {
      const result = generateHotkey('Shift ENTER');
      expect(result).toEqual({
        KeyCmd: false,
        KeyCtrl: false,
        KeyModifiers: 4,
        KeyOption: false,
        KeyShift: true,
        NativeCode: 36,
        QTKeyCode: 16777220,
        VKeyCode: 36,
      });
    });
  });
});
