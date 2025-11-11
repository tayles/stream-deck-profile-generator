/**
 * This script generates profiles for all CSV files in the examples/ directory.
 * 
 * Usage: 
 *   bun generate:examples
 */

import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { generateStreamDeckProfile, type Options } from '../src/lib';

async function generateExamples() {
  const examplesDir = join(process.cwd(), 'examples');
  const files = readdirSync(examplesDir);

  for (const file of files) {
    const filePath = join(examplesDir, file);
    const stats = statSync(filePath);

    if (stats.isFile() && extname(file) === '.csv') {
      const outputFileName = file.replace(/\.csv$/i, '.streamDeckProfile');
      const outputPath = join(examplesDir, outputFileName);

      const options: Options = {
        inputPath: filePath,
        outputPath: outputPath,
        // buttonStyle: 'basic',
        // labelStyle: 'both',
        // labelPosition: 'middle',
        // bgColor: 'limegreen',
        // textColor: 'white',
        // fontSize: 12,
      };

      console.log(`Generating profile for ${file}...`);
      await generateStreamDeckProfile(options);
      console.log(`Generated: ${outputFileName}`);
    }
  }
}

generateExamples().catch((error) => {
  console.error('Error generating examples:', error);
  process.exit(1);
});