import {
  existsSync,
  readFileSync,
  rmSync,
  mkdirSync,
  writeFileSync,
  copyFileSync,
  readdirSync,
} from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import type { CanvasRenderingContext2D } from 'canvas';
import { DEVICES, type DeviceId } from './types/device-types';
import type { ButtonStyle, LabelPosition, LabelStyle } from './types/types';
import { parseCsv } from './utils/csv-utils';
import { DEFAULT_BUTTON_SIZE, generateImage, saveImage } from './utils/image-utils';
import { generateZip } from './utils/zip-utils';
import { generateUUID } from './utils/hotkey-utils';
import {
  generateProfileFolderId,
  generatePageManifest,
  generatePinnedPageManifest,
  generateRootManifest,
} from './utils/profile-utils';
import { groupByPage } from './utils/layout-utils';
export interface Options {
  inputPath: string;
  outputPath?: string;
  deviceId?: DeviceId;
  buttonStyle?: ButtonStyle;
  labelStyle?: LabelStyle;
  labelPosition?: LabelPosition;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  iconsDir?: string;
  profileName?: string;
  appPath?: string;
}

export const DEFAULT_OPTIONS: Omit<Options, 'inputPath' | 'outputPath' | 'iconsDir'> = {
  deviceId: 'mk',
  buttonStyle: 'basic',
  labelStyle: 'both',
  labelPosition: 'middle',
  bgColor: 'black',
  textColor: 'white',
  fontSize: 12,
};

export const TMP_DIR = 'out';

/**
 * Create this file structure in the out/ dir:
 *
 * @example
 * <profile-uuid>.sdProfile/
 * ├── manifest.json
 * └── Profiles/
 *     ├── <pinned-page-folder-id>/
 *     │   ├── manifest.json
 *     │   └── Images/
 *     ├── <page-1-folder-id>/
 *     │   ├── manifest.json
 *     │   └── Images/
 *     │       ├── <hotkey-1-id>.png
 *     │       ├── <hotkey-2-id>.png
 *     │       └── ...
 *     └── <page-2-folder-id>/
 *         ├── manifest.json
 *         └── Images/
 *             ├── <hotkey-5-id>.png
 *             ├── <hotkey-6-id>.png
 *             └── ...
 */
export async function generateStreamDeckProfile(options: Options): Promise<void> {
  // Merge with default options
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validate inputs
  validateOptions(opts);

  // Extract filename without extension from inputPath to use as profile name
  const baseName = basename(opts.inputPath, extname(opts.inputPath));
  const profileName = opts.profileName || baseName;

  // Check file paths exist
  if (!existsSync(opts.inputPath)) {
    throw new Error(`Input file not found: ${opts.inputPath}`);
  }

  if (opts.iconsDir && !existsSync(opts.iconsDir)) {
    throw new Error(`Icons directory not found: ${opts.iconsDir}`);
  }

  // Read and parse CSV file
  const csvContent = readFileSync(opts.inputPath, 'utf-8');
  const csvData = parseCsv(csvContent);

  if (csvData.length === 0) {
    throw new Error('CSV file contains no data rows');
  }

  // Get device info
  const device = DEVICES[opts.deviceId!];

  // Calculate pages
  const pageGroups = groupByPage(csvData, device.rows, device.columns);
  const pageNames = Object.keys(pageGroups);

  if (pageNames.length === 0) {
    throw new Error('No pages generated from CSV data');
  }

  // Generate page UUIDs and folder IDs
  const pageUuids: string[] = [];
  const pageFolderIds: string[] = [];

  for (const pageName of pageNames) {
    const pageUuid = generateUUID(pageName);
    const pageFolderId = generateProfileFolderId(pageUuid);
    pageUuids.push(pageUuid);
    pageFolderIds.push(pageFolderId);
  }

  // Add pinned page
  const pinnedPageUuid = generateUUID(profileName);
  const pinnedPageFolderId = generateProfileFolderId(pinnedPageUuid);
  // pageUuids.push(pinnedPageUuid);
  pageFolderIds.push(pinnedPageFolderId);

  // Generate profile UUID
  const profileUuid = generateUUID(profileName).toUpperCase();

  // Clean up temp directory
  const tempDir = resolve(process.cwd(), TMP_DIR);

  rmSync(tempDir, { recursive: true, force: true });

  // Create temporary build directory
  const outerProfileDir = resolve(tempDir, `${profileUuid}.sdProfile`);
  const profilesDir = join(outerProfileDir, 'Profiles');

  // Empty/create the temp dir
  mkdirSync(profilesDir, { recursive: true });

  // Write root manifest
  const rootManifest = generateRootManifest(
    profileName,
    pageUuids,
    pinnedPageUuid,
    opts.deviceId!,
    opts.appPath,
  );
  writeFileSync(join(outerProfileDir, 'manifest.json'), JSON.stringify(rootManifest, null, 2));

  // Build icons cache if icons directory exists
  const iconsCache = buildIconsCache(opts.iconsDir);

  // Build image context cache for button styles
  const imageCache = new Map<string, CanvasRenderingContext2D>();

  // Create each page directory and manifest
  for (let i = 0; i < pageNames.length; i++) {
    const pageName = pageNames[i]!;
    const pageFolderId = pageFolderIds[i]!;
    const hotkeys = pageGroups[pageName]!;

    const pageDir = join(profilesDir, pageFolderId);
    const imagesDir = join(pageDir, 'Images');
    mkdirSync(imagesDir, { recursive: true });

    // Generate page manifest
    const pageManifest = generatePageManifest(
      pageName,
      hotkeys,
      device.rows,
      device.columns,
      opts.fontSize,
      opts.textColor,
      opts.labelStyle,
      opts.labelPosition,
    );
    writeFileSync(join(pageDir, 'manifest.json'), JSON.stringify(pageManifest, null, 2));

    // Generate images for each hotkey
    await Promise.all(
      hotkeys.map(async hotkey => {
        const imagePath = join(imagesDir, `${hotkey.id}.png`);
        await generateButtonImage(
          hotkey,
          imagePath,
          opts as Required<Omit<Options, 'outputPath' | 'iconsDir'>> & Pick<Options, 'iconsDir'>,
          iconsCache,
          imageCache,
        );
      }),
    );
  }

  // Create pinned page directory
  const pinnedPageDir = join(profilesDir, pinnedPageFolderId);
  const pinnedImagesDir = join(pinnedPageDir, 'Images');
  mkdirSync(pinnedImagesDir, { recursive: true });

  // Show prev button only if more than 2 pages
  const showPrevButton = pageUuids.length > 2;
  // Show next button only if more than 1 page
  const showNextButton = pageUuids.length > 1;

  const pinnedPageManifest = generatePinnedPageManifest(
    showPrevButton,
    showNextButton,
    device.rows,
    device.columns,
  );
  writeFileSync(join(pinnedPageDir, 'manifest.json'), JSON.stringify(pinnedPageManifest, null, 2));

  // Determine output path
  const outputPath =
    opts.outputPath || join(dirname(opts.inputPath), `${baseName}.streamDeckProfile`);

  // Zip the profile folder
  await generateZip(tempDir, outputPath);

  // Clean up temp directory
  rmSync(tempDir, { recursive: true, force: true });

  console.log(`✅ Profile generated: ${outputPath}`);
}

