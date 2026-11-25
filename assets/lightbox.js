/* Tap an image or clip on a project page to view it full screen.
   Swipe or use arrows to move between items; tap outside, press Esc, or tap the X to close. */
(function () {
  var SEL = '.gallery figure, .hero-pair figure, .hero-fig, .inline-fig';
  var figs = Array.prototype.slice.call(document.querySelectorAll(SEL))
    .filter(function (f) { return f.querySelector('img, video'); });
  if (!figs.length) return;

  var box = document.createElement('div');
  box.className = 'lb';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Image viewer');
  box.innerHTML =
    '<div class="lb-card">' +
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<div class="lb-stage"></div>' +
      '<div class="lb-bar">' +
        '<button class="lb-prev" aria-label="Previous">&#8249;</button>' +
        '<p class="lb-cap"></p>' +
        '<span class="lb-count"></span>' +
        '<button class="lb-next" aria-label="Next">&#8250;</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(box);
  var stage = box.querySelector('.lb-stage');
  var cap = box.querySelector('.lb-cap');
  var idx = 0;
  var lastFocus = null;

  function show(i) {
    idx = (i + figs.length) % figs.length;
    var f = figs[idx];
    var media = f.querySelector('img, video');
    var el;
    if (media.tagName === 'VIDEO') {
      el = document.createElement('video');
      el.src = media.currentSrc || media.getAttribute('src') || (media.querySelector('source') || {}).src;
      if (media.poster) el.poster = media.poster;
      el.autoplay = true; el.loop = true; el.muted = true; el.playsInline = true;
      el.setAttribute('playsinline', '');
    } else {
      el = document.createElement('img');
      el.src = media.currentSrc || media.src;
      el.alt = media.alt || '';
    }
    stage.innerHTML = '';
    stage.appendChild(el);
    var c = f.querySelector('figcaption');
    cap.textContent = c ? c.textContent : '';
    box.querySelector('.lb-count').textContent = figs.length > 1 ? (idx + 1) + ' / ' + figs.length : '';
    var multi = figs.length > 1;
    box.querySelector('.lb-prev').style.display = multi ? '' : 'none';
    box.querySelector('.lb-next').style.display = multi ? '' : 'none';
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add('open');
    document.documentElement.classList.add('lb-lock');
    box.querySelector('.lb-close').focus();
  }

  function close() {
    box.classList.remove('open');
    document.documentElement.classList.remove('lb-lock');
    stage.innerHTML = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  figs.forEach(function (f, i) {
    var m = f.querySelector('img, video');
    m.classList.add('zoomable');
    m.setAttribute('tabindex', '0');
    m.setAttribute('role', 'button');
    m.setAttribute('aria-label', 'View larger: ' + (m.alt || m.getAttribute('aria-label') || 'image'));
    m.addEventListener('click', function () { open(i); });
    m.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  box.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  box.addEventListener('click', function (e) {
    if (e.target === box) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });

  // swipe left/right on phones
  var x0 = null, y0 = null;
  box.addEventListener('touchstart', function (e) {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1));
    x0 = y0 = null;
  });
})();
