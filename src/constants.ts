// StrateKaz Brand Constants — Source of Truth

export const BRAND = {
  // Primary
  primary: '#ec268f',
  primaryHover: '#db2777',
  primaryDark: '#be185d',
  primaryLight: '#f9a8d4',
  primarySubtle: '#fdf2f8',

  // Backgrounds
  bgDeep: '#030712',
  bgCard: '#0a0a0a',
  bgSurface: '#111827',
  bgElevated: '#1f2937',

  // Text
  white: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  textSubtle: 'rgba(255, 255, 255, 0.5)',

  // Accent
  amber: '#f59e0b',
  amberLight: '#fcd34d',

  // ISO System Colors
  iso9001: '#3b82f6',   // Quality - Blue
  iso14001: '#22c55e',  // Environment - Green
  iso45001: '#ef4444',  // Safety - Red
  iso27001: '#8b5cf6',  // InfoSec - Violet

  // Module Group Colors (Sidebar)
  fundacion: '#3B82F6',
  planeacion: '#6366F1',
  sgi: '#0EA5E9',
  operaciones: '#10B981',
  organizacion: '#F59E0B',
  inteligencia: '#8B5CF6',

  // Status
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
} as const;

export const FONTS = {
  heading: "'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

// Safe zones for mobile vertical video
export const SAFE = {
  top: 150,
  bottom: 170,
  sides: 60,
} as const;

// Video config
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationSeconds: 60,
  get durationFrames() { return this.fps * this.durationSeconds; },
} as const;

// Scene timing (in frames at 30fps)
export const SCENES = {
  hook:     { from: 0,    duration: 150 },  // 0-5s
  intro:    { from: 150,  duration: 150 },  // 5-10s
  pilares:  { from: 300,  duration: 450 },  // 10-25s
  demo:     { from: 750,  duration: 450 },  // 25-40s
  iso:      { from: 1200, duration: 300 },  // 40-50s
  cta:      { from: 1500, duration: 300 },  // 50-60s
} as const;
