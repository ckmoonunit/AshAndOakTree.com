/* site.js - shared site behavior: mobile menu, footer year */
(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var hamburger = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  if (hamburger && menu) {
    hamburger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

/* On the job: slide each photo row in from its side as it scrolls into view */
(function () {
  var rows = document.querySelectorAll('.cascade-row');
  if (!rows.length || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('cascade-anim');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  Array.prototype.forEach.call(rows, function (r) { io.observe(r); });
})();
