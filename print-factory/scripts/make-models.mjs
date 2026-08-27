/* ==========================================================================
   make-models.mjs — generates the GLB assets for Print Factory 3D
   Run: npm run models  (after `npm install`)
   ========================================================================== */
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'models');
fs.mkdirSync(OUT, { recursive: true });

// Node shim for FileReader (GLTFExporter's binary path uses `reader.onloadend = fn`)
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buf) => {
        const b = Buffer.from(buf);
        this.result = 'data:application/octet-stream;base64,' + b.toString('base64');
        if (this.onloadend) this.onloadend();
      });
    }
  };
}

/* ---------- helpers ---------- */
function box(w, h, d, color, x = 0, y = 0, z = 0, opts = {}) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: opts.metal ? 0.5 : 0.12 })
  );
  m.position.set(x, y, z);
  return m;
}
function cyl(rt, rb, h, color, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(rt, rb, h, 20),
    new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.2 })
  );
  m.position.set(x, y, z);
  return m;
}

function save(group, name) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(group, (result) => {
      try {
        const buf = Buffer.from(result);
        fs.writeFileSync(path.join(OUT, name + '.glb'), buf);
        console.log('  ✓', name + '.glb', (buf.length / 1024).toFixed(1) + ' KB');
        resolve();
      } catch (e) { reject(e); }
    }, reject, { binary: true });
  });
}

/* ---------- 1. Printing machine ---------- */
function makeMachine() {
  const g = new THREE.Group();
  g.add(box(1.7, 0.9, 0.9, '#47555f', 0, 0.45, 0));            // base cabinet
  g.add(box(1.55, 0.55, 0.7, '#2c3a45', 0, 1.17, 0));          // top housing
  g.add(box(0.42, 0.3, 0.1, '#1b2cc1', 0.5, 1.15, 0.36));      // control panel
  g.add(box(0.3, 0.22, 0.06, '#67d7ff', 0.5, 1.15, 0.42));     // screen
  g.add(box(1.3, 0.06, 0.7, '#c8ccd0', -0.25, 0.95, -0.75));   // feed tray
  const r = cyl(0.13, 0.13, 1.45, '#8a95a0', 0, 1.5, 0);
  r.rotation.z = Math.PI / 2;
  g.add(r);                                                     // roller
  g.add(box(1.55, 0.1, 0.72, '#2196f3', 0, 0.72, 0));           // accent stripe
  g.add(box(0.16, 0.7, 0.16, '#34424a', -0.85, 0.35, -0.3));    // legs (x2)
  g.add(box(0.16, 0.7, 0.16, '#34424a', 0.85, 0.35, -0.3));
  return g;
}

/* ---------- 2. Avatar male (suit) ---------- */
function makeAvatarMale() {
  const g = new THREE.Group();
  const suit = '#1e2c3a';
  g.add(box(0.14, 0.5, 0.15, '#161c22', -0.11, 0.25, 0));      // legs
  g.add(box(0.14, 0.5, 0.15, '#161c22', 0.11, 0.25, 0));
  g.add(box(0.42, 0.5, 0.24, suit, 0, 0.75, 0));                // jacket
  g.add(box(0.16, 0.2, 0.03, '#f5f5f5', 0, 0.94, 0.125));      // white shirt
  g.add(box(0.06, 0.17, 0.035, '#8a1f2d', 0, 0.84, 0.15));     // tie
  g.add(box(0.12, 0.46, 0.12, suit, -0.27, 0.72, 0));          // arms
  g.add(box(0.12, 0.46, 0.12, suit, 0.27, 0.72, 0));
  g.add(box(0.26, 0.28, 0.24, '#f2c79b', 0, 1.25, 0));         // head
  g.add(box(0.28, 0.1, 0.26, '#3a2a1c', 0, 1.4, -0.02));      // hair
  return g;
}

