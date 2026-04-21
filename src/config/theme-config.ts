// THEME CONFIG — Visual tokens (colors, typography, radius, effects) per preset.
// Exposed as CSS custom properties injected at SSR from app/layout.tsx.
// Components consume via Tailwind utilities registered in globals.css
// (bg-brand-*, text-brand-*, font-brand-*, rounded-brand-*)
// or via direct `var(--brand-...)` in inline styles.

export type ThemeId = 'classic' | 'urban' | 'minimal' | 'club' | 'natural' | 'obsidian';

export type ThemeColors = {
  bg: string;
  bgElevated: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderHover: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  accent: string;
  ring: string;
  success: string;
  danger: string;
};

export type ThemeGradients = {
  primary: string; // full CSS gradient for main CTA
  hero: string;    // warm/cold wash behind hero image
};

export type ThemeTypography = {
  serifFamily: string;  // CSS font-family string (uses next/font variables)
  sansFamily: string;
  displayTracking: string; // tracking for display headlines (e.g. "-0.02em")
  displayItalic: boolean;   // whether the accent headline piece is italic
};

export type ThemeRadius = {
  base: string;   // cards, inputs
  lg: string;     // hero / large surfaces
  pill: string;   // CTAs, chips
};

export type ThemeEffects = {
  shadowCard: string;
  shadowCta: string;
  // A short-hand "style" flag components can branch on when CSS alone is not enough.
  mood: 'premium' | 'brutal' | 'editorial' | 'velvet' | 'organic';
};

export type Theme = {
  id: ThemeId;
  label: string;
  colors: ThemeColors;
  gradients: ThemeGradients;
  typography: ThemeTypography;
  radius: ThemeRadius;
  effects: ThemeEffects;
};

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

// Font-family strings reference next/font variables loaded in app/layout.tsx.
// Fallbacks ensure sensible rendering while the remote font loads.
const FONT = {
  playfair: 'var(--font-playfair), "Playfair Display", Georgia, serif',
  fraunces: 'var(--font-fraunces), "Fraunces", Georgia, serif',
  bebas: 'var(--font-bebas), "Bebas Neue", Impact, sans-serif',
  geist: 'var(--font-geist-sans), "Geist", system-ui, sans-serif',
  inter: 'var(--font-inter), "Inter", system-ui, sans-serif',
};

