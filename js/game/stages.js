/* ============================================================
   VI-PRINT: PRINT MASTER — Fazat e prodhimit
   Secila fazë: build(panel, ctx) → ctx.done({score, ...})
   autoSolve() përdoret vetëm nga testet automatike.
   ============================================================ */
(function () {
  'use strict';
  var PM = window.PM, U = PM.U;
  var S = PM.STAGES = {};

  /* ============================================================
     KOMPONENTË TË PËRBASHKËT
     ============================================================ */

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

  /** Rrjet zgjedhjesh (një ose shumë) */
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
    return { wrap: wrap, get: function () { return sel; },
             pick: function (id) { var b = U.q('.ch[data-id="' + id + '"]', wrap); if (b) b.click(); } };
  }

  /** Slider me zonë të gjelbër */
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
        '<input class="ctl__rng" type="range" min="0" max="100" value="' + (cfg.start != null ? cfg.start : 0) + '" ' +
          'aria-label="' + U.esc(cfg.label) + '">' +
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
      el: wrap,
      get: function () { return +rng.value; },
      set: function (v) { rng.value = v; refresh(); },
      solve: function () { rng.value = target; refresh(); },
      accuracy: function () {
        var d = Math.abs(+rng.value - target);
        if (d <= half) return 1 - (d / half) * 0.12;
        return U.clamp(1 - (d - half) / 42, 0, 0.86);
      }
    };
  }

  /** Shirit kohor: shënjuesi lëviz, lojtari ndalon në zonën e gjelbër */
  function sweep(body, cfg) {
    var zoneW = (cfg.zone || 16) * (cfg.bonusKind ? PM.zoneBonus(cfg.bonusKind) : 1);
    var center = cfg.center != null ? cfg.center : U.rnd(30, 70);
    var lo = U.clamp(center - zoneW / 2, 0, 100), hi = U.clamp(center + zoneW / 2, 0, 100);

    var wrap = U.el('div', 'sweep' + (cfg.vertical ? ' sweep--v' : ''));
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
      if (pos <= 0)   { pos = 0; dir = 1; }
      mark.style.left = pos + '%';
      raf = requestAnimationFrame(frame);
    }

    return {
      el: wrap,
      start: function () { stopped = false; last = 0; raf = requestAnimationFrame(frame); },
      stop: function () {
        stopped = true;
        if (raf) cancelAnimationFrame(raf);
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
     STEP 1 — FORMAT
     ============================================================ */
  S.format = {
    build: function (panel, ctx) {
      var body = head(panel, 'format');
      var list = PM.FORMATS[ctx.level.type] || PM.FORMATS.box;
      var want = U.byId(list, ctx.level.format);
      body.appendChild(U.el('p', 'pan__note',
        'Klienti kërkon: <b>' + U.esc(want ? want.label : '?') + '</b> — ' + U.esc(want ? want.spec : '')));

      var c = choices(body, list, {
        onPick: function (id) {
          var ok = id === ctx.level.format;
          ctx.p.format = id;
          PM.Product.update();
          if (ok) { ctx.m.format = 100; ctx.m.bonus += 2; verdict(true, 'FORMAT APPROVED +5%'); }
          else    { ctx.m.format = 45; PM.addWaste(5); verdict(false, null, 'FORMAT ERROR -5%'); }
          setTimeout(function () { ctx.done(); }, 620);
        }
      });
      this._c = c; this._want = ctx.level.format;
    },
    autoSolve: function () { this._c.pick(this._want); }
  };

  /* ============================================================
     STEP 2 — MATERIAL
     ============================================================ */
  S.material = {
    build: function (panel, ctx) {
      var body = head(panel, 'material');
      var want = U.byId(PM.MATERIALS, ctx.level.material);
      body.appendChild(U.el('p', 'pan__note',
        'Stili i porosisë: <b>' + U.esc(ctx.level.style) + '</b>. Zgjidh bazën e duhur.'));

      var items = PM.MATERIALS.map(function (m) {
        return { id: m.id, label: m.label, spec: m.spec,
                 swatch: 'background:' + m.base + ';box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)' };
      });

      var c = choices(body, items, {
        wide: true,
        onPick: function (id) {
          var m = U.byId(PM.MATERIALS, id);
          ctx.p.material = id;
          ctx.p.matBase = m.base;
          ctx.p.matTex = m.tex;
          PM.Product.update();
          PM.flash(m.label.toUpperCase());
          var ok = id === ctx.level.material;
          if (ok) { ctx.m.material = 100; verdict(true, 'MATERIAL APPROVED'); }
          else    { ctx.m.material = 50; PM.addWaste(4); verdict(false, null, 'WRONG MATERIAL'); }
          setTimeout(function () { ctx.done(); }, 700);
        }
      });
      this._c = c; this._want = ctx.level.material;
    },
    autoSolve: function () { this._c.pick(this._want); }
  };

  /* ============================================================
     STEP 3 — ARTWORK (drag & drop)
     ============================================================ */
  S.artwork = {
    build: function (panel, ctx) {
      var body = head(panel, 'artwork');
      body.appendChild(U.el('p', 'pan__note',
        'Tërhiq <b>LOGO</b>, <b>NAME</b> dhe <b>BARCODE</b> mbi konturat e tyre në produkt.'));

      var ids = ['logo', 'name', 'barcode'];
      ctx.p.artPos = {};
      ids.forEach(function (id) {
        var s = PM.SLOTS[id];
        ctx.p.artPos[id] = { x: U.clamp(s.x + U.rnd(-15, 15), 8, 90),
                             y: U.clamp(s.y + U.rnd(-13, 13), 8, 90) };
      });
      ctx.p.artwork = [];
      PM.Product.update();

      /* konturat fantazmë mbi faqe */
      var faceEl = PM.Product.getFace();
      var ghosts = U.el('div', 'ghosts');
      ghosts.innerHTML = ids.map(function (id) {
        var s = PM.SLOTS[id];
        return '<span class="ghost" data-g="' + id + '" style="left:' + s.x + '%;top:' + s.y +
               '%;width:' + s.w + '%;height:' + s.h + '%"><i>' + s.label + '</i></span>';
      }).join('');
      faceEl.appendChild(ghosts);
      this._ghosts = ghosts;

      var self = this;
      PM.Product.enableDrag(false);

      function bind(id) {
        var it = U.q('.art__it--' + id, faceEl);
        if (!it) return;
        it.classList.add('is-draggable');
        var drag = null;

        function down(e) {
          var t = e.touches ? e.touches[0] : e;
          var r = faceEl.getBoundingClientRect();
          drag = { r: r };
          it.classList.add('is-drag');
          if (e.cancelable) e.preventDefault();
          move(e);
        }
        function move(e) {
          if (!drag) return;
          var t = e.touches ? e.touches[0] : e;
          var x = U.clamp(((t.clientX - drag.r.left) / drag.r.width) * 100, 4, 96);
          var y = U.clamp(((t.clientY - drag.r.top) / drag.r.height) * 100, 4, 96);
          ctx.p.artPos[id] = { x: x, y: y };
          it.style.left = x + '%'; it.style.top = y + '%';
          var s = PM.SLOTS[id];
          var near = Math.abs(x - s.x) < 7 && Math.abs(y - s.y) < 7;
          U.q('.ghost[data-g="' + id + '"]', ghosts).classList.toggle('is-near', near);
          if (e.cancelable) e.preventDefault();
        }
        function up() {
          if (!drag) return;
          drag = null;
          it.classList.remove('is-drag');
          var s = PM.SLOTS[id], p = ctx.p.artPos[id];
          if (Math.abs(p.x - s.x) < 7 && Math.abs(p.y - s.y) < 7) {
            ctx.p.artPos[id] = { x: s.x, y: s.y };
            it.style.left = s.x + '%'; it.style.top = s.y + '%';
            it.classList.add('is-placed');
            U.q('.ghost[data-g="' + id + '"]', ghosts).classList.add('is-done');
            if (ctx.p.artwork.indexOf(id) < 0) ctx.p.artwork.push(id);
            PM.sfx('click');
            self.check(ctx);
          }
        }
        it.addEventListener('mousedown', down);
        it.addEventListener('touchstart', down, { passive: false });
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('mouseup', up);
        window.addEventListener('touchend', up);
      }
      ids.forEach(bind);

      this._btn = cta(body, 'APPROVE ARTWORK', function () { self.finish(ctx); }, 'gbtn--ghost');
      this._ids = ids;
      this._ctx = ctx;
    },

    check: function (ctx) {
      if (ctx.p.artwork.length === 3) {
        this._btn.className = 'gbtn gbtn--gold';
        this._btn.textContent = 'PRECISION READY — APPROVE';
      }
    },

    finish: function (ctx) {
      var err = 0;
      this._ids.forEach(function (id) {
        var s = PM.SLOTS[id], p = ctx.p.artPos[id] || { x: 0, y: 0 };
        err += Math.min(Math.hypot(p.x - s.x, p.y - s.y) / 22, 1);
      });
      err /= this._ids.length;
      var score = PM.scoreFromError(err);
      ctx.m.artwork = score;
      ctx.p.artworkScore = score;
      if (this._ghosts && this._ghosts.parentNode) this._ghosts.parentNode.removeChild(this._ghosts);
      U.qa('.art__it.is-draggable', PM.Product.getFace()).forEach(function (n) {
        n.classList.remove('is-draggable');
      });
      PM.Product.enableDrag(true);
      if (score >= 92) verdict(true, 'PRECISION +10', null, 'Rreshtim i saktë');
      else if (score >= 70) verdict(true, 'ARTWORK OK');
      else { verdict(false, null, 'MISALIGNED ARTWORK'); PM.addWaste(4); }
      ctx.done();
    },

    autoSolve: function () {
      var ctx = this._ctx;
      this._ids.forEach(function (id) {
        var s = PM.SLOTS[id];
        ctx.p.artPos[id] = { x: s.x, y: s.y };
        if (ctx.p.artwork.indexOf(id) < 0) ctx.p.artwork.push(id);
      });
      PM.Product.update();
      this.finish(ctx);
    }
  };

  /* ============================================================
     STEP 4 — PRINTING
     ============================================================ */
  S.print = {
    build: function (panel, ctx) {
      var body = head(panel, 'print');
      body.appendChild(U.el('div', 'machine machine--press',
        '<span class="machine__tag">VI-PRINT · OFFSET B1 100×70</span>' +
        '<span class="machine__rollers"><i></i><i></i><i></i></span>'));

      var ink   = slider(body, { label: 'INK LEVEL', half: 9, bonusKind: 'print' });
      var press = slider(body, { label: 'PRESSURE',  half: 10, bonusKind: 'print' });
      var sw    = sweep(body, { label: 'REGISTRATION', zone: 15, bonusKind: 'print', speed: 66 });

      var self = this, started = false;
      var btn = cta(body, 'START PRESS', function (b) {
        if (!started) {
          started = true; sw.start(); b.textContent = 'STOP';
          PM.sfx('roll');
          return;
        }
        var r = sw.stop();
        b.disabled = true;
        self.finish(ctx, ink.accuracy(), press.accuracy(), r);
      });

      this._ink = ink; this._press = press; this._sw = sw; this._btn = btn; this._ctx = ctx;
    },

    finish: function (ctx, inkAcc, prAcc, r) {
      var q = Math.round((inkAcc * 0.36 + prAcc * 0.28 + r.acc * 0.36) * 100);
      ctx.m.print = q;
      ctx.m.color = Math.round(inkAcc * 100);
      ctx.p.printed = true;
      if (ctx.level.effects.indexOf('fluo') >= 0) ctx.p.fluo = true;
      PM.Product.update();
      PM.Product.runPress(function () {
        if (q >= 95) verdict(true, 'PRINT QUALITY 100%', null, 'Regjistrim perfekt');
        else if (q >= 78) verdict(true, 'PRINT QUALITY ' + q + '%');
        else { verdict(false, null, 'INK DENSITY ERROR'); PM.addWaste(6); }
        ctx.done();
      });
    },

    autoSolve: function () {
      this._ink.solve(); this._press.solve(); this._sw.solve();
      this._sw.destroy();
      this.finish(this._ctx, 1, 1, { inside: true, acc: 1 });
    }
  };

  /* ============================================================
     STEP 5 — SPECIAL EFFECT (zgjedhje sipas specifikimit)
     ============================================================ */
  S.effect = {
    build: function (panel, ctx) {
      var body = head(panel, 'effect');
      var want = ctx.level.effects.slice();
      body.appendChild(U.el('p', 'pan__note',
        'Kujto specifikimin e klientit. Zgjidh <b>saktësisht</b> ' + want.length +
        ' efekt' + (want.length > 1 ? 'e' : '') + '.'));

      /* opsionet: të kërkuarat + distraktorë */
      var pool = PM.EFFECTS.filter(function (e) { return want.indexOf(e.id) < 0; });
      var distract = U.shuffle(pool).slice(0, Math.max(4, 7 - want.length));
      var items = U.shuffle(want.map(function (id) { return U.byId(PM.EFFECTS, id); }).concat(distract))
        .map(function (e) { return { id: e.id, label: e.label, spec: e.kind.toUpperCase() }; });

      var self = this;
      var c = choices(body, items, { multi: true, wide: true });
      cta(body, 'CONFIRM EFFECTS', function (b) {
        b.disabled = true;
        self.finish(ctx, c.get());
      });
      this._c = c; this._want = want; this._ctx = ctx;
    },

    finish: function (ctx, sel) {
      var want = ctx.level.effects;
      var hit = sel.filter(function (id) { return want.indexOf(id) >= 0; }).length;
      var extra = sel.length - hit;
      var missing = want.length - hit;
      var score = Math.round(U.clamp((hit - extra * 0.6 - missing * 0.9) / Math.max(want.length, 1) * 100, 0, 100));
      ctx.m.effect = score;
      ctx.p.effects = sel.slice();
      if (sel.indexOf('texture') >= 0) ctx.p.texture = true;
      if (sel.indexOf('fluo') >= 0) ctx.p.fluo = true;
      PM.Product.update();
      if (score >= 100) verdict(true, 'SPECIAL EFFECT APPROVED', null,
        want.map(function (id) { return U.byId(PM.EFFECTS, id).label; }).join(' + '));
      else { verdict(false, null, 'CUSTOMER REQUIREMENT FAILED'); PM.addWaste(6); ctx.m.satisfaction -= 8; }
      setTimeout(function () { ctx.done(); }, 700);
    },

    autoSolve: function () { this.finish(this._ctx, this._want.slice()); }
  };

  /* ============================================================
     STEP 6 — HOT FOIL
     ============================================================ */
  S.foil = {
    build: function (panel, ctx) {
      var body = head(panel, 'foil');
      var foilId = (ctx.level.effects || []).filter(function (id) {
        var e = U.byId(PM.EFFECTS, id); return e && e.kind === 'foil';
      })[0] || 'foil-gold';
      var foilDef = U.byId(PM.EFFECTS, foilId);
      this._tone = foilDef.tone;

      body.appendChild(U.el('div', 'machine machine--foil',
        '<span class="machine__tag">HOT FOIL · ' + U.esc(foilDef.label.toUpperCase()) + '</span>' +
        '<span class="machine__plate"></span>'));

      var temp = slider(body, { label: 'TEMPERATURE', unit: '°', half: 8, bonusKind: 'foil' });
      var prs  = slider(body, { label: 'PRESSURE', half: 10, bonusKind: 'foil' });
      var sw   = sweep(body, { label: 'FOIL POSITION', zone: 14, bonusKind: 'foil', speed: 70 });

      var self = this, started = false;
      var btn = cta(body, 'START PRESS', function (b) {
        if (!started) { started = true; sw.start(); b.textContent = 'PRESS'; return; }
        var r = sw.stop(); b.disabled = true;
        self.finish(ctx, temp.accuracy(), prs.accuracy(), r);
      });
      this._t = temp; this._p = prs; this._sw = sw; this._ctx = ctx;
    },

    finish: function (ctx, tAcc, pAcc, r) {
      var q = Math.round((tAcc * 0.34 + pAcc * 0.26 + r.acc * 0.40) * 100);
      ctx.m.foil = q;
      ctx.p.foil = { tone: this._tone, quality: q };
      var tone = this._tone;
      PM.Product.runFoil(tone, function () {
        PM.Product.update();
        if (q >= 94) verdict(true, 'FOIL QUALITY ' + q + '%', null, 'Shkëlqim i plotë metalik');
        else if (q >= 76) verdict(true, 'FOIL APPLIED ' + q + '%');
        else { verdict(false, null, 'FOIL MISALIGNMENT'); PM.addWaste(7); }
        ctx.done();
      });
    },

    autoSolve: function () {
      this._t.solve(); this._p.solve(); this._sw.solve(); this._sw.destroy();
      this.finish(this._ctx, 1, 1, { inside: true, acc: 1 });
    }
  };

  /* ============================================================
     STEP 7 — EMBOSS / DEBOSS
     ============================================================ */
  S.emboss = {
    build: function (panel, ctx) {
      var body = head(panel, 'emboss');
      var isDeboss = (ctx.level.effects || []).indexOf('deboss') >= 0;
      this._dir = isDeboss ? 'down' : 'up';

      body.appendChild(U.el('div', 'machine machine--emboss',
        '<span class="machine__tag">' + (isDeboss ? 'DEBOSSING' : 'EMBOSSING') + ' · 3D RELIEV</span>' +
        '<span class="machine__die"></span>'));

      var align = slider(body, { label: 'PLATE ALIGNMENT', target: 50, half: PM.has('emboss') ? 12 : 8 });
      var lockBtn, prs, pressBtn, locked = false;
      var self = this;

      lockBtn = cta(body, 'LOCK PLATE', function (b) {
        if (locked) return;
        locked = true;
        b.disabled = true; b.textContent = 'PLATE LOCKED ✓';
        PM.sfx('click');
        prs = slider(body, { label: 'PRESSURE', half: 10 });
        pressBtn = cta(body, 'PRESS', function (pb) {
          pb.disabled = true;
          self.finish(ctx, align.accuracy(), prs.accuracy());
        });
        self._p = prs;
      }, 'gbtn--ghost');

      this._a = align; this._lock = lockBtn; this._ctx = ctx;
    },

    finish: function (ctx, aAcc, pAcc) {
      var q = Math.round((aAcc * 0.55 + pAcc * 0.45) * 100);
      ctx.m.emboss = q;
      ctx.p.relief = { dir: this._dir, quality: q };
      var dir = this._dir;
      PM.Product.runEmboss(dir, function () {
        PM.Product.update();
        if (q >= 94) verdict(true, (dir === 'up' ? 'EMBOSS' : 'DEBOSS') + ' QUALITY ' + q + '%', null,
          dir === 'up' ? 'Logoja ngrihet nga sipërfaqja' : 'Thellim i pastër');
        else if (q >= 74) verdict(true, 'RELIEF APPLIED ' + q + '%');
        else { verdict(false, null, 'BAD EMBOSS'); PM.addWaste(6); }
        ctx.done();
      });
    },

    autoSolve: function () {
      this._a.solve();
      this._lock.click();
      if (this._p) this._p.solve();
      this.finish(this._ctx, 1, 1);
    }
  };

  /* ============================================================
     STEP 8a — FINISH (plastifikim)
     ============================================================ */
  S.finish = {
    build: function (panel, ctx) {
      var body = head(panel, 'finish');
      var want = U.byId(PM.FINISHES, ctx.level.finish);
      body.appendChild(U.el('p', 'pan__note',
        'Porosia specifikon: <b>' + U.esc(want ? want.label : '?') + '</b>'));

      var c = choices(body, PM.FINISHES.map(function (f) {
        return { id: f.id, label: f.label, spec: U.money(f.cost) + ' / porosi' };
      }), {
        wide: true,
        onPick: function (id) {
          ctx.p.finish = id;
          PM.Product.update();
          PM.Product.runVarnish(function () {
            var ok = id === ctx.level.finish;
            if (ok) { ctx.m.finish = 100; verdict(true, 'FINISH APPROVED'); }
            else { ctx.m.finish = 52; ctx.m.satisfaction -= 6; verdict(false, null, 'WRONG LAMINATION'); }
            ctx.done();
          });
        }
      });
      this._c = c; this._want = ctx.level.finish;
    },
    autoSolve: function () { this._c.pick(this._want); }
  };

  /* ============================================================
     STEP 8b — SPOT VARNISH (zonat)
     ============================================================ */
  S.varnish = {
    build: function (panel, ctx) {
      var body = head(panel, 'varnish');
      var want = ctx.level.varnishAreas || ['logo'];
      body.appendChild(U.el('p', 'pan__note',
        'Shëno zonat ku aplikohet llaku parcial UV. Kërkohen <b>' + want.length + '</b>.'));

      var self = this;
      var c = choices(body, PM.VARNISH_AREAS.map(function (a) {
        return { id: a.id, label: a.label };
      }), {
        multi: true, wide: true,
        onChange: function (sel) { ctx.p.varnish = sel.slice(); PM.Product.update(); }
      });

      cta(body, 'APPLY VARNISH', function (b) { b.disabled = true; self.finish(ctx, c.get()); });
      this._c = c; this._want = want; this._ctx = ctx;
    },

    finish: function (ctx, sel) {
      var want = ctx.level.varnishAreas || ['logo'];
      var hit = sel.filter(function (id) { return want.indexOf(id) >= 0; }).length;
      var extra = sel.length - hit;
      var score = Math.round(U.clamp((hit - extra * 0.5) / want.length * 100, 0, 100));
      ctx.m.varnish = score;
      ctx.p.varnish = sel.slice();
      PM.Product.update();
      PM.Product.runVarnish(function () {
        if (score >= 100) verdict(true, 'SPOT VARNISH APPROVED', null, 'Shkëlqim vetëm ku duhet');
        else { verdict(false, null, 'UNEVEN VARNISH'); PM.addWaste(4); }
        ctx.done();
      });
    },

    autoSolve: function () {
      var self = this;
      this._want.forEach(function (id) { self._c.pick(id); });
      this.finish(this._ctx, this._want.slice());
    }
  };

  /* ============================================================
     STEP 9 — DIE CUTTING
     ============================================================ */
  S.diecut = {
    build: function (panel, ctx) {
      var body = head(panel, 'diecut');
      body.appendChild(U.el('div', 'machine machine--cut',
        '<span class="machine__tag">DIE CUTTING · SHTANCIM</span>' +
        '<span class="machine__knife"></span>'));

      var sw = sweep(body, { label: 'CUTTING ALIGNMENT', zone: 13, bonusKind: 'cut', speed: 78 });
      var self = this, started = false;
      cta(body, 'START CUTTER', function (b) {
        if (!started) { started = true; sw.start(); b.textContent = 'CUT'; return; }
        var r = sw.stop(); b.disabled = true;
        self.finish(ctx, r);
      });
      this._sw = sw; this._ctx = ctx;
    },

    finish: function (ctx, r) {
      var q = Math.round(r.acc * 100);
      ctx.m.cut = q;
      ctx.p.cut = true;
      PM.Product.runCut(function () {
        PM.Product.update();
        if (q >= 95) verdict(true, 'CUTTING PRECISION ' + q + '%');
        else if (q >= 76) verdict(true, 'CUT OK ' + q + '%');
        else { verdict(false, null, 'CUTTING ERROR'); PM.addWaste(8); }
        ctx.done();
      });
    },

    autoSolve: function () { this._sw.solve(); this._sw.destroy(); this.finish(this._ctx, { inside: true, acc: 1 }); }
  };

  /* ============================================================
     STEP 10 — CREASING & FOLDING
     ============================================================ */
  S.fold = {
    build: function (panel, ctx) {
      var body = head(panel, 'fold');
      var seq = PM.has('fold') ? ['FOLD', 'PRESS', 'LOCK'] : ['FOLD', 'FOLD', 'PRESS', 'LOCK'];
      body.appendChild(U.el('p', 'pan__note',
        'Ndiq radhën: <b>' + seq.join(' → ') + '</b>'));

      var row = U.el('div', 'seqrow');
      row.innerHTML = seq.map(function (s, i) {
        return '<button class="seq" type="button" data-i="' + i + '"' + (i ? ' disabled' : '') + '>' +
                 '<span class="seq__n">' + (i + 1) + '</span><span class="seq__l">' + s + '</span></button>';
      }).join('');
      body.appendChild(row);

      var self = this, step = 0, t0 = Date.now();
      var btns = U.qa('.seq', row);
      btns.forEach(function (b, i) {
        b.addEventListener('click', function () {
          if (i !== step) return;
          b.classList.add('is-done'); b.disabled = true;
          PM.Product.foldStep(i + 1);
          step++;
          if (step < btns.length) { btns[step].disabled = false; }
          else self.finish(ctx, (Date.now() - t0) / 1000);
        });
      });
      this._btns = btns; this._ctx = ctx;
    },

    finish: function (ctx, secs) {
      var q = Math.round(U.clamp(100 - Math.max(secs - 3.2, 0) * 7, 55, 100));
      ctx.m.fold = q;
      var done = function () {
        if (q >= 92) verdict(true, 'FOLDING PRECISE ' + q + '%', null,
          ctx.level.type === 'flyer' ? 'Fletushka u palos rregullt' : 'Kutia 3D u formua');
        else verdict(true, 'FOLDED ' + q + '%');
        ctx.done();
      };
      if (ctx.level.type === 'flyer') PM.Product.assembleFlyer(done);
      else PM.Product.assembleBox(done);
    },

    autoSolve: function () {
      var b = this._btns;
      for (var i = 0; i < b.length; i++) b[i].click();
    }
  };

  /* ============================================================
     STEP 10b — BINDING (libra)
     ============================================================ */
  S.bind = {
    build: function (panel, ctx) {
      var body = head(panel, 'bind');
      body.appendChild(U.el('div', 'machine machine--bind',
        '<span class="machine__tag">HORIZON · LIDHJE LIBRASH</span>' +
        '<span class="machine__clamp"></span>'));
      var al = slider(body, { label: 'BLOCK ALIGNMENT', target: 50, half: 9 });
      var gl = slider(body, { label: 'GLUE / THREAD TENSION', half: 10 });
      var self = this;
      cta(body, 'BIND BLOCK', function (b) { b.disabled = true; self.finish(ctx, al.accuracy(), gl.accuracy()); });
      this._a = al; this._g = gl; this._ctx = ctx;
    },
    finish: function (ctx, a, g) {
      var q = Math.round((a * 0.5 + g * 0.5) * 100);
      ctx.m.bind = q;
      PM.Product.runBind(function () {
        if (q >= 92) verdict(true, 'BINDING SOLID ' + q + '%');
        else if (q >= 72) verdict(true, 'BOUND ' + q + '%');
        else { verdict(false, null, 'BINDING ERROR'); PM.addWaste(5); }
        ctx.done();
      });
    },
    autoSolve: function () { this._a.solve(); this._g.solve(); this.finish(this._ctx, 1, 1); }
  };

  /* ============================================================
     STEP 11 — ASSEMBLY
     ============================================================ */
  S.assembly = {
    build: function (panel, ctx) {
      var body = head(panel, 'assembly');
      var want = ctx.level.inserts || [];
      body.appendChild(U.el('p', 'pan__note',
        'Vendos <b>' + want.length + '</b> komponent brenda paketimit — vetëm ata që kërkon porosia.'));

      var pool = PM.INSERTS.filter(function (i) { return want.indexOf(i.id) < 0; });
      var items = U.shuffle(want.map(function (id) { return U.byId(PM.INSERTS, id); })
        .concat(U.shuffle(pool).slice(0, 2)))
        .map(function (i) { return { id: i.id, label: i.label, spec: U.money(i.cost) }; });

      var self = this;
      var c = choices(body, items, {
        multi: true, wide: true,
        onChange: function (sel) { ctx.p.inserts = sel.slice(); }
      });
      cta(body, 'CLOSE PACKAGE', function (b) { b.disabled = true; self.finish(ctx, c.get()); });
      this._c = c; this._want = want; this._ctx = ctx;
    },

    finish: function (ctx, sel) {
      var want = ctx.level.inserts || [];
      var hit = sel.filter(function (id) { return want.indexOf(id) >= 0; }).length;
      var extra = sel.length - hit;
      var score = want.length
        ? Math.round(U.clamp((hit - extra * 0.7) / want.length * 100, 0, 100)) : 100;
      ctx.m.assembly = score;
      ctx.p.inserts = sel.slice();
      if (score >= 100) verdict(true, 'ASSEMBLY COMPLETE');
      else { verdict(false, null, 'ASSEMBLY ERROR'); PM.addWaste(3); }
      setTimeout(function () { ctx.done(); }, 600);
    },

    autoSolve: function () {
      var self = this;
      this._want.forEach(function (id) { self._c.pick(id); });
      this.finish(this._ctx, this._want.slice());
    }
  };

  /* ============================================================
     STEP 12 — QUALITY CONTROL
     ============================================================ */
  S.qc = {
    build: function (panel, ctx) {
      var body = head(panel, 'qc');
      var secs = 9 + (PM.has('qc') ? 3 : 0);

      /* sa defekte — varet nga gabimet e mbledhura */
      var weak = 0;
      ['print', 'foil', 'emboss', 'cut', 'fold', 'artwork', 'varnish', 'assembly'].forEach(function (k) {
        if (typeof ctx.m[k] === 'number' && ctx.m[k] < 90) weak++;
      });
      var n = U.clamp(2 + weak, 2, 5);

      var pool = U.shuffle(PM.DEFECTS).slice(0, n).map(function (d) {
        return { id: d.id, label: d.label, x: U.rnd(16, 84), y: U.rnd(18, 82) };
      });

      body.appendChild(U.el('p', 'pan__note',
        'Produkti rrotullohet. Klikoje çdo defekt që gjen — <b>' + n + '</b> të pranishëm.'));
      body.appendChild(U.el('div', 'qcbar',
        '<span class="qcbar__fill" data-qcfill></span>'));
      var count = U.el('div', 'qccount', '<b data-qcn>0</b> / ' + n + ' DEFECTS FOUND');
      body.appendChild(count);

      var found = 0, self = this, ended = false;
      PM.Product.spin(true);
      PM.Product.renderDefects(pool, function () {
        found++;
        U.q('[data-qcn]', count).textContent = found;
        if (found >= n && !ended) end();
      });

      var fill = U.q('[data-qcfill]', body);
      var t0 = Date.now(), raf;
      function loop() {
        if (ended) return;
        var el = (Date.now() - t0) / 1000;
        var pct = U.clamp(1 - el / secs, 0, 1);
        fill.style.transform = 'scaleX(' + pct + ')';
        if (pct <= 0) { end(); return; }
        raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(loop);

      function end() {
        if (ended) return;
        ended = true;
        if (raf) cancelAnimationFrame(raf);
        PM.Product.spin(false);
        PM.Product.clearDefects();
        self.finish(ctx, found, n);
      }
      this._end = end;
      this._ctx = ctx; this._n = n; this._pool = pool;
    },

    finish: function (ctx, found, n) {
      var score = Math.round((found / n) * 100);
      ctx.m.qc = score;
      if (found >= n) verdict(true, found + ' DEFECTS FOUND', null, 'QUALITY CONTROL: 100%');
      else {
        verdict(false, null, (n - found) + ' DEFECTS MISSED', 'QUALITY CONTROL: ' + score + '%');
        ctx.m.satisfaction -= (n - found) * 4;
      }
      setTimeout(function () { ctx.done(); }, 700);
    },

    autoSolve: function () {
      var host = PM.Product.getFace();
      U.qa('.defect', host).forEach(function (b) { b.click(); });
      if (this._end) this._end();
    }
  };

  /* ============================================================
     STEP 13 — PACK THE ORDER
     ============================================================ */
  S.pack = {
    build: function (panel, ctx) {
      var body = head(panel, 'pack');
      body.appendChild(U.el('p', 'pan__note',
        '<b>' + U.esc(ctx.level.product) + '</b> gati për transport. Zgjidh paketimin.'));

      var self = this;
      var c = choices(body, PM.SHIPPING.map(function (s) {
        return { id: s.id, label: s.label, spec: s.note + ' · ' + U.money(s.cost) };
      }), {
        wide: true,
        onPick: function (id) { self.finish(ctx, id); }
      });
      this._c = c; this._ctx = ctx;
    },

    finish: function (ctx, id) {
      var s = U.byId(PM.SHIPPING, id);
      ctx.p.shipping = id;
      ctx.m.satisfaction += s.sat + (PM.has('packing') ? 6 : 0);
      ctx.m.eco += s.eco;
      PM.flash(s.label.toUpperCase() + ' PACKING');
      PM.toast('ORDER PACKED', 'ok', s.label + ' · ' + U.money(s.cost));
      setTimeout(function () { ctx.done(); }, 620);
    },

    autoSolve: function () { this._c.pick('premium'); }
  };

  /* ============================================================
     STEP 14 — DELIVERY
     ============================================================ */
  S.delivery = {
    build: function (panel, ctx) {
      var body = head(panel, 'delivery');
      var left = Math.round(PM.G.timeLeft);
      body.appendChild(U.el('p', 'pan__note',
        'Afati: <b>' + ctx.level.deadline + 's</b> · Të mbetura: <b>' + left + 's</b>'));
      body.appendChild(U.el('div', 'truck', '<span class="truck__body"></span><span class="truck__road"></span>'));
      var self = this;
      cta(body, 'DELIVER ORDER', function (b) { b.disabled = true; self.finish(ctx); });
      this._ctx = ctx;
    },

    finish: function (ctx) {
      var used = ctx.level.deadline - PM.G.timeLeft;
      ctx.m.deliverySec = Math.max(Math.round(used), 0);
      var ratio = PM.G.timeLeft / ctx.level.deadline;
      if (ratio > 0.25) { ctx.m.bonus += 10; ctx.m.satisfaction += 8; verdict(true, 'EARLY DELIVERY! +10'); }
      else if (PM.G.timeLeft > 0) { ctx.m.bonus += 5; ctx.m.satisfaction += 3; verdict(true, 'ON TIME +5'); }
      else { ctx.m.penalties += 15; verdict(false, null, 'DEADLINE MISSED'); }
      var body = document.querySelector('.truck');

      function go() {
        if (body) body.classList.add('is-go');
        setTimeout(function () { ctx.done(); }, 900);
      }

      /* Për fletushka: shndërro në tufë të paketuar 3D para nisjes */
      if (ctx.level.type === 'flyer') PM.Product.runBundle(go);
      else go();
    },

    autoSolve: function () { this.finish(this._ctx); }
  };
})();