/* ---------- 3. Avatar female (dress) ---------- */
function makeAvatarFemale() {
  const g = new THREE.Group();
  const dress = '#7a2e3f';
  g.add(box(0.11, 0.42, 0.11, '#e6bd92', -0.1, 0.2, 0));       // legs (skin)
  g.add(box(0.11, 0.42, 0.11, '#e6bd92', 0.1, 0.2, 0));
  const skirt = cyl(0.15, 0.32, 0.44, dress, 0, 0.56, 0);       // skirt (A-line)
  g.add(skirt);
  g.add(box(0.3, 0.32, 0.2, dress, 0, 0.92, 0));                // bodice
  g.add(box(0.1, 0.4, 0.1, dress, -0.21, 0.88, 0));             // arms
  g.add(box(0.1, 0.4, 0.1, dress, 0.21, 0.88, 0));
  g.add(box(0.24, 0.26, 0.22, '#f2c79b', 0, 1.2, 0));          // head
  g.add(box(0.26, 0.16, 0.24, '#4a3424', 0, 1.35, -0.02));     // hair top
  g.add(box(0.26, 0.22, 0.2, '#4a3424', 0, 1.12, 0.14));       // hair back
  return g;
}

/* ---------- 4..7. Products ---------- */
function makeProducts() {
  const boxP = new THREE.Group();
  boxP.add(box(0.5, 0.42, 0.5, '#c8a24a', 0, 0.21, 0));
  boxP.add(box(0.52, 0.1, 0.52, '#b28a35', 0, 0.42, 0));        // lid

  const card = new THREE.Group();
  card.add(box(0.85, 0.02, 0.55, '#f7f5f0', 0, 0.01, 0));
  card.add(box(0.5, 0.02, 0.25, '#2196f3', 0.05, 0.02, 0));     // logo strip

  const book = new THREE.Group();
  book.add(box(0.42, 0.05, 0.58, '#f7f5f0', 0, 0.025, 0));
  book.add(box(0.06, 0.05, 0.58, '#c5037f', -0.21, 0.025, 0));  // spine

  const bag = new THREE.Group();
  bag.add(box(0.42, 0.6, 0.2, '#e8e4da', 0, 0.3, 0));
  bag.add(box(0.42, 0.05, 0.2, '#d8d2c4', 0, 0.62, 0));         // rim
  return [['product-box', boxP], ['product-card', card], ['product-book', book], ['product-bag', bag]];
}

/* ---------- 8. Factory shell (floor + low walls, open top) ---------- */
function makeFactory() {
  const g = new THREE.Group();
  const W = 30, D = 20, T = 0.4, H = 1.1;
  g.add(box(W, 0.1, D, '#cfe0dd', 0, -0.05, 0));               // floor
  g.add(box(W, H, T, '#0d2c32', 0, H / 2, -D / 2));            // back wall
  g.add(box(T, H, D, '#0d2c32', -W / 2, H / 2, 0));            // left wall
  g.add(box(T, H, D, '#0d2c32', W / 2, H / 2, 0));             // right wall
  // front wall with door gap
  g.add(box((W - 4) / 2, H, T, '#0d2c32', -(W + 4) / 4, H / 2, D / 2));
  g.add(box((W - 4) / 2, H, T, '#0d2c32', (W + 4) / 4, H / 2, D / 2));
  // door mat
  g.add(box(4, 0.04, 1.2, '#8a9ba1', 0, 0.02, D / 2));
  return g;
}

/* ---------- run ---------- */
async function main() {
  console.log('Generating GLB models →', OUT);
  await save(makeMachine(), 'machine');
  await save(makeAvatarMale(), 'avatar-male');
  await save(makeAvatarFemale(), 'avatar-female');
  for (const [name, grp] of makeProducts()) await save(grp, name);
  await save(makeFactory(), 'factory');
  console.log('Done.');
}
main().catch((e) => { console.error(e); process.exit(1); });
