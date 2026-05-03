# Panduan Pengujian API - DFD Level 1
*Gunakan panduan ini untuk melakukan pengujian Endpoint API di Postman.*

Pastikan server lokal menyala (`npm run dev`) dan arahkan URL ke `http://localhost:3000`.

---

## P1 (1.0 Auth & User Management)

### 1A. Memeriksa Data User (Admin)
- **Method:** `GET`
- **URL:** `/api/auth`
- **Fungsi:** Menampilkan seluruh daftar user yang terdaftar di sistem.

### 1B. Login User
- **Method:** `POST`
- **URL:** `/api/auth`
- **Body (JSON):**
  ```json
  {
    "username": "husni",
    "password": "password123"
  }
  ```

---

## P2 (2.0 Manajemen Konten & Versi)

### 2A. Menampilkan Daftar Konten
- **Method:** `GET`
- **URL:** `/api/contents`
- **Fungsi:** Mengambil semua project beserta versi terakhirnya.

### 2B. Membuat Project Baru (Auto-Create Versi 1.0)
- **Method:** `POST`
- **URL:** `/api/contents`
- **Body (JSON):**
  ```json
  {
    "title": "Desain Banner Ramadhan",
    "type": "design",
    "priority": "High",
    "author_name": "Akmal Okhi"
  }
  ```
> **Catatan:** Setelah di-Send, perhatikan `project_id` yang dihasilkan di kolom `data.project.id` pada *Response* Postman. ID ini akan dipakai untuk pengujian P3 dan P4 di bawah!

---

## P3 (3.0 Review & Feedback)

### 3A. Menampilkan Riwayat Komentar
- **Method:** `GET`
- **URL:** `/api/feedbacks`

### 3B. Menambahkan Feedback/Komentar
- **Method:** `POST`
- **URL:** `/api/feedbacks`
- **Body (JSON):**
  ```json
  {
    "project_id": "MASUKKAN_PROJECT_ID_DARI_LANGKAH_2B_DI_SINI",
    "user_name": "Dosen Reviewer",
    "text": "Warna background kurang terang, tolong diubah."
  }
  ```
> **Catatan:** Sekarang kamu tidak perlu lagi pusing mencari `version_id`. Cukup paste `project_id`, dan API kita otomatis melacak versi terbarunya!

---

## P4 (4.0 Workflow & Status Update)

### 4A. Update Status Workflow (Biasa)
- **Method:** `PATCH`
- **URL:** `/api/workflows`
- **Body (JSON):**
  ```json
  {
    "project_id": "MASUKKAN_PROJECT_ID_DARI_LANGKAH_2B_DI_SINI",
    "new_status": "Revisi",
    "user_name": "Dosen Reviewer"
  }
  ```

### 4B. Update Status (Auto-Bump Versi: Revisi -> Review)
- **Method:** `PATCH`
- **URL:** `/api/workflows`
- **Body (JSON):**
  ```json
  {
    "project_id": "MASUKKAN_PROJECT_ID_DARI_LANGKAH_2B_DI_SINI",
    "new_status": "Review",
    "user_name": "Akmal Okhi"
  }
  ```
> **Catatan:** Jika project sedang berstatus **Revisi**, dan kamu mengirimkan status baru **Review**, sistem otomatis mendeteksi bahwa kamu mengunggah revisi baru. Versi project akan naik otomatis dari `v1.0` menjadi `v1.1`!

---

## P5 (5.0 Notification & Reminder)

### 5A. Generate Notifikasi Deadline
- **Method:** `GET`
- **URL:** `/api/notifications`
- **Fungsi:** Mengambil semua project yang belum *Approved*. Jika tanggal *deadline* sudah lewat dari hari ini, notifikasi otomatis dilabeli `URGENT` dengan pesan `DEADLINE TERLEWATI`. Jika belum lewat, dilabeli `REMINDER`.
