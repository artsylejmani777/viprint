/* ============================================================
   ViPrint — Produktet: filtrim sipas kategorive, grid, modal
   64 produkte reale nga katalogu zyrtar.
   ============================================================ */
(function () {
  'use strict';
  window.VP = window.VP || {};

  var PAGE = 12;   // sa produkte shfaqen para "Shfaq më shumë"

  VP.initProducts = function () {
    var chipsEl = document.querySelector('[data-pr-chips]');
    var gridEl  = document.querySelector('[data-pr-grid]');
    var moreEl  = document.querySelector('[data-pr-more]');
    var countEl = document.querySelector('[data-pr-count]');
    if (!gridEl || !VP.products) return;

    var esc  = VP.esc;
    var cats = VP.productCategories;
    var all  = VP.products;

    var state = { cat: 'all', shown: PAGE, list: all };

    function labelOf(id) {
      var c = cats.filter(function (c) { return c.id === id; })[0];
      return c ? c.label : id;
    }
    function countOf(id) {
      return id === 'all' ? all.length : all.filter(function (p) { return p.cat === id; }).length;
    }

    /* ---------- Chips ---------- */
    if (chipsEl) {
      chipsEl.innerHTML = cats.map(function (c) {
        return '<button class="chip" type="button" data-cat="' + esc(c.id) + '"' +
               ' aria-pressed="' + (c.id === 'all') + '">' + esc(c.label) +
               '<span class="chip__n">' + countOf(c.id) + '</span></button>';
      }).join('');

      chipsEl.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (!b) return;
        state.cat = b.dataset.cat;
        state.shown = PAGE;
        chipsEl.querySelectorAll('.chip').forEach(function (c) {
          c.setAttribute('aria-pressed', String(c.dataset.cat === state.cat));
        });
        draw();
      });
    }

    /* ---------- Grid ---------- */
    function draw() {
      state.list = state.cat === 'all'
        ? all
        : all.filter(function (p) { return p.cat === state.cat; });

      var slice = state.list.slice(0, state.shown);

      gridEl.innerHTML = slice.length ? slice.map(function (p, i) {
        return '<button class="pr-card" type="button" data-id="' + esc(p.id) + '"' +
               ' style="animation-delay:' + Math.min(i * 28, 420) + 'ms"' +
               ' aria-label="' + esc(p.name) + ' — shiko detajet">' +
          '<span class="pr-card__media">' +
            '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + ' — ViPrint" loading="lazy" decoding="async">' +
            '<span class="pr-card__plus">' + VP.icons.plus + '</span>' +
          '</span>' +
          '<span class="pr-card__body">' +
            '<span class="pr-card__name">' + esc(p.name) + '</span>' +
            '<span class="pr-card__cat">' + esc(labelOf(p.cat)) + '</span>' +
          '</span>' +
        '</button>';
      }).join('') : '<p class="pr__empty">Nuk ka produkte në këtë kategori.</p>';

      if (countEl) {
        countEl.textContent = 'Duke shfaqur ' + slice.length + ' nga ' + state.list.length +
                              ' produkte' + (state.cat === 'all' ? '' : ' · ' + labelOf(state.cat));
      }
      if (moreEl) {
        moreEl.style.display = state.list.length > state.shown ? 'flex' : 'none';
      }
    }

    if (moreEl) {
      moreEl.querySelector('button').addEventListener('click', function () {
        state.shown += PAGE * 2;
        draw();
      });
    }

    /* ---------- Modal ---------- */
    var modal = document.querySelector('[data-pr-modal]');
    var lastFocus = null;

    function openAt(id) {
      var idx = state.list.findIndex(function (p) { return p.id === id; });
      if (idx < 0) idx = all.findIndex(function (p) { return p.id === id; });
      if (idx < 0) return;
      show(idx);
    }

    function show(idx) {
      var list = state.list.length ? state.list : all;
      if (idx < 0) idx = list.length - 1;
      if (idx >= list.length) idx = 0;
      var p = list[idx];

      var body = modal.querySelector('[data-modal-content]');
      body.innerHTML =
        '<div class="modal__grid">' +
          '<div class="modal__media"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + ' — ViPrint"></div>' +
          '<div class="modal__body">' +
            '<span class="eyebrow">' + esc(labelOf(p.cat)) + '</span>' +
            '<h3 class="modal__title">' + esc(p.name) + '</h3>' +
            (p.desc ? '<p class="muted" style="line-height:1.72">' + esc(p.desc) + '</p>' : '') +
            '<dl class="modal__spec">' +
              (p.formats ? '<div class="modal__spec-row"><dt>Formatet</dt><dd>' + esc(p.formats) + '</dd></div>' : '') +
              '<div class="modal__spec-row"><dt>Kategoria</dt><dd>' + esc(labelOf(p.cat)) + '</dd></div>' +
              '<div class="modal__spec-row"><dt>Prodhim</dt><dd>ViPrint · Mitrovicë</dd></div>' +
            '</dl>' +
            '<a class="btn btn--brand" href="#contact" data-modal-close style="margin-top:.75rem;align-self:start">' +
              'Kërko ofertë' + VP.icons.arrowRight + '</a>' +
          '</div>' +
        '</div>';

      modal.dataset.idx = String(idx);
      if (!modal.classList.contains('is-open')) {
        lastFocus = document.activeElement;
        modal.classList.add('is-open');
        document.body.classList.add('is-locked');
        modal.setAttribute('aria-hidden', 'false');
      }
      modal.querySelector('.modal__close').focus();
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }

    gridEl.addEventListener('click', function (e) {
      var card = e.target.closest('.pr-card');
      if (card) openAt(card.dataset.id);
    });

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target.closest('[data-modal-close]') || e.target.classList.contains('modal__scrim')) {
          close();
          return;
        }
        var nav = e.target.closest('[data-modal-nav]');
        if (nav) {
          var d = parseInt(nav.dataset.modalNav, 10);
          show(parseInt(modal.dataset.idx || '0', 10) + d);
        }
      });

      document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') show(parseInt(modal.dataset.idx || '0', 10) + 1);
        if (e.key === 'ArrowLeft')  show(parseInt(modal.dataset.idx || '0', 10) - 1);
      });
    }

    draw();
  };
})();
