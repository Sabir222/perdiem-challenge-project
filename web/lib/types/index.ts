export interface User {
  id: string;
  email: string;
  store_id: string;
}

export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  theme: string;
  welcome_message: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User | null;
  token?: string;
  error?: string;
  message?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}