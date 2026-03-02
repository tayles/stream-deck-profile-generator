import { describe, expect, test } from 'bun:test';
import type { Hotkey } from '../types/manifest-types';
import { generateHotkey, generateHotkeys } from './keyboard-utils';
import { normalizeHotkeyCommand } from './normalize-utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function gen(raw: string): Hotkey {
  return generateHotkey(normalizeHotkeyCommand(raw));
}

const EMPTY_HOTKEY: Hotkey = {
  KeyCmd: false,
  KeyCtrl: false,
  KeyModifiers: 0,
  KeyOption: false,
  KeyShift: false,
  NativeCode: -1,
  QTKeyCode: 33554431,
  VKeyCode: -1,
};

// ---------------------------------------------------------------------------
// generateHotkey
// ---------------------------------------------------------------------------

describe('generateHotkey', () => {
  // ── Modifier-only hotkeys ────────────────────────────────────────────────

  describe('modifier-only hotkeys', () => {
    test('Meta (⌘) alone – no key', () => {
      expect(gen('⌘')).toEqual({ ...EMPTY_HOTKEY, KeyCmd: true, KeyModifiers: 8 });
    });

    test('Alt (⌥) alone – no key', () => {
      expect(gen('⌥')).toEqual({ ...EMPTY_HOTKEY, KeyOption: true, KeyModifiers: 4 });
    });

    test('Shift (⇧) alone – no key', () => {
      expect(gen('⇧')).toEqual({ ...EMPTY_HOTKEY, KeyShift: true, KeyModifiers: 1 });
    });

    test('Control (^) alone – no key', () => {
      expect(gen('^')).toEqual({ ...EMPTY_HOTKEY, KeyCtrl: true, KeyModifiers: 2 });
    });

    test('Fn alone – no key', () => {
      expect(gen('Fn')).toEqual({ ...EMPTY_HOTKEY, KeyModifiers: 4096 });
    });

    test('Meta+Alt – no key', () => {
      expect(gen('Meta Alt')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyOption: true,
        KeyModifiers: 12,
      });
    });

    test('Meta+Shift – no key', () => {
      expect(gen('Meta Shift')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyShift: true,
        KeyModifiers: 9,
      });
    });

    test('Control+Shift – no key', () => {
      expect(gen('Control Shift')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCtrl: true,
        KeyShift: true,
        KeyModifiers: 3,
      });
    });
  });

  // ── Letter keys (A–Z) ────────────────────────────────────────────────────

  describe('letter keys', () => {
    test('A alone', () => {
      expect(gen('A')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('lowercase a treated same as A', () => {
      expect(gen('a')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('uppercase A same key codes as lowercase a', () => {
      expect(gen('A').QTKeyCode).toBe(gen('a').QTKeyCode);
    });

    test('C alone', () => {
      expect(gen('C')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 8, QTKeyCode: 67, VKeyCode: 8 });
    });

    test('P alone', () => {
      expect(gen('P')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 35, QTKeyCode: 80, VKeyCode: 35 });
    });

    test('S alone', () => {
      expect(gen('S')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 1, QTKeyCode: 83, VKeyCode: 1 });
    });

    test('Z alone', () => {
      expect(gen('Z')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 6, QTKeyCode: 90, VKeyCode: 6 });
    });

    test('lowercase modifier+letter uppercases the letter key code', () => {
      // ⌘ a should use the same codes as ⌘ A
      const lower = gen('⌘ a');
      const upper = gen('⌘ A');
      expect(lower.QTKeyCode).toBe(upper.QTKeyCode);
      expect(lower.VKeyCode).toBe(upper.VKeyCode);
    });
  });

  // ── Digit keys (0–9) ─────────────────────────────────────────────────────

  describe('digit keys', () => {
    test('0 alone', () => {
      expect(gen('0')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 29, QTKeyCode: 48, VKeyCode: 29 });
    });

    test('1 alone', () => {
      expect(gen('1')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 18, QTKeyCode: 49, VKeyCode: 18 });
    });

    test('5 alone', () => {
      expect(gen('5')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 23, QTKeyCode: 53, VKeyCode: 23 });
    });

    test('9 alone', () => {
      expect(gen('9')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 25, QTKeyCode: 57, VKeyCode: 25 });
    });

    test('⌘ 1', () => {
      expect(gen('⌘ 1')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyModifiers: 8,
        NativeCode: 18,
        QTKeyCode: 49,
        VKeyCode: 18,
      });
    });
  });

  // ── Symbol / punctuation keys ────────────────────────────────────────────

  describe('symbol and punctuation keys', () => {
    test('minus –', () => {
      expect(gen('-')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 27, QTKeyCode: 45, VKeyCode: 27 });
    });

    test('equals =', () => {
      expect(gen('=')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 24, QTKeyCode: 61, VKeyCode: 24 });
    });

    test('open bracket [', () => {
      expect(gen('[')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 33, QTKeyCode: 91, VKeyCode: 33 });
    });

    test('close bracket ]', () => {
      expect(gen(']')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 30, QTKeyCode: 93, VKeyCode: 30 });
    });

    test('backslash \\', () => {
      expect(gen('\\')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 42, QTKeyCode: 92, VKeyCode: 42 });
    });

    test('semicolon ;', () => {
      expect(gen(';')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 41, QTKeyCode: 59, VKeyCode: 41 });
    });

    test("apostrophe '", () => {
      expect(gen("'")).toEqual({ ...EMPTY_HOTKEY, NativeCode: 39, QTKeyCode: 39, VKeyCode: 39 });
    });

    test('grave `', () => {
      expect(gen('`')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 50, QTKeyCode: 96, VKeyCode: 50 });
    });

    test('comma ,', () => {
      expect(gen(',')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 43, QTKeyCode: 44, VKeyCode: 43 });
    });

    test('period .', () => {
      expect(gen('.')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 47, QTKeyCode: 46, VKeyCode: 47 });
    });

    test('slash /', () => {
      expect(gen('/')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 44, QTKeyCode: 47, VKeyCode: 44 });
    });

    test('exclamation ! (shifted 1)', () => {
      expect(gen('!')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 18, QTKeyCode: 49, VKeyCode: 18 });
    });

    test('at-sign @ (shifted 2)', () => {
      expect(gen('@')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 19, QTKeyCode: 50, VKeyCode: 19 });
    });

    test('dollar $ (shifted 4)', () => {
      expect(gen('$')).toEqual({ ...EMPTY_HOTKEY, NativeCode: 21, QTKeyCode: 52, VKeyCode: 21 });
    });

    test('Ctrl+minus', () => {
      expect(gen('Ctrl -')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCtrl: true,
        KeyModifiers: 2,
        NativeCode: 27,
        QTKeyCode: 45,
        VKeyCode: 27,
      });
    });
  });

  // ── Function keys ─────────────────────────────────────────────────────────

  describe('function keys', () => {
    test.each([
      ['F1', 122, 16777264],
      ['F2', 120, 16777265],
      ['F3', 99, 16777266],
      ['F4', 118, 16777267],
      ['F5', 96, 16777268],
      ['F6', 97, 16777269],
      ['F7', 98, 16777270],
      ['F8', 100, 16777271],
      ['F9', 101, 16777272],
      ['F10', 109, 16777273],
      ['F11', 103, 16777274],
      ['F12', 111, 16777275],
    ] as const)('%s alone', (key, nativeCode, qtCode) => {
      expect(gen(key)).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: nativeCode,
        QTKeyCode: qtCode,
        VKeyCode: nativeCode,
      });
    });

    test('Fn1 alias → same codes as F1', () => {
      expect(gen('Fn1')).toEqual(gen('F1'));
    });

    test('Fn2 alias → same codes as F2', () => {
      expect(gen('Fn2')).toEqual(gen('F2'));
    });

    test('⌘ F1', () => {
      expect(gen('⌘ F1')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyModifiers: 8,
        NativeCode: 122,
        QTKeyCode: 16777264,
        VKeyCode: 122,
      });
    });

    test('Ctrl+F5', () => {
      expect(gen('Ctrl+F5')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCtrl: true,
        KeyModifiers: 2,
        NativeCode: 96,
        QTKeyCode: 16777268,
        VKeyCode: 96,
      });
    });
  });

  // ── Navigation keys ───────────────────────────────────────────────────────

  describe('navigation keys', () => {
    test('ArrowLeft (Left)', () => {
      expect(gen('Left')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 123,
        QTKeyCode: 16777234,
        VKeyCode: 123,
      });
    });

    test('ArrowRight (Right)', () => {
      expect(gen('Right')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 124,
        QTKeyCode: 16777236,
        VKeyCode: 124,
      });
    });

    test('ArrowUp (Up)', () => {
      expect(gen('Up')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 126,
        QTKeyCode: 16777235,
        VKeyCode: 126,
      });
    });

    test('ArrowDown (Down)', () => {
      expect(gen('Down')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 125,
        QTKeyCode: 16777237,
        VKeyCode: 125,
      });
    });

    test('Home', () => {
      expect(gen('Home')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 115,
        QTKeyCode: 16777232,
        VKeyCode: 115,
      });
    });

    test('End', () => {
      expect(gen('End')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 119,
        QTKeyCode: 16777233,
        VKeyCode: 119,
      });
    });

    test('PageUp', () => {
      expect(gen('PageUp')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 116,
        QTKeyCode: 16777238,
        VKeyCode: 116,
      });
    });

    test('PageDown', () => {
      expect(gen('PageDown')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 121,
        QTKeyCode: 16777239,
        VKeyCode: 121,
      });
    });

    test('⌘ Left (using LEFT alias)', () => {
      expect(gen('⌘ LEFT')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyModifiers: 8,
        NativeCode: 123,
        QTKeyCode: 16777234,
        VKeyCode: 123,
      });
    });

    test('Ctrl+ArrowDown', () => {
      expect(gen('Ctrl+ArrowDown')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCtrl: true,
        KeyModifiers: 2,
        NativeCode: 125,
        QTKeyCode: 16777237,
        VKeyCode: 125,
      });
    });

    test('Shift+Home', () => {
      expect(gen('Shift+Home')).toEqual({
        ...EMPTY_HOTKEY,
        KeyShift: true,
        KeyModifiers: 1,
        NativeCode: 115,
        QTKeyCode: 16777232,
        VKeyCode: 115,
      });
    });
  });

  // ── Editing keys ──────────────────────────────────────────────────────────

  describe('editing keys', () => {
    test('Backspace', () => {
      expect(gen('Backspace')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 51,
        QTKeyCode: 16777219,
        VKeyCode: 51,
      });
    });

    test('Delete', () => {
      expect(gen('Delete')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 117,
        QTKeyCode: 16777223,
        VKeyCode: 117,
      });
    });

    test('Escape', () => {
      expect(gen('Escape')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 53,
        QTKeyCode: 16777216,
        VKeyCode: 53,
      });
    });

    test('CapsLock (Capslock alias)', () => {
      expect(gen('Capslock')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 57,
        QTKeyCode: 16777252,
        VKeyCode: 57,
      });
    });

    test('⌘ Backspace', () => {
      expect(gen('⌘ Backspace')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyModifiers: 8,
        NativeCode: 51,
        QTKeyCode: 16777219,
        VKeyCode: 51,
      });
    });

    test('Option+Delete', () => {
      expect(gen('Option+Delete')).toEqual({
        ...EMPTY_HOTKEY,
        KeyOption: true,
        KeyModifiers: 4,
        NativeCode: 117,
        QTKeyCode: 16777223,
        VKeyCode: 117,
      });
    });
  });

  // ── Whitespace keys ───────────────────────────────────────────────────────

  describe('whitespace keys', () => {
    test('Enter (Return alias)', () => {
      expect(gen('Return')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 36,
        QTKeyCode: 16777220,
        VKeyCode: 36,
      });
    });

    test('Enter directly', () => {
      expect(gen('Enter')).toEqual(gen('Return'));
    });

    test('Tab', () => {
      expect(gen('Tab')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 48,
        QTKeyCode: 16777217,
        VKeyCode: 48,
      });
    });

    test('Space', () => {
      expect(gen('Space')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 49,
        QTKeyCode: 32,
        VKeyCode: 49,
      });
    });

    test('⌘ Space', () => {
      expect(gen('⌘ SPACE')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyModifiers: 8,
        NativeCode: 49,
        QTKeyCode: 32,
        VKeyCode: 49,
      });
    });

    test('Shift Enter', () => {
      expect(gen('Shift ENTER')).toEqual({
        ...EMPTY_HOTKEY,
        KeyShift: true,
        KeyModifiers: 1,
        NativeCode: 36,
        QTKeyCode: 16777220,
        VKeyCode: 36,
      });
    });

    test('Shift+Tab', () => {
      expect(gen('Shift+Tab')).toEqual({
        ...EMPTY_HOTKEY,
        KeyShift: true,
        KeyModifiers: 1,
        NativeCode: 48,
        QTKeyCode: 16777217,
        VKeyCode: 48,
      });
    });
  });

  // ── Single modifier + key ─────────────────────────────────────────────────

  describe('single modifier combinations', () => {
    test('⌘ A', () => {
      expect(gen('⌘ A')).toEqual({
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

    test('⌘ a (lowercase key)', () => {
      expect(gen('⌘ a')).toEqual({
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

    test('⌥ a (Alt+a)', () => {
      expect(gen('⌥ a')).toEqual({
        KeyCmd: false,
        KeyCtrl: false,
        KeyModifiers: 4,
        KeyOption: true,
        KeyShift: false,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('⇧ a (Shift+a)', () => {
      expect(gen('⇧ a')).toEqual({
        KeyCmd: false,
        KeyCtrl: false,
        KeyModifiers: 1,
        KeyOption: false,
        KeyShift: true,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('^ A (Ctrl+A)', () => {
      expect(gen('^ A')).toEqual({
        KeyCmd: false,
        KeyCtrl: true,
        KeyModifiers: 2,
        KeyOption: false,
        KeyShift: false,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('Fn A', () => {
      expect(gen('Fn A')).toEqual({
        KeyCmd: false,
        KeyCtrl: false,
        KeyModifiers: 4096,
        KeyOption: false,
        KeyShift: false,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('Shift+A (plus delimiter)', () => {
      expect(gen('Shift+A')).toEqual({
        KeyCmd: false,
        KeyCtrl: false,
        KeyModifiers: 1,
        KeyOption: false,
        KeyShift: true,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });
  });

  // ── Multiple modifier combinations ────────────────────────────────────────

  describe('multiple modifier combinations', () => {
    test('Command+Control+a → KeyModifiers=10', () => {
      expect(gen('Command Control a')).toEqual({
        KeyCmd: true,
        KeyCtrl: true,
        KeyModifiers: 10,
        KeyOption: false,
        KeyShift: false,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('Command+Option+a → KeyModifiers=12', () => {
      expect(gen('Command Option a')).toEqual({
        KeyCmd: true,
        KeyCtrl: false,
        KeyModifiers: 12,
        KeyOption: true,
        KeyShift: false,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('Option+Shift+a → KeyModifiers=5', () => {
      expect(gen('Option Shift a')).toEqual({
        KeyCmd: false,
        KeyCtrl: false,
        KeyModifiers: 5,
        KeyOption: true,
        KeyShift: true,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('Command+Shift+A → KeyModifiers=9', () => {
      expect(gen('Command Shift A')).toEqual({
        KeyCmd: true,
        KeyCtrl: false,
        KeyModifiers: 9,
        KeyOption: false,
        KeyShift: true,
        NativeCode: 0,
        QTKeyCode: 65,
        VKeyCode: 0,
      });
    });

    test('Ctrl+Shift+C → KeyModifiers=3', () => {
      expect(gen('Ctrl+Shift+C')).toEqual({
        KeyCmd: false,
        KeyCtrl: true,
        KeyModifiers: 3,
        KeyOption: false,
        KeyShift: true,
        NativeCode: 8,
        QTKeyCode: 67,
        VKeyCode: 8,
      });
    });

    test('Ctrl + Shift + C (spaces around plus)', () => {
      expect(gen('Ctrl + Shift + C')).toEqual(gen('Ctrl+Shift+C'));
    });

    test('all four modifiers + P → KeyModifiers=15', () => {
      expect(gen('Ctrl+Option+Shift+Cmd+P')).toEqual({
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
  });

  // ── Unicode key symbols ───────────────────────────────────────────────────

  describe('unicode key symbols', () => {
    test('⌘ ← (ArrowLeft)', () => {
      expect(gen('⌘ ←').VKeyCode).toBe(123);
    });

    test('⌘ → (ArrowRight)', () => {
      expect(gen('⌘ →').VKeyCode).toBe(124);
    });

    test('⌘ ↑ (ArrowUp)', () => {
      expect(gen('⌘ ↑').VKeyCode).toBe(126);
    });

    test('⌘ ↓ (ArrowDown)', () => {
      expect(gen('⌘ ↓').VKeyCode).toBe(125);
    });

    test('⌘ ⌫ (Backspace)', () => {
      expect(gen('⌘ ⌫')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyModifiers: 8,
        NativeCode: 51,
        QTKeyCode: 16777219,
        VKeyCode: 51,
      });
    });

    test('⌘ ⇥ (Tab)', () => {
      expect(gen('⌘ ⇥')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyModifiers: 8,
        NativeCode: 48,
        QTKeyCode: 16777217,
        VKeyCode: 48,
      });
    });

    test('⌘ ⏎ (Enter)', () => {
      expect(gen('⌘ ⏎')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyModifiers: 8,
        NativeCode: 36,
        QTKeyCode: 16777220,
        VKeyCode: 36,
      });
    });

    test('⇪ (CapsLock)', () => {
      expect(gen('⇪')).toEqual({
        ...EMPTY_HOTKEY,
        NativeCode: 57,
        QTKeyCode: 16777252,
        VKeyCode: 57,
      });
    });
  });

  // ── Plus key disambiguation ───────────────────────────────────────────────

  describe('plus key disambiguation', () => {
    test('⌘ + (plus as key)', () => {
      expect(gen('⌘ +')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyModifiers: 8,
        NativeCode: 24,
        QTKeyCode: 61,
        VKeyCode: 24,
      });
    });

    test('⌘ - (minus as key)', () => {
      expect(gen('⌘ -')).toEqual({
        ...EMPTY_HOTKEY,
        KeyCmd: true,
        KeyModifiers: 8,
        NativeCode: 27,
        QTKeyCode: 45,
        VKeyCode: 27,
      });
    });

    test('Shift+A – plus is delimiter, not key', () => {
      expect(gen('Shift+A').VKeyCode).toBe(0); // A key
      expect(gen('Shift+A').KeyShift).toBe(true);
    });

    test('Cmd + – same codes as ⌘ =', () => {
      expect(gen('Cmd +')).toEqual(gen('⌘ ='));
    });
  });
});

// ---------------------------------------------------------------------------
// generateHotkeys
// ---------------------------------------------------------------------------

describe('generateHotkeys', () => {
  // ── Array structure ───────────────────────────────────────────────────────

  describe('array structure', () => {
    test('always returns exactly 4 elements', () => {
      expect(generateHotkeys(normalizeHotkeyCommand('⌘ A'))).toHaveLength(4);
    });

    test('last three elements are empty placeholder hotkeys', () => {
      const result = generateHotkeys(normalizeHotkeyCommand('⌘ A'));
      expect(result[1]).toEqual(EMPTY_HOTKEY);
      expect(result[2]).toEqual(EMPTY_HOTKEY);
      expect(result[3]).toEqual(EMPTY_HOTKEY);
    });

    test('first element is the actual hotkey', () => {
      const result = generateHotkeys(normalizeHotkeyCommand('⌘ A'));
      expect(result[0]).toEqual({
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
  });

  // ── Modifier combinations ─────────────────────────────────────────────────

  describe('modifier combinations', () => {
    test('⌃ ⌥ ⇧ ⌘ P (all four modifiers, unicode)', () => {
      expect(generateHotkeys(normalizeHotkeyCommand('⌃ ⌥ ⇧ ⌘ P'))).toEqual([
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
        EMPTY_HOTKEY,
        EMPTY_HOTKEY,
        EMPTY_HOTKEY,
      ]);
    });

    test('Ctrl Option Shift Command P (all four modifiers, text aliases)', () => {
      expect(generateHotkeys(normalizeHotkeyCommand('Ctrl Option Shift Command P'))).toEqual([
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
        EMPTY_HOTKEY,
        EMPTY_HOTKEY,
        EMPTY_HOTKEY,
      ]);
    });

    test('modifier-only hotkey has first element with no key codes', () => {
      const result = generateHotkeys(normalizeHotkeyCommand('⌘'));
      expect(result[0]).toEqual({ ...EMPTY_HOTKEY, KeyCmd: true, KeyModifiers: 8 });
    });
  });
});
