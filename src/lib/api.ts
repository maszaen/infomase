import { ApiResponse, AuthResponseData, User } from '@/types/auth';
import { clearDataStorage, dispatchAuthChange } from './storage';
import { InvitationData, RSVPItem, GuestItem, TemplateId } from '@/types/invitation';

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? '/api/proxy' : 'http://localhost:8080/api/v1');

export const TOKEN_KEY = 'infomase_token';
export const REFRESH_TOKEN_KEY = 'infomase_refresh_token';
export const USER_KEY = 'infomase_user';

// Helper to access token safely in browser
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (accessToken: string, refreshToken?: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearAuthStorage = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Generic Fetcher
export const getRequestUrl = (endpoint: string): string => {
  if (endpoint.startsWith('http')) return endpoint;
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (typeof window !== 'undefined') {
    return `/api/proxy${clean}`;
  }
  return `${API_BASE}${clean}`;
};

export const hasServerSession = () => Boolean(getToken() && getToken() !== 'demo-token');

export const getAuthSession = () => {
  if (typeof window === 'undefined') return '';
  return `${getStoredUser()?.id ?? ''}:${localStorage.getItem(REFRESH_TOKEN_KEY) || getToken() || ''}`;
};

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

let refreshing: { session: string; promise: Promise<void> } | null = null;

async function renewAccessToken(session: string): Promise<void> {
  if (refreshing?.session === session) return refreshing.promise;
  const promise = (async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new ApiError('Sesi berakhir. Silakan masuk kembali.', 401);
    const res = await fetch(getRequestUrl('/auth/refresh-token'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new ApiError('Sesi berakhir. Silakan masuk kembali.', res.status);
    const json: ApiResponse<{ accessToken: string }> = await res.json();
    if (!json.success || !json.data?.accessToken) throw new ApiError('Refresh token gagal.', 401);
    if (session !== getAuthSession()) throw new ApiError('Akun aktif telah berubah.', 409);
    setToken(json.data.accessToken);
  })();
  refreshing = { session, promise };
  try {
    await promise;
  } catch (error) {
    if (session === getAuthSession() && error instanceof ApiError && error.status === 401) {
      clearAuthStorage();
      clearDataStorage();
      dispatchAuthChange();
    }
    throw error;
  } finally {
    if (refreshing?.promise === promise) refreshing = null;
  }
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const session = getAuthSession();
  const token = getToken();
  const authenticated = hasServerSession() && !/^\/auth\/(login|register|refresh-token)$/.test(endpoint);
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  headers.set('ngrok-skip-browser-warning', 'true');
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (authenticated) headers.set('Authorization', `Bearer ${token}`);
  const request = () => fetch(getRequestUrl(endpoint), { ...options, headers });
  let res = await request();
  if (res.status === 401 && authenticated) {
    if (session !== getAuthSession()) throw new ApiError('Akun aktif telah berubah.', 409);
    if (getToken() === token) await renewAccessToken(session);
    if (session !== getAuthSession()) throw new ApiError('Akun aktif telah berubah.', 409);
    headers.set('Authorization', `Bearer ${getToken()}`);
    res = await request();
  }
  if (authenticated && session !== getAuthSession()) throw new ApiError('Akun aktif telah berubah.', 409);
  const json: ApiResponse<T> & { status?: boolean } = await res.json().catch(() => {
    throw new ApiError('Respons server tidak valid.', res.status);
  });
  if (!res.ok || json.success === false || json.status === false) {
    throw new ApiError(json.message || json.error?.message || `HTTP Error ${res.status}`, res.status);
  }
  return json;
}

export async function apiUpload<T = unknown>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, { method: 'POST', body: formData });
}

// 1. AUTH API SERVICES
export const authApi = {
  register: async (payload: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => {
    const res = await apiFetch<AuthResponseData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.data?.user) {
      setStoredUser(res.data.user);
    }
    const token = res.data?.token?.accessToken || res.data?.accessToken;
    if (token) {
      setToken(token, res.data?.token?.refreshToken);
    }
    return res.data;
  },

  login: async (payload: { email: string; password: string }) => {
    const res = await apiFetch<AuthResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.data?.user) {
      setStoredUser(res.data.user);
    }
    const token = res.data?.token?.accessToken || res.data?.accessToken;
    if (token) {
      setToken(token, res.data?.token?.refreshToken);
    }
    return res.data;
  },

  getMe: async () => {
    const res = await apiFetch<User>('/auth/me');
    if (res.data) {
      setStoredUser(res.data);
    }
    return res.data;
  },

  refreshToken: async (refreshToken: string) => {
    const res = await apiFetch<{ accessToken: string }>('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    if (res.data?.accessToken) {
      setToken(res.data.accessToken);
    }
    return res.data;
  },

  logout: async () => {
    try {
      if (hasServerSession()) await apiFetch('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) }),
      });
    } catch {
      // Ignored if token expired
    } finally {
      clearAuthStorage();
    }
  },
};

