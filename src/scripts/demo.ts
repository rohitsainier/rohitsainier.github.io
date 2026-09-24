import { gsap, reduceMotion, lockScroll } from './core';
import { TRACK, CAPS, mapTime, rateAt, type Lang } from './dub-data';

const desktop = matchMedia('(min-width: 860px)');

export function initDemo() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-demo]');
  if (!dialog) return;
  const q = <T extends Element = HTMLElement>(s: string) => dialog.querySelector<T>(s)!;
  const DV: Record<Lang, HTMLVideoElement> = { en: q<HTMLVideoElement>('video[data-dv="en"]'), hi: q<HTMLVideoElement>('video[data-dv="hi"]') };
  const caps: Record<Lang, HTMLElement> = { en: q('[data-dcap="en"]'), hi: q('[data-dcap="hi"]') };
  const panels = [...dialog.querySelectorAll<HTMLButtonElement>('[data-panel]')];
  const segs = [...dialog.querySelectorAll<HTMLButtonElement>('[data-seg]')];
  const playBtn = q<HTMLButtonElement>('[data-demo-play]');
  const playLabel = q('[data-demo-play-label]');
  const prog = q('[data-demo-progress]');
  const time = q('[data-demo-time]');
  const inner = q('[data-demo-inner]');
  let listen: Lang = 'hi';
  let raf = 0;
  let opener: HTMLElement | null = null;

  const setListen = (l: Lang) => {
    listen = l;
    DV.en.muted = l !== 'en';
    DV.hi.muted = l !== 'hi';
    DV[l].playbackRate = 1;
    panels.forEach((p) => p.setAttribute('aria-pressed', String(p.dataset.panel === l)));
    segs.forEach((s) => s.setAttribute('aria-pressed', String(s.dataset.seg === l)));
  };
  const fmt = (t: number) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  // The side you listen to plays at its natural pace; the other take follows it sentence by sentence,
  // nudging its playback rate (or jumping, across a pause) so both start every line together.
  const follow = () => {
    const fl: Lang = listen === 'en' ? 'hi' : 'en';
    const m = DV[listen], f = DV[fl];
    if (m.paused || f.readyState < 2) return;
    const want = mapTime(listen, fl, m.currentTime);
    if (want >= (f.duration || Infinity) - 0.05) return;
    const drift = f.currentTime - want;
    if (Math.abs(drift) > 0.35) { f.currentTime = want; return; }
    const r = Math.min(1.6, Math.max(0.6, rateAt(listen, fl, m.currentTime) - drift * 0.8));
    if (Math.abs(f.playbackRate - r) > 0.03) f.playbackRate = r;
    if (f.paused) f.play().catch(() => {});
  };
  const loop = () => {
    follow();
    (['en', 'hi'] as Lang[]).forEach((l) => {
      const t = DV[l].currentTime;
      const c = CAPS[l].find((x) => t >= x.start - 0.12 && t <= x.end + 0.4);
      const txt = c ? c.text : '';
      if (caps[l].textContent !== txt) caps[l].textContent = txt;
    });
    const d = DV[listen].duration || TRACK[listen].duration;
    const t = DV[listen].currentTime;
    prog.style.transform = `scaleX(${t / d})`;
    time.textContent = `${fmt(t)} / ${fmt(d)}`;
    raf = requestAnimationFrame(loop);
  };
  const setPaused = (p: boolean) => {
    playBtn.classList.toggle('is-paused', p);
    playLabel.textContent = p ? 'Play' : 'Pause';
    playBtn.setAttribute('aria-label', p ? 'Play' : 'Pause');
  };
  const playBoth = () => { DV.en.play().catch(() => {}); DV.hi.play().catch(() => {}); setPaused(false); };
  const pauseBoth = () => { DV.en.pause(); DV.hi.pause(); setPaused(true); };
  const restart = () => { DV.en.currentTime = 0; DV.hi.currentTime = 0; playBoth(); };
  // the take you are listening to decides when the demonstration is over
  (['en', 'hi'] as Lang[]).forEach((l) => DV[l].addEventListener('ended', () => { if (l === listen) pauseBoth(); }));

  const open = (e: Event) => {
    opener = e.currentTarget as HTMLElement;
    const r = opener.getBoundingClientRect();
    dialog.style.setProperty('--ox', `${r.left + r.width / 2}px`);
    dialog.style.setProperty('--oy', `${r.top + r.height / 2}px`);
    dispatchEvent(new Event('demo:open'));
    dialog.showModal();
    lockScroll(true);
    setListen('hi');
    restart();
    raf = requestAnimationFrame(loop);
    if (!reduceMotion) {
      gsap.fromTo(q('[data-demo-curtain]'), { clipPath: `circle(0% at ${r.left + r.width / 2}px ${r.top + r.height / 2}px)` },
        { clipPath: `circle(150% at ${r.left + r.width / 2}px ${r.top + r.height / 2}px)`, duration: 1.1, ease: 'expo.inOut' });
      gsap.fromTo(inner.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', delay: 0.45 });
    }
  };
  const close = () => {
    pauseBoth();
    cancelAnimationFrame(raf);
    const finish = () => { dialog.close(); lockScroll(false); dispatchEvent(new Event('demo:close')); opener?.focus(); };
    if (reduceMotion) return finish();
    gsap.to(dialog, { opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: () => { finish(); gsap.set(dialog, { opacity: 1 }); } });
  };

  document.querySelectorAll<HTMLElement>('[data-demo-open]').forEach((b) => b.addEventListener('click', open));
  q('[data-demo-close]').addEventListener('click', close);
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  panels.forEach((p) => p.addEventListener('click', () => {
    const l = p.dataset.panel as Lang;
    if (!desktop.matches && l === listen) setListen(l === 'en' ? 'hi' : 'en');
    else setListen(l);
  }));
  segs.forEach((s) => s.addEventListener('click', () => setListen(s.dataset.seg as Lang)));
  playBtn.addEventListener('click', () => (DV[listen].paused ? playBoth() : pauseBoth()));
  q('[data-demo-restart]').addEventListener('click', restart);
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') setListen('en');
    if (e.key === 'ArrowRight') setListen('hi');
    if (e.key === ' ' && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); DV[listen].paused ? playBoth() : pauseBoth(); }
  });
}

initDemo();
