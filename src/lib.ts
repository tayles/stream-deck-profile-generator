import type { DeviceId } from "./types/device-types";
import type { ButtonStyle, LabelPosition, LabelStyle } from "./types/types";

export interface Options {
  inputPath: string;
  outputPath?: string;
  deviceId?: DeviceId;
  buttonStyle?: ButtonStyle;
  labelStyle?: LabelStyle;
  labelPosition?: LabelPosition;
  color?: string;
  fontSize?: number;
  iconDir?: string;
}

export const DEFAULT_OPTIONS: Omit<Options, 'inputPath' | 'outputPath' | 'iconDir'> = {
  deviceId: 'mk',
  buttonStyle: 'basic',
  labelStyle: 'both',
  labelPosition: 'middle',
  color: 'black',
  fontSize: 14,
};

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
export function generateStreamDeckProfile(options: Options): void {
  // merge with default options

  // validate the inputs

  // extract filename without extension from inputPath to use as profile name

  // check the file paths exist

  // empty the out/ dir

  // read and parse the CSV file

  // calculate the pages

  // create the profile folder structure

  // write the manifest.json files

  // copy the button images from button-styles/, one for each button

  // zip the profile folder into a .streamDeckProfile file

  // done
}
