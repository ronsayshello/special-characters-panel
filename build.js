// Embeds symbols.json into main.js (between the SYMBOLS_START / SYMBOLS_END markers).
// Usage: node build.js
// Obsidian only ships main.js, manifest.json and styles.css from a release,
// so the symbol data has to live inside main.js.
const fs = require("fs");

const data = JSON.parse(fs.readFileSync("symbols.json", "utf8"));
const json = JSON.stringify(data);
let src = fs.readFileSync("main.js", "utf8");

const re = /\/\*SYMBOLS_START\*\/[\s\S]*?\/\*SYMBOLS_END\*\//;
if (!re.test(src)) {
  console.error("Markers not found in main.js");
  process.exit(1);
}
src = src.replace(re, () => `/*SYMBOLS_START*/ ${json} /*SYMBOLS_END*/`);
fs.writeFileSync("main.js", src);

const count = Object.values(data).reduce((n, a) => n + a.length, 0);
console.log(`Embedded ${count} symbols in ${Object.keys(data).length} categories.`);
