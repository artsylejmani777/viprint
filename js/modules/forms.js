/* ============================================================
   ViPrint — Formulari i kontaktit + lightbox video
   ============================================================ */
(function () {
  'use strict';
  window.VP = window.VP || {};

  /* ---------------- Formulari ---------------- */
  VP.initForm = function () {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var status = form.querySelector('[data-form-status]');

    function fieldOf(input) { return input.closest('.field'); }

    function validate() {
      var ok = true;
      form.querySelectorAll('input[required], textarea[required]').forEach(function (input) {
        var f = fieldOf(input);
        var valid = input.checkValidity() && input.value.trim().length > 0;
        if (f) f.classList.toggle('has-err', !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });
      return ok;
    }

    form.addEventListener('input', function (e) {
      var f = fieldOf(e.target);
      if (f && f.classList.contains('has-err') && e.target.checkValidity() && e.target.value.trim()) {
        f.classList.remove('has-err');
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var d = new FormData(form);
      var name    = (d.get('name')    || '').toString().trim();
      var email   = (d.get('email')   || '').toString().trim();
      var phone   = (d.get('phone')   || '').toString().trim();
      var subject = (d.get('subject') || 'Kërkesë për ofertë').toString().trim();
      var message = (d.get('message') || '').toString().trim();

      // Nuk ka backend: hapim klientin e emailit me të dhënat e plotësuara.
      var body = [
        'Emri: ' + name,
        'Email: ' + email,
        phone ? 'Telefoni: ' + phone : null,
        'Shërbimi: ' + subject,
        '',
        message
      ].filter(Boolean).join('\n');

      var href = 'mailto:' + VP.company.contact.email +
                 '?subject=' + encodeURIComponent('[Web] ' + subject + ' — ' + name) +
                 '&body=' + encodeURIComponent(body);

      window.location.href = href;

      if (status) {
        status.textContent = 'Faleminderit, ' + (name.split(' ')[0] || '') +
          '! Po hapet klienti i emailit me mesazhin tuaj drejtuar ' + VP.company.contact.email +
          '. Nëse nuk hapet, shkruajini drejtpërdrejt në ' + VP.company.contact.email + '.';
        status.classList.add('is-shown');
      }
    });
  };

  /* ---------------- Lightbox video ---------------- */
  VP.initVideo = function () {
    var modal = document.querySelector('[data-video-modal]');
    if (!modal) return;

    var holder = modal.querySelector('[data-video-holder]');
    var lastFocus = null;

    function open(id, title) {
      holder.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
        '?autoplay=1&rel=0&modestbranding=1" title="' + VP.esc(title || 'ViPrint') +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      lastFocus = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      modal.querySelector('.modal__close').focus();
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      holder.innerHTML = '';            // ndal riprodhimin
      if (lastFocus) lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-video]');
      if (trigger) {
        e.preventDefault();
        open(trigger.dataset.video, trigger.dataset.videoTitle);
        return;
      }
      if (e.target.closest('[data-video-modal] [data-modal-close]') ||
          e.target.classList.contains('modal__scrim')) {
        if (modal.classList.contains('is-open')) close();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  };
})();
