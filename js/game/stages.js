/* ============================================================
   VI-PRINT: PRINT MASTER — v.2 — 6 faza të thjeshta
   material → print → finish → diecut → [fold] → delivery
   ============================================================ */
(function () {
  'use strict';
  var PM = window.PM, U = PM.U;
  var S = PM.STAGES = {};

  /* ---------------- KOMPONENTË ---------------- */
  function head(panel, id, extra) {
    var meta = PM.STAGE_META[id] || { n: id, al: '' };
    panel.innerHTML =
      '<div class="pan__head">' +
        '<span class="pan__step">STEP ' + (PM.G.stageIdx + 1) + ' / ' + PM.G.stages.length + '</span>' +
        '<h2 class="pan__title">' + U.esc(meta.n.toUpperCase()) + '</h2>' +
        '<p class="pan__hint">' + U.esc(meta.al) + '</p>' +
      '</div>' +
      '<div class="pan__body" data-body>' + (extra || '') + '</div>';
    return U.q('[data-body]', panel);
  }

  function cta(body, label, onClick, cls) {
    var b = U.el('button', 'gbtn ' + (cls || 'gbtn--gold'), label);
    b.type = 'button';
    b.addEventListener('click', function () { PM.sfx('click'); onClick(b); });
    body.appendChild(b);
    return b;
  }

  function choices(body, items, opts) {
    opts = opts || {};
    var wrap = U.el('div', 'chgrid' + (opts.wide ? ' chgrid--wide' : ''));
    wrap.innerHTML = items.map(function (it) {
      return '<button class="ch" type="button" data-id="' + U.esc(it.id) + '">' +
               (it.swatch ? '<span class="ch__sw" style="' + it.swatch + '"></span>' : '') +
               '<span class="ch__l">' + U.esc(it.label) + '</span>' +
               (it.spec ? '<span class="ch__s">' + U.esc(it.spec) + '</span>' : '') +
             '</button>';
    }).join('');
    body.appendChild(wrap);

    var sel = [];
    U.qa('.ch', wrap).forEach(function (b) {
      b.addEventListener('click', function () {
        PM.sfx('click');
        if (opts.multi) {
          var i = sel.indexOf(b.dataset.id);
          if (i >= 0) { sel.splice(i, 1); b.classList.remove('is-on'); }
          else { sel.push(b.dataset.id); b.classList.add('is-on'); }
          if (opts.onChange) opts.onChange(sel);
        } else {
          U.qa('.ch', wrap).forEach(function (x) { x.classList.remove('is-on'); });
          b.classList.add('is-on');
          sel = [b.dataset.id];
          if (opts.onPick) opts.onPick(b.dataset.id, b);
        }
      });
    });
    return { wrap: wrap, get: function () { return sel; }, pick: function (id) { var b = U.q('.ch[data-id="' + id + '"]', wrap); if (b) b.click(); } };
  }

  function slider(body, cfg) {
    var target = cfg.target != null ? cfg.target : Math.round(U.rnd(35, 68));
    var half = (cfg.half || 9) * (cfg.bonusKind ? PM.zoneBonus(cfg.bonusKind) : 1);
    var lo = U.clamp(target - half, 0, 100), hi = U.clamp(target + half, 0, 100);

    var wrap = U.el('div', 'ctl');
    wrap.innerHTML =
      '<div class="ctl__top"><span class="ctl__label">' + U.esc(cfg.label) + '</span>' +
      '<span class="ctl__val" data-v>0</span></div>' +
      '<div class="ctl__track">' +
        '<span class="ctl__band" style="left:' + lo + '%;width:' + (hi - lo) + '%"></span>' +
        '<input class="ctl__rng" type="range" min="0" max="100" value="' + (cfg.start != null ? cfg.start : 0) + '" aria-label="' + U.esc(cfg.label) + '">' +
      '</div>';
    body.appendChild(wrap);

    var rng = U.q('.ctl__rng', wrap), val = U.q('[data-v]', wrap);
    function refresh() {
      var v = +rng.value;
      val.textContent = v + (cfg.unit || '%');
      var inside = v >= lo && v <= hi;
      wrap.classList.toggle('is-good', inside);
      if (cfg.onInput) cfg.onInput(v, inside);
    }
    rng.addEventListener('input', refresh);
    refresh();

    return {
      el: wrap, get: function () { return +rng.value; }, set: function (v) { rng.value = v; refresh(); },
      solve: function () { rng.value = target; refresh(); },
      accuracy: function () {
        var d = Math.abs(+rng.value - target);
        if (d <= half) return 1 - (d / half) * 0.12;
        return U.clamp(1 - (d - half) / 42, 0, 0.86);
      }
    };
  }

  function sweep(body, cfg) {
    var zoneW = (cfg.zone || 16) * (cfg.bonusKind ? PM.zoneBonus(cfg.bonusKind) : 1);
    var center = cfg.center != null ? cfg.center : U.rnd(30, 70);
    var lo = U.clamp(center - zoneW / 2, 0, 100), hi = U.clamp(center + zoneW / 2, 0, 100);

    var wrap = U.el('div', 'sweep');
    wrap.innerHTML =
      '<div class="sweep__label">' + U.esc(cfg.label || 'ALIGNMENT') + '</div>' +
      '<div class="sweep__track">' +
        '<span class="sweep__zone" style="left:' + lo + '%;width:' + (hi - lo) + '%"></span>' +
        '<span class="sweep__mark" data-mark></span>' +
      '</div>';
    body.appendChild(wrap);

    var mark = U.q('[data-mark]', wrap);
    var pos = 0, dir = 1, raf = null, speed = cfg.speed || 62, stopped = false, last = 0;

    function frame(t) {
      if (stopped) return;
      if (!last) last = t;
      var dt = Math.min((t - last) / 1000, 0.05); last = t;
      pos += dir * speed * dt;
      if (pos >= 100) { pos = 100; dir = -1; }
      if (pos <= 0) { pos = 0; dir = 1; }
      mark.style.left = pos + '%';
      raf = requestAnimationFrame(frame);
    }

    return {
      el: wrap,
      start: function () { stopped = false; last = 0; raf = requestAnimationFrame(frame); },
      stop: function () {
        stopped = true; if (raf) cancelAnimationFrame(raf);
        var inside = pos >= lo && pos <= hi;
        wrap.classList.add(inside ? 'is-hit' : 'is-miss');
        var d = Math.abs(pos - center);
        var acc = inside ? 1 - (d / (zoneW / 2)) * 0.10 : U.clamp(1 - (d - zoneW / 2) / 40, 0, 0.8);
        return { inside: inside, acc: acc, pos: pos };
      },
      solve: function () { pos = center; mark.style.left = pos + '%'; },
      destroy: function () { stopped = true; if (raf) cancelAnimationFrame(raf); }
    };
  }

  function verdict(ok, goodTxt, badTxt, sub) {
    PM.toast(ok ? goodTxt : badTxt, ok ? 'ok' : 'bad', sub);
    PM.flash(ok ? goodTxt : badTxt);
  }

  /* ============================================================
     1 — MATERIAL
     ============================================================ */
  S.material = {
    build: function (panel, ctx) {
      var body = head(panel, 'material');
      var want = PM._byId(PM.MATERIALS, ctx.level.material);
      body.appendChild(U.el('p', 'pan__note',
        'Porosia kërkon: <b>' + U.esc(want.label) + '</b> — ' + U.esc(want.spec)));

      var items = PM.MATERIALS.map(function (m) {
        return { id: m.id, label: m.label, spec: m.spec,
                 swatch: 'background:' + m.base + ';box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)' };
      });
      var c = choices(body, items, {
        wide: true,
        onPick: function (id) {
          var m = PM._byId(PM.MATERIALS, id);
          ctx.p.material = id; ctx.p.matBase = m.base; ctx.p.matTex = m.tex; ctx.p.inkColor = m.ink;
          PM.Product.update();
          PM.flash(m.label.toUpperCase());
          var ok = id === ctx.level.material;
          if (ok) { ctx.m.material = 100; verdict(true, 'MATERIALI I SAKTË'); }
          else { ctx.m.material = 50; PM.addWaste(4); verdict(false, null, 'MATERIAL I GABUAR'); }
          setTimeout(function () { ctx.done(); }, 620);
        }
      });
      this._c = c; this._want = ctx.level.material;
    },
    autoSolve: function () { this._c.pick(this._want); }
  };

  /* ============================================================
     2 — SHTYPI (makina: bojë + presion + regjistrim)
     ============================================================ */
  S.print = {
    build: function (panel, ctx) {
      var body = head(panel, 'print');
      body.appendChild(U.el('div', 'machine machine--press',
        '<span class="machine__tag">VI-PRINT · OFFSET B1</span>' +
        '<span class="machine__rollers"><i></i><i></i><i></i></span>'));

      var ink = slider(body, { label: 'NIVELI I BOJËS', half: 9, bonusKind: 'print' });
      var prs = slider(body, { label: 'PRESIONI', half: 10, bonusKind: 'print' });
      var sw = sweep(body, { label: 'REGJISTRIMI', zone: 15, bonusKind: 'print', speed: 66 });

      var self = this, started = false;
      var btn = cta(body, 'NDIZE MAKINËN', function (b) {
        if (!started) { started = true; sw.start(); b.textContent = 'NDALO'; PM.sfx('roll'); return; }
        var r = sw.stop(); b.disabled = true;
        self.finish(ctx, ink.accuracy(), prs.accuracy(), r);
      });
      this._ink = ink; this._prs = prs; this._sw = sw; this._ctx = ctx;
    },
    finish: function (ctx, inkAcc, prAcc, r) {
      var q = Math.round((inkAcc * 0.36 + prAcc * 0.28 + r.acc * 0.36) * 100);
      ctx.m.print = q; ctx.m.color = Math.round(inkAcc * 100);
      ctx.p.printed = true;
      PM.Product.update();
      PM.Product.runPress(function () {
        if (q >= 95) verdict(true, 'SHTYPI 100%');
        else if (q >= 78) verdict(true, 'SHTYPI ' + q + '%');
        else { verdict(false, null, 'GABIM DENDËSIE'); PM.addWaste(6); }
        ctx.done();
      });
    },
    autoSolve: function () {
      this._ink.solve(); this._prs.solve(); this._sw.solve(); this._sw.destroy();
      this.finish(this._ctx, 1, 1, { inside: true, acc: 1 });
    }
  };

  /* ============================================================
     3 — FINISHIMI (folie / embosim / llak / plastifikim)
     ============================================================ */
  S.finish = {
    build: function (panel, ctx) {
      var body = head(panel, 'finish');
      var want = ctx.level.finishes;
      body.appendChild(U.el('p', 'pan__note',
        'Porosia kërkon <b>' + want.length + '</b> finishim' + (want.length > 1 ? 'e' : '') +
        ': <b>' + U.esc(want.map(function (id) { return PM._byId(PM.FINISH_OPTIONS, id).label; }).join(' + ')) + '</b>'));

      var type = PM._byId(PM.PRODUCT_TYPES, ctx.level.typeId);
      var pool = PM.FINISH_OPTIONS.filter(function (f) { return type.finishes.indexOf(f.id) < 0; });
      var distract = U.shuffle(pool).slice(0, 2);
      var items = U.shuffle(want.map(function (id) { return PM._byId(PM.FINISH_OPTIONS, id); }).concat(distract))
        .map(function (f) { return { id: f.id, label: f.label, spec: f.kind.toUpperCase() }; });

      var self = this;
      var c = choices(body, items, { multi: true, wide: true, onChange: function (sel) { self.apply(ctx, sel); } });
      cta(body, 'KONFIRMO FINISHIMET', function (b) { b.disabled = true; self.finish(ctx, c.get()); });
      this._c = c; this._want = want; this._ctx = ctx;
    },
    apply: function (ctx, sel) {
      var p = ctx.p;
      p.finish = null; p.foil = null; p.relief = null; p.varnish = []; p.effects = [];
      sel.forEach(function (id) {
        var f = PM._byId(PM.FINISH_OPTIONS, id);
        if (!f) return;
        if (f.kind === 'lam') p.finish = id;
        else {
          p.effects.push(id);
          if (f.kind === 'foil') p.foil = { tone: id === 'foil-gold' ? 'gold' : 'silver', quality: 100 };
          if (f.kind === 'relief') p.relief = { dir: 'up', quality: 100 };
          if (f.kind === 'varnish') p.varnish = ['logo'];
        }
      });
      PM.Product.update();
    },
    finish: function (ctx, sel) {
      var want = ctx.level.finishes;
      var hit = sel.filter(function (id) { return want.indexOf(id) >= 0; }).length;
      var extra = sel.length - hit, missing = want.length - hit;
      var score = Math.round(U.clamp((hit - extra * 0.6 - missing * 0.9) / Math.max(want.length, 1) * 100, 0, 100));
      ctx.m.finish = score;
      this.apply(ctx, sel);

      var done = function () {
        if (score >= 100) verdict(true, 'FINISHIMI I SAKTË');
        else { verdict(false, null, 'FINISHIM I GABUAR'); PM.addWaste(5); ctx.m.satisfaction -= 6; }
        ctx.done();
      };
      if (ctx.p.foil) PM.Product.runFoil(ctx.p.foil.tone, done);
      else if (ctx.p.relief) PM.Product.runEmboss('up', done);
      else if (ctx.p.varnish.length) PM.Product.runVarnish(done);
      else done();
    },
    autoSolve: function () {
      var self = this;
      this._want.forEach(function (id) { self._c.pick(id); });
      this.finish(this._ctx, this._want.slice());
    }
  };

  /* ============================================================
     4 — PRERJA (shtancim)
     ============================================================ */
  S.diecut = {
    build: function (panel, ctx) {
      var body = head(panel, 'diecut');
      body.appendChild(U.el('div', 'machine machine--cut',
        '<span class="machine__tag">SHTANCIM · DIE CUT</span>' +
        '<span class="machine__knife"></span>'));
      var sw = sweep(body, { label: 'RRESHTIMI I PRERJES', zone: 13, bonusKind: 'cut', speed: 78 });
      var self = this, started = false;
      cta(body, 'NDIZE PRERËSIN', function (b) {
        if (!started) { started = true; sw.start(); b.textContent = 'PREJE'; return; }
        var r = sw.stop(); b.disabled = true;
        self.finish(ctx, r);
      });
      this._sw = sw; this._ctx = ctx;
    },
    finish: function (ctx, r) {
      var q = Math.round(r.acc * 100);
      ctx.m.cut = q; ctx.p.cut = true;
      PM.Product.runCut(function () {
        PM.Product.update();
        if (q >= 95) verdict(true, 'PRERJE E SAKTË ' + q + '%');
        else if (q >= 76) verdict(true, 'PRERJE ' + q + '%');
        else { verdict(false, null, 'GABIM PRERJE'); PM.addWaste(8); }
        ctx.done();
      });
    },
    autoSolve: function () { this._sw.solve(); this._sw.destroy(); this.finish(this._ctx, { inside: true, acc: 1 }); }
  };

  /* ============================================================
     5 — PALOSJA (kuti / fletushkë / qese)
     ============================================================ */
  S.fold = {
    /* sa palosje ka nevojë produkti */
    count: function (type) {
      if (type === 'box') return 4;   // 4 kapakët e kutisë
      if (type === 'bag') return 3;   // fundi + anët e qeses
      return 2;                        // fletushka bi-fold
    },
    build: function (panel, ctx) {
      var body = head(panel, 'fold');
      var total = this.count(ctx.level.type);
      var step = 0;
      body.appendChild(U.el('p', 'pan__note',
        'Palosje hap pas hapi — shtyp <b>PALOS DHE KYÇ</b> për çdo palosje (' + total + ' gjithsej).'));
      var counter = U.el('div', 'foldcount', '<b>0</b><span> / ' + total + '</span>');
      var bar = U.el('div', 'foldbar', '<i></i>');
      var btn = U.el('button', 'gbtn gbtn--gold foldbtn', 'PALOS DHE KYÇ 1');
      body.appendChild(counter);
      body.appendChild(bar);
      body.appendChild(btn);

      var self = this;
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        step++;
        PM.Product.foldStep(step);              // palos hapin e radhës dhe e kyç
        PM.sfx('click');
        counter.querySelector('b').textContent = step;
        bar.querySelector('i').style.width = Math.round(step / total * 100) + '%';
        if (step >= total) {
          btn.disabled = true;
          btn.textContent = '✓ U PALOS';
          self.finish(ctx);
        } else {
          btn.textContent = 'PALOS DHE KYÇ ' + (step + 1);
        }
      });
      this._btn = btn; this._ctx = ctx;
    },
    finish: function (ctx) {
      ctx.m.fold = 100;
      var v = ctx.level.type;
      var done = function () { verdict(true, 'PALOSJE E SAKTË'); ctx.done(); };
      if (v === 'box') PM.Product.assembleBox(done);
      else if (v === 'bag') PM.Product.assembleBag(done);
      else PM.Product.assembleFlyer(done);
    },
    autoSolve: function () {
      var total = this.count(this._ctx.level.type);
      for (var i = 0; i < total; i++) this._btn.click();
    }
  };

  /* ============================================================
     6 — DORËZIMI
     ============================================================ */
  S.delivery = {
    build: function (panel, ctx) {
      var body = head(panel, 'delivery');
      body.appendChild(U.el('p', 'pan__note',
        'Produkti: <b>' + U.esc(ctx.level.product) + '</b> · Afati <b>' + ctx.level.deadline + 's</b>'));
      body.appendChild(U.el('div', 'truck', '<span class="truck__body"></span><span class="truck__road"></span>'));
      var self = this;
      cta(body, 'DORËZO POROSINË', function (b) { b.disabled = true; self.finish(ctx); });
      this._ctx = ctx;
    },
    finish: function (ctx) {
      var used = ctx.level.deadline - PM.G.timeLeft;
      ctx.m.deliverySec = Math.max(Math.round(used), 0);
      var ratio = PM.G.timeLeft / ctx.level.deadline;
      if (ratio > 0.25) { ctx.m.bonus += 10; ctx.m.satisfaction += 8; verdict(true, 'DORËZIM I HERSHËM +10'); }
      else if (PM.G.timeLeft > 0) { ctx.m.bonus += 5; ctx.m.satisfaction += 3; verdict(true, 'NË KOHË +5'); }
      else { ctx.m.penalties += 15; verdict(false, null, 'AFATI U KALUA'); }
      var body = document.querySelector('.truck');
      function go() { if (body) body.classList.add('is-go'); setTimeout(function () { ctx.done(); }, 900); }
      if (ctx.level.type === 'flyer') PM.Product.runBundle(go);
      else go();
    },
    autoSolve: function () { this.finish(this._ctx); }
  };
})();
