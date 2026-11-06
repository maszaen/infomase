import { InvitationData, WhatsAppMessageTemplate } from '@/types/invitation';

export const DEFAULT_WA_TEMPLATES: WhatsAppMessageTemplate[] = [
  {
    id: 'wa-tpl-formal',
    name: 'Formal & Keluarga',
    isDefault: true,
    assignedCategories: ['Keluarga', 'VIP', 'Umum'],
    body: `Kepada Yth. {guestName}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami:

*{groomName} & {brideName}*
📅 {eventDate}
⏰ Pukul {eventTime}
📍 {venueName}

Detail acara dan konfirmasi kehadiran dapat diakses melalui tautan berikut:
{link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir. Terima kasih.`,
  },
  {
    id: 'wa-tpl-casual',
    name: 'Santai (Sahabat)',
    assignedCategories: ['Sahabat'],
    body: `Halo {guestName}! 👋

Kami mau berbagi kabar bahagia nih. InsyaAllah kami akan melangsungkan pernikahan:

*{groomName} & {brideName}*
📅 {eventDate} ({eventTime})
📍 {venueName}

Cek info lengkap dan isi konfirmasi kehadiran (RSVP) di link undangan khusus buat kamu ya:
{link}

Ditunggu banget kehadirannya, sampai ketemu di hari bahagia kami! ✨`,
  },
  {
    id: 'wa-tpl-colleague',
    name: 'Rekan Kerja / Kolega',
    assignedCategories: ['Teman Kantor'],
    body: `Selamat pagi/siang {guestName},

Melalui pesan ini, kami ingin mengundang rekan-rekan untuk hadir di acara pernikahan kami:

*{groomName} & {brideName}*
Hari/Tanggal: {eventDate}
Waktu: {eventTime}
Tempat: {venueName}

Tautan undangan digital & RSVP:
{link}

Terima kasih banyak atas perhatian dan doa restunya.`,
  },
];

/**
 * Seed data for the public demo invitation.
 *
 * Rules of thumb baked in here (they were violated before):
 *  - The demo date is in the *future*, otherwise the countdown reads 00:00:00:00
 *    on the marketing page.
 *  - No fabricated social proof, no fake testimonials, no invented statistics.
 *  - Template id must exist in `TEMPLATES` (src/lib/templates.ts).
 */
export const DEMO_SLUG = 'raka-sinta';

