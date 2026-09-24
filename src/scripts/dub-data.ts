import enData from '../data/hero-en.json';
import hiData from '../data/hero-hi.json';

export type Word = [string, number, number];
export type Sentence = { start: number; end: number; text: string };
export type Track = { sentences: Sentence[]; words: Word[]; peaks: number[]; duration: number };
export type Lang = 'en' | 'hi';

export const EN = enData as unknown as Track;
export const HI = hiData as unknown as Track;
export const TRACK: Record<Lang, Track> = { en: EN, hi: HI };

/** words → caption chunks of ~7 words, preferring to break at punctuation */
export function chunk(words: Word[], max = 7) {
  const out: { start: number; end: number; text: string }[] = [];
  const punct = (w?: Word) => !!w && /[.,!?।]$/.test(w[0]);
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const soon = punct(words[i + 1]) || punct(words[i + 2]);
    if ((punct(w) && cur.length >= 3) || (cur.length >= max && !soon) || cur.length >= max + 2) { out.push(pack(cur)); cur = []; }
  });
  if (cur.length) out.push(pack(cur));
  return out;
  function pack(c: Word[]) { return { start: c[0][1], end: c[c.length - 1][2], text: c.map((w) => w[0]).join(' ') }; }
}
export const CAPS: Record<Lang, ReturnType<typeof chunk>> = { en: chunk(EN.words), hi: chunk(HI.words) };

/*
 * The two takes tell the same sentences at their own pace, so time is mapped sentence by sentence:
 * a moment in one take lands on the matching moment of the other (piecewise-linear between sentence edges).
 */
const edges = (tr: Track) => [0, ...tr.sentences.flatMap((s) => [s.start, s.end]), tr.duration];
const EDGES: Record<Lang, number[]> = { en: edges(EN), hi: edges(HI) };
const segment = (from: Lang, t: number) => {
  const a = EDGES[from];
  let i = 1;
  while (i < a.length - 1 && t >= a[i]) i++;
  return i;
};
export function mapTime(from: Lang, to: Lang, t: number) {
  if (from === to) return t;
  const a = EDGES[from], b = EDGES[to], i = segment(from, t);
  const span = a[i] - a[i - 1];
  const f = span > 0 ? Math.min(1, Math.max(0, (t - a[i - 1]) / span)) : 1;
  return b[i - 1] + f * (b[i] - b[i - 1]);
}
/** how fast `to` must play, relative to `from`, to stay on the same words around time t */
export function rateAt(from: Lang, to: Lang, t: number) {
  const a = EDGES[from], b = EDGES[to], i = segment(from, t);
  const span = a[i] - a[i - 1];
  return span > 0 ? (b[i] - b[i - 1]) / span : 1;
}
