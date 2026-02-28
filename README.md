# Jeryl — Personal Website + Admin CMS

Minimal personal website with a built-in admin CMS. Public sections for intro, experience, projects, and blog. Admin dashboard to edit all content without touching code.

## Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + Row Level Security + Storage)
- **Markdown**: `react-markdown` + `remark-gfm`
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** and run the contents of `supabase/migrations/001_schema.sql`
3. Create a storage bucket: go to **Storage** → **New bucket** → name it `images`, check **Public bucket**
4. Create your admin user: go to **Authentication** → **Users** → **Add user** (email + password)

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase project URL and anon key (found in **Settings** → **API**):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) for the public site.
Open [http://localhost:5173/admin/login](http://localhost:5173/admin/login) for the admin dashboard.

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Vite

Publishing workflow: edit content in admin → save → changes are live immediately (no rebuild needed).

## Project Structure

```
src/
├── components/
│   ├── ui/          Spinner, Badge, Card, ErrorMessage, MarkdownRenderer
│   ├── layout/      Navbar, Footer, AdminSidebar
│   └── sections/    IntroSection, ExperienceSection, ProjectsSection
├── pages/
│   ├── public/      HomePage, BlogListPage, BlogPostPage
│   └── admin/       LoginPage, DashboardLayout, EditIntro,
│                    EditExperience, EditProjects, PostsManager, PostEditor
├── hooks/           useProfile, useExperience, useProjects, usePosts, useAuth, useSEO
├── lib/             supabase.ts (client), types.ts (shared types)
└── App.tsx          Router with lazy-loaded admin routes
```

## Database Schema

| Table        | Purpose                                |
|-------------|----------------------------------------|
| `profile`   | Single row — name, tagline, bio        |
| `experience`| Work history entries with ordering      |
| `projects`  | Portfolio projects (draft/published)    |
| `posts`     | Blog posts in markdown (draft/published)|

Row Level Security:
- Public users can read published content
- Only authenticated users can write

## Scripts

| Command         | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start dev server           |
| `npm run build`| Production build           |
| `npm run preview`| Preview production build |
| `npm run lint` | Run ESLint                 |
