/* ============================================================
   VI-PRINT: PRINT MASTER — v.2 (e thjeshtuar)
   ------------------------------------------------------------
   Zgjedh produktin → prodhoje në 4–6 hapa realë në makineri.
   Klientët, vlerat dhe kostot janë FIKTIVE (simulim).
   Teknikat (offset, digjital, folie, embosim, llak UV, shtancim,
   palosje, plastifikim) janë ato reale të VI-Print.
   ============================================================ */
window.PM = window.PM || {};

/* Buxheti fillestar i lojtarit (në euro) — ndryshoje këtu nëse duhet */
PM.START_MONEY = 20000;

/* ---------------- KLIENTËT ----------------
   Marka reale (logot zyrtare nga Wikimedia Commons).
   prefers = cilat produkte porosisin zakonisht.
   Vlerat/kostot mbeten fiktive (simulim). */
PM.CLIENTS = {
  /* — Paketime (kuti ushqimi) — */
  bk:   { name: 'Burger King',  logo: 'assets/brands/burger-king.png', accent: '#D62300', focus: 'Paketim ushqimi të shpejtë' },
  kfc:  { name: 'KFC',          logo: 'assets/brands/kfc.png',         accent: '#E4002B', focus: 'Paketim + fletushka' },
  mcd:  { name: "McDonald's",   logo: 'assets/brands/mcdonalds.png',   accent: '#FFC72C', focus: 'Qese e paketim' },
  ph:   { name: 'Pizza Hut',    logo: 'assets/brands/pizzahut.png',    accent: '#EE3124', focus: 'Kuti pica + promovim' },
  sub:  { name: 'Subway',       logo: 'assets/brands/subway.png',      accent: '#008C15', focus: 'Fletushka + menu' },
  /* — Qese & Çanta (markete) — */
  lidl:      { name: 'Lidl',        logo: 'assets/brands/lidl.png',      accent: '#0050AA', focus: 'Qese marketi' },
  aldi:      { name: 'Aldi',        logo: 'assets/brands/aldi.png',      accent: '#0E5BB1', focus: 'Qese marketi' },
  carrefour: { name: 'Carrefour',   logo: 'assets/brands/carrefour.png', accent: '#004E9F', focus: 'Hipermarket' },
  kaufland:  { name: 'Kaufland',    logo: 'assets/brands/kaufland.png',  accent: '#E3000F', focus: 'Qese marketi' },
  tesco:     { name: 'Tesco',       logo: 'assets/brands/tesco.png',     accent: '#EE1C2E', focus: 'Qese marketi' },
  /* — Fletushka & Postera — */
  ikea:      { name: 'IKEA',        logo: 'assets/brands/ikea.png',      accent: '#0058A3', focus: 'Katalogë + fletushka' },
  hm:        { name: 'H&M',         logo: 'assets/brands/hm.png',        accent: '#D5002D', focus: 'Fletushka modë' },
  mediamarkt:{ name: 'MediaMarkt',  logo: 'assets/brands/mediamarkt.png',accent: '#D20016', focus: 'Fletushka elektronikë' },
  decathlon: { name: 'Decathlon',   logo: 'assets/brands/decathlon.png', accent: '#0082C3', focus: 'Postera sport' },
  zara:      { name: 'Zara',        logo: 'assets/brands/zara.png',      accent: '#111111', focus: 'Fletushka modë' },
  /* — Etiketa — */
  cocacola:  { name: 'Coca-Cola',   logo: 'assets/brands/cocacola.png',  accent: '#F40009', focus: 'Etiketa pijesh' },
  pepsi:     { name: 'Pepsi',       logo: 'assets/brands/pepsi.png',     accent: '#004B93', focus: 'Etiketa pijesh' },
  heineken:  { name: 'Heineken',    logo: 'assets/brands/heineken.png',  accent: '#00A651', focus: 'Etiketa birre' },
  loreal:    { name: "L'Oréal",     logo: 'assets/brands/loreal.png',    accent: '#003B71', focus: 'Etiketa kozmetike' },
  nestle:    { name: 'Nestlé',      logo: 'assets/brands/nestle.png',    accent: '#0056A0', focus: 'Etiketa ushqimi' },
  /* — Vizitkarta — */
  google:    { name: 'Google',      logo: 'assets/brands/google.png',    accent: '#4285F4', focus: 'Vizitkarta kompanie' },
  microsoft: { name: 'Microsoft',   logo: 'assets/brands/microsoft.png', accent: '#F25022', focus: 'Vizitkarta kompanie' },
  deloitte:  { name: 'Deloitte',    logo: 'assets/brands/deloitte.png',  accent: '#14B3A5', focus: 'Vizitkarta profesionale' },
  hsbc:      { name: 'HSBC',        logo: 'assets/brands/hsbc.png',      accent: '#DB0011', focus: 'Vizitkarta banke' },
  amazon:    { name: 'Amazon',      logo: 'assets/brands/amazon.png',    accent: '#FF9900', focus: 'Vizitkarta kompanie' },
  /* — Materiale Promocionale — */
  redbull:   { name: 'Red Bull',    logo: 'assets/brands/redbull.png',   accent: '#DB0A40', focus: 'Promovime energjike' },
  nike:      { name: 'Nike',        logo: 'assets/brands/nike.png',      accent: '#111111', focus: 'Promovime sport' },
  adidas:    { name: 'Adidas',      logo: 'assets/brands/adidas.png',    accent: '#111111', focus: 'Promovime sport' },
  puma:      { name: 'Puma',        logo: 'assets/brands/puma.png',      accent: '#111111', focus: 'Promovime sport' },
  samsung:   { name: 'Samsung',     logo: 'assets/brands/samsung.png',   accent: '#1428A0', focus: 'Promovime elektronikë' },
  /* — Klientët fiktivë (rezervë) — */
  studio:    { name: 'Design Studio',     focus: 'Detaje të pastra' },
  cosmetics: { name: 'Luxury Cosmetics',  focus: 'Pamje premium' },
  fashion:   { name: 'Fashion Brand',     focus: 'Folie + teksturë' },
  resto:     { name: 'Restaurant',        focus: 'Shpejtësi' },
  bakery:    { name: 'Bakery',            focus: 'Paketim' },
  corporate: { name: 'Corporate Client',  focus: 'Precizion' },
  publisher: { name: 'Publisher',         focus: 'Libra + lidhje' },
  vip:       { name: 'VIP Brand',         focus: 'Cilësi maksimale' }
};

