-- =============================================
-- REVISI.IO - Flush Projects Data
-- Jalankan script ini di Supabase SQL Editor
-- =============================================

-- Hapus data dari tabel komentar
DELETE FROM comments;

-- Hapus data dari tabel riwayat versi project
DELETE FROM project_versions;

-- Hapus data dari tabel projek utama
DELETE FROM projects;

-- Catatan: Data pengguna (users) dan relasi tim (client_teams) tidak akan terhapus.
