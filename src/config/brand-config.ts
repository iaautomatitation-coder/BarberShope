// BRAND CONFIG — Per-tenant design content (text, images, contact, assigned theme).
// Runtime-editable fields (phone/whatsapp/schedule/barbers/services) still live in the DB
// and override anything declared here for the currently selected brand.
//
// To add a new client:
//   1. Add a new entry to BRANDS.
//   2. Point it to one of the five themes in theme-config.ts.
//   3. Set NEXT_PUBLIC_BRAND=<id> in the environment, or change `currentBrand` below.

import type { ThemeId } from './theme-config';

export type NavLink = { label: string; href: string };

export type BrandContact = {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
};

export type BrandGalleryItem = {
  file: string;
  description: string;
  alt: string;
};

export type BrandHero = {
  kicker: string;       // small caps line above title
  title: string;        // main headline (first line)
  titleAccent: string;  // accent line (usually italic)
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  image: string;
};

export type BrandStat = { value: string; label: string };

export type BrandConfig = {
  id: string;
  label: string;
  name: string;
  slogan: string;
  logo: string;              // path or URL
  nav: NavLink[];
  hero: BrandHero;
  stats: BrandStat[];         // stats shown under hero CTAs
  contact: BrandContact;      // defaults — DB `Barbershop` overrides at runtime
  images: {
    teamFallbacks: string[];  // used when a barber has no photo
    gallery: BrandGalleryItem[];
  };
  theme: ThemeId;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const NAV_DEFAULT: NavLink[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Contacto', href: '#contacto' },
];

const GALLERY_DEFAULT: BrandGalleryItem[] = [
  { file: U('1503951914875-452162b0f3f1'), description: 'Corte Fade Premium', alt: 'Corte degradado fade premium ejecutado con precisión' },
  { file: U('1621605815971-fbc98d665033'), description: 'Afeitado de Barba Clásica', alt: 'Afeitado tradicional con navaja y toalla caliente' },
  { file: U('1622286342621-4bd786c2447c'), description: 'Corte con Textura', alt: 'Corte moderno con trabajo de textura y definición' },
  { file: U('1622288432450-277d0fef5ed6'), description: 'Detalle de Herramientas', alt: 'Tijeras y utensilios profesionales del oficio' },
  { file: U('1560066984-138dadb4c035'), description: 'Sesión Editorial', alt: 'Atención personalizada al detalle en cada servicio' },
  { file: U('1503443207922-dff7d543fd0e'), description: 'Silla Clásica', alt: 'Ambiente clásico con iluminación cálida' },
];

const PORTRAIT_FALLBACKS_DEFAULT: string[] = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80&auto=format&fit=crop',
];

// ---------------------------------------------------------------------------
// Brand catalog
// ---------------------------------------------------------------------------

