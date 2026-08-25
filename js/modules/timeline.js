/* ============================================================
   ViPrint — Timeline interaktive (historiku real i kompanisë)
   ============================================================ */
(function () {
  'use strict';
  window.VP = window.VP || {};

  VP.initTimeline = function () {
    var rail  = document.querySelector('[data-tl-rail]');
    var panel = document.querySelector('[data-tl-panel]');
    if (!rail || !panel || !VP.timeline) return;

    var items = VP.timeline;
    var esc = VP.esc;
    var active = items.length - 1;   // hap te arritja më e re

    /* --- Rail --- */
    rail.innerHTML = '<div class="tl__track" role="tablist" aria-label="Historiku i ViPrint">' +
      items.map(function (it, i) {
        return '<button class="tl__node" role="tab" type="button" data-i="' + i + '"' +
               ' aria-selected="' + (i === active) + '" tabindex="' + (i === active ? 0 : -1) + '">' +
                 '<span class="tl__dot" aria-hidden="true"></span>' +
                 '<span class="tl__year">' + esc(it.year) + '</span>' +
                 '<span class="tl__when">' + esc(it.date) + '</span>' +
               '</button>';
      }).join('') + '</div>';

    var nodes = Array.prototype.slice.call(rail.querySelectorAll('.tl__node'));

    /* --- Panel --- */
    function paint(i) {
      var it = items[i];
      var media = it.img
        ? '<div class="tl__panel-media"><img src="' + esc(it.img) + '" alt="' + esc(it.title) + '" loading="lazy" decoding="async"></div>'
        : '<div class="tl__panel-media tl__panel-media--empty"><span class="tl__stamp">' + esc(it.year) + '</span></div>';

      panel.innerHTML =
        '<div class="tl__panel-body tl-fade">' +
          '<span class="tl__badge">' + esc(it.tag) + '</span>' +
          '<h3 class="tl__panel-title">' + esc(it.title) + '</h3>' +
          '<p class="tl__panel-text">' + esc(it.text) + '</p>' +
          '<p class="tag" style="margin-top:.35rem">' + esc(it.date) + '</p>' +
        '</div>' + media;
    }

    function select(i, focus) {
      if (i < 0 || i >= items.length) return;
      active = i;
      nodes.forEach(function (n, k) {
        n.setAttribute('aria-selected', String(k === i));
        n.setAttribute('tabindex', k === i ? '0' : '-1');
      });
      paint(i);
      if (focus) nodes[i].focus();

      // mbaj nyjën aktive në pamje brenda rail-it
      var n = nodes[i];
      var left = n.offsetLeft - rail.clientWidth / 2 + n.offsetWidth / 2;
      rail.scrollTo({ left: Math.max(left, 0), behavior: 'smooth' });
    }

    rail.addEventListener('click', function (e) {
      var btn = e.target.closest('.tl__node');
      if (btn) select(parseInt(btn.dataset.i, 10), false);
    });

    rail.addEventListener('keydown', function (e) {
      var map = { ArrowLeft: -1, ArrowRight: 1 };
      if (map[e.key]) { e.preventDefault(); select(active + map[e.key], true); }
      else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
      else if (e.key === 'End')  { e.preventDefault(); select(items.length - 1, true); }
    });

    paint(active);
    // pozicionoje rail-in pa animacion në ngarkim
    requestAnimationFrame(function () {
      var n = nodes[active];
      if (n) rail.scrollLeft = Math.max(n.offsetLeft - rail.clientWidth / 2 + n.offsetWidth / 2, 0);
    });
  };
})();
