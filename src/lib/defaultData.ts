import { InvitationData, TemplateId } from '@/types/invitation';

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  category: string;
  themeColor: string;
  accentColor: string;
  description: string;
  previewImage: string;
  badge?: string;
}

export const AVAILABLE_TEMPLATES: TemplateMeta[] = [
  {
    id: 'rustic',
    name: 'Rustic Warmth & Flora',
    category: 'Botanical & Natural',
    themeColor: '#7a5c43',
    accentColor: '#c49a6c',
    description: 'Nuansa hangat earthy tones, elemen floral botanical vintage, sentuhan kertas parchment yang elegan dan abadi.',
    previewImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    badge: 'Paling Populer',
  },
  {
    id: 'royal-gold',
    name: 'Royal Midnight Gold',
    category: 'Luxury & Exclusive',
    themeColor: '#0c1524',
    accentColor: '#d4af37',
    description: 'Kemewahan latar navy pekat dipadu ornamen emas murni berkilau, memancarkan pesona bangsawan berkelas.',
    previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    badge: 'Premium VIP',
  },
  {
    id: 'islamic',
    name: 'Islamic Emerald & Gold',
    category: 'Islami Modern',
    themeColor: '#0b3d2e',
    accentColor: '#e0c075',
    description: 'Sentuhan nuansa hijau zamrud Islami dipadu ornamen mandala arabesque modern, khat kaligrafi anggun dan penuh berkah.',
    previewImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    badge: 'Pilihan Keluarga',
  },
  {
    id: 'sakura',
    name: 'Blush Sakura Pastel',
    category: 'Romantic & Aesthetic',
    themeColor: '#8f4f58',
    accentColor: '#f3c4cb',
    description: 'Gradasi lembut warna blush pink pastel, kelopak bunga mekar, dan estetika minimalis romantis khas modern wedding.',
    previewImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    badge: 'Terbaru',
  },
];

