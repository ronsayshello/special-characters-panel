"use strict";

const {
  Plugin,
  ItemView,
  Notice,
  MarkdownView,
  PluginSettingTab,
  Setting,
  Menu,
  setIcon,
} = require("obsidian");

/* ------------------------------------------------------------------ *
 *  Constants
 * ------------------------------------------------------------------ */

const VIEW_TYPE = "special-characters-panel-view";
const ICON = "sigma";
const MAX_RECENT = 24;
const ALL = "All";
const LONG_PRESS_MS = 500;
const SIZES = ["small", "medium", "large"];

// Filled in by `node build.js` from symbols.json. Do not edit between the markers.
const SYMBOL_DATA = /*SYMBOLS_START*/ {"Arrows":[["←","leftwards arrow","larr"],["↑","upwards arrow","uarr"],["→","rightwards arrow","rarr"],["↓","downwards arrow","darr"],["↔","left right arrow","harr"],["↕","up down arrow"],["↖","north west arrow"],["↗","north east arrow"],["↘","south east arrow"],["↙","south west arrow"],["⇐","leftwards double arrow","lArr"],["⇑","upwards double arrow","uArr"],["⇒","rightwards double arrow","rArr"],["⇓","downwards double arrow","dArr"],["⇔","left right double arrow","hArr"],["⇕","up down double arrow"],["↩","leftwards arrow with hook"],["↪","rightwards arrow with hook"],["↺","anticlockwise open circle arrow"],["↻","clockwise open circle arrow"],["↰","upwards arrow with tip leftwards"],["↱","upwards arrow with tip rightwards"],["↲","downwards arrow with tip leftwards"],["↳","downwards arrow with tip rightwards"],["↦","rightwards arrow from bar (maps to)"],["↤","leftwards arrow from bar"],["↠","rightwards two headed arrow"],["↞","leftwards two headed arrow"],["↣","rightwards arrow with tail"],["↢","leftwards arrow with tail"],["⇄","rightwards arrow over leftwards arrow"],["⇆","leftwards arrow over rightwards arrow"],["⇌","rightwards harpoon over leftwards harpoon"],["⇋","leftwards harpoon over rightwards harpoon"],["⇝","rightwards squiggle arrow"],["⇜","leftwards squiggle arrow"],["⟵","long leftwards arrow"],["⟶","long rightwards arrow"],["⟷","long left right arrow"],["⟸","long leftwards double arrow"],["⟹","long rightwards double arrow"],["⟺","long left right double arrow"],["➔","heavy wide-headed rightwards arrow"],["➜","heavy round-tipped rightwards arrow"],["➝","triangle-headed rightwards arrow"],["➞","heavy triangle-headed rightwards arrow"],["➡","black rightwards arrow"],["⬅","leftwards black arrow"],["⬆","upwards black arrow"],["⬇","downwards black arrow"],["⬈","north east black arrow"],["⬉","north west black arrow"],["⬊","south east black arrow"],["⬋","south west black arrow"]],"Math Symbols":[["±","plus-minus sign","plusmn"],["∓","minus-or-plus sign"],["×","multiplication sign","times"],["÷","division sign","divide"],["−","minus sign","minus"],["≠","not equal to","ne"],["≈","almost equal to","asymp"],["≤","less-than or equal to","le"],["≥","greater-than or equal to","ge"],["≡","identical to","equiv"],["≢","not identical to"],["≪","much less-than"],["≫","much greater-than"],["≅","approximately equal to","cong"],["∼","tilde operator","sim"],["≃","asymptotically equal to"],["≔","colon equals"],["∝","proportional to","prop"],["∞","infinity","infin"],["√","square root","radic"],["∛","cube root"],["∜","fourth root"],["∑","n-ary summation","sum"],["∏","n-ary product","prod"],["∫","integral","int"],["∬","double integral"],["∭","triple integral"],["∮","contour integral"],["∂","partial differential","part"],["∇","nabla","nabla"],["∆","increment (delta)"],["∈","element of","isin"],["∉","not an element of","notin"],["∋","contains as member","ni"],["∌","does not contain as member"],["∀","for all","forall"],["∃","there exists","exist"],["∄","there does not exist"],["∅","empty set","empty"],["∪","union","cup"],["∩","intersection","cap"],["⊂","subset of","sub"],["⊃","superset of","sup"],["⊆","subset of or equal to","sube"],["⊇","superset of or equal to","supe"],["⊄","not a subset of","nsub"],["⊈","not a subset of or equal to"],["⊕","circled plus","oplus"],["⊗","circled times","otimes"],["⊥","up tack (perpendicular)","perp"],["∥","parallel to"],["∠","angle","ang"],["∧","logical and","and"],["∨","logical or","or"],["¬","not sign","not"],["∴","therefore","there4"],["∵","because"],["∘","ring operator"],["∙","bullet operator"],["⋅","dot operator","sdot"],["⊢","right tack (proves)"],["⊨","true (models)"],["⌈","left ceiling","lceil"],["⌉","right ceiling","rceil"],["⌊","left floor","lfloor"],["⌋","right floor","rfloor"],["¼","vulgar fraction one quarter","frac14"],["½","vulgar fraction one half","frac12"],["¾","vulgar fraction three quarters","frac34"],["⅓","vulgar fraction one third"],["⅔","vulgar fraction two thirds"],["⅛","vulgar fraction one eighth"],["⁰","superscript zero"],["¹","superscript one","sup1"],["²","superscript two","sup2"],["³","superscript three","sup3"],["⁴","superscript four"],["⁵","superscript five"],["⁶","superscript six"],["⁷","superscript seven"],["⁸","superscript eight"],["⁹","superscript nine"],["ⁿ","superscript latin small letter n"],["₀","subscript zero"],["₁","subscript one"],["₂","subscript two"],["₃","subscript three"],["₄","subscript four"],["₅","subscript five"],["₆","subscript six"],["₇","subscript seven"],["₈","subscript eight"],["₉","subscript nine"],["°","degree sign","deg"],["′","prime (minutes)","prime"],["″","double prime (seconds)","Prime"],["‰","per mille sign","permil"],["ℕ","double-struck capital n (naturals)"],["ℤ","double-struck capital z (integers)"],["ℚ","double-struck capital q (rationals)"],["ℝ","double-struck capital r (reals)"],["ℂ","double-struck capital c (complex)"]],"Currency":[["€","euro sign","euro"],["£","pound sign","pound"],["¥","yen sign","yen"],["¢","cent sign","cent"],["₹","indian rupee sign"],["₽","russian ruble sign"],["₿","bitcoin sign"],["$","dollar sign"],["¤","generic currency sign","curren"],["₩","won sign"],["₪","new sheqel sign"],["₫","dong sign"],["₺","turkish lira sign"],["₴","hryvnia sign"],["₱","peso sign"],["₦","naira sign"],["₡","colon sign"],["₭","kip sign"],["₮","tugrik sign"],["₲","guarani sign"],["₵","cedi sign"],["₸","tenge sign"],["₼","manat sign"],["₾","lari sign"],["฿","thai baht sign"],["₳","austral sign"],["₠","euro-currency sign"],["₢","cruzeiro sign"],["₣","french franc sign"],["₤","lira sign"],["₥","mill sign"],["₧","peseta sign"],["₨","rupee sign"],["₯","drachma sign"],["₰","german penny sign"],["₷","spesmilo sign"]],"Bullets & Lists":[["•","bullet","bull"],["◦","white bullet"],["▪","black small square"],["▫","white small square"],["●","black circle"],["○","white circle"],["◘","inverse bullet"],["◙","inverse white circle"],["◊","lozenge","loz"],["‣","triangular bullet"],["⁃","hyphen bullet"],["‧","hyphenation point"],["■","black square"],["□","white square"],["▲","black up-pointing triangle"],["△","white up-pointing triangle"],["▶","black right-pointing triangle"],["▷","white right-pointing triangle"],["▼","black down-pointing triangle"],["▽","white down-pointing triangle"],["◀","black left-pointing triangle"],["◁","white left-pointing triangle"],["►","black right-pointing pointer"],["◄","black left-pointing pointer"],["◆","black diamond"],["◇","white diamond"],["◈","white diamond containing black small diamond"],["◉","fisheye"],["◎","bullseye"],["⦿","circled bullet"],["⦾","circled white bullet"],["❍","shadowed white circle"],["★","black star"],["☆","white star"],["☐","ballot box"],["☑","ballot box with check"],["☒","ballot box with x"],["⁌","black leftwards bullet"],["⁍","black rightwards bullet"],["❖","black diamond minus white x"],["➢","three-d top-lighted rightwards arrowhead"],["➤","black rightwards arrowhead"],["▬","black rectangle"],["▮","black vertical rectangle"],["◐","circle with left half black"],["◑","circle with right half black"],["◒","circle with lower half black"],["◓","circle with upper half black"]],"Dingbats":[["✓","check mark"],["✔","heavy check mark"],["✗","ballot x"],["✘","heavy ballot x"],["✕","multiplication x"],["✖","heavy multiplication x"],["✙","outlined greek cross"],["✚","heavy greek cross"],["✛","open centre cross"],["✜","heavy open centre cross"],["✝","latin cross"],["✞","shadowed white latin cross"],["✟","outlined latin cross"],["✠","maltese cross"],["✡","star of david"],["✢","four teardrop-spoked asterisk"],["✣","four balloon-spoked asterisk"],["✤","heavy four balloon-spoked asterisk"],["✥","four club-spoked asterisk"],["✦","black four pointed star"],["✧","white four pointed star"],["✩","stress outlined white star"],["✪","circled white star"],["✫","open centre black star"],["✬","black centre white star"],["✭","outlined black star"],["✮","heavy outlined black star"],["✯","pinwheel star"],["✰","shadowed white star"],["✱","heavy asterisk"],["✲","open centre asterisk"],["✳","eight spoked asterisk"],["✴","eight pointed black star"],["✵","eight pointed pinwheel star"],["✶","six pointed black star"],["✷","eight pointed rectilinear black star"],["✸","heavy eight pointed rectilinear black star"],["✹","twelve pointed black star"],["✺","sixteen pointed asterisk"],["✻","teardrop-spoked asterisk"],["✼","open centre teardrop-spoked asterisk"],["✽","heavy teardrop-spoked asterisk"],["✾","six petalled black and white florette"],["✿","black florette"],["❀","white florette"],["❁","eight petalled outlined black florette"],["❂","circled open centre eight pointed star"],["❃","heavy teardrop-spoked pinwheel asterisk"],["❄","snowflake"],["❅","tight trifoliate snowflake"],["❆","heavy chevron snowflake"],["❇","sparkle"],["❈","heavy sparkle"],["❉","balloon-spoked asterisk"],["❊","eight teardrop-spoked propeller asterisk"],["❋","heavy eight teardrop-spoked propeller asterisk"],["❶","dingbat negative circled digit one"],["❷","dingbat negative circled digit two"],["❸","dingbat negative circled digit three"],["❹","dingbat negative circled digit four"],["❺","dingbat negative circled digit five"],["❻","dingbat negative circled digit six"],["❼","dingbat negative circled digit seven"],["❽","dingbat negative circled digit eight"],["❾","dingbat negative circled digit nine"],["❿","dingbat negative circled number ten"],["✂","black scissors"],["✆","telephone location sign"],["✈","airplane"],["✉","envelope"],["✌","victory hand"],["✍","writing hand"],["✎","lower right pencil"],["✏","pencil"],["✐","upper right pencil"],["✑","white nib"],["✒","black nib"],["☀","black sun with rays"],["☁","cloud"],["☂","umbrella"],["☎","black telephone"],["☏","white telephone"],["☘","shamrock"],["☛","black right pointing index"],["☞","white right pointing index"],["☜","white left pointing index"],["☝","white up pointing index"],["☟","white down pointing index"],["☠","skull and crossbones"],["☢","radioactive sign"],["☣","biohazard sign"],["☮","peace symbol"],["☯","yin yang"],["☹","white frowning face"],["☺","white smiling face"],["☻","black smiling face"],["♠","black spade suit","spades"],["♣","black club suit","clubs"],["♥","black heart suit","hearts"],["♦","black diamond suit","diams"],["♩","quarter note"],["♪","eighth note"],["♫","beamed eighth notes"],["♬","beamed sixteenth notes"],["♭","music flat sign"],["♮","music natural sign"],["♯","music sharp sign"],["⚠","warning sign"],["⚡","high voltage sign"]],"Accented Latin":[["À","A grave","Agrave"],["Á","A acute","Aacute"],["Â","A circumflex","Acirc"],["Ã","A tilde","Atilde"],["Ä","A diaeresis (umlaut)","Auml"],["Å","A ring above","Aring"],["Æ","AE ligature","AElig"],["Ç","C cedilla","Ccedil"],["È","E grave","Egrave"],["É","E acute","Eacute"],["Ê","E circumflex","Ecirc"],["Ë","E diaeresis","Euml"],["Ì","I grave","Igrave"],["Í","I acute","Iacute"],["Î","I circumflex","Icirc"],["Ï","I diaeresis","Iuml"],["Ð","Eth","ETH"],["Ñ","N tilde","Ntilde"],["Ò","O grave","Ograve"],["Ó","O acute","Oacute"],["Ô","O circumflex","Ocirc"],["Õ","O tilde","Otilde"],["Ö","O diaeresis (umlaut)","Ouml"],["Ø","O stroke","Oslash"],["Ù","U grave","Ugrave"],["Ú","U acute","Uacute"],["Û","U circumflex","Ucirc"],["Ü","U diaeresis (umlaut)","Uuml"],["Ý","Y acute","Yacute"],["Þ","Thorn","THORN"],["ß","sharp s (eszett)","szlig"],["à","a grave","agrave"],["á","a acute","aacute"],["â","a circumflex","acirc"],["ã","a tilde","atilde"],["ä","a diaeresis (umlaut)","auml"],["å","a ring above","aring"],["æ","ae ligature","aelig"],["ç","c cedilla","ccedil"],["è","e grave","egrave"],["é","e acute","eacute"],["ê","e circumflex","ecirc"],["ë","e diaeresis","euml"],["ì","i grave","igrave"],["í","i acute","iacute"],["î","i circumflex","icirc"],["ï","i diaeresis","iuml"],["ð","eth","eth"],["ñ","n tilde","ntilde"],["ò","o grave","ograve"],["ó","o acute","oacute"],["ô","o circumflex","ocirc"],["õ","o tilde","otilde"],["ö","o diaeresis (umlaut)","ouml"],["ø","o stroke","oslash"],["ù","u grave","ugrave"],["ú","u acute","uacute"],["û","u circumflex","ucirc"],["ü","u diaeresis (umlaut)","uuml"],["ý","y acute","yacute"],["þ","thorn","thorn"],["ÿ","y diaeresis","yuml"],["Ÿ","Y diaeresis","Yuml"],["Œ","OE ligature","OElig"],["œ","oe ligature","oelig"],["Š","S caron","Scaron"],["š","s caron","scaron"],["Ž","Z caron"],["ž","z caron"],["ƒ","f with hook","fnof"],["Ā","A macron"],["ā","a macron"],["Ă","A breve"],["ă","a breve"],["Ą","A ogonek"],["ą","a ogonek"],["Ć","C acute"],["ć","c acute"],["Č","C caron"],["č","c caron"],["Ď","D caron"],["ď","d caron"],["Đ","D stroke"],["đ","d stroke"],["Ē","E macron"],["ē","e macron"],["Ę","E ogonek"],["ę","e ogonek"],["Ě","E caron"],["ě","e caron"],["Ğ","G breve"],["ğ","g breve"],["Ī","I macron"],["ī","i macron"],["İ","I with dot above"],["ı","dotless i"],["Ł","L stroke"],["ł","l stroke"],["Ń","N acute"],["ń","n acute"],["Ň","N caron"],["ň","n caron"],["Ō","O macron"],["ō","o macron"],["Ő","O double acute"],["ő","o double acute"],["Ř","R caron"],["ř","r caron"],["Ś","S acute"],["ś","s acute"],["Ş","S cedilla"],["ş","s cedilla"],["Ť","T caron"],["ť","t caron"],["Ū","U macron"],["ū","u macron"],["Ů","U ring above"],["ů","u ring above"],["Ű","U double acute"],["ű","u double acute"],["Ź","Z acute"],["ź","z acute"],["Ż","Z dot above"],["ż","z dot above"]],"Greek Letters":[["Α","Alpha (capital)","Alpha"],["Β","Beta (capital)","Beta"],["Γ","Gamma (capital)","Gamma"],["Δ","Delta (capital)","Delta"],["Ε","Epsilon (capital)","Epsilon"],["Ζ","Zeta (capital)","Zeta"],["Η","Eta (capital)","Eta"],["Θ","Theta (capital)","Theta"],["Ι","Iota (capital)","Iota"],["Κ","Kappa (capital)","Kappa"],["Λ","Lambda (capital)","Lambda"],["Μ","Mu (capital)","Mu"],["Ν","Nu (capital)","Nu"],["Ξ","Xi (capital)","Xi"],["Ο","Omicron (capital)","Omicron"],["Π","Pi (capital)","Pi"],["Ρ","Rho (capital)","Rho"],["Σ","Sigma (capital)","Sigma"],["Τ","Tau (capital)","Tau"],["Υ","Upsilon (capital)","Upsilon"],["Φ","Phi (capital)","Phi"],["Χ","Chi (capital)","Chi"],["Ψ","Psi (capital)","Psi"],["Ω","Omega (capital)","Omega"],["α","alpha (small)","alpha"],["β","beta (small)","beta"],["γ","gamma (small)","gamma"],["δ","delta (small)","delta"],["ε","epsilon (small)","epsilon"],["ζ","zeta (small)","zeta"],["η","eta (small)","eta"],["θ","theta (small)","theta"],["ι","iota (small)","iota"],["κ","kappa (small)","kappa"],["λ","lambda (small)","lambda"],["μ","mu (small)","mu"],["ν","nu (small)","nu"],["ξ","xi (small)","xi"],["ο","omicron (small)","omicron"],["π","pi (small)","pi"],["ρ","rho (small)","rho"],["ς","final sigma (small)","sigmaf"],["σ","sigma (small)","sigma"],["τ","tau (small)","tau"],["υ","upsilon (small)","upsilon"],["φ","phi (small)","phi"],["χ","chi (small)","chi"],["ψ","psi (small)","psi"],["ω","omega (small)","omega"],["ϑ","theta symbol","thetasym"],["ϕ","phi symbol"],["ϖ","pi symbol","piv"],["ϵ","lunate epsilon symbol"],["ϰ","kappa symbol"],["ϱ","rho symbol"],["ϒ","upsilon with hook symbol","upsih"]],"Punctuation":[["–","en dash","ndash"],["—","em dash","mdash"],["‐","hyphen"],["‑","non-breaking hyphen"],["‒","figure dash"],["―","horizontal bar"],["‘","left single quotation mark","lsquo"],["’","right single quotation mark (apostrophe)","rsquo"],["‚","single low-9 quotation mark","sbquo"],["‛","single high-reversed-9 quotation mark"],["“","left double quotation mark","ldquo"],["”","right double quotation mark","rdquo"],["„","double low-9 quotation mark","bdquo"],["‟","double high-reversed-9 quotation mark"],["«","left-pointing double angle quotation mark","laquo"],["»","right-pointing double angle quotation mark","raquo"],["‹","single left-pointing angle quotation mark","lsaquo"],["›","single right-pointing angle quotation mark","rsaquo"],["…","horizontal ellipsis","hellip"],["‥","two dot leader"],["·","middle dot","middot"],["¡","inverted exclamation mark","iexcl"],["¿","inverted question mark","iquest"],["§","section sign","sect"],["¶","pilcrow (paragraph sign)","para"],["†","dagger","dagger"],["‡","double dagger","Dagger"],["‱","per ten thousand sign"],["‴","triple prime"],["※","reference mark"],["‼","double exclamation mark"],["⁇","double question mark"],["⁈","question exclamation mark"],["⁉","exclamation question mark"],["‽","interrobang"],["⁂","asterism"],["⁎","low asterisk"],["⁑","two asterisks aligned vertically"],["⁕","flower punctuation mark"],["❝","heavy double turned comma quotation mark ornament"],["❞","heavy double comma quotation mark ornament"],["©","copyright sign","copy"],["®","registered sign","reg"],["™","trade mark sign","trade"],["℠","service mark"],["№","numero sign"],["ª","feminine ordinal indicator","ordf"],["º","masculine ordinal indicator","ordm"],["¦","broken bar","brvbar"],["¨","diaeresis","uml"],["´","acute accent","acute"],["`","grave accent"],["¯","macron","macr"],["¸","cedilla","cedil"],["ˆ","modifier letter circumflex accent","circ"],["˜","small tilde","tilde"],["µ","micro sign","micro"],["℃","degree celsius"],["℉","degree fahrenheit"],["‹","single left angle quote"]]} /*SYMBOLS_END*/;

