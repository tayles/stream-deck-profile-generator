/**
 * This script generates various button style images using canvas
 *
 * Usage:
 *   bun generate:button-styles
 */

import { writeFileSync } from 'node:fs';
import { type CanvasRenderingContext2D, createCanvas } from 'canvas';

const BUTTON_SIZE = 144;

function createCanvasBackground(
  color: string,
  size: number = BUTTON_SIZE,
): CanvasRenderingContext2D {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Apply the color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);

  return ctx;
}

function saveImage(ctx: CanvasRenderingContext2D, filename: string) {
  const imageData = ctx.canvas.toBuffer('image/png');
  writeFileSync(filename, imageData);
}

function generateBasicGradientButton(
  ctx: CanvasRenderingContext2D,
  size: number,
): CanvasRenderingContext2D {
  // Create radial gradient from top edge center
  const gradient = ctx.createRadialGradient(size / 2, 0, 0, size / 2, size / 2, 120);
  gradient.addColorStop(0, '#1a2535'); // Darker blue-gray at top
  gradient.addColorStop(0.6, '#0d1419'); // Very dark blue
  gradient.addColorStop(1, '#050a0d'); // Almost black edges

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add subtle vignette effect
  const vignette = ctx.createRadialGradient(size / 2, 0, 40, size / 2, size / 2, 120);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, size, size);

  return ctx;
}

function generateBorderButton(
  ctx: CanvasRenderingContext2D,
  size: number,
): CanvasRenderingContext2D {
  // First, draw the basic gradient background
  generateBasicGradientButton(ctx, size);

  // Then, draw the border
  const offset = size * 0.08; // 10% offset from edges
  const borderSize = size - offset * 2;
  const cornerRadius = size * 0.08; // Slightly rounded corners
  const lineWidth = 3;

  // Create the diagonal gradient for the stroke
  // This is the core trick: Color -> Transparent -> Color
  // It runs from Top-Left (0,0) to Bottom-Right (size, size)
  const strokeGradient = ctx.createLinearGradient(0, 0, size, size);

  // Define the specific light blue/lavender neon color
  const neonColor = 'rgba(180, 200, 255, 1)';
  const transparent = 'rgba(180, 200, 255, 0)';

  // Top-Left Corner logic
  strokeGradient.addColorStop(0.0, neonColor); // Start solid
  strokeGradient.addColorStop(0.15, neonColor); // Keep solid through the corner bend
  strokeGradient.addColorStop(0.25, transparent); // Fade out along the arms

  // Center (Invisible)
  strokeGradient.addColorStop(0.5, transparent);

  // Bottom-Right Corner logic
  strokeGradient.addColorStop(0.75, transparent); // Start fading in
  strokeGradient.addColorStop(0.85, neonColor); // Solid at the corner bend
  strokeGradient.addColorStop(1.0, neonColor); // Solid to the end

  // Set stroke properties
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round'; // Makes the faded tips look smoother
  ctx.strokeStyle = strokeGradient;

  // Draw the rounded rectangle
  ctx.beginPath();
  ctx.roundRect(offset, offset, borderSize, borderSize, cornerRadius);
  ctx.stroke();

  return ctx;
}

function generateRainbowButton(ctx: CanvasRenderingContext2D, size: number) {
  const borderRadius = 12;
  const innerPadding = size * 0.08;

  // Circle parameters
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 2;

  // Draw rainbow using many thin triangular segments with smooth blending
  const segments = 720; // More segments for smoother appearance

  // Enable antialiasing for smoother rendering
  ctx.imageSmoothingEnabled = true;

  for (let i = 0; i < segments; i++) {
    const angle1 = (i / segments) * Math.PI * 2;
    const angle2 = ((i + 1) / segments) * Math.PI * 2;
    // Offset hue by 105 degrees so green (120°) appears in top-left corner (225°)
    const hue = ((i / segments) * 360 - 105) % 360;

    ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;

    // Draw a triangular segment from center
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle1, angle2);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();
  }

  ctx.imageSmoothingEnabled = false;

  // Draw grey rounded square inside
  ctx.fillStyle = '#07060D';
  ctx.beginPath();
  ctx.roundRect(
    innerPadding,
    innerPadding,
    size - innerPadding * 2,
    size - innerPadding * 2,
    borderRadius,
  );
  ctx.fill();

  return ctx;
}

// fill color button style
const fillCtx = createCanvasBackground('#C24965', BUTTON_SIZE);
saveImage(fillCtx, 'button-styles/filled.png');

// basic gradient button style
const basicCtx = createCanvasBackground('black', BUTTON_SIZE);
generateBasicGradientButton(basicCtx, BUTTON_SIZE);
saveImage(basicCtx, 'button-styles/basic.png');

// gradient + border button style
const borderCtx = createCanvasBackground('black', BUTTON_SIZE);
generateBorderButton(borderCtx, BUTTON_SIZE);
saveImage(borderCtx, 'button-styles/border.png');

// rainbow button style
const rainbowCtx = createCanvasBackground('black', BUTTON_SIZE);
generateRainbowButton(rainbowCtx, BUTTON_SIZE);
saveImage(rainbowCtx, 'button-styles/rainbow.png');
