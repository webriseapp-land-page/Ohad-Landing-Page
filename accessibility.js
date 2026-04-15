'use strict';
(function () {

  var KEY = 'a11y_ohad_v2';
  var BASE = 16;

  var s = {
    fontSize: 0,
    contrast: false,
    invert:   false,
    cursor:   false,
    links:    false,
    anim:     false
  };

  /* ── load saved state ── */
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    Object.keys(s).forEach(function(k){ if (k in saved) s[k] = saved[k]; });
  } catch(e) {}

  /* ── elements ── */
  var fab      = document.getElementById('a11y-fab');
  var panel    = document.getElementById('a11y-panel');
  var overlay  = document.getElementById('a11y-overlay');

  if (!fab || !panel) return;

  /* ── save ── */
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(e) {}
  }

  /* ── apply state to DOM ── */
  function apply() {
    /* font size — על html כדי לא להזיז scroll */
    document.documentElement.style.fontSize = (BASE + s.fontSize * 2) + 'px';

    /* body classes */
    var b = document.body;
    b.classList.toggle('a11y-contrast',   s.contrast);
    b.classList.toggle('a11y-invert',     s.invert);
    b.classList.toggle('a11y-big-cursor', s.cursor);
    b.classList.toggle('a11y-links',      s.links);
    b.classList.toggle('a11y-no-anim',    s.anim);

    /* כפתורי toggle */
    toggle_ui('a11y-contrast', s.contrast);
    toggle_ui('a11y-invert',   s.invert);
    toggle_ui('a11y-cursor',   s.cursor);
    toggle_ui('a11y-links',    s.links);
    toggle_ui('a11y-anim',     s.anim);

    /* נקודה על הכפתור כשמשהו פעיל */
    var active = s.fontSize !== 0 || s.contrast || s.invert || s.cursor || s.links || s.anim;
    fab.classList.toggle('has-active', active);
  }

  function toggle_ui(id, on) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? 'פעיל' : 'כבוי';
  }

  /* ── open / close panel ── */
  var isOpen = false;

  function open() {
    isOpen = true;
    panel.classList.add('open');
    overlay.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'סגור תפריט נגישות');
    /* focus בלי גלילה */
    var first = panel.querySelector('button');
    if (first) first.focus({ preventScroll: true });
  }

  function close() {
    isOpen = false;
    panel.classList.remove('open');
    overlay.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'פתח תפריט נגישות');
    fab.focus({ preventScroll: true });
  }

  fab.addEventListener('click', function() { isOpen ? close() : open(); });
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) close();
  });

  /* ── font size ── */
  document.getElementById('a11y-dec').addEventListener('click', function() {
    if (s.fontSize > -2) { s.fontSize--; apply(); save(); }
  });
  document.getElementById('a11y-inc').addEventListener('click', function() {
    if (s.fontSize < 4)  { s.fontSize++; apply(); save(); }
  });
  document.getElementById('a11y-norm').addEventListener('click', function() {
    s.fontSize = 0; apply(); save();
  });

  /* ── toggles ── */
  function mkToggle(id, key) {
    document.getElementById(id).addEventListener('click', function() {
      s[key] = !s[key]; apply(); save();
    });
  }
  mkToggle('a11y-contrast', 'contrast');
  mkToggle('a11y-invert',   'invert');
  mkToggle('a11y-cursor',   'cursor');
  mkToggle('a11y-links',    'links');
  mkToggle('a11y-anim',     'anim');

  /* ── reset ── */
  document.getElementById('a11y-reset').addEventListener('click', function() {
    s.fontSize = 0; s.contrast = false; s.invert = false;
    s.cursor = false; s.links = false; s.anim = false;
    apply(); save();
  });

  /* ── עצירת אנימציות JS (particles, ticker, hero reveal) ── */
  function stopJsAnims() {
    // עצור canvas particles
    var canvas = document.getElementById('heroParticles');
    if (canvas) canvas.style.display = 'none';

    // עצור ticker — הקפא את המיקום הנוכחי
    var ticker = document.getElementById('tickerInner');
    if (ticker) {
      var computed = window.getComputedStyle(ticker).transform;
      ticker.style.transform = computed;
      ticker.style.transition = 'none';
      var clone = ticker.nextElementSibling;
      if (clone && !clone.id) {
        var c2 = window.getComputedStyle(clone).transform;
        clone.style.transform = c2;
        clone.style.transition = 'none';
      }
    }

    // הצג מיד את כל reveal elements
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
      .forEach(function(el) {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
      });

    // עצור hero text char animation
    document.querySelectorAll('.hero-sub span').forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.animation = 'none';
    });
  }

  function resumeJsAnims() {
    // החזר canvas
    var canvas = document.getElementById('heroParticles');
    if (canvas) canvas.style.display = '';

    // החזר ticker — הסר override
    var ticker = document.getElementById('tickerInner');
    if (ticker) {
      ticker.style.transform = '';
      ticker.style.transition = '';
      var clone = ticker.nextElementSibling;
      if (clone && !clone.id) {
        clone.style.transform = '';
        clone.style.transition = '';
      }
    }
  }

  /* עטוף את apply כך שיקרא גם לפונקציות JS */
  var _origApply = apply;
  apply = function() {
    _origApply();
    if (s.anim) stopJsAnims();
    else resumeJsAnims();
  };

  /* ── init ── */
  apply();

})();
