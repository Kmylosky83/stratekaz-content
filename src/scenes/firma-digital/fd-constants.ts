import { FONTS } from '../../constants';

// Firma Digital — Light theme palette
export const FD = {
  // Backgrounds (white/light)
  bgPure: '#ffffff',
  bgSoft: '#f8fafc',
  bgCard: '#f1f5f9',
  bgDark: '#0f172a',

  // Primary (StrateKaz rosa)
  primary: '#ec268f',
  primaryDark: '#be185d',
  primaryLight: '#fce7f3',
  primarySubtle: '#fdf2f8',

  // Text (dark on light)
  textDark: '#0f172a',
  textBody: '#334155',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',

  // Security layers colors
  layerBlue: '#3b82f6',
  layerGreen: '#22c55e',
  layerAmber: '#f59e0b',
  layerRed: '#ef4444',
  layerViolet: '#8b5cf6',
  layerCyan: '#06b6d4',
  layerPink: '#ec4899',

  // Accents
  success: '#22c55e',
  shield: '#3b82f6',

  // Borders
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
} as const;

export const FD_FONTS = FONTS;

export const FD_SAFE = {
  top: 150,
  bottom: 170,
  sides: 60,
} as const;
