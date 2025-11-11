import type { DeviceId } from "./types/device-types";
import type { ButtonStyle, LabelPosition, LabelStyle } from "./types/types";

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
}

export const DEFAULT_OPTIONS: Omit<Options, 'inputPath' | 'outputPath' | 'iconsDir'> = {
  deviceId: 'mk',
  buttonStyle: 'basic',
  labelStyle: 'both',
  labelPosition: 'middle',
  bgColor: 'black',
  textColor: 'white',
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

  // create an image for each hotkey
  // if iconDir is provided, see if an icon exists for the hotkey and use that
  // if not, if the color is provided for the hotkey, generate a colored image using generateImage()
  // otherwise, copy the relevant button style image from button-styles/

  // zip the profile folder into a .streamDeckProfile file
  // if no outputPath is provided, use <input-filename>.streamDeckProfile and the same dir as inputPath

  // done
}
