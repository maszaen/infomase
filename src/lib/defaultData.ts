import { InvitationData } from '@/types/invitation';

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

/** @deprecated kept for imports that still reference the old name */
export const INITIAL_INVITATION_DATA = DEMO_INVITATION;
export const INITIAL_INVITATIONS_COLLECTION = [DEMO_INVITATION];
