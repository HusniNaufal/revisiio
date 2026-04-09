-- =============================================
-- REVISI.IO - Database Schema for Supabase
-- Jalankan script ini di Supabase SQL Editor
-- =============================================

-- 1. Tabel Users (Tim & Klien)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Creator',
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Projects (Konten: Draft, Review, Revisi, Approved)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'doc',
  status TEXT NOT NULL DEFAULT 'Draft',
  current_version TEXT NOT NULL DEFAULT 'v1.0',
  author_name TEXT NOT NULL,
  author_initial TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'Medium',
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Project Versions (Riwayat versi revisi)
CREATE TABLE IF NOT EXISTS project_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version_num TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  user_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel Comments (Feedback per versi)
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version_id UUID NOT NULL REFERENCES project_versions(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- SEED DATA (Data Awal / Contoh)
-- =============================================

-- Seed Users
INSERT INTO users (name, role, status) VALUES
  ('Akmal Okhi', 'Creative Lead', 'Active'),
  ('Dafa Izul', 'Lead Designer', 'Active'),
  ('Vicky Fareli', 'Video Editor', 'On Leave'),
  ('Husni', 'Client / Reviewer', 'Active');

-- Seed Projects
INSERT INTO projects (id, title, type, status, current_version, author_name, author_initial, priority, deadline) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Strategi Konten Q2: Global Expansion', 'doc', 'Draft', 'v1.0', 'Akmal Okhi', 'AO', 'High', now() + interval '1 day'),
  ('b2222222-2222-2222-2222-222222222222', 'Visual Asset: Ramadhan Mega Sale', 'design', 'Review', 'v2.1', 'Dafa Izul', 'DI', 'Urgent', now() - interval '1 day'),
  ('c3333333-3333-3333-3333-333333333333', 'TikTok Ad: New Arrival', 'video', 'Revisi', 'v1.2', 'Vicky Fareli', 'VF', 'Medium', now() + interval '12 hours'),
  ('d4444444-4444-4444-4444-444444444444', 'Brand Voice Guidelines 2024', 'doc', 'Approved', 'v1.0', 'Akmal Okhi', 'AO', 'Low', now() - interval '6 days');

-- Seed Project Versions
INSERT INTO project_versions (id, project_id, version_num, note, user_name) VALUES
  ('e5550001-0001-0001-0001-000000000001', 'a1111111-1111-1111-1111-111111111111', 'v1.0', 'Draf awal dibuat', 'Akmal'),
  ('e5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 'v2.1', 'Perubahan warna tombol sesuai request', 'Dafa'),
  ('f6666666-6666-6666-6666-666666666666', 'b2222222-2222-2222-2222-222222222222', 'v1.0', 'Konsep awal desain ramadhan', 'Dafa'),
  ('77777777-7777-7777-7777-777777777777', 'c3333333-3333-3333-3333-333333333333', 'v1.2', 'Pemotongan durasi video', 'Vicky'),
  ('88888888-8888-8888-8888-888888888888', 'c3333333-3333-3333-3333-333333333333', 'v1.1', 'Penambahan subtitle', 'Vicky'),
  ('99999999-9999-9999-9999-999999999999', 'd4444444-4444-4444-4444-444444444444', 'v1.0', 'Final', 'Akmal');

-- Seed Comments
INSERT INTO comments (version_id, user_name, text) VALUES
  ('f6666666-6666-6666-6666-666666666666', 'Client', 'Tambahkan sedikit shadow pada tombol CTA.'),
  ('88888888-8888-8888-8888-888888888888', 'Client', 'Subtitle terlalu cepat');

-- =============================================
-- Row Level Security (RLS)
-- Untuk development, buka akses penuh dulu
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for project_versions" ON project_versions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for comments" ON comments FOR ALL USING (true) WITH CHECK (true);
