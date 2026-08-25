/* ============================================================
   VI-PRINT: PRINT MASTER — Rrjedha e lojës
   Boot → Order board → Order card → Prodhimi → Raporti → Upgrade
   ============================================================ */
(function () {
  'use strict';
  var PM = window.PM, U = PM.U, G = PM.G;

  var els = {};
  var activeStage = null, eventTimer = null;

  /* ---------------- Ndërrimi i ekraneve ---------------- */
  function show(name) {
    U.qa('.screen').forEach(function (s) {
      s.classList.toggle('is-on', s.dataset.screen === name);
    });
    els.root.setAttribute('data-screen', name);
    window.scrollTo(0, 0);
  }

  /* ============================================================
     ORDER BOARD (menu)
     ============================================================ */
  function renderBoard() {
    var host = els.board;
    host.innerHTML = PM.LEVELS.map(function (lvl, i) {
      var cl = PM.CLIENTS[lvl.client];
      var locked = (i + 1) > G.unlocked;
      var best = G.best[lvl.id];
      return '<button class="ord' + (locked ? ' is-locked' : '') + '" type="button" ' +
             (locked ? 'disabled aria-disabled="true"' : 'data-lvl="' + i + '"') + '>' +
        '<span class="ord__top">' +
          '<span class="ord__n">ORDER ' + String(lvl.id).padStart(2, '0') + '</span>' +
          (locked ? '<span class="ord__lock">LOCKED</span>'
                  : (best ? '<span class="ord__best">' + best + '%</span>' : '<span class="ord__new">NEW</span>')) +
        '</span>' +
        '<span class="ord__client" style="--c:' + cl.accent + '">' + U.esc(cl.name) + '</span>' +
        '<span class="ord__prod">' + U.esc(lvl.product) + '</span>' +
        '<span class="ord__meta">' +
          '<i>' + U.esc(lvl.style) + '</i>' +
          '<i>' + lvl.pipeline.length + ' steps</i>' +
          '<i>' + lvl.deadline + 's</i>' +
        '</span>' +
        '<span class="ord__val">' + U.money(lvl.value) + '</span>' +
      '</button>';
    }).join('');

    U.qa('.ord[data-lvl]', host).forEach(function (b) {
      b.addEventListener('click', function () { openOrder(+b.dataset.lvl); });
    });
    renderWallet();
    renderFactory();
  }

  function renderWallet() {
    U.qa('[data-wallet]').forEach(function (n) { n.textContent = U.money(G.money); });
    var o = U.q('[data-orders]'); if (o) o.textContent = G.totalOrders;
    var up = U.q('[data-upcount]');
    if (up) up.textContent = Object.keys(G.upgrades).length + ' / ' + PM.UPGRADES.length;
  }

  function renderFactory() {
    els.factory.innerHTML = PM.UPGRADES.map(function (u) {
      var owned = PM.has(u.id);
      var afford = G.money >= u.cost;
      return '<div class="upg' + (owned ? ' is-owned' : '') + '">' +
        '<span class="upg__ico" data-u="' + u.id + '"></span>' +
        '<span class="upg__l">' + U.esc(u.label) + '</span>' +
        '<span class="upg__d">' + U.esc(u.desc) + '</span>' +
        (owned
          ? '<span class="upg__done">INSTALLED ✓</span>'
          : '<button class="upg__buy" type="button" data-buy="' + u.id + '"' +
            (afford ? '' : ' disabled') + '>' + U.money(u.cost) + '</button>') +
      '</div>';
    }).join('');

    U.qa('[data-buy]', els.factory).forEach(function (b) {
      b.addEventListener('click', function () {
        var u = U.byId(PM.UPGRADES, b.dataset.buy);
        if (!u || G.money < u.cost || PM.has(u.id)) return;
        G.money -= u.cost;
        G.upgrades[u.id] = true;
        PM.persist();
        PM.sfx('good');
        PM.toast('UPGRADE INSTALLED', 'ok', u.label);
        renderFactory(); renderWallet();
        els.root.classList.add('fx-upgrade');
        setTimeout(function () { els.root.classList.remove('fx-upgrade'); }, 900);
      });
    });
  }

  /* ============================================================
     ORDER CARD
     ============================================================ */
  function openOrder(idx) {
    var lvl = PM.LEVELS[idx];
    var cl = PM.CLIENTS[lvl.client];
    G.level = lvl;
    G.stages = lvl.pipeline.slice();

    var effTxt = lvl.effects.length
      ? lvl.effects.map(function (id) { return U.byId(PM.EFFECTS, id).label; }).join(' + ')
      : 'None';
    var finTxt = lvl.finish ? U.byId(PM.FINISHES, lvl.finish).label : 'None';
    var fmt = U.byId(PM.FORMATS[lvl.type], lvl.format);
    var mat = U.byId(PM.MATERIALS, lvl.material);

    els.order.innerHTML =
      '<div class="ocard" style="--c:' + cl.accent + '">' +
        '<div class="ocard__stamp">VI-PRINT</div>' +
        '<div class="ocard__hd">' +
          '<span class="ocard__kicker">NEW CUSTOMER ORDER</span>' +
          '<span class="ocard__id">#' + String(lvl.id).padStart(4, '0') + '</span>' +
        '</div>' +
        '<dl class="ocard__rows">' +
          row('CLIENT', cl.name) +
          row('PRODUCT', lvl.product) +
          row('FORMAT', (fmt ? fmt.label + ' — ' + fmt.spec : '—')) +
          row('MATERIAL', (mat ? mat.label : '—')) +
          row('STYLE', lvl.style) +
          row('EFFECTS', effTxt) +
          row('FINISH', finTxt) +
          (lvl.varnishAreas ? row('SPOT VARNISH', lvl.varnishAreas.map(function (a) {
            return U.byId(PM.VARNISH_AREAS, a).label; }).join(', ')) : '') +
          (lvl.inserts && lvl.inserts.length ? row('INSERTS', lvl.inserts.map(function (a) {
            return U.byId(PM.INSERTS, a).label; }).join(', ')) : '') +
          row('DEADLINE', lvl.deadline + ' Seconds') +
        '</dl>' +
        '<div class="ocard__val"><span>ORDER VALUE</span><b>' + U.money(lvl.value) + '</b></div>' +
        '<p class="ocard__brief">' + U.esc(lvl.brief) + '</p>' +
        '<p class="ocard__focus">Prioriteti i klientit: <b>' + U.esc(cl.focus) + '</b></p>' +
        '<div class="ocard__cta">' +
          '<button class="gbtn gbtn--ghost" type="button" data-back>BACK</button>' +
          '<button class="gbtn gbtn--gold" type="button" data-accept>ACCEPT ORDER</button>' +
        '</div>' +
        '<p class="ocard__fine">Simulim prodhimi. Klientët, vlerat dhe kostot janë fiktive.</p>' +
      '</div>';

    U.q('[data-back]', els.order).addEventListener('click', function () { show('menu'); });
    U.q('[data-accept]', els.order).addEventListener('click', function () { startLevel(); });
    show('order');

    function row(k, v) {
      return '<div class="orow"><dt>' + k + '</dt><dd>' + U.esc(v) + '</dd></div>';
    }
  }

  /* ============================================================
     PRODHIMI
     ============================================================ */
  function startLevel() {
    var lvl = G.level;
    G.p = PM.freshProduct(lvl);
    G.m = PM.freshMetrics();
    G.stageIdx = 0;

    /* HUD */
    var cl = PM.CLIENTS[lvl.client];
    els.hudClient.textContent = cl.name;
    els.hudProd.textContent = lvl.product;
    els.hudSpec.innerHTML =
      '<i>' + U.esc(lvl.style) + '</i>' +
      (lvl.effects.length ? '<i>' + U.esc(lvl.effects.map(function (id) {
        return U.byId(PM.EFFECTS, id).label; }).join(' + ')) + '</i>' : '') +
      (lvl.finish ? '<i>' + U.esc(U.byId(PM.FINISHES, lvl.finish).label) + '</i>' : '');

    show('play');
    PM.Product.mount(els.pv);
    PM.Product.enableDrag(true);
    renderTrack();

    PM.startTimer(lvl.deadline, onTick, onTimeUp);
    mountStage();
  }

  function onTick(left, total) {
    var pct = left / total;
    els.timeNum.textContent = left.toFixed(1);
    els.timeBar.style.transform = 'scaleX(' + pct + ')';
    els.timeBar.parentNode.classList.toggle('is-low', pct < 0.25);
  }

  function onTimeUp() {
    PM.toast('DEADLINE MISSED', 'bad', 'Porosia dorëzohet me vonesë');
    G.m.penalties += 15;
    /* lëmë lojtarin ta përfundojë, por pa bonus kohe */
  }

  function renderTrack() {
    els.track.innerHTML = G.stages.map(function (id, i) {
      var meta = PM.STAGE_META[id] || { n: id };
      var cls = i < G.stageIdx ? 'is-done' : (i === G.stageIdx ? 'is-now' : '');
      return '<span class="tk ' + cls + '"><i></i><b>' + U.esc(meta.n) + '</b></span>';
    }).join('');
    var now = U.q('.tk.is-now', els.track);
    if (now && now.scrollIntoView) {
      els.track.scrollTo({ left: Math.max(now.offsetLeft - els.track.clientWidth / 2, 0), behavior: 'smooth' });
    }
  }

  function mountStage() {
    var id = G.stages[G.stageIdx];
    var stage = PM.STAGES[id];
    if (!stage) { finishLevel(); return; }

    renderTrack();
    activeStage = stage;

    var ctx = {
      level: G.level, p: G.p, m: G.m,
      done: function () { advance(); }
    };
    stage.build(els.panel, ctx);
    els.panel.classList.remove('is-in'); void els.panel.offsetWidth; els.panel.classList.add('is-in');

    maybeEvent();
  }

  function advance() {
    G.p.stageDone.push(G.stages[G.stageIdx]);
    G.stageIdx++;
    if (G.stageIdx >= G.stages.length) { finishLevel(); return; }
    setTimeout(mountStage, 220);
  }

  /* ============================================================
     EVENTE TË PAPRITURA (nivelet 4+)
     ============================================================ */
  function maybeEvent() {
    clearEvent();
    if (G.level.id < 4) return;
    if (G.stageIdx === 0 || G.stageIdx >= G.stages.length - 1) return;
    if (Math.random() > 0.28) return;

    var ev = U.pick(PM.EVENTS);
    var box = els.event;
    box.innerHTML =
      '<div class="evt">' +
        '<span class="evt__l">' + U.esc(ev.label) + '</span>' +
        '<span class="evt__h">' + U.esc(ev.hint) + '</span>' +
        '<button class="evt__b" type="button" data-evt>' + U.esc(ev.action) + '</button>' +
        '<span class="evt__bar"><i data-evtbar></i></span>' +
      '</div>';
    box.classList.add('is-on');
    PM.sfx('warn');

    var bar = U.q('[data-evtbar]', box);
    var dur = 3200, t0 = Date.now(), raf;
    function loop() {
      var p = 1 - (Date.now() - t0) / dur;
      if (p <= 0) { fail(); return; }
      bar.style.transform = 'scaleX(' + p + ')';
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    U.q('[data-evt]', box).addEventListener('click', function () {
      cancelAnimationFrame(raf);
      clearEvent();
      G.m.bonus += 2;
      PM.toast(ev.action + ' ✓', 'ok', 'Reaguar në kohë');
    });

    function fail() {
      cancelAnimationFrame(raf);
      clearEvent();
      PM.addWaste(6);
      G.m.penalties += 4;
      PM.addTime(-3);
      PM.toast(ev.label + ' — HUMBUR', 'bad', '−3s, mbeturina +6%');
    }
    eventTimer = { cancel: function () { cancelAnimationFrame(raf); } };
  }

  function clearEvent() {
    if (eventTimer) { eventTimer.cancel(); eventTimer = null; }
    els.event.classList.remove('is-on');
    els.event.innerHTML = '';
  }

  /* ============================================================
     RAPORTI FINAL
     ============================================================ */
  function finishLevel() {
    PM.stopTimer();
    clearEvent();

    var lvl = G.level, m = G.m;
    var pct = PM.finalScore();
    var stars = PM.stars(pct);
    var eco = PM.economy();
    var grade = PM.grade(pct);

    G.money += Math.max(eco.profit, 0);
    G.totalOrders++;
    if (!G.best[lvl.id] || pct > G.best[lvl.id]) G.best[lvl.id] = pct;
    var unlockedNew = false;
    if (pct >= 60 && G.unlocked === lvl.id && lvl.id < PM.LEVELS.length) {
      G.unlocked = lvl.id + 1;
      unlockedNew = true;
    }
    PM.persist();

    function line(label, val, suffix) {
      if (typeof val !== 'number') return '';
      return '<div class="rl"><span>' + label + '</span>' +
             '<span class="rl__bar"><i style="width:' + U.clamp(val, 0, 100) + '%"></i></span>' +
             '<b>' + Math.round(val) + (suffix || '%') + '</b></div>';
    }

    var nextClient = unlockedNew ? PM.CLIENTS[PM.LEVELS[lvl.id].client] : null;

    els.report.innerHTML =
      '<div class="rep">' +
        '<div class="rep__hd">' +
          '<span class="rep__kicker">PRODUCTION REPORT</span>' +
          '<h2 class="rep__grade">' + grade + '</h2>' +
          '<p class="rep__sub">' + U.esc(PM.CLIENTS[lvl.client].name) + ' — ' + U.esc(lvl.product) + '</p>' +
          '<div class="rep__stars">' + '★'.repeat(stars) + '<span>' + '★'.repeat(5 - stars) + '</span></div>' +
          '<div class="rep__pct"><b>' + pct + '%</b><i>' + grade + '</i></div>' +
        '</div>' +

        '<div class="rep__lines">' +
          line('Print Quality', m.print) +
          line('Color Accuracy', m.color) +
          line('Foil Quality', m.foil) +
          line('Emboss Quality', m.emboss) +
          line('Cutting Precision', m.cut) +
          line('Folding', m.fold) +
          line('Binding', m.bind) +
          line('Artwork Precision', m.artwork) +
          line('Finish', m.finish) +
          line('Spot Varnish', m.varnish) +
          line('Assembly', m.assembly) +
          line('Quality Control', m.qc) +
          '<div class="rl rl--warn"><span>Material Waste</span>' +
            '<span class="rl__bar rl__bar--warn"><i style="width:' + U.clamp(m.waste * 2.5, 0, 100) + '%"></i></span>' +
            '<b>' + m.waste.toFixed(0) + '%</b></div>' +
          '<div class="rl"><span>Delivery</span><span class="rl__bar"><i style="width:' +
            U.clamp(100 - (m.deliverySec / lvl.deadline) * 100, 0, 100) + '%"></i></span>' +
            '<b>' + m.deliverySec + ' / ' + lvl.deadline + 's</b></div>' +
        '</div>' +

        '<div class="rep__eco">' +
          '<div class="eco"><span>Order Value</span><b>' + U.money(eco.revenue) + '</b></div>' +
          '<div class="eco eco--sub"><span>Material</span><b>−' + U.money(eco.material) + '</b></div>' +
          '<div class="eco eco--sub"><span>Machines</span><b>−' + U.money(eco.machine) + '</b></div>' +
          '<div class="eco eco--sub"><span>Effects & Inserts</span><b>−' + U.money(eco.extras) + '</b></div>' +
          '<div class="eco eco--sub"><span>Shipping</span><b>−' + U.money(eco.shipping) + '</b></div>' +
          '<div class="eco eco--sub"><span>Waste</span><b>−' + U.money(eco.waste) + '</b></div>' +
          '<div class="eco eco--tot"><span>PROFIT</span><b>' + U.money(eco.profit) + '</b></div>' +
        '</div>' +

        '<div class="rep__cert">' +
          '<span class="rep__ok">' + (pct >= 60 ? 'CLIENT APPROVED ✓' : 'CLIENT REJECTED ✕') + '</span>' +
          (nextClient ? '<span class="rep__unlock">NEW CUSTOMER UNLOCKED — ' +
            U.esc(nextClient.name) + '</span>' : '') +
        '</div>' +

        '<div class="rep__cta">' +
          '<button class="gbtn gbtn--ghost" type="button" data-again>RETRY ORDER</button>' +
          '<button class="gbtn gbtn--gold" type="button" data-board>ORDER BOARD</button>' +
        '</div>' +
      '</div>';

    /* Produkti i përfunduar rrotullohet pranë raportit */
    PM.Product.spin(true);
    var mini = U.q('[data-repproduct]');
    if (mini && els.pv.firstChild) mini.appendChild(els.pv.firstChild);

    U.q('[data-again]', els.report).addEventListener('click', function () {
      PM.Product.spin(false); startLevel();
    });
    U.q('[data-board]', els.report).addEventListener('click', function () {
      PM.Product.spin(false); renderBoard(); show('menu');
    });

    show('report');
    if (pct >= 88) PM.sparkle(26);
    PM.sfx(pct >= 76 ? 'shine' : 'warn');
    renderWallet();
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    els.root      = U.q('[data-game]');
    els.board     = U.q('[data-board-list]');
    els.factory   = U.q('[data-factory]');
    els.order     = U.q('[data-order]');
    els.report    = U.q('[data-report]');
    els.pv        = U.q('[data-viewport]');
    els.panel     = U.q('[data-panel]');
    els.track     = U.q('[data-track]');
    els.event     = U.q('[data-event]');
    els.timeNum   = U.q('[data-time]');
    els.timeBar   = U.q('[data-timebar]');
    els.hudClient = U.q('[data-hud-client]');
    els.hudProd   = U.q('[data-hud-product]');
    els.hudSpec   = U.q('[data-hud-spec]');

    PM.restore();
    renderBoard();

    /* Butonat globalë */
    U.qa('[data-goto]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.goto === 'menu') renderBoard();
        show(b.dataset.goto);
      });
    });
    var mute = U.q('[data-mute]');
    if (mute) {
      mute.setAttribute('aria-pressed', PM.isMuted() ? 'true' : 'false');
      mute.addEventListener('click', function () {
        var m = PM.toggleMute();
        mute.setAttribute('aria-pressed', m ? 'true' : 'false');
        mute.textContent = m ? '🔇' : '🔊';
        PM.persist();
      });
      mute.textContent = PM.isMuted() ? '🔇' : '🔊';
    }
    var reset = U.q('[data-reset]');
    if (reset) reset.addEventListener('click', function () {
      if (!window.confirm('Fshij progresin dhe upgrade-t?')) return;
      PM.resetAll(); renderBoard();
      PM.toast('PROGRESS RESET', 'warn');
    });
    var abort = U.q('[data-abort]');
    if (abort) abort.addEventListener('click', function () {
      PM.stopTimer(); clearEvent(); renderBoard(); show('menu');
    });

    /* Loading → menu */
    setTimeout(function () {
      els.root.classList.add('is-ready');
      show('menu');
    }, U.reduced ? 60 : 1050);

    /* ---------- API për teste automatike ---------- */
    PM.test = {
      openOrder: openOrder,
      start: startLevel,
      state: function () {
        return {
          screen: els.root.getAttribute('data-screen'),
          stageIdx: G.stageIdx, stages: G.stages.slice(),
          stage: G.stages[G.stageIdx] || null,
          money: G.money, unlocked: G.unlocked,
          product: G.p ? JSON.parse(JSON.stringify(G.p)) : null,
          metrics: G.m ? JSON.parse(JSON.stringify(G.m)) : null
        };
      },
      solveStage: function () {
        if (!activeStage || !activeStage.autoSolve) return false;
        activeStage.autoSolve();
        return true;
      },
      /** Luaj automatikisht një nivel të plotë; cb(result) */
      autoPlay: function (idx, cb) {
        var seen = [];
        openOrder(idx);
        startLevel();
        var guard = 0;
        (function step() {
          if (++guard > 60) { cb({ error: 'guard', seen: seen }); return; }
          if (els.root.getAttribute('data-screen') === 'report') {
            cb({ ok: true, seen: seen, pct: U.q('.rep__pct b') ? U.q('.rep__pct b').textContent : null,
                 money: G.money, unlocked: G.unlocked });
            return;
          }
          var cur = G.stages[G.stageIdx];
          if (activeStage && activeStage.autoSolve) {
            seen.push(cur);
            try { activeStage.autoSolve(); } catch (e) { cb({ error: cur + ': ' + e.message, seen: seen }); return; }
          }
          setTimeout(step, 240);
        })();
      }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
