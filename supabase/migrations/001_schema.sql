-- Profile (single row for site intro)
create table profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  tagline text not null default '',
  bio text not null default '',
  avatar_url text,
  updated_at timestamptz not null default now()
);

-- Experience entries
create table experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  start_date date not null,
  end_date date,
  description text not null default '',
  tags text[] not null default '{}',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  url text,
  image_url text,
  tags text[] not null default '{}',
  display_order int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Blog posts
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null default '',
  excerpt text not null default '',
  cover_image_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_slug_idx on posts (slug);
create index posts_status_idx on posts (status);

-- =============================
-- Row Level Security Policies
-- =============================

alter table profile enable row level security;
alter table experience enable row level security;
alter table projects enable row level security;
alter table posts enable row level security;

-- Public read access for all tables
create policy "Public read profile" on profile
  for select using (true);

create policy "Public read experience" on experience
  for select using (true);

create policy "Public read published projects" on projects
  for select using (status = 'published');

create policy "Public read published posts" on posts
  for select using (status = 'published');

-- Admin full access (authenticated user)
-- Replace YOUR_USER_ID with your Supabase auth user UUID after signup,
-- or use auth.uid() to allow any authenticated user.
create policy "Admin manage profile" on profile
  for all using (auth.uid() is not null);

create policy "Admin manage experience" on experience
  for all using (auth.uid() is not null);

create policy "Admin manage projects" on projects
  for all using (auth.uid() is not null);

create policy "Admin manage posts" on posts
  for all using (auth.uid() is not null);

-- =============================
-- Storage bucket for images
-- =============================
-- Run this in the Supabase dashboard SQL editor:
-- insert into storage.buckets (id, name, public) values ('images', 'images', true);
