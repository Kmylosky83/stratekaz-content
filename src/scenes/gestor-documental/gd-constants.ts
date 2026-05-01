import { FONTS } from '../../constants';

// Gestor Documental — Dark Neon palette
export const GD = {
  // Backgrounds
  bgDeep: '#030712',
  bgSurface: '#111827',
  bgElevated: '#1f2937',
  bgCard: '#0f172a',

  // Primary (StrateKaz magenta)
  primary: '#ec268f',
  primaryGlow: 'rgba(236, 38, 143, 0.3)',
  primarySubtle: 'rgba(236, 38, 143, 0.08)',

  // Accents
  cyan: '#00E5FF',
  cyanGlow: 'rgba(0, 229, 255, 0.3)',
  green: '#00C853',
  greenGlow: 'rgba(0, 200, 83, 0.3)',
  amber: '#FFB300',
  amberGlow: 'rgba(255, 179, 0, 0.3)',
  violet: '#8B5CF6',
  violetGlow: 'rgba(139, 92, 246, 0.3)',

  // Text
  textWhite: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  textSubtle: 'rgba(255, 255, 255, 0.5)',

  // Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderGlow: 'rgba(236, 38, 143, 0.15)',

  // Neon glows
  neonGlow: '0 0 20px rgba(236, 38, 143, 0.3)',
  cyanNeonGlow: '0 0 20px rgba(0, 229, 255, 0.3)',
  greenNeonGlow: '0 0 20px rgba(0, 200, 83, 0.3)',
} as const;

export const GD_FONTS = FONTS;
