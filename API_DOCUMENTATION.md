# 📖 API Documentation — InfoMase Digital Wedding

Dokumentasi ringkas dan *to-the-point* untuk integrasi frontend Next.js dengan Backend CodeIgniter 3.

---

## 🌐 Base URL & Header Global

- **Localhost**: `http://localhost/wedding_digital/api/v1`
- **LAN Wi-Fi**: `http://192.168.18.176/wedding_digital/api/v1`
- **Default Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  Authorization: Bearer <access_token>
  ```

### Format Standar Response
```json
// Sukses (200 / 201)
{
  "success": true,
  "message": "Pesan sukses",
  "data": { ... },
  "timestamp": "2026-10-22T13:00:00Z"
}

// Error (400 / 401 / 403 / 404 / 409 / 422 / 500)
{
  "success": false,
  "message": "Pesan kegagalan",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [{ "field": "email", "message": "Format email tidak valid" }]
  },
  "timestamp": "2026-10-22T13:00:00Z"
}
```

---

## 1. 🔐 Authentication & Profil User

### 1.1 Register
- **Endpoint**: `POST /auth/register`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "password": "Password123!",
    "phoneNumber": "081234567890"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Registrasi akun berhasil",
    "data": {
      "user": {
        "id": "24",
        "name": "Budi Santoso",
        "email": "budi@example.com",
        "phoneNumber": "081234567890",
        "avatar": null,
        "role": "USER",
        "createdAt": "2026-10-22T13:00:00+07:00"
      },
      "token": {
        "accessToken": "eyJ0eXAiOiJKV1QiLCJh...",
        "refreshToken": "7f8b9a...",
        "expiresIn": 604800
      },
      "accessToken": "eyJ0eXAiOiJKV1QiLCJh..."
    }
  }
  ```

### 1.2 Login
- **Endpoint**: `POST /auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "budi@example.com",
    "password": "Password123!"
  }
  ```
- **Response `200 OK`**: Mengembalikan objek user dan token JWT yang sama dengan Register.

### 1.3 Ambil Profil User Login (`Me`)
- **Endpoint**: `GET /auth/me`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "24",
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "phoneNumber": "081234567890",
      "totalInvitations": 2
    }
  }
  ```

### 1.4 Refresh Token
- **Endpoint**: `POST /auth/refresh-token`
- **Auth**: `Bearer Token` (Opsional jika token sudah expired)
- **Request Body**: `{ "refreshToken": "7f8b9a..." }`
- **Response `200 OK`**: Mengembalikan accessToken baru.

### 1.5 Logout
- **Endpoint**: `POST /auth/logout`
- **Auth**: `Bearer Token`
- **Response `200 OK`**: `{ "success": true, "message": "Logout berhasil", "data": null }`

---

## 2. 🎨 Katalog Template

### 2.1 Daftar Template Siap Pakai
- **Endpoint**: `GET /templates`
- **Auth**: Public
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "rustic-vintage",
        "name": "Rustic Vintage Romance",
        "slug": "rustic-vintage",
        "description": "Desain Rustic eksklusif bernuansa estetik...",
        "badge": "Terpopuler",
        "previewImage": "http://192.168.18.176/wedding_digital/asset/templates/rustic-preview.jpg",
        "features": ["Desain Elegan Responsif", "Love Story Timeline", "Amplop & Kado Digital", "Background Music"],
        "price": 0,
        "tier": "free"
      }
    ]
  }
  ```

---

## 3. 💌 Manajemen Undangan (Owner Dashboard)

