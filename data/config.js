/**
 * ViPrint — Konfigurimi i faqes
 * Ky është i vetmi skedar që duhet ndryshuar për të aktivizuar dërgimin e emailit.
 */
window.VP = window.VP || {};

VP.config = {
  /**
   * ID-ja e formularit në Formspree.
   *
   * SI TA MARRËSH (falas, ~1 minutë):
   *   1. Hyr në https://formspree.io  →  Sign up (me info@vi-print.com).
   *   2. "+ New Form"  →  emri: "ViPrint Website"  →  Create.
   *   3. Kopjo endpoint-in që të shfaqet, p.sh.  https://formspree.io/f/xldwpbkq
   *   4. Ngjit VETËM pjesën e fundit (kodin) më poshtë, mes thonjëzave.
   *
   * Shembull:  formspreeId: 'xldwpbkq'
   *
   * Nëse lihet bosh, formulari kthehet automatikisht në metodën "mailto"
   * (hap klientin e emailit të vizitorit) — faqja punon në çdo rast.
   */
  formspreeId: '',

  /** Ku shkojnë mesazhet kur përdoret metoda mailto. */
  fallbackEmail: 'info@vi-print.com'
};
