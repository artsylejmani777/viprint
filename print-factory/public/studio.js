/* studio.js — render 3D studios: kategorite kryesore te printimit */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const C = {
  bg: 0xe4e0da, floor: 0xd5d1cb, navy: 0x13243a, magenta: 0xd40a8a,
  gold: 0xd0a245, cream: 0xf7f1e6, paper: 0xfaf8f3, white: 0xffffff,
  coral: 0xe06952, sage: 0x93a695, charcoal: 0x2c3540, ink: 0x222c38,
  softred: 0xa63a4e,
};

function paper(color = C.paper, rough = 0.55) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: rough, metalness: 0, clearcoat: 0.12, clearcoatRoughness: 0.4 });
}
function cover(color = C.navy, rough = 0.42) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: rough, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.2 });
}
function foil(color = C.gold) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, metalness: 0.55 });
}
function mat(color, rough = 0.8) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0 });
}
function rb(w, h, d, r, m) {
  return new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), m);
}
function box(w, h, d, m) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
}
function cyl(rt, rb, h, m, seg = 32) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
}
function put(parent, obj, x, y, z, rx = 0, ry = 0, rz = 0) {
  obj.position.set(x, y, z);
  obj.rotation.set(rx, ry, rz);
  parent.add(obj);
  return obj;
}
function group(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  return g;
}

/* libr i mbyllur: blloku i fqijve (krem) + kopertina (ngjyre) */
function makeBook(w, h, d, coverColor) {
  const g = new THREE.Group();
  const pages = rb(w - 0.035, h - 0.035, d - 0.035, 0.006, paper(C.cream, 0.6));
  const cv = rb(w, h, d, 0.012, cover(coverColor));
  g.add(pages); g.add(cv);
  return g;
}
/* katalog i hapur ne forme tende */
function makeOpenBook(w, h, spineColor) {
  const g = new THREE.Group();
  const P = (tilt, xoff) => {
    const p = rb(w * 0.98, h, 0.02, 0.008, paper(C.cream, 0.62));
    p.position.set(xoff, h * 0.42, 0);
    p.rotation.z = tilt;
    return p;
  };
  g.add(P(0.5, -w * 0.33));
  g.add(P(-0.5, w * 0.33));
  const spine = rb(0.03, h * 0.94, 0.035, 0.01, cover(spineColor));
  spine.position.set(0, h * 0.84, 0);
  g.add(spine);
  return g;
}

/* broshure tri-fold (akordeon) */
function makeBrochure(w, h, color) {
  const g = new THREE.Group();
  const pw = w / 3;
  const panel = (cx, rot) => {
    const p = rb(pw, h, 0.018, 0.006, cover(color));
    p.position.set(cx, h / 2, 0);
    p.rotation.y = rot;
    return p;
  };
  g.add(panel(-pw, -0.16));
  g.add(panel(0, 0.0));
  g.add(panel(pw, 0.16));
  return g;
}

/* fletore me brez elastik */
function makeNotebook(w, h, d, color) {
  const g = new THREE.Group();
  const pages = rb(w - 0.02, h - 0.012, d - 0.01, 0.008, paper(C.white, 0.6));
  g.add(pages);
  const cov = rb(w, h, d, 0.02, cover(color));
  g.add(cov);
  const band = box(0.032, h + 0.03, d + 0.03, mat(0x8a2b3a, 0.35));
  band.position.set(w / 2 - 0.03, 0, 0);
  g.add(band);
  return g;
}

/* tufa fletesh (flyer) te perhapura si fane */
function makeFlyerStack(w, d, n, accentColor) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const last = i === n - 1;
    const f = rb(w, 0.012, d, 0.004, last ? cover(accentColor, 0.28) : paper(C.white, 0.55));
    const t = (i - n / 2) * 0.05;
    f.position.set(Math.sin(t) * 0.012, 0.012 * i + 0.006, Math.cos(t) * 0.012 - t * 0.02);
    f.rotation.y = t;
    g.add(f);
  }
  return g;
}

/* postera te mbeshtjellur (rulo) me brez */
function makePosterRoll(len, r, color, bandColor) {
  const g = new THREE.Group();
  const roll = cyl(r, r, len, paper(color, 0.62), 24);
  roll.rotation.x = Math.PI / 2;
  g.add(roll);
  const band = box(0.03, r * 2 + 0.03, len * 0.12, cover(bandColor));
  band.position.set(0, 0, len * 0.28);
  g.add(band);
  return g;
}

