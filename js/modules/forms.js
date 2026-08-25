/* ============================================================
   ViPrint — Formulari i kontaktit + lightbox video

   Formulari punon në dy mënyra:
     A) Formspree (dërgim i vërtetë me AJAX) — kur VP.config.formspreeId është plotësuar
     B) mailto (fallback) — hap klientin e emailit të vizitorit
   Shih data/config.js
   ============================================================ */
(function () {
  'use strict';
  window.VP = window.VP || {};

  /* ---------------- Formulari ---------------- */
  VP.initForm = function () {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var cfg      = VP.config || {};
    var formId   = (cfg.formspreeId || '').trim();
    var mailTo   = cfg.fallbackEmail || (VP.company && VP.company.contact.email) || 'info@vi-print.com';
    var status   = form.querySelector('[data-form-status]');
    var noteEl   = form.querySelector('[data-form-note]');
    var submitEl = form.querySelector('button[type="submit"]');
    var submitTxt = submitEl ? submitEl.innerHTML : '';

    /* Shënimi nën butonin — i saktë për mënyrën aktive */
    if (noteEl) {
      noteEl.innerHTML = formId
        ? 'Mesazhi dërgohet drejtpërdrejt në <strong>' + VP.esc(mailTo) + '</strong>. ' +
          'Përgjigjemi brenda një dite pune.'
        : 'Formulari hap klientin tuaj të emailit me të dhënat e plotësuara drejtuar ' +
          '<strong>' + VP.esc(mailTo) + '</strong>. Për dërgim automatik, plotësoni ' +
          '<code>formspreeId</code> në <code>data/config.js</code> — udhëzimet janë brenda skedarit.';
    }

    function fieldOf(input) { return input.closest('.field'); }

    function say(msg, isErr) {
      if (!status) return;
      status.innerHTML = msg;
      status.classList.toggle('form__status--err', !!isErr);
      status.classList.add('is-shown');
    }

    function busy(on) {
      if (!submitEl) return;
      submitEl.disabled = on;
      submitEl.innerHTML = on ? 'Duke dërguar…' : submitTxt;
    }

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

    function payload() {
      var d = new FormData(form);
      return {
        name:    (d.get('name')    || '').toString().trim(),
        email:   (d.get('email')   || '').toString().trim(),
        phone:   (d.get('phone')   || '').toString().trim(),
        subject: (d.get('subject') || 'Kërkesë për ofertë').toString().trim(),
        message: (d.get('message') || '').toString().trim(),
        _gotcha: (d.get('_gotcha') || '').toString()   // kurth anti-spam
      };
    }

    /* ---- B) Fallback: mailto ---- */
    function sendViaMailto(p) {
      var body = [
        'Emri: ' + p.name,
        'Email: ' + p.email,
        p.phone ? 'Telefoni: ' + p.phone : null,
        'Shërbimi: ' + p.subject,
        '',
        p.message
      ].filter(Boolean).join('\n');

      window.location.href = 'mailto:' + mailTo +
        '?subject=' + encodeURIComponent('[Web] ' + p.subject + ' — ' + p.name) +
        '&body=' + encodeURIComponent(body);

      say('Faleminderit, ' + VP.esc(p.name.split(' ')[0] || '') +
          '! Po hapet klienti i emailit me mesazhin tuaj. Nëse nuk hapet, shkruajini në <strong>' +
          VP.esc(mailTo) + '</strong>.');
    }

    /* ---- A) Formspree ---- */
    function sendViaFormspree(p) {
      busy(true);
      if (status) status.classList.remove('is-shown');

      fetch('https://formspree.io/f/' + encodeURIComponent(formId), {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; })
            .then(function (json) { return { ok: res.ok, json: json }; });
        })
        .then(function (r) {
          busy(false);
          if (r.ok) {
            form.reset();
            say('Faleminderit, ' + VP.esc(p.name.split(' ')[0] || '') +
                '! Mesazhi u dërgua me sukses. Do t\'ju kontaktojmë së shpejti.');
            return;
          }
          var msg = (r.json && r.json.errors && r.json.errors.length)
            ? r.json.errors.map(function (e) { return VP.esc(e.message); }).join(' ')
            : 'Dërgimi nuk u realizua.';
          say(msg + ' Provoni përsëri, ose shkruajini drejtpërdrejt në <strong>' +
              VP.esc(mailTo) + '</strong>.', true);
        })
        .catch(function () {
          busy(false);
          say('Nuk arritëm të lidhemi me serverin. Kontrolloni internetin, ose shkruajini në <strong>' +
              VP.esc(mailTo) + '</strong>.', true);
        });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var p = payload();
      if (p._gotcha) return;                 // bot
      if (formId) sendViaFormspree(p);
      else        sendViaMailto(p);
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
