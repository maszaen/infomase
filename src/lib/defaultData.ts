import { InvitationData, TemplateId } from '@/types/invitation';

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  category: 'Botanical & Rustic' | 'Luxury & Exclusive' | 'Islami Modern' | 'Romantic Pastel' | 'Minimalist Modern' | 'Tradisional Nusantara' | 'Aesthetic Bohemian' | 'Futuristic & Bold';
  themeColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  fontHeading: string;
  ornament: string;
  styleTag: string;
  description: string;
  previewImage: string;
  badge?: string;
  tier?: 'free' | 'pro' | 'vip';
}

export const AVAILABLE_TEMPLATES: TemplateMeta[] = [
  {
    id: 'undangan-1',
    name: 'Luxury Boho Botanical (Raka & Sinta)',
    category: 'Botanical & Rustic',
    themeColor: '#79624C',
    accentColor: '#8C735B',
    bgColor: '#FAF7F2',
    textColor: '#382E25',
    fontHeading: 'Cormorant Garamond, serif',
    ornament: 'Multi-layer Botanical Wind Bouquets (Pampas, Monstera & Orchid)',
    styleTag: 'Authentic Boho Botanical',
    description: 'Masterpiece undangan pernikahan digital elegan dengan Gate Cover 3D Book Flip, tekstur watercolor wash, animasi goyangan daun ditiup angin, dan musik Coral Island Overture.',
    previewImage: '/template/undangan_1/img/foto_mempelai_dummy.jpg',
    badge: 'Template Utama',
    tier: 'free',
  },
];

export const PRESET_PHOTOS = {
  grooms: [
    { label: 'Raka Pratama', url: '/template/undangan_1/img/foto_mempelai_dummy.jpg' },
    { label: 'Jas Hitam Klasik', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
  ],
  brides: [
    { label: 'Sinta Maharani', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { label: 'Kebaya Modern Hijab', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80' },
  ],
  couples: [
    { label: 'Raka & Sinta Dummy', url: '/template/undangan_1/img/foto_mempelai_dummy.jpg' },
    { label: 'Prewedding Outdoor', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Momen Manis', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80' },
  ],
};

export const INITIAL_INVITATION_DATA: InvitationData = {
  id: 'undangan-raka-sinta',
  slug: 'raka-sinta',
  title: 'The Wedding of Raka & Sinta',
  templateId: 'undangan-1',
  isPublished: true,
  createdAt: '2026-10-15T10:00:00.000Z',
  updatedAt: '2026-10-24T14:30:00.000Z',
  groom: {
    name: 'Raka',
    fullName: 'Raka Pratama, S.T.',
    fatherName: 'Bpk. Surya',
    motherName: 'Ibu Dewi',
    photo: '/template/undangan_1/img/foto_mempelai_dummy.jpg',
    instagram: '@raka.pratama',
    bio: 'Putra pertama dari Bapak Surya & Ibu Dewi',
  },
  bride: {
    name: 'Sinta',
    fullName: 'Sinta Maharani, S.Pd.',
    fatherName: 'Bpk. Budi',
    motherName: 'Ibu Rina',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    instagram: '@sinta.maharani',
    bio: 'Putri kedua dari Bapak Budi & Ibu Rina',
  },
  quote: {
    text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    source: 'QS. AR-RUM: 21',
    translation: 'Semoga Allah senantiasa memberkahi ikatan suci ini hingga akhir hayat.',
  },
  events: [
    {
      id: 'akad',
      title: 'Akad Nikah',
      date: '2025-05-24',
      startTime: '08:00',
      endTime: '10:00',
      timezone: 'WIB',
      locationName: 'Gedung Graha Saka',
      address: 'Jl. Melati No. 12, Kotabaru, Yogyakarta',
      mapsUrl: 'https://maps.google.com/?q=Gedung+Graha+Saka+Yogyakarta',
    },
    {
      id: 'resepsi',
      title: 'Resepsi Pernikahan',
      date: '2025-05-24',
      startTime: '11:00',
      endTime: '14:00',
      timezone: 'WIB',
      locationName: 'Gedung Graha Saka',
      address: 'Jl. Melati No. 12, Kotabaru, Yogyakarta',
      mapsUrl: 'https://maps.google.com/?q=Gedung+Graha+Saka+Yogyakarta',
    },
  ],
  countdownDate: '2025-05-24T08:00:00',
  stories: [
    {
      id: 'story-1',
      year: '2020',
      title: 'Pertama Bertemu',
      description: 'Pertama kali saling mengenal dan bertukar cerita, menumbuhkan rasa nyaman sejak awal perjumpaan.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'story-2',
      year: '2022',
      title: 'Komitmen Bersama',
      description: 'Memutuskan untuk saling menguatkan, berkomitmen dalam cita-cita dan saling mendampingi setiap langkah.',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'story-3',
      year: '2024',
      title: 'Lamaran',
      description: 'Di hadapan kedua keluarga besar, niat suci diikrarkan untuk melanjutkan perjalanan menuju mahligai pernikahan.',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
      caption: 'Prewedding Outdoor Raka & Sinta',
    },
    {
      id: 'gal-2',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      caption: 'Momen Manis Penuh Senyum',
    },
    {
      id: 'gal-3',
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80',
      caption: 'Senyum Bahagia Bersama',
    },
    {
      id: 'gal-4',
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80',
      caption: 'Simbol Cincin Janji Suci',
    },
    {
      id: 'gal-5',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Raka Pratama',
    },
    {
      id: 'gal-6',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      caption: 'Sinta Maharani',
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
      bankName: 'BANK BCA',
      accountNumber: '1234567890',
      accountHolder: 'Raka Pratama',
      qrisUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BCA-1234567890-RakaPratama',
    },
    {
      id: 'bank-2',
      bankName: 'BANK MANDIRI',
      accountNumber: '0987654321',
      accountHolder: 'Sinta Maharani',
      qrisUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MANDIRI-0987654321-SintaMaharani',
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
      message: 'Barakallah Raka & Sinta! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.',
      createdAt: 'Kemarin, 14:20',
    },
    {
      id: 'rsvp-2',
      guestName: 'Dinda Permata',
      attendance: 'hadir',
      pax: 1,
      message: 'Selamat Sinta sayang! Lancar sampai hari H yaa, bahagia selalu!',
      createdAt: 'Hari ini, 09:15',
    },
  ],
  guests: [
    { id: 'guest-1', name: 'Bapak Surya & Keluarga', category: 'Keluarga', phone: '08123456789' },
    { id: 'guest-2', name: 'Dinda Permata', category: 'Sahabat', phone: '08987654321' },
    { id: 'guest-3', name: 'Rekan Kantor Teknik', category: 'Teman Kantor', phone: '08571234567' },
  ],
};

export const INITIAL_INVITATIONS_COLLECTION: InvitationData[] = [
  INITIAL_INVITATION_DATA,
];