export const THEMES: Record<ThemeId, Theme> = {
  classic: {
    id: 'classic',
    label: 'Classic — Premium gold',
    colors: {
      bg: '#0A0707',
      bgElevated: '#0e0a09',
      surface: 'rgba(255,255,255,0.025)',
      surfaceHover: 'rgba(255,255,255,0.04)',
      border: 'rgba(255,255,255,0.06)',
      borderHover: 'rgba(251,191,36,0.3)',
      text: '#ffffff',
      textMuted: 'rgba(156,163,175,0.9)',
      textSubtle: 'rgba(107,114,128,0.9)',
      primary: '#f59e0b',
      primaryHover: '#fbbf24',
      primaryForeground: '#1a0f05',
      accent: '#fcd34d',
      ring: 'rgba(251,191,36,0.5)',
      success: '#10b981',
      danger: '#f43f5e',
    },
    gradients: {
      primary: 'linear-gradient(to bottom, #fbbf24, #f59e0b, #b45309)',
      hero: 'radial-gradient(ellipse at top left, rgba(251,191,36,0.25), transparent 50%), radial-gradient(ellipse at bottom right, rgba(180,83,9,0.22), transparent 55%)',
    },
    typography: {
      serifFamily: FONT.playfair,
      sansFamily: FONT.geist,
      displayTracking: '-0.02em',
      displayItalic: true,
    },
    radius: { base: '0.75rem', lg: '1.25rem', pill: '9999px' },
    effects: {
      shadowCard: '0 20px 60px -40px rgba(0,0,0,0.8)',
      shadowCta: '0 20px 60px -15px rgba(251,191,36,0.6)',
      mood: 'premium',
    },
  },

  urban: {
    id: 'urban',
    label: 'Urban — Red & concrete',
    colors: {
      bg: '#0a0a0a',
      bgElevated: '#111',
      surface: 'rgba(255,255,255,0.03)',
      surfaceHover: 'rgba(255,255,255,0.06)',
      border: 'rgba(255,255,255,0.08)',
      borderHover: 'rgba(239,68,68,0.35)',
      text: '#fafafa',
      textMuted: 'rgba(163,163,163,0.95)',
      textSubtle: 'rgba(115,115,115,0.9)',
      primary: '#dc2626',
      primaryHover: '#ef4444',
      primaryForeground: '#ffffff',
      accent: '#fca5a5',
      ring: 'rgba(239,68,68,0.5)',
      success: '#22c55e',
      danger: '#f43f5e',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #ef4444, #991b1b)',
      hero: 'radial-gradient(ellipse at top left, rgba(239,68,68,0.22), transparent 50%), radial-gradient(ellipse at bottom right, rgba(153,27,27,0.2), transparent 55%)',
    },
    typography: {
      serifFamily: FONT.bebas,
      sansFamily: FONT.inter,
      displayTracking: '0.02em',
      displayItalic: false,
    },
    radius: { base: '0.25rem', lg: '0.375rem', pill: '0.5rem' },
    effects: {
      shadowCard: '0 14px 40px -20px rgba(0,0,0,0.9)',
      shadowCta: '0 18px 50px -15px rgba(239,68,68,0.55)',
      mood: 'brutal',
    },
  },

  minimal: {
    id: 'minimal',
    label: 'Minimal — Monochrome editorial',
    colors: {
      bg: '#0a0a0a',
      bgElevated: '#111',
      surface: 'rgba(255,255,255,0.03)',
      surfaceHover: 'rgba(255,255,255,0.06)',
      border: 'rgba(255,255,255,0.1)',
      borderHover: 'rgba(255,255,255,0.35)',
      text: '#ffffff',
      textMuted: 'rgba(212,212,212,0.9)',
      textSubtle: 'rgba(115,115,115,0.9)',
      primary: '#ffffff',
      primaryHover: '#e5e5e5',
      primaryForeground: '#0a0a0a',
      accent: '#ffffff',
      ring: 'rgba(255,255,255,0.5)',
      success: '#22c55e',
      danger: '#f43f5e',
    },
    gradients: {
      primary: 'linear-gradient(to bottom, #ffffff, #d4d4d4)',
      hero: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06), transparent 60%)',
    },
    typography: {
      serifFamily: FONT.inter,
      sansFamily: FONT.inter,
      displayTracking: '-0.03em',
      displayItalic: false,
    },
    radius: { base: '0rem', lg: '0rem', pill: '0rem' },
    effects: {
      shadowCard: 'none',
      shadowCta: '0 10px 40px -20px rgba(255,255,255,0.25)',
      mood: 'editorial',
    },
  },

  club: {
    id: 'club',
    label: 'Club — Velvet & neon',
    colors: {
      bg: '#0a0413',
      bgElevated: '#100822',
      surface: 'rgba(217,70,239,0.04)',
      surfaceHover: 'rgba(217,70,239,0.08)',
      border: 'rgba(168,85,247,0.15)',
      borderHover: 'rgba(232,121,249,0.4)',
      text: '#f5f3ff',
      textMuted: 'rgba(216,180,254,0.85)',
      textSubtle: 'rgba(168,85,247,0.7)',
      primary: '#c026d3',
      primaryHover: '#d946ef',
      primaryForeground: '#fef3c7',
      accent: '#f0abfc',
      ring: 'rgba(217,70,239,0.5)',
      success: '#22c55e',
      danger: '#fb7185',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #d946ef, #7e22ce)',
      hero: 'radial-gradient(ellipse at top right, rgba(217,70,239,0.3), transparent 55%), radial-gradient(ellipse at bottom left, rgba(126,34,206,0.25), transparent 55%)',
    },
    typography: {
      serifFamily: FONT.playfair,
      sansFamily: FONT.inter,
      displayTracking: '-0.01em',
      displayItalic: true,
    },
    radius: { base: '0.5rem', lg: '1rem', pill: '9999px' },
    effects: {
      shadowCard: '0 20px 60px -35px rgba(217,70,239,0.3)',
      shadowCta: '0 22px 60px -15px rgba(217,70,239,0.55)',
      mood: 'velvet',
    },
  },

  obsidian: {
    id: 'obsidian',
    label: 'Obsidian — Black editorial',
    colors: {
      bg: '#050505',
      bgElevated: '#0a0a0a',
      surface: 'rgba(255,255,255,0.025)',
      surfaceHover: 'rgba(255,255,255,0.05)',
      border: 'rgba(255,255,255,0.09)',
      borderHover: 'rgba(212,165,116,0.55)',
      text: '#f5f5f5',
      textMuted: 'rgba(190,190,190,0.82)',
      textSubtle: 'rgba(120,120,120,0.8)',
      primary: '#b87333',
      primaryHover: '#cd8a4a',
      primaryForeground: '#0a0a0a',
      accent: '#d4a574',
      ring: 'rgba(184,115,51,0.5)',
      success: '#10b981',
      danger: '#f43f5e',
    },
    gradients: {
      primary: 'linear-gradient(180deg, #d4a574 0%, #b87333 50%, #7a4a1f 100%)',
      hero: 'radial-gradient(ellipse at top right, rgba(184,115,51,0.12), transparent 55%), radial-gradient(ellipse at bottom left, rgba(0,0,0,0.7), transparent 45%)',
    },
    typography: {
      serifFamily: FONT.bebas, // Display condensed used for headlines
      sansFamily: FONT.inter,
      displayTracking: '0.015em',
      displayItalic: false,
    },
    radius: { base: '0rem', lg: '0rem', pill: '0rem' },
    effects: {
      shadowCard: 'none',
      shadowCta: '0 18px 48px -16px rgba(184,115,51,0.45)',
      mood: 'editorial',
    },
  },

  natural: {
    id: 'natural',
    label: 'Natural — Forest & cream',
    colors: {
      bg: '#0d1512',
      bgElevated: '#101a16',
      surface: 'rgba(134,239,172,0.04)',
      surfaceHover: 'rgba(134,239,172,0.08)',
      border: 'rgba(134,239,172,0.12)',
      borderHover: 'rgba(74,222,128,0.4)',
      text: '#f5f5f0',
      textMuted: 'rgba(214,211,209,0.9)',
      textSubtle: 'rgba(168,162,158,0.85)',
      primary: '#16a34a',
      primaryHover: '#22c55e',
      primaryForeground: '#f5f5f0',
      accent: '#86efac',
      ring: 'rgba(34,197,94,0.5)',
      success: '#22c55e',
      danger: '#f43f5e',
    },
    gradients: {
      primary: 'linear-gradient(to bottom, #22c55e, #15803d)',
      hero: 'radial-gradient(ellipse at top left, rgba(34,197,94,0.22), transparent 55%), radial-gradient(ellipse at bottom right, rgba(21,128,61,0.2), transparent 55%)',
    },
    typography: {
      serifFamily: FONT.fraunces,
      sansFamily: FONT.inter,
      displayTracking: '-0.02em',
      displayItalic: true,
    },
    radius: { base: '1rem', lg: '1.5rem', pill: '9999px' },
    effects: {
      shadowCard: '0 20px 60px -35px rgba(0,0,0,0.7)',
      shadowCta: '0 22px 60px -15px rgba(34,197,94,0.45)',
      mood: 'organic',
    },
  },
};