export const PRESET_PHOTOS = {
  grooms: [
    { label: 'Jas Hitam Klasik', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
    { label: 'Beskap Modern', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
    { label: 'Tuxedo Elegan', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
  ],
  brides: [
    { label: 'Gaun Putih Elegan', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { label: 'Kebaya Modern Hijab', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80' },
    { label: 'Mahkota Cantik', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80' },
  ],
  couples: [
    { label: 'Outdoor Sunset', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Tatapan Romantis', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Bergandengan Tangan', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Taman Asri', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Cincin Pernikahan', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Arsitektur Mewah', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80' },
  ],
};

export const INITIAL_INVITATION_DATA: InvitationData = {
  id: 'undangan-aditya-annisa',
  slug: 'aditya-annisa',
  title: 'Pernikahan Aditya & Annisa',
  templateId: 'rustic',
  groom: {
    name: 'Aditya',
    fullName: 'Raden Aditya Pratama, S.T.',
    fatherName: 'Bpk. Ir. Bambang Hermanto',
    motherName: 'Ibu Hj. Ratna Juwita',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    instagram: '@aditya.pratama',
    bio: 'Putra pertama dari dua bersaudara yang mencintai teknologi dan kopi seduh manual.',
  },
  bride: {
    name: 'Annisa',
    fullName: 'dr. Siti Annisa Maharani',
    fatherName: 'Bpk. Prof. Dr. H. Hendra Wijaya',
    motherName: 'Ibu Drg. Endang Susilowati',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    instagram: '@annisa.maharani',
    bio: 'Putri bungsu penuh tawa yang mendedikasikan harinya untuk kesehatan dan senyuman orang lain.',
  },
  quote: {
    text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum : 21',
    translation: 'Semoga Allah senantiasa memberkahi ikatan suci ini hingga akhir hayat.',
  },
  events: [
    {
      id: 'akad',
      title: 'Akad Nikah / Ijab Qabul',
      date: '2026-11-28',
      startTime: '08:00',
      endTime: '10:00',
      timezone: 'WIB',
      locationName: 'Masjid Agung Al-Barkah',
      address: 'Jl. Veteran No. 45, Kebayoran Baru, Jakarta Selatan',
      mapsUrl: 'https://maps.google.com',
    },
    {
      id: 'resepsi',
      title: 'Resepsi Pernikahan',
      date: '2026-11-28',
      startTime: '11:00',
      endTime: '15:00',
      timezone: 'WIB',
      locationName: 'Grand Ballroom The Sultan Hotel',
      address: 'Jl. Gatot Subroto No. 1, Senayan, Jakarta Pusat',
      mapsUrl: 'https://maps.google.com',
    },
  ],
  countdownDate: '2026-11-28T08:00:00',
  stories: [
    {
      id: 'story-1',
      year: '2021',
      title: 'Pertemuan Pertama di Kampus',
      description: 'Berawal dari diskusi di perpustakaan pusat, sebuah sapaan singkat berlanjut menjadi obrolan hangat yang tak pernah terasa membosankan.',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'story-2',
      year: '2023',
      title: 'Saling Menguatkan Impian',
      description: 'Menemani perjuangan Aditya menyelesaikan proyek startup dan Annisa menempuh koas kedokteran, doa dan rasa percaya menjadi tiang utama.',
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'story-3',
      year: '2025',
      title: 'Momen Lamaran / Khitbah',
      description: 'Di hadapan kedua keluarga besar, Aditya mengutarakan niat tulus untuk meminang Annisa sebagai pendamping seumur hidup.',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      caption: 'Di bawah hangatnya senja pantai',
    },
    {
      id: 'gal-2',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
      caption: 'Tawa bahagia yang selalu kami syukuri',
    },
    {
      id: 'gal-3',
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80',
      caption: 'Menuju langkah baru bersama',
    },
    {
      id: 'gal-4',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
      caption: 'Dekapan hangat penuh keyakinan',
    },
    {
      id: 'gal-5',
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80',
      caption: 'Lambang ikatan janji suci kami',
    },
    {
      id: 'gal-6',
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80',
      caption: 'Kasih yang bertumbuh setiap waktu',
    },
  ],
  music: {
    title: 'A Thousand Years (Acoustic Piano & Cello)',
    artist: 'Wedding Romance Soundtrack',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
    autoplay: true,
  },
  bankAccounts: [
    {
      id: 'bank-1',
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '8210984421',
      accountHolder: 'Raden Aditya Pratama',
      qrisUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BCA-8210984421-RadenAditya',
    },
    {
      id: 'bank-2',
      bankName: 'Bank Mandiri',
      accountNumber: '1370019283741',
      accountHolder: 'Siti Annisa Maharani',
      qrisUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MANDIRI-1370019283741-SitiAnnisa',
    },
  ],
  giftAddress: {
    recipientName: 'Aditya & Annisa (Bpk. Bambang)',
    phone: '0812-3456-7890',
    fullAddress: 'Jl. Cempaka Putih Timur No. 18B, RT 04 / RW 07, Jakarta Pusat, DKI Jakarta 10510',
  },
  rsvpList: [
    {
      id: 'rsvp-1',
      guestName: 'Dimas Setiawan & Partner',
      attendance: 'hadir',
      pax: 2,
      message: 'Selamat untuk Bro Adit dan dr. Annisa! Lancar sampai hari H ya, insya Allah kami hadir!',
      createdAt: 'Kemarin, 14:20',
    },
    {
      id: 'rsvp-2',
      guestName: 'dr. Faradilla Sp.A',
      attendance: 'hadir',
      pax: 1,
      message: 'Barakallahu lakum! Selamat teman sejawat tersayang Annisa. Semoga jadi keluarga sakinah mawaddah warahmah.',
      createdAt: 'Kemarin, 18:05',
    },
    {
      id: 'rsvp-3',
      guestName: 'Bima Satria (Teknik 2017)',
      attendance: 'ragu',
      pax: 1,
      message: 'Happy wedding Dit! Masih diusahakan izin dinas luar kota, doa terbaik selalu buat kalian berdua!',
      createdAt: 'Hari ini, 09:12',
    },
  ],
  guests: [
    { id: 'gst-1', name: 'Bapak Ir. Agus Sulistyo & Keluarga', category: 'VIP', phone: '081299998888' },
    { id: 'gst-2', name: 'dr. Sarah Amanda, Sp.KK', category: 'Sahabat', phone: '081377776666' },
    { id: 'gst-3', name: 'Keluarga Besar Bani Hasan', category: 'Keluarga', phone: '081122334455' },
    { id: 'gst-4', name: 'Rekan-rekan Divisi Engineering TechCorp', category: 'Teman Kantor', phone: '081988887777' },
    { id: 'gst-5', name: 'Rizky Ramadhan & Istri', category: 'Sahabat', phone: '085711223344' },
  ],
};
