export type Status = 'EXPERIMENT' | 'PROTOTYPE' | 'OPEN SOURCE' | 'IN PROGRESS' | 'SHIPPED';

export interface Experiment {
  name: string;
  area: string;
  line: string;
  status: Status;
  /** generative glyph used on the tile */
  glyph: 'wave' | 'face' | 'grid' | 'orbit' | 'bars' | 'nodes' | 'rings' | 'scan' | 'type' | 'cells';
  video?: string;
  href?: string;
}

export const areas = [
  'AI Video',
  'AI Agents',
  'Creative Automation',
  'Computer Vision',
  'MCP',
  'Local AI',
  'Simulation',
  'Developer Tools',
] as const;

export const experiments: Experiment[] = [
  { name: 'Relay Newsroom', area: 'AI Video', status: 'IN PROGRESS', glyph: 'face', line: 'A self-hosted news channel with a synthetic presenter. RSS in, anchored reels out, on autopilot.' },
  { name: 'Lip Sync Engine', area: 'AI Video', status: 'EXPERIMENT', glyph: 'wave', line: 'Regenerates only the mouth, frame by frame — rebuilt to run 2.73× faster on a laptop.' },
  { name: 'Editra', area: 'AI Video', status: 'IN PROGRESS', glyph: 'type', video: 'work/editra-transcript', line: 'A Mac creator studio: auto-captions, voices, talking heads and background removal — on-device.' },
  { name: 'Reader', area: 'AI Agents', status: 'PROTOTYPE', glyph: 'rings', line: 'A real-time voice agent with a lip-synced avatar you can interrupt mid-sentence.' },
  { name: 'DeskAgent', area: 'AI Agents', status: 'EXPERIMENT', glyph: 'nodes', line: 'A local LLM that operates Mac apps by reading their accessibility tree.' },
  { name: 'FrameForge', area: 'Creative Automation', status: 'PROTOTYPE', glyph: 'bars', line: 'A video editor you instruct in plain English — 80+ actions, driven by a local model.' },
  { name: 'Articast', area: 'Creative Automation', status: 'IN PROGRESS', glyph: 'type', line: 'Paste an article, get a narrated, captioned video with word-timed speech.' },
  { name: 'ShaderCut', area: 'Creative Automation', status: 'PROTOTYPE', glyph: 'orbit', line: 'Videos built from Metal shader scenes on a keyframed timeline.' },
  { name: 'H2V', area: 'Computer Vision', status: 'SHIPPED', glyph: 'scan', line: 'Horizontal to vertical with speaker tracking. Cut newsroom repurposing time by 80%.' },
  { name: 'Smart Crop', area: 'Computer Vision', status: 'SHIPPED', glyph: 'scan', href: 'work/creatorcut', line: 'Vision face tracking that keeps a 9:16 window on the speaker — the core of CreatorCut.' },
  { name: 'Blender MCP', area: 'MCP', status: 'EXPERIMENT', glyph: 'cells', line: '80 tools that let a model model — meshes, materials, lights, renders.' },
  { name: 'FreeCAD MCP', area: 'MCP', status: 'EXPERIMENT', glyph: 'grid', line: 'Parametric CAD from a sentence: sketches, pads, fillets, STEP export.' },
  { name: 'Figma MCP', area: 'MCP', status: 'EXPERIMENT', glyph: 'grid', line: '22 tools for frames, auto-layout and components, driven by a plugin.' },
  { name: 'MathViz MCP', area: 'MCP', status: 'EXPERIMENT', glyph: 'orbit', line: 'Fractals, raymarching and shaders rendered by conversation.' },
  { name: 'Voice Lab', area: 'Local AI', status: 'IN PROGRESS', glyph: 'wave', line: 'Voice activity detection, a live voice changer and a translating voice chat — all local.' },
  { name: 'Voice Studio', area: 'Local AI', status: 'EXPERIMENT', glyph: 'wave', line: 'Indian-language voice cloning with a podcast UI and an API.' },
  { name: 'Rishi', area: 'Local AI', status: 'PROTOTYPE', glyph: 'rings', line: 'Talk to local LLMs out loud — then make them battle for a leaderboard.' },
  { name: 'Inkling', area: 'Local AI', status: 'IN PROGRESS', glyph: 'type', video: 'work/inkling', line: 'Quote cards, beautifully typeset, with AI-generated backgrounds.' },
  { name: 'EV Battery SOH', area: 'Simulation', status: 'PROTOTYPE', glyph: 'cells', href: 'work/ev-battery-simulator', line: 'Drive cycle → pack load → state of health, from first principles.' },
  { name: 'NestPack', area: 'Simulation', status: 'PROTOTYPE', glyph: 'grid', line: 'Nests box dielines on sheet stock and prices the waste — with a 3D fold preview.' },
  { name: 'SimPilot', area: 'Developer Tools', status: 'IN PROGRESS', glyph: 'bars', line: 'A companion panel for the iOS Simulator with 27 tools.' },
  { name: 'BharatLink', area: 'Developer Tools', status: 'OPEN SOURCE', glyph: 'nodes', href: 'work/bharatlink', line: 'Peer-to-peer files over QUIC. No servers, no accounts.' },
  { name: 'Vista', area: 'Developer Tools', status: 'SHIPPED', glyph: 'scan', line: 'A Mac browser that is invisible to screen share.' },
  { name: 'MechKeys', area: 'Developer Tools', status: 'SHIPPED', glyph: 'bars', line: 'Mechanical keyboard sounds for any Mac — 47 packs, zero latency.' },
];

