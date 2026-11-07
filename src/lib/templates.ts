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
  /** One-time price in IDR. */
  price: number;
  /** Optional strike-through price in IDR, for launch pricing. */
  compareAt?: number;
  /** Whether the template is highlighted on the Landing Page (max 6). */
  isHighlighted?: boolean;
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
  /** Numerical alias corresponding to developer repo folders (undangan_1 .. undangan_8) */
  folderId?: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'boho-botanical',
    folderId: 'undangan_1',
    name: 'Boho Botanical',
    tagline: 'Aquarel hangat, dedaunan bergoyang, dan gate cover 3D.',
    category: 'Botanical & Rustic',
    price: 49000,
    compareAt: 99000,
    isHighlighted: true,
    includes: [
      'Gate cover 3D book flip',
      'Animasi daun & bunga (wind sway)',
      'Musik latar autoplay',
      'Galeri, love story, amplop digital, RSVP',
      '1 undangan · aktif permanen',
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
    badge: 'Populer',
  },
  {
    id: 'modern-minimalist',
    folderId: 'undangan_2',
    name: 'Modern Minimalist',
    tagline: 'Editorial Kinfolk bersih, aksen sage olive, dan tipografi kontemporer.',
    category: 'Modern Minimal',
    price: 49000,
    compareAt: 99000,
    isHighlighted: true,
    includes: [
      'Editorial layout bergaya majalah Kinfolk & Vogue',
      'Harmoni palet sage olive & warm ivory',
      'Animasi buket flora & daun melayang lembut',
      'Buku tamu interaktif, galeri foto & tanda kasih',
      '1 undangan · aktif permanen',
    ],
    palette: {
      primary: '#727464',
      accent: '#7F8170',
      surface: '#FAF8F5',
      ink: '#0C0D0C',
    },
    typography: {
      heading: 'Cormorant Garamond',
      body: 'Plus Jakarta Sans',
    },
    ornament: 'Minimalist foliage, sage ampersand, editorial hair lines',
    previewImage: '/template/undangan_2/img/foto_editorial_hero.jpg',
    demoSlug: 'raka-sinta-sage',
    status: 'available',
    badge: 'Populer',
  },
  {
    id: 'tropical-beach',
    folderId: 'undangan_3',
    name: 'Tropical Beach',
    tagline: 'Nuansa pantai eksotis, semilir dedaunan palem tropis, dan palet ocean teal.',
    category: 'Botanical & Rustic',
    price: 49000,
    compareAt: 99000,
    isHighlighted: true,
    includes: [
      'Tema pesisir pantai & desiran ombak laut',
      'Perpaduan ocean teal, palm green & warm sand gold',
      'Animasi buket flora tropis & monstera hidup',
      'Countdown ribbon, peta Google Maps & amplop digital',
      '1 undangan · aktif permanen',
    ],
    palette: {
      primary: '#284B56',
      accent: '#D4A362',
      surface: '#FAF6EE',
      ink: '#1A323B',
    },
    typography: {
      heading: 'Cormorant Garamond',
      body: 'Plus Jakarta Sans',
    },
    ornament: 'Tropical palm leaves, monstera, coastal sand gold',
    previewImage: '/template/undangan_3/img/mempelai/couple_beach_full.jpg',
    demoSlug: 'raka-sinta-beach',
    status: 'available',
  },
  {
    id: 'luxury-islamic',
    folderId: 'undangan_4',
    name: 'Luxury Islamic',
    tagline: 'Mihrab islami agung, kaligrafi basmalah, dan aksen emas klasik.',
    category: 'Luxury Classic',
    price: 79000,
    compareAt: 149000,
    isHighlighted: true,
    includes: [
      'Arsitektur bingkai lengkung mihrab islami',
      'Ornamen kaligrafi basmalah & kutipan suci Ar-Rum',
      'Palet emas klasik berpadu hijau agung',
      'Fitur amplop digital lengkap QRIS & nomor rekening',
      '1 undangan · aktif permanen',
    ],
    palette: {
      primary: '#1B4D3E',
      accent: '#D4AF37',
      surface: '#F7FAF8',
      ink: '#132A22',
    },
    typography: {
      heading: 'Cormorant Garamond',
      body: 'Archivo',
    },
    ornament: 'Mihrab arch, calligraphic basmalah, gold borders',
    previewImage: '/template/undangan_4/LUXURY-09-FOTO.jpg',
    demoSlug: 'habib-adiba',
    status: 'available',
    badge: 'Spesial Islami',
  },
  {
    id: 'misty-mountain',
    folderId: 'undangan_5',
    name: 'Misty Mountain',
    tagline: 'Kabut pegunungan pinus sejuk, ketenangan alam alpine, dan palet pine mist.',
    category: 'Botanical & Rustic',
    price: 49000,
    compareAt: 99000,
    isHighlighted: false,
    includes: [
      'Visual latar kabut pegunungan pinus alami',
      'Nuansa pine emerald, cedar gold & mist white',
      'Animasi dahan cemara & efek dedaunan lembut',
      'Galeri bento, cerita cinta & konfirmasi kehadiran',
      '1 undangan · aktif permanen',
    ],
    palette: {
      primary: '#1E352B',
      accent: '#C59A45',
      surface: '#F3F6F2',
      ink: '#0F1D17',
    },
    typography: {
      heading: 'Cormorant Garamond',
      body: 'Plus Jakarta Sans',
    },
    ornament: 'Pine needles, mountain mist wash, cedar branches',
    previewImage: '/template/undangan_5/img/bg/mountain_bg.jpg',
    demoSlug: 'arga-maya',
    status: 'available',
  },
  {
    id: 'royal-maroon',
    folderId: 'undangan_6',
    name: 'The Royal Maroon',
    tagline: 'Kemewahan beludru maroon istana, lampu gantung kristal, dan ornamen emas royal.',
    category: 'Luxury Classic',
    price: 79000,
    compareAt: 149000,
    isHighlighted: true,
    includes: [
      'Ambience beludru maroon istana kerajaan & antique gold',
      'Lampu gantung chandelier kristal bergoyang & pilar megah',
      'Bingkai medali kerajaan berhias ukiran sudut emas',
      'Pemutar musik piringan hitam otomatis & amplop hadiah',
      '1 undangan · aktif permanen',
    ],
    palette: {
      primary: '#5A1018',
      accent: '#C49A55',
      surface: '#FAF5EE',
      ink: '#3B080D',
    },
    typography: {
      heading: 'Cormorant Garamond',
      body: 'Plus Jakarta Sans',
    },
    ornament: 'Crystal chandelier, royal pillars, antique gold filigree',
    previewImage: '/template/undangan_6/img/mempelai/mempelai_maroon_royal.jpg',
    demoSlug: 'raka-sinta-royal',
    status: 'available',
    badge: 'Mewah',
  },
  {
    id: 'pawiwahan-agung',
    folderId: 'undangan_7',
    name: 'Pawiwahan Agung',
    tagline: 'Adat Jawa Pendopo Kraton megah, batik Megamendung, gunungan & iringan gamelan.',
    category: 'Traditional Nusantara',
    price: 89000,
    compareAt: 159000,
    isHighlighted: true,
    includes: [
      'Arsitektur panggung desktop 3-kolom Pendopo Kraton',
      'Motif batik Megamendung, Gunungan & Wayang Kulit',
      'Format tiket acara perforated stub sobek emas',
      'Iringan audio gamelan tradisional Jawa autentik',
      '1 undangan · aktif permanen',
    ],
    palette: {
      primary: '#8C531B',
      accent: '#B87333',
      surface: '#FDF9F3',
      ink: '#3B230C',
    },
    typography: {
      heading: 'Cormorant Garamond',
      body: 'Plus Jakarta Sans',
    },
    ornament: 'Gunungan wayang kulit, batik megamendung, tirai gebyog kraton',
    previewImage: '/template/undangan_7/preview-undangan-batik.webp',
    demoSlug: 'habib-adiba-jawa',
    status: 'available',
    badge: 'Adat Nusantara',
  },
  {
    id: 'pawiwahan-pethak',
    folderId: 'undangan_8',
    name: 'Pawiwahan Pethak',
    tagline: 'Adat Jawa klasik pethak putih suci, ronce melati keraton, dan renda gebyog.',
    category: 'Traditional Nusantara',
    price: 89000,
    compareAt: 159000,
    isHighlighted: false,
    includes: [
      'Panggung adat Jawa pethak bernuansa putih suci',
      'Batik Kawung putih, roncen melati gantung & mandala cakra',
      'Efek kelopak sekar melati berjatuhan lembut',
      'Iringan gending gamelan, amplop kado & RSVP tamu',
      '1 undangan · aktif permanen',
    ],
    palette: {
      primary: '#5A5348',
      accent: '#BFA575',
      surface: '#FAF9F6',
      ink: '#2E2A24',
    },
    typography: {
      heading: 'Cormorant Garamond',
      body: 'Plus Jakarta Sans',
    },
    ornament: 'Roncen sekar melati, mandala kawung cakra, wayang kulit pethak',
    previewImage: '/template/undangan_8/cover-jawa-putih.jpg',
    demoSlug: 'habib-adiba-pethak',
    status: 'available',
    badge: 'Adat Nusantara',
  },
];

