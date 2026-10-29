export type TemplateId =
  | 'undangan-1'
  | 'botanical'
  | (string & {});

export interface PersonInfo {
  name: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  photo: string;
  instagram?: string;
  bio?: string;
}

export interface EventDetail {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string; // WIB, WITA, WIT
  locationName: string;
  address: string;
  mapsUrl: string;
}

export interface LoveStory {
  id: string;
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrisUrl?: string;
}

export interface RSVPItem {
  id: string;
  guestName: string;
  attendance: 'hadir' | 'tidak' | 'ragu';
  pax: number;
  message: string;
  createdAt: string;
}

export interface GuestItem {
  id: string;
  name: string;
  category: 'Keluarga' | 'Teman Kantor' | 'Sahabat' | 'VIP' | 'Umum';
  phone?: string;
}

export interface InvitationData {
  id: string;
  slug: string;
  title: string;
  templateId: TemplateId;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  groom: PersonInfo;
  bride: PersonInfo;
  quote: {
    text: string;
    source: string;
    translation?: string;
  };
  events: EventDetail[];
  countdownDate: string; // YYYY-MM-DDTHH:mm:ss
  stories: LoveStory[];
  gallery: GalleryPhoto[];
  music: {
    title: string;
    artist: string;
    url: string;
    autoplay: boolean;
  };
  bankAccounts: BankAccount[];
  giftAddress?: {
    recipientName: string;
    phone: string;
    fullAddress: string;
  };
  rsvpList: RSVPItem[];
  guests: GuestItem[];
}
