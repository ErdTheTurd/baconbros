(function () {
  'use strict';

  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('http')) return;

    var linkPath = href.replace(/\/$/, '') || '/';
    if (linkPath === currentPath || (currentPath.endsWith('.html') && linkPath.endsWith(currentPath.split('/').pop()))) {
      link.classList.add('active');
    }
  });

  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      var successEl = document.getElementById('form-success');
      if (successEl) {
        setTimeout(function () {
          if (window.location.search.indexOf('_success') !== -1) {
            successEl.classList.add('visible');
            contactForm.reset();
          }
        }, 100);
      }
    });

    if (window.location.search.indexOf('_success') !== -1) {
      var successBanner = document.getElementById('form-success');
      if (successBanner) {
        successBanner.classList.add('visible');
      }
    }
  }
})();