/* kalendar tavoline (A-frame) */
function makeCalendar(w, h, color) {
  const g = new THREE.Group();
  const back = rb(w, h, 0.02, 0.01, cover(color));
  back.position.set(0, h * 0.5, -0.045);
  back.rotation.x = -0.26;
  g.add(back);
  const front = rb(w - 0.05, h - 0.06, 0.014, 0.008, paper(C.cream, 0.6));
  front.position.set(0, h * 0.46, 0.02);
  front.rotation.x = 0.16;
  g.add(front);
  const base = rb(w * 0.75, 0.02, 0.16, 0.006, cover(color));
  base.position.set(0, 0.01, 0);
  g.add(base);
  return g;
}

/* folder prezantimi i hapur */
function makeFolder(w, h, color) {
  const g = new THREE.Group();
  const pocket = rb(w - 0.08, h - 0.08, 0.018, 0.01, cover(C.sage, 0.5));
  pocket.position.set(0, h / 2 - 0.02, 0);
  g.add(pocket);
  const panel = (xoff, rot) => {
    const p = rb(w, h, 0.03, 0.015, cover(color));
    p.position.set(xoff, h / 2, 0);
    p.rotation.y = rot;
    return p;
  };
  g.add(panel(-w * 0.27, 0.13));
  g.add(panel(w * 0.27, -0.13));
  return g;
}

/* bllok fletesh me karton */
function makeNotepad(w, h, d, color) {
  const g = new THREE.Group();
  const pages = rb(w, h, d, 0.01, paper(C.white, 0.62));
  g.add(pages);
  const board = rb(w + 0.02, h * 1.06, d + 0.02, 0.015, cover(color));
  g.add(board);
  const glue = box(w - 0.06, 0.016, 0.055, mat(0xb9b2a6, 0.9));
  glue.position.set(0, h / 2, d / 2 - 0.03);
  g.add(glue);
  return g;
}

/* kuti premium me shirit folie + kapak */
function makePremiumBox(w, h, d, color) {
  const g = new THREE.Group();
  const base = rb(w, h, d, 0.02, cover(color));
  base.position.y = h / 2;
  g.add(base);
  const band = box(w + 0.012, h * 0.16, d + 0.012, foil(C.magenta));
  band.position.y = h * 0.72;
  g.add(band);
  const lid = rb(w, h * 0.32, d, 0.02, cover(color));
  lid.position.set(w * 0.92, h * 0.16, d * 0.62);
  lid.rotation.y = 0.5;
  lid.rotation.z = 0.05;
  g.add(lid);
  const lb = box(w * 0.98, 0.05, d * 0.98, foil(C.gold));
  lb.position.set(w * 0.92, h * 0.3, d * 0.62);
  lb.rotation.y = 0.5;
  lb.rotation.z = 0.05;
  g.add(lb);
  return g;
}

/* diplome e mbeshtjellur me fjongo */
function makeDiploma(len, r) {
  const g = new THREE.Group();
  const roll = cyl(r, r, len, paper(C.cream, 0.6), 24);
  roll.rotation.x = Math.PI / 2;
  g.add(roll);
  const band = box(0.045, r * 2 + 0.035, len * 0.09, cover(C.navy));
  g.add(band);
  const b1 = box(0.13, 0.055, 0.05, cover(C.navy));
  b1.position.set(0, r + 0.035, 0);
  const b2 = box(0.13, 0.055, 0.05, cover(C.navy));
  b2.position.set(0, r + 0.035, 0.1);
  b2.rotation.z = 0.7;
  g.add(b1);
  g.add(b2);
  return g;
}

/* certifikate me kornize */
function makeCertificate(w, h) {
  const g = new THREE.Group();
  const sheet = rb(w - 0.09, h - 0.09, 0.036, 0.01, paper(C.white, 0.5));
  sheet.position.y = h / 2;
  g.add(sheet);
  const band = box(w - 0.2, 0.028, 0.038, foil(C.gold));
  band.position.set(0, h * 0.68, 0);
  g.add(band);
  const frame = rb(w, h, 0.035, 0.02, cover(C.charcoal, 0.32));
  frame.position.y = h / 2;
  g.add(frame);
  return g;
}

function shadows(g) {
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}
/* ================= SKENA ================= */
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(1);
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(C.bg);

const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(1.2, 4.2, 10.0);
camera.lookAt(0.3, 0.9, 0.2);

/* IBL — reflektime te buta per folie/clearcoat */
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = envTex;

RectAreaLightUniformsLib.init();

/* dyshemeja + muri i lakuar (cove) */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshPhysicalMaterial({ color: C.floor, roughness: 0.32, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.5 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const cove = new THREE.Mesh(
  new THREE.CylinderGeometry(14, 14, 10, 64, 1, true, 0, Math.PI),
  mat(C.bg, 0.95)
);
cove.position.set(0, 5, -6);
cove.rotation.y = Math.PI;
scene.add(cove);

/* ndricimi i studios */
scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d4ce, 0.3));