export const DEMO_INVITATION: InvitationData = {
  id: 'invunta-demo-raka-sinta',
  slug: DEMO_SLUG,
  title: 'Raka & Sinta',
  templateId: 'boho-botanical',
  isPublished: true,
  createdAt: '2026-09-02T10:00:00.000Z',
  updatedAt: '2026-10-24T14:30:00.000Z',
  groom: {
    name: 'Raka',
    fullName: 'Raka Pratama, S.T.',
    fatherName: 'Bpk. Surya Wijaya',
    motherName: 'Ibu Dewi Lestari',
    photo: '/template/undangan_1/img/foto_mempelai_dummy.jpg',
    instagram: '@raka.pratama',
    bio: 'Putra pertama dari Bapak Surya & Ibu Dewi',
  },
  bride: {
    name: 'Sinta',
    fullName: 'Sinta Maharani, S.Pd.',
    fatherName: 'Bpk. Budi Santoso',
    motherName: 'Ibu Rina Wulandari',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    instagram: '@sinta.maharani',
    bio: 'Putri kedua dari Bapak Budi & Ibu Rina',
  },
  quote: {
    text: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21',
    translation: 'Semoga Allah memberkahi ikatan ini hingga akhir hayat.',
  },
  events: [
    {
      id: 'akad',
      title: 'Akad Nikah',
      date: '2026-12-12',
      startTime: '08:00',
      endTime: '10:00',
      timezone: 'WIB',
      locationName: 'Gedung Graha Saka',
      address: 'Jl. Melati No. 12, Kotabaru, Yogyakarta',
      mapsUrl: 'https://maps.google.com/?q=Gedung+Graha+Saka+Yogyakarta',
    },
    {
      id: 'resepsi',
      title: 'Resepsi',
      date: '2026-12-12',
      startTime: '11:00',
      endTime: '14:00',
      timezone: 'WIB',
      locationName: 'Gedung Graha Saka',
      address: 'Jl. Melati No. 12, Kotabaru, Yogyakarta',
      mapsUrl: 'https://maps.google.com/?q=Gedung+Graha+Saka+Yogyakarta',
    },
  ],
  countdownDate: '2026-12-12T08:00:00',
  stories: [
    {
      id: 'story-1',
      year: '2019',
      title: 'Pertama bertemu',
      description:
        'Berkenalan di acara kampus, lalu menghabiskan satu semester penuh saling bertukar cerita sampai larut.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'story-2',
      year: '2022',
      title: 'Menjalin komitmen',
      description:
        'Memutuskan untuk saling menguatkan — satu kota, satu rencana, satu tujuan yang sama.',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'story-3',
      year: '2026',
      title: 'Lamaran',
      description:
        'Di hadapan kedua keluarga, niat baik diikrarkan untuk melanjutkan perjalanan ke jenjang pernikahan.',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
      caption: 'Prewedding di luar ruang',
    },
    {
      id: 'gal-2',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      caption: 'Sesi pertama',
    },
    {
      id: 'gal-3',
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80',
      caption: 'Tertawa lepas',
    },
    {
      id: 'gal-4',
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80',
      caption: 'Cincin',
    },
    {
      id: 'gal-5',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Raka',
    },
    {
      id: 'gal-6',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      caption: 'Sinta',
    },
  ],
  music: {
    title: 'Coral Island Overture',
    artist: 'Coral Island Soundtrack',
    url: '/template/undangan_1/music/Coral%20Island%20Overture.mp3',
    autoplay: true,
  },
  bankAccounts: [
    {
      id: 'bank-1',
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolder: 'Raka Pratama',
    },
    {
      id: 'bank-2',
      bankName: 'Mandiri',
      accountNumber: '0987654321',
      accountHolder: 'Sinta Maharani',
    },
  ],
  giftAddress: {
    recipientName: 'Raka & Sinta',
    phone: '0812-3456-7890',
    fullAddress: 'Jl. Melati No. 12, Kotabaru, Kec. Gondokusuman, Kota Yogyakarta',
  },
  rsvpList: [
    {
      id: 'rsvp-1',
      guestName: 'Budi Santoso & Keluarga',
      attendance: 'hadir',
      pax: 2,
      message:
        'Barakallah Raka & Sinta. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
      createdAt: '2026-10-28T07:20:00.000Z',
    },
    {
      id: 'rsvp-2',
      guestName: 'Dinda Permata',
      attendance: 'hadir',
      pax: 1,
      message: 'Selamat Sinta! Lancar sampai hari H, bahagia selalu.',
      createdAt: '2026-10-30T02:15:00.000Z',
    },
  ],
  guests: [
    { id: 'guest-1', name: 'Bapak Surya & Keluarga', category: 'Keluarga', phone: '081234567890' },
    { id: 'guest-2', name: 'Dinda Permata', category: 'Sahabat', phone: '089876543210' },
    { id: 'guest-3', name: 'Rekan Kantor Teknik', category: 'Teman Kantor', phone: '085712345678' },
  ],
  waTemplates: DEFAULT_WA_TEMPLATES,
};