export interface RemoteTemplate {
  id: string;
  code?: string;
  folderId?: string;
  name: string;
  tagline?: string;
  category?: string;
  price?: number;
  compareAt?: number;
  isHighlighted?: boolean;
  includes?: string[];
  palette?: {
    primary: string;
    accent: string;
    surface: string;
    ink: string;
  };
  typography?: {
    heading: string;
    body: string;
  };
  ornament?: string;
  previewImage?: string;
  demoSlug?: string | null;
  status?: 'available' | 'coming-soon';
  badge?: string;
  [key: string]: unknown;
}

// 2. TEMPLATES API
export const templatesApi = {
  getAll: async (params?: { highlighted?: boolean }) => {
    const query = params?.highlighted ? '?highlighted=1' : '';
    const res = await apiFetch<RemoteTemplate[]>(`/templates${query}`);
    return res.data;
  },
};

// 3. INVITATIONS CRUD API (Owner Dashboard)
export const invitationsApi = {
  getAll: async (params?: {
    status?: 'all' | 'draft' | 'published' | 'archived';
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString();
    const res = await apiFetch<Array<{
      id: string;
      slug: string;
      title: string;
      templateId: TemplateId;
      isPublished: boolean;
      countdownDate: string;
      totalGuests?: number;
      totalRsvp?: number;
      updatedAt?: string;
    }>>(`/invitations${qs ? `?${qs}` : ''}`);
    return res.data;
  },

  create: async (payload: Partial<InvitationData>) => {
    const res = await apiFetch<InvitationData>('/invitations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  checkSlug: async (slug: string, excludeId?: string) => {
    const query = new URLSearchParams({ slug });
    if (excludeId) query.set('excludeId', excludeId);
    const res = await apiFetch<{
      slug: string;
      available: boolean;
      isOwnInvitation?: boolean;
      conflictTitle?: string | null;
      reason?: string;
      suggestions?: string[];
      uniquePath?: string;
      previewUrl?: string;
    }>(`/public/check-slug?${query.toString()}`);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiFetch<InvitationData>(`/invitations/${id}`);
    return res.data;
  },

  update: async (id: string, payload: Partial<InvitationData>) => {
    const res = await apiFetch<InvitationData>(`/invitations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiFetch(`/invitations/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  getStats: async (id: string) => {
    const res = await apiFetch<{
      pageViews?: number;
      uniqueVisitors?: number;
      totalGuests?: number;
      totalHadir?: number;
      totalTidakHadir?: number;
      totalBelumKonfirmasi?: number;
      totalPax?: number;
      totalUcapan?: number;
      deviceBreakdown?: { mobile: string; desktop: string };
      attendanceRate?: string;
      daysLeftToEvent?: number;
    }>(`/invitations/${id}/stats`);
    return res.data;
  },
};

// 4. STORAGE & FILE UPLOAD BRIDGE API (LIST_API.txt: [5] UPLOAD MEDIA & BERKAS)
export const uploadApi = {
  uploadPhoto: async (
    invitationId: string,
    file: File,
    type: 'groom' | 'bride' | 'cover' | 'ogImage' | 'qrCode' | 'story' | 'qris'
  ) => {
    const formData = new FormData();
    // Support both photo (LIST_API spec) and file (fallback)
    formData.append('photo', file);
    formData.append('file', file);
    formData.append('type', type);
    formData.append('category', type);

    const res = await apiUpload<{
      url: string;
      fileName?: string;
      type?: string;
      fileKey?: string;
      size?: number;
      width?: number;
      height?: number;
      format?: string;
    }>(`/invitations/${invitationId}/upload/photo`, formData);
    return res.data;
  },

  uploadGalleryBatch: async (invitationId: string, files: File[]) => {
    const formData = new FormData();
    // In LIST_API.txt, param is photos[]
    files.forEach((f) => {
      formData.append('photos[]', f);
      formData.append('files[]', f);
    });

    const res = await apiUpload<Array<{
      id?: string;
      url: string;
      caption?: string;
    }>>(`/invitations/${invitationId}/upload/gallery-batch`, formData);
    return res.data;
  },

  uploadAudio: async (
    invitationId: string,
    file: File,
    title?: string,
    artist?: string
  ) => {
    const formData = new FormData();
    // In LIST_API.txt, param is audio
    formData.append('audio', file);
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (artist) formData.append('artist', artist);

    const res = await apiUpload<{
      url: string;
      fileName?: string;
      title?: string;
      durationSeconds?: number;
    }>(`/invitations/${invitationId}/upload/audio`, formData);
    return res.data;
  },

  deleteAsset: async (invitationId: string, fileUrl: string) => {
    // In LIST_API.txt, param is fileUrl
    const res = await apiFetch(`/invitations/${invitationId}/assets`, {
      method: 'DELETE',
      body: JSON.stringify({ fileUrl, fileKey: fileUrl }),
    });
    return res.data;
  },
};

// 5. GUEST MANAGER API (LIST_API.txt: [6] MANAJEMEN TAMU)
export const guestsApi = {
  getAll: async (
    invitationId: string,
    params?: { search?: string; category?: string; attendance?: string; page?: number; limit?: number }
  ) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.attendance && params.attendance !== 'all') query.set('attendance', params.attendance);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const res = await apiFetch<{
      guests: GuestItem[];
      stats?: {
        total: number;
        vip: number;
        keluarga: number;
        sahabat: number;
        temanKantor: number;
        umum: number;
      };
    }>(`/invitations/${invitationId}/guests?${query.toString()}`);
    return res.data;
  },

  add: async (
    invitationId: string,
    guest: { name: string; category: string; phoneNumber?: string; phone?: string; maxPax?: number; notes?: string }
  ) => {
    const payload = {
      name: guest.name,
      phoneNumber: guest.phoneNumber || guest.phone || '',
      phone: guest.phoneNumber || guest.phone || '',
      category: guest.category,
      maxPax: guest.maxPax ?? 1,
      notes: guest.notes ?? '',
    };
    const res = await apiFetch<GuestItem & { customInviteLink?: string; guestCode?: string }>(
      `/invitations/${invitationId}/guests`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    return res.data;
  },

  bulkAdd: async (
    invitationId: string,
    guests: Array<{ name: string; phoneNumber?: string; phone?: string; category?: string }>
  ) => {
    const formatted = guests.map((g) => ({
      name: g.name,
      category: g.category || 'Umum',
      phoneNumber: g.phoneNumber || g.phone || '',
      phone: g.phoneNumber || g.phone || '',
    }));
    const res = await apiFetch<{ insertedCount: number }>(
      `/invitations/${invitationId}/guests/bulk`,
      {
        method: 'POST',
        body: JSON.stringify({ guests: formatted }),
      }
    );
    return res.data;
  },

  getWaMessage: async (invitationId: string, guestId: string) => {
    const res = await apiFetch<{
      guestName: string;
      phoneNumber: string;
      waLink: string;
      waUrl?: string;
      message: string;
    }>(`/invitations/${invitationId}/guests/${guestId}/wa-message`);
    return res.data;
  },

  delete: async (invitationId: string, guestId: string) => {
    const res = await apiFetch(`/invitations/${invitationId}/guests/${guestId}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  checkIn: async (invitationId: string, guestId: string, isCheckedIn: boolean) => {
    const res = await apiFetch<GuestItem>(`/invitations/${invitationId}/guests/${guestId}/check-in`, {
      method: 'PATCH',
      body: JSON.stringify({ isCheckedIn }),
    });
    return res.data;
  },
};

// 6. RSVP & GUESTBOOK API (LIST_API.txt: [7] MANAJEMEN RSVP & BUKU TAMU)
export const rsvpsApi = {
  getAll: async (
    invitationId: string,
    params?: { status?: string; attendance?: string; search?: string; page?: number; limit?: number }
  ) => {
    const query = new URLSearchParams();
    const statusVal = params?.status || params?.attendance;
    if (statusVal && statusVal !== 'all') {
      query.set('status', statusVal.toUpperCase());
      query.set('attendance', statusVal);
    }
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const res = await apiFetch<{
      rsvps: RSVPItem[];
      summary?: {
        totalPastiHadir: number;
        totalEstimasiPax: number;
        totalRagu: number;
        totalBerhalangan: number;
        totalUcapan: number;
      };
    }>(`/invitations/${invitationId}/rsvps?${query.toString()}`);
    return res.data;
  },

  delete: async (invitationId: string, rsvpId: string) => {
    const res = await apiFetch(`/invitations/${invitationId}/rsvps/${rsvpId}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  getExportUrl: (invitationId: string) => {
    const token = getToken();
    const base = typeof window !== 'undefined' ? '/api/proxy' : API_BASE;
    return `${base}/invitations/${invitationId}/rsvps/export${
      token ? `?token=${encodeURIComponent(token)}` : ''
    }`;
  },
};

interface PersonalizedGuest {
  id: string;
  name: string;
  category?: string;
  maxPax?: number;
  guestCode?: string;
}

interface RemoteWish {
  id: string | number;
  guestName?: string;
  sender_name?: string;
  attendance?: string;
  pax?: number | string;
  message?: string;
  createdAt?: string;
  created_at?: string;
}

function mapRemoteWish(w: RemoteWish): RSVPItem {
  return {
    id: String(w.id),
    guestName: w.guestName || w.sender_name || 'Tamu',
    attendance:
      (w.attendance || 'hadir').toLowerCase() === 'hadir'
        ? 'hadir'
        : (w.attendance || '').toLowerCase() === 'ragu'
        ? 'ragu'
        : 'tidak',
    pax: Number(w.pax) || 1,
    message: w.message || '',
    createdAt: w.createdAt || w.created_at || new Date().toISOString(),
  };
}

// 7. PUBLIC API (LIST_API.txt: [8] ENDPOINT PUBLIK)
export const publicApi = {
  getBySlug: async (slug: string, toGuest?: string) => {
    const query = toGuest ? `?to=${encodeURIComponent(toGuest)}` : '';
    const res = await apiFetch<InvitationData & { personalizedGuest?: PersonalizedGuest }>(
      `/public/invitations/${slug}${query}`
    );
    if (res.data) {
      try {
        const wishesRes = await apiFetch<RemoteWish[]>(`/public/invitations/${slug}/wishes`);
        if (Array.isArray(wishesRes.data)) {
          res.data.rsvpList = wishesRes.data.map(mapRemoteWish);
        }
      } catch {
        /* ignore wishes fetch failure */
      }
    }
    return res.data;
  },

  submitRsvp: async (
    slug: string,
    payload: {
      guestName: string;
      attendance: string;
      pax?: number;
      totalPax?: number;
      message: string;
      guestCode?: string;
    }
  ) => {
    const attUpper = (payload.attendance || 'HADIR').toUpperCase();
    const normalizedAttendance =
      attUpper === 'HADIR' ? 'HADIR' : attUpper === 'TIDAK' || attUpper === 'TIDAK_HADIR' ? 'TIDAK_HADIR' : 'RAGU';
    const finalPax = payload.totalPax ?? payload.pax ?? 1;

    const body = {
      guestName: payload.guestName,
      attendance: normalizedAttendance,
      totalPax: finalPax,
      pax: finalPax,
      message: payload.message,
      guestCode: payload.guestCode || '',
    };

    const res = await apiFetch<RSVPItem>(`/public/invitations/${slug}/rsvp`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res.data;
  },

  getWishes: async (slug: string, page = 1, limit = 20) => {
    const res = await apiFetch<RSVPItem[]>(
      `/public/invitations/${slug}/wishes?page=${page}&limit=${limit}`
    );
    return res.data;
  },
};

// 8. ORDERS & LICENCES API
export interface RemoteOrderResponse {
  id: string;
  orderNumber?: string;
  templateId: string;
  invitationId: string;
  invitationSlug?: string | null;
  invitationTitle?: string;
  amount: number | string;
  currency?: string;
  status: string;
  createdAt: string;
  paidAt?: string | null;
  paymentMethod?: string | null;
  payment?: unknown;
}

export interface RemoteLicenceResponse {
  id: string;
  invitationId: string;
  invitationSlug?: string | null;
  invitationTitle?: string | null;
  templateId: string;
  orderId?: string;
  kind?: string;
  status?: string;
  issuedAt: string;
}

export const ordersApi = {
  checkout: async (payload: { invitationId?: string; templateId: string; paymentMethod?: string }) => {
    const res = await apiFetch<RemoteOrderResponse>('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  getAll: async () => {
    const res = await apiFetch<RemoteOrderResponse[]>('/orders');
    return res.data;
  },

  getLicences: async () => {
    const res = await apiFetch<RemoteLicenceResponse[]>('/orders/licences');
    return res.data;
  },

  confirmPayment: async (orderId: string, payload?: { proofUrl?: string }) => {
    const res = await apiFetch<RemoteOrderResponse>(`/orders/${orderId}/payment`, {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
    return res.data;
  },

  submitPaymentProof: async (orderId: string, file: File) => {
    const formData = new FormData();
    formData.append('proof', file);
    const res = await apiUpload<RemoteOrderResponse>(`/orders/${orderId}/payment`, formData);
    return res.data;
  },
};

