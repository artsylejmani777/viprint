/* ============================================================
   VI-PRINT: PRINT MASTER — Renderuesi i produktit (CSS 3D)
   ------------------------------------------------------------
   Produkti është një objekt i vërtetë 3D i ndërtuar me shtresa:
     material → shtyp → folie → reliev → llak → plastifikim
   Çdo fazë e prodhimit e transformon dukshëm.
   ============================================================ */
(function () {
  'use strict';
  var PM = window.PM, U = PM.U;

  var host = null, stage = null, face = null, net = null, box = null, sparks = null;
  var rot = { x: -8, y: -22 }, dragOn = false;

  /* Pozicionet e synuara të elementeve të dizajnit (në % të faqes) */
  var SLOTS = {
    logo:    { x: 50, y: 32, w: 46, h: 16, label: 'LOGO' },
    name:    { x: 50, y: 55, w: 62, h: 9,  label: 'NAME' },
    barcode: { x: 76, y: 84, w: 30, h: 10, label: 'BARCODE' }
  };
  PM.SLOTS = SLOTS;

  var Product = PM.Product = {

    /* ---------------- Ndërtimi ---------------- */
    mount: function (hostEl) {
      host = hostEl;
      host.innerHTML =
        '<div class="pv">' +
          '<div class="pv__floor" aria-hidden="true"></div>' +
          '<div class="pv__stage" data-pstage>' +
            /* --- Fleta / neti (i shtypur, i paplosur) --- */
            '<div class="sheet" data-net>' +
              '<span class="sheet__flap sheet__flap--t" data-flap="t"></span>' +
              '<span class="sheet__flap sheet__flap--b" data-flap="b"></span>' +
              '<span class="sheet__flap sheet__flap--l" data-flap="l"></span>' +
              '<span class="sheet__flap sheet__flap--r" data-flap="r"></span>' +
              '<div class="face" data-face>' +
                '<span class="lay lay--tex"></span>' +
                '<span class="lay lay--pattern"></span>' +
                '<div class="art" data-art></div>' +
                '<span class="lay lay--varnish"></span>' +
                '<span class="lay lay--finish"></span>' +
                '<span class="lay lay--fluo"></span>' +
                '<span class="lay lay--cutline"></span>' +
                '<div class="defects" data-defects></div>' +
              '</div>' +
            '</div>' +
            /* --- Kutia e mbledhur 3D --- */
            '<div class="box3d" data-box>' +
              '<span class="box3d__f box3d__f--front" data-boxfront></span>' +
              '<span class="box3d__f box3d__f--side"></span>' +
              '<span class="box3d__f box3d__f--top"></span>' +
              '<span class="box3d__f box3d__f--shadow"></span>' +
            '</div>' +
            /* --- Blloku i librit (bind) --- */
            '<div class="bookblock" data-bookblock></div>' +
          '</div>' +
          '<div class="pv__sparks" data-sparks aria-hidden="true"></div>' +
          '<div class="pv__flash" data-stage-flash aria-hidden="true"></div>' +
        '</div>';

      stage  = U.q('[data-pstage]', host);
      net    = U.q('[data-net]', host);
      box    = U.q('[data-box]', host);
      face   = U.q('[data-face]', host);
      sparks = U.q('[data-sparks]', host);

      this.bindDrag();
      this.setRotation(-8, -22);
      this.update();
    },

    getFace: function () { return face; },
    getStage: function () { return stage; },

    /* ---------------- Rrotullimi ---------------- */
    setRotation: function (x, y) {
      rot.x = U.clamp(x, -34, 34);
      rot.y = U.clamp(y, -62, 62);
      if (stage) stage.style.transform = 'rotateX(' + rot.x + 'deg) rotateY(' + rot.y + 'deg)';
    },

    enableDrag: function (on) { dragOn = on !== false; },

    bindDrag: function () {
      var start = null;
      var pv = U.q('.pv', host);
      if (!pv) return;

      function down(e) {
        if (!dragOn) return;
        var t = e.touches ? e.touches[0] : e;
        start = { x: t.clientX, y: t.clientY, rx: rot.x, ry: rot.y };
      }
      function move(e) {
        if (!start) return;
        var t = e.touches ? e.touches[0] : e;
        Product.setRotation(start.rx - (t.clientY - start.y) * 0.22,
                            start.ry + (t.clientX - start.x) * 0.32);
        if (e.cancelable) e.preventDefault();
      }
      function up() { start = null; }

      pv.addEventListener('mousedown', down);
      pv.addEventListener('touchstart', down, { passive: true });
      window.addEventListener('mousemove', move);
      window.addEventListener('touchmove', move, { passive: false });
      window.addEventListener('mouseup', up);
      window.addEventListener('touchend', up);
    },

    /* ---------------- Sinkronizimi me state ---------------- */
    update: function () {
      if (!host) return;
      var p = PM.G.p, lvl = PM.G.level;
      if (!p) return;

      var pv = U.q('.pv', host);
      if (!pv) return;

      /* Tipi i produktit → proporcionet */
      pv.setAttribute('data-type', p.type);
      pv.setAttribute('data-format', p.format || '');

      /* Materiali */
      pv.style.setProperty('--mat', p.matBase);
      pv.style.setProperty('--ink', p.inkColor);
      pv.setAttribute('data-tex', p.material ? p.matTex : 'none');
      pv.classList.toggle('has-material', !!p.material);

      /* Shtypi */
      pv.classList.toggle('is-printed', !!p.printed);

      /* Folia */
      var foilTone = p.foil ? p.foil.tone : '';
      pv.setAttribute('data-foil', foilTone);
      pv.classList.toggle('has-foil', !!p.foil);

      /* Relievi */
      pv.setAttribute('data-relief', p.relief ? p.relief.dir : '');
      pv.classList.toggle('has-relief', !!p.relief);

      /* Finishimi */
      pv.setAttribute('data-finish', p.finish || '');
      pv.classList.toggle('has-finish', !!p.finish);

      /* Llaku parcial */
      pv.setAttribute('data-varnish', (p.varnish || []).join(' '));
      pv.classList.toggle('has-varnish', !!(p.varnish && p.varnish.length));

      /* Teksturë / fluoreshent */
      pv.classList.toggle('has-texture', !!p.texture);
      pv.classList.toggle('has-fluo', !!p.fluo);

      /* Prerja / palosja / lidhja */
      pv.classList.toggle('is-cut', !!p.cut);
      pv.classList.toggle('is-folded', !!p.folded);
      pv.classList.toggle('is-bound', !!p.bound);

      /* Aksenti i klientit */
      var cl = PM.CLIENTS[lvl.client];
      pv.style.setProperty('--accent', cl ? cl.accent : '#D9B45B');

      this.renderArt();
      this.renderBoxFace();
    },

    /* ---------------- Elementet e dizajnit ---------------- */
    renderArt: function () {
      var p = PM.G.p, lvl = PM.G.level;
      var artHost = U.q('[data-art]', host);
      if (!artHost) return;

      var cl = PM.CLIENTS[lvl.client] || { name: 'CLIENT' };
      var placed = p.artwork || [];
      var pos = p.artPos || {};

      function chip(id, inner, extra) {
        var s = SLOTS[id];
        var pp = pos[id] || { x: s.x, y: s.y };
        var isPlaced = placed.indexOf(id) >= 0;
        return '<span class="art__it art__it--' + id + (isPlaced ? ' is-placed' : '') + '"' +
               ' data-artit="' + id + '"' +
               ' style="left:' + pp.x + '%;top:' + pp.y + '%">' +
                 '<span class="art__ink">' + inner + '</span>' +
                 '<span class="art__foil">' + inner + '</span>' +
                 '<span class="art__relief">' + inner + '</span>' +
                 (extra || '') +
               '</span>';
      }

      var barcode = '';
      for (var i = 0; i < 22; i++) {
        barcode += '<i style="width:' + (Math.random() > 0.5 ? 2 : 1) + 'px"></i>';
      }

      artHost.innerHTML =
        chip('logo',
          '<span class="mark"><b>VI</b><em>' + U.esc(cl.name.split(' ')[0].toUpperCase()) + '</em></span>') +
        chip('name',
          '<span class="nm">' + U.esc((lvl.product || '').replace(/^[\d.\s]+/, '')) + '</span>') +
        chip('barcode', '<span class="bc">' + barcode + '</span>') +
        '<span class="art__it art__it--smalltext is-placed" style="left:50%;top:70%">' +
          '<span class="art__ink"><span class="st">' + U.esc(lvl.style || '') + ' · VI-PRINT</span></span>' +
          '<span class="art__foil"><span class="st">' + U.esc(lvl.style || '') + ' · VI-PRINT</span></span>' +
          '<span class="art__relief"><span class="st">' + U.esc(lvl.style || '') + '</span></span>' +
        '</span>';
    },

    /** Faqja e përparme e kutisë 3D pasqyron fletën e shtypur */
    renderBoxFace: function () {
      var bf = U.q('[data-boxfront]', host);
      if (!bf || !face) return;
      // klonim i lehtë: kopjojmë vetëm artwork-un si HTML statik
      var art = U.q('[data-art]', host);
      bf.innerHTML = '<span class="boxart">' + (art ? art.innerHTML : '') + '</span>';
    },

    /* ============================================================
       ANIMACIONET E TRANSFORMIMIT
       ============================================================ */

    /** Kalimi i produktit nëpër makinë (shtyp) */
    runPress: function (cb) {
      var pv = U.q('.pv', host);
      pv.classList.add('anim-press');
      PM.sfx('roll');
      setTimeout(function () { pv.classList.remove('anim-press'); if (cb) cb(); }, U.reduced ? 60 : 900);
    },

    /** Presa e folies: pllaka bie → shtyp → folia shfaqet */
    runFoil: function (tone, cb) {
      var pv = U.q('.pv', host);
      var plate = U.el('div', 'foilplate foilplate--' + tone);
      plate.innerHTML = '<span class="foilplate__lip"></span>';
      U.q('.pv', host).appendChild(plate);

      requestAnimationFrame(function () { plate.classList.add('is-down'); });
      setTimeout(function () { PM.sfx('press'); pv.classList.add('anim-shock'); }, U.reduced ? 20 : 520);
      setTimeout(function () {
        pv.classList.remove('anim-shock');
        plate.classList.remove('is-down');
        plate.classList.add('is-up');
        PM.sfx('shine');
        PM.sparkle(22);
      }, U.reduced ? 60 : 900);
      setTimeout(function () {
        if (plate.parentNode) plate.parentNode.removeChild(plate);
        if (cb) cb();
      }, U.reduced ? 100 : 1500);
    },

    /** Presa e embosimit: logoja ngrihet nga sipërfaqja */
    runEmboss: function (dir, cb) {
      var pv = U.q('.pv', host);
      pv.classList.add('anim-emboss-in');
      PM.sfx('press');
      setTimeout(function () {
        pv.classList.remove('anim-emboss-in');
        pv.classList.add('anim-emboss-rise');
        PM.sparkle(10);
      }, U.reduced ? 40 : 620);
      setTimeout(function () {
        pv.classList.remove('anim-emboss-rise');
        if (cb) cb();
      }, U.reduced ? 90 : 1500);
    },

    /** Kalimi i dritës mbi llakun */
    runVarnish: function (cb) {
      var pv = U.q('.pv', host);
      pv.classList.add('anim-gloss');
      PM.sfx('shine');
      setTimeout(function () { pv.classList.remove('anim-gloss'); if (cb) cb(); }, U.reduced ? 60 : 1400);
    },

    /** Prerja: thika kalon, forma finale */
    runCut: function (cb) {
      var pv = U.q('.pv', host);
      var blade = U.el('div', 'blade');
      pv.appendChild(blade);
      requestAnimationFrame(function () { blade.classList.add('is-go'); });
      PM.sfx('cut');
      setTimeout(function () {
        if (blade.parentNode) blade.parentNode.removeChild(blade);
        if (cb) cb();
      }, U.reduced ? 80 : 760);
    },

    /** Palosja: flapët ngrihen, pastaj kutia 3D shfaqet */
    foldStep: function (i) {
      var pv = U.q('.pv', host);
      pv.classList.add('fold-' + i);
      PM.sfx('click');
    },

    assembleBox: function (cb) {
      var pv = U.q('.pv', host);
      pv.classList.add('anim-assemble');
      PM.sfx('press');
      setTimeout(function () {
        PM.G.p.folded = true;
        Product.update();
        pv.classList.remove('anim-assemble', 'fold-1', 'fold-2', 'fold-3', 'fold-4');
        PM.sparkle(14);
        if (cb) cb();
      }, U.reduced ? 90 : 1050);
    },

    /** Lidhja e librit */
    runBind: function (cb) {
      var pv = U.q('.pv', host);
      pv.classList.add('anim-bind');
      PM.sfx('press');
      setTimeout(function () {
        pv.classList.remove('anim-bind');
        PM.G.p.bound = true;
        Product.update();
        if (cb) cb();
      }, U.reduced ? 80 : 1000);
    },

    /* ---------------- Rrotullim automatik (QC / raport) ---------------- */
    spin: function (on) {
      var pv = U.q('.pv', host);
      if (pv) pv.classList.toggle('is-spinning', !!on);
    },

    /* ---------------- Defektet (QC) ---------------- */
    renderDefects: function (list, onHit) {
      var hostD = U.q('[data-defects]', host);
      if (!hostD) return;
      hostD.innerHTML = list.map(function (d, i) {
        return '<button class="defect" type="button" data-def="' + i + '"' +
               ' style="left:' + d.x + '%;top:' + d.y + '%"' +
               ' aria-label="' + U.esc(d.label) + '">' +
                 '<span class="defect__ring"></span>' +
                 '<span class="defect__glyph"></span>' +
               '</button>';
      }).join('');
      hostD.classList.add('is-on');
      if (PM.has('qc')) hostD.classList.add('is-hinted');

      U.qa('.defect', hostD).forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          if (b.classList.contains('is-found')) return;
          b.classList.add('is-found');
          PM.sfx('good');
          if (onHit) onHit(parseInt(b.dataset.def, 10));
        });
      });
    },

    clearDefects: function () {
      var hostD = U.q('[data-defects]', host);
      if (hostD) { hostD.innerHTML = ''; hostD.classList.remove('is-on', 'is-hinted'); }
    }
  };
})();
