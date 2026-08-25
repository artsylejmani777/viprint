/* ============================================================
   ViPrint — Ikonat (SVG inline, pa varësi të jashtme)
   ============================================================ */
(function () {
  'use strict';
  window.VP = window.VP || {};

  var s = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

  VP.icons = {
    arrowRight: '<svg ' + s + '><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    arrowDown:  '<svg ' + s + '><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    plus:       '<svg ' + s + '><path d="M12 5v14M5 12h14"/></svg>',
    close:      '<svg ' + s + '><path d="M18 6 6 18M6 6l12 12"/></svg>',
    chevronL:   '<svg ' + s + '><path d="M15 18l-6-6 6-6"/></svg>',
    chevronR:   '<svg ' + s + '><path d="M9 18l6-6-6-6"/></svg>',
    play:       '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6L19 12z"/></svg>',

    /* Why ViPrint — vija të hollë, pa "icon topper" dekorativ */
    quality:     '<svg ' + s + '><path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 16.8 6.6 19.6l1.2-6L3.3 9.4l6.1-.8z"/></svg>',
    experience:  '<svg ' + s + '><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/></svg>',
    technology:  '<svg ' + s + '><rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M9 9h6v6H9zM9 2.5V4M15 2.5V4M9 20v1.5M15 20v1.5M2.5 9H4M2.5 15H4M20 9h1.5M20 15h1.5"/></svg>',
    reliability: '<svg ' + s + '><path d="M12 3l7.5 3v6c0 4.4-3 8-7.5 9-4.5-1-7.5-4.6-7.5-9V6z"/><path d="M8.8 12.2l2.2 2.2 4.2-4.4"/></svg>',
    service:     '<svg ' + s + '><path d="M20.5 12a8.5 8.5 0 1 0-3.3 6.7L20.5 20l-1-3.1"/><path d="M9 10.5h6M9 14h4"/></svg>',
    onestop:     '<svg ' + s + '><path d="M3.5 8.5 12 4l8.5 4.5-8.5 4.5z"/><path d="M3.5 12.5 12 17l8.5-4.5M3.5 16 12 20.5l8.5-4.5"/></svg>',

    pin:   '<svg ' + s + '><path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    phone: '<svg ' + s + '><path d="M6.2 3.5h3l1.5 4-2 1.4a11 11 0 0 0 5.4 5.4l1.4-2 4 1.5v3c0 .9-.7 1.7-1.7 1.7C11 18.5 5.5 13 5.5 5.2c0-.9.8-1.7 1.7-1.7z"/></svg>',
    mail:  '<svg ' + s + '><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.8 6.8 8.2 5.7 8.2-5.7"/></svg>',
    globe: '<svg ' + s + '><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.2 2.4 3.4 5.4 3.4 8.5s-1.2 6.1-3.4 8.5c-2.2-2.4-3.4-5.4-3.4-8.5s1.2-6.1 3.4-8.5z"/></svg>'
  };
})();