export const BRANDS: Record<string, BrandConfig> = {
  /**
   * Flagship brand — the original BarberRoyal demo.
   * Assigned theme: classic (amber/gold premium).
   */
  default: {
    id: 'default',
    label: 'Barber Rollar MX (flagship)',
    name: 'Barber Rollar MX',
    slogan: 'Tu estilo, nuestra pasión',
    logo: '/logo.png?v=3',
    nav: NAV_DEFAULT,
    hero: {
      kicker: 'Barbería Premium · Est. 2019',
      title: 'La experiencia en barbería',
      titleAccent: 'que te define.',
      subtitle:
        'Transformamos cada corte en una obra de arte. Reserva tu cita y descubre el estilo que te define.',
      primaryCta: 'Agendar Cita',
      secondaryCta: 'Ver Servicios',
      image: U('1585747860715-2ba37e788b70', 2200),
    },
    stats: [
      { value: '5+', label: 'Años de oficio' },
      { value: '3K+', label: 'Clientes fieles' },
      { value: '4.9★', label: 'Rating Google' },
    ],
    contact: {
      phone: '+52 55 1234 5678',
      whatsapp: '525512345678',
      email: 'contacto@barberrollarmx.com',
      address: 'CDMX, México',
    },
    images: {
      teamFallbacks: PORTRAIT_FALLBACKS_DEFAULT,
      gallery: GALLERY_DEFAULT,
    },
    theme: 'classic',
  },

  /**
   * Obsidian — Black editorial / brutalist premium direction.
   * Uses the `obsidian` theme (copper accents on near-black, Bebas Neue display).
   * This is the official demo brand from 2026-04-21 onward.
   */
  obsidian: {
    id: 'obsidian',
    label: 'Barber Rollar MX (Obsidian edition)',
    name: 'Barber Rollar MX',
    slogan: 'Barbería sin concesiones.',
    logo: '/logo.png?v=3',
    nav: NAV_DEFAULT,
    hero: {
      kicker: 'CDMX · Barbería sólo con cita',
      title: 'Barbería',
      titleAccent: 'sin poses.',
      subtitle:
        'Cortes exactos. Barba medida con navaja. Un estudio, una silla a la vez.',
      primaryCta: 'Reservar',
      secondaryCta: 'Ver servicios',
      image: U('1599351431202-1e0f0137899a', 2400),
    },
    stats: [
      { value: '19', label: 'Cortes / semana' },
      { value: '100%', label: 'Solo con cita' },
      { value: 'CDMX', label: 'Única sede' },
    ],
    contact: {
      phone: '+52 55 1234 5678',
      whatsapp: '525512345678',
      email: 'contacto@barberrollarmx.com',
      address: 'CDMX, México',
    },
    images: {
      teamFallbacks: PORTRAIT_FALLBACKS_DEFAULT,
      gallery: GALLERY_DEFAULT,
    },
    theme: 'obsidian',
  },

  /**
   * Example secondary brand — urban, brutal palette.
   * Useful as template for a second client. Activate via NEXT_PUBLIC_BRAND=urban-cuts.
   */
  'urban-cuts': {
    id: 'urban-cuts',
    label: 'Urban Cuts (demo)',
    name: 'Urban Cuts',
    slogan: 'Cortes que no piden permiso',
    logo: '/logo.png?v=3',
    nav: NAV_DEFAULT,
    hero: {
      kicker: 'Street Barbershop · Since 2021',
      title: 'Tu corte,',
      titleAccent: 'tu calle.',
      subtitle:
        'Fades precisos, diseños atrevidos y un ambiente sin poses. Entra, siéntate, sal con actitud.',
      primaryCta: 'Reservar corte',
      secondaryCta: 'Ver servicios',
      image: U('1599351431202-1e0f0137899a', 2200),
    },
    stats: [
      { value: '8K+', label: 'Cortes hechos' },
      { value: '3', label: 'Sucursales' },
      { value: '24/7', label: 'WhatsApp' },
    ],
    contact: {
      whatsapp: '525599998888',
      instagram: '@urban.cuts',
      tiktok: '@urbancuts',
    },
    images: {
      teamFallbacks: PORTRAIT_FALLBACKS_DEFAULT,
      gallery: GALLERY_DEFAULT,
    },
    theme: 'urban',
  },
};

// ---------------------------------------------------------------------------
// Activation
// ---------------------------------------------------------------------------

/**
 * The active brand id.
 *
 * - Reads `NEXT_PUBLIC_BRAND` at build/deploy time if set.
 * - Falls back to the 'default' brand.
 *
 * Change a single line here (or override via env) to switch the whole site
 * to another client — no component edits required.
 */
export const currentBrand: string =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BRAND) || 'obsidian';

export function getBrand(id: string = currentBrand): BrandConfig {
  return BRANDS[id] ?? BRANDS.obsidian ?? BRANDS.default;
}

export function listBrands(): BrandConfig[] {
  return Object.values(BRANDS);
}