/* ——— Technology constellation ——— */
export interface TechNode { id: string; label: string; x: number; y: number; size?: number }
export interface Work { id: string; name: string; href?: string }

export const works: Record<string, Work> = {
  dub: { id: 'dub', name: 'AI Video Dubbing', href: 'work/ai-video-dubbing' },
  creatorcut: { id: 'creatorcut', name: 'CreatorCut', href: 'work/creatorcut' },
  flux: { id: 'flux', name: 'Flux Terminal', href: 'work/flux-terminal' },
  battery: { id: 'battery', name: 'EV Battery Simulator', href: 'work/ev-battery-simulator' },
  bharatlink: { id: 'bharatlink', name: 'BharatLink', href: 'work/bharatlink' },
  quickkit: { id: 'quickkit', name: 'QuickKit', href: 'work/quickkit' },
  linkedcomment: { id: 'linkedcomment', name: 'LinkedComment', href: 'work/linkedcomment' },
  md: { id: 'md', name: 'MD to Medium', href: 'work/md-to-medium' },
  stylesnap: { id: 'stylesnap', name: 'StyleSnap', href: 'work/stylesnap' },
  inkling: { id: 'inkling', name: 'Inkling' },
  vista: { id: 'vista', name: 'Vista' },
  editra: { id: 'editra', name: 'Editra' },
  relay: { id: 'relay', name: 'Relay Newsroom' },
  lipsync: { id: 'lipsync', name: 'Lip Sync Engine' },
  creative: { id: 'creative', name: 'AI Creative Stack', href: '#lab' },
  h2v: { id: 'h2v', name: 'H2V' },
  deskagent: { id: 'deskagent', name: 'DeskAgent' },
  frameforge: { id: 'frameforge', name: 'FrameForge' },
  articast: { id: 'articast', name: 'Articast' },
  simpilot: { id: 'simpilot', name: 'SimPilot' },
  ltapp: { id: 'ltapp', name: 'LTApp — iPhone → browser streaming' },
  site: { id: 'site', name: 'This website' },
  rishi: { id: 'rishi', name: 'Rishi' },
};

/** x/y in a 1000×620 design space */
export const tech: (TechNode & { uses: (keyof typeof works)[] })[] = [
  { id: 'swift', label: 'Swift', x: 120, y: 150, size: 1.25, uses: ['creatorcut', 'quickkit', 'inkling', 'vista', 'editra', 'simpilot'] },
  { id: 'swiftui', label: 'SwiftUI', x: 250, y: 90, size: 1.15, uses: ['creatorcut', 'quickkit', 'inkling', 'vista', 'simpilot'] },
  { id: 'vision', label: 'Vision', x: 300, y: 250, uses: ['creatorcut', 'editra'] },
  { id: 'coreml', label: 'Core ML', x: 160, y: 330, uses: ['editra', 'creatorcut'] },
  { id: 'cv', label: 'Computer Vision', x: 420, y: 170, size: 1.05, uses: ['creatorcut', 'dub', 'h2v'] },
  { id: 'ai', label: 'AI / LLMs', x: 560, y: 300, size: 1.5, uses: ['dub', 'linkedcomment', 'flux', 'creative', 'deskagent', 'rishi'] },
  { id: 'mcp', label: 'MCP', x: 700, y: 180, size: 1.1, uses: ['creative', 'flux'] },
  { id: 'ollama', label: 'Ollama', x: 720, y: 400, uses: ['flux', 'linkedcomment', 'rishi', 'deskagent', 'frameforge'] },
  { id: 'python', label: 'Python', x: 420, y: 430, size: 1.2, uses: ['dub', 'battery', 'relay', 'lipsync', 'frameforge'] },
  { id: 'video', label: 'Video Processing', x: 300, y: 520, size: 1.1, uses: ['dub', 'creatorcut', 'relay', 'h2v', 'editra'] },
  { id: 'ffmpeg', label: 'FFmpeg', x: 150, y: 470, uses: ['relay', 'h2v'] },
  { id: 'rust', label: 'Rust', x: 860, y: 110, size: 1.2, uses: ['bharatlink', 'flux'] },
  { id: 'ts', label: 'TypeScript', x: 880, y: 300, uses: ['flux', 'site', 'articast', 'battery'] },
  { id: 'js', label: 'JavaScript', x: 830, y: 500, uses: ['linkedcomment', 'stylesnap', 'md'] },
  { id: 'react', label: 'React', x: 640, y: 540, uses: ['articast'] },
  { id: 'webrtc', label: 'WebRTC', x: 520, y: 80, uses: ['ltapp'] },
  { id: 'cloud', label: 'Cloud / APIs', x: 560, y: 470, uses: ['linkedcomment', 'relay', 'stylesnap'] },
];