const key = new THREE.RectAreaLight(0xfff1de, 90, 6.5, 3.6);
key.position.set(-7.5, 5.6, 6.2);
key.lookAt(0, 0.9, 0);
scene.add(key);

const fill = new THREE.RectAreaLight(0xeef2ff, 30, 4.5, 2.8);
fill.position.set(8, 3.2, 5.8);
fill.lookAt(0, 0.9, 0);
scene.add(fill);

const rim = new THREE.RectAreaLight(0xffffff, 45, 6, 2);
rim.position.set(0, 6.4, -7.5);
rim.lookAt(0, 1.2, 0);
scene.add(rim);

const sun = new THREE.DirectionalLight(0xfff2e2, 0.9);
sun.position.set(5, 10, 4);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -9; sun.shadow.camera.right = 9;
sun.shadow.camera.top = 9; sun.shadow.camera.bottom = -9;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 30;
sun.shadow.bias = -0.0006;
sun.shadow.radius = 6;
scene.add(sun);

/* ================= PRODUKTET ================= */
/* Grupi A — kuti premium + libra */
const boxG = group(scene, -3.7, 0, 1.0, 0.15);
boxG.add(makePremiumBox(0.95, 0.68, 0.95, C.navy));

const books = group(scene, -2.1, 0, 0.95, 0.1);
const bk1 = makeBook(0.5, 0.07, 0.68, C.coral); bk1.position.y = 0.035; books.add(bk1);
const bk2 = makeBook(0.46, 0.065, 0.63, C.navy); bk2.position.y = 0.105; books.add(bk2);
const bk3 = makeBook(0.42, 0.06, 0.58, C.gold); bk3.position.y = 0.17; books.add(bk3);

/* Grupi B — katalog + reviste + broshure */
const catalog = group(scene, -0.55, 0, -0.75, 0.45);
catalog.add(makeOpenBook(0.55, 0.42, C.magenta));

const mag = group(scene, -0.5, 0, 0.75, 0.35);
const m1 = rb(0.62, 0.02, 0.42, 0.008, cover(C.coral, 0.18));
const m2 = rb(0.6, 0.018, 0.4, 0.008, paper(C.white, 0.55));
m2.position.set(-0.008, 0.028, 0);
mag.add(m1); mag.add(m2);

const bro = group(scene, 0.45, 0, -0.7, -0.3);
bro.add(makeBrochure(0.5, 0.36, C.sage));

/* Grupi C — fletore + bllok + folder */
const note = group(scene, 1.4, 0, 1.05, 0.5);
note.add(makeNotebook(0.45, 0.055, 0.6, C.navy));

const pad = group(scene, 2.05, 0, 0.15, -0.2);
pad.add(makeNotepad(0.38, 0.09, 0.5, C.magenta));

const folder = group(scene, 0.8, 0, -1.35, 0.2);
folder.add(makeFolder(0.42, 0.6, C.navy));

/* Grupi D — postera + tufe + kalendar + certifikate + diplome */
const posters = group(scene, 3.35, 0, -0.5, 0.1);
const r1 = makePosterRoll(0.95, 0.065, C.white, C.navy); r1.position.set(-0.12, 0, 0); r1.rotation.z = 0.08; posters.add(r1);
const r2 = makePosterRoll(0.9, 0.06, C.cream, C.coral); r2.position.set(0.05, 0, 0.05); r2.rotation.z = -0.05; posters.add(r2);
const r3 = makePosterRoll(0.88, 0.058, C.white, C.gold); r3.position.set(0.2, 0, -0.04); r3.rotation.z = 0.16; posters.add(r3);

const flyers = group(scene, 3.0, 0, 0.95, 0.25);
flyers.add(makeFlyerStack(0.34, 0.48, 9, C.magenta));

const cal = group(scene, 4.1, 0, -0.35, -0.35);
cal.add(makeCalendar(0.4, 0.52, C.ink));

const cert = group(scene, 4.6, 0, 1.0, -0.2);
cert.add(makeCertificate(0.52, 0.7));
cert.rotation.x = -0.08;

const dipl = group(scene, 3.4, 0, 1.8, 0.7);
dipl.add(makeDiploma(0.72, 0.045));
dipl.rotation.z = 0.04;

/* hijet per gjithcka (pervec dyshemese) */
scene.traverse((o) => {
  if (o.isMesh && o !== floor) { o.castShadow = true; o.receiveShadow = true; }
});

/* render nje kornize (pa loop) — Chrome e kap me screenshot */
window.addEventListener('load', () => {
  renderer.render(scene, camera);
  setTimeout(() => renderer.render(scene, camera), 350);
  setTimeout(() => renderer.render(scene, camera), 1200);
});
