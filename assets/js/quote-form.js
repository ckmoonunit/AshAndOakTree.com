/* =============================================================
   quote-form.js - Ash & Oak quote page
   - File previews with individual remove
   - 8-photo limit, 10MB-per-photo limit
   - Drag-and-drop on desktop, capture on mobile
   - Client-side validation
   - Formspree POST with multipart, fallback messaging
   ============================================================= */

(function () {
  'use strict';

  var form = document.getElementById('quoteForm');
  if (!form) return;

  var fileInput = document.getElementById('photos');
  var dropzone = document.getElementById('dropzone');
  var thumbsEl = document.getElementById('thumbs');
  var errorEl = document.getElementById('formError');
  var submitBtn = document.getElementById('submitBtn');
  var emailInput = document.getElementById('email');
  var replyToHidden = document.getElementById('replyToHidden');

  var MAX_FILES = 8;
  var MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  var selectedFiles = [];

  function showError(msg) {
    errorEl.textContent = msg;
    if (msg) errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearError() {
    errorEl.textContent = '';
  }

  function renderThumbs() {
    thumbsEl.innerHTML = '';
    selectedFiles.forEach(function (file, idx) {
      var wrap = document.createElement('div');
      wrap.className = 'thumb';

      var img = document.createElement('img');
      img.alt = 'Photo preview ' + (idx + 1);
      var reader = new FileReader();
      reader.onload = function (e) { img.src = e.target.result; };
      reader.readAsDataURL(file);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Remove photo ' + (idx + 1));
      btn.innerHTML = '&times;';
      btn.addEventListener('click', function () {
        selectedFiles.splice(idx, 1);
        syncFileInput();
        renderThumbs();
      });

      wrap.appendChild(img);
      wrap.appendChild(btn);
      thumbsEl.appendChild(wrap);
    });
  }

  function syncFileInput() {
    // Rebuild a DataTransfer so the file input mirrors selectedFiles
    if (typeof DataTransfer === 'undefined') return;
    var dt = new DataTransfer();
    selectedFiles.forEach(function (f) { dt.items.add(f); });
    fileInput.files = dt.files;
  }

  function addFiles(fileList) {
    clearError();
    var incoming = Array.prototype.slice.call(fileList);
    var rejected = [];

    incoming.forEach(function (file) {
      if (!file.type || file.type.indexOf('image/') !== 0) {
        rejected.push(file.name + ' (not an image)');
        return;
      }
      if (file.size > MAX_SIZE) {
        rejected.push(file.name + ' (over 10MB)');
        return;
      }
      if (selectedFiles.length >= MAX_FILES) {
        rejected.push(file.name + ' (limit ' + MAX_FILES + ' photos)');
        return;
      }
      selectedFiles.push(file);
    });

    syncFileInput();
    renderThumbs();

    if (rejected.length) {
      showError('Some photos were skipped: ' + rejected.join(', '));
    }
  }

  fileInput.addEventListener('change', function (e) {
    addFiles(e.target.files);
  });

  // Drag and drop
  ['dragenter', 'dragover'].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag');
    });
  });

  ['dragleave', 'drop'].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag');
    });
  });

  dropzone.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  });

  // Mirror email into hidden _replyto for Formspree
  if (emailInput && replyToHidden) {
    emailInput.addEventListener('input', function () {
      replyToHidden.value = emailInput.value;
    });
  }

  // Client-side validation
  function validate() {
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var address = form.address.value.trim();
    var details = form.details.value.trim();
    var bestTime = form.querySelector('input[name="best_time"]:checked');

    if (!name)    return 'Please add your name.';
    if (!phone)   return 'Please add a phone number so we can reach you.';
    if (!address) return 'Please add a property address (city is fine if the street is fuzzy).';
    if (details.length < 20) return 'A couple more sentences please. Twenty characters minimum so we know what we are walking into.';
    if (!bestTime) return 'Pick a best time to reach you.';
    return null;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    var msg = validate();
    if (msg) { showError(msg); return; }

    // Bail if Formspree form ID hasn't been set yet (placeholder check)
    if (form.action.indexOf('REPLACE_ME') !== -1) {
      showError('Form is not wired up yet. Call or text (801) 541-8457 and we will get back to you.');
      return;
    }

    submitBtn.disabled = true;
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';

    var data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          window.location.href = 'request-quote-thanks.html';
        } else {
          return res.json().then(function (body) {
            var detail = (body && body.errors && body.errors.length) ? body.errors.map(function (x) { return x.message; }).join(', ') : 'Something went sideways on submit.';
            throw new Error(detail);
          });
        }
      })
      .catch(function (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
        showError(err.message + ' Or call / text (801) 541-8457.');
      });
  });
})();
