/* =============================================================
   forms.js - Ash & Oak site forms
   Every form posts to FormSubmit (formsubmit.co), which emails the
   submission to ben@ashandoaktree.com. Free, no account, unlimited.
   Attachments are capped at 10MB total per submission, which is why
   quote-form.js shrinks photos before sending.

   LIVE stays false until FormSubmit is activated: the first real
   submission makes FormSubmit email an activation link to ben@, and
   until someone clicks it, visitors would land on FormSubmit's
   "activate this form" page. While LIVE is false, every form shows
   the call-or-text message instead of submitting.
   ============================================================= */

(function () {
  'use strict';

  var LIVE = false;
  var FALLBACK = 'Online requests are not open yet. Call or text Ben at (435) 258-9679 and he will get back to you.';

  window.ASH_FORMS = { live: LIVE, fallback: FALLBACK };

  // The consult form has its own handler (photos, validation) in quote-form.js.
  var forms = document.querySelectorAll('form[action*="formsubmit.co"]:not(#quoteForm)');

  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener('submit', function (e) {
      if (LIVE) {
        // Some forms carry novalidate; still block an empty or malformed send.
        if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); return; }
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
        return; // let the browser POST to FormSubmit, which redirects to _next
      }
      e.preventDefault();
      var box = form.querySelector('.form-error') ||
        (form.previousElementSibling && form.previousElementSibling.classList.contains('form-error') ? form.previousElementSibling : null);
      if (!box) {
        box = document.createElement('div');
        box.className = 'form-error';
        box.setAttribute('role', 'alert');
        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.parentNode.insertBefore(box, submitBtn);
      }
      box.textContent = FALLBACK;
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
})();
