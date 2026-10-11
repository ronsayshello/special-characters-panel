# Special Characters Panel

A searchable, categorized panel of special characters for Obsidian. Click a symbol to copy it **and** insert it at the cursor.

## Features

- Sidebar panel with real-time search by character, name, HTML entity or Unicode code point (`rarr`, `2192`, `U+2192`, `right arrow`)
- About 590 symbols in 8 categories: Arrows, Math Symbols, Currency, Bullets & Lists, Dingbats, Accented Latin, Greek Letters, Punctuation
- Click to copy and insert into the last note you were editing
- Favourites: right-click (or long-press on touch devices) a symbol to pin it
- Recently used row
- Follows your light/dark theme

## Usage

Open the panel from the sigma ribbon icon or run **Open Panel** from the command palette. **Close Panel** is also available as a command.

## Settings

- Symbol size (small / medium / large)
- Show or hide the category tabs, recently used row and symbol count
- Insert as character or HTML entity (for example `&rarr;`)
- Add a trailing space after the symbol
- Close the panel automatically after inserting

## Adding your own symbols

Create `custom-symbols.json` in the plugin folder (`<vault>/.obsidian/plugins/special-characters-panel/`) and reload the plugin. Each entry is `[character, name, optionalEntityName]`:

```json
{
  "My Symbols": [
    ["☕", "hot beverage"],
    ["→", "rightwards arrow", "rarr"]
  ]
}
```

Using an existing category name adds to that category.

## Manual installation

Copy `main.js`, `manifest.json` and `styles.css` into `<vault>/.obsidian/plugins/special-characters-panel/`, then enable the plugin in Settings → Community plugins.

## Development

The symbol data lives in `symbols.json` and is embedded into `main.js` by a build step. After editing `symbols.json`, run:

```
node build.js
```

## License

MIT
