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
