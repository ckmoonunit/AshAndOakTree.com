/* =============================================================
   quote-form.js - Ash & Oak quote page
   - File previews with individual remove
   - 8-photo limit, 25MB-per-photo intake limit
   - Drag-and-drop on desktop, capture on mobile
   - Client-side validation
   - Photos shrunk in the browser before sending (FormSubmit caps a
     submission at 10MB total; this also strips GPS/EXIF)
   - Native multipart POST to FormSubmit (see forms.js for the LIVE switch)
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
  var MAX_SIZE = 25 * 1024 * 1024;     // intake limit per photo, before shrinking
  var MAX_TOTAL = 9.5 * 1024 * 1024;   // FormSubmit hard cap is 10MB per submission
  var MAX_EDGE = 1600;                 // px, long edge after shrinking
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
        rejected.push(file.name + ' (over 25MB)');
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

  // Mirror email into hidden _replyto so Ben can hit Reply
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
    if (details.length < 20) return 'Please add a little more about the work (at least 20 characters).';
    if (!bestTime) return 'Please choose a best time to reach you.';
    return null;
  }

  // Re-encode a photo as a JPEG no larger than MAX_EDGE on its long side.
  // Drawing to a canvas drops EXIF, so customer GPS never reaches the inbox.
  function shrink(file) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(function (blob) {
          if (!blob) return resolve(file);
          var name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
          resolve(new File([blob], name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.82);
      };
      // Browser cannot decode it (e.g. HEIC outside Safari): send the original.
      img.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  function shrinkAll(files) {
    return Promise.all(files.map(shrink));
  }

  // One file per input: FormSubmit attaches every file input it receives.
  function attachFiles(files) {
    fileInput.removeAttribute('name'); // originals stay out of the POST
    Array.prototype.forEach.call(form.querySelectorAll('input[data-attach]'), function (el) { el.remove(); });
    files.forEach(function (f, i) {
      var input = document.createElement('input');
      input.type = 'file';
      input.name = 'photo_' + (i + 1);
      input.hidden = true;
      input.setAttribute('data-attach', '');
      var dt = new DataTransfer();
      dt.items.add(f);
      input.files = dt.files;
      form.appendChild(input);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    var msg = validate();
    if (msg) { showError(msg); return; }

    // Not live until FormSubmit is activated (forms.js)
    var cfg = window.ASH_FORMS || { live: false, fallback: '' };
    if (!cfg.live) {
      showError(cfg.fallback);
      return;
    }

    submitBtn.disabled = true;
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = selectedFiles.length ? 'Preparing photos...' : 'Sending...';

    shrinkAll(selectedFiles)
      .then(function (files) {
        var total = files.reduce(function (sum, f) { return sum + f.size; }, 0);
        if (total > MAX_TOTAL) {
          throw new Error('Those photos are too large to send together. Remove a few and try again.');
        }
        attachFiles(files);
        submitBtn.textContent = 'Sending...';
        // Native submit: bypasses this listener, POSTs multipart, FormSubmit redirects to _next.
        HTMLFormElement.prototype.submit.call(form);
      })
      .catch(function (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
        showError(err.message + ' Or call or text Ben at (435) 258-9679.');
      });
  });
})();
