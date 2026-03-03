#!/usr/bin/env bun

/**
 * This script generates various button style images using canvas
 *
 * Usage:
 *   bun generate:button-styles
 */

import { DEFAULT_BUTTON_SIZE, generateImage, saveImage } from '../src/utils/image-utils';

// fill color button style
const fillCtx = generateImage('fill', DEFAULT_BUTTON_SIZE, '#C24965');
saveImage(fillCtx, 'docs/button-styles/filled.png');

// basic gradient button style
const basicCtx = generateImage('basic', DEFAULT_BUTTON_SIZE);
saveImage(basicCtx, 'docs/button-styles/basic.png');

// gradient + border button style
const borderCtx = generateImage('border', DEFAULT_BUTTON_SIZE);
saveImage(borderCtx, 'docs/button-styles/border.png');

// rainbow button style
const rainbowCtx = generateImage('rainbow', DEFAULT_BUTTON_SIZE);
saveImage(rainbowCtx, 'docs/button-styles/rainbow.png');