/* 5 kompani (me logo) për çdo lloj produkti — fusha e tyre */
PM.TYPE_CLIENTS = {
  card:  ['google', 'microsoft', 'deloitte', 'hsbc', 'amazon'],
  flyer: ['ikea', 'hm', 'mediamarkt', 'decathlon', 'zara'],
  label: ['cocacola', 'pepsi', 'heineken', 'loreal', 'nestle'],
  box:   ['bk', 'kfc', 'mcd', 'ph', 'sub'],
  bag:   ['lidl', 'aldi', 'carrefour', 'kaufland', 'tesco'],
  promo: ['redbull', 'nike', 'adidas', 'puma', 'samsung']
};

/* ---------------- MATERIALET ---------------- */
PM.MATERIALS = [
  { id: 'standard',   label: 'Karton standard',    spec: '300 g/m² · i pashtresuar', base: '#E6E1D8', ink: '#16161C', tex: 'fiber',  cost: 180 },
  { id: 'coated',     label: 'Karton i shtresuar', spec: '350 g/m² · i shtresuar',   base: '#F6F4F0', ink: '#101018', tex: 'smooth', cost: 320 },
  { id: 'kraft',      label: 'Kraft',              spec: '300 g/m² · i riciklueshëm', base: '#C09A6B', ink: '#3A2A18', tex: 'kraft',  cost: 150 },
  { id: 'blackboard', label: 'Karton i zi luksoz', spec: '400 g/m² · i zi në masë',   base: '#141419', ink: '#F2EDE2', tex: 'smooth', cost: 520 },
  { id: 'textured',   label: 'Karton me strukturë',spec: '350 g/m² · i strukturuar',  base: '#EDE6DA', ink: '#1A1A20', tex: 'linen',  cost: 400 }
];

/* ---------------- FINISHIMET (një hap i vetëm, shumë-zgjedhje) ---------------- */
PM.FINISH_OPTIONS = [
  { id: 'soft',        label: 'Soft Touch',          kind: 'lam',    cost: 240 },
  { id: 'matte',       label: 'Matte Lamination',    kind: 'lam',    cost: 190 },
  { id: 'gloss',       label: 'Gloss Lamination',    kind: 'lam',    cost: 180 },
  { id: 'foil-gold',   label: 'Gold Hot Foil',       kind: 'foil',   cost: 260 },
  { id: 'foil-silver', label: 'Silver Hot Foil',     kind: 'foil',   cost: 240 },
  { id: 'emboss',      label: 'Emboss (3D)',         kind: 'relief', cost: 210 },
  { id: 'uv',          label: 'Spot UV Varnish',     kind: 'varnish',cost: 170 }
];

/* referencat që përdor economy() */
PM.EFFECTS  = PM.FINISH_OPTIONS.filter(function (f) { return f.kind !== 'lam'; })
  .map(function (f) { return { id: f.id, label: f.label, cost: f.cost, kind: f.kind }; });
PM.FINISHES = PM.FINISH_OPTIONS.filter(function (f) { return f.kind === 'lam'; })
  .map(function (f) { return { id: f.id, label: f.label, cost: f.cost }; });

