/**
 * Template catalog — single source of truth.
 *
 * Business rule this file encodes:
 *   A template is a *product*, not a plan. Price is attached to the template,
 *   paid once, and grants a permanent licence to publish exactly one event
 *   invitation with that design. No renewals, no expiry, no publish lock.
 *
 * Anything that used to say "langganan" / "paket" / "expired" in the UI now
 * derives from the fields below. Do not duplicate prices in components.
 */

export type TemplateCategory =
  | 'Botanical & Rustic'
  | 'Traditional Nusantara'
  | 'Modern Minimal'
  | 'Luxury Classic';

export interface TemplateMeta {
  /** URL-safe id, also used as the preview folder name. */
  id: string;
  name: string;
  /** Short positioning line: what the design *is*, not marketing superlatives. */
  tagline: string;
  category: TemplateCategory;
  /** One-time price in IDR. 0 = free forever. */
  price: number;
  /** Optional strike-through price in IDR, for launch pricing. */
  compareAt?: number;
  /** What the buyer gets, written as deliverable outcomes. */
  includes: string[];
  /** Cosmetic fields used by the preview + picker swatches. */
  palette: {
    primary: string;
    accent: string;
    surface: string;
    ink: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  ornament: string;
  previewImage: string;
  /** Public demo invitation; `null` means preview only. */
  demoSlug: string | null;
  /** Ships with the platform today. */
  status: 'available' | 'coming-soon';
  badge?: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'boho-botanical',
    name: 'Boho Botanical',
    tagline: 'Aquarel hangat, dedaunan bergoyang, dan gate cover 3D.',
    category: 'Botanical & Rustic',
    price: 0,
    includes: [
      'Gate cover 3D book flip',
      'Animasi daun & bunga (wind sway)',
      'Musik latar autoplay',
      'Galeri, love story, amplop digital, RSVP',
      '1 undangan · aktif tanpa batas',
    ],
    palette: {
      primary: '#79624C',
      accent: '#8C735B',
      surface: '#FAF7F2',
      ink: '#382E25',
    },
    typography: {
      heading: 'Cormorant Garamond',
      body: 'Archivo',
    },
    ornament: 'Botanical bouquet, pampas, monstera, anggrek',
    previewImage: '/template/undangan_1/img/foto_mempelai_dummy.jpg',
    demoSlug: 'raka-sinta',
    status: 'available',
    badge: 'Gratis untuk dicoba',
  },
];

/** Design directions we are building — shown as non-purchasable teasers. */
export const UPCOMING_TEMPLATES: Array<
  Pick<TemplateMeta, 'id' | 'name' | 'tagline' | 'category' | 'palette'>
> = [
  {
    id: 'sunda-siger',
    name: 'Sunda Siger',
    tagline: 'Siger dan motif kawung untuk akad bernuansa sakral.',
    category: 'Traditional Nusantara',
    palette: { primary: '#8C2F39', accent: '#C9A227', surface: '#FBF6EE', ink: '#2E1D1B' },
  },
  {
    id: 'jawa-keraton',
    name: 'Jawa Keraton',
    tagline: 'Gunungan wayang, batik sogan, tipografi serif klasik.',
    category: 'Traditional Nusantara',
    palette: { primary: '#3E2723', accent: '#B45309', surface: '#FEFCE8', ink: '#3E2723' },
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    tagline: 'Grid lapang, satu aksen, tanpa ornamen.',
    category: 'Modern Minimal',
    palette: { primary: '#14151A', accent: '#0F4C81', surface: '#FFFFFF', ink: '#14151A' },
  },
];

export const TEMPLATE_CATEGORIES: Array<{ id: 'all' | TemplateCategory; label: string }> = [
  { id: 'all', label: 'Semua desain' },
  { id: 'Botanical & Rustic', label: 'Botanical & Rustic' },
  { id: 'Traditional Nusantara', label: 'Tradisional Nusantara' },
  { id: 'Modern Minimal', label: 'Modern minimal' },
  { id: 'Luxury Classic', label: 'Klasik mewah' },
];

export function getTemplate(id: string | undefined | null): TemplateMeta | undefined {
  if (!id) return undefined;
  return TEMPLATES.find((t) => t.id === id);
}

export function formatIDR(amount: number): string {
  if (amount === 0) return 'Gratis';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Legacy alias kept so imports elsewhere keep compiling during the refactor. */
export const AVAILABLE_TEMPLATES = TEMPLATES;
export type { TemplateMeta as LegacyTemplateMeta };
