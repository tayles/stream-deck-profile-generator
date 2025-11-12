# Stream Deck Profile Generator

Generate custom Stream Deck profiles for any application by importing a CSV of hotkeys / keyboard shortcuts.

## Usage

Create a CSV file with the following columns:

- `Hotkey`: The keyboard shortcut (e.g., `Ctrl C`)
- `Label`: The label to display on the button (e.g., `Copy`)
- `Page`: The name of the page to place the button on (e.g., `Page One`) _(optional)_
- `Id`: A unique identifier for the button (e.g. `copy`) _(optional)_
- `Color`: The button color (e.g. `red` or `#FF0000`) _(optional)_

If any of these optional columns are omitted, sensible defaults will be used:

- `Page`: Pages will be created as needed to fit all buttons (including space for navigation buttons)
- `Id`: A unique ID will be generated based on the label
- `Color`: Default button color will be used

Run the generator with your CSV file:

```shell
bun run generate --input hotkeys.csv
```

Or specify any of the available options:

```shell
bun run generate \
  --input hotkeys.csv \
  --output MyProfile.streamDeckProfile \
  --profile-name "My Custom Profile" \
  --app-path '/Applications/YourApp.app' \
  --device mk \
  --button-style basic \
  --label-style both \
  --label-position middle \
  --bg-color black \
  --text-color white \
  --font-size 14 \
  --icons-dir ~/path/to/icons
```

## CLI Options

| Option                        | Description                                                                               | Default                              |
| ----------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------ |
| `--input <path>`              | Path to the input CSV file                                                                | _(required)_                         |
| `--output <path>`             | Path to the output `.streamDeckProfile` file                                              | `<input-filename>.streamDeckProfile` |
| `--profile-name <name>`       | Name of the profile                                                                       | `<input-filename>`                   |
| `--app-path <path>`           | Path to the application to switch to for this profile                                     | _(optional)_                         |
| `--device <type>`             | Stream Deck model (e.g., `mk`, `xl`, `mini`)                                              | `mk`                                 |
| `--button-style <style>`      | Button style (e.g., `basic`, `border`, `rainbow`, `fill`)                                 | `basic`                              |
| `--label-style <style>`       | Label style (e.g., `label`, `hotkey`, `both`, `none`)                                     | `both`                               |
| `--label-position <position>` | Label vertical position (e.g., `top`, `middle`, `bottom`)                                 | `middle`                             |
| `--bg-color <color>`          | Default button background color (e.g., `red`, `#FF0000`)                                  | `black`                              |
| `--text-color <color>`        | Default button text color (e.g., `white`, `#FFFFFF`)                                      | `white`                              |
| `--font-size <size>`          | Default button font size                                                                  | `14`                                 |
| `--icons-dir <path>`          | Path to a directory containing SVG, PNG, JPG, GIF or WEBP icons. Matches on the hotkey id | _(optional)_                         |

## Button Styles

Button styles are defined in [button-styles/](button-styles/):

| Preview                               | Style     | Description                                                     |
| ------------------------------------- | --------- | --------------------------------------------------------------- |
| ![basic](button-styles/basic.png)     | `basic`   | Button with a dark gradient background color                    |
| ![border](button-styles/border.png)   | `border`  | Button with a border around the label                           |
| ![rainbow](button-styles/rainbow.png) | `rainbow` | Button with a rainbow border                                    |
| ![fill](button-styles/fill.png)       | `fill`    | Button with a filled background color (defined by `--bg-color`) |

## Screenshots

|                                                                                               |                                                                                                    |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Basic**<br>![Basic](docs/screenshots/chrome-hotkeys-macos-basic-preview.png)                | **Border**<br>![Border](docs/screenshots/chrome-hotkeys-macos-border-preview.png)                  |
| **Rainbow**<br>![Rainbow](docs/screenshots/chrome-hotkeys-macos-rainbow-preview.png)          | **Fill (Custom Colors)**<br>![Fill](docs/screenshots/chrome-hotkeys-macos-fill-preview.png)        |
| **Icons**<br>![Icons](docs/screenshots/chrome-hotkeys-macos-icons-preview.png)                |                                                                                                    |
| **Next/Prev Navigation Buttons**<br>![Navigation](docs/screenshots/macos-hotkeys-preview.png) | **Customise Individual Buttons**<br>![Fill](docs/screenshots/rainbow-virtual-keyboard-preview.png) |

## Development

To install dependencies:

```shell
bun install
```

To run:

```shell
bun run generate --input path/to/hotkeys.csv --output MyProfile.streamDeckProfile
```

To test:

```shell
bun test
```

To regenerate example profiles:

```shell
bun run generate:examples
```

To generate button style images:

```shell
bun run generate:button-styles
```