### 3.1 Ambil Semua Undangan Milik User
- **Endpoint**: `GET /invitations`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "10",
        "slug": "budi-ani",
        "title": "The Wedding of Budi & Ani",
        "templateId": "rustic-vintage",
        "isPublished": true,
        "countdownDate": "2026-11-28T08:00:00.000Z",
        "totalGuests": 45,
        "totalRsvp": 28,
        "updatedAt": "2026-10-22T13:00:00+07:00"
      }
    ]
  }
  ```

### 3.2 Buat Undangan Baru
- **Endpoint**: `POST /invitations`
- **Auth**: `Bearer Token`
- **Request Body**:
  ```json
  {
    "title": "The Wedding of Budi & Ani",
    "slug": "budi-ani",
    "templateId": "rustic-vintage",
    "countdownDate": "2026-11-28T08:00:00.000Z"
  }
  ```
- **Response `201 Created`**: Mengembalikan detail lengkap undangan baru dengan nilai default siap edit.

### 3.3 Cek Ketersediaan Slug URL
- **Endpoint**: `GET /invitations/check-slug?slug=budi-ani`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "slug": "budi-ani",
      "available": true,
      "previewUrl": "http://192.168.18.176/wedding_digital/api/v1/public/invitations/budi-ani"
    }
  }
  ```

### 3.4 Ambil Detail Undangan (Untuk Editor Studio)
- **Endpoint**: `GET /invitations/:id`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "10",
      "slug": "budi-ani",
      "title": "The Wedding of Budi & Ani",
      "templateId": "rustic-vintage",
      "isPublished": true,
      "groom": {
        "name": "Budi",
        "fullName": "Budi Santoso, S.Kom.",
        "fatherName": "Bpk. Bambang",
        "motherName": "Ibu Sri",
        "photo": "http://.../groom.jpg",
        "instagram": "budisantoso"
      },
      "bride": {
        "name": "Ani",
        "fullName": "dr. Ani Lestari",
        "fatherName": "Bpk. Hendra",
        "motherName": "Ibu Siti",
        "photo": "http://.../bride.jpg",
        "instagram": "anilestari"
      },
      "quote": {
        "text": "Dan di antara tanda-tanda (kebesaran)-Nya...",
        "source": "QS. Ar-Rum: 21",
        "translation": "Semoga menjadi keluarga yang sakinah..."
      },
      "countdownDate": "2026-11-28T08:00:00.000Z",
      "events": [
        {
          "id": "1",
          "title": "Akad Nikah",
          "date": "2026-11-28",
          "startTime": "08:00",
          "endTime": "10:00",
          "timezone": "WIB",
          "locationName": "Masjid Agung",
          "address": "Jl. Pahlawan No. 1",
          "mapsUrl": "https://maps.google.com"
        }
      ],
      "stories": [
        {
          "id": "1",
          "year": "2022",
          "title": "Pertama Bertemu",
          "description": "Pertemuan pertama di kampus...",
          "image": "http://.../story.jpg"
        }
      ],
      "gallery": [
        { "id": "1", "url": "http://.../gal1.jpg", "caption": "Prewedding" }
      ],
      "music": {
        "title": "A Thousand Years",
        "artist": "Christina Perri",
        "url": "http://.../song.mp3",
        "autoplay": true
      },
      "bankAccounts": [
        {
          "id": "1",
          "bankName": "BCA",
          "accountNumber": "1234567890",
          "accountHolder": "Budi Santoso",
          "qrisUrl": "http://.../qris.jpg"
        }
      ],
      "giftAddress": {
        "recipientName": "Budi & Ani",
        "phone": "081234567890",
        "fullAddress": "Jl. Bahagia No. 10, Semarang"
      }
    }
  }
  ```

### 3.5 Update / Simpan Perubahan Undangan (Save Button)
- **Endpoint**: `PUT /invitations/:id`
- **Auth**: `Bearer Token`
- **Request Body**: Format sama seperti data di atas (bisa parsial).
- **Response `200 OK`**: `{ "success": true, "message": "Undangan berhasil diperbarui" }`

### 3.6 Hapus Undangan
- **Endpoint**: `DELETE /invitations/:id`
- **Auth**: `Bearer Token`
- **Response `200 OK`**: `{ "success": true, "message": "Undangan berhasil dihapus" }`

### 3.7 Statistik Undangan
- **Endpoint**: `GET /invitations/:id/stats`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "pageViews": 1420,
      "uniqueVisitors": 850,
      "deviceBreakdown": { "mobile": "92%", "desktop": "8%" },
      "attendanceRate": "76%",
      "daysLeftToEvent": 37
    }
  }
  ```

---

