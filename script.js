'use strict';
/* ═══════════════════════════════════════════════════════
   אוהד ורון | ביטוח ופיננסים — script.js
   Modules: Header · Mobile Nav · Accordion · Reveal · Year
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initAccordion();
  initReveal();
  initSmoothScroll();
  initYear();
  initLogoLightbox();
  initContactForm();
});

/* ─────────────────────────────────────────
   1. HEADER — sticky + shrink on scroll
───────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let ticking = false;

  function update() {
    header.classList.toggle('stuck', window.scrollY > 60);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
}

/* ─────────────────────────────────────────
   2. MOBILE NAV
───────────────────────────────────────── */
function initMobileNav() {
  const btn = document.getElementById('burger-btn');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  function openMenu() {
    nav.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'סגור תפריט');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'פתח תפריט');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () =>
    nav.classList.contains('open') ? closeMenu() : openMenu()
  );

  // Close on any nav link click
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      btn.focus();
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !btn.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ─────────────────────────────────────────
   3. ACCORDION (FAQ)
   – One open at a time, animated max-height
───────────────────────────────────────── */
function initAccordion() {
  const items = document.querySelectorAll('.acc');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.acc-q');
    const body    = item.querySelector('.acc-a');
    if (!trigger || !body) return;

    // Start closed
    body.style.maxHeight = '0';
    body.style.overflow  = 'hidden';

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(other => {
        if (other.classList.contains('open')) {
          closeItem(other);
        }
      });

      // Toggle clicked
      if (!isOpen) openItem(item);
    });
  });

  function openItem(item) {
    const trigger = item.querySelector('.acc-q');
    const body    = item.querySelector('.acc-a');
    item.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    body.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
  }

  function closeItem(item) {
    const trigger = item.querySelector('.acc-q');
    const body    = item.querySelector('.acc-a');
    item.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    body.classList.remove('open');
    body.style.maxHeight = '0';
  }
}

/* ─────────────────────────────────────────
   4. SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────── */
function initReveal() {
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right')
      .forEach(el => el.classList.add('visible'));
    return;
  }

  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────
   5. SMOOTH SCROLL — offset for fixed header
───────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const headerEl = document.getElementById('site-header');
      const offset   = (headerEl ? headerEl.offsetHeight : 0) + 16;
      const top      = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });

      // Move keyboard focus to section
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    });
  });
}

/* ─────────────────────────────────────────
   6. FOOTER YEAR
───────────────────────────────────────── */
function initYear() {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
}

/* ─────────────────────────────────────────
   7. LOGO LIGHTBOX
───────────────────────────────────────── */
function initLogoLightbox() {
  const btn      = document.getElementById('logo-btn');
  const lightbox = document.getElementById('logo-lightbox');
  const bg       = document.getElementById('logo-lightbox-bg');
  const closeBtn = document.getElementById('logo-lightbox-close');
  if (!btn || !lightbox) return;

  const open = () => {
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    btn.focus();
  };

  btn.addEventListener('click', open);
  bg && bg.addEventListener('click', close);
  closeBtn && closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hidden) close();
  });
}

/* ─────────────────────────────────────────
   8. CONTACT FORM  →  Formspree (email)
───────────────────────────────────────── */
function initContactForm() {
  const form     = document.getElementById('cf-form');
  const success  = document.getElementById('cf-success');
  const resetBtn = document.getElementById('cf-reset');
  const btn      = document.getElementById('cf-btn');
  if (!form) return;

  /* ---- validation helpers ---- */
  const getField = id => document.getElementById(id);
  const setErr   = (input, msg) => {
    input.classList.toggle('invalid', !!msg);
    const errEl = input.closest('.cf-field')?.querySelector('.cf-err');
    if (errEl) errEl.textContent = msg;
  };
  const clearErr = input => setErr(input, '');

  const validate = () => {
    let ok = true;
    const name  = getField('cf-name');
    const phone = getField('cf-phone');
    const msg   = getField('cf-msg');

    if (!name.value.trim())  { setErr(name,  'נא להזין שם מלא'); ok = false; }
    else clearErr(name);

    if (!phone.value.trim()) { setErr(phone, 'נא להזין מספר טלפון'); ok = false; }
    else clearErr(phone);

    if (!msg.value.trim())   { setErr(msg,   'נא להזין הודעה'); ok = false; }
    else clearErr(msg);

    return ok;
  };

  /* clear errors on input */
  form.querySelectorAll('input, textarea').forEach(el =>
    el.addEventListener('input', () => clearErr(el))
  );

  /* ---- submit ---- */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    /* show loading state */
    const btnText    = btn.querySelector('.cf-btn-text');
    const btnLoading = btn.querySelector('.cf-btn-loading');
    btnText.hidden    = true;
    btnLoading.hidden = false;
    btn.setAttribute('data-loading', '');

    try {
      const data = new FormData(form);
      const res  = await fetch('https://formspree.io/f/ohad@bmcenter.co.il', {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        /* success */
        form.hidden    = true;
        success.hidden = false;
      } else {
        /* server error – fallback to mailto */
        fallbackMailto();
      }
    } catch {
      /* network error – fallback to mailto */
      fallbackMailto();
    } finally {
      btnText.hidden    = false;
      btnLoading.hidden = true;
      btn.removeAttribute('data-loading');
    }
  });

  /* ---- fallback: open mail client ---- */
  function fallbackMailto() {
    const name    = getField('cf-name').value.trim();
    const phone   = getField('cf-phone').value.trim();
    const email   = getField('cf-email')?.value.trim() || '';
    const subject = getField('cf-subject')?.value.trim() || 'פנייה מהאתר';
    const msg     = getField('cf-msg').value.trim();

    const body = encodeURIComponent(
      'שם: ' + name + '\n' +
      'טלפון: ' + phone + '\n' +
      (email ? 'אימייל: ' + email + '\n' : '') +
      '\nהודעה:\n' + msg
    );
    window.location.href =
      'mailto:ohad@bmcenter.co.il?subject=' +
      encodeURIComponent(subject) +
      '&body=' + body;

    form.hidden    = true;
    success.hidden = false;
  }

  /* ---- reset ---- */
  resetBtn && resetBtn.addEventListener('click', () => {
    form.reset();
    form.hidden    = false;
    success.hidden = true;
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    form.querySelectorAll('.cf-err').forEach(el => el.textContent = '');
    getField('cf-name')?.focus();
  });
}

