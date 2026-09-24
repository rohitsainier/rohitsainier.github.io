// Builds WebVTT caption files for the hero clips from the transcript JSON (word timings).
import { readFileSync, writeFileSync } from 'node:fs';
const chunk = (words, max = 7) => {
  const out = []; let cur = [];
  const punct = (w) => !!w && /[.,!?।]$/.test(w[0]);
  const pack = (c) => ({ start: c[0][1], end: c[c.length - 1][2], text: c.map((w) => w[0]).join(' ') });
  words.forEach((w, i) => {
    cur.push(w);
    const soon = punct(words[i + 1]) || punct(words[i + 2]);
    if ((punct(w) && cur.length >= 3) || (cur.length >= max && !soon) || cur.length >= max + 2) { out.push(pack(cur)); cur = []; }
  });
  if (cur.length) out.push(pack(cur));
  return out;
};
const ts = (t) => { const ms = Math.round(t * 1000); const s = Math.floor(ms / 1000);
  return `00:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`; };
for (const l of ['en', 'hi']) {
  const d = JSON.parse(readFileSync(`src/data/hero-${l}.json`, 'utf8'));
  const cues = chunk(d.words).map((c, i, a) => `${i + 1}\n${ts(c.start)} --> ${ts(Math.min(c.end + 0.35, a[i + 1]?.start ?? c.end + 0.35))}\n${c.text}`);
  writeFileSync(`public/media/hero/${l}.vtt`, `WEBVTT\n\n${cues.join('\n\n')}\n`);
  console.log(l, cues.length, 'cues');
}
