/* ============================================================
   VI-PRINT: PRINT MASTER — v.2 — Rrjedha e thjeshtuar
   Zgjidh produktin → porosi → 4–6 hapa → raport → fitimi
   ============================================================ */
(function () {
  'use strict';
  var PM = window.PM, U = PM.U, G = PM.G;

  var els = {};
  var activeStage = null;

  function show(name) {
    U.qa('.screen').forEach(function (s) {
      s.classList.toggle('is-on', s.dataset.screen === name);
    });
    els.root.setAttribute('data-screen', name);
    window.scrollTo(0, 0);
  }

  /* ============================================================
     MENU — zgjidh produktin
     ============================================================ */
  function renderMenu() {
    els.board.innerHTML = PM.PRODUCT_TYPES.map(function (t, i) {
      var best = G.best[t.id];
      return '<button class="ord" type="button" data-type="' + i + '">' +
        '<span class="ord__top">' +
          '<span class="ord__icon">' + t.icon + '</span>' +
          (best ? '<span class="ord__best">' + best + '%</span>' : '<span class="ord__new">E RE</span>') +
        '</span>' +
        '<span class="ord__client" style="--c:var(--gold)">' + U.esc(t.label) + '</span>' +
        '<span class="ord__en">' + U.esc(t.en) + '</span>' +
        '<span class="ord__prod">' + U.esc(t.product) + '</span>' +
        '<span class="ord__meta">' +
          '<i>' + t.pipeline.length + ' hapa</i>' +
          '<i>' + t.materials.length + ' materiale</i>' +
          '<i>' + t.finishes.length + ' finishime</i>' +
        '</span>' +
        '<span class="ord__val">' + U.money(t.value[0]) + ' – ' + U.money(t.value[1]) + '</span>' +
      '</button>';
    }).join('');

    U.qa('.ord[data-type]', els.board).forEach(function (b) {
      b.addEventListener('click', function () { openOrder(+b.dataset.type); });
    });
    renderWallet();
    renderFactory();
  }

  function renderWallet() {
    U.qa('[data-wallet]').forEach(function (n) { n.textContent = U.money(G.money); });
    var o = U.q('[data-orders]'); if (o) o.textContent = G.totalOrders;
  }

  function renderFactory() {
    els.factory.innerHTML = PM.UPGRADES.map(function (u) {
      var owned = PM.has(u.id);
      var afford = G.money >= u.cost;
      return '<div class="upg' + (owned ? ' is-owned' : '') + '">' +
        '<span class="upg__ico" data-u="' + u.id + '">🔧</span>' +
        '<span class="upg__l">' + U.esc(u.label) + '</span>' +
        '<span class="upg__d">' + U.esc(u.desc) + '</span>' +
        (owned
          ? '<span class="upg__done">INSTALUAR ✓</span>'
          : '<button class="upg__buy" type="button" data-buy="' + u.id + '"' +
            (afford ? '' : ' disabled') + '>' + U.money(u.cost) + '</button>') +
      '</div>';
    }).join('');

    U.qa('[data-buy]', els.factory).forEach(function (b) {
      b.addEventListener('click', function () {
        var u = PM._byId(PM.UPGRADES, b.dataset.buy);
        if (!u || G.money < u.cost || PM.has(u.id)) return;
        G.money -= u.cost;
        G.upgrades[u.id] = true;
        PM.persist();
        PM.sfx('good');
        PM.toast('UPGRADE I INSTALUAR', 'ok', u.label);
        renderFactory(); renderWallet();
        els.root.classList.add('fx-upgrade');
        setTimeout(function () { els.root.classList.remove('fx-upgrade'); }, 900);
      });
    });
  }

  /* ============================================================
     POROSIA
     ============================================================ */
  function openOrder(typeIdx) {
    var t = PM.PRODUCT_TYPES[typeIdx];
    G.order = PM.makeOrder(t.id);
    G.level = G.order;
    G.stages = G.order.pipeline.slice();

    var cl = PM.CLIENTS[G.order.client];
    var mat = PM._byId(PM.MATERIALS, G.order.material);
    var fins = G.order.finishes.map(function (id) { return PM._byId(PM.FINISH_OPTIONS, id).label; }).join(' + ');

    els.order.innerHTML =
      '<div class="ocard" style="--c:var(--gold)">' +
        '<div class="ocard__stamp">VI-PRINT</div>' +
        '<div class="ocard__hd">' +
          '<span class="ocard__kicker">POROSI E RE KLIENTI</span>' +
          '<span class="ocard__id">' + t.icon + ' ' + U.esc(t.label) + '</span>' +
        '</div>' +
        '<dl class="ocard__rows">' +
          row('KLIENTI', cl.name) +
          row('PRODUKTI', G.order.product) +
          row('MATERIALI', mat.label) +
          row('FINISHIMI', fins || 'Pa finishim') +
          row('AFATI', G.order.deadline + ' sekonda') +
        '</dl>' +
        '<div class="ocard__val"><span>VLERA E POROSISË</span><b>' + U.money(G.order.value) + '</b></div>' +
        '<p class="ocard__focus">Prioriteti: <b>' + U.esc(cl.focus) + '</b></p>' +
        '<div class="ocard__cta">' +
          '<button class="gbtn gbtn--ghost" type="button" data-back>KTHEHU</button>' +
          '<button class="gbtn gbtn--gold" type="button" data-accept>PRANO POROSINË</button>' +
        '</div>' +
        '<p class="ocard__fine">Simulim prodhimi — klientët, vlerat dhe kostot janë fiktive.</p>' +
      '</div>';

    U.q('[data-back]', els.order).addEventListener('click', function () { show('menu'); });
    U.q('[data-accept]', els.order).addEventListener('click', startOrder);
    show('order');

    function row(k, v) {
      return '<div class="orow"><dt>' + k + '</dt><dd>' + U.esc(v) + '</dd></div>';
    }
  }

  /* ============================================================
     PRODHIMI
     ============================================================ */
  function startOrder() {
    var lvl = G.level;
    G.p = PM.freshProduct(lvl);
    G.m = PM.freshMetrics();
    G.stageIdx = 0;

    var cl = PM.CLIENTS[lvl.client];
    els.hudClient.textContent = cl.name;
    els.hudProd.textContent = lvl.product;
    els.hudSpec.innerHTML = '<i>' + U.esc(lvl.style) + '</i>';

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
    PM.toast('AFATI U KALUA', 'bad');
    G.m.penalties += 15;
  }

  function renderTrack() {
    els.track.innerHTML = G.stages.map(function (id, i) {
      var meta = PM.STAGE_META[id] || { n: id };
      var cls = i < G.stageIdx ? 'is-done' : (i === G.stageIdx ? 'is-now' : '');
      return '<span class="tk ' + cls + '"><i></i><b>' + U.esc(meta.n) + '</b></span>';
    }).join('');
    var now = U.q('.tk.is-now', els.track);
    if (now) els.track.scrollTo({ left: Math.max(now.offsetLeft - els.track.clientWidth / 2, 0), behavior: 'smooth' });
  }

  function mountStage() {
    var id = G.stages[G.stageIdx];
    var stage = PM.STAGES[id];
    if (!stage) { finishOrder(); return; }

    renderTrack();
    activeStage = stage;

    var ctx = {
      level: G.level, p: G.p, m: G.m,
      done: function () { if (ctx._done) return; ctx._done = true; advance(); }
    };
    stage.build(els.panel, ctx);
    els.panel.classList.remove('is-in'); void els.panel.offsetWidth; els.panel.classList.add('is-in');
  }

  function advance() {
    G.p.stageDone.push(G.stages[G.stageIdx]);
    G.stageIdx++;
    if (G.stageIdx >= G.stages.length) { finishOrder(); return; }
    setTimeout(mountStage, 220);
  }

  /* ============================================================
     RAPORTI
     ============================================================ */
  function finishOrder() {
    PM.stopTimer();

    var lvl = G.level, m = G.m;
    var pct = PM.finalScore();
    var stars = PM.stars(pct);
    var eco = PM.economy();
    var grade = PM.grade(pct);

    G.money += Math.max(eco.profit, 0);
    G.totalOrders++;
    if (!G.best[lvl.typeId] || pct > G.best[lvl.typeId]) G.best[lvl.typeId] = pct;
    PM.persist();

    function line(label, val, suffix) {
      if (typeof val !== 'number') return '';
      return '<div class="rl"><span>' + label + '</span>' +
             '<span class="rl__bar"><i style="width:' + U.clamp(val, 0, 100) + '%"></i></span>' +
             '<b>' + Math.round(val) + (suffix || '%') + '</b></div>';
    }

    els.report.innerHTML =
      '<div class="rep">' +
        '<div class="rep__hd">' +
          '<span class="rep__kicker">RAPORTI I PRODHIMIT</span>' +
          '<h2 class="rep__grade">' + grade + '</h2>' +
          '<p class="rep__sub">' + U.esc(PM.CLIENTS[lvl.client].name) + ' — ' + U.esc(lvl.product) + '</p>' +
          '<div class="rep__stars">' + '★'.repeat(stars) + '<span>' + '★'.repeat(5 - stars) + '</span></div>' +
          '<div class="rep__pct"><b>' + pct + '%</b><i>' + grade + '</i></div>' +
        '</div>' +
        '<div class="rep__lines">' +
          line('Cilësia e shtypit', m.print) +
          line('Saktësia e ngjyrës', m.color) +
          line('Materiali', m.material) +
          line('Finishimi', m.finish) +
          line('Precizioni i prerjes', m.cut) +
          line('Palosja', m.fold) +
          '<div class="rl rl--warn"><span>Mbeturinat</span>' +
            '<span class="rl__bar rl__bar--warn"><i style="width:' + U.clamp(m.waste * 2.5, 0, 100) + '%"></i></span>' +
            '<b>' + m.waste.toFixed(0) + '%</b></div>' +
          '<div class="rl"><span>Dorëzimi</span><span class="rl__bar"><i style="width:' +
            U.clamp(100 - (m.deliverySec / lvl.deadline) * 100, 0, 100) + '%"></i></span>' +
            '<b>' + m.deliverySec + ' / ' + lvl.deadline + 's</b></div>' +
        '</div>' +
        '<div class="rep__eco">' +
          '<div class="eco"><span>Vlera e porosisë</span><b>' + U.money(eco.revenue) + '</b></div>' +
          '<div class="eco eco--sub"><span>Material + makineri</span><b>−' + U.money(eco.material + eco.machine) + '</b></div>' +
          '<div class="eco eco--sub"><span>Finishime</span><b>−' + U.money(eco.extras) + '</b></div>' +
          '<div class="eco eco--sub"><span>Mbeturina</span><b>−' + U.money(eco.waste) + '</b></div>' +
          '<div class="eco eco--tot"><span>FITIMI</span><b>' + U.money(eco.profit) + '</b></div>' +
        '</div>' +
        '<div class="rep__cert">' +
          '<span class="rep__ok">' + (pct >= 60 ? 'KLIENTI APROVOI ✓' : 'KLIENTI REFUZOI ✕') + '</span>' +
        '</div>' +
        '<div class="rep__cta">' +
          '<button class="gbtn gbtn--ghost" type="button" data-again>PROVOJE PËRSËRI</button>' +
          '<button class="gbtn gbtn--gold" type="button" data-board>MENUJA</button>' +
        '</div>' +
      '</div>';

    PM.Product.spin(true);
    var mini = U.q('[data-repproduct]');
    if (mini) {
      mini.innerHTML = '';
      if (els.pv.firstChild) mini.appendChild(els.pv.firstChild);
    }

    U.q('[data-again]', els.report).addEventListener('click', function () {
      PM.Product.spin(false); startOrder();
    });
    U.q('[data-board]', els.report).addEventListener('click', function () {
      PM.Product.spin(false); renderMenu(); show('menu');
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
    els.timeNum   = U.q('[data-time]');
    els.timeBar   = U.q('[data-timebar]');
    els.hudClient = U.q('[data-hud-client]');
    els.hudProd   = U.q('[data-hud-product]');
    els.hudSpec   = U.q('[data-hud-spec]');

    PM.restore();
    renderMenu();

    U.qa('[data-goto]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.goto === 'menu') renderMenu();
        show(b.dataset.goto);
      });
    });
    var mute = U.q('[data-mute]');
    if (mute) {
      mute.setAttribute('aria-pressed', PM.isMuted() ? 'true' : 'false');
      mute.textContent = PM.isMuted() ? '🔇' : '🔊';
      mute.addEventListener('click', function () {
        var m = PM.toggleMute();
        mute.setAttribute('aria-pressed', m ? 'true' : 'false');
        mute.textContent = m ? '🔇' : '🔊';
        PM.persist();
      });
    }
    var reset = U.q('[data-reset]');
    if (reset) reset.addEventListener('click', function () {
      if (!window.confirm('Fshij progresin?')) return;
      PM.resetAll(); renderMenu();
      PM.toast('PROGRESI U FSHI', 'warn');
    });
    var abort = U.q('[data-abort]');
    if (abort) abort.addEventListener('click', function () {
      PM.stopTimer(); renderMenu(); show('menu');
    });

    setTimeout(function () {
      els.root.classList.add('is-ready');
      show('menu');
    }, U.reduced ? 60 : 1050);

    /* ---------- API për teste ---------- */
    PM.test = {
      openOrder: openOrder,
      start: startOrder,
      state: function () {
        return {
          screen: els.root.getAttribute('data-screen'),
          stageIdx: G.stageIdx, stages: G.stages.slice(),
          stage: G.stages[G.stageIdx] || null,
          money: G.money, product: G.p ? JSON.parse(JSON.stringify(G.p)) : null,
          metrics: G.m ? JSON.parse(JSON.stringify(G.m)) : null
        };
      },
      solveStage: function () {
        if (!activeStage || !activeStage.autoSolve) return false;
        activeStage.autoSolve(); return true;
      },
      autoPlay: function (typeIdx, cb) {
        var seen = [];
        openOrder(typeIdx); startOrder();
        var guard = 0, lastStage = null;
        (function step() {
          if (++guard > 240) { cb({ error: 'guard', seen: seen }); return; }
          if (els.root.getAttribute('data-screen') === 'report') {
            cb({ ok: true, seen: seen, pct: U.q('.rep__pct b') ? U.q('.rep__pct b').textContent : null,
                 money: G.money });
            return;
          }
          var cur = G.stages[G.stageIdx];
          if (activeStage && activeStage.autoSolve && activeStage !== lastStage) {
            lastStage = activeStage;
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
