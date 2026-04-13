-- =============================================
-- REVISI.IO - Generate 40 Dummy Data (10 / Status)
-- Eksekusi script ini di Supabase SQL Editor
-- =============================================

DO $$
DECLARE
  c_husni UUID;
  c_febri UUID;
  p_id UUID;
  i INT;
  type_arr TEXT[] := ARRAY['doc', 'video', 'design'];
  auth_arr TEXT[] := ARRAY['Akmal Okhi', 'Dafa Izul', 'Vicky Fareli', 'Radith'];
  ini_arr TEXT[] := ARRAY['AO', 'DI', 'VF', 'RD'];
  prio_arr TEXT[] := ARRAY['Low', 'Medium', 'High', 'Urgent'];
  title_adj_arr TEXT[] := ARRAY['Creative', 'Promo', 'Campaign', 'Ads', 'Guidelines', 'Asset', 'Video', 'Reel', 'Carousel', 'Banner'];
  t_client UUID;
  t_auth TEXT;
  t_ini TEXT;
  target_type TEXT;
  target_prio TEXT;
  target_title TEXT;
BEGIN
  -- Ambil ID Client
  SELECT id INTO c_husni FROM users WHERE username = 'husni' LIMIT 1;
  SELECT id INTO c_febri FROM users WHERE username = 'febri' LIMIT 1;

  -- Jika secara kebetulan tidak ada username "husni" atau "febri", kita ambil sebarang client
  IF c_husni IS NULL THEN
     SELECT id INTO c_husni FROM users WHERE role LIKE '%Client%' LIMIT 1;
  END IF;
  IF c_febri IS NULL THEN
     c_febri := c_husni;
  END IF;

  -- ==========================================
  -- 1. INSERT STATUS: Draft (10 data)
  -- ==========================================
  FOR i IN 1..10 LOOP
    t_client := CASE WHEN i % 2 = 0 THEN c_febri ELSE c_husni END;
    t_auth := auth_arr[(i % 4) + 1];
    t_ini := ini_arr[(i % 4) + 1];
    target_type := type_arr[(i % 3) + 1];
    target_prio := prio_arr[(i % 4) + 1];
    target_title := title_adj_arr[i] || ' Draft 2024';
    p_id := gen_random_uuid();
    
    INSERT INTO projects (id, title, type, status, current_version, author_name, author_initial, priority, deadline, client_id)
    VALUES (p_id, target_title, target_type, 'Draft', 'v1.0', t_auth, t_ini, target_prio, now() + (i || ' days')::interval, t_client);
    
    INSERT INTO project_versions (project_id, version_num, note, user_name)
    VALUES (p_id, 'v1.0', 'Draf awal sedang dipersiapkan untuk disubmit. Masih butuh sedikit finalisasi.', t_auth);
  END LOOP;

  -- ==========================================
  -- 2. INSERT STATUS: Review (10 data)
  -- ==========================================
  FOR i IN 1..10 LOOP
    t_client := CASE WHEN i % 2 = 0 THEN c_febri ELSE c_husni END;
    t_auth := auth_arr[(i % 4) + 1];
    t_ini := ini_arr[(i % 4) + 1];
    target_type := type_arr[(i % 3) + 1];
    target_prio := prio_arr[(i % 4) + 1];
    target_title := 'Review ' || title_adj_arr[11 - i] || ' Q3';
    p_id := gen_random_uuid();
    
    INSERT INTO projects (id, title, type, status, current_version, author_name, author_initial, priority, deadline, client_id)
    VALUES (p_id, target_title, target_type, 'Review', 'v1.0', t_auth, t_ini, target_prio, now() + (i || ' days')::interval, t_client);
    
    INSERT INTO project_versions (project_id, version_num, note, user_name)
    VALUES (p_id, 'v1.0', 'Mohon berikan review untuk konten final ini, apakah sudah sesuai arahan?', t_auth);
  END LOOP;

  -- ==========================================
  -- 3. INSERT STATUS: Revisi (10 data)
  -- ==========================================
  FOR i IN 1..10 LOOP
    t_client := CASE WHEN i % 2 = 0 THEN c_febri ELSE c_husni END;
    t_auth := auth_arr[(i % 4) + 1];
    t_ini := ini_arr[(i % 4) + 1];
    target_type := type_arr[(i % 3) + 1];
    target_prio := prio_arr[(i % 4) + 1];
    target_title := 'Revisi Minor: ' || title_adj_arr[i];
    p_id := gen_random_uuid();
    
    INSERT INTO projects (id, title, type, status, current_version, author_name, author_initial, priority, deadline, client_id)
    VALUES (p_id, target_title, target_type, 'Revisi', 'v1.0', t_auth, t_ini, target_prio, now() + (i || ' days')::interval, t_client);
    
    INSERT INTO project_versions (project_id, version_num, note, user_name)
    VALUES (p_id, 'v1.0', 'Draf konten tahap awal untuk direview (Pending revisi).', t_auth);

    -- Simulasikan feedback/revisi dari client
    INSERT INTO comments (version_id, user_name, text)
    VALUES ((SELECT id FROM project_versions WHERE project_id = p_id AND version_num = 'v1.0'), 'Client', 'Tolong ubah beberapa bagian yang masih off-brand terutama di transisi warna akhir.');
  END LOOP;

  -- ==========================================
  -- 4. INSERT STATUS: Approved (10 data)
  -- ==========================================
  FOR i IN 1..10 LOOP
    t_client := CASE WHEN i % 2 = 0 THEN c_febri ELSE c_husni END;
    t_auth := auth_arr[(i % 4) + 1];
    t_ini := ini_arr[(i % 4) + 1];
    target_type := type_arr[(i % 3) + 1];
    target_prio := prio_arr[(i % 4) + 1];
    target_title := 'Approved Data: ' || title_adj_arr[11 - i] || ' Selesai';
    p_id := gen_random_uuid();
    
    INSERT INTO projects (id, title, type, status, current_version, author_name, author_initial, priority, deadline, client_id)
    VALUES (p_id, target_title, target_type, 'Approved', 'v2.0', t_auth, t_ini, target_prio, now() - (i || ' days')::interval, t_client);
    
    INSERT INTO project_versions (project_id, version_num, note, user_name)
    VALUES (p_id, 'v1.0', 'Draft Pengajuan', t_auth);
    
    INSERT INTO project_versions (project_id, version_num, note, user_name)
    VALUES (p_id, 'v2.0', 'Revisi final berdasarkan komplain sudah diperbaiki semuanya.', t_auth);
    
    INSERT INTO comments (version_id, user_name, text)
    VALUES ((SELECT id FROM project_versions WHERE project_id = p_id AND version_num = 'v1.0'), 'Client', 'Tambahkan Call to Action (CTA) yang lebih persuasif.');

    INSERT INTO comments (version_id, user_name, text)
    VALUES ((SELECT id FROM project_versions WHERE project_id = p_id AND version_num = 'v2.0'), 'Client', 'Oke sudah sempurna. Di-approve ya! 🎉');
  END LOOP;

END $$;
