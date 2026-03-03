import { describe, expect, test } from 'bun:test';

import { CanvasRenderingContext2D } from 'canvas';

import { generateImage } from './image-utils';

describe('image-utils', () => {
  describe('generateImage', () => {
    test('generates a 144x144 canvas context', () => {
      const ctx = generateImage('fill', 144, 'black');

      expect(ctx).toBeInstanceOf(CanvasRenderingContext2D);
    });
  });
});
