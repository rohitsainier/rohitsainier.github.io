# Rohit Saini — portfolio

A cinematic, interactive portfolio. Static site built with **Astro**, animated with **GSAP + ScrollTrigger** and **Lenis** smooth scrolling. No framework runtime ships to the browser — every section is HTML + a small script.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview
```

## What's where

| Path | What it is |
| --- | --- |
| `src/data/site.ts` | Name, email, social links, nav, the “Currently building” status |
| `src/data/projects.ts` | Every project + its six-chapter case study (idea → code). Case-study pages are generated from this |
| `src/data/lab.ts` | Experiments wall and the technology constellation (tech → projects map) |
| `src/data/hero-en.json`, `hero-hi.json` | Real transcripts (word timings), sentence timings and waveform peaks for the hero clips |
| `src/data/wltp.json` | The drive cycle used by the EV battery lab |
| `src/components/Hero.astro` + `src/scripts/hero.ts` | The AI dubbing hero: 9-beat pinned scroll story, EN↔HI trailer, waveform, transcript, pipeline |
| `src/components/DubDemo.astro` + `src/scripts/demo.ts` | “Watch the transformation” full-screen side-by-side player |
| `src/components/Battery.astro` + `src/scripts/battery*.ts` | EV lab. `battery-model.ts` is a port of `ev_battery_soh/ev_soh_simulation.py` (same equations/parameters) |
| `src/components/mini/*` | Coded, live product UIs (BharatLink, QuickKit, LinkedComment, MD to Medium, StyleSnap) |
| `src/components/CreativeLab.astro` | Prompt → AI → MCP → software demo. Tool names are the real ones from the Blender/FreeCAD/Figma/MathViz MCP servers and FrameForge |
| `src/pages/work/[slug].astro` | Case-study template |
| `public/media/` | Web-encoded video + posters. Rebuild with `bash scripts/media.sh` (reads `~/Documents/PromoVideos`) |
| `public/ev-simulator.html` | The full standalone EV simulator (“Explore simulation”). A copy of `../saini-co/public/ev-simulator.html` — refresh it with `npm run sync:sim` |

## The hero clip is real

`public/media/hero/hi.mp4` is an actual dub of `en.mp4`, produced locally:

1. **ASR** — faster-whisper (word timestamps + language ID, 99.8 % English)
2. **Translation** — sentence by sentence, fitted to each sentence’s time window
3. **Voice** — IndicF5, cloned from ~8 s of the original speaker
4. **Lips** — LatentSync 1.5 via `latentsync-mlx` (DPM-Solver++, guidance 2.0)
5. **Mux** — FFmpeg, loudness-normalised

To swap in a new pair: replace `en.*` / `hi.*` in `public/media/hero/`, regenerate `hero-en.json` / `hero-hi.json` (word timings + peaks) and run `node scripts/vtt.mjs` for captions.

## Deploy

Live at **https://rohitsainier.github.io/** — GitHub Pages serves the built site from `main` of
`rohitsainier/rohitsainier.github.io`. This source lives on the `portfolio-source` branch of the same repo.

```bash
bash scripts/deploy.sh   # build → mirror dist/ into ../rohitsainier.github.io → commit → push main
```

The deploy keeps `.nojekyll` (otherwise Jekyll drops `_astro/`) and the legacy `/assets` media from the old site.
For a project site instead, build with `BASE_PATH=/repo-name/ SITE_URL=https://rohitsainier.github.io npm run build` — every internal URL is base-aware.

## Accessibility & motion

- Content is never hidden without JS (motion classes are gated in `<head>`, with a 3 s failsafe).
- `prefers-reduced-motion`: no smooth scroll, no pinning, no autoplay; sections render as static, complete layouts.
- Captions (WebVTT) for both hero clips; keyboard support in every interactive (tabs, sliders, dialog, filters).
