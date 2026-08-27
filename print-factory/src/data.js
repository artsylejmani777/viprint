/* ==========================================================================
   data.js — 64 real ViPrint products, 6 machines, 7 categories, companies.
   ========================================================================== */

export const CATEGORIES = [
  { id: 'efekte', name: 'Efekte / përpunime', emoji: '✨' },
  { id: 'ambalazhe', name: 'Ambalazhe / kuti', emoji: '📦' },
  { id: 'libra', name: 'Libra, revista, katalogë', emoji: '📚' },
  { id: 'zyre', name: 'Produkte zyre', emoji: '🗂️' },
  { id: 'marketing', name: 'Marketing / promocion', emoji: '📢' },
  { id: 'dokumente', name: 'Dokumente / evente', emoji: '📄' },
  { id: 'tjera', name: 'Të tjera', emoji: '🎁' },
];

export const MACHINES = [
  { id: 'offset1', name: 'Offset B1', desc: 'Libra, katalogë, kalendarë', emoji: '📖', color: '#1b2cc1' },
  { id: 'offset2', name: 'Offset B2', desc: 'Marketing, poster, flyer', emoji: '📰', color: '#2196f3' },
  { id: 'digjital', name: 'Shtyp Digjital', desc: 'Kartëvizita, zyre, dokumente', emoji: '💻', color: '#26c6da' },
  { id: 'folie', name: 'Folje e nxehtë', desc: 'Folje ari, argjend, debosim', emoji: '✨', color: '#c5037f' },
  { id: 'lakim', name: 'Lakim / Plastifikim', desc: 'UV llak, plastifikim', emoji: '💧', color: '#7c4dff' },
  { id: 'prerje', name: 'Prerje & Paketim', desc: 'Kuti, qese, paketime', emoji: '📦', color: '#ff9800' },
];

