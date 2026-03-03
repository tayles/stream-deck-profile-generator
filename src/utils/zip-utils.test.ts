import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { generateZip } from './zip-utils';

describe('zip-utils', () => {
  const testDir = join(process.cwd(), '.test-tmp');
  const inputDir = join(testDir, 'input');
  const outputFile = join(testDir, 'output.zip');

  beforeEach(() => {
    // Create test directories
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    mkdirSync(inputDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('generateZip', () => {
    test('creates a zip file from a directory', async () => {
      // Create test files
      writeFileSync(join(inputDir, 'test1.txt'), 'Hello World');
      writeFileSync(join(inputDir, 'test2.txt'), 'Another file');

      await generateZip(inputDir, outputFile);

      expect(existsSync(outputFile)).toBe(true);

      // Check that it's a valid zip file (starts with PK signature)
      const buffer = readFileSync(outputFile);
      expect(buffer[0]).toBe(0x50); // P
      expect(buffer[1]).toBe(0x4b); // K
    });

    test('creates output directory if it does not exist', async () => {
      const deepOutputFile = join(testDir, 'nested', 'folder', 'output.zip');

      writeFileSync(join(inputDir, 'test.txt'), 'content');
      await generateZip(inputDir, deepOutputFile);

      expect(existsSync(deepOutputFile)).toBe(true);
    });

    test('handles nested directories', async () => {
      const nestedDir = join(inputDir, 'nested');
      mkdirSync(nestedDir, { recursive: true });

      writeFileSync(join(inputDir, 'root.txt'), 'root');
      writeFileSync(join(nestedDir, 'nested.txt'), 'nested');

      await generateZip(inputDir, outputFile);

      expect(existsSync(outputFile)).toBe(true);
    });

    test('handles empty directory', async () => {
      await generateZip(inputDir, outputFile);

      expect(existsSync(outputFile)).toBe(true);
    });

    test('creates archive even for non-existent input directory', async () => {
      const nonExistentDir = join(testDir, 'does-not-exist');

      // archiver doesn't throw for non-existent directories, it creates empty archive
      await generateZip(nonExistentDir, outputFile);
      expect(existsSync(outputFile)).toBe(true);
    });

    test('overwrites existing output file', async () => {
      writeFileSync(join(inputDir, 'test.txt'), 'content');

      // Create first zip
      await generateZip(inputDir, outputFile);
      const size1 = readFileSync(outputFile).length;

      // Create second zip with more content
      writeFileSync(join(inputDir, 'test2.txt'), 'more content');
      await generateZip(inputDir, outputFile);
      const size2 = readFileSync(outputFile).length;

      expect(size2).toBeGreaterThan(size1);
    });
  });
});
