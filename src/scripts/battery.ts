import { ScrollTrigger, gsap, reduceMotion } from './core';
import { simulate, aging, eolEfc, speed, phases, cycleLen, Pack, type CoolingKind, type Run } from './battery-model';

// dark instrument palette: warm-white traces, one signal-orange accent
const INK = '#ece8e1', INK2 = '#8f8c85', RULE = 'rgba(236,232,225,0.07)', ACC = '#ff5b22', ACC2 = '#ff8a5c';
const REF = 'rgba(236,232,225,0.32)', SHADE = 'rgba(236,232,225,0.035)', BG = '#121313';
const kmh = speed.map((v) => v * 3.6);
const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

document.querySelectorAll<HTMLElement>('[data-battery]').forEach(initLab);

function initLab(root: HTMLElement) {
  const b = <T extends Element = HTMLElement>(k: string) => root.querySelector<T>(`[data-b="${k}"]`)!;
  const age = b<HTMLInputElement>('age');
  const cools = [...root.querySelectorAll<HTMLInputElement>('[data-b="cool"]')];
  const playBtn = b<HTMLButtonElement>('play');
  const flow = b<SVGPathElement>('flow');
  const cellsEl = root.querySelector<SVGSVGElement>('.pack')!;
  const charts = {
    speed: root.querySelector<HTMLCanvasElement>('[data-chart="speed"]')!,
    current: root.querySelector<HTMLCanvasElement>('[data-chart="current"]')!,
    temp: root.querySelector<HTMLCanvasElement>('[data-chart="temp"]')!,
    aging: root.querySelector<HTMLCanvasElement>('[data-chart="aging"]')!,
  };

  const st = {
    efc: 0, cooling: 'air' as CoolingKind, k: 0, playing: !reduceMotion, visible: false,
    run: null as Run | null, ref: null as Run | null, dash: 0, last: 0,
  };
  const SPEED = 100; // samples per second of playback (×100 real time)

  /* ——— canvas plumbing ——— */
  const sized = new Map<HTMLCanvasElement, { w: number; h: number; ctx: CanvasRenderingContext2D }>();
  const size = () => Object.values(charts).forEach((c) => {
    const r = c.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
    const ctx = c.getContext('2d')!; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sized.set(c, { w: r.width, h: r.height, ctx });
  });
  const PAD = { l: 34, r: 10, t: 8, b: 20 };
  const frame = (c: HTMLCanvasElement, xmax: number, ymin: number, ymax: number, yticks: number[], xlab: (x: number) => string, xticks: number[]) => {
    const s = sized.get(c)!; const { ctx, w, h } = s;
    ctx.clearRect(0, 0, w, h);
    const X = (x: number) => PAD.l + (x / xmax) * (w - PAD.l - PAD.r);
    const Y = (y: number) => PAD.t + (1 - (y - ymin) / (ymax - ymin)) * (h - PAD.t - PAD.b);
    ctx.font = '500 9px "Geist Mono Variable", ui-monospace, monospace';
    ctx.fillStyle = INK2; ctx.strokeStyle = RULE; ctx.lineWidth = 1;
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    yticks.forEach((t) => { ctx.beginPath(); ctx.moveTo(PAD.l, Y(t) + 0.5); ctx.lineTo(w - PAD.r, Y(t) + 0.5); ctx.stroke(); ctx.fillText(String(t), PAD.l - 6, Y(t)); });
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    xticks.forEach((t) => ctx.fillText(xlab(t), X(t), h - PAD.b + 6));
    return { ctx, w, h, X, Y };
  };
  const line = (ctx: CanvasRenderingContext2D, pts: ArrayLike<number>, X: (i: number) => number, Y: (v: number) => number, color: string, width = 1.4, step = 2, dash?: number[], from = 0, to = pts.length) => {
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []);
    for (let i = from; i < to; i += step) i === from ? ctx.moveTo(X(i - from), Y(pts[i])) : ctx.lineTo(X(i - from), Y(pts[i]));
    ctx.stroke(); ctx.setLineDash([]);
  };
  const playhead = (ctx: CanvasRenderingContext2D, x: number, h: number) => {
    ctx.fillStyle = ACC2; ctx.fillRect(Math.round(x), PAD.t, 1.5, h - PAD.t - PAD.b);
  };

  /* ——— model ——— */
  const recompute = () => {
    st.run = simulate(st.efc, st.cooling);
    st.ref = simulate(0, st.cooling);
    const r = st.run;
    b('soh').textContent = fmt(r.sohC * 100, 1);
    b('sohx').textContent = st.efc === 0 ? 'new pack' : r.sohC <= 0.8 ? 'past end of life' : `−${fmt((1 - r.sohC) * 100, 1)} % capacity`;
    b('res').textContent = fmt(r.R * 1000, 1);
    b('resx').textContent = `×${r.rRatio.toFixed(2)} vs new`;
    b('range').textContent = fmt(r.rangeKm);
    b('efc').textContent = fmt(st.efc);
    // lifetime distance ≈ Σ usable energy per cycle / consumption
    let km = 0; const c0 = st.ref.consKwh100, c1 = r.consKwh100;
    for (let n = 0; n < st.efc; n += 10) km += 10 * (Pack.Ebol * aging(n).sohC) / ((c0 + (c1 - c0) * Math.sqrt(n / Math.max(1, st.efc))) / 100);
    b('km').textContent = fmt(Math.round(km / 1000) * 1000);
    age.style.setProperty('--p', `${(st.efc / 2000) * 100}%`);
    age.setAttribute('aria-valuetext', `${st.efc} cycles, state of health ${fmt(r.sohC * 100, 1)} percent, range ${fmt(r.rangeKm)} kilometres`);
    b('tmin').textContent = `${25} °C`;
    b('tmax').textContent = `${Math.ceil(Math.max(r.Tmax, 30))} °C`;
    drawStatic();
    update(true);
  };
  b('eol').textContent = fmt(eolEfc);

  /* ——— per-frame ——— */
  let staticDirty = true;
  const drawStatic = () => { staticDirty = true; };

  const update = (force = false) => {
    const r = st.run!, ref = st.ref!;
    const k = Math.floor(st.k) % r.I.length;
    const kc = k % cycleLen;
    const I = r.I[k], T = r.T[k];
    b('soc').textContent = fmt(r.SOC[k] * 100, 1);
    b<HTMLElement>('socbar').style.width = `${r.SOC[k] * 100}%`;
    b('temp').textContent = fmt(T, 1);
    b('cur').textContent = fmt(I);
    b('curx').textContent = I < -1 ? 'regen · charging' : 'discharge';
    b('speed').textContent = fmt(kmh[kc]);
    b('power').textContent = fmt(r.P[k] / 1000, 1);
    const phase = phases.filter((p) => p[1] <= kc).pop()?.[0] || 'Low';
    const ph = b('phase'); if (ph.textContent !== phase) ph.textContent = phase.replace('ExtraHigh', 'Extra-high');
    const mode = b('mode'); const regen = I < -1;
    mode.textContent = regen ? 'Regenerative braking' : kmh[kc] < 0.5 ? 'Idle · aux load' : 'Discharging';
    mode.classList.toggle('is-regen', regen);
    flow.classList.toggle('is-regen', regen);
    // cell colour from lumped temperature
    const heat = Math.min(1, Math.max(0, (T - 25) / Math.max(5, Math.max(r.Tmax, 30) - 25)));
    cellsEl.style.setProperty('--cell', heatColor(heat));

    // charts
    if (!sized.size) return;
    {
      const { ctx, h, X, Y } = frame(charts.speed, cycleLen, 0, 140, [0, 50, 100], (x) => `${Math.round(x / 60)}m`, [0, 400, 800, 1200, 1600]);
      phases.forEach(([n, i]) => { ctx.fillStyle = SHADE; if (n === 'Medium' || n === 'ExtraHigh') ctx.fillRect(X(i), PAD.t, X((phases.find((p) => p[1] > i)?.[1] ?? cycleLen)) - X(i), h - PAD.t - PAD.b); });
      line(ctx, kmh, (i) => X(i), Y, INK, 1.3, 2);
      playhead(ctx, X(kc), h);
    }
    {
      const { ctx, h, X, Y } = frame(charts.current, cycleLen, -80, 200, [-50, 0, 100, 200], (x) => `${Math.round(x / 60)}m`, [0, 400, 800, 1200, 1600]);
      line(ctx, ref.I, (i) => X(i), Y, REF, 1, 2, [3, 3], 0, cycleLen);
      line(ctx, r.I, (i) => X(i), Y, ACC, 1.3, 2, undefined, 0, cycleLen);
      playhead(ctx, X(kc), h);
    }
    {
      const n = r.T.length;
      const tmax = Math.max(32, Math.ceil(r.Tmax + 1));
      const { ctx, h, X, Y } = frame(charts.temp, n, 24, tmax, [25, Math.round((25 + tmax) / 2), tmax], (x) => `${Math.round(x / cycleLen)}`, [0, cycleLen * 2, cycleLen * 4, cycleLen * 6, cycleLen * 8]);
      line(ctx, ref.T, (i) => X(i), Y, REF, 1, 8, [3, 3]);
      line(ctx, r.T, (i) => X(i), Y, ACC, 1.6, 8);
      playhead(ctx, X(k), h);
      ctx.fillStyle = INK2; ctx.textAlign = 'left'; ctx.fillText('new pack', X(n * 0.72), Y(ref.T[Math.floor(n * 0.72)]) + 6);
    }
    if (staticDirty || force) drawAging();
  };

  const drawAging = () => {
    staticDirty = false;
    const { ctx, w, h, X, Y } = frame(charts.aging, 2000, 70, 100, [70, 80, 90, 100], (x) => fmt(x), [0, 500, 1000, 1500, 2000]);
    const soh: number[] = [], rr: number[] = [];
    for (let n = 0; n <= 2000; n += 10) { const a = aging(n); soh.push(a.sohC * 100); rr.push(a.rRatio); }
    // EOL line
    ctx.setLineDash([4, 4]); ctx.strokeStyle = ACC; ctx.beginPath(); ctx.moveTo(PAD.l, Y(80)); ctx.lineTo(w - PAD.r, Y(80)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = ACC; ctx.textAlign = 'left'; ctx.fillText(`EOL · 80 % · ${fmt(eolEfc)} cycles`, PAD.l + 6, Y(80) - 12);
    // resistance growth (right scale 1.0–2.2 mapped onto 70–100)
    const RY = (v: number) => Y(70 + ((v - 1) / 1.2) * 30);
    line(ctx, rr, (i) => X(i * 10), RY, REF, 1, 1, [2, 3]);
    ctx.fillStyle = INK2; ctx.textAlign = 'right'; ctx.fillText('R ×2.0', w - PAD.r - 2, RY(2) - 8);
    line(ctx, soh, (i) => X(i * 10), Y, INK, 1.8, 1);
    // marker
    const a = aging(st.efc);
    ctx.fillStyle = ACC; ctx.strokeStyle = BG; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(X(st.efc), Y(a.sohC * 100), 6, 0, Math.PI * 2); ctx.stroke(); ctx.fill();
    ctx.fillStyle = ACC2; ctx.fillRect(X(st.efc) - 0.5, PAD.t, 1, h - PAD.t - PAD.b);
  };

  const heatColor = (t: number) => {
    // cool → hot, brighter as it heats (thermal-camera style on dark)
    const stops = [[42, 38, 34], [122, 58, 31], [255, 91, 34], [255, 196, 163]];
    const x = t * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(x)), f = x - i;
    const c = stops[i].map((v, j) => Math.round(v + (stops[i + 1][j] - v) * f));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  };

  const loop = (time: number) => {
    const dt = st.last ? Math.min(0.1, (time - st.last) / 1000) : 0;
    st.last = time;
    if (st.playing) st.k += dt * SPEED;
    const I = st.run!.I[Math.floor(st.k) % st.run!.I.length];
    st.dash -= I * dt * 0.35;
    flow.style.strokeDashoffset = String(st.dash);
    update();
  };

  /* ——— controls ——— */
  age.addEventListener('input', () => { st.efc = Number(age.value); recompute(); });
  cools.forEach((c) => c.addEventListener('change', () => { st.cooling = c.value as CoolingKind; recompute(); }));
  playBtn.addEventListener('click', () => {
    st.playing = !st.playing;
    playBtn.setAttribute('aria-pressed', String(st.playing));
    b('playlabel').textContent = st.playing ? 'Driving · ×100' : 'Paused';
  });
  // drag on the aging curve
  const agingCanvas = charts.aging;
  const setFromPointer = (e: PointerEvent) => {
    const r = agingCanvas.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left - PAD.l) / (r.width - PAD.l - PAD.r)));
    const v = Math.round((x * 2000) / 10) * 10;
    age.value = String(v); st.efc = v; recompute();
  };
  agingCanvas.addEventListener('pointerdown', (e) => { agingCanvas.setPointerCapture(e.pointerId); setFromPointer(e); });
  agingCanvas.addEventListener('pointermove', (e) => { if (agingCanvas.hasPointerCapture(e.pointerId)) setFromPointer(e); });
  agingCanvas.style.touchAction = 'pan-y';

  addEventListener('resize', () => { size(); drawStatic(); update(true); });

  // boot
  size();
  recompute();
  if (reduceMotion) {
    playBtn.setAttribute('aria-pressed', 'false');
    b('playlabel').textContent = 'Paused';
    st.k = cycleLen * 0.62;
    update(true);
  }
  ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (s) => {
      st.visible = s.isActive;
      if (s.isActive) { size(); drawStatic(); st.last = 0; gsap.ticker.add(tickFn); }
      else gsap.ticker.remove(tickFn);
    },
  });
  function tickFn(time: number) { loop(time * 1000); }
}