// [name, category, machine, basePrice€]
const P = [
  ['Debosim', 'efekte', 'folie', 10], ['Embosim', 'efekte', 'folie', 10],
  ['Folje e nxehtë ngjyra', 'efekte', 'folie', 12], ['Folje e nxehtë hologram', 'efekte', 'folie', 14],
  ['Folje e nxehtë argjend', 'efekte', 'folie', 12], ['Folje e nxehtë ari', 'efekte', 'folie', 14],
  ['Llak Dispersiv', 'efekte', 'lakim', 9], ['UV llak glitter', 'efekte', 'lakim', 9],
  ['UV llak parcial', 'efekte', 'lakim', 8], ['Plastifikim Soft touch', 'efekte', 'lakim', 8],
  ['Plastifikim Gloss', 'efekte', 'lakim', 7], ['Plastifikim Matt', 'efekte', 'lakim', 7],
  ['Kese të letrës', 'ambalazhe', 'prerje', 6], ['Kutia sipas kërkesave', 'ambalazhe', 'prerje', 12],
  ['Kuti për hamburger', 'ambalazhe', 'prerje', 5], ['Kuti për pomfrit', 'ambalazhe', 'prerje', 4],
  ['Kuti për bakllavë', 'ambalazhe', 'prerje', 7], ['Kuti për çokollata', 'ambalazhe', 'prerje', 8],
  ['Kutia për tortë', 'ambalazhe', 'prerje', 9], ['Paketime për çaja', 'ambalazhe', 'prerje', 6],
  ['Mbajtëse për gota', 'ambalazhe', 'prerje', 5],
  ['Revista me lidhje me tel', 'libra', 'offset1', 15], ['Revista me lidhje me ngjitës', 'libra', 'offset1', 16],
  ['Libra me lidhje me ngjitës', 'libra', 'offset1', 18], ['Libra me lidhje me penjë', 'libra', 'offset1', 22],
  ['Libra me lidhje të fortë', 'libra', 'offset1', 25], ['Katallog me lidhje të fortë', 'libra', 'offset1', 20],
  ['Katallog lidhje me ngjitës', 'libra', 'offset1', 18], ['Katallog lidhje me tel', 'libra', 'offset1', 15],
  ['Katallog me spirale', 'libra', 'offset1', 16], ['Broshura me ngjitës', 'libra', 'offset1', 12],
  ['Broshura me spirale', 'libra', 'offset1', 12], ['Broshura lidhje me tel', 'libra', 'offset1', 10],
  ['Memo', 'zyre', 'digjital', 3], ['Fletore me spirale', 'zyre', 'digjital', 6],
  ['Bloka për vizatime', 'zyre', 'digjital', 5], ['Fletore shkollore', 'zyre', 'digjital', 4],
  ['Fletore agjenda pëlhurë+spirale', 'zyre', 'digjital', 9], ['Fletore agjenda pëlhurë', 'zyre', 'digjital', 9],
  ['Fletore kopertina të forta', 'zyre', 'digjital', 8], ['Folder', 'zyre', 'digjital', 5],
  ['Folder për dosje', 'zyre', 'digjital', 6], ['Blloka NCR me kopje', 'zyre', 'digjital', 7],
  ['Poster', 'marketing', 'offset2', 8], ['Flyer', 'marketing', 'offset2', 4],
  ['Flyer me varrse', 'marketing', 'offset2', 5], ['Fletëpalosje', 'marketing', 'offset2', 4],
  ['Wobbler', 'marketing', 'offset2', 5], ['Vizitkarta', 'marketing', 'offset2', 4],
  ['Kartolina', 'marketing', 'offset2', 3], ['Etiketa vetngjitëse', 'marketing', 'offset2', 5],
  ['Voucher', 'marketing', 'offset2', 6], ['Bileta', 'marketing', 'offset2', 4],
  ['Mbështjellës për bileta', 'marketing', 'offset2', 6], ['Menu', 'marketing', 'offset2', 7],
  ['Mbajtës promocione', 'marketing', 'offset2', 6],
  ['Ftesa', 'dokumente', 'digjital', 4], ['Certifikata', 'dokumente', 'digjital', 5],
  ['Diploma', 'dokumente', 'digjital', 5], ['Orar shkollor', 'dokumente', 'digjital', 3],
  ['Zarfa', 'dokumente', 'digjital', 3], ['Kalendar tavoline', 'dokumente', 'digjital', 6],
  ['CD cover', 'tjera', 'digjital', 5], ['Kalendar muri', 'tjera', 'offset1', 9],
];

export const PRODUCTS = P.map(([name, cat, machine, base], i) => ({
  id: 'p' + String(i + 1).padStart(2, '0'),
  name, cat, machine, base,
}));

export const COMPANIES = [
  { name: 'Restorant', emoji: '🍔' }, { name: 'Farmaci', emoji: '💊' },
  { name: 'Universitet', emoji: '🎓' }, { name: 'Kompani marketingu', emoji: '📢' },
  { name: 'Studio dizajni', emoji: '🎨' }, { name: 'Hotel', emoji: '🏨' },
  { name: 'Supermarket', emoji: '🛒' }, { name: 'Organizatë eventesh', emoji: '🎉' },
];

export const NAMES = [
  { name: 'Ardit', gender: 'm' }, { name: 'Era', gender: 'f' },
  { name: 'Blerta', gender: 'f' }, { name: 'Driton', gender: 'm' },
  { name: 'Vesa', gender: 'f' }, { name: 'Leon', gender: 'm' },
  { name: 'Teuta', gender: 'f' }, { name: 'Burim', gender: 'm' },
  { name: 'Adea', gender: 'f' }, { name: 'Fisnik', gender: 'm' },
];

export const GOAL_MONEY = 1000;
export const L1_TIME = 75;
export const WORKER_COST = 300;
export const STICKER_COST = 60;

export function product(id) { return PRODUCTS.find((p) => p.id === id); }
export function machine(id) { return MACHINES.find((m) => m.id === id); }
export function category(id) { return CATEGORIES.find((c) => c.id === id); }
export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
