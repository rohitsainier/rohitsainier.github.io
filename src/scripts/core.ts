import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const isMobile = () => innerWidth < 860;

let lenis: Lenis | null = null;

/** Smooth scroll (Lenis) driven by GSAP's ticker so ScrollTrigger and Lenis share one clock. */
export function initScroll() {
  if (reduceMotion || lenis) return lenis;
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.4 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) lenis.scrollTo(el as HTMLElement | number, { offset, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else if (typeof el === 'number') window.scrollTo({ top: el });
  else el.scrollIntoView({ block: 'start' });
}

export function lockScroll(lock: boolean) {
  if (lenis) lock ? lenis.stop() : lenis.start();
  root.style.overflow = lock ? 'hidden' : '';
}

/** Run a callback when an element enters/leaves the viewport (scroll-driven, not IO). */
export function inView(el: Element, onEnter: () => void, onLeave?: () => void, start = 'top 92%', end = 'bottom 8%') {
  return ScrollTrigger.create({
    trigger: el,
    start,
    end,
    onEnter,
    onEnterBack: onEnter,
    onLeave: onLeave,
    onLeaveBack: onLeave,
  });
}

export { gsap, ScrollTrigger, SplitText };