const DEFAULT_SETTINGS = {
  insertMode: "char", // "char" | "entity"
  symbolSize: "medium", // "small" | "medium" | "large"
  showTabs: true,
  showRecent: true,
  showCount: true,
  trailingSpace: false,
  autoClose: false,
  recent: [],
  favorites: [],
};

/* ------------------------------------------------------------------ *
 *  Data helpers
 *  symbols.json format:  { "Category": [ [char, name, entityName?], ... ] }
 *  Code point (U+XXXX) and a fallback numeric entity are computed here.
 * ------------------------------------------------------------------ */

function buildSymbolIndex(data) {
  const list = [];
  for (const [category, entries] of Object.entries(data)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      const [char, name, entity] = entry;
      if (!char) continue;
      const hex = char.codePointAt(0).toString(16).toUpperCase();
      list.push({
        char,
        name: name || "",
        category,
        code: "U+" + hex.padStart(4, "0"),
        entity: entity ? `&${entity};` : `&#x${hex};`,
      });
    }
  }
  return list;
}

function matchesQuery(sym, terms) {
  if (terms.length === 0) return true;
  const haystack = [
    sym.char,
    sym.name,
    sym.category,
    sym.code,
    sym.entity,
    sym.code.replace("U+", ""),
    sym.entity.replace(/[&;#]/g, ""),
  ]
    .join(" ")
    .toLowerCase();
  return terms.every((t) => haystack.includes(t));
}

/* ------------------------------------------------------------------ *
 *  Plugin
 * ------------------------------------------------------------------ */

module.exports = class SpecialCharactersPanelPlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    this.symbols = [];
    this.categories = [];
    this.symbolByChar = new Map();
    this.lastMarkdownLeaf = null;

    await this.loadSymbols();

    this.registerView(VIEW_TYPE, (leaf) => new SymbolsView(leaf, this));

    this.addRibbonIcon(ICON, "Open symbols panel", () => this.activateView());

    this.addCommand({
      id: "open-panel",
      name: "Open Panel",
      callback: () => this.activateView(),
    });

    this.addCommand({
      id: "close-panel",
      name: "Close Panel",
      callback: () => this.app.workspace.detachLeavesOfType(VIEW_TYPE),
    });

    this.addSettingTab(new SymbolsSettingTab(this.app, this));

    // Remember the last editor the user was in, because clicking the
    // sidebar makes the sidebar the "active" view.
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => this.trackLeaf(leaf))
    );
    this.app.workspace.onLayoutReady(() =>
      this.trackLeaf(this.app.workspace.getMostRecentLeaf())
    );
  }

  onunload() {
    // Views registered with registerView are cleaned up by Obsidian.
  }

  /* ---------- data loading ---------- */

  async loadSymbols() {
    const adapter = this.app.vault.adapter;
    const dir = this.manifest.dir;
    // Deep copy so user additions never mutate the embedded data
    const data = JSON.parse(JSON.stringify(SYMBOL_DATA));

    // Optional user file: add or extend categories without touching symbols.json
    try {
      const customPath = `${dir}/custom-symbols.json`;
      if (await adapter.exists(customPath)) {
        const custom = JSON.parse(await adapter.read(customPath));
        for (const [cat, entries] of Object.entries(custom)) {
          data[cat] = (data[cat] || []).concat(entries);
        }
      }
    } catch (err) {
      console.error("Special Characters Panel: could not read custom-symbols.json", err);
      new Notice("Special Characters Panel: custom-symbols.json is invalid");
    }

    this.symbols = buildSymbolIndex(data);
    this.categories = Object.keys(data);
    this.symbolByChar = new Map();
    for (const s of this.symbols) {
      if (!this.symbolByChar.has(s.char)) this.symbolByChar.set(s.char, s);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    if (!Array.isArray(this.settings.recent)) this.settings.recent = [];
    if (!Array.isArray(this.settings.favorites)) this.settings.favorites = [];
    if (!SIZES.includes(this.settings.symbolSize)) {
      this.settings.symbolSize = DEFAULT_SETTINGS.symbolSize;
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  /* ---------- view handling ---------- */

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];

    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      if (!leaf) return;
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
  }

  forEachView(fn) {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      if (leaf.view instanceof SymbolsView) fn(leaf.view);
    }
  }

  /** Re-render everything (used after a settings change). */
  refreshAll() {
    this.forEachView((v) => v.refresh());
  }

  refreshRecent() {
    this.forEachView((v) => v.renderRecent());
  }

  refreshFavorites() {
    this.forEachView((v) => {
      v.renderFavorites();
      v.updateFavoriteMarks();
    });
  }

  /* ---------- favourites ---------- */

  isFavorite(char) {
    return this.settings.favorites.includes(char);
  }

  async toggleFavorite(char) {
    const favs = this.settings.favorites;
    const i = favs.indexOf(char);
    if (i >= 0) favs.splice(i, 1);
    else favs.push(char);
    await this.saveSettings();
    this.refreshFavorites();
  }

  /* ---------- editor targeting ---------- */

  trackLeaf(leaf) {
    if (leaf && leaf.view instanceof MarkdownView) {
      this.lastMarkdownLeaf = leaf;
    }
  }

  getTargetEditorView() {
    const leaf = this.lastMarkdownLeaf;
    const stillOpen =
      leaf &&
      leaf.view instanceof MarkdownView &&
      this.app.workspace.getLeavesOfType("markdown").includes(leaf);
    if (stillOpen) return leaf.view;
    return this.app.workspace.getActiveViewOfType(MarkdownView);
  }

  /* ---------- click action ---------- */

  async insertSymbol(sym) {
    let text = this.settings.insertMode === "entity" ? sym.entity : sym.char;
    if (this.settings.trailingSpace) text += " ";

    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (err) {
      console.error("Special Characters Panel: clipboard write failed", err);
    }

    let inserted = false;
    const view = this.getTargetEditorView();
    if (view && view.editor) {
      view.editor.replaceSelection(text);
      inserted = true;
    }

    // Recently used
    this.settings.recent = [
      sym.char,
      ...this.settings.recent.filter((c) => c !== sym.char),
    ].slice(0, MAX_RECENT);
    await this.saveSettings();

    const shown = text.trim();
    let msg;
    if (copied && inserted) msg = `${shown}  copied and inserted`;
    else if (copied) msg = `${shown}  copied (no open note to insert into)`;
    else if (inserted) msg = `${shown}  inserted (clipboard unavailable)`;
    else msg = "Could not copy or insert the symbol";
    new Notice(msg, 1500);

    if (this.settings.autoClose) {
      this.app.workspace.detachLeavesOfType(VIEW_TYPE);
    } else {
      this.refreshRecent();
    }
  }
};

