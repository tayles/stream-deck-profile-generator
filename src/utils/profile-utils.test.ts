import { describe, expect, test } from 'bun:test';
import { generateHotkeys } from './profile-utils';

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
});
