import { gsap, ScrollTrigger, SplitText, initScroll, scrollToTarget, lockScroll, reduceMotion, finePointer } from './core';

declare global {
  interface Window { __rsFailsafe?: number; __introDone?: boolean; __rsLate?: boolean }
}

const root = document.documentElement;
clearTimeout(window.__rsFailsafe);
// Slow network: the no-JS failsafe may already have switched the page to its static fallback.
// Converge back to motion mode without re-hiding anything the visitor has already seen.
if (!reduceMotion && !root.classList.contains('motion')) {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  root.classList.add('motion');
  window.__rsLate = true; // content is already on screen: skip entrance animations
}

initScroll();
initNav();
initAnchors();
initCursor();
initMagnetic();
initVideos();
initClock();
// triggers are created by many components; refresh them top-to-bottom so pins above are measured first
const settle = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
document.fonts.ready.then(() => {
  initSplits();
  initReveals();
  initCounters();
  initParallax();
  settle();
});
addEventListener('load', settle);
initIntro();

/* ——— intro title card ——— */
function initIntro() {
  const intro = document.querySelector<HTMLElement>('.intro');
  const finish = () => {
    window.__introDone = true;
    window.dispatchEvent(new Event('intro:done'));
  };
  if (!intro || root.classList.contains('no-intro')) {
    intro?.remove();
    finish();
    return;
  }
  lockScroll(true);
  const tc = intro.querySelector<HTMLElement>('[data-tc]');
  const frames = { f: 0 };
  const renderTC = () => {
    const f = Math.floor(frames.f);
    if (tc) tc.textContent = `00:00:${String(Math.floor(f / 25)).padStart(2, '0')}:${String(f % 25).padStart(2, '0')}`;
  };
  const tl = gsap.timeline({
    defaults: { ease: 'expo.out' },
    onComplete: () => {
      intro.remove();
      lockScroll(false);
      try { sessionStorage.setItem('rs-intro', '1'); } catch {}
    },
  });
  tl.from('.intro__line > span', { yPercent: 108, duration: 1.15, stagger: 0.09 }, 0.05)
    .from('.intro__role > *', { opacity: 0, y: 12, duration: 0.7, stagger: 0.045 }, 0.45)
    .to('.intro__bar i', { scaleX: 1, duration: 1.35, ease: 'power2.inOut' }, 0.15)
    .to(frames, { f: 41, duration: 1.4, ease: 'none', onUpdate: renderTC }, 0.1)
    .add(finish, 1.55)
    .to(intro, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.05, ease: 'expo.inOut' }, 1.55)
    .to('.intro__frame', { yPercent: -18, opacity: 0.3, duration: 1.05, ease: 'expo.inOut' }, 1.55);

  const skip = () => {
    if (tl.progress() < 0.6) tl.seek(1.55);
    removeEventListener('keydown', skip);
    intro.removeEventListener('click', skip);
  };
  addEventListener('keydown', skip, { once: true });
  intro.addEventListener('click', skip, { once: true });
}

/* ——— nav ——— */
function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  // active link + ink-on-paper mode, measured live so pins/spacers never make it stale
  const groups: Record<string, string[]> = {
    work: ['work', 'battery', 'projects'],
    experiments: ['lab', 'experiments'],
    about: ['process', 'technology', 'about'],
    contact: ['contact'],
  };
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('.nav__link')].map((a) => {
    const id = a.getAttribute('href')?.split('#')[1] || '';
    return { a, secs: (groups[id] || [id]).map((x) => document.getElementById(x)).filter(Boolean) as HTMLElement[] };
  });
  const lights = [...document.querySelectorAll<HTMLElement>('[data-theme="light"]')];
  const measure = () => {
    const probe = innerHeight * 0.45;
    let active: HTMLAnchorElement | null = null;
    for (const { a, secs } of links) {
      if (secs.some((sec) => { const r = sec.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; })) active = a;
    }
    links.forEach(({ a }) => a.classList.toggle('is-active', a === active));
    nav.classList.toggle('on-light', lights.some((l) => { const r = l.getBoundingClientRect(); return r.top <= 40 && r.bottom > 40; }));
  };
  measure();
  addEventListener('scroll', measure, { passive: true });
  addEventListener('resize', measure);

  // mobile menu
  const btn = nav.querySelector<HTMLButtonElement>('[data-menu-btn]');
  const menu = nav.querySelector<HTMLElement>('[data-menu]');
  if (!btn || !menu) return;
  const set = (open: boolean) => {
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    lockScroll(open);
    if (open) {
      gsap.fromTo(menu.querySelectorAll('li a'), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: 'expo.out' });
      menu.querySelector<HTMLElement>('a')?.focus();
    }
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); }
  });
}

