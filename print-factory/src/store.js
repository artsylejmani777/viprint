/* ==========================================================================
   store.js — zustand store: gjithë logjika e lojës Print Factory 3D
   ========================================================================== */
import { create } from 'zustand';
import * as D from './data';

let n = 1;
const uid = () => 'e' + (n++);

const SECTOR_LAYOUT = [
  { id: 'offset1', x: -8, z: -4 },
  { id: 'offset2', x: 0, z: -4 },
  { id: 'digjital', x: 8, z: -4 },
  { id: 'folie', x: -8, z: 3 },
  { id: 'lakim', x: 0, z: 3 },
  { id: 'prerje', x: 8, z: 3 },
];
const SPOTS = [-8, -5, -2, 2, 5, 8];

function makeOrder() {
  const p = D.pick(D.PRODUCTS);
  const qty = 10 + Math.floor(Math.random() * 21);
  const c = D.pick(D.COMPANIES);
  return {
    id: uid(), productId: p.id, qty, company: c.name, companyEmoji: c.emoji,
    machine: p.machine, reward: Math.max(300, Math.round(p.base * qty * 1.05)),
  };
}

function dist(ax, az, bx, bz) { return Math.hypot(ax - bx, az - bz); }

export const useGame = create((set, get) => ({
  started: false,
  level: 1,
  money: 0,
  earned: 0,
  timeLeft: D.L1_TIME,
  workers: 0,
  stickers: 0,
  toastMsg: null,
  toastKind: 'ok',
  toastAt: 0,
  intro: true,

  player: { x: 0, z: 7, dir: 1 },
  customers: [],
  sectors: SECTOR_LAYOUT.map((s) => ({ ...s, printing: false, progress: 0, product: null, units: 2 })),
  orders: [],
  carrying: null,

  /* ---------- ui ---------- */
  toast: (msg, kind) => set({ toastMsg: msg, toastKind: kind || 'ok', toastAt: Date.now() }),

  /* ---------- flow ---------- */
  start: () => {
    set({
      started: true, intro: false, level: 1, money: 0, earned: 0,
      timeLeft: D.L1_TIME, orders: [], carrying: null, customers: [], sectors: SECTOR_LAYOUT.map((s) => ({ ...s, printing: false, progress: 0, product: null, units: 2 })),
    });
    get().spawnCustomer();
    get().spawnCustomer();
  },

  spawnCustomer: () => {
    const s = get();
    if (s.customers.length >= 6) return;
    const o = makeOrder();
    const nm = D.pick(D.NAMES);
    const spot = SPOTS[s.customers.length % SPOTS.length];
    const c = {
      id: uid(), name: nm.name, gender: nm.gender,
      x: 0, z: 11, targetX: spot, state: 'announce', announceT: 1.0, patience: 45,
      productId: o.productId, qty: o.qty, company: o.company, companyEmoji: o.companyEmoji,
      machine: o.machine, reward: o.reward, orderId: o.id, orderTaken: false,
    };
    set({ customers: [...s.customers, c] });
    get().toast('🔔 ' + nm.name + ' (' + o.companyEmoji + ' ' + o.company + '): ' + o.qty + '× ' + D.product(o.productId).name, 'ok');
  },

  setPlayer: (x, z, dir) => set({ player: { x, z, dir } }),

  /* ---------- sim tick (thirret çdo frame) ---------- */
  tick: (dt) => {
    const s = get();
    if (!s.started) return;

    if (s.level === 1 && s.timeLeft > 0) {
      const t = Math.max(0, s.timeLeft - dt);
      set({ timeLeft: t });
      if (t === 0) get().toast('⏱ Koha e nivelit 1 mbaroi! Vazhdo derisa të fitosh ' + D.GOAL_MONEY + '€.', 'warn');
    }

    // customers
    let removedOrderIds = [];
    const customers = s.customers
      .map((c) => {
        const cc = { ...c };
        if (cc.state === 'announce') {
          cc.announceT -= dt;
          if (cc.announceT <= 0) cc.state = 'walk';
        } else if (cc.state === 'walk') {
          const dx = cc.targetX - cc.x;
          const st = Math.min(Math.abs(dx), 3.4 * dt);
          cc.x += Math.sign(dx) * st;
          if (Math.abs(dx) < 0.08) cc.state = 'wait';
        } else if (cc.state === 'leave') {
          cc.z -= 4.5 * dt;
          if (cc.z < -12) cc.state = 'gone';
        } else if (cc.state === 'wait') {
          cc.patience -= dt;
          if (cc.patience <= 0) {
            cc.state = 'leave';
            removedOrderIds.push(cc.orderId);
          }
        }
        return cc;
      })
      .filter((c) => c.state !== 'gone');

    // machines
    const sectors = s.sectors.map((sec) => {
      const m = { ...sec };
      if (m.printing) {
        m.progress += dt / 0.5;
        if (m.progress >= 1) { m.printing = false; m.progress = 1; m.done = true; get().toast('✅ U shtyp! Merre me E.', 'ok'); }
      }
      return m;
    });

    let carrying = s.carrying;
    if (carrying && removedOrderIds.includes(carrying.orderId)) carrying = null;
    const orders = s.orders.filter((o) => !removedOrderIds.includes(o.id));

    set({ customers, sectors, orders, carrying });
  },

  /* ---------- interactions ---------- */
  interact: () => {
    const s = get();
    if (!s.started) return;
    const p = s.player;

    // carrying → deliver to nearest customer
    if (s.carrying) {
      let best = null, bd = 3;
      s.customers.forEach((c) => {
        if (c.state !== 'wait') return;
        const d = dist(p.x, p.z, c.x, c.z);
        if (d < bd) { bd = d; best = c; }
      });
      if (best) get().deliverTo(best.id);
      else get().toast('Çoje te klienti i duhur!', 'warn');
      return;
    }

    // pick up a finished product?
    let doneSec = null, bd2 = 3;
    s.sectors.forEach((sec) => {
      if (sec.done && sec.product) {
        const d = dist(p.x, p.z, sec.x, sec.z);
        if (d < bd2) { bd2 = d; doneSec = sec; }
      }
    });
    if (doneSec) { get().pickupAt(doneSec.id); return; }

    // take an order from nearest customer?
    let cust = null, bd3 = 3;
    s.customers.forEach((c) => {
      if (c.state !== 'wait' || c.orderTaken) return;
      const d = dist(p.x, p.z, c.x, c.z);
      if (d < bd3) { bd3 = d; cust = c; }
    });
    if (cust) { get().takeOrder(cust.id); return; }

    // print at nearest sector?
    let sec = null, bd4 = 3;
    s.sectors.forEach((x) => {
      const d = dist(p.x, p.z, x.x, x.z);
      if (d < bd4) { bd4 = d; sec = x; }
    });
    if (sec) { get().printAt(sec.id); return; }

    get().toast('Afrohu te një klient ose makinë!', 'warn');
  },

  takeOrder: (customerId) => {
    const s = get();
    const c = s.customers.find((x) => x.id === customerId);
    if (!c || c.orderTaken) return;
    const order = { id: c.orderId, productId: c.productId, qty: c.qty, company: c.company, companyEmoji: c.companyEmoji, machine: c.machine, reward: c.reward, customerId, status: 'new' };
    set({
      orders: [...s.orders, order],
      customers: s.customers.map((x) => (x.id === customerId ? { ...x, orderTaken: true } : x)),
    });
    get().toast('📋 Porosia e marrë! (' + (s.orders.length + 1) + ' aktive)', 'ok');
    get().spawnCustomer();
  },

  printAt: (sectorId) => {
    const s = get();
    const sec = s.sectors.find((x) => x.id === sectorId);
    if (!sec || sec.printing || sec.done) return;
    const entry = s.orders.find((o) => o.status === 'new' && o.machine === sec.id);
    if (!entry) { get().toast('❌ Nuk ka porosi për sektorin ' + D.machine(sec.id).name + '!', 'warn'); return; }
    set({
      sectors: s.sectors.map((x) => (x.id === sectorId ? { ...x, printing: true, progress: 0, done: false, product: { productId: entry.productId, orderId: entry.id } } : x)),
      orders: s.orders.map((o) => (o.id === entry.id ? { ...o, status: 'printing' } : o)),
    });
  },

  pickupAt: (sectorId) => {
    const s = get();
    const sec = s.sectors.find((x) => x.id === sectorId);
    if (!sec || !sec.product || s.carrying) return;
    set({
      carrying: sec.product,
      sectors: s.sectors.map((x) => (x.id === sectorId ? { ...x, product: null, done: false } : x)),
      orders: s.orders.map((o) => (o.id === sec.product.orderId ? { ...o, status: 'carrying' } : o)),
    });
    get().toast('📦 E ke produktin! Çoja klientit.', 'ok');
  },

  deliverTo: (customerId) => {
    const s = get();
    if (!s.carrying) return;
    const entry = s.orders.find((o) => o.id === s.carrying.orderId);
    if (!entry || entry.customerId !== customerId) { get().toast('Ky nuk është klienti i duhur!', 'warn'); return; }
    const money = entry.reward;
    set({
      money: s.money + money,
      earned: s.earned + money,
      carrying: null,
      orders: s.orders.filter((o) => o.id !== entry.id),
      customers: s.customers.map((x) => (x.id === customerId ? { ...x, state: 'leave' } : x)),
    });
    get().toast('💰 +' + money + '€', 'money');
    get().spawnCustomer();
  },

  /* ---------- economy ---------- */
  canUpgrade: () => { const s = get(); return s.level === 1 && s.earned >= D.GOAL_MONEY; },
  upgrade: () => {
    const s = get();
    if (!(s.level === 1 && s.earned >= D.GOAL_MONEY)) return;
    set({ level: 2, timeLeft: 0, workers: 5 });
    get().toast('🏭 Niveli 2! 20 makina + 5 punëtorë. Luaj sa të duash!', 'level');
  },
  buyWorker: () => {
    const s = get();
    if (s.level !== 2 || s.money < D.WORKER_COST) { get().toast('Nuk ke para (' + D.WORKER_COST + '€)!', 'warn'); return; }
    set({ money: s.money - D.WORKER_COST, workers: s.workers + 1 });
    get().toast('🧑‍🏭 Punëtor i ri!', 'ok');
  },
  buySticker: () => {
    const s = get();
    if (s.money < D.STICKER_COST) { get().toast('Nuk ke para (' + D.STICKER_COST + '€)!', 'warn'); return; }
    set({ money: s.money - D.STICKER_COST, stickers: s.stickers + 1 });
    get().toast('⭐ Sticker i ri!', 'ok');
  },
}));
