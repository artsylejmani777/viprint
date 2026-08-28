/* ============================================================
   VI-PRINT: PRINT MASTER — Motori
   State, ekonomia, pikët, kohëmatësi, toast-et, audio, ruajtja.
   ============================================================ */
(function () {
  'use strict';
  var PM = window.PM;

  /* ---------------- Utilitete ---------------- */
  var U = PM.U = {
    el: function (tag, cls, html) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      return e;
    },
    q:  function (s, r) { return (r || document).querySelector(s); },
    qa: function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); },
    esc: function (s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },
    clamp: function (v, a, b) { return v < a ? a : (v > b ? b : v); },
    rnd:   function (a, b) { return a + Math.random() * (b - a); },
    pick:  function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    },
    money: function (n) {
      return '€' + Math.round(n).toLocaleString('de-DE');
    },
    byId: function (list, id) {
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return null;
    },
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  /* ---------------- Ruajtja (localStorage) ---------------- */
  var SAVE_KEY = 'viprint.printmaster.v2';

  var Save = PM.Save = {
    load: function () {
      try {
        var raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        var d = JSON.parse(raw);
        return (d && typeof d === 'object') ? d : null;
      } catch (e) { return null; }
    },
    write: function (data) {
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) {}
    },
    clear: function () { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
  };

  /* ============================================================
     GAME STATE
     ============================================================ */
  var G = PM.G = {
    /* progresi i përhershëm */
    money: PM.START_MONEY || 20000,
    unlocked: 1,          // sa nivele janë hapur
    upgrades: {},         // { id: true }
    best: {},             // { levelId: percent }
    totalOrders: 0,

    /* porosia aktuale */
    level: null,
    stageIdx: 0,
    stages: [],
    timeLeft: 0,
    running: false,

    /* produkti — çdo fazë e transformon */
    p: null,

    /* metrikat e prodhimit */
    m: null
  };

  PM.freshProduct = function (level) {
    var mat = U.byId(PM.MATERIALS, 'standard');
    return {
      type: level.type,
      format: null,
      material: null,
      matBase: '#DCD6CB',
      matTex: 'fiber',
      inkColor: level.styleInk || '#16161C',
      printed: false,
      artwork: ['logo', 'name'],   // vendoset automatikisht (pa drag-drop)
      artworkScore: 0,
      effects: [],          // id-të e efekteve të zgjedhura
      foil: null,           // { tone, quality }
      relief: null,         // { dir:'up'|'down', quality }
      finish: null,         // id
      varnish: [],          // zonat
      texture: false,
      fluo: false,
      cut: false,
      folded: false,
      bound: false,
      bundle: false,
      inserts: [],
      shipping: null,
      defects: [],          // defektet aktive (QC)
      stageDone: []
    };
  };

  PM.freshMetrics = function () {
    return {
      format: null, material: null, artwork: null, print: null, color: null,
      effect: null, foil: null, emboss: null, finish: null, varnish: null,
      cut: null, fold: null, bind: null, assembly: null, qc: null,
      waste: 0, satisfaction: 70, eco: 50,
      costs: 0, penalties: 0, bonus: 0, deliverySec: 0
    };
  };

  /* ---------------- Upgrade helpers ---------------- */
  PM.has = function (id) { return !!G.upgrades[id]; };

  /** Zgjerimi i zonave të gjelbra sipas upgrade-ve */
  PM.zoneBonus = function (kind) {
    if (kind === 'print' && PM.has('printer')) return 1.45;
    if (kind === 'cut'   && PM.has('cutter'))  return 1.45;
    if (kind === 'foil'  && PM.has('foil'))    return 1.50;
    return 1;
  };

  /* ============================================================
     KOHËMATËSI
     ============================================================ */
  var tick = null;

  PM.startTimer = function (seconds, onTick, onEnd) {
    PM.stopTimer();
    G.timeLeft = seconds;
    G.running = true;
    var t0 = Date.now();
    var total = seconds;
    tick = setInterval(function () {
      var elapsed = (Date.now() - t0) / 1000;
      G.timeLeft = Math.max(total - elapsed, 0);
      if (onTick) onTick(G.timeLeft, total);
      if (G.timeLeft <= 0) {
        PM.stopTimer();
        if (onEnd) onEnd();
      }
    }, 100);
  };

  PM.stopTimer = function () {
    if (tick) { clearInterval(tick); tick = null; }
    G.running = false;
  };

  PM.addTime = function (s) {
    G.timeLeft = Math.max(G.timeLeft + s, 0);
  };

  /* ============================================================
     TOASTS / FEEDBACK
     ============================================================ */
  PM.toast = function (text, kind, sub) {
    var host = U.q('[data-toasts]');
    if (!host) return;
    var t = U.el('div', 'toast toast--' + (kind || 'ok'));
    t.innerHTML = '<span class="toast__txt">' + U.esc(text) + '</span>' +
                  (sub ? '<span class="toast__sub">' + U.esc(sub) + '</span>' : '');
    host.appendChild(t);
    PM.sfx(kind === 'bad' ? 'bad' : (kind === 'warn' ? 'warn' : 'good'));
    setTimeout(function () { t.classList.add('is-out'); }, 1500);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2100);
  };

  /** Flash i madh mbi produkt (transformimi) */
  PM.flash = function (label) {
    var host = U.q('[data-stage-flash]');
    if (!host) return;
    host.textContent = label;
    host.classList.remove('is-on');
    void host.offsetWidth;
    host.classList.add('is-on');
  };

  /** Shkëndija / partikula ari mbi produkt */
  PM.sparkle = function (n) {
    if (U.reduced) return;
    var host = U.q('[data-sparks]');
    if (!host) return;
    n = n || 18;
    for (var i = 0; i < n; i++) {
      var s = U.el('i', 'spark');
      s.style.left = U.rnd(8, 92).toFixed(1) + '%';
      s.style.top  = U.rnd(12, 88).toFixed(1) + '%';
      s.style.animationDelay = (Math.random() * 260).toFixed(0) + 'ms';
      s.style.setProperty('--dx', U.rnd(-26, 26).toFixed(0) + 'px');
      s.style.setProperty('--dy', U.rnd(-40, -8).toFixed(0) + 'px');
      host.appendChild(s);
      (function (node) { setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 1400); })(s);
    }
  };

  /* ============================================================
     AUDIO (WebAudio, pa skedarë)
     ============================================================ */
  var actx = null, muted = false;

  PM.toggleMute = function () { muted = !muted; return muted; };
  PM.isMuted = function () { return muted; };

  function ac() {
    if (muted) return null;
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      return actx;
    } catch (e) { return null; }
  }

  var SFX = {
    good:  { f: 660, to: 990, d: 0.12, type: 'triangle', g: 0.05 },
    bad:   { f: 220, to: 110, d: 0.22, type: 'sawtooth', g: 0.05 },
    warn:  { f: 380, to: 300, d: 0.14, type: 'square',   g: 0.04 },
    click: { f: 880, to: 880, d: 0.04, type: 'square',   g: 0.03 },
    press: { f: 140, to: 60,  d: 0.26, type: 'sine',     g: 0.09 },
    shine: { f: 1400, to: 2400, d: 0.3, type: 'sine',    g: 0.04 },
    cut:   { f: 1800, to: 400, d: 0.1, type: 'square',   g: 0.04 },
    roll:  { f: 90,  to: 120, d: 0.5, type: 'sine',      g: 0.05 }
  };

  PM.sfx = function (name) {
    var cfg = SFX[name]; if (!cfg) return;
    var c = ac(); if (!c) return;
    try {
      var o = c.createOscillator(), g = c.createGain();
      o.type = cfg.type;
      o.frequency.setValueAtTime(cfg.f, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(Math.max(cfg.to, 20), c.currentTime + cfg.d);
      g.gain.setValueAtTime(cfg.g, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + cfg.d);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + cfg.d + 0.02);
    } catch (e) {}
  };

  /* ============================================================
     PIKËT
     ============================================================ */
  /** Konverto një gabim (0..1, 0=perfekt) në pikë 0..100 */
  PM.scoreFromError = function (err) {
    return Math.round(U.clamp(100 - err * 100, 0, 100));
  };

  PM.addWaste = function (pct) {
    var f = PM.has('waste') ? 0.65 : 1;
    G.m.waste = Math.min(G.m.waste + pct * f, 40);
  };

  /** Mesatarja e ponderuar e metrikave të mbushura */
  PM.finalScore = function () {
    var m = G.m;
    var keys = ['format','material','artwork','print','color','effect','foil','emboss',
                'finish','varnish','cut','fold','bind','assembly','qc'];
    var sum = 0, n = 0;
    keys.forEach(function (k) {
      if (typeof m[k] === 'number') { sum += m[k]; n++; }
    });
    var base = n ? sum / n : 0;
    base -= m.waste * 0.55;
    base += m.bonus;
    base -= m.penalties;
    return Math.round(U.clamp(base, 0, 100));
  };

  PM.stars = function (pct) {
    if (pct >= 96) return 5;
    if (pct >= 88) return 4;
    if (pct >= 76) return 3;
    if (pct >= 60) return 2;
    return 1;
  };

  PM.grade = function (pct) {
    if (pct >= 96) return 'PERFECT PRINT';
    if (pct >= 88) return 'EXCELLENT RUN';
    if (pct >= 76) return 'GOOD PRODUCTION';
    if (pct >= 60) return 'ACCEPTABLE';
    return 'REWORK NEEDED';
  };

  /* ---------------- Ekonomia ---------------- */
  PM.economy = function () {
    var lvl = G.level, p = G.p, m = G.m;
    var revenue = lvl.value * (PM.has('capacity') ? 1.12 : 1);

    var materialCost = (p.material ? U.byId(PM.MATERIALS, p.material).cost : 200);
    var machineCost = G.stages.length * 40;               // 40€/fazë (më parë 95)
    var effectsCost = 0;
    p.effects.forEach(function (id) {
      var e = U.byId(PM.EFFECTS, id); if (e) effectsCost += e.cost;
    });
    if (p.finish) { var f = U.byId(PM.FINISHES, p.finish); if (f) effectsCost += f.cost; }
    p.inserts.forEach(function (id) {
      var i = U.byId(PM.INSERTS, id); if (i) effectsCost += i.cost;
    });
    var shipCost = p.shipping ? U.byId(PM.SHIPPING, p.shipping).cost : 70;   // më parë 120
    var wasteCost = revenue * (m.waste / 100) * 0.35;                        // më parë 0.55

    var cost = materialCost + machineCost + effectsCost + shipCost + wasteCost;

    /* FITIMI GJITHMONË POZITIV: kostot nuk kalojnë kurrë 85% të vlerës së porosisë.
       Nëse kalojnë, komponentët zvogëlohen proporcionalisht (raporti mbetet i saktë). */
    var maxCost = revenue * 0.85;
    if (cost > maxCost) {
      var s = maxCost / cost;
      materialCost *= s; machineCost *= s; effectsCost *= s; shipCost *= s; wasteCost *= s;
      cost = maxCost;
    }

    return {
      revenue: revenue,
      material: materialCost,
      machine: machineCost,
      extras: effectsCost,
      shipping: shipCost,
      waste: wasteCost,
      cost: cost,
      profit: revenue - cost   // gjithmonë ≥ 15% e vlerës → pozitiv
    };
  };

  /* ---------------- Progresi ---------------- */
  PM.persist = function () {
    Save.write({
      money: G.money, unlocked: G.unlocked, upgrades: G.upgrades,
      best: G.best, totalOrders: G.totalOrders, muted: muted
    });
  };

  PM.restore = function () {
    var d = Save.load();
    if (!d) return false;
    G.money = (typeof d.money === 'number') ? d.money : (PM.START_MONEY || 20000);
    G.unlocked = Math.max(d.unlocked || 1, 1);
    G.upgrades = d.upgrades || {};
    G.best = d.best || {};
    G.totalOrders = d.totalOrders || 0;
    muted = !!d.muted;
    return true;
  };

  PM.resetAll = function () {
    Save.clear();
    G.money = PM.START_MONEY || 20000;
    G.unlocked = 1; G.upgrades = {}; G.best = {}; G.totalOrders = 0;
  };
})();