export const PRESET_PHOTOS = {
  grooms: [
    { label: 'Pria formal', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
  ],
  brides: [
    { label: 'Wanita formal', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
  ],
  couples: [
    { label: 'Pasangan luar ruang', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Sesi intim', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80' },
  ],
};

export function getDemoInvitation(templateId: string, slug?: string): InvitationData {
  const base = { ...DEMO_INVITATION };
  const targetSlug = slug || 'demo-' + templateId;

  if (templateId === 'luxury-islamic' || templateId === 'undangan_4') {
    return {
      ...base,
      id: 'demo-luxury-islamic',
      slug: targetSlug,
      title: 'Demo — Luxury Islamic',
      templateId: 'luxury-islamic',
      groom: {
        name: 'Habib',
        fullName: 'Habib Yulianto, S.Kom.',
        fatherName: 'Bpk. H. Hendra Wijaya',
        motherName: 'Ibu Hj. Siti Aminah',
        photo: '/template/undangan_4/asset/LUXURY-09-FOTO.jpg',
        instagram: '@habibyulianto',
        bio: 'Putra pertama dari Bpk. H. Hendra Wijaya & Ibu Hj. Siti Aminah',
      },
      bride: {
        name: 'Adiba',
        fullName: 'Adiba Putri Syakila, S.Farm.',
        fatherName: 'Bpk. H. Ahmad Fauzi',
        motherName: 'Ibu Hj. Nurul Hidayah',
        photo: '/template/undangan_4/asset/LUXURY-09-FOTO.jpg',
        instagram: '@adibasyakila',
        bio: 'Putri kedua dari Bpk. H. Ahmad Fauzi & Ibu Hj. Nurul Hidayah',
      },
      countdownDate: '2026-12-28T08:00:00',
      music: {
        title: 'Wedding Song',
        artist: 'Punakawan Digital',
        url: '/template/undangan_4/asset/song.mp3',
        autoplay: true,
      },
      isPublished: true,
    };
  }

  if (templateId === 'pawiwahan-agung' || templateId === 'undangan_7') {
    return {
      ...base,
      id: 'demo-pawiwahan-agung',
      slug: targetSlug,
      title: 'Demo — Pawiwahan Agung',
      templateId: 'pawiwahan-agung',
      groom: {
        name: 'Habib',
        fullName: 'Habib Yulianto, S.Kom.',
        fatherName: 'Raden Mas Suryo',
        motherName: 'Raden Ayu Ratna',
        photo: '/template/undangan_7/asset/mempelai-pria-jawa.jpg',
        instagram: '@habibyulianto',
        bio: 'Putra kakung pambayun Bpk. Raden Mas Suryo & Ibu Raden Ayu Ratna',
      },
      bride: {
        name: 'Adiba',
        fullName: 'Adiba Putri Syakila, S.Farm.',
        fatherName: 'Kanjeng Pangeran Haryo Wibowo',
        motherName: 'Dra. Siti Aminah',
        photo: '/template/undangan_7/asset/mempelai-wanita-jawa.jpg',
        instagram: '@adibasyakila',
        bio: 'Putri panggulon Bpk. K.P.H. Wibowo & Ibu Dra. Siti Aminah',
      },
      countdownDate: '2026-12-28T08:00:00',
      music: {
        title: 'Gamelan Kraton',
        artist: 'Karawitan Tradisional',
        url: '/template/undangan_7/asset/gamelan.mp3',
        autoplay: true,
      },
      isPublished: true,
    };
  }

  if (templateId === 'pawiwahan-pethak' || templateId === 'undangan_8') {
    return {
      ...base,
      id: 'demo-pawiwahan-pethak',
      slug: targetSlug,
      title: 'Demo — Pawiwahan Pethak',
      templateId: 'pawiwahan-pethak',
      groom: {
        name: 'Habib',
        fullName: 'Habib Yulianto, S.Kom.',
        fatherName: 'Raden Mas Suryo',
        motherName: 'Raden Ayu Ratna',
        photo: '/template/undangan_8/asset/mempelai-pria-putih.jpg',
        instagram: '@habibyulianto',
        bio: 'Putra kakung pambayun Bpk. Raden Mas Suryo & Ibu Raden Ayu Ratna',
      },
      bride: {
        name: 'Adiba',
        fullName: 'Adiba Putri Syakila, S.Farm.',
        fatherName: 'Kanjeng Pangeran Haryo Wibowo',
        motherName: 'Dra. Siti Aminah',
        photo: '/template/undangan_8/asset/mempelai-wanita-putih.jpg',
        instagram: '@adibasyakila',
        bio: 'Putri panggulon Bpk. K.P.H. Wibowo & Ibu Dra. Siti Aminah',
      },
      countdownDate: '2026-12-28T08:00:00',
      music: {
        title: 'Gamelan Sekar Melati',
        artist: 'Karawitan Tradisional',
        url: '/template/undangan_8/asset/gamelan.mp3',
        autoplay: true,
      },
      isPublished: true,
    };
  }

  if (templateId === 'misty-mountain' || templateId === 'undangan_5') {
    return {
      ...base,
      id: 'demo-misty-mountain',
      slug: targetSlug,
      title: 'Demo — Misty Mountain',
      templateId: 'misty-mountain',
      groom: {
        name: 'Arga',
        fullName: 'Arga Pratama, S.T.',
        fatherName: 'Bpk. Surya Wijaya',
        motherName: 'Ibu Dewi Lestari',
        photo: '/template/undangan_5/asset/img/mempelai/couple_beach_full.jpg',
        instagram: '@arga.pratama',
        bio: 'Putra pertama dari Bapak Surya & Ibu Dewi',
      },
      bride: {
        name: 'Maya',
        fullName: 'Maya Anggraini, S.Ds.',
        fatherName: 'Bpk. Budi Santoso',
        motherName: 'Ibu Rina Wulandari',
        photo: '/template/undangan_5/asset/img/mempelai/couple_beach_full.jpg',
        instagram: '@maya.anggraini',
        bio: 'Putri kedua dari Bapak Budi & Ibu Rina',
      },
      countdownDate: '2026-12-12T08:00:00',
      isPublished: true,
    };
  }

  return {
    ...base,
    id: `demo-${templateId}`,
    slug: targetSlug,
    title: `Demo — ${templateId}`,
    templateId,
    isPublished: true,
  };
}

/** @deprecated kept for imports that still reference the old name */
export const INITIAL_INVITATION_DATA = DEMO_INVITATION;
export const INITIAL_INVITATIONS_COLLECTION = [DEMO_INVITATION];
