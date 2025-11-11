import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { generateStreamDeckProfile, TMP_DIR, type Options } from './lib';
import { mkdirSync, writeFileSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

describe('lib', () => {
  const testDir = join(process.cwd(), '.test-lib-tmp');
  const inputFile = join(testDir, 'test.csv');
  const outputFile = join(testDir, 'test.streamDeckProfile');

  beforeEach(() => {
    // Create test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    // Clean up temp directory
    const tmpDir = join(process.cwd(), TMP_DIR);
    if (existsSync(tmpDir)) {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  describe('generateStreamDeckProfile', () => {
    test('generates a profile from a basic CSV', async () => {
      const csv = `Hotkey,Label
Ctrl+C,Copy
Ctrl+V,Paste`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
      };

      await generateStreamDeckProfile(options);

      expect(existsSync(outputFile)).toBe(true);
    });

    test('uses default output path when not provided', async () => {
      const csv = `Hotkey,Label
Ctrl+C,Copy`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
      };

      await generateStreamDeckProfile(options);

      const expectedOutput = join(testDir, 'test.streamDeckProfile');
      expect(existsSync(expectedOutput)).toBe(true);
    });

    test('handles multiple pages', async () => {
      // Generate 20 rows to create multiple pages (15 per page for mk device)
      const rows = Array.from({ length: 20 }, (_, i) => `Ctrl+${i},Action ${i}`).join('\n');
      const csv = `Hotkey,Label\n${rows}`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
      };

      await generateStreamDeckProfile(options);

      expect(existsSync(outputFile)).toBe(true);
    });

    test('handles named pages', async () => {
      const csv = `Hotkey,Label,Page
Ctrl+C,Copy,Edit
Ctrl+V,Paste,Edit
Ctrl+F,Find,Search`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
      };

      await generateStreamDeckProfile(options);

      expect(existsSync(outputFile)).toBe(true);
    });

    test('handles custom device ID', async () => {
      const csv = `Hotkey,Label
Ctrl+C,Copy`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
        deviceId: 'xl',
      };

      await generateStreamDeckProfile(options);

      expect(existsSync(outputFile)).toBe(true);
    });

    test('handles button styles', async () => {
      const csv = `Hotkey,Label
Ctrl+C,Copy`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
        buttonStyle: 'border',
      };

      await generateStreamDeckProfile(options);

      expect(existsSync(outputFile)).toBe(true);
    });

    test('handles custom colors in CSV', async () => {
      const csv = `Hotkey,Label,Color
Ctrl+C,Copy,red
Ctrl+V,Paste,#00FF00`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
      };

      await generateStreamDeckProfile(options);

      expect(existsSync(outputFile)).toBe(true);
    });

    test('throws error for missing input file', async () => {
      const options: Options = {
        inputPath: join(testDir, 'nonexistent.csv'),
        outputPath: outputFile,
      };

      await expect(generateStreamDeckProfile(options)).rejects.toThrow('Input file not found');
    });

    test('throws error for empty CSV', async () => {
      writeFileSync(inputFile, '');

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
      };

      await expect(generateStreamDeckProfile(options)).rejects.toThrow();
    });

    test('throws error for CSV with no data rows', async () => {
      writeFileSync(inputFile, 'Hotkey,Label\n');

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
      };

      await expect(generateStreamDeckProfile(options)).rejects.toThrow('CSV file is empty');
    });

    test('throws error for invalid device ID', async () => {
      const csv = `Hotkey,Label
Ctrl+C,Copy`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
        deviceId: 'invalid' as any,
      };

      await expect(generateStreamDeckProfile(options)).rejects.toThrow('Invalid device ID');
    });

    test('throws error for invalid font size', async () => {
      const csv = `Hotkey,Label
Ctrl+C,Copy`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
        fontSize: 100,
      };

      await expect(generateStreamDeckProfile(options)).rejects.toThrow(
        'fontSize must be between 1 and 72',
      );
    });

    test('handles icons directory when provided', async () => {
      const iconsDir = join(testDir, 'icons');
      mkdirSync(iconsDir, { recursive: true });

      // Create a test icon
      writeFileSync(join(iconsDir, 'copy.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47]));

      const csv = `Hotkey,Label,Id
Ctrl+C,Copy,copy`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
        iconsDir: iconsDir,
      };

      await generateStreamDeckProfile(options);

      expect(existsSync(outputFile)).toBe(true);
    });

    test('throws error for non-existent icons directory', async () => {
      const csv = `Hotkey,Label
Ctrl+C,Copy`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
        iconsDir: join(testDir, 'nonexistent-icons'),
      };

      await expect(generateStreamDeckProfile(options)).rejects.toThrow('Icons directory not found');
    });

    test('cleans up temporary directory after generation', async () => {
      const csv = `Hotkey,Label
Ctrl+C,Copy`;

      writeFileSync(inputFile, csv);

      const options: Options = {
        inputPath: inputFile,
        outputPath: outputFile,
      };

      await generateStreamDeckProfile(options);

      // Check that temp directory is empty or doesn't contain profile folders
      const tmpDir = join(process.cwd(), TMP_DIR);
      if (existsSync(tmpDir)) {
        const contents = readdirSync(tmpDir);
        // Should have no .sdProfile directories
        const profileDirs = contents.filter(name => name.endsWith('.sdProfile'));
        expect(profileDirs).toHaveLength(0);
      }
    });
  });
});