/* ------------------------------------------------------------------ *
 *  Sidebar view
 * ------------------------------------------------------------------ */

class SymbolsView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.query = "";
    this.category = ALL;
    this.longPressFired = false;
    this.pressTimer = null;
    this.lastMenuTime = 0;
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return "Symbols";
  }

  getIcon() {
    return ICON;
  }

  async onOpen() {
    const root = this.contentEl;
    root.empty();
    root.addClass("los-container");

    // Search + header (sticky)
    const searchWrap = root.createDiv({ cls: "los-search-wrap" });

    const header = searchWrap.createDiv({ cls: "los-header" });
    header.createDiv({ cls: "los-title", text: "Symbols" });
    const closeBtn = header.createEl("button", {
      cls: "los-close",
      attr: { "aria-label": "Close panel", title: "Close panel" },
    });
    setIcon(closeBtn, "x");
    this.registerDomEvent(closeBtn, "click", () => this.leaf.detach());

    this.searchEl = searchWrap.createEl("input", {
      cls: "los-search",
      type: "search",
      attr: {
        placeholder: "Search name, character, entity or U+code…",
        "aria-label": "Search symbols",
      },
    });
    this.registerDomEvent(this.searchEl, "input", () => {
      this.query = this.searchEl.value;
      this.renderGrid();
    });

    // Sections
    this.tabsEl = root.createDiv({ cls: "los-tabs" });
    this.favEl = root.createDiv({ cls: "los-favs" });
    this.recentEl = root.createDiv({ cls: "los-recent" });
    this.countEl = root.createDiv({ cls: "los-count" });
    this.gridEl = root.createDiv({ cls: "los-grid" });

    this.bindSymbolEvents(this.gridEl);
    this.bindSymbolEvents(this.favEl);
    this.bindSymbolEvents(this.recentEl);

    this.refresh();
  }

  async onClose() {
    window.clearTimeout(this.pressTimer);
    this.contentEl.empty();
  }

  /* ---------- rendering ---------- */

  refresh() {
    this.applyLayout();
    this.renderTabs();
    this.renderFavorites();
    this.renderRecent();
    this.renderGrid();
  }

  applyLayout() {
    const s = this.plugin.settings;
    const root = this.contentEl;

    for (const size of SIZES) root.removeClass(`los-size-${size}`);
    root.addClass(`los-size-${s.symbolSize}`);

    // If the tabs are hidden, don't leave the user filtered on a category
    if (!s.showTabs) this.category = ALL;

    this.tabsEl.toggleClass("is-hidden", !s.showTabs);
    this.countEl.toggleClass("is-hidden", !s.showCount);
  }

  renderTabs() {
    this.tabsEl.empty();
    for (const name of [ALL, ...this.plugin.categories]) {
      const btn = this.tabsEl.createEl("button", {
        cls: "los-tab",
        text: name,
      });
      if (name === this.category) btn.addClass("is-active");
      this.registerDomEvent(btn, "click", () => {
        this.category = name;
        this.renderTabs();
        this.renderGrid();
      });
    }
  }

  renderFavorites() {
    this.favEl.empty();
    const favs = this.plugin.settings.favorites
      .map((c) => this.plugin.symbolByChar.get(c))
      .filter(Boolean);

    if (favs.length === 0) {
      this.favEl.createDiv({
        cls: "los-fav-hint",
        text: "Favourites: right-click (or long-press) a symbol to pin it",
      });
      return;
    }

    this.favEl.createDiv({ cls: "los-fav-label", text: "Favourites" });
    const row = this.favEl.createDiv({ cls: "los-fav-row" });
    for (const sym of favs) this.createSymbolButton(row, sym);
  }

  renderRecent() {
    if (!this.recentEl) return;
    this.recentEl.empty();

    const recent = this.plugin.settings.recent
      .map((c) => this.plugin.symbolByChar.get(c))
      .filter(Boolean);

    const hidden = !this.plugin.settings.showRecent || recent.length === 0;
    this.recentEl.toggleClass("is-hidden", hidden);
    if (hidden) return;

    this.recentEl.createDiv({ cls: "los-recent-label", text: "Recently used" });
    const row = this.recentEl.createDiv({ cls: "los-recent-row" });
    for (const sym of recent) this.createSymbolButton(row, sym);
  }

  renderGrid() {
    this.gridEl.empty();

    const terms = this.query.toLowerCase().split(/\s+/).filter(Boolean);
    const seen = new Set();
    const results = [];

    for (const sym of this.plugin.symbols) {
      if (this.category !== ALL && sym.category !== this.category) continue;
      if (!matchesQuery(sym, terms)) continue;
      if (this.category === ALL) {
        // The same character can live in more than one category
        if (seen.has(sym.char)) continue;
        seen.add(sym.char);
      }
      results.push(sym);
    }

    this.countEl.setText(
      results.length === 1 ? "1 symbol" : `${results.length} symbols`
    );

    if (results.length === 0) {
      this.gridEl.createDiv({ cls: "los-empty", text: "No symbols found." });
      return;
    }
    for (const sym of results) this.createSymbolButton(this.gridEl, sym);
  }

  createSymbolButton(parent, sym) {
    const btn = parent.createEl("button", {
      cls: "los-symbol",
      text: sym.char,
      attr: {
        title: `${sym.name}\n${sym.code} · ${sym.entity}`,
        "aria-label": `${sym.name} (${sym.code})`,
        "data-char": sym.char,
      },
    });
    if (this.plugin.isFavorite(sym.char)) btn.addClass("is-fav");
    return btn;
  }

  /** Update the favourite highlight on existing buttons without re-rendering. */
  updateFavoriteMarks() {
    this.contentEl.querySelectorAll(".los-symbol").forEach((btn) => {
      const fav = this.plugin.isFavorite(btn.getAttribute("data-char"));
      btn.toggleClass("is-fav", fav);
    });
  }

  /* ---------- events ---------- */

  bindSymbolEvents(el) {
    // Keep focus in the editor when pressing a symbol
    this.registerDomEvent(el, "mousedown", (ev) => {
      if (ev.target.closest(".los-symbol")) ev.preventDefault();
    });

    this.registerDomEvent(el, "click", (ev) => this.onSymbolClick(ev));

    // Right-click (desktop)
    this.registerDomEvent(el, "contextmenu", (ev) => {
      const btn = ev.target.closest(".los-symbol");
      if (!btn) return;
      ev.preventDefault();
      if (Date.now() - this.lastMenuTime < 1000) return; // long-press already handled it
      this.lastMenuTime = Date.now();
      this.showSymbolMenu(btn, { event: ev });
    });

    // Long-press (touch devices)
    this.registerDomEvent(
      el,
      "touchstart",
      (ev) => {
        const btn = ev.target.closest(".los-symbol");
        if (!btn || !ev.touches[0]) return;
        this.longPressFired = false;
        const pos = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
        window.clearTimeout(this.pressTimer);
        this.pressTimer = window.setTimeout(() => {
          this.longPressFired = true;
          if (Date.now() - this.lastMenuTime < 1000) return;
          this.lastMenuTime = Date.now();
          this.showSymbolMenu(btn, { pos });
        }, LONG_PRESS_MS);
      },
      { passive: true }
    );

    const cancelPress = () => window.clearTimeout(this.pressTimer);
    this.registerDomEvent(el, "touchmove", cancelPress, { passive: true });
    this.registerDomEvent(el, "touchend", cancelPress, { passive: true });
    this.registerDomEvent(el, "touchcancel", cancelPress, { passive: true });
  }

  showSymbolMenu(btn, where) {
    const sym = this.plugin.symbolByChar.get(btn.getAttribute("data-char"));
    if (!sym) return;

    const fav = this.plugin.isFavorite(sym.char);
    const menu = new Menu();
    menu.addItem((item) =>
      item
        .setTitle(fav ? "Remove from favourites" : "Add to favourites")
        .setIcon(fav ? "star-off" : "star")
        .onClick(() => this.plugin.toggleFavorite(sym.char))
    );

    if (where.event) menu.showAtMouseEvent(where.event);
    else menu.showAtPosition(where.pos);
  }

  async onSymbolClick(ev) {
    // A long-press just opened the menu; swallow the click that follows it
    if (this.longPressFired) {
      this.longPressFired = false;
      return;
    }

    const btn = ev.target.closest(".los-symbol");
    if (!btn) return;
    const sym = this.plugin.symbolByChar.get(btn.getAttribute("data-char"));
    if (!sym) return;

    btn.addClass("los-flash");
    window.setTimeout(() => btn.removeClass("los-flash"), 250);

    await this.plugin.insertSymbol(sym);
  }
}

