/**
 * EV pack model — a TypeScript port of ev_battery_soh/ev_soh_simulation.py (same equations, same parameters).
 *   drive cycle → longitudinal dynamics → battery power → R-int ECM (I, V, SOC) → lumped thermal → aging
 */
import wltp from '../data/wltp.json';

export const Vehicle = {
  mass: 1650, Crr: 0.01, Cd: 0.28, A: 2.3, rho: 1.225, g: 9.81, rot: 0.05,
  etaDrive: 0.97, etaMotor: 0.92, Paux: 700, Pmax: 150e3, Pregen: 60e3, vRegenMin: 1.5,
};

export const Pack = {
  Ns: 96, Np: 35, Qcell: 5.0, Rcell: 0.03,
  ocvSoc: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1],
  ocvV: [3.0, 3.42, 3.52, 3.58, 3.63, 3.68, 3.74, 3.82, 3.92, 4.02, 4.11, 4.16, 4.2],
  get Qbol() { return this.Np * this.Qcell; },            // 175 Ah
  get Rbol() { return (this.Rcell * this.Ns) / this.Np; }, // 82.3 mΩ
  get Vnom() { return this.Ns * 3.6; },                     // 345.6 V
  get Ebol() { return (this.Qbol * this.Vnom) / 1000; },    // 60.5 kWh
};

export const Cooling = { air: 80, liquid: 400, immersion: 900 } as const; // UA, W/K
export type CoolingKind = keyof typeof Cooling;
const CP_PER_KWH = 6000; // J/K of thermal mass per kWh of pack

const interp = (x: number, xs: number[], ys: number[]) => {
  if (x <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) {
    if (x <= xs[i]) return ys[i - 1] + ((ys[i] - ys[i - 1]) * (x - xs[i - 1])) / (xs[i] - xs[i - 1]);
  }
  return ys[ys.length - 1];
};
export const packOcv = (soc: number) => Pack.Ns * interp(Math.min(1, Math.max(0, soc)), Pack.ocvSoc, Pack.ocvV);

/** speeds (m/s) of the WLTP-class cycle, 1 Hz */
export const speed = (wltp.kmh as number[]).map((k) => k / 3.6);
export const phases = wltp.phases as [string, number][];
export const cycleLen = speed.length;
export const distanceKm = speed.reduce((a, v) => a + v, 0) / 1000;

/** numpy.gradient equivalent (dt = 1) */
const gradient = (y: number[]) => y.map((_, i) => (i === 0 ? y[1] - y[0] : i === y.length - 1 ? y[i] - y[i - 1] : (y[i + 1] - y[i - 1]) / 2));

/** electrical power the pack must supply, W (I > 0 = discharge) */
export const powerDemand = (() => {
  const V = Vehicle, a = gradient(speed), drive = V.etaDrive * V.etaMotor;
  return speed.map((v, i) => {
    const F = V.Crr * V.mass * V.g * (v > 0.1 ? 1 : 0) + 0.5 * V.rho * V.Cd * V.A * v * v + V.mass * (1 + V.rot) * a[i];
    const Pw = F * v;
    let P: number;
    if (Pw >= 0) P = Math.min(Pw / drive, V.Pmax);
    else P = v > V.vRegenMin ? Math.max(Pw * drive, -V.Pregen) : 0;
    return P + V.Paux;
  });
})();

/** semi-empirical √(throughput) aging, calibrated: −20 % capacity and 2× resistance at 1,500 EFC */
export function aging(efc: number) {
  const alpha = 0.2 / Math.sqrt(1500), beta = 1 / Math.sqrt(1500);
  const sohC = 1 - alpha * Math.sqrt(efc) - 0.02 * Math.sqrt(efc / 2000);
  const rRatio = 1 + beta * Math.sqrt(efc);
  return { sohC, rRatio };
}
export const eolEfc = (() => { for (let n = 0; n <= 3000; n++) if (aging(n).sohC <= 0.8) return n; return 3000; })();

export interface Run {
  I: Float32Array; V: Float32Array; SOC: Float32Array; T: Float32Array; Q: Float32Array; P: Float32Array;
  sohC: number; rRatio: number; R: number; Qah: number;
  consKwh100: number; rangeKm: number; peakI: number; Tmax: number; Tss: number; lossKwh: number;
}

/** run `cycles` back-to-back drive cycles at a given age + cooling */
export function simulate(efc: number, cooling: CoolingKind = 'liquid', Tcool = 25, cycles = 8, soc0 = 0.8): Run {
  const { sohC, rRatio } = aging(efc);
  const Qah = Pack.Qbol * sohC;
  const R = Pack.Rbol * rRatio;
  const UA = Cooling[cooling];
  const Cth = 60 * CP_PER_KWH;
  const n = cycleLen * cycles;
  const I = new Float32Array(n), V = new Float32Array(n), SOC = new Float32Array(n), T = new Float32Array(n), Q = new Float32Array(n), P = new Float32Array(n);
  let s = soc0, temp = Tcool, eChem = 0, loss = 0, peak = 0, qSum = 0;
  for (let k = 0; k < n; k++) {
    const ocv = packOcv(s);
    const Pmax = (0.95 * ocv * ocv) / (4 * R);
    const Pd = Math.max(-Pmax, Math.min(Pmax, powerDemand[k % cycleLen]));
    const disc = ocv * ocv - 4 * R * Pd;
    const i = (ocv - Math.sqrt(Math.max(disc, 0))) / (2 * R);
    const q = i * i * R;
    s = Math.min(1, Math.max(0, s - i / (3600 * Qah)));
    temp += (q - UA * (temp - Tcool)) / Cth;
    I[k] = i; V[k] = ocv - i * R; SOC[k] = s; T[k] = temp; Q[k] = q; P[k] = Pd;
    if (k < cycleLen) { eChem += ocv * i; loss += q; }
    peak = Math.max(peak, Math.abs(i));
    qSum += q;
  }
  const kwhPerCycle = eChem / 3.6e6;
  const consKwh100 = (kwhPerCycle / distanceKm) * 100;
  const rangeKm = (Pack.Ebol * sohC) / (kwhPerCycle / distanceKm);
  let Tmax = Tcool;
  for (let k = 0; k < n; k++) Tmax = Math.max(Tmax, T[k]);
  return {
    I, V, SOC, T, Q, P, sohC, rRatio, R, Qah, consKwh100, rangeKm, peakI: peak, Tmax,
    Tss: Tcool + qSum / n / UA, lossKwh: loss / 3.6e6,
  };
}
