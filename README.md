# Stream Deck Profile Generator

![stream-deck-profile-generator](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/stream-deck-profile-generator-hero.png)

Generate custom Stream Deck profiles for any application by importing a CSV of hotkeys / keyboard shortcuts.

## Usage

Create a CSV file with the following columns:

- `Hotkey`: The keyboard shortcut (e.g. `Ctrl C`)
- `Label`: The label to display on the button (e.g. `Copy`)
- `Page`: The name of the page to place the button on (e.g. `Page One`) _(optional)_
- `Id`: A unique identifier for the button (e.g. `copy`) _(optional)_
- `Color`: The button color (e.g. `red` or `#FF0000`) _(optional)_

If any of these optional columns are omitted, sensible defaults will be used:

- `Page`: Pages will be created as needed to fit all buttons (including space for navigation buttons)
- `Id`: A unique ID will be generated based on the label
- `Color`: Default button color will be used

Run the generator with your CSV file:

```shell
stream-deck-profile-generator --input hotkeys.csv
```

Or specify any of the available options:

```shell
stream-deck-profile-generator \
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
| `--device <type>`             | Stream Deck model (e.g. `mk`, `xl`, `mini`)                                               | `mk`                                 |
| `--button-style <style>`      | Button style (e.g. `basic`, `border`, `rainbow`, `fill`)                                  | `basic`                              |
| `--label-style <style>`       | Label style (e.g. `label`, `hotkey`, `both`, `none`)                                      | `both`                               |
| `--label-position <position>` | Label vertical position (e.g. `top`, `middle`, `bottom`)                                  | `middle`                             |
| `--bg-color <color>`          | Default button background color (e.g. `red`, `#FF0000`)                                   | `black`                              |
| `--text-color <color>`        | Default button text color (e.g. `white`, `#FFFFFF`)                                       | `white`                              |
| `--font-size <size>`          | Default button font size                                                                  | `14`                                 |
| `--icons-dir <path>`          | Path to a directory containing SVG, PNG, JPG, GIF or WEBP icons. Matches on the hotkey id | _(optional)_                         |
| `--icon-padding <percent>`    | Padding around icons as a percentage of the button size                                   | `10`                                 |

## Button Styles

Button styles are defined in [docs/button-styles/](docs/button-styles/):

| Preview                                                                                                                | Style     | Description                                                     |
| ---------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------- |
| ![basic](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/button-styles/basic.png)     | `basic`   | Button with a dark gradient background color                    |
| ![border](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/button-styles/border.png)   | `border`  | Button with a border around the label                           |
| ![rainbow](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/button-styles/rainbow.png) | `rainbow` | Button with a rainbow border                                    |
| ![fill](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/button-styles/filled.png)     | `fill`    | Button with a filled background color (defined by `--bg-color`) |

## Examples

Some example profiles are available in the [examples/](examples/) directory.

### Chrome Hotkeys (macOS)

- Input: [chrome-hotkeys-macos.csv](examples/chrome-hotkeys-macos.csv)
- Generated Profile: [chrome-hotkeys-macos.streamDeckProfile](examples/chrome-hotkeys-macos.streamDeckProfile)

#### Basic Button Style

![Basic](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/screenshots/chrome-hotkeys-macos-basic-preview.png)

```shell
stream-deck-profile-generator --input examples/chrome-hotkeys-macos.csv --profile-name "Chrome Hotkeys (macOS)" --app-path "/Applications/Google Chrome.app"
```

#### Border Button Style

![Border](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/screenshots/chrome-hotkeys-macos-border-preview.png)

```shell
stream-deck-profile-generator --input examples/chrome-hotkeys-macos.csv --button-style border
```

#### Rainbow Button Style

![Rainbow](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/screenshots/chrome-hotkeys-macos-rainbow-preview.png)

```shell
stream-deck-profile-generator --input examples/chrome-hotkeys-macos.csv --button-style rainbow
```

#### Fill Button Style (Custom Colors)

