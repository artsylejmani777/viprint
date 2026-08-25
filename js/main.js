/* ============================================================
   ViPrint — Pika e nisjes
   Renditja e <script> në index.html: data/*.js → js/modules/*.js → js/main.js
   ============================================================ */
(function () {
  'use strict';

  function boot() {
    var VP = window.VP;
    if (!VP) { console.error('[ViPrint] Të dhënat nuk u ngarkuan.'); return; }

    // 1) Përmbajtja dinamike (nga /data)
    VP.renderMarquee();
    VP.renderStats();
    VP.renderBrands();
    VP.renderServices();
    VP.renderWhy();
    VP.renderTestimonials();
    VP.renderMachines();
    VP.initTimeline();
    VP.initProducts();
    VP.initProcess();

    // 2) Sjellja
    VP.initNav();
    VP.initForm();
    VP.initVideo();

    // 3) Animacionet (pas renderimit, që t'i kapin nyjat e reja)
    VP.stagger('[data-stats]', 90);
    VP.initReveal();
    VP.initCounters();

    // Viti aktual në footer
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    document.documentElement.classList.add('is-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
