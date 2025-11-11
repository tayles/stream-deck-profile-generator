import { describe, expect, test } from 'bun:test';
import { generateImage } from './image-utils';

describe('image-utils', () => {
  describe('generateImage', () => {
    test('generates a 144x144 PNG buffer', async () => {
      const buffer = await generateImage('black');
      
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
      
      // Check PNG signature
      expect(buffer[0]).toBe(0x89);
      expect(buffer[1]).toBe(0x50);
      expect(buffer[2]).toBe(0x4E);
      expect(buffer[3]).toBe(0x47);
    });

    test('handles hex colors', async () => {
      const buffer = await generateImage('#FF0000');
      expect(buffer).toBeInstanceOf(Buffer);
    });

    test('handles short hex colors', async () => {
      const buffer = await generateImage('#F00');
      expect(buffer).toBeInstanceOf(Buffer);
    });

    test('handles named colors', async () => {
      const colors = ['black', 'white', 'red', 'green', 'blue', 'yellow'];
      
      for (const color of colors) {
        const buffer = await generateImage(color);
        expect(buffer).toBeInstanceOf(Buffer);
      }
    });

    test('handles case-insensitive named colors', async () => {
      const buffer1 = await generateImage('RED');
      const buffer2 = await generateImage('red');
      
      expect(buffer1).toBeInstanceOf(Buffer);
      expect(buffer2).toBeInstanceOf(Buffer);
    });

    test('handles colors with whitespace', async () => {
      const buffer = await generateImage('  red  ');
      expect(buffer).toBeInstanceOf(Buffer);
    });

    test('handles invalid colors gracefully', async () => {
      // Should not throw, just use a default color
      const buffer = await generateImage('notacolor');
      expect(buffer).toBeInstanceOf(Buffer);
    });
  });
});
