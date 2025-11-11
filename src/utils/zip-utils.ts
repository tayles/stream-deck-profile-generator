import archiver from 'archiver';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

/**
 * Generate a zip file containing the given directory
 */
export async function generateZip(inputPath: string, outputPath: string): Promise<void> {
  // Ensure output directory exists
  await mkdir(dirname(outputPath), { recursive: true });

  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    output.on('close', () => {
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.on('warning', (err) => {
      if (err.code !== 'ENOENT') {
        reject(err);
      }
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add the directory contents to the archive
    archive.directory(inputPath, false);

    // Finalize the archive
    archive.finalize();
  });
}
