/* ============================================================
   ViPrint — Navbar: sticky, drawer mobil, link aktiv, progress
   ============================================================ */
(function () {
  'use strict';
  window.VP = window.VP || {};

  VP.initNav = function () {
    var nav      = document.querySelector('.nav');
    var burger   = document.querySelector('.burger');
    var drawer   = document.querySelector('.drawer');
    var progress = document.querySelector('.progress');
    var links    = Array.prototype.slice.call(document.querySelectorAll('[data-nav-link]'));
    if (!nav) return;

    /* ---------- Sticky / solid state + progress ---------- */
    var lastY = window.scrollY;
    var ticking = false;

    function onScroll() {
      var y = window.scrollY;

      // Solid chrome once we leave the hero
      var hero = document.querySelector('.hero');
      var threshold = hero ? hero.offsetHeight - 120 : 80;
      nav.classList.toggle('is-solid', y > threshold);

      // Hide on scroll-down, reveal on scroll-up (only past the hero)
      if (y > threshold + 160) {
        nav.classList.toggle('is-hidden', y > lastY + 4 && !drawer.classList.contains('is-open'));
      } else {
        nav.classList.remove('is-hidden');
      }
      lastY = y;

      // Reading progress
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    /* ---------- Mobile drawer ---------- */
    function setDrawer(open) {
      if (!drawer || !burger) return;
      drawer.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('is-locked', open);
      if (open) nav.classList.remove('is-hidden');
    }

    if (burger) {
      burger.addEventListener('click', function () {
        setDrawer(!drawer.classList.contains('is-open'));
      });
    }
    if (drawer) {
      drawer.addEventListener('click', function (e) {
        if (e.target.closest('a')) setDrawer(false);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setDrawer(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1060) setDrawer(false);
    });

    /* ---------- Active section highlight ---------- */
    var sections = links
      .map(function (a) {
        var id = (a.getAttribute('href') || '').replace('#', '');
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);

    if (!sections.length || !('IntersectionObserver' in window)) return;

    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });

      var bestId = null, best = 0;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] > best) { best = visible[id]; bestId = id; }
      });

      links.forEach(function (a) {
        var on = bestId && a.getAttribute('href') === '#' + bestId;
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] });

    sections.forEach(function (s) { io.observe(s); });
  };
})();
