/* ============================================================
   ViPrint — Procesi i prodhimit: "udhëtim nëpër fabrikë"
   Stage sticky + hapa që aktivizohen sipas scroll-it.
   ============================================================ */
(function () {
  'use strict';
  window.VP = window.VP || {};

  VP.initProcess = function () {
    var stepsEl = document.querySelector('[data-proc-steps]');
    var stageEl = document.querySelector('[data-proc-stage]');
    var capEl   = document.querySelector('[data-proc-cap]');
    var progEl  = document.querySelector('[data-proc-progress]');
    if (!stepsEl || !VP.processSteps) return;

    var esc  = VP.esc;
    var list = VP.processSteps;

    /* ---------- Hapat ---------- */
    stepsEl.innerHTML =
      '<span class="proc__progress" data-proc-progress></span>' +
      list.map(function (s, i) {
        return '<article class="proc-step reveal" data-step="' + i + '" style="--reveal-delay:' + (i * 40) + 'ms">' +
          '<span class="proc-step__bullet" aria-hidden="true"></span>' +
          '<div class="proc-step__head">' +
            '<span class="proc-step__n">' + esc(s.n) + '</span>' +
            '<h3 class="proc-step__title">' + esc(s.title) + '</h3>' +
          '</div>' +
          '<span class="proc-step__al">' + esc(s.titleAl) + '</span>' +
          '<p class="proc-step__text">' + esc(s.text) + '</p>' +
          '<span class="proc-step__meta">' + esc(s.meta) + '</span>' +
          '<div class="proc-step__img"><img src="' + esc(s.img) + '" alt="' + esc(s.titleAl) + ' — ViPrint" loading="lazy" decoding="async"></div>' +
        '</article>';
      }).join('');

    progEl = stepsEl.querySelector('[data-proc-progress]');

    /* ---------- Stage (vetëm desktop) ---------- */
    if (stageEl) {
      stageEl.innerHTML = list.map(function (s, i) {
        return '<div class="proc__stage-img' + (i === 0 ? ' is-active' : '') + '" data-stage="' + i + '">' +
                 '<img src="' + esc(s.img) + '" alt="' + esc(s.titleAl) + ' — ViPrint" loading="lazy" decoding="async">' +
               '</div>';
      }).join('') +
      '<div class="proc__stage-cap" data-proc-cap>' +
        '<span>' + esc(list[0].n) + ' · ' + esc(list[0].titleAl) + '</span>' +
        '<b>' + esc(list[0].title) + '</b>' +
      '</div>';
      capEl = stageEl.querySelector('[data-proc-cap]');
    }

    var stepNodes  = Array.prototype.slice.call(stepsEl.querySelectorAll('.proc-step'));
    var stageNodes = stageEl ? Array.prototype.slice.call(stageEl.querySelectorAll('.proc__stage-img')) : [];
    var current = -1;

    function setActive(i) {
      if (i === current || i < 0 || i >= list.length) return;
      current = i;

      stepNodes.forEach(function (n, k) { n.classList.toggle('is-active', k === i); });
      stageNodes.forEach(function (n, k) { n.classList.toggle('is-active', k === i); });

      if (capEl) {
        var s = list[i];
        capEl.innerHTML = '<span>' + esc(s.n) + ' · ' + esc(s.titleAl) + '</span><b>' + esc(s.title) + '</b>';
      }
    }

    /* ---------- Aktivizimi sipas scroll-it ---------- */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        // zgjidh hapin më të dukshëm
        var best = null, ratio = 0;
        entries.forEach(function (en) {
          if (en.isIntersecting && en.intersectionRatio > ratio) { ratio = en.intersectionRatio; best = en.target; }
        });
        if (best) setActive(parseInt(best.dataset.step, 10));
      }, { rootMargin: '-38% 0px -38% 0px', threshold: [0, 0.4, 1] });

      stepNodes.forEach(function (n) { io.observe(n); });
    }
    setActive(0);

    /* ---------- Vija e progresit ---------- */
    if (progEl) {
      var ticking = false;
      function updateProgress() {
        var rect = stepsEl.getBoundingClientRect();
        var vh = window.innerHeight;
        var total = rect.height;
        // sa e ka kaluar mesi i ekranit brenda listës së hapave
        var passed = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
        progEl.style.height = passed + 'px';
        ticking = false;
      }
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
      }, { passive: true });
      window.addEventListener('resize', updateProgress);
      updateProgress();
    }
  };
})();
