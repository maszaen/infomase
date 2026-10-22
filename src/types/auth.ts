export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar?: string | null;
  role: 'USER' | 'ADMIN';
  totalInvitations?: number;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthResponseData {
  user: User;
  token?: AuthTokens;
  accessToken?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: {
    code?: string;
    message?: string;
    details?: Array<{ field: string; message: string }>;
  };
  timestamp?: string;
}
