#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { generateStreamDeckProfile, type Options } from './lib';
import { DEVICES, type DeviceId } from './types/device-types';
import { BUTTON_STYLES, LABEL_POSITIONS, LABEL_STYLES } from './types/types';

const USAGE = `
Usage: bun run generate [options]

Generate a Stream Deck profile from a CSV file.

Required Options:
  --input <path>              Path to the input CSV file

Optional:
  --output <path>             Path to the output .streamDeckProfile file
                              (defaults to <input-filename>.streamDeckProfile)
  --profile-name <name>       Name of the profile
  --app-path <path>           Path to the application to switch to for this profile
  --device <type>             Stream Deck model: ${Object.keys(DEVICES).join(', ')}
                              (default: mk)
  --button-style <style>      Button style: ${BUTTON_STYLES.join(', ')}
                              (default: basic)
  --label-style <style>       Label style: ${LABEL_STYLES.join(', ')}
                              (default: both)
  --label-position <pos>      Label position: ${LABEL_POSITIONS.join(', ')}
                              (default: middle)
  --bg-color <color>          Default button background color
                              (default: black)
  --text-color <color>        Default button text color
                              (default: white)
  --font-size <size>          Default button font size (1-72)
                              (default: 14)
  --icons-dir <path>          Path to directory containing custom icons
  --help, -h                  Show this help message

Examples:
  bun run generate --input hotkeys.csv
  bun run generate --input hotkeys.csv --output MyProfile.streamDeckProfile
  bun run generate --input hotkeys.csv --profile-name 'My Custom Profile' --app-path '/Applications/SomeApp.app'
  bun run generate --input hotkeys.csv --device xl --button-style rainbow
  bun run generate --input hotkeys.csv --icons-dir ./icons --bg-color blue
`;

async function main() {
  try {
    const { values } = parseArgs({
      args: process.argv.slice(2),
      options: {
        input: { type: 'string' },
        output: { type: 'string' },
        'profile-name': { type: 'string' },
        'app-path': { type: 'string' },
        device: { type: 'string' },
        'button-style': { type: 'string' },
        'label-style': { type: 'string' },
        'label-position': { type: 'string' },
        'bg-color': { type: 'string' },
        'text-color': { type: 'string' },
        'font-size': { type: 'string' },
        'icons-dir': { type: 'string' },
        help: { type: 'boolean', short: 'h' },
      },
      allowPositionals: false,
    });

    // Show help
    if (values.help) {
      console.log(USAGE);
      process.exit(0);
    }

    // Validate required arguments
    if (!values.input) {
      console.error('❌ Error: --input is required\n');
      console.log(USAGE);
      process.exit(1);
    }

    // Build options
    const options: Options = {
      inputPath: values.input,
    };

    if (values.output) {
      options.outputPath = values.output;
    }

    if (values['profile-name']) {
      options.profileName = values['profile-name'];
    }

    if (values['app-path']) {
      options.appPath = values['app-path'];
    }

    if (values.device) {
      if (!Object.keys(DEVICES).includes(values.device)) {
        console.error(`❌ Error: Invalid device ID: ${values.device}`);
        console.error(`Valid options: ${Object.keys(DEVICES).join(', ')}`);
        process.exit(1);
      }
      options.deviceId = values.device as DeviceId;
    }

    if (values['button-style']) {
      if (!BUTTON_STYLES.includes(values['button-style'] as any)) {
        console.error(`❌ Error: Invalid button style: ${values['button-style']}`);
        console.error(`Valid options: ${BUTTON_STYLES.join(', ')}`);
        process.exit(1);
      }
      options.buttonStyle = values['button-style'] as any;
    }

    if (values['label-style']) {
      if (!LABEL_STYLES.includes(values['label-style'] as any)) {
        console.error(`❌ Error: Invalid label style: ${values['label-style']}`);
        console.error(`Valid options: ${LABEL_STYLES.join(', ')}`);
        process.exit(1);
      }
      options.labelStyle = values['label-style'] as any;
    }

    if (values['label-position']) {
      if (!LABEL_POSITIONS.includes(values['label-position'] as any)) {
        console.error(`❌ Error: Invalid label position: ${values['label-position']}`);
        console.error(`Valid options: ${LABEL_POSITIONS.join(', ')}`);
        process.exit(1);
      }
      options.labelPosition = values['label-position'] as any;
    }

    if (values['bg-color']) {
      options.bgColor = values['bg-color'];
    }

    if (values['text-color']) {
      options.textColor = values['text-color'];
    }

    if (values['font-size']) {
      const fontSize = parseInt(values['font-size'], 10);
      if (isNaN(fontSize) || fontSize < 1 || fontSize > 72) {
        console.error('❌ Error: Font size must be a number between 1 and 72');
        process.exit(1);
      }
      options.fontSize = fontSize;
    }

    if (values['icons-dir']) {
      options.iconsDir = values['icons-dir'];
    }

    // Generate profile
    console.log('🚀 Generating Stream Deck profile...\n');
    await generateStreamDeckProfile(options);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
