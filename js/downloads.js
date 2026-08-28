(function () {
  'use strict';

  function getAbsoluteUrl(relativePath) {
    return new URL(relativePath, window.location.href).href;
  }

  function showToast(message) {
    var existing = document.querySelector('.copy-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('visible');
    });

    setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () {
        showToast('Copied to clipboard');
      });
    }

    var input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'absolute';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    showToast('Copied to clipboard');
    return Promise.resolve();
  }

  function copyImageFromUrl(url) {
    if (!navigator.clipboard || !window.ClipboardItem) {
      showToast('Copy image not supported in this browser — use Download instead');
      return Promise.resolve();
    }

    return fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error('fetch failed');
        return response.blob();
      })
      .then(function (blob) {
        return navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
      })
      .then(function () {
        showToast('Image copied to clipboard');
      })
      .catch(function () {
        showToast('Could not copy image — try Download or Open Full Size');
      });
  }

  document.querySelectorAll('[data-copy-text]').forEach(function (button) {
    button.addEventListener('click', function () {
      var text = button.getAttribute('data-copy-text');
      if (text) copyText(text);
    });
  });

  document.querySelectorAll('[data-copy-url]').forEach(function (button) {
    button.addEventListener('click', function () {
      var path = button.getAttribute('data-copy-url');
      if (path) copyText(getAbsoluteUrl(path));
    });
  });

  document.querySelectorAll('[data-copy-image]').forEach(function (button) {
    button.addEventListener('click', function () {
      var path = button.getAttribute('data-copy-image');
      if (path) copyImageFromUrl(getAbsoluteUrl(path));
    });
  });

  document.querySelectorAll('[data-copy-all-links]').forEach(function (button) {
    button.addEventListener('click', function () {
      var container = document.querySelector(button.getAttribute('data-copy-all-links'));
      if (!container) return;

      var lines = [];
      container.querySelectorAll('[data-asset-url]').forEach(function (el) {
        var label = el.getAttribute('data-asset-label') || 'Asset';
        var url = getAbsoluteUrl(el.getAttribute('data-asset-url'));
        lines.push(label + ': ' + url);
      });

      copyText(lines.join('\n'));
    });
  });

  var lightbox = document.getElementById('asset-lightbox');
  if (lightbox) {
    var lightboxImage = lightbox.querySelector('.lightbox-image');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    var closeBtn = lightbox.querySelector('.lightbox-close');

    function openLightbox(src, caption) {
      lightboxImage.src = src;
      lightboxImage.alt = caption || 'Property map';
      if (lightboxCaption) lightboxCaption.textContent = caption || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImage.src = '';
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-lightbox]').forEach(function (button) {
      button.addEventListener('click', function () {
        var path = button.getAttribute('data-lightbox');
        var caption = button.getAttribute('data-lightbox-caption') || '';
        if (path) openLightbox(getAbsoluteUrl(path), caption);
      });
    });

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }
})();
