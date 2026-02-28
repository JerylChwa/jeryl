export interface Profile {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  avatar_url: string | null;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  tags: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string | null;
  image_url: string | null;
  tags: string[];
  display_order: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
