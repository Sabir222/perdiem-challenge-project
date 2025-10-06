export interface Store {
  id: string;
  name: string;
  slug: string;
  welcome_message?: string;
  theme: string; // Theme as text (e.g., hex color codes)
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  store_id: string; // Foreign key to store
  created_at: Date;
  updated_at: Date;
}