export const TEMPLATE_CATEGORIES: Array<{ id: 'all' | TemplateCategory; label: string }> = [
  { id: 'all', label: 'Semua desain' },
  { id: 'Botanical & Rustic', label: 'Botanical & Rustic' },
  { id: 'Traditional Nusantara', label: 'Tradisional Nusantara' },
  { id: 'Modern Minimal', label: 'Modern minimal' },
  { id: 'Luxury Classic', label: 'Klasik mewah' },
];

/** Mapping aliases like "undangan_1", "undangan-1", "1" to canonical template IDs */
export const TEMPLATE_ALIASES: Record<string, string> = {
  'undangan_1': 'boho-botanical',
  'undangan-1': 'boho-botanical',
  '1': 'boho-botanical',
  'boho-botanical': 'boho-botanical',

  'undangan_2': 'modern-minimalist',
  'undangan-2': 'modern-minimalist',
  '2': 'modern-minimalist',
  'modern-minimalist': 'modern-minimalist',

  'undangan_3': 'tropical-beach',
  'undangan-3': 'tropical-beach',
  '3': 'tropical-beach',
  'tropical-beach': 'tropical-beach',

  'undangan_4': 'luxury-islamic',
  'undangan-4': 'luxury-islamic',
  '4': 'luxury-islamic',
  'luxury-islamic': 'luxury-islamic',

  'undangan_5': 'misty-mountain',
  'undangan-5': 'misty-mountain',
  '5': 'misty-mountain',
  'misty-mountain': 'misty-mountain',

  'undangan_6': 'royal-maroon',
  'undangan-6': 'royal-maroon',
  '6': 'royal-maroon',
  'royal-maroon': 'royal-maroon',

  'undangan_7': 'pawiwahan-agung',
  'undangan-7': 'pawiwahan-agung',
  '7': 'pawiwahan-agung',
  'pawiwahan-agung': 'pawiwahan-agung',

  'undangan_8': 'pawiwahan-pethak',
  'undangan-8': 'pawiwahan-pethak',
  '8': 'pawiwahan-pethak',
  'pawiwahan-pethak': 'pawiwahan-pethak',
};

export function normalizeTemplateId(id: string | undefined | null): string {
  if (!id) return 'boho-botanical';
  const clean = id.trim().toLowerCase();
  return TEMPLATE_ALIASES[clean] || (TEMPLATES.some((t) => t.id === clean) ? clean : 'boho-botanical');
}

export function getTemplate(id: string | undefined | null): TemplateMeta | undefined {
  if (!id) return undefined;
  const canonicalId = normalizeTemplateId(id);
  return TEMPLATES.find((t) => t.id === canonicalId) || TEMPLATES[0];
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Legacy alias kept so imports elsewhere keep compiling during the refactor. */
export const AVAILABLE_TEMPLATES = TEMPLATES;
export type { TemplateMeta as LegacyTemplateMeta };
