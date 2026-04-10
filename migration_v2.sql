-- =============================================
-- REVISI.IO - Database Migration v2
-- Eksekusi file ini di Supabase SQL Editor
-- =============================================

-- 1. Bersihkan data dummy lama untuk mencegah error Foregin Key
DELETE FROM comments;
DELETE FROM project_versions;
DELETE FROM projects;

-- 2. Modifikasi tabel projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- 3. Buat tabel relasi tim (Client <-> CC)
CREATE TABLE IF NOT EXISTS client_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cc_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id, cc_id) -- Mencegah duplikasi assignment
);

-- 4. Tambahkan user dummy tambahan untuk testing (Febri & Radith)
INSERT INTO users (name, role, status, username, password) VALUES
  ('Febri', 'Client / Reviewer', 'Active', 'febri', 'febri123'),
  ('Radith', 'Lead Designer', 'Active', 'radith', 'radith123')
ON CONFLICT (username) DO NOTHING;

-- 5. Set relasi tim (Assign CC ke Klien)
-- Pertama, kita ambil UUID dari masing-masing user
DO $$
DECLARE
    husni_id UUID;
    febri_id UUID;
    akmal_id UUID;
    dafa_id UUID;
    vicky_id UUID;
    radith_id UUID;
BEGIN
    SELECT id INTO husni_id FROM users WHERE username = 'husni';
    SELECT id INTO febri_id FROM users WHERE username = 'febri';
    
    SELECT id INTO akmal_id FROM users WHERE username = 'akmal';
    SELECT id INTO dafa_id FROM users WHERE username = 'dafa';
    SELECT id INTO vicky_id FROM users WHERE username = 'vicky';
    SELECT id INTO radith_id FROM users WHERE username = 'radith';

    -- Tim Husni: Akmal (Creative Lead), Dafa (Designer)
    IF husni_id IS NOT NULL THEN
        IF akmal_id IS NOT NULL THEN
            INSERT INTO client_teams (client_id, cc_id) VALUES (husni_id, akmal_id) ON CONFLICT DO NOTHING;
        END IF;
        IF dafa_id IS NOT NULL THEN
            INSERT INTO client_teams (client_id, cc_id) VALUES (husni_id, dafa_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    -- Tim Febri: Radith (Designer), Vicky (Video Editor)
    IF febri_id IS NOT NULL THEN
        IF radith_id IS NOT NULL THEN
            INSERT INTO client_teams (client_id, cc_id) VALUES (febri_id, radith_id) ON CONFLICT DO NOTHING;
        END IF;
        IF vicky_id IS NOT NULL THEN
            INSERT INTO client_teams (client_id, cc_id) VALUES (febri_id, vicky_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- 6. Tambahkan Rules RLS untuk tabel baru
ALTER TABLE client_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for client_teams" ON client_teams FOR ALL USING (true) WITH CHECK (true);
