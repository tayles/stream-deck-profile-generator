import { describe, expect, test } from 'bun:test';
import { formatHotkeys, normalizeHotkeyCommand, type NormalizedHotkey } from './normalize-utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function norm(input: string): NormalizedHotkey {
  return normalizeHotkeyCommand(input);
}

// ---------------------------------------------------------------------------
// normalizeHotkeyCommand
// ---------------------------------------------------------------------------

describe('normalizeHotkeyCommand', () => {
  // ── Basic single keys ────────────────────────────────────────────────────

  describe('basic single keys', () => {
    test('lowercase letter', () => {
      expect(norm('a')).toEqual({ modifiers: [], key: 'a' });
    });

    test('uppercase letter', () => {
      expect(norm('A')).toEqual({ modifiers: [], key: 'A' });
    });

    test('digit', () => {
      expect(norm('1')).toEqual({ modifiers: [], key: '1' });
    });

    test('slash', () => {
      expect(norm('/')).toEqual({ modifiers: [], key: '/' });
    });

    test('dollar sign', () => {
      expect(norm('$')).toEqual({ modifiers: [], key: '$' });
    });

    test('pound sign', () => {
      expect(norm('£')).toEqual({ modifiers: [], key: '£' });
    });

    test('exclamation mark', () => {
      expect(norm('!')).toEqual({ modifiers: [], key: '!' });
    });
  });

  // ── Modifier-only hotkeys ────────────────────────────────────────────────

  describe('modifier-only hotkeys', () => {
    test('Control alone', () => {
      expect(norm('Control')).toEqual({ modifiers: ['Control'], key: '' });
    });

    test('Alt alone', () => {
      expect(norm('Alt')).toEqual({ modifiers: ['Alt'], key: '' });
    });

    test('Shift alone', () => {
      expect(norm('Shift')).toEqual({ modifiers: ['Shift'], key: '' });
    });

    test('Meta alone', () => {
      expect(norm('Meta')).toEqual({ modifiers: ['Meta'], key: '' });
    });

    test('Fn alone', () => {
      expect(norm('Fn')).toEqual({ modifiers: ['Fn'], key: '' });
    });

    test('Option alone (→ Alt)', () => {
      expect(norm('Option')).toEqual({ modifiers: ['Alt'], key: '' });
    });

    test('Cmd alone (→ Meta)', () => {
      expect(norm('Cmd')).toEqual({ modifiers: ['Meta'], key: '' });
    });

    test('⌘ alone', () => {
      expect(norm('⌘')).toEqual({ modifiers: ['Meta'], key: '' });
    });

    test('⌥ alone', () => {
      expect(norm('⌥')).toEqual({ modifiers: ['Alt'], key: '' });
    });

    test('⇧ alone', () => {
      expect(norm('⇧')).toEqual({ modifiers: ['Shift'], key: '' });
    });

    test('⌃ alone', () => {
      expect(norm('⌃')).toEqual({ modifiers: ['Control'], key: '' });
    });
  });

  // ── Modifier aliases ─────────────────────────────────────────────────────

  describe('modifier aliases', () => {
    test('Ctrl → Control', () => {
      expect(norm('Ctrl+C')).toEqual({ modifiers: ['Control'], key: 'C' });
    });

    test('ctrl (lowercase) → Control', () => {
      expect(norm('ctrl+c')).toEqual({ modifiers: ['Control'], key: 'C' });
    });

    test('^ → Control', () => {
      expect(norm('^')).toEqual({ modifiers: ['Control'], key: '' });
    });

    test('Option → Alt', () => {
      expect(norm('Option+H')).toEqual({ modifiers: ['Alt'], key: 'H' });
    });

    test('option (lowercase) → Alt', () => {
      expect(norm('option+h')).toEqual({ modifiers: ['Alt'], key: 'H' });
    });

    test('Cmd → Meta', () => {
      expect(norm('Cmd+S')).toEqual({ modifiers: ['Meta'], key: 'S' });
    });

    test('cmd (lowercase) → Meta', () => {
      expect(norm('cmd+s')).toEqual({ modifiers: ['Meta'], key: 'S' });
    });

    test('Command → Meta', () => {
      expect(norm('Command+S')).toEqual({ modifiers: ['Meta'], key: 'S' });
    });

    test('command (lowercase) → Meta', () => {
      expect(norm('command+s')).toEqual({ modifiers: ['Meta'], key: 'S' });
    });

    test('⌘ as modifier', () => {
      expect(norm('⌘+P')).toEqual({ modifiers: ['Meta'], key: 'P' });
    });

    test('⌃ as modifier', () => {
      expect(norm('⌃+C')).toEqual({ modifiers: ['Control'], key: 'C' });
    });

    test('⌥ as modifier', () => {
      expect(norm('⌥+P')).toEqual({ modifiers: ['Alt'], key: 'P' });
    });

    test('⇧ as modifier', () => {
      expect(norm('⇧+A')).toEqual({ modifiers: ['Shift'], key: 'A' });
    });
  });

  // ── Key aliases ──────────────────────────────────────────────────────────

  describe('key aliases', () => {
    test('Return → Enter', () => {
      expect(norm('Control+Return')).toEqual({ modifiers: ['Control'], key: 'Enter' });
    });

    test('Del → Delete', () => {
      expect(norm('Option+Del')).toEqual({ modifiers: ['Alt'], key: 'Delete' });
    });

    test('Backspace alias Bksp', () => {
      expect(norm('Cmd+Bksp')).toEqual({ modifiers: ['Meta'], key: 'Backspace' });
    });

    test('Option+Backspace', () => {
      expect(norm('Option+Backspace')).toEqual({ modifiers: ['Alt'], key: 'Backspace' });
    });

    test('Esc → Escape', () => {
      expect(norm('Esc')).toEqual({ modifiers: [], key: 'Escape' });
    });

    test('Down → ArrowDown', () => {
      expect(norm('Down')).toEqual({ modifiers: [], key: 'ArrowDown' });
    });

    test('Up → ArrowUp', () => {
      expect(norm('Up')).toEqual({ modifiers: [], key: 'ArrowUp' });
    });

    test('Left → ArrowLeft', () => {
      expect(norm('Left')).toEqual({ modifiers: [], key: 'ArrowLeft' });
    });

    test('Right → ArrowRight', () => {
      expect(norm('Right')).toEqual({ modifiers: [], key: 'ArrowRight' });
    });

    test('Space → (space char)', () => {
      expect(norm('Cmd Space')).toEqual({ modifiers: ['Meta'], key: ' ' });
    });

    test('Spacebar → (space char)', () => {
      expect(norm('Spacebar')).toEqual({ modifiers: [], key: ' ' });
    });

    test('PgDn → PageDown', () => {
      expect(norm('PgDn')).toEqual({ modifiers: [], key: 'PageDown' });
    });

    test('PgUp → PageUp', () => {
      expect(norm('PgUp')).toEqual({ modifiers: [], key: 'PageUp' });
    });

    test('Ins → Insert', () => {
      expect(norm('Ins')).toEqual({ modifiers: [], key: 'Insert' });
    });

    test('Fn1 → F1', () => {
      expect(norm('Fn1')).toEqual({ modifiers: [], key: 'F1' });
    });

    test('Fn12 → F12', () => {
      expect(norm('Fn12')).toEqual({ modifiers: [], key: 'F12' });
    });

    test('FF → MediaFastForward', () => {
      expect(norm('Cmd FF')).toEqual({ modifiers: ['Meta'], key: 'MediaFastForward' });
    });
  });

  // ── Delimiter variants ───────────────────────────────────────────────────

  describe('delimiters', () => {
    test('plus sign as delimiter', () => {
      expect(norm('Shift+A')).toEqual({ modifiers: ['Shift'], key: 'A' });
    });

    test('space as delimiter', () => {
      expect(norm('Shift A')).toEqual({ modifiers: ['Shift'], key: 'A' });
    });

    test('plus with surrounding spaces', () => {
      expect(norm('Ctrl + Shift + V')).toEqual({ modifiers: ['Control', 'Shift'], key: 'V' });
    });

    test('spaces between each token', () => {
      expect(norm('Ctrl Shift V')).toEqual({ modifiers: ['Control', 'Shift'], key: 'V' });
    });

    test('plus without spaces', () => {
      expect(norm('Ctrl+Shift+V')).toEqual({ modifiers: ['Control', 'Shift'], key: 'V' });
    });

    test('mixed – some have spaces around plus, some not', () => {
      expect(norm('Ctrl + Shift+V')).toEqual({ modifiers: ['Control', 'Shift'], key: 'V' });
    });

    test('unicode modifiers with + delimiter', () => {
      expect(norm('⌃+⇧+A')).toEqual({ modifiers: ['Control', 'Shift'], key: 'A' });
    });

    test('unicode modifiers with space delimiter', () => {
      expect(norm('⌃ ⇧ A')).toEqual({ modifiers: ['Control', 'Shift'], key: 'A' });
    });
  });

  // ── Case insensitivity ───────────────────────────────────────────────────

  describe('case insensitivity', () => {
    test('fully lowercase modifier names', () => {
      expect(norm('control+c')).toEqual({ modifiers: ['Control'], key: 'C' });
    });

    test('fully uppercase modifier names', () => {
      expect(norm('CTRL+SHIFT+V')).toEqual({ modifiers: ['Control', 'Shift'], key: 'V' });
    });

    test('mixed-case modifier', () => {
      expect(norm('cOnTrOl+C')).toEqual({ modifiers: ['Control'], key: 'C' });
    });

    test('lowercase function key', () => {
      expect(norm('f1')).toEqual({ modifiers: [], key: 'F1' });
    });

    test('lowercase key name – escape', () => {
      expect(norm('escape')).toEqual({ modifiers: [], key: 'Escape' });
    });

    test('lowercase option', () => {
      expect(norm('option+h')).toEqual({ modifiers: ['Alt'], key: 'H' });
    });

    test('lowercase cmd', () => {
      expect(norm('cmd+s')).toEqual({ modifiers: ['Meta'], key: 'S' });
    });
  });

  // ── Function keys ────────────────────────────────────────────────────────

  describe('function keys', () => {
    test.each([
      ['F1', 'F1'],
      ['F2', 'F2'],
      ['F5', 'F5'],
      ['F10', 'F10'],
      ['F12', 'F12'],
    ])('%s alone', (input, expected) => {
      expect(norm(input)).toEqual({ modifiers: [], key: expected });
    });

    test('Cmd+F1', () => {
      expect(norm('Cmd+F1')).toEqual({ modifiers: ['Meta'], key: 'F1' });
    });

    test('Control+F3', () => {
      expect(norm('Control+F3')).toEqual({ modifiers: ['Control'], key: 'F3' });
    });

    test('Option+F2', () => {
      expect(norm('Option+F2')).toEqual({ modifiers: ['Alt'], key: 'F2' });
    });

    test('Cmd+F12', () => {
      expect(norm('Cmd+F12')).toEqual({ modifiers: ['Meta'], key: 'F12' });
    });

    test('Fn1 alias for F1', () => {
      expect(norm('Fn1')).toEqual({ modifiers: [], key: 'F1' });
    });

    test('Fn2 alias for F2', () => {
      expect(norm('Fn2')).toEqual({ modifiers: [], key: 'F2' });
    });
  });

  // ── Navigation keys ──────────────────────────────────────────────────────

  describe('navigation keys', () => {
    test('ArrowLeft directly', () => {
      expect(norm('ArrowLeft')).toEqual({ modifiers: [], key: 'ArrowLeft' });
    });

    test('ArrowRight directly', () => {
      expect(norm('ArrowRight')).toEqual({ modifiers: [], key: 'ArrowRight' });
    });

    test('ArrowUp directly', () => {
      expect(norm('ArrowUp')).toEqual({ modifiers: [], key: 'ArrowUp' });
    });

    test('ArrowDown directly', () => {
      expect(norm('ArrowDown')).toEqual({ modifiers: [], key: 'ArrowDown' });
    });

    test('Home', () => {
      expect(norm('Home')).toEqual({ modifiers: [], key: 'Home' });
    });

    test('End', () => {
      expect(norm('End')).toEqual({ modifiers: [], key: 'End' });
    });

    test('PageUp', () => {
      expect(norm('PageUp')).toEqual({ modifiers: [], key: 'PageUp' });
    });

    test('PageDown', () => {
      expect(norm('PageDown')).toEqual({ modifiers: [], key: 'PageDown' });
    });

    test('Cmd+ArrowLeft', () => {
      expect(norm('Cmd+ArrowLeft')).toEqual({ modifiers: ['Meta'], key: 'ArrowLeft' });
    });

    test('Ctrl+ArrowDown', () => {
      expect(norm('Ctrl+ArrowDown')).toEqual({ modifiers: ['Control'], key: 'ArrowDown' });
    });

    test('Shift+Home', () => {
      expect(norm('Shift+Home')).toEqual({ modifiers: ['Shift'], key: 'Home' });
    });

    test('Cmd+Shift+End', () => {
      expect(norm('Cmd+Shift+End')).toEqual({ modifiers: ['Meta', 'Shift'], key: 'End' });
    });
  });

  // ── Whitespace keys ──────────────────────────────────────────────────────

  describe('whitespace keys', () => {
    test('Enter alone', () => {
      expect(norm('Enter')).toEqual({ modifiers: [], key: 'Enter' });
    });

    test('Tab alone', () => {
      expect(norm('Tab')).toEqual({ modifiers: [], key: 'Tab' });
    });

    test('Cmd+Enter', () => {
      expect(norm('Cmd+Enter')).toEqual({ modifiers: ['Meta'], key: 'Enter' });
    });

    test('Shift+Tab', () => {
      expect(norm('Shift+Tab')).toEqual({ modifiers: ['Shift'], key: 'Tab' });
    });

    test('Ctrl+Space', () => {
      expect(norm('Ctrl+Space')).toEqual({ modifiers: ['Control'], key: ' ' });
    });

    test('Option+Tab', () => {
      expect(norm('Option+Tab')).toEqual({ modifiers: ['Alt'], key: 'Tab' });
    });

    test('Control+Enter', () => {
      expect(norm('Control+Enter')).toEqual({ modifiers: ['Control'], key: 'Enter' });
    });
  });

  // ── Editing / special keys ───────────────────────────────────────────────

  describe('editing keys', () => {
    test('Backspace', () => {
      expect(norm('Backspace')).toEqual({ modifiers: [], key: 'Backspace' });
    });

    test('Delete', () => {
      expect(norm('Delete')).toEqual({ modifiers: [], key: 'Delete' });
    });

    test('Escape', () => {
      expect(norm('Escape')).toEqual({ modifiers: [], key: 'Escape' });
    });

    test('Insert', () => {
      expect(norm('Insert')).toEqual({ modifiers: [], key: 'Insert' });
    });

    test('CapsLock', () => {
      expect(norm('CapsLock')).toEqual({ modifiers: [], key: 'CapsLock' });
    });

    test('Cmd+Backspace', () => {
      expect(norm('Cmd+Backspace')).toEqual({ modifiers: ['Meta'], key: 'Backspace' });
    });

    test('Ctrl+Delete', () => {
      expect(norm('Ctrl+Delete')).toEqual({ modifiers: ['Control'], key: 'Delete' });
    });

    test('Cmd+Escape', () => {
      expect(norm('Cmd+Escape')).toEqual({ modifiers: ['Meta'], key: 'Escape' });
    });
  });

  // ── Unicode key symbols ──────────────────────────────────────────────────

  describe('unicode key symbols', () => {
    test('← → ArrowLeft', () => {
      expect(norm('←')).toEqual({ modifiers: [], key: 'ArrowLeft' });
    });

    test('→ → ArrowRight', () => {
      expect(norm('→')).toEqual({ modifiers: [], key: 'ArrowRight' });
    });

    test('↑ → ArrowUp', () => {
      expect(norm('↑')).toEqual({ modifiers: [], key: 'ArrowUp' });
    });

    test('↓ → ArrowDown', () => {
      expect(norm('↓')).toEqual({ modifiers: [], key: 'ArrowDown' });
    });

    test('⌫ → Backspace', () => {
      expect(norm('⌫')).toEqual({ modifiers: [], key: 'Backspace' });
    });

    test('⇥ → Tab', () => {
      expect(norm('⇥')).toEqual({ modifiers: [], key: 'Tab' });
    });

    test('⏎ → Enter', () => {
      expect(norm('⏎')).toEqual({ modifiers: [], key: 'Enter' });
    });

    test('⇪ → CapsLock', () => {
      expect(norm('⇪')).toEqual({ modifiers: [], key: 'CapsLock' });
    });

    test('⌘ ← → Meta + ArrowLeft', () => {
      expect(norm('⌘ ←')).toEqual({ modifiers: ['Meta'], key: 'ArrowLeft' });
    });

    test('⌘ → → Meta + ArrowRight', () => {
      expect(norm('⌘ →')).toEqual({ modifiers: ['Meta'], key: 'ArrowRight' });
    });

    test('⌘ ↑ → Meta + ArrowUp', () => {
      expect(norm('⌘ ↑')).toEqual({ modifiers: ['Meta'], key: 'ArrowUp' });
    });

    test('⌘ ↓ → Meta + ArrowDown', () => {
      expect(norm('⌘ ↓')).toEqual({ modifiers: ['Meta'], key: 'ArrowDown' });
    });

    test('⌘ ⌫ → Meta + Backspace', () => {
      expect(norm('⌘ ⌫')).toEqual({ modifiers: ['Meta'], key: 'Backspace' });
    });

    test('⌘ ⏎ → Meta + Enter', () => {
      expect(norm('⌘ ⏎')).toEqual({ modifiers: ['Meta'], key: 'Enter' });
    });

    test('⌘ ⇥ → Meta + Tab', () => {
      expect(norm('⌘ ⇥')).toEqual({ modifiers: ['Meta'], key: 'Tab' });
    });
  });

  // ── Multi-modifier combinations ──────────────────────────────────────────

  describe('multi-modifier combinations', () => {
    test('Ctrl+Shift+A', () => {
      expect(norm('Ctrl+Shift+A')).toEqual({ modifiers: ['Control', 'Shift'], key: 'A' });
    });

    test('Cmd+Option+A', () => {
      expect(norm('Cmd+Option+A')).toEqual({ modifiers: ['Meta', 'Alt'], key: 'A' });
    });

    test('Cmd+Shift+A', () => {
      expect(norm('Cmd+Shift+A')).toEqual({ modifiers: ['Meta', 'Shift'], key: 'A' });
    });

    test('Option+Shift+A', () => {
      expect(norm('Option+Shift+A')).toEqual({ modifiers: ['Alt', 'Shift'], key: 'A' });
    });

    test('Cmd+Ctrl+A', () => {
      expect(norm('Cmd+Ctrl+A')).toEqual({ modifiers: ['Meta', 'Control'], key: 'A' });
    });

    test('⌃+⌥+⇧+⌘+P (all four – unicode)', () => {
      expect(norm('⌃+⌥+⇧+⌘+P')).toEqual({
        modifiers: ['Control', 'Alt', 'Shift', 'Meta'],
        key: 'P',
      });
    });

    test('⌃ ⌥ ⇧ ⌘ P (all four – space-separated)', () => {
      expect(norm('⌃ ⌥ ⇧ ⌘ P')).toEqual({
        modifiers: ['Control', 'Alt', 'Shift', 'Meta'],
        key: 'P',
      });
    });

    test('Ctrl+Option+Shift+Cmd+P (all four – text aliases)', () => {
      expect(norm('Ctrl+Option+Shift+Cmd+P')).toEqual({
        modifiers: ['Control', 'Alt', 'Shift', 'Meta'],
        key: 'P',
      });
    });

    test('⌘+Option+Shift+Control+P (mixed unicode and text)', () => {
      expect(norm('⌘+Option+Shift+Control+P')).toEqual({
        modifiers: ['Meta', 'Alt', 'Shift', 'Control'],
        key: 'P',
      });
    });

    test('modifier order is preserved', () => {
      expect(norm('Cmd+Ctrl+Shift+A').modifiers).toEqual(['Meta', 'Control', 'Shift']);
      expect(norm('Ctrl+Cmd+Shift+A').modifiers).toEqual(['Control', 'Meta', 'Shift']);
    });
  });

  // ── Plus key disambiguation ──────────────────────────────────────────────

  describe('plus key disambiguation', () => {
    test('bare + is just the plus key', () => {
      expect(norm('+')).toEqual({ modifiers: [], key: '+' });
    });

    test('Control++ (trailing + is key)', () => {
      expect(norm('Control++')).toEqual({ modifiers: ['Control'], key: '+' });
    });

    test('Control+Shift++ (double trailing +)', () => {
      expect(norm('Control+Shift++')).toEqual({ modifiers: ['Control', 'Shift'], key: '+' });
    });

    test('Cmd + (trailing + with space)', () => {
      expect(norm('Cmd +')).toEqual({ modifiers: ['Meta'], key: '+' });
    });

    test('⌘ + (unicode cmd, trailing + with space)', () => {
      expect(norm('⌘ +')).toEqual({ modifiers: ['Meta'], key: '+' });
    });

    test('Shift+A uses + as delimiter (not key)', () => {
      expect(norm('Shift+A')).toEqual({ modifiers: ['Shift'], key: 'A' });
    });
  });

  // ── Whitespace handling ──────────────────────────────────────────────────

  describe('whitespace handling', () => {
    test('leading and trailing whitespace stripped', () => {
      expect(norm('  Control  +   C  ')).toEqual({ modifiers: ['Control'], key: 'C' });
    });

    test('multiple spaces between tokens', () => {
      expect(norm('  Ctrl  Shift   V  ')).toEqual({ modifiers: ['Control', 'Shift'], key: 'V' });
    });

    test('single letter with surrounding spaces', () => {
      expect(norm('  a  ')).toEqual({ modifiers: [], key: 'a' });
    });

    test('extra spaces around plus sign', () => {
      expect(norm('Cmd  +  Option  +  S')).toEqual({ modifiers: ['Meta', 'Alt'], key: 'S' });
    });
  });

  // ── Error cases ──────────────────────────────────────────────────────────

  describe('error cases', () => {
    test('unrecognized multi-char key throws', () => {
      expect(() => norm('Control+UnknownKey')).toThrow();
    });

    test('two non-modifier regular keys (space) throws', () => {
      expect(() => norm('A B')).toThrow();
    });

    test('two non-modifier keys with plus throws', () => {
      expect(() => norm('A+B')).toThrow();
    });
  });
});