/**
 * Validate options
 */
function validateOptions(options: Options): void {
  if (!options.inputPath) {
    throw new Error('inputPath is required');
  }

  if (options.deviceId && !DEVICES[options.deviceId]) {
    throw new Error(`Invalid device ID: ${options.deviceId}`);
  }

  if (options.fontSize && (options.fontSize < 1 || options.fontSize > 72)) {
    throw new Error('fontSize must be between 1 and 72');
  }
}

/**
 * Build a cache of icon files in the icons directory
 * Returns a Map of icon ID to full file path
 */
function buildIconsCache(iconsDir?: string): Map<string, string> | null {
  if (!iconsDir || !existsSync(iconsDir)) {
    return null;
  }

  const cache = new Map<string, string>();
  const iconExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'];

  try {
    const files = readdirSync(iconsDir);
    for (const file of files) {
      const ext = extname(file);
      if (iconExtensions.includes(ext.toLowerCase())) {
        const id = basename(file, ext);
        cache.set(id, join(iconsDir, file));
      }
    }
  } catch {
    // If directory can't be read, return empty cache
    console.warn(`Warning: Could not read icons directory: ${iconsDir}`);
  }

  return cache;
}

/**
 * Generate button image for a hotkey
 */
async function generateButtonImage(
  hotkey: { id: string; label: string; color?: string },
  outputPath: string,
  options: Required<Omit<Options, 'outputPath' | 'iconsDir'>> & Pick<Options, 'iconsDir'>,
  iconsCache: Map<string, string> | null,
  imageCache: Map<string, CanvasRenderingContext2D>,
): Promise<void> {
  // Check if custom icon exists in cache
  const iconPath = iconsCache?.get(hotkey.id);
  if (iconPath) {
    copyFileSync(iconPath, outputPath);
    return;
  }

  const cacheOrCall = (key: string, fn: () => CanvasRenderingContext2D) => {
    let ctx = imageCache.get(key);
    if (!ctx) {
      ctx = fn();
      imageCache.set(key, ctx);
    }
    return ctx;
  };

  // If color is provided, generate or use cached colored image
  if (hotkey.color) {
    const ctx = cacheOrCall(`fill-${hotkey.color}`, () =>
      generateImage('fill', DEFAULT_BUTTON_SIZE, hotkey.color),
    );
    saveImage(ctx, outputPath);
    return;
  }

  // Otherwise, generate or use cached button style image
  const ctx = cacheOrCall(`style-${options.buttonStyle}`, () =>
    generateImage(options.buttonStyle, DEFAULT_BUTTON_SIZE),
  );

  saveImage(ctx, outputPath);
}