/* ------------------------------------------------------------------ *
 *  Settings tab
 * ------------------------------------------------------------------ */

class SymbolsSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    const settings = this.plugin.settings;
    containerEl.empty();

    const save = async () => {
      await this.plugin.saveSettings();
      this.plugin.refreshAll();
    };

    /* ----- Appearance ----- */
    new Setting(containerEl).setName("Appearance").setHeading();

    new Setting(containerEl)
      .setName("Symbol size")
      .setDesc("Font and button size of the symbols in the grid.")
      .addDropdown((dd) =>
        dd
          .addOption("small", "Small")
          .addOption("medium", "Medium")
          .addOption("large", "Large")
          .setValue(settings.symbolSize)
          .onChange(async (value) => {
            settings.symbolSize = value;
            await save();
          })
      );

    new Setting(containerEl)
      .setName("Show category tabs")
      .setDesc("Hide the tabs to get more room for the grid.")
      .addToggle((t) =>
        t.setValue(settings.showTabs).onChange(async (value) => {
          settings.showTabs = value;
          await save();
        })
      );

    new Setting(containerEl)
      .setName("Show recently used row")
      .addToggle((t) =>
        t.setValue(settings.showRecent).onChange(async (value) => {
          settings.showRecent = value;
          await save();
        })
      );

    new Setting(containerEl)
      .setName("Show symbol count")
      .setDesc('The "123 symbols" line above the grid.')
      .addToggle((t) =>
        t.setValue(settings.showCount).onChange(async (value) => {
          settings.showCount = value;
          await save();
        })
      );

    /* ----- Behaviour ----- */
    new Setting(containerEl).setName("Behaviour").setHeading();

    new Setting(containerEl)
      .setName("Insert as")
      .setDesc(
        "Insert (and copy) the character itself, or its HTML entity such as &rarr;."
      )
      .addDropdown((dd) =>
        dd
          .addOption("char", "Character (→)")
          .addOption("entity", "HTML entity (&rarr;)")
          .setValue(settings.insertMode)
          .onChange(async (value) => {
            settings.insertMode = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Add a trailing space")
      .setDesc("Add a space after the symbol when inserting and copying.")
      .addToggle((t) =>
        t.setValue(settings.trailingSpace).onChange(async (value) => {
          settings.trailingSpace = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Close panel after inserting")
      .setDesc("Close the panel automatically after each symbol is inserted.")
      .addToggle((t) =>
        t.setValue(settings.autoClose).onChange(async (value) => {
          settings.autoClose = value;
          await this.plugin.saveSettings();
        })
      );

    /* ----- Data ----- */
    new Setting(containerEl).setName("Data").setHeading();

    new Setting(containerEl)
      .setName("Recently used")
      .setDesc("Clear the recently used symbols.")
      .addButton((btn) =>
        btn.setButtonText("Clear").onClick(async () => {
          settings.recent = [];
          await this.plugin.saveSettings();
          this.plugin.refreshRecent();
        })
      );

    new Setting(containerEl)
      .setName("Favourites")
      .setDesc(
        "Right-click (or long-press on touch devices) a symbol to add or remove it."
      )
      .addButton((btn) =>
        btn.setButtonText("Clear all").onClick(async () => {
          settings.favorites = [];
          await this.plugin.saveSettings();
          this.plugin.refreshFavorites();
        })
      );
  }
}
