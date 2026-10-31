/**
 * Invitation domain types.
 *
 * TemplateId is a plain string that must match a `TemplateMeta.id` in
 * `src/lib/templates.ts`. It is intentionally NOT a hardcoded union: templates
 * ship from the backend (`GET /templates`) and hardcoding ids has already
 * caused "theme has no styles" bugs in this codebase.
 */
export type TemplateId = string;

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
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  startTime: string;
  /** HH:mm */
  endTime: string;
  timezone: string;
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

export type Attendance = 'hadir' | 'tidak' | 'ragu';

export interface RSVPItem {
  id: string;
  guestName: string;
  attendance: Attendance;
  pax: number;
  message: string;
  /** ISO string when it came from the backend, relative label otherwise. */
  createdAt: string;
}

export type GuestCategory = 'Keluarga' | 'Teman Kantor' | 'Sahabat' | 'VIP' | 'Umum';

export interface GuestItem {
  id: string;
  name: string;
  category: GuestCategory;
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
  /** Derived default = first event date. Kept for backend compatibility. */
  countdownDate: string;
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
