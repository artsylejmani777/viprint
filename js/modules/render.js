/* ============================================================
   ViPrint — Renderuesit e seksioneve statike
   (stats, brands, services, why, testimonials, machines)
   Të gjitha të dhënat vijnë nga /data/*.js
   ============================================================ */
(function () {
  'use strict';
  window.VP = window.VP || {};

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  VP.esc = esc;

  function mount(sel, html) {
    var el = document.querySelector(sel);
    if (el) el.innerHTML = html;
    return el;
  }

  /* ---------------- STATS ---------------- */
  VP.renderStats = function () {
    var html = VP.company.stats.map(function (s) {
      var numeric = /^[\d.]+\+?$/.test(s.value);
      var val = numeric
        ? '<span data-count="' + esc(s.value) + '">0</span>'
        : esc(s.value);
      return '<div class="stat reveal">' +
               '<div class="stat__value">' + val + '</div>' +
               '<div class="stat__label">' + esc(s.label) + '</div>' +
             '</div>';
    }).join('');
    mount('[data-stats]', html);
  };

  /* ---------------- BRANDS (About) ---------------- */
  VP.renderBrands = function () {
    var html = VP.company.brands.map(function (b) {
      return '<div class="brand-row reveal">' +
               '<span class="brand-row__name">' + esc(b.name) + '</span>' +
               '<span class="brand-row__note">' + esc(b.note) + '</span>' +
             '</div>';
    }).join('');
    mount('[data-brands]', html);
  };

  /* ---------------- HERO marquee ---------------- */
  VP.renderMarquee = function () {
    var items = VP.services.map(function (s) { return s.title; })
      .concat(['FOGRA Certified', 'Superbrands', 'Mitrovicë · Kosovë']);
    var one = items.map(function (t) {
      return '<span class="marquee__item">' + esc(t) + '</span>';
    }).join('');
    // dy trakte identike → lëvizje e pandërprerë
    mount('[data-marquee]',
      '<div class="marquee__track">' + one + '</div>' +
      '<div class="marquee__track" aria-hidden="true">' + one + '</div>');
  };

  /* ---------------- SERVICES ---------------- */
  VP.renderServices = function () {
    var html = VP.services.map(function (s, i) {
      return '<article class="card reveal" style="--reveal-delay:' + (i * 60) + 'ms">' +
        '<div class="card__media reveal-img">' +
          '<span class="card__badge">' + esc(s.titleAl) + '</span>' +
          '<img src="' + esc(s.img) + '" alt="' + esc(s.title + ' — ViPrint') + '" loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="card__body">' +
          '<span class="svc__en">' + esc(s.title) + '</span>' +
          '<h3 class="card__title">' + esc(s.titleAl) + '</h3>' +
          '<p class="card__text">' + esc(s.lead) + '</p>' +
          '<div class="card__foot">' +
            '<span class="svc__meta">' + esc(s.meta) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
    mount('[data-services]', html);
  };

  /* ---------------- WHY ---------------- */
  VP.renderWhy = function () {
    var html = VP.whyViprint.map(function (w, i) {
      var ico = VP.icons[w.id] || VP.icons.quality;
      return '<article class="why-item reveal" style="--reveal-delay:' + (i * 55) + 'ms">' +
        '<div class="why-item__top">' +
          '<span class="why-item__ico">' + ico + '</span>' +
          '<span class="why-item__n">' + String(i + 1).padStart(2, '0') + '</span>' +
        '</div>' +
        '<span class="why-item__en">' + esc(w.en) + '</span>' +
        '<h3 class="why-item__title">' + esc(w.title) + '</h3>' +
        '<p class="why-item__text">' + esc(w.text) + '</p>' +
      '</article>';
    }).join('');
    mount('[data-why]', html);
  };

  /* ---------------- TESTIMONIALS ---------------- */
  VP.renderTestimonials = function () {
    var html = VP.testimonials.map(function (t, i) {
      return '<figure class="tst reveal" style="--reveal-delay:' + (i * 70) + 'ms">' +
        '<div class="tst__mark">”</div>' +
        '<blockquote class="tst__text">' + esc(t.text) + '</blockquote>' +
        '<figcaption class="tst__by"><strong>' + esc(t.author) + '</strong><span>' + esc(t.role) + '</span></figcaption>' +
      '</figure>';
    }).join('');
    mount('[data-testimonials]', html);
  };

  /* ---------------- MACHINES ---------------- */
  VP.renderMachines = function () {
    var list = VP.machines;
    var hero = list.filter(function (m) { return m.highlight; })[0];
    var rest = list.filter(function (m) { return !m.highlight; });

    var heroHtml = hero ? (
      '<article class="mach-card mach-card--hero reveal">' +
        '<div>' +
          '<span class="mach-card__tag">Makina kryesore</span>' +
          '<h3 class="mach-card__name" style="margin-top:.9rem">' + esc(hero.name) + '</h3>' +
          '<p class="mach-card__type">' + esc(hero.type) + '</p>' +
          '<p class="mach-card__note" style="margin-top:.75rem">' + esc(hero.note) + '</p>' +
        '</div>' +
        '<div>' +
          '<div class="mach-card__big">B1<br><span>100×70</span> cm</div>' +
          '<div class="mach-card__spec">' + esc(hero.spec) + ' · 5 ngjyra</div>' +
        '</div>' +
      '</article>'
    ) : '';

    var restHtml = rest.map(function (m, i) {
      return '<article class="mach-card reveal" style="--reveal-delay:' + (i * 45) + 'ms">' +
        '<div class="mach-card__top">' +
          '<span class="mach-card__tag">' + esc(m.tag) + '</span>' +
          '<span class="mach-card__i">' + String(i + 2).padStart(2, '0') + '</span>' +
        '</div>' +
        '<h3 class="mach-card__name">' + esc(m.name) + '</h3>' +
        '<p class="mach-card__type">' + esc(m.type) + '</p>' +
        '<p class="mach-card__note">' + esc(m.note) + '</p>' +
        '<div class="mach-card__spec">' + esc(m.spec) + '</div>' +
      '</article>';
    }).join('');

    mount('[data-machines]', heroHtml + restHtml);

    /* "E para në Kosovë" list */
    mount('[data-firsts]', VP.machineFirsts.map(function (t, i) {
      return '<div class="firsts__row reveal">' +
               '<span class="firsts__n">' + String(i + 1).padStart(2, '0') + '</span>' +
               '<p class="firsts__t">' + esc(t) + '</p>' +
             '</div>';
    }).join(''));

    /* Galeria e repartit */
    mount('[data-hall]', VP.machineHall.map(function (h) {
      return '<div class="hall__item">' +
               '<img src="' + esc(h.img) + '" alt="' + esc(h.alt) + '" loading="lazy" decoding="async">' +
             '</div>';
    }).join(''));
  };
})();