![Fill](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/screenshots/chrome-hotkeys-macos-fill-preview.png)

```shell
stream-deck-profile-generator --input examples/chrome-hotkeys-macos.csv --bg-color purple --text-color yellow
```

### Chrome Hotkeys (Windows) with Icons

- Input: [chrome-hotkeys-windows.csv](examples/chrome-hotkeys-windows.csv)
- Generated Profile: [chrome-hotkeys-windows.streamDeckProfile](examples/chrome-hotkeys-windows.streamDeckProfile)

This includes an `Id` column to match against icon filenames in the `--icon-path` directory.

This example uses [Twemoji](https://github.com/twitter/twemoji) SVG icons from [boywithkeyboard-archive/twemoji_svg](https://github.com/boywithkeyboard-archive/twemoji_svg):

![Icons](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/screenshots/chrome-hotkeys-windows-icons-preview.png)

```shell
stream-deck-profile-generator --input examples/chrome-hotkeys-windows.csv --icons-dir ~/path/to/twemoji_svg/files --label-style label
```

### Navigation Buttons

- Input: [macos-hotkeys.csv](examples/macos-hotkeys.csv)
- Generated Profile: [macos-hotkeys.streamDeckProfile](examples/macos-hotkeys.streamDeckProfile)

If there are more than 2 pages, Previous/Next navigation buttons will be automatically added to each page in the bottom right corner. This example also demonstrates using a `Page` column to group buttons onto different pages:

![Navigation](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/screenshots/macos-hotkeys-preview.png)

```shell
stream-deck-profile-generator --input examples/macos-hotkeys.csv
```

### Customising Individual Buttons

- Input: [rainbow-virtual-keyboard.csv](examples/rainbow-virtual-keyboard.csv)
- Generated Profile: [rainbow-virtual-keyboard.streamDeckProfile](examples/rainbow-virtual-keyboard.streamDeckProfile)

This includes a `Color` column to customise individual button colors:

![Fill](https://raw.githubusercontent.com/tayles/stream-deck-profile-generator/main/docs/screenshots/rainbow-virtual-keyboard-preview.png)

```shell
stream-deck-profile-generator --input examples/rainbow-virtual-keyboard.csv --font-size 24 --label-style label
```

## Hotkeys

The parser accepts various formats and aliases. Use either a space or `+` to separate keys.

Some common supported keys are:

- `Meta`, `Cmd`, `Command`, `Windows`, `Win`, `⌘`, `⊞`
- `Control`, `Ctrl`, `^`
- `Alt`, `Option`, `⌥`
- `Shift`, `⇧`
- `Enter`, `Return`, `↵`
- `Escape`, `Esc`, `⎋`
- `Backspace`, `⌫`
- `Tab`, `⇥`
- `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `↑`, `↓`, `←`, `→`
- `Space`, `␣`
- `CapsLock`, `⇪`
- `PageUp`, `PageDown`, `Home`, `End`, `⇞`, `⇟`, `⇱`, `⇲`
- `MediaPlayPause`, `MediaPlayPause`, `MediaPause`, `MediaStop`, `MediaTrackPrevious`, `MediaTrackNext`, `▶`, `⏯`, `⏸`, `⏹`, `⏮`, `⏭`

For example, all of the following are equivalent:

- `Meta + C`
- `Cmd C`
- `Command C`
- `⌘ C` - _(unicode characters supported)_
- `Windows C`
- `Win C`
- `⊞ C`
- `cmd c` - _(case insensitive)_
- `Command + C` - _(using `+` instead of space)_

See [Key values for keyboard events on MDN](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) for a list of valid key values and [`hotkey-aliases.ts`](src/utils/hotkey-aliases.ts) for a list of supported aliases.

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

To run linting and formatting checks (with auto-fixing):

```shell
bun fix
```

To regenerate example profiles:

```shell
bun run generate:examples
```

To generate button style images:

```shell
bun run generate:button-styles
```
