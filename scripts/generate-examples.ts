/**
 * This script generates profiles for all CSV files in the examples/ directory.
 *
 * Usage:
 *   bun generate:examples
 */

import { generateStreamDeckProfile } from '../src/lib';

/**
 * Google Chrome keyboard shortcuts for macOS
 *
 * @see https://support.google.com/chrome/answer/157179
 */
await generateStreamDeckProfile({
  inputPath: 'examples/chrome-hotkeys-macos.csv',
  profileName: 'Chrome Hotkeys (macOS)',
  appPath: '/Applications/Google Chrome.app',
});

/**
 * Google Chrome keyboard shortcuts for Windows, using Twemoji icons
 *
 * @see https://support.google.com/chrome/answer/157179
 * @see https://github.com/boywithkeyboard-archive/twemoji_svg
 * @see https://github.com/twitter/twemoji
 */
await generateStreamDeckProfile({
  inputPath: 'examples/chrome-hotkeys-windows.csv',
  profileName: 'Chrome Hotkeys (Windows)',
  appPath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  iconsDir: '../twemoji_svg/files',
  labelStyle: 'label',
});

/**
 * A simple profile demonstrating how to customise colors for individual buttons
 */
await generateStreamDeckProfile({
  inputPath: 'examples/rainbow-virtual-keyboard.csv',
  profileName: 'Rainbow Virtual Keyboard',
  fontSize: 24,
  labelStyle: 'label',
});

/**
 * A profile with a single hotkey for testing
 */
await generateStreamDeckProfile({
  inputPath: 'examples/single-hotkey.csv',
  profileName: 'Single Hotkey',
  fontSize: 24,
  labelStyle: 'label',
});

/**
 * macOS keyboard shortcuts, grouped into multiple pages
 *
 * @see https://support.apple.com/en-ca/102650
 */
await generateStreamDeckProfile({
  inputPath: 'examples/macos-hotkeys.csv',
  profileName: 'macOS Hotkeys',
});