export function getTheme(id: ThemeId): Theme {
  return THEMES[id] ?? THEMES.classic;
}

/**
 * Serializes a theme into a flat list of CSS custom property declarations.
 * Inject inside `:root { ... }` at SSR to avoid FOUC.
 */
export function themeToCssVars(theme: Theme): string {
  const { colors: c, gradients: g, typography: t, radius: r, effects: e } = theme;
  const decls: Record<string, string> = {
    '--brand-bg': c.bg,
    '--brand-bg-elevated': c.bgElevated,
    '--brand-surface': c.surface,
    '--brand-surface-hover': c.surfaceHover,
    '--brand-border': c.border,
    '--brand-border-hover': c.borderHover,
    '--brand-text': c.text,
    '--brand-text-muted': c.textMuted,
    '--brand-text-subtle': c.textSubtle,
    '--brand-primary': c.primary,
    '--brand-primary-hover': c.primaryHover,
    '--brand-primary-foreground': c.primaryForeground,
    '--brand-accent': c.accent,
    '--brand-ring': c.ring,
    '--brand-success': c.success,
    '--brand-danger': c.danger,
    '--brand-gradient-primary': g.primary,
    '--brand-gradient-hero': g.hero,
    '--brand-font-serif': t.serifFamily,
    '--brand-font-sans': t.sansFamily,
    '--brand-display-tracking': t.displayTracking,
    '--brand-display-italic': t.displayItalic ? 'italic' : 'normal',
    '--brand-radius': r.base,
    '--brand-radius-lg': r.lg,
    '--brand-radius-pill': r.pill,
    '--brand-shadow-card': e.shadowCard,
    '--brand-shadow-cta': e.shadowCta,
  };
  return Object.entries(decls)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
}
