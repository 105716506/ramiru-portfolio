/**
 * Ramiru Deesara — Portfolio Script
 *
 * Functions:
 *   initMobileNavigation()   — hamburger menu, Escape key, scroll lock
 *   initScrollReveal()       — IntersectionObserver-based reveal animations
 *   initActiveNavigation()   — IntersectionObserver active nav highlight
 *   initScrollProgress()     — scroll progress bar width
 *   initHeaderScrollState()  — header becomes more solid on scroll
 *   initBackToTop()          — back-to-top button show/hide & action
 *   initProjectSpotlight()   — pointer-tracked radial highlight on cards
 *   initHeroPointerEffect()  — subtle parallax on hero visual panel
 *   initHeroEntrance()       — staggered hero element entrance sequence
 *   initSmoothAnchors()      — smooth scroll with nav-height offset
 *   setCurrentYear()         — footer year
 *   init()                   — entry point, calls all above
 */

'use strict';

/* ─── Tiny helpers ────────────────────────────────────────────────────────── */

const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => ctx.querySelectorAll(sel);

/* ─── Mobile Navigation ───────────────────────────────────────────────────── */

function initMobileNavigation() {
  const toggle = qs('#menuToggle');
  const nav    = qs('#mainNavigation');
  if (!toggle || !nav) return;

  function openMenu() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    nav.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  // Close on nav link click
  qsa('a', nav).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
}

/* ─── Scroll Reveal ───────────────────────────────────────────────────────── */

function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If reduced motion, immediately reveal everything without animation
  if (prefersReduced) {
    qsa('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);

        setTimeout(() => {
          el.classList.add('is-revealed');
        }, delay);

        observer.unobserve(el);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  qsa('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}

/* ─── Active Navigation ───────────────────────────────────────────────────── */

function initActiveNavigation() {
  const sections = qsa('section[id]');
  const navLinks = qsa('.main-nav a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-25% 0px -65% 0px' }
  );

  sections.forEach(section => observer.observe(section));
}

/* ─── Scroll Progress Bar ─────────────────────────────────────────────────── */

function initScrollProgress() {
  const bar = qs('#scrollProgress');
  if (!bar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width  = `${Math.min(progress, 100)}%`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

/* ─── Header Scroll State ─────────────────────────────────────────────────── */

function initHeaderScrollState() {
  const header = qs('.site-header');
  if (!header) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

/* ─── Back To Top ─────────────────────────────────────────────────────────── */

function initBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      btn.classList.toggle('is-visible', window.scrollY > 420);
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── Project Spotlight (desktop only) ───────────────────────────────────── */

function initProjectSpotlight() {
  // Disable on touch / coarse-pointer devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  qsa('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--spotlight-x', `${x}%`);
      card.style.setProperty('--spotlight-y', `${y}%`);
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--spotlight-x', '50%');
      card.style.setProperty('--spotlight-y', '50%');
    });
  });
}

/* ─── Hero Pointer Effect (desktop only) ──────────────────────────────────── */

function initHeroPointerEffect() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const panel = qs('#heroVisual');
  if (!panel) return;

  // Only activate within the hero section
  const hero = qs('.hero');
  if (!hero) return;

  let raf = null;

  window.addEventListener('mousemove', e => {
    // Only apply when pointer is roughly in the top half of the page
    const heroRect = hero.getBoundingClientRect();
    if (e.clientY > heroRect.bottom) return;

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = heroRect.top + heroRect.height / 2;
      const dx = ((e.clientX - cx) / cx) * 4;
      const dy = ((e.clientY - cy) / (heroRect.height / 2)) * 3;
      panel.style.transform = `translate(${dx}px, ${dy}px)`;
      raf = null;
    });
  }, { passive: true });

  // Reset when mouse leaves the hero
  hero.addEventListener('mouseleave', () => {
    panel.style.transform = '';
  });
}

/* ─── Hero Entrance Sequence ──────────────────────────────────────────────── */

function initHeroEntrance() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ordered list of hero elements to reveal in sequence
  const selectors = [
    '.hero-status-pill',
    '.hero-eyebrow',
    '.hero-content h1',
    '.hero-text',
    '.hero-actions',
    '.hero-links',
    '.hero-tech-strip',
    '#heroVisual',
  ];

  selectors.forEach((sel, i) => {
    const el = qs(sel);
    if (!el) return;

    if (prefersReduced) {
      // Immediately reveal without animation
      el.style.opacity    = '1';
      el.style.transform  = 'none';
      el.style.transition = 'none';
      return;
    }

    // Stagger via transitionDelay; all get .hero-entered in the same frame
    el.style.transitionDelay = `${i * 80}ms`;

    // Double-rAF ensures the initial opacity:0 state has been painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('hero-entered');
      });
    });
  });
}

/* ─── Smooth Anchor Navigation ────────────────────────────────────────────── */

function initSmoothAnchors() {
  // Read nav height from CSS token; fall back to 72
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72',
    10
  );

  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      // Ignore bare "#" links
      if (!href || href === '#') return;

      const id     = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });
}

/* ─── Current Year ────────────────────────────────────────────────────────── */

function setCurrentYear() {
  const el = qs('#currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ─── Init ────────────────────────────────────────────────────────────────── */

function init() {
  setCurrentYear();
  initMobileNavigation();
  initScrollReveal();
  initActiveNavigation();
  initScrollProgress();
  initHeaderScrollState();
  initBackToTop();
  initProjectSpotlight();
  initHeroPointerEffect();
  initHeroEntrance();
  initSmoothAnchors();
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