/* ---------------- LLOJET E PRODUKTIT (zgjedhja në menu) ---------------- */
PM.PRODUCT_TYPES = [
  { id: 'card',  label: 'Vizitkarta',             en: 'Business Cards',    icon: '🪪', visual: 'card',
    product: '500 Vizitkarta', materials: ['coated', 'blackboard', 'textured'],
    finishes: ['soft', 'matte', 'gloss', 'foil-gold', 'emboss', 'uv'],
    pipeline: ['material', 'print', 'finish', 'diecut', 'delivery'], value: [300, 600] },
  { id: 'flyer', label: 'Fletushka & Postera',    en: 'Flyers & Posters',  icon: '📄', visual: 'flyer',
    product: '2.000 Fletushka', materials: ['standard', 'coated', 'kraft'],
    finishes: ['gloss', 'matte', 'uv'],
    pipeline: ['material', 'print', 'finish', 'fold', 'delivery'], value: [350, 700] },
  { id: 'label', label: 'Etiketa',                en: 'Labels',            icon: '🏷️', visual: 'label',
    product: '5.000 Etiketa', materials: ['coated', 'standard'],
    finishes: ['gloss', 'matte', 'uv'],
    pipeline: ['material', 'print', 'diecut', 'finish', 'delivery'], value: [280, 560] },
  { id: 'box',   label: 'Paketime',               en: 'Packaging',         icon: '📦', visual: 'box',
    product: '500 Kuti', materials: ['kraft', 'coated', 'blackboard', 'textured'],
    finishes: ['matte', 'gloss', 'soft', 'foil-gold', 'emboss', 'uv'],
    pipeline: ['material', 'print', 'finish', 'diecut', 'fold', 'delivery'], value: [600, 1200] },
  { id: 'bag',   label: 'Qese & Çanta',           en: 'Bags',              icon: '🛍️', visual: 'bag',
    product: '1.000 Qese letre', materials: ['kraft', 'coated', 'standard'],
    finishes: ['matte', 'gloss'],
    pipeline: ['material', 'print', 'fold', 'delivery'], value: [320, 640] },
  { id: 'promo', label: 'Materiale Promocionale', en: 'Promo Materials',   icon: '🎁', visual: 'promo',
    product: '1.000 Fletëpalosje', materials: ['coated', 'standard', 'textured'],
    finishes: ['matte', 'gloss', 'foil-gold', 'emboss'],
    pipeline: ['material', 'print', 'finish', 'diecut', 'delivery'], value: [400, 800] }
];

/* ---------------- UPGRADE-T ---------------- */
PM.UPGRADES = [
  { id: 'printer',  label: 'Printer më i shpejtë',       cost: 1500, desc: 'Zona e gjelbër e shtypit +45%' },
  { id: 'cutter',   label: 'Prerës më i mirë',           cost: 1400, desc: 'Zona e prerjes +45%' },
  { id: 'foil',     label: 'Makinë folie e avancuar',    cost: 1800, desc: 'Toleranca e folies +50%' },
  { id: 'waste',    label: 'Më pak mbeturina',           cost: 1600, desc: 'Mbeturinat −35%' },
  { id: 'capacity', label: 'Kapacitet më i madh',        cost: 2200, desc: 'Të ardhurat e porosisë +12%' },
  { id: 'packing',  label: 'Paketim më i mirë',          cost: 1100, desc: 'Kënaqësia e klientit +8' }
];

/* ---------------- Emrat e fazave ---------------- */
PM.STAGE_META = {
  material: { n: 'Material',    al: 'Zgjidh materialin e kërkuar' },
  print:    { n: 'Shtypi',      al: 'Rregullo makinën dhe ndalo në gjelbër' },
  finish:   { n: 'Finishimi',   al: 'Zgjidh saktësisht finishimet e porosisë' },
  diecut:   { n: 'Prerja',      al: 'Ndalo prerjen brenda zonës së gjelbër' },
  fold:     { n: 'Palosja',     al: 'Ndiq radhën e palosjes' },
  delivery: { n: 'Dorëzimi',    al: 'Dorëzoje porosinë e përfunduar' }
};

/* ---------------- Gjenerimi i porosisë ---------------- */
function rndInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a.slice(0, n);
}
function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
PM._byId = byId;

PM.makeOrder = function (typeId, clientId, materialId) {
  var t = byId(PM.PRODUCT_TYPES, typeId);
  /* kompania: e dhënë, ose e rastësishme nga 5 të fushës së produktit */
  var pool = PM.TYPE_CLIENTS[t.id] || Object.keys(PM.CLIENTS);
  var client = clientId || pick(pool);
  var material = materialId || pick(t.materials);
  var nFin = Math.random() < 0.5 ? 1 : 2;
  var finishes = pickN(t.finishes, Math.min(nFin, t.finishes.length));
  var mat = byId(PM.MATERIALS, material);
  var style = mat.label.split(' ')[0] + ' + ' + finishes.map(function (id) {
    return byId(PM.FINISH_OPTIONS, id).label;
  }).join(' + ');

  return {
    type: t.visual,
    typeId: t.id,
    product: t.product,
    style: style,
    styleInk: mat.ink,
    material: material,
    finishes: finishes,
    deadline: t.pipeline.length * 12 + 6,
    value: rndInt(t.value[0], t.value[1]),
    pipeline: t.pipeline,
    client: client
  };
};