## 4. 🌐 Endpoint Publik (Tamu & RSVP)

### 4.1 Buka Undangan Publik berdasarkan Slug
- **Endpoint**: `GET /public/invitations/:slug`
- **Query Params (Opsional)**: `?to=Nama+Tamu`
- **Auth**: Public (Otomatis increment `viewCount += 1`)
- **Response `200 OK`**: Mengembalikan payload undangan lengkap + objek `personalizedGuest`:
  ```json
  {
    "success": true,
    "data": {
      "title": "The Wedding of Budi & Ani",
      "personalizedGuest": {
        "name": "Bpk. Hendra Wijaya",
        "category": "VIP"
      },
      ...
    }
  }
  ```

### 4.2 Submit Konfirmasi RSVP & Doa
- **Endpoint**: `POST /public/invitations/:slug/rsvp`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "guestName": "Hendra Wijaya & Keluarga",
    "attendance": "hadir", // "hadir" | "ragu" | "tidak"
    "pax": 2,
    "message": "Selamat menempuh hidup baru!"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Konfirmasi kehadiran dan ucapan Anda berhasil dikirimkan",
    "data": {
      "id": "12",
      "guestName": "Hendra Wijaya & Keluarga",
      "attendance": "hadir",
      "pax": 2,
      "message": "Selamat menempuh hidup baru!",
      "createdAt": "2026-10-22T13:10:00Z"
    }
  }
  ```

### 4.3 Ambil Daftar Ucapan / Feed Buku Tamu
- **Endpoint**: `GET /public/invitations/:slug/wishes?page=1&limit=20`
- **Auth**: Public
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "12",
        "guestName": "Hendra Wijaya & Keluarga",
        "attendance": "hadir",
        "message": "Selamat menempuh hidup baru!",
        "createdAt": "2026-10-22T13:10:00Z"
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
  }
  ```

---

## 5. 📤 Storage & File Upload Bridge

> **Penting**: Gunakan `multipart/form-data` untuk request upload.

### 5.1 Upload Foto Tunggal
- **Endpoint**: `POST /invitations/:id/upload/photo`
- **Auth**: `Bearer Token`
- **Form Data**:
  - `file`: File binary (`.jpg`, `.jpeg`, `.png`, `.webp`, max 5MB)
  - `category`: `"groom"` | `"bride"` | `"story"` | `"qris"` | `"cover"`
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Foto berhasil diunggah",
    "data": {
      "url": "http://192.168.18.176/wedding_digital/uploads/couples/groom_10_123.webp",
      "fileKey": "uploads/couples/groom_10_123.webp",
      "size": 184500,
      "width": 1080,
      "height": 1350,
      "format": "webp"
    }
  }
  ```

### 5.2 Upload Batch Galeri Foto (Multiple)
- **Endpoint**: `POST /invitations/:id/upload/gallery-batch`
- **Auth**: `Bearer Token`
- **Form Data**: `files[]` (Multiple files binary)
- **Response `201 Created`**: Mengembalikan array objek foto yang tersimpan di database.

### 5.3 Upload Audio BGM (MP3)
- **Endpoint**: `POST /invitations/:id/upload/audio`
- **Auth**: `Bearer Token`
- **Form Data**:
  - `file`: File audio binary (`.mp3`, `.wav`, `.ogg`, max 10MB)
  - `title`: String
  - `artist`: String
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "data": {
      "url": "http://192.168.18.176/wedding_digital/uploads/musics/music_10_123.mp3",
      "title": "Shane Filan - Beautiful in White",
      "durationSeconds": 180
    }
  }
  ```

### 5.4 Hapus File dari Storage
- **Endpoint**: `DELETE /invitations/:id/assets`
- **Auth**: `Bearer Token`
- **Request Body**: `{ "fileKey": "uploads/couples/groom_10_123.webp" }`
- **Response `200 OK`**: `{ "success": true, "message": "File berhasil dihapus dari storage" }`

---

## 6. 👥 Manajemen Tamu (Guest Manager)

