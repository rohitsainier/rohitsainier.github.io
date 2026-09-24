import { ScrollTrigger, reduceMotion } from './core';

export interface MiniCtl { start: () => void; stop: () => void; still?: () => void }

/**
 * Mini product UIs run only while they matter: inside the gallery the gallery decides (mini:on / mini:off),
 * anywhere else the viewport does. Reduced motion renders a still frame instead.
 */
export function mini(root: HTMLElement, ctl: MiniCtl) {
  if (reduceMotion) { ctl.still?.(); return; }
  let on = false;
  const set = (v: boolean) => {
    if (v === on) return;
    on = v;
    v ? ctl.start() : ctl.stop();
  };
  root.addEventListener('mini:on', () => set(true));
  root.addEventListener('mini:off', () => set(false));
  if (!root.closest('[data-gallery]')) {
    ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onToggle: (s) => set(s.isActive) });
  }
}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** A cancellable async loop. `alive()` turns false as soon as stop() is called. */
export function loop(body: (alive: () => boolean) => Promise<void>) {
  let token = 0;
  return {
    start() {
      const id = ++token;
      const alive = () => id === token;
      (async () => { while (alive()) await body(alive); })();
    },
    stop() { token++; },
  };
}

/** Type text into an element character by character. */
export async function type(el: HTMLElement, text: string, alive: () => boolean, speed = 32, html = false) {
  for (let i = 0; i <= text.length; i++) {
    if (!alive()) return false;
    const s = text.slice(0, i);
    if (html) el.innerHTML = s; else el.textContent = s;
    await sleep(speed + Math.random() * speed * 0.8);
  }
  return true;
}
