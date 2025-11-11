# Stream Deck Profile Generator

Generate custom Stream Deck profiles for any application by importing a CSV of hotkey keyboard shortcuts.

## Usage

Create a CSV file with the following columns:

- `Hotkey`: The keyboard shortcut (e.g., `Ctrl C`)
- `Label`: The label to display on the button (e.g., `Copy`)
- `Page`: The name of the page to place the button on (e.g., `Page One`) _(optional)_
- `Id`: A unique identifier for the button (e.g. `copy`) _(optional)_
- `Color`: The button color (e.g. `red` or `#FF0000`) _(optional)_

If any of these optional columns are omitted, sensible defaults will be used:

- `Page`: Pages will be created as needed to fit all buttons
- `Id`: A unique ID will be generated based on the label
- `Color`: Default button color will be used

Run the generator with your CSV file:

```shell
bun run generate \
  --input hotkeys.csv \
  --output MyProfile.streamDeckProfile
```

All available options:

```shell
bun run generate \
  --input hotkeys.csv \
  --output MyProfile.streamDeckProfile
  --device mk
  --style border
  --color red
  --font-size 14
  --icon-dir ~/path/to/icons
```

## CLI Options

- `--input <path>`: Path to the input CSV file _(required)_
- `--output <path>`: Path to the output `.streamDeckProfile` file _(defaults to `<input-filename>.streamDeckProfile`)_
- `--device <deviceId>`: Stream Deck device ID (e.g., `mk`, `xl`, `mini`) _(defaults to `mk`)_
- `--style <style>`: Button style (e.g., `border`, `fill`, `icon`) _(defaults to `border`)_
- `--color <color>`: Default button color (e.g., `red`, `#FF0000`) _(defaults to `black`)_
- `--font-size <size>`: Default button font size (e.g., `14`, `9`) _(defaults to `14`)_
- `--icon-dir <path>`: Path to a directory containing PNG icons. Matches on the id _(optional)_

## Button Styles

Button styles are defined in [button-styles/](button-styles/):

- `basic`: Button with a filled background color
- `border`: Button with a border around the label
- `rainbow`: Button with a rainbow border

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
