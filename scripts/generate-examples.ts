/**
 * This script generates profiles for all CSV files in the examples/ directory.
 *
 * Usage:
 *   bun generate:examples
 */

import { generateStreamDeckProfile } from '../src/lib';

await generateStreamDeckProfile({
  inputPath: 'examples/chrome-hotkeys-macos.csv',
  profileName: 'Chrome Hotkeys (macOS)',
  appPath: '/Applications/Google Chrome.app',
});

await generateStreamDeckProfile({
  inputPath: 'examples/chrome-hotkeys-windows.csv',
  profileName: 'Chrome Hotkeys (Windows)',
  appPath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});

await generateStreamDeckProfile({
  inputPath: 'examples/rainbow-virtual-keyboard.csv',
  profileName: 'Rainbow Virtual Keyboard',
  fontSize: 24,
  labelStyle: 'label',
});

await generateStreamDeckProfile({
  inputPath: 'examples/single-hotkey.csv',
  profileName: 'Single Hotkey',
  fontSize: 24,
  labelStyle: 'label',
  buttonStyle: 'rainbow',
});