### 6.1 Ambil Daftar Tamu & Statistik
- **Endpoint**: `GET /invitations/:id/guests?search=hendra&category=VIP&page=1&limit=50`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "guests": [
        {
          "id": "3",
          "name": "Bpk. H. Hendra Wijaya & Keluarga",
          "category": "VIP",
          "phone": "08123456789",
          "personalLink": "http://192.168.18.176:3000/invite/budi-ani?to=Bpk.+H.+Hendra+Wijaya+%26+Keluarga",
          "createdAt": "2026-10-22T13:00:00Z"
        }
      ],
      "stats": {
        "total": 45,
        "vip": 10,
        "keluarga": 15,
        "sahabat": 12,
        "temanKantor": 5,
        "umum": 3
      }
    }
  }
  ```

### 6.2 Tambah Tamu Baru
- **Endpoint**: `POST /invitations/:id/guests`
- **Auth**: `Bearer Token`
- **Request Body**:
  ```json
  {
    "name": "Ibu Ratna & Suami",
    "category": "Sahabat",
    "phone": "081399887766"
  }
  ```
- **Response `201 Created`**: Mengembalikan objek tamu baru beserta `personalLink`-nya.

### 6.3 Import Tamu Sekaligus (Bulk)
- **Endpoint**: `POST /invitations/:id/guests/bulk`
- **Auth**: `Bearer Token`
- **Request Body**:
  ```json
  {
    "guests": [
      { "name": "Bpk. Joko Santoso", "category": "Teman Kantor" },
      { "name": "Mbak Rina Sulistyo", "category": "Sahabat" },
      { "name": "Om Heru & Tante Maya", "category": "Keluarga" }
    ]
  }
  ```
- **Response `201 Created`**: `{ "success": true, "data": { "insertedCount": 3 } }`

### 6.4 Generator Teks Pesan WhatsApp Siap Kirim
- **Endpoint**: `GET /invitations/:id/guests/:guest_id/wa-message`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "guestName": "Bpk. H. Hendra Wijaya & Keluarga",
      "phoneNumber": "08123456789",
      "waUrl": "https://api.whatsapp.com/send?phone=628123456789&text=Kepada...",
      "message": "Kepada Yth.\n*Bpk. H. Hendra Wijaya & Keluarga*..."
    }
  }
  ```

### 6.5 Hapus Tamu
- **Endpoint**: `DELETE /invitations/:id/guests/:guest_id`
- **Auth**: `Bearer Token`
- **Response `200 OK`**: `{ "success": true, "message": "Tamu berhasil dihapus" }`

---

## 7. 📊 Manajemen RSVP & Buku Tamu (Owner)

### 7.1 Daftar RSVP & Rekap Kehadiran
- **Endpoint**: `GET /invitations/:id/rsvps?attendance=hadir&search=hendra`
- **Query Params**: `attendance`: `"all"` | `"hadir"` | `"ragu"` | `"tidak"`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "rsvps": [
        {
          "id": "1",
          "guestName": "Hendra Wijaya",
          "attendance": "hadir",
          "pax": 2,
          "message": "Selamat menempuh hidup baru!",
          "createdAt": "2026-10-22T13:00:00Z"
        }
      ],
      "summary": {
        "totalPastiHadir": 64,
        "totalEstimasiPax": 118,
        "totalRagu": 12,
        "totalBerhalangan": 8,
        "totalUcapan": 84
      }
    }
  }
  ```

### 7.2 Hapus Ucapan
- **Endpoint**: `DELETE /invitations/:id/rsvps/:rsvp_id`
- **Auth**: `Bearer Token`
- **Response `200 OK`**: `{ "success": true, "message": "Ucapan berhasil dihapus" }`

### 7.3 Export Rekap RSVP ke Excel / CSV
- **Endpoint**: `GET /invitations/:id/rsvps/export`
- **Auth**: `Bearer Token`
- **Response**: Mengunduh file `.csv` (BOM UTF-8, langsung rapi saat dibuka di Microsoft Excel).

---

## 8. 💻 Contoh Integrasi di Next.js (`src/lib/api.ts`)

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.18.176/wedding_digital/api/v1';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('infomase_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Terjadi kesalahan pada server');
  }
  return json;
}
```
