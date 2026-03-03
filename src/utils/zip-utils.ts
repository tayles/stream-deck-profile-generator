import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import archiver from 'archiver';

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

      // deterministic output
      statConcurrency: 1,
    });

    output.on('close', () => {
      resolve();
    });

    archive.on('error', err => {
      reject(err);
    });

    archive.on('warning', err => {
      if (err.code !== 'ENOENT') {
        reject(err);
      }
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add the directory contents to the archive
    archive.directory(inputPath, false, {
      // deterministic output
      date: new Date('2020-02-02T02:02:02.020Z'),
    });

    // Finalize the archive
    void archive.finalize();
  });
}
