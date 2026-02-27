import { type CanvasRenderingContext2D, createCanvas } from 'canvas';
import { readFileSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';
import type { ButtonStyle } from '../types/types';

export const DEFAULT_BUTTON_SIZE = 144;

export function generateImage(
  buttonStyle: ButtonStyle,
  size: number = DEFAULT_BUTTON_SIZE,
  color: string = 'black',
): CanvasRenderingContext2D {
  const ctx = createCanvasBackground(color, size);

  switch (buttonStyle) {
    case 'fill':
      return ctx;
    case 'basic':
      return generateBasicGradientButton(ctx, size);
    case 'border':
      return generateBorderButton(ctx, size);
    case 'rainbow':
      return generateRainbowButton(ctx, size);
    default:
      throw new Error(`Unknown button style: ${buttonStyle}`);
  }
}

export function saveImage(ctx: CanvasRenderingContext2D, filename: string): void {
  const imageData = ctx.canvas.toBuffer('image/png');
  writeFileSync(filename, imageData);
}

/**
 * Generate a 144x144px PNG image buffer with the given color
 */
export function createCanvasBackground(
  color: string,
  size: number = DEFAULT_BUTTON_SIZE,
): CanvasRenderingContext2D {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Apply the color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);

  return ctx;
}

export function generateBasicGradientButton(
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

export function generateBorderButton(
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

export function generateRainbowButton(
  ctx: CanvasRenderingContext2D,
  size: number,
): CanvasRenderingContext2D {
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

/**
 * Wrap in an SVG to add padding
 */
export function addPaddingToImage(
  filePath: string,
  paddingPct: number,
  size: number = DEFAULT_BUTTON_SIZE,
): string {
  const dims = 100 - paddingPct * 2;

  if (filePath.endsWith('.svg')) {
    // modify the viewBox to add padding
    const rawSvg = readFileSync(filePath, 'utf-8');
    return addPaddingToSvg(rawSvg, paddingPct);
  } else {
    // read as base64 and embed in an SVG
    const dataUri = `data:image/${extname(filePath).slice(1)};base64,${readFileSync(filePath, 'base64')}`;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <image href="${dataUri}" x="${paddingPct}%" y="${paddingPct}%" width="${dims}%" height="${dims}%"/>
  </svg>`;
  }
}

export function addPaddingToSvg(svgString: string, paddingPercent = 10): string {
  // Regex to find the viewBox attribute (handles spaces and commas)
  const viewBoxRegex =
    /viewBox=["']\s*([-\d.]+)[,\s]+([-\d.]+)[,\s]+([-\d.]+)[,\s]+([-\d.]+)\s*["']/i;

  return svgString.replace(viewBoxRegex, (_match, minXStr, minYStr, widthStr, heightStr) => {
    const minX = parseFloat(minXStr);
    const minY = parseFloat(minYStr);
    const width = parseFloat(widthStr);
    const height = parseFloat(heightStr);

    // Calculate the padding amounts
    const padX = width * (paddingPercent / 100);
    const padY = height * (paddingPercent / 100);

    // Calculate new viewBox values
    const newMinX = minX - padX;
    const newMinY = minY - padY;
    const newWidth = width + padX * 2;
    const newHeight = height + padY * 2;

    // Return the updated viewBox attribute
    return `viewBox="${newMinX} ${newMinY} ${newWidth} ${newHeight}"`;
  });
}
