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
  initHeroParticles();
  initHeroTextReveal();
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
   7. LOGO LIGHTBOX — with focus trap
───────────────────────────────────────── */
function initLogoLightbox() {
  const btn      = document.getElementById('logo-btn');
  const lightbox = document.getElementById('logo-lightbox');
  const bg       = document.getElementById('logo-lightbox-bg');
  const closeBtn = document.getElementById('logo-lightbox-close');
  if (!btn || !lightbox) return;

  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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

  // Close on bg overlay click
  bg && bg.addEventListener('click', close);

  // Also close if click lands directly on lightbox wrapper (not content)
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  closeBtn && closeBtn.addEventListener('click', close);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') { close(); return; }

    // Focus trap — Tab cycles inside dialog
    if (e.key === 'Tab') {
      const focusable = [...lightbox.querySelectorAll(focusableSelectors)].filter(
        el => !el.closest('[hidden]') && !el.disabled
      );
      if (!focusable.length) { e.preventDefault(); return; }
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  });
}

/* ─────────────────────────────────────────
   9. HERO PARTICLES — floating gold dots
───────────────────────────────────────── */
function initHeroParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    const hero = canvas.closest('.hero');
    W = canvas.width  = hero ? hero.offsetWidth  : window.innerWidth;
    H = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.8 + 0.4;
      this.a  = 0;
      this.ta = Math.random() * 0.6 + 0.1;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.vx = (Math.random() - 0.5) * 0.25;
      this.life = 0;
      this.maxLife = Math.random() * 220 + 120;
    }
    update() {
      this.life++;
      this.x += this.vx;
      this.y += this.vy;
      const t = this.life / this.maxLife;
      this.a = t < 0.2 ? t / 0.2 * this.ta
             : t > 0.75 ? (1 - t) / 0.25 * this.ta
             : this.ta;
      if (this.life >= this.maxLife) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.a;
      ctx.fillStyle = '#c9943a';
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(201,148,58,.8)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 55 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  init();
  loop();
}

/* ─────────────────────────────────────────
   10. HERO TEXT REVEAL — word by word
───────────────────────────────────────── */
function initHeroTextReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sub = document.querySelector('.hero-sub');
  if (!sub) return;

  const text = sub.textContent;
  sub.innerHTML = '';
  sub.style.animation = 'none';
  sub.style.opacity = '1';

  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.cssText = `
      display: inline-block;
      opacity: 0;
      transform: translateY(12px);
      animation: charReveal .5s ease forwards;
      animation-delay: ${.75 + i * .03}s;
    `;
    sub.appendChild(span);
  });

  // Add keyframe if not present
  if (!document.getElementById('charRevealStyle')) {
    const style = document.createElement('style');
    style.id = 'charRevealStyle';
    style.textContent = `
      @keyframes charReveal {
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

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
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const errId = input.getAttribute('aria-describedby');
    const errEl = errId ? document.getElementById(errId) : input.closest('.cf-field')?.querySelector('.cf-err');
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

