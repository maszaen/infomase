import { ApiResponse, AuthResponseData, User } from '@/types/auth';
import { InvitationData, RSVPItem, GuestItem, TemplateId } from '@/types/invitation';

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost/wedding_digital/api/v1';

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
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      `Tidak dapat terhubung ke server backend di "${url}". Pastikan web server Apache/CodeIgniter sudah berjalan (misal di XAMPP) dan CORS diizinkan.`
    );
  }

  const json: ApiResponse<T> = await res.json().catch(() => ({
    success: false,
    message: 'Gagal memproses respon server',
    data: null as any,
  }));

  if (!res.ok || !json.success) {
    const errorMsg =
      json.message ||
      json.error?.message ||
      json.error?.details?.[0]?.message ||
      `HTTP Error ${res.status}`;
    throw new Error(errorMsg);
  }

  return json;
}

// Upload Fetcher
export async function apiUpload<T = any>(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  const json: ApiResponse<T> = await res.json().catch(() => ({
    success: false,
    message: 'Gagal upload file',
    data: null as any,
  }));

  if (!res.ok || !json.success) {
    throw new Error(json.message || `Upload gagal dengan status ${res.status}`);
  }

  return json;
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
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // Ignored if token expired
    } finally {
      clearAuthStorage();
    }
  },
};

// 2. TEMPLATES API
export const templatesApi = {
  getAll: async () => {
    const res = await apiFetch<any[]>('/templates');
    return res.data;
  },
};

// 3. INVITATIONS CRUD API (Owner Dashboard)
export const invitationsApi = {
  getAll: async () => {
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
    }>>('/invitations');
    return res.data;
  },

  create: async (payload: {
    title: string;
    slug: string;
    templateId: string;
    countdownDate: string;
  }) => {
    const res = await apiFetch<InvitationData>('/invitations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  checkSlug: async (slug: string) => {
    const res = await apiFetch<{
      slug: string;
      available: boolean;
      previewUrl?: string;
    }>(`/invitations/check-slug?slug=${encodeURIComponent(slug)}`);
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
      pageViews: number;
      uniqueVisitors: number;
      deviceBreakdown: { mobile: string; desktop: string };
      attendanceRate: string;
      daysLeftToEvent: number;
    }>(`/invitations/${id}/stats`);
    return res.data;
  },
};

// 4. STORAGE & FILE UPLOAD BRIDGE API
export const uploadApi = {
  uploadPhoto: async (
    invitationId: string,
    file: File,
    category: 'groom' | 'bride' | 'story' | 'qris' | 'cover'
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const res = await apiUpload<{
      url: string;
      fileKey: string;
      size: number;
      width: number;
      height: number;
      format: string;
    }>(`/invitations/${invitationId}/upload/photo`, formData);
    return res.data;
  },

  uploadGalleryBatch: async (invitationId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files[]', f));

    const res = await apiUpload<Array<{
      id: string;
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
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (artist) formData.append('artist', artist);

    const res = await apiUpload<{
      url: string;
      title?: string;
      durationSeconds?: number;
    }>(`/invitations/${invitationId}/upload/audio`, formData);
    return res.data;
  },

  deleteAsset: async (invitationId: string, fileKey: string) => {
    const res = await apiFetch(`/invitations/${invitationId}/assets`, {
      method: 'DELETE',
      body: JSON.stringify({ fileKey }),
    });
    return res.data;
  },
};

// 5. GUEST MANAGER API
export const guestsApi = {
  getAll: async (
    invitationId: string,
    params?: { search?: string; category?: string; page?: number; limit?: number }
  ) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category && params.category !== 'all') query.set('category', params.category);
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
    guest: { name: string; category: string; phone?: string }
  ) => {
    const res = await apiFetch<GuestItem>(`/invitations/${invitationId}/guests`, {
      method: 'POST',
      body: JSON.stringify(guest),
    });
    return res.data;
  },

  bulkAdd: async (invitationId: string, guests: Array<{ name: string; category?: string }>) => {
    const res = await apiFetch<{ insertedCount: number }>(
      `/invitations/${invitationId}/guests/bulk`,
      {
        method: 'POST',
        body: JSON.stringify({ guests }),
      }
    );
    return res.data;
  },

  getWaMessage: async (invitationId: string, guestId: string) => {
    const res = await apiFetch<{
      guestName: string;
      phoneNumber: string;
      waUrl: string;
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
};

// 6. RSVP & GUESTBOOK API
export const rsvpsApi = {
  getAll: async (
    invitationId: string,
    params?: { attendance?: string; search?: string; page?: number; limit?: number }
  ) => {
    const query = new URLSearchParams();
    if (params?.attendance && params.attendance !== 'all') query.set('attendance', params.attendance);
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
    return `${API_BASE}/invitations/${invitationId}/rsvps/export${
      token ? `?token=${encodeURIComponent(token)}` : ''
    }`;
  },
};

// 7. PUBLIC API (Tamu & Standalone Invitation)
export const publicApi = {
  getBySlug: async (slug: string, toGuest?: string) => {
    const query = toGuest ? `?to=${encodeURIComponent(toGuest)}` : '';
    const res = await apiFetch<InvitationData & { personalizedGuest?: any }>(
      `/public/invitations/${slug}${query}`
    );
    return res.data;
  },

  submitRsvp: async (
    slug: string,
    payload: {
      guestName: string;
      attendance: 'hadir' | 'tidak' | 'ragu';
      pax: number;
      message: string;
    }
  ) => {
    const res = await apiFetch<RSVPItem>(`/public/invitations/${slug}/rsvp`, {
      method: 'POST',
      body: JSON.stringify(payload),
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
