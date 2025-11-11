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

    test('handles plus sign as delimiter', () => {
      const result = generateHotkey('Shift+A');
      expect(result).toEqual({
        KeyCmd: false,
        KeyCtrl: false,
        KeyModifiers: 4,
        KeyOption: false,
        KeyShift: true,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('handles multiple plus signs', () => {
      const result = generateHotkey('Ctrl+Shift+C');
      expect(result).toEqual({
        KeyCmd: false,
        KeyCtrl: true,
        KeyModifiers: 5,
        KeyOption: false,
        KeyShift: true,
        NativeCode: 8,
        QTKeyCode: 67,
        VKeyCode: 8,
      });
    });

    test('handles mixed spaces and plus signs', () => {
      const result = generateHotkey('Ctrl + Shift + C');
      expect(result).toEqual({
        KeyCmd: false,
        KeyCtrl: true,
        KeyModifiers: 5,
        KeyOption: false,
        KeyShift: true,
        NativeCode: 8,
        QTKeyCode: 67,
        VKeyCode: 8,
      });
    });

    test('handles all modifiers with plus signs', () => {
      const result = generateHotkey('Ctrl+Option+Shift+Cmd+P');
      expect(result).toEqual({
        KeyCmd: true,
        KeyCtrl: true,
        KeyModifiers: 15,
        KeyOption: true,
        KeyShift: true,
        NativeCode: 35,
        QTKeyCode: 80,
        VKeyCode: 35,
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

    test('handles Unicode arrow symbols', () => {
      const left = generateHotkey('⌘ ←');
      expect(left.VKeyCode).toBe(123);
      
      const right = generateHotkey('⌘ →');
      expect(right.VKeyCode).toBe(124);
      
      const up = generateHotkey('⌘ ↑');
      expect(up.VKeyCode).toBe(126);
      
      const down = generateHotkey('⌘ ↓');
      expect(down.VKeyCode).toBe(125);
    });

    test('handles Unicode special key symbols', () => {
      const backspace = generateHotkey('⌘ ⌫');
      expect(backspace.VKeyCode).toBe(51);
      expect(backspace.QTKeyCode).toBe(16777219);
      
      const tab = generateHotkey('⌘ ⇥');
      expect(tab.VKeyCode).toBe(48);
      expect(tab.QTKeyCode).toBe(16777217);
      
      const enter = generateHotkey('⌘ ⏎');
      expect(enter.VKeyCode).toBe(36);
      expect(enter.QTKeyCode).toBe(16777220);
      
      const capslock = generateHotkey('⇪');
      expect(capslock.VKeyCode).toBe(57);
      expect(capslock.QTKeyCode).toBe(16777252);
    });

    test('handles plus key as actual key', () => {
      const plus = generateHotkey('⌘ +');
      expect(plus.KeyCmd).toBe(true);
      expect(plus.VKeyCode).toBe(24);
      expect(plus.QTKeyCode).toBe(61);
    });

    test('handles minus key', () => {
      const minus = generateHotkey('⌘ -');
      expect(minus.KeyCmd).toBe(true);
      expect(minus.VKeyCode).toBe(27);
      expect(minus.QTKeyCode).toBe(45);
    });

    test('handles plus as delimiter vs plus as key', () => {
      // Plus as delimiter
      const withDelimiter = generateHotkey('Shift+A');
      expect(withDelimiter.KeyShift).toBe(true);
      expect(withDelimiter.VKeyCode).toBe(0); // A key
      
      // Plus as actual key
      const plusKey = generateHotkey('Cmd +');
      expect(plusKey.KeyCmd).toBe(true);
      expect(plusKey.VKeyCode).toBe(24); // = key (same as +)
    });
  });
});
