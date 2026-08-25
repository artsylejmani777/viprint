/* ============================================================
   ViPrint — Animacione në scroll (reveal) + numëratorë
   Të lehta: vetëm IntersectionObserver, pa libraritë e jashtme.
   ============================================================ */
(function () {
  'use strict';
  window.VP = window.VP || {};

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  VP.initReveal = function (root) {
    root = root || document;
    var els = root.querySelectorAll('.reveal, .reveal-mask, .reveal-img');
    if (!els.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    els.forEach(function (el) {
      if (el.classList.contains('is-in')) return;
      io.observe(el);
    });
  };

  /* Stagger: vendos --reveal-delay për fëmijët e një kontejneri */
  VP.stagger = function (selector, step) {
    step = step || 70;
    document.querySelectorAll(selector).forEach(function (parent) {
      Array.prototype.forEach.call(parent.children, function (child, i) {
        child.style.setProperty('--reveal-delay', (i * step) + 'ms');
      });
    });
  };

  /* Numëratorë për statistikat numerike (1981, 64, 11+ …) */
  VP.initCounters = function () {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;

    function run(el) {
      var raw    = el.getAttribute('data-count');
      var num    = parseFloat(raw);
      var suffix = raw.replace(/^[\d.]+/, '');
      if (isNaN(num)) { el.textContent = raw; return; }
      if (reduced) { el.textContent = raw; return; }

      var dur = 1250, t0 = null;
      function frame(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(num * eased) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        run(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.5 });

    nodes.forEach(function (el) { io.observe(el); });
  };
})();