// ---------------------------------------------------------------------------
// formatHotkeys
// ---------------------------------------------------------------------------

describe('formatHotkeys', () => {
  // ── Modifier key unicode symbols ─────────────────────────────────────────

  describe('modifier key symbols', () => {
    test('Meta → ⌘', () => {
      expect(formatHotkeys(['Meta'])).toBe('⌘');
    });

    test('Control → ⌃', () => {
      expect(formatHotkeys(['Control'])).toBe('⌃');
    });

    test('Alt → ⌥', () => {
      expect(formatHotkeys(['Alt'])).toBe('⌥');
    });

    test('Shift → ⇧', () => {
      expect(formatHotkeys(['Shift'])).toBe('⇧');
    });
  });

  // ── Navigation key symbols ───────────────────────────────────────────────

  describe('navigation key symbols', () => {
    test('ArrowLeft → ←', () => {
      expect(formatHotkeys(['ArrowLeft'])).toBe('←');
    });

    test('ArrowRight → →', () => {
      expect(formatHotkeys(['ArrowRight'])).toBe('→');
    });

    test('ArrowUp → ↑', () => {
      expect(formatHotkeys(['ArrowUp'])).toBe('↑');
    });

    test('ArrowDown → ↓', () => {
      expect(formatHotkeys(['ArrowDown'])).toBe('↓');
    });

    test('Home → ⇱', () => {
      expect(formatHotkeys(['Home'])).toBe('⇱');
    });

    test('End → ⇲', () => {
      expect(formatHotkeys(['End'])).toBe('⇲');
    });

    test('PageUp → ⇞', () => {
      expect(formatHotkeys(['PageUp'])).toBe('⇞');
    });

    test('PageDown → ⇟', () => {
      expect(formatHotkeys(['PageDown'])).toBe('⇟');
    });
  });

  // ── Editing / whitespace key symbols ─────────────────────────────────────

  describe('editing and whitespace key symbols', () => {
    test('Escape → ⎋', () => {
      expect(formatHotkeys(['Escape'])).toBe('⎋');
    });

    test('Backspace → ⌫', () => {
      expect(formatHotkeys(['Backspace'])).toBe('⌫');
    });

    test('Delete → ⌦', () => {
      expect(formatHotkeys(['Delete'])).toBe('⌦');
    });

    test('Tab → ⇥', () => {
      expect(formatHotkeys(['Tab'])).toBe('⇥');
    });

    test('Enter → ↵', () => {
      expect(formatHotkeys(['Enter'])).toBe('↵');
    });

    test('CapsLock → ⇪', () => {
      expect(formatHotkeys(['CapsLock'])).toBe('⇪');
    });
  });

  // ── Regular / unknown characters ─────────────────────────────────────────

  describe('regular characters (no unicode symbol)', () => {
    test('plain letter retained', () => {
      expect(formatHotkeys(['P'])).toBe('P');
    });

    test('digit retained', () => {
      expect(formatHotkeys(['1'])).toBe('1');
    });

    test('special char retained', () => {
      expect(formatHotkeys(['£'])).toBe('£');
    });
  });

  // ── Combination formatting ───────────────────────────────────────────────

  describe('combinations', () => {
    test('Control + char', () => {
      expect(formatHotkeys(['Control', 'C'])).toBe('⌃ C');
    });

    test('Meta + char (⌃ input)', () => {
      expect(formatHotkeys(['⌃', 'C'])).toBe('⌃ C');
    });

    test('Meta + char', () => {
      expect(formatHotkeys(['Meta', 'P'])).toBe('⌘ P');
    });

    test('all four modifiers + key', () => {
      expect(formatHotkeys(['Meta', 'Alt', 'Shift', 'Control', 'P'])).toBe('⌘ ⌥ ⇧ ⌃ P');
    });

    test('Meta + Escape', () => {
      expect(formatHotkeys(['Meta', 'Escape'])).toBe('⌘ ⎋');
    });
  });

  // ── Edge cases ───────────────────────────────────────────────────────────

  describe('edge cases', () => {
    test('empty array → empty string', () => {
      expect(formatHotkeys([])).toBe('');
    });

    test('single char array', () => {
      expect(formatHotkeys(['£'])).toBe('£');
    });
  });
});
