import { createCanvas } from 'canvas';

/**
 * Generate a 144x144px PNG image buffer with the given color
 */
export async function generateImage(color: string): Promise<Buffer> {
  const canvas = createCanvas(144, 144);
  const ctx = canvas.getContext('2d');
  
  // Parse and apply the color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 144, 144);
  
  // Convert to PNG buffer
  return canvas.toBuffer('image/png');
}