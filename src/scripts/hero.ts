import { gsap, ScrollTrigger, reduceMotion, getLenis } from './core';
import { EN, HI, TRACK, CAPS, type Track, type Lang } from './dub-data';
import './demo';

const BEATS = 9;
const LEAD = 0.035; // progress before beat 1

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const sentenceAt = (tr: Track, t: number) => tr.sentences.findIndex((s) => t >= s.start - 0.35 && t <= s.end + 0.45);
const peakAt = (tr: Track, t: number) => {
  const i = Math.floor(t * 50);
  return i < 0 || i >= tr.peaks.length ? 0 : tr.peaks[i];
};
const tc = (t: number) => {
  const s = Math.floor(t);
  const f = Math.floor((t - s) * 25);
  return `00:00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
};

const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero) initHero(hero);

function initHero(hero: HTMLElement) {
  const $ = <T extends Element = HTMLElement>(s: string) => hero.querySelector<T>(s)!;
  const $$ = <T extends Element = HTMLElement>(s: string) => [...hero.querySelectorAll<T>(s)];
  const stage = $('[data-hero-stage]');
  const V: Record<Lang, HTMLVideoElement> = { en: $<HTMLVideoElement>('video[data-v="en"]'), hi: $<HTMLVideoElement>('video[data-v="hi"]') };
  const zoomEl = $('[data-zoom]');
  const roi = $('[data-roi]');
  const tag = $('[data-tag]');
  const tagText = $('[data-tag-text]');
  const tcEl = $('[data-tc]');
  const caption = $('[data-caption]');
  const scan = $('[data-scan]');
  const toggle = $<HTMLButtonElement>('[data-lang-toggle]');
  const canvas = $<HTMLCanvasElement>('[data-wave]');
  const waveLabel = $('[data-wave-label]');
  const txEn = $('[data-tx-en]');
  const txHi = $('[data-tx-hi]');
  const langChip = $('[data-lang]');
  const pipeRows = $$('[data-stage]');
  const pipeCount = $('[data-pipe-count]');
  const intro = $('[data-hero-intro]');
  const beatEls = $$('[data-beat]');
  const ticks = $$<HTMLButtonElement>('[data-tick]');
  const cue = $('[data-cue]');
  const mods = { wave: $('[data-mod="wave"]'), text: $('[data-mod="text"]'), pipe: $('[data-mod="pipe"]') };

  const desktop = matchMedia('(min-width: 860px)');
  const state = {
    beat: 0,
    dub: 0, // 0 = source visible, 1 = dub visible (circle wipe amount)
    waveMix: 0,
    zoom: 0,
    trailer: true,
    manual: null as Lang | null,
    cycle: 0,
    lastT: 0,
    capKey: '',
    enSent: -1,
    hiSent: -1,
    running: false,
  };
  const wipe = { v: 0 }; // animated wipe used by trailer / manual toggles

  /* ——— video helpers ——— */
  const visibleLang = (): Lang => (state.dub >= 0.5 ? 'hi' : 'en');
  const master = () => V[state.dub >= 0.999 ? 'hi' : 'en'];
  const play = (v: HTMLVideoElement) => { if (v.paused) v.play().catch(() => {}); };
  const syncSlave = () => {
    const m = master();
    const s = m === V.en ? V.hi : V.en;
    if (s.readyState < 2) return;
    const want = m.currentTime % (s.duration || 999);
    if (Math.abs(s.currentTime - want) > 0.14) s.currentTime = want;
  };

  const applyDub = (d: number) => {
    state.dub = d;
    const r = d <= 0.001 ? 0 : d >= 0.999 ? 160 : 4 + ease(d) * 150;
    V.hi.style.clipPath = `circle(${r}% at 52% 38.7%)`;
    const isHi = d >= 0.5;
    tag.classList.toggle('is-dub', isHi);
    const label = state.beat === 7 && d > 0.02 && d < 0.98 ? 'Lip sync · rendering' : isHi ? 'AI dub · हिन्दी' : 'Source · English';
    if (tagText.textContent !== label) tagText.textContent = label;
    toggle.setAttribute('aria-pressed', String(isHi));
  };

  const applyZoom = (z: number) => {
    state.zoom = z;
    gsap.set(zoomEl, { scale: 1 + ease(z) * 1.15 });
    roi.style.opacity = String(clamp(z * 1.4 - 0.2) * (state.dub < 0.98 ? 1 : 0.4));
  };

  /* ——— transcript rendering ——— */
  const renderEnSentence = (i: number) => {
    if (i === state.enSent) return;
    state.enSent = i;
    if (i < 0) return;
    const s = EN.sentences[i];
    const words = EN.words.filter((w) => w[1] >= s.start - 0.05 && w[2] <= s.end + 0.05);
    txEn.innerHTML = words.map((w) => `<span class="w" data-s="${w[1]}" data-e="${w[2]}">${w[0]}</span>`).join(' ');
  };
  const renderHiSentence = (i: number, animate: boolean) => {
    if (i === state.hiSent || i < 0) return;
    state.hiSent = i;
    const words = HI.sentences[i].text.split(' ');
    txHi.innerHTML = words.map((w) => `<span class="hw">${w}</span>`).join(' ');
    if (animate && !reduceMotion) {
      gsap.fromTo(txHi.querySelectorAll('.hw'), { opacity: 0, y: 6, filter: 'blur(6px)' }, {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.035, ease: 'power3.out',
        onComplete: () => txHi.querySelectorAll<HTMLElement>('.hw').forEach((el) => (el.style.filter = '')),
      });
    }
  };

  /* ——— waveform ——— */
  const ctx = canvas.getContext('2d')!;
  let cw = 0, ch = 0;
  const sizeCanvas = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cw = r.width; ch = r.height;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const drawWave = (tEn: number, tHi: number) => {
    if (!cw) return;
    ctx.clearRect(0, 0, cw, ch);
    const n = Math.floor(cw / 4);
    const span = 4.2;
    const m = state.waveMix;
    const cy = ch / 2;
    for (let i = 0; i < n; i++) {
      const f = i / n - 0.5;
      const a = mix(peakAt(EN, tEn + f * span), peakAt(HI, tHi + f * span), m);
      const h = Math.max(1.5, a * ch * 0.9);
      const past = f < 0;
      const alpha = past ? 0.9 : 0.35;
      // warm white → signal orange as the voice is regenerated
      const r = Math.round(mix(236, 255, m)), g = Math.round(mix(232, 91, m)), b = Math.round(mix(225, 34, m));
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fillRect(i * 4, cy - h / 2, 2, h);
    }
    ctx.fillStyle = '#ff5b22';
    ctx.fillRect(Math.round(cw / 2), 0, 1, ch);
  };

  /* ——— per-frame update ——— */
  let lastCheck = 0;
  const tick = () => {
    const vis = visibleLang();
    const m = master();
    // watchdog: browsers may suspend media; keep the visible layers rolling while we run
    const now = performance.now();
    if (state.running && now - lastCheck > 800) {
      lastCheck = now;
      if (V.en.paused) play(V.en);
      if (V.hi.paused) play(V.hi);
    }
    const t = m.currentTime || 0;
    syncSlave();
    if (state.beat <= 0) {
      state.waveMix = state.dub;
      const lbl = vis === 'hi' ? 'HI · cloned voice (IndicF5)' : 'EN · source voice';
      if (waveLabel.textContent !== lbl) waveLabel.textContent = lbl;
    }

    // trailer: alternate language every sentence
    if (state.trailer && !state.manual && !reduceMotion) {
      if (t + 0.5 < state.lastT) state.cycle++;
      const tr = TRACK[vis];
      const k = tr.sentences.findIndex((s) => t >= s.start - 0.45 && t < s.end);
      if (k >= 0) {
        const want: Lang = (k + state.cycle) % 2 === 0 ? 'en' : 'hi';
        if (want !== vis && !gsap.isTweening(wipe)) animateWipe(want === 'hi' ? 1 : 0);
      }
    }
    state.lastT = t;

    const tEn = V.en.currentTime || 0;
    const tHi = V.hi.currentTime || 0;
    tcEl.textContent = tc(t);

    // captions (visible language)
    const tv = vis === 'hi' ? tHi : tEn;
    const cap = CAPS[vis].find((c) => tv >= c.start - 0.12 && tv <= c.end + 0.4);
    const key = cap ? vis + cap.start : '';
    if (key !== state.capKey) {
      state.capKey = key;
      caption.textContent = cap ? cap.text : '';
      caption.classList.toggle('is-hi', vis === 'hi');
      caption.lang = vis;
    }

    // transcript + translation (index-aligned)
    const iEn = vis === 'en' ? sentenceAt(EN, tEn) : sentenceAt(HI, tHi);
    if (iEn >= 0) {
      renderEnSentence(iEn);
      renderHiSentence(iEn, state.beat >= 5 || state.beat === 0);
    }
    txEn.querySelectorAll<HTMLElement>('.w').forEach((w) => {
      const s = Number(w.dataset.s), e = Number(w.dataset.e);
      const on = vis === 'en' && tEn >= s && tEn <= e + 0.08;
      w.classList.toggle('is-on', on);
      w.classList.toggle('is-past', vis === 'hi' || tEn > e + 0.08);
    });

    drawWave(tEn, vis === 'hi' || state.waveMix > 0 ? tHi : tEn);
  };

  const start = () => {
    if (state.running) return;
    state.running = true;
    play(V.en);
    play(V.hi);
    gsap.ticker.add(tick);
  };
  const stop = () => {
    state.running = false;
    gsap.ticker.remove(tick);
    V.en.pause();
    V.hi.pause();
  };

  function animateWipe(to: 0 | 1, dur = 1.1) {
    wipe.v = state.dub;
    return gsap.to(wipe, {
      v: to, duration: dur, ease: 'power2.inOut',
      onStart: () => { gsap.fromTo(scan, { top: '0%', opacity: 1 }, { top: '100%', opacity: 0, duration: dur, ease: 'power2.inOut' }); },
      onUpdate: () => applyDub(wipe.v),
    });
  }

  /* ——— beats (scroll story) ——— */
  const setPipe = (beat: number) => {
    const map = [-1, 0, 1, 1, 1, 2, 3, 4, 5, 6]; // running stage per beat; 6 = all done
    const run = map[beat];
    pipeRows.forEach((r, i) => {
      r.classList.toggle('is-done', beat > 0 && i < run);
      r.classList.toggle('is-run', beat > 0 && i === run);
    });
    pipeCount.textContent = String(beat === 0 ? 0 : Math.min(6, run));
    const active = (on: boolean, el: HTMLElement) => gsap.to(el, { opacity: on ? 1 : 0.28, duration: 0.6, overwrite: 'auto' });
    active(beat === 0 || beat >= 2, mods.wave);
    active(beat === 0 || beat >= 3, mods.text);
    gsap.to(txHi, { opacity: beat === 0 || beat >= 5 ? 1 : 0, duration: 0.6, overwrite: 'auto' });
    gsap.to(langChip, { opacity: beat === 0 || beat >= 4 ? 1 : 0.25, duration: 0.5, overwrite: 'auto' });
    if (beat === 4) gsap.fromTo(langChip.querySelector('.lang__bar i'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out' });
    waveLabel.textContent = beat >= 6 || (beat === 0 && visibleLang() === 'hi') ? 'HI · cloned voice (IndicF5)' : 'EN · source voice';
  };

  let shownBeat = 0;
  const showBeat = (b: number) => {
    if (b === shownBeat) return;
    const prev = shownBeat;
    shownBeat = b;
    const dir = b > prev ? 1 : -1;
    const out = prev === 0 ? intro : beatEls[prev - 1];
    const inn = b === 0 ? intro : beatEls[b - 1];
    gsap.killTweensOf([out, inn]);
    gsap.to(out, { autoAlpha: 0, y: -40 * dir, duration: 0.45, ease: 'power2.in' });
    gsap.fromTo(inn, { autoAlpha: 0, y: 50 * dir }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: 0.18 });
    ticks.forEach((t, i) => {
      t.classList.toggle('is-on', i + 1 === b);
      t.classList.toggle('is-done', i + 1 < b);
    });
    gsap.to(cue, { autoAlpha: b === 0 ? 1 : 0, duration: 0.4 });
    if (b === 1 || b === 7) gsap.fromTo(scan, { top: '0%', opacity: 1 }, { top: '100%', opacity: 0, duration: 1.4, ease: 'power2.inOut' });
  };

  const setBeat = (b: number) => {
    if (b === state.beat) return;
    const wasTrailer = state.beat === 0;
    state.beat = b;
    state.trailer = b === 0;
    if (b > 0 && wasTrailer) gsap.killTweensOf(wipe);
    setPipe(b);
    showBeat(b);
  };

  const onProgress = (p: number) => {
    const b = p < LEAD ? 0 : Math.min(BEATS, 1 + Math.floor((p - LEAD) / ((1 - LEAD) / BEATS)));
    const lp = b === 0 ? 0 : clamp(((p - LEAD) / ((1 - LEAD) / BEATS)) - (b - 1));
    setBeat(b);
    if (b === 0) return; // trailer owns dub/zoom
    state.waveMix = b < 6 ? 0 : b === 6 ? ease(clamp(lp / 0.8)) : 1;
    const z = b === 7 ? clamp(lp / 0.3) : b === 8 ? 1 - clamp(lp / 0.55) : 0;
    applyZoom(z);
    applyDub(b < 7 ? 0 : b === 7 ? clamp((lp - 0.32) / 0.55) : 1);
  };

  /* ——— layout modes ——— */
  let story: ScrollTrigger | null = null;
  const setupStory = () => {
    story?.kill();
    story = null;
    gsap.set([intro, ...beatEls], { clearProps: 'all' });
    if (reduceMotion || !desktop.matches) {
      // static: final pipeline, manual toggle
      state.beat = -1;
      setBeat(0);
      pipeRows.forEach((r) => { r.classList.add('is-done'); r.classList.remove('is-run'); });
      pipeCount.textContent = '6';
      return;
    }
    gsap.set(beatEls, { autoAlpha: 0 });
    setPipe(0);
    story = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: () => `+=${Math.round(innerHeight * 3.6)}`,
      pin: stage,
      anticipatePin: 1,
      onUpdate: (st) => onProgress(st.progress),
      onRefresh: (st) => onProgress(st.progress),
    });
  };

  // jump-to-step ticks
  ticks.forEach((t) => t.addEventListener('click', () => {
    if (!story) return;
    const b = Number(t.dataset.tick);
    const p = LEAD + ((b - 1) + 0.55) * ((1 - LEAD) / BEATS);
    const y = story.start + p * (story.end - story.start);
    const lenis = getLenis();
    lenis ? lenis.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y });
  }));

  // manual toggle (mobile / reduced motion / anyone)
  toggle.addEventListener('click', () => {
    const to: Lang = visibleLang() === 'hi' ? 'en' : 'hi';
    state.manual = to;
    state.trailer = false;
    gsap.killTweensOf(wipe);
    if (reduceMotion) applyDub(to === 'hi' ? 1 : 0);
    else animateWipe(to === 'hi' ? 1 : 0, 0.9);
    if (V[to].paused) { play(V.en); play(V.hi); start(); }
  });


  addEventListener('resize', () => sizeCanvas());
  desktop.addEventListener('change', () => { setupStory(); ScrollTrigger.refresh(); });

  // boot
  sizeCanvas();
  applyDub(0);
  renderEnSentence(0);
  renderHiSentence(0, false);
  setupStory();
  // run only while visible (created after the pin so it measures the pin spacer)
  ScrollTrigger.create({
    trigger: hero,
    start: 'top bottom',
    end: 'bottom top',
    refreshPriority: -1,
    onToggle: (st) => (st.isActive ? (reduceMotion ? null : start()) : stop()),
  });
  if (reduceMotion) {
    tick();
    [V.en, V.hi].forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
  }

  // entrance after the intro title card
  const enter = () => {
    if (reduceMotion) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('[data-hero-title] .hl > span', { yPercent: 110, duration: 1.3, stagger: 0.08 }, 0)
      .from('.hero__eyebrow', { opacity: 0, y: 10, duration: 0.8 }, 0.1)
      .from('[data-hero-fade]', { opacity: 0, y: 24, duration: 1.1, stagger: 0.08 }, 0.35)
      .fromTo('[data-frame]', { clipPath: 'inset(14% 14% 14% 14% round 18px)', scale: 1.08 },
        { clipPath: 'inset(0% 0% 0% 0% round 18px)', scale: 1, duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath,transform' }, 0)
      .from('[data-console] .mod', { opacity: 0, y: 30, duration: 1, stagger: 0.1 }, 0.5)
      .from('.hero__foot', { opacity: 0, duration: 1 }, 0.8);
  };
  if ((window as any).__introDone) enter();
  else addEventListener('intro:done', enter, { once: true });

  /* ——— full-screen demonstration: pause the hero while it plays ——— */
  addEventListener('demo:open', stop);
  addEventListener('demo:close', () => start());
}
