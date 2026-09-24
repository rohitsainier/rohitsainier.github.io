import { url } from './site';

/** Rohit's full standalone EV simulator — a copy of saini-co/public/ev-simulator.html served from this site (`npm run sync:sim` refreshes it) */
export const SIMULATOR = url('ev-simulator.html');

export type LinkKind = 'github' | 'live' | 'store' | 'crate' | 'site';
export interface ProjectLink { label: string; href: string; kind: LinkKind }
export interface Stat { value: string; label: string }
export interface Media { video?: string; poster?: string; caption: string; aspect?: string }

export interface Project {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  summary: string;
  status: string;
  year: string;
  platforms: string;
  stack: string[];
  links: ProjectLink[];
  /** coded interactive visual used on cards + case study */
  visual: 'dub' | 'creatorcut' | 'flux' | 'battery' | 'bharatlink' | 'quickkit' | 'linkedcomment' | 'mdtomedium' | 'stylesnap';
  media: Media[];
  story: {
    idea: string;
    experiment: string;
    experimentPoints: string[];
    technology: string;
    pipeline: { stage: string; detail: string }[];
    interface: string;
    result: string;
    stats: Stat[];
    code: string;
    install?: string;
  };
}

export const projects: Project[] = [
  {
    slug: 'ai-video-dubbing',
    name: 'AI Video Dubbing',
    category: 'AI × Video × Speech',
    tagline: 'One video. Any language. Same face.',
    summary:
      'An experimental video-to-video pipeline that translates speech, generates a new voice and synchronizes the speaker’s lips to the translated dialogue.',
    status: 'Experiment',
    year: '2026',
    platforms: 'macOS · Apple silicon',
    stack: ['Speech recognition', 'Neural translation', 'Voice cloning', 'Lip sync', 'Video pipeline'],
    links: [{ label: 'GitHub', href: 'https://github.com/rohitsainier', kind: 'github' }],
    visual: 'dub',
    media: [
      { video: 'hero/en', poster: 'hero/poster', caption: 'Meera, a virtual anchor — English, 20.6 s', aspect: '2/3' },
      { video: 'work/editra-transcript', caption: 'Speech recognition inside Editra, my Mac captioning studio', aspect: '16/9' },
    ],
    story: {
      idea:
        'Most of the world never hears most videos. Subtitles ask people to read instead of watch, and classic dubbing breaks the spell — the mouth says one thing while the audio says another. I wanted to know how far a single laptop could get on its own: same face, same voice, new language.',
      experiment:
        'A pipeline that takes a finished video and hands it back speaking Hindi. The heavy lifting — recognition, voice and lips — runs on my MacBook.',
      experimentPoints: [
        'Speech recognition transcribes the source with word-level timestamps and detects the language.',
        'Each line is translated to fit the timing window of the original sentence.',
        'A voice model clones the speaker from a few seconds of reference audio and speaks the translation.',
        'A lip-sync model regenerates only the mouth region, frame by frame.',
        'The final cut is aligned, loudness-matched and muxed.',
      ],
      technology:
        'Five models in a line, each one handing timestamps to the next. The trick is not any single model — it is keeping time aligned from the first word to the last frame.',
      pipeline: [
        { stage: 'Video', detail: 'Finished source clip' },
        { stage: 'Speech recognition', detail: 'Word timestamps · language ID' },
        { stage: 'Translation', detail: 'Sentence-level, timing-aware' },
        { stage: 'Voice generation', detail: 'Zero-shot voice clone' },
        { stage: 'Lip synchronization', detail: 'Mouth region, frame by frame' },
        { stage: 'Video', detail: 'Loudness-matched · muxed' },
      ],
      interface:
        'The demo on this site plays both takes side by side — English on one side, Hindi on the other, locked sentence by sentence. Flip between them mid-sentence and you land on the same line in the other language.',
      result:
        'A short clip, dubbed end to end on a laptop. The same pipeline powers my experiments in synthetic news anchors and real-time avatars.',
      stats: [
        { value: '5', label: 'stages, one timeline' },
        { value: '0', label: 'reshoots or re-recordings' },
        { value: '2.73×', label: 'faster lip sync after a rebuild' },
        { value: '1', label: 'MacBook. No studio.' },
      ],
      code:
        'A chain of stages glued together by timestamps — each one swappable as better models appear. The pipeline stays private while it’s an experiment.',
    },
  },
  {
    slug: 'creatorcut',
    name: 'CreatorCut',
    category: 'AI × Video × Creator Tools',
    tagline: 'Record once. Publish everywhere.',
    summary:
      'A Mac + iPhone camera app that turns one take into a 9:16 reel and a 16:9 video — with a face-tracked smart crop and a teleprompter that listens.',
    status: 'Released · App Store',
    year: '2026',
    platforms: 'macOS 14+ · iOS 17+ · iPadOS',
    stack: ['Swift', 'SwiftUI', 'AVFoundation', 'Vision', 'Speech', 'VideoToolbox', 'StoreKit'],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/in/app/creatorcut/id6770961941', kind: 'store' },
      { label: 'Website', href: 'https://rohitsainier.github.io/pages/creatorcut/', kind: 'site' },
    ],
    visual: 'creatorcut',
    media: [
      { video: 'work/creatorcut-dual', caption: 'Dual preview — the reel and the wide shot, live, from one camera', aspect: '16/9' },
      { video: 'work/creatorcut-crop', caption: 'Vision tracks the face; the 9:16 window follows it, smoothed', aspect: '16/9' },
      { video: 'work/creatorcut-prompter', caption: 'A teleprompter that scrolls at your speaking pace', aspect: '16/9' },
      { video: 'work/creatorcut-mac', caption: 'Both cuts land side by side on the Mac', aspect: '16/9' },
    ],
    story: {
      idea:
        'Every creator I know records the same video twice — once vertical, once wide — or crops one and loses the shot. The camera already sees enough pixels for both. Nobody frames for two aspect ratios at once.',
      experiment:
        'Capture one wide 16:9 frame, track the face on every frame, and cut a smoothed 9:16 window that follows the speaker. Then put a teleprompter on top that scrolls with your voice — and waits when you pause.',
      experimentPoints: [
        'Wide capture at up to 3840×2160; the reel is cut from it at 1080×1920.',
        'Vision face tracking on the Neural Engine, with a low-pass on the crop centre so small head moves never jitter.',
        'On-device speech recognition drives the prompter — it reads with you.',
        'Both renders run in parallel after you stop, typically faster than realtime.',
      ],
      technology:
        'Everything happens on the device: no accounts, no cloud, no analytics, no network calls. The app is sandboxed and ships as one universal purchase for Mac and iPhone.',
      pipeline: [
        { stage: 'Capture', detail: 'AVFoundation · 16:9 · up to 4K' },
        { stage: 'Track', detail: 'Vision face landmarks · Neural Engine' },
        { stage: 'Frame', detail: 'Smoothed 9:16 crop window' },
        { stage: 'Prompt', detail: 'Speech framework · on-device' },
        { stage: 'Render', detail: 'VideoToolbox H.265 · parallel' },
      ],
      interface:
        'A split preview shows both outputs live: the reel on the left with a face ring, the wide shot on the right with the reel’s crop box drawn inside it.',
      result:
        'Shipped on the App Store for Mac, iPhone and iPad. One take, two finished videos, zero re-editing.',
      stats: [
        { value: '1 → 2', label: 'takes → finished formats' },
        { value: '4K', label: 'landscape master' },
        { value: '0', label: 'network calls' },
        { value: '<1×', label: 'realtime render on Apple silicon' },
      ],
      code: 'Closed source. Built in Swift and SwiftUI; one codebase for iOS and Mac Catalyst.',
    },
  },
  {
    slug: 'flux-terminal',
    name: 'Flux Terminal',
    category: 'AI × Developer Tools',
    tagline: 'A terminal that understands intent.',
    summary:
      'A GPU-accelerated terminal that turns plain English into shell commands, speaks MCP, and ships 28 network tools and peer-to-peer file sharing — in Rust and Tauri.',
    status: 'Open source · MIT',
    year: '2026',
    platforms: 'macOS · Linux · Windows',
    stack: ['Rust', 'Tauri 2', 'SolidJS', 'TypeScript', 'xterm.js · WebGL', 'MCP', 'Ollama · OpenAI · Claude'],
    links: [{ label: 'GitHub', href: 'https://github.com/rohitsainier/terminal', kind: 'github' }],
    visual: 'flux',
    media: [],
    story: {
      idea:
        'The terminal is the most powerful app on my machine and the least forgiving. I kept alt-tabbing to a chatbot to remember find flags. The AI should live where the commands run — and it should warn me before rm -rf.',
      experiment:
        '⌘K takes a sentence and returns a command, flags the dangerous ones, and explains or runs it in one keystroke. Then I kept going.',
      experimentPoints: [
        'Plain English → shell, with danger detection and an explain mode.',
        'An AI + MCP chat panel — the terminal is a full MCP client.',
        'NETOPS: 28 network and security tools in one dashboard.',
        'BharatLink built in: drag a file onto a peer, encrypted end to end.',
        'A render layer with CRT scanlines, matrix rain, keystroke particles and a holographic sweep.',
      ],
      technology:
        'A Rust core owns the PTYs, SSH, MCP and networking; SolidJS drives the UI; xterm.js renders through WebGL so effects never cost a frame.',
      pipeline: [
        { stage: 'Intent', detail: '⌘K · natural language' },
        { stage: 'Model', detail: 'Ollama · OpenAI · Claude' },
        { stage: 'Guard', detail: 'Danger check · explain' },
        { stage: 'PTY', detail: 'Rust · Tauri 2' },
        { stage: 'Render', detail: 'xterm.js · WebGL · effects' },
      ],
      interface:
        'Six themes — Hacker Green, Cyberpunk, Matrix, Ghost Protocol, Tron, Midnight — and shortcuts for everything: ⌘K AI bar, ⌘P palette, ⌘⇧N NETOPS, ⌘⇧B BharatLink.',
      result: 'An open-source terminal that feels like an instrument rather than a text box.',
      stats: [
        { value: '28', label: 'NETOPS tools' },
        { value: '3', label: 'AI providers' },
        { value: '6', label: 'themes' },
        { value: '~21k', label: 'lines of Rust + TS' },
      ],
      code: 'MIT licensed. Rust + Tauri 2 backend, SolidJS front end.',
      install: 'git clone https://github.com/rohitsainier/terminal',
    },
  },
  {
    slug: 'ev-battery-simulator',
    name: 'EV Battery Simulator',
    category: 'Simulation × Energy',
    tagline: 'Turning battery behavior into something you can explore.',
    summary:
      'A physically grounded model of an EV pack on a WLTP-class drive cycle — current, heat, state of charge and the slow arithmetic of aging.',
    status: 'Prototype',
    year: '2026',
    platforms: 'Python · Web',
    stack: ['Python', 'NumPy', 'Matplotlib', 'TypeScript', 'Canvas'],
    links: [{ label: 'Full simulator', href: SIMULATOR, kind: 'live' }],
    visual: 'battery',
    media: [],
    story: {
      idea:
        'Battery health is usually one percentage on a dashboard. Underneath it is a tangle of chemistry, resistance, heat and time. I wanted to see those relationships move — and to let anyone drag a pack through ten years of its life.',
      experiment:
        'A chain of small, honest models. A speed trace becomes power demand, power becomes current, current becomes heat, and cycles become fade.',
      experimentPoints: [
        'Longitudinal vehicle dynamics: rolling, aero and inertia, with regen limits.',
        'An R-int equivalent circuit solves current from power at every second.',
        'Coulomb counting tracks state of charge; I²R losses feed a lumped thermal model.',
        'Square-root-of-throughput aging projects capacity fade and resistance growth.',
        'SOH is then recovered blind from noisy logs — by capacity and by resistance.',
      ],
      technology:
        'The original is a Python model with NumPy and Matplotlib. The lab on this site is a TypeScript port that runs the same equations live in your browser.',
      pipeline: [
        { stage: 'Drive cycle', detail: 'WLTP-class · 1 Hz · 1,604 s' },
        { stage: 'Vehicle', detail: '1,650 kg · Cd 0.28 · 2.3 m²' },
        { stage: 'Pack', detail: '96S35P NMC · 60.5 kWh · R-int' },
        { stage: 'Thermal', detail: 'I²R heat · lumped mass' },
        { stage: 'Aging', detail: '√EFC fade · EOL at 80%' },
      ],
      interface:
        'Drag the pack’s age and watch resistance climb, heat build and range shrink — while a live drive cycle pulls current through every cell.',
      result:
        'A model you can argue with. The pack crosses 80% capacity after about 1,270 equivalent full cycles — roughly 425,000 km of WLTP-style driving — and its internal resistance doubles by 1,500.',
      stats: [
        { value: '60.5', label: 'kWh pack (96S35P)' },
        { value: '1,604 s', label: 'drive cycle, 1 Hz' },
        { value: '2', label: 'independent SOH estimators' },
        { value: '~1,270', label: 'cycles to 80% capacity' },
      ],
      code: 'Python model and a browser port; the equations are the same in both.',
    },
  },
  {
    slug: 'bharatlink',
    name: 'BharatLink',
    category: 'Networking × Privacy × Rust',
    tagline: 'India’s AirDrop for the terminal.',
    summary:
      'Sovereign peer-to-peer sharing of files, text and clipboard. No servers, no accounts, no cloud — QUIC and TLS 1.3, end to end.',
    status: 'Open source · crates.io',
    year: '2026',
    platforms: 'macOS · Linux · Windows',
    stack: ['Rust', 'QUIC · iroh', 'iroh-blobs', 'mDNS', 'TLS 1.3', 'Ed25519', 'BLAKE3'],
    links: [
      { label: 'crates.io', href: 'https://crates.io/crates/bharatlink', kind: 'crate' },
      { label: 'GitHub', href: 'https://github.com/rohitsainier/terminal', kind: 'github' },
    ],
    visual: 'bharatlink',
    media: [{ video: 'work/bharatlink-cli', caption: 'send file — connected over QUIC, encrypted, 15.7 MB/s', aspect: '1000/620' }],
    story: {
      idea:
        'Sending a file to the laptop next to you still goes through a data center in another country. AirDrop solved it for one ecosystem. I wanted the same thing for everyone else — and for it to belong to nobody.',
      experiment:
        'Peers find each other and talk directly. When they can’t, a relay helps them meet but never sees a byte.',
      experimentPoints: [
        'mDNS discovery on the LAN in under a second.',
        'QUIC with relay fallback across NATs and firewalls.',
        'Ed25519 identities; trust a peer by public key.',
        'BLAKE3-verified chunks; transfers dedupe and resume.',
        'Files, text and clipboard over one connection.',
      ],
      technology:
        'A Rust library (bharatlink-core) with a CLI on top, embedded as a GUI inside Flux Terminal and — in progress — an iOS app via UniFFI.',
      pipeline: [
        { stage: 'Discover', detail: 'mDNS · LAN < 1 s' },
        { stage: 'Connect', detail: 'QUIC · relay fallback' },
        { stage: 'Encrypt', detail: 'TLS 1.3 · Ed25519' },
        { stage: 'Transfer', detail: 'iroh-blobs · BLAKE3 · resume' },
      ],
      interface: 'A terminal first: bharatlink start, trust, send. The same engine powers a chat-style panel inside Flux.',
      result: 'Published on crates.io as a ~15 MB static binary for macOS, Linux and Windows.',
      stats: [
        { value: '0', label: 'servers that see your data' },
        { value: '<1 s', label: 'LAN discovery' },
        { value: '~15 MB', label: 'single static binary' },
        { value: 'E2E', label: 'QUIC + TLS 1.3' },
      ],
      code: 'Open source. Library + CLI on crates.io.',
      install: 'cargo install bharatlink',
    },
  },
  {
    slug: 'quickkit',
    name: 'QuickKit',
    category: 'macOS × Developer Tools',
    tagline: '25+ tools, one click away.',
    summary:
      'The JSON formatter, JWT decoder, color picker and password generator you keep searching for — living in the macOS menu bar, fully offline.',
    status: 'Free · Mac App Store',
    year: '2026',
    platforms: 'macOS 14+',
    stack: ['Swift', 'SwiftUI', 'AppKit'],
    links: [{ label: 'Mac App Store', href: 'https://apps.apple.com/in/app/quickkit/id6760336852?mt=12', kind: 'store' }],
    visual: 'quickkit',
    media: [{ video: 'work/quickkit-menubar', caption: 'Lives in the menu bar — one click away', aspect: '16/9' }],
    story: {
      idea:
        'Every day I pasted JSON, JWTs and hex codes into websites I didn’t trust with them. The tools were trivial; the context switch was not.',
      experiment: 'A native panel behind a bolt in the menu bar, searchable with ⌘K, with favourites pinned on top.',
      experimentPoints: [
        'Developer: JSON, JWT, Base64, regex, hashes, UUID, epoch, URL, cron, Markdown.',
        'Text: compare, case, lorem, counter, speech, emoji.',
        'Design: color generator, system-wide eyedropper, image compressor, watermark.',
        'Utility: passwords, QR, units, BMI, URL shortener.',
      ],
      technology: 'Pure Swift and SwiftUI with AppKit for the status item. No Electron, no dependencies, no Dock icon.',
      pipeline: [
        { stage: 'Status item', detail: 'AppKit · menu bar' },
        { stage: 'Search', detail: '⌘K · fuzzy' },
        { stage: 'Tool', detail: 'SwiftUI · offline' },
      ],
      interface: 'A compact dark panel: search on top, favourites, then 25+ tools in four groups.',
      result: 'Free on the Mac App Store, forever, with no in-app purchases.',
      stats: [
        { value: '25+', label: 'tools' },
        { value: '0', label: 'dependencies' },
        { value: '100%', label: 'offline (bar one shortener)' },
        { value: '$0', label: 'forever' },
      ],
      code: 'Built with SwiftUI; distributed through the Mac App Store.',
    },
  },
  {
    slug: 'linkedcomment',
    name: 'LinkedComment',
    category: 'AI × Automation',
    tagline: 'AI comments that actually get reach.',
    summary:
      'A Chrome extension that spots high-reach posts on LinkedIn and X and drafts a comment in the voice you choose — with your own model and key.',
    status: 'Free · Open source',
    year: '2026',
    platforms: 'Chrome',
    stack: ['JavaScript', 'Chrome Extensions', 'OpenAI', 'Gemini', 'Claude', 'Ollama'],
    links: [
      { label: 'Chrome Web Store', href: 'https://chromewebstore.google.com/detail/linkedcomment-%E2%80%94-ai-commen/odicebaikojbnipgkeoemijoacodmkjd', kind: 'store' },
      { label: 'GitHub', href: 'https://github.com/rohitsainier/linkedit', kind: 'github' },
    ],
    visual: 'linkedcomment',
    media: [{ video: 'work/linkedcomment-flow', caption: 'Badge → style → insert', aspect: '16/9' }],
    story: {
      idea:
        'An early, thoughtful comment on the right post does more for reach than a post of your own. Finding those posts — and writing something worth reading — takes time nobody has.',
      experiment: 'Score the feed, badge what’s trending, and draft a reply in one of five styles.',
      experimentPoints: [
        'Trending, Hot and Viral badges, colour-coded in the feed.',
        'Five styles: Insightful, Supportive, Curious, Contrarian, Criticize.',
        'An optional personal angle — “as a startup founder”.',
        'Bring your own model: OpenAI, Gemini, Claude or local Ollama.',
      ],
      technology: 'A content script reads the post, a background worker calls your provider with your key, and nothing touches a server of mine.',
      pipeline: [
        { stage: 'Post', detail: 'Feed · reach score' },
        { stage: 'Analyse', detail: 'Topic · tone · angle' },
        { stage: 'Generate', detail: 'Your model · your key' },
        { stage: 'Insert', detail: 'One click' },
      ],
      interface: 'It lives inside the feed. Click a badge, pick a style, insert.',
      result: 'Live on the Chrome Web Store, free and open source.',
      stats: [
        { value: '5', label: 'comment styles' },
        { value: '4', label: 'AI providers' },
        { value: '0', label: 'servers' },
        { value: '1', label: 'click to insert' },
      ],
      code: 'Open source on GitHub (repo: linkedit).',
    },
  },
  {
    slug: 'md-to-medium',
    name: 'MD to Medium',
    category: 'Writing × Developer Tools',
    tagline: 'Markdown in. Medium-ready out.',
    summary:
      'Write or paste Markdown or HTML, preview it in Medium’s typography, and copy rich text that pastes straight into the Medium editor with formatting intact.',
    status: 'Free · Live',
    year: '2026',
    platforms: 'Web',
    stack: ['JavaScript', 'marked (GFM)', 'Clipboard API', 'localStorage'],
    links: [{ label: 'Open the tool', href: 'https://rohitsainier.github.io/pages/mdtomedium/', kind: 'live' }],
    visual: 'mdtomedium',
    media: [],
    story: {
      idea: 'Medium’s editor doesn’t speak Markdown. Every article I wrote lost its headings and code blocks on the way in.',
      experiment: 'A single-file web app with a live Medium-style preview and a clipboard payload the Medium editor accepts as rich text.',
      experimentPoints: [
        'Markdown and HTML modes, each with its own autosaved draft.',
        'Serif preview with pull quotes and · · · dividers.',
        'Pasted HTML is sanitised — no javascript: or data: links survive.',
        'Word count, read time, and ⌘⇧C to copy for Medium.',
      ],
      technology: 'No backend. marked for GFM, the Clipboard API for rich text, localStorage for drafts.',
      pipeline: [
        { stage: 'Write', detail: 'Markdown · HTML' },
        { stage: 'Parse', detail: 'marked · GFM' },
        { stage: 'Sanitise', detail: 'Safe tags only' },
        { stage: 'Copy', detail: 'text/html clipboard' },
      ],
      interface: 'Editor on the left, Medium on the right; on phones it becomes Edit / Preview tabs.',
      result: 'A free tool I use for every article I publish.',
      stats: [
        { value: '0', label: 'backend' },
        { value: '2', label: 'input modes' },
        { value: '600 ms', label: 'autosave' },
        { value: '1', label: 'paste into Medium' },
      ],
      code: 'One HTML file. View source.',
    },
  },
  {
    slug: 'stylesnap',
    name: 'StyleSnap',
    category: 'Browser Tools × Frontend',
    tagline: 'Inspect CSS instantly.',
    summary:
      'Hover any element on any site to see its computed CSS, then copy it as CSS, Tailwind, SCSS or a JS object — or export a whole component.',
    status: 'Freemium · Chrome Web Store',
    year: '2026',
    platforms: 'Chrome',
    stack: ['JavaScript', 'Chrome Extensions', 'Content scripts'],
    links: [
      { label: 'Chrome Web Store', href: 'https://chromewebstore.google.com/detail/stylesnap-%E2%80%94-instant-css-i/hcfbhgjjejahcgnjibhehpdihhpebhok', kind: 'store' },
      { label: 'GitHub', href: 'https://github.com/rohitsainier/stylesnap', kind: 'github' },
    ],
    visual: 'stylesnap',
    media: [{ video: 'work/stylesnap-inspect', caption: 'Hover to inspect', aspect: '16/9' }],
    story: {
      idea: 'DevTools is built for debugging, not for borrowing. I wanted to point at a button and walk away with its styles.',
      experiment: 'A content script that draws a colour-coded box model over the hovered element and groups its computed styles.',
      experimentPoints: [
        'Hover to inspect; arrow keys walk parent, child and sibling.',
        'Space pins the panel.',
        'Copy as CSS, Tailwind, SCSS or a JS object.',
        'Pro: export React, Vue or HTML+CSS components; full-page capture.',
      ],
      technology: 'Manifest permissions kept to activeTab, scripting and storage. Pro licences are checked against Gumroad.',
      pipeline: [
        { stage: 'Hover', detail: 'Box-model overlay' },
        { stage: 'Read', detail: 'getComputedStyle' },
        { stage: 'Group', detail: 'Layout · type · colour' },
        { stage: 'Export', detail: 'CSS · Tailwind · SCSS · JS' },
      ],
      interface: 'A floating panel that follows your pointer, with tabs for each export format.',
      result: 'Live on the Chrome Web Store with a free tier and a $1.99/month Pro.',
      stats: [
        { value: '4', label: 'export formats' },
        { value: '3', label: 'component targets' },
        { value: '3', label: 'permissions' },
        { value: '$0', label: 'to start' },
      ],
      code: 'Source on GitHub.',
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const featuredSlugs = ['creatorcut', 'flux-terminal'] as const;
export const selectedSlugs = ['bharatlink', 'quickkit', 'linkedcomment', 'md-to-medium', 'stylesnap'] as const;