function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || a.target === '_blank') return;
    const u = new URL(a.href, location.href);
    if (u.pathname !== location.pathname || !u.hash) return;
    const target = u.hash === '#top' ? 0 : document.querySelector<HTMLElement>(u.hash);
    if (target === null) return;
    e.preventDefault();
    scrollToTarget(target as HTMLElement | number, 0);
    history.pushState(null, '', u.hash);
    if (target instanceof HTMLElement) target.focus({ preventScroll: true });
  });
}

/* ——— cursor ——— */
function initCursor() {
  const el = document.querySelector<HTMLElement>('.cursor');
  if (!el || !finePointer || reduceMotion) return;
  root.classList.add('has-cursor');
  const label = el.querySelector<HTMLElement>('[data-cursor-label]')!;
  const xTo = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3' });
  let shown = false;
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (!shown) { gsap.set(el, { x: e.clientX, y: e.clientY }); gsap.to(el, { opacity: 1, duration: 0.3 }); shown = true; }
    xTo(e.clientX);
    yTo(e.clientY);
  }, { passive: true });
  addEventListener('pointerdown', () => el.classList.add('is-down'));
  addEventListener('pointerup', () => el.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => gsap.to(el, { opacity: 0, duration: 0.3 }));
  document.addEventListener('pointerenter', () => shown && gsap.to(el, { opacity: 1, duration: 0.3 }));

  const interactive = 'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor]';
  document.addEventListener('pointerover', (e) => {
    const t = e.target as Element;
    const labelled = t.closest<HTMLElement>('[data-cursor]');
    const hover = t.closest(interactive);
    el.classList.toggle('on-light', !!t.closest('[data-theme="light"]'));
    if (labelled && labelled.dataset.cursor) {
      label.textContent = labelled.dataset.cursor.toUpperCase();
      el.classList.add('is-label');
      el.classList.remove('is-hover');
    } else {
      el.classList.remove('is-label');
      el.classList.toggle('is-hover', !!hover);
    }
  });
}

function initMagnetic() {
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((m) => {
    const strength = Number(m.dataset.magnetic) || 0.28;
    const xTo = gsap.quickTo(m, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(m, 'y', { duration: 0.6, ease: 'power3' });
    m.addEventListener('pointermove', (e) => {
      const r = m.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    m.addEventListener('pointerleave', () => {
      gsap.to(m, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
    });
  });
}

/* ——— text + reveals ——— */
function initSplits() {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const mode = el.dataset.split || 'lines';
    SplitText.create(el, {
      type: mode === 'words' ? 'words,lines' : 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        const targets = mode === 'words' ? self.words : self.lines;
        return gsap.from(targets, {
          yPercent: 115,
          rotate: mode === 'words' ? 3 : 0,
          duration: 1.25,
          ease: 'expo.out',
          stagger: mode === 'words' ? 0.035 : 0.09,
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });
}

function initReveals() {
  if (reduceMotion) return;
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => els.forEach((el, i) => {
      (el as HTMLElement).style.setProperty('--d', `${i * 0.08}s`);
      el.classList.add('is-in');
    }),
  });
}

function initCounters() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const dec = Number(el.dataset.decimals || 0);
    if (reduceMotion || Number.isNaN(end)) return;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(o, {
        v: end, duration: 1.8, ease: 'power3.out',
        onUpdate: () => { el.textContent = o.v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); },
      }),
    });
  });
}

function initParallax() {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amt = Number(el.dataset.parallax) || 12;
    gsap.fromTo(el, { yPercent: -amt / 2 }, {
      yPercent: amt / 2, ease: 'none',
      scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ——— media ——— */
function initVideos() {
  document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]').forEach((v) => {
    if (reduceMotion) {
      v.removeAttribute('autoplay');
      v.controls = true;
      return;
    }
    v.muted = true;
    ScrollTrigger.create({
      trigger: v,
      start: 'top bottom+=40%',
      end: 'bottom top-=10%',
      onToggle: (st) => {
        if (st.isActive) {
          if (v.preload !== 'auto') v.preload = 'auto';
          v.play().catch(() => {});
        } else v.pause();
      },
    });
  });
}

function initClock() {
  const els = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (!els.length) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
  const tick = () => els.forEach((el) => (el.textContent = `${fmt.format(new Date())} IST`));
  tick();
  setInterval(tick, 15000);
}
