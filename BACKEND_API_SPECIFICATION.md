# 🚀 InfoMase — Backend REST API Specification & Architecture Guide

Dokumentasi spesifikasi teknis dan blueprint REST API untuk pengembang backend **InfoMase** (*Platform Undangan Online Sat-Set*). Dokumen ini dirancang sebagai panduan implementasi lengkap agar backend dapat langsung berkomunikasi dengan frontend Next.js 16 secara seamless, modular, aman, dan terisolasi.

---

## 📑 Daftar Isi
1. [Arsitektur & Konvensi Global](#1-arsitektur--konvensi-global)
2. [Format Standar Response & Error Handling](#2-format-standar-response--error-handling)
3. [Skema Database (ERD & Prisma Model)](#3-skema-database-erd--prisma-model)
4. [Katalog Endpoint Lengkap](#4-katalog-endpoint-lengkap)
   - [A. Authentication & User Profile (Terisolasi)](#a-authentication--user-profile)
   - [B. Manajemen Template & Katalog](#b-manajemen-template--katalog)
   - [C. Manajemen Undangan (Invitations CRUD)](#c-manajemen-undangan-invitations-crud)
   - [D. Endpoint Publik Undangan (Tamu & RSVP)](#d-endpoint-publik-undangan-tamu--rsvp)
   - [E. Storage & File Upload Bridge (Gambar & Audio)](#e-storage--file-upload-bridge)
   - [F. Manajemen Tamu (Guest Manager & WhatsApp Generator)](#f-manajemen-tamu-guest-manager)
   - [G. Manajemen RSVP & Buku Tamu (Dashboard Owner)](#g-manajemen-rsvp--buku-tamu)
   - [H. Statistik & Ringkasan Metrik](#h-statistik--ringkasan-metrik)
5. [Keamanan, CORS, & Rate Limiting](#5-keamanan-cors--rate-limiting)
6. [Panduan Integrasi Frontend Next.js](#6-panduan-integrasi-frontend-nextjs)

---

## 1. Arsitektur & Konvensi Global

- **Base URL**:
  - Development: `http://localhost:5000/api/v1`
  - Production: `https://api.infomase.id/api/v1`
- **Protocol**: HTTPS wajib di production.
- **Format Data**: JSON (`Content-Type: application/json`) untuk request dan response biasa.
- **Upload File**: `multipart/form-data` untuk upload avatar, galeri, barcode QRIS, dan audio musik.
- **Autentikasi**: JSON Web Token (JWT) Bearer Token pada HTTP Header:
  ```http
  Authorization: Bearer <access_token>
  ```
- **Prinsip Isolasi Data**:
  - Setiap user memiliki akun sendiri.
  - User **hanya** dapat membaca, mengubah, dan menghapus undangan serta data tamu yang berelasi dengan `userId` miliknya.
  - Endpoint publik (`/public/...`) tidak memerlukan token autentikasi, namun dilindungi rate limiting.

---

## 2. Format Standar Response & Error Handling

### 2.1 Format Response Sukses (200 OK, 201 Created)
```json
{
  "success": true,
  "message": "Operasi berhasil dijalankan",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  },
  "timestamp": "2026-10-22T10:00:00.000Z"
}
```

### 2.2 Format Response Gagal (400, 401, 403, 404, 422, 500)
```json
{
  "success": false,
  "message": "Validasi gagal atau data tidak ditemukan",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "slug",
        "message": "Slug sudah digunakan oleh pengguna lain"
      }
    ]
  },
  "timestamp": "2026-10-22T10:00:00.000Z"
}
```

### 2.3 Standar HTTP Status Code
| Status Code | Makna | Penggunaan |
|-------------|-------|------------|
| `200 OK` | Sukses | Permintaan `GET`, `PUT`, `PATCH`, atau `DELETE` berhasil |
| `201 Created` | Berhasil dibuat | Pendaftaran, pembuatan undangan baru, penambahan tamu/RSVP |
| `400 Bad Request` | Permintaan tidak valid | Format JSON rusak atau parameter query salah |
| `401 Unauthorized` | Belum login / Token hangus | Token tidak ada, format salah, atau expired |
| `403 Forbidden` | Tidak berhak akses | Mengedit undangan milik user lain |
| `404 Not Found` | Data tidak ada | Slug undangan atau ID tamu tidak ditemukan |
| `409 Conflict` | Duplikasi data unik | Slug undangan sudah terdaftar atau email kembar |
| `422 Unprocessable`| Validasi input gagal | Format email tidak valid, password terlalu pendek |
| `429 Too Many Req`| Melebihi batas request | Spam submit RSVP publik atau brute-force login |
| `500 Server Error` | Kesalahan internal | Bug server atau koneksi database terputus |

---

## 3. Skema Database (ERD & Prisma Model)

Rekomendasi skema database relasional (PostgreSQL / MySQL) menggunakan Prisma ORM:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  ADMIN
}

enum AttendanceStatus {
  HADIR
  TIDAK
  RAGU
}

enum GuestCategory {
  KELUARGA
  TEMAN_KANTOR
  SAHABAT
  VIP
  UMUM
}

enum TemplateId {
  RUSTIC
  ROYAL_GOLD
  ISLAMIC
  SAKURA
}

model User {
  id           String        @id @default(uuid())
  name         String
  email        String        @unique
  passwordHash String
  phoneNumber  String?
  avatarUrl    String?
  role         Role          @default(USER)
  invitations  Invitation[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Invitation {
  id            String         @id @default(uuid())
  userId        String
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  slug          String         @unique
  title         String
  templateId    TemplateId     @default(RUSTIC)
  isPublished   Boolean        @default(true)
  viewCount     Int            @default(0)
  
  // Data Mempelai Pria (Groom)
  groomName       String
  groomFullName   String
  groomFatherName String
  groomMotherName String
  groomPhoto      String
  groomInstagram  String?
  groomBio        String?

  // Data Mempelai Wanita (Bride)
  brideName       String
  brideFullName   String
  brideFatherName String
  brideMotherName String
  bridePhoto      String
  brideInstagram  String?
  brideBio        String?

  // Kutipan & Tanggal
  quoteText       String       @db.Text
  quoteSource     String
  quoteTranslation String?     @db.Text
  countdownDate   DateTime

  // Musik Latar
  musicTitle      String       @default("Beautiful in White")
  musicArtist     String       @default("Shane Filan")
  musicUrl        String
  musicAutoplay   Boolean      @default(true)

  // Alamat Kado Fisik (Optional)
  giftRecipientName String?
  giftPhone         String?
  giftFullAddress   String?    @db.Text

  // Relasi Sub-Item
  events          Event[]
  stories         LoveStory[]
  gallery         GalleryPhoto[]
  bankAccounts    BankAccount[]
  guests          Guest[]
  rsvps           RSVP[]

  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([slug])
  @@index([userId])
}

model Event {
  id            String      @id @default(uuid())
  invitationId  String
  invitation    Invitation  @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  title         String
  date          DateTime    @db.Date
  startTime     String      // Format: "08:00"
  endTime       String      // Format: "11:00"
  timezone      String      @default("WIB")
  locationName  String
  address       String      @db.Text
  mapsUrl       String
  order         Int         @default(0)
}

model LoveStory {
  id            String      @id @default(uuid())
  invitationId  String
  invitation    Invitation  @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  year          String
  title         String
  description   String      @db.Text
  image         String?
  order         Int         @default(0)
}

model GalleryPhoto {
  id            String      @id @default(uuid())
  invitationId  String
  invitation    Invitation  @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  url           String
  caption       String?
  order         Int         @default(0)
  createdAt     DateTime    @default(now())
}

model BankAccount {
  id            String      @id @default(uuid())
  invitationId  String
  invitation    Invitation  @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  bankName      String
  accountNumber String
  accountHolder String
  qrisUrl       String?
}

model Guest {
  id            String        @id @default(uuid())
  invitationId  String
  invitation    Invitation    @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  name          String
  category      GuestCategory @default(UMUM)
  phone         String?
  createdAt     DateTime      @default(now())
}

model RSVP {
  id            String           @id @default(uuid())
  invitationId  String
  invitation    Invitation       @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  guestName     String
  attendance    AttendanceStatus @default(HADIR)
  pax           Int              @default(1)
  message       String           @db.Text
  createdAt     DateTime         @default(now())

  @@index([invitationId, createdAt])
}
```

---

## 4. Katalog Endpoint Lengkap

### A. Authentication & User Profile
Semua alur login/register wajib terisolasi. Password di-hash menggunakan `bcrypt` atau `argon2id`.

#### 1. Register User Baru
- **Endpoint**: `POST /api/v1/auth/register`
- **Auth**: Public (Tidak butuh token)
- **Request Body**:
  ```json
  {
    "name": "Ahmad Dani",
    "email": "ahmad@example.com",
    "password": "PasswordSangatKuat123!",
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
        "id": "usr-88912-abc",
        "name": "Ahmad Dani",
        "email": "ahmad@example.com",
        "role": "USER"
      },
      "token": {
        "accessToken": "eyJhbGciOi...",
        "refreshToken": "d8f9a2b...",
        "expiresIn": 86400
      }
    }
  }
  ```

#### 2. Login User
- **Endpoint**: `POST /api/v1/auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "ahmad@example.com",
    "password": "PasswordSangatKuat123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Login berhasil",
    "data": {
      "user": {
        "id": "usr-88912-abc",
        "name": "Ahmad Dani",
        "email": "ahmad@example.com"
      },
      "token": {
        "accessToken": "eyJhbGciOi...",
        "refreshToken": "d8f9a2b...",
        "expiresIn": 86400
      }
    }
  }
  ```

#### 3. Cek Status User Login (`Me`)
- **Endpoint**: `GET /api/v1/auth/me`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "usr-88912-abc",
      "name": "Ahmad Dani",
      "email": "ahmad@example.com",
      "phoneNumber": "081234567890",
      "role": "USER",
      "totalInvitations": 2,
      "createdAt": "2026-10-01T08:00:00Z"
    }
  }
  ```

#### 4. Refresh Token
- **Endpoint**: `POST /api/v1/auth/refresh-token`
- **Request Body**:
  ```json
  {
    "refreshToken": "d8f9a2b..."
  }
  ```
- **Response `200 OK`**: Mengembalikan accessToken baru.

#### 5. Logout
- **Endpoint**: `POST /api/v1/auth/logout`
- **Auth**: `Bearer Token`
- **Response `200 OK`**: Berhasil menghapus session / blacklist refresh token.

---

### B. Manajemen Template & Katalog

#### 1. Daftar Template Siap Pakai
- **Endpoint**: `GET /api/v1/templates`
- **Auth**: Public
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "rustic",
        "name": "Rustic Minimalist",
        "description": "Sentuhan earthy modern bernuansa cokelat hangat dan clean aesthetic.",
        "badge": "Terpopuler",
        "previewImage": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        "features": ["Typography Serif Modern", "Love Story Timeline", "Envelope Popup"]
      },
      {
        "id": "royal-gold",
        "name": "Royal Gold Flat",
        "description": "Desain mewah monokrom dengan aksen emas bergaris flat elegan.",
        "badge": "Premium",
        "previewImage": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        "features": ["Golden Accent", "Countdown Pro", "Interactive Guestbook"]
      },
      {
        "id": "islamic",
        "name": "Modern Islamic",
        "description": "Kaligrafi doa, nuansa emerald green sejuk, dan susunan ayat Al-Qur'an resmi.",
        "badge": "Religius",
        "previewImage": "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80",
        "features": ["Ayat Suci QS. Ar-Rum", "Amplop Digital Syariah", "Protokol Acara"]
      },
      {
        "id": "sakura",
        "name": "Sakura Bloom",
        "description": "Estetika floral lembut warna rose pastel yang romantis dan bersahaja.",
        "badge": "Romantis",
        "previewImage": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
        "features": ["Soft Pastel Bloom", "Music Player Float", "Galeri Carousel"]
      }
    ]
  }
  ```

---

### C. Manajemen Undangan (Invitations CRUD)
Semua endpoint pada modul ini membutuhkan **Bearer Token** dan otomatis terfilter sesuai `userId` pemilik akun.

#### 1. Ambil Semua Undangan Milik User
- **Endpoint**: `GET /api/v1/invitations`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "inv-101",
        "slug": "budi-ani",
        "title": "The Wedding of Budi & Ani",
        "templateId": "rustic",
        "isPublished": true,
        "countdownDate": "2026-11-28T08:00:00Z",
        "totalGuests": 142,
        "totalRsvp": 98,
        "updatedAt": "2026-10-22T04:00:00Z"
      }
    ]
  }
  ```

#### 2. Buat Undangan Baru
- **Endpoint**: `POST /api/v1/invitations`
- **Auth**: `Bearer Token`
- **Request Body**:
  ```json
  {
    "title": "The Wedding of Budi & Ani",
    "slug": "budi-ani",
    "templateId": "rustic",
    "countdownDate": "2026-11-28T08:00:00.000Z"
  }
  ```
- **Response `201 Created`**: Mengembalikan object undangan baru dengan nilai default lengkap.

#### 3. Detail Undangan untuk Editor Studio
- **Endpoint**: `GET /api/v1/invitations/:id`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "inv-101",
      "slug": "budi-ani",
      "title": "The Wedding of Budi & Ani",
      "templateId": "rustic",
      "isPublished": true,
      "groom": {
        "name": "Budi",
        "fullName": "Budi Santoso, S.Kom.",
        "fatherName": "Bpk. H. Bambang Santoso",
        "motherName": "Ibu Hj. Sri Rahayu",
        "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        "instagram": "budisantoso"
      },
      "bride": {
        "name": "Ani",
        "fullName": "dr. Ani Lestari",
        "fatherName": "Bpk. H. Hendra Wijaya",
        "motherName": "Ibu Hj. Siti Aminah",
        "photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        "instagram": "anilestari"
      },
      "quote": {
        "text": "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...",
        "source": "QS. Ar-Rum: 21",
        "translation": "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah."
      },
      "countdownDate": "2026-11-28T08:00:00.000Z",
      "events": [
        {
          "id": "ev-1",
          "title": "Akad Nikah",
          "date": "2026-11-28",
          "startTime": "08:00",
          "endTime": "10:00",
          "timezone": "WIB",
          "locationName": "Masjid Agung Jawa Tengah",
          "address": "Jl. Gajah Raya, Sambirejo, Kec. Gayamsari, Kota Semarang",
          "mapsUrl": "https://maps.google.com"
        }
      ],
      "stories": [
        {
          "id": "story-1",
          "year": "2022",
          "title": "Pertama Berjumpa",
          "description": "Pertemuan pertama kami dalam sebuah project kerja sama di Semarang.",
          "image": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc"
        }
      ],
      "gallery": [
        {
          "id": "gal-1",
          "url": "https://images.unsplash.com/photo-1519741497674-611481863552",
          "caption": "Prewedding at Pine Forest"
        }
      ],
      "music": {
        "title": "A Thousand Years",
        "artist": "Christina Perri",
        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "autoplay": true
      },
      "bankAccounts": [
        {
          "id": "bank-1",
          "bankName": "Bank Central Asia (BCA)",
          "accountNumber": "8021928371",
          "accountHolder": "Budi Santoso",
          "qrisUrl": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BCA-BUDI"
        }
      ],
      "giftAddress": {
        "recipientName": "Budi & Ani",
        "phone": "081298765432",
        "fullAddress": "Jl. Melati Indah No. 45, Semarang"
      }
    }
  }
  ```

#### 4. Update Seluruh / Bagian Undangan (Save Button)
- **Endpoint**: `PUT /api/v1/invitations/:id`
- **Auth**: `Bearer Token`
- **Request Body**: Mirip dengan payload di atas (bisa partial update atau full payload).
- **Response `200 OK`**: `{ "success": true, "message": "Undangan berhasil diperbarui" }`

#### 5. Cek Ketersediaan Slug URL
- **Endpoint**: `GET /api/v1/invitations/check-slug?slug=budi-ani`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "slug": "budi-ani",
      "available": true,
      "previewUrl": "https://infomase.id/invite/budi-ani"
    }
  }
  ```

#### 6. Hapus Undangan
- **Endpoint**: `DELETE /api/v1/invitations/:id`
- **Auth**: `Bearer Token`
- **Response `200 OK`**: `{ "success": true, "message": "Undangan berhasil dihapus" }`

---

### D. Endpoint Publik Undangan (Tamu & RSVP)
Semua endpoint publik ini **tidak memerlukan login token**. Diakses oleh browser tamu undangan.

#### 1. Ambil Data Undangan Publik berdasarkan Slug
- **Endpoint**: `GET /api/v1/public/invitations/:slug`
- **Auth**: Public (Tidak butuh token)
- **Fungsi Backend Tambahan**: Otomatis menambahkan counter `viewCount += 1`.
- **Response `200 OK`**: Mengembalikan payload data undangan tanpa mengekspos ID rahasia pemilik akun.

#### 2. Submit Konfirmasi Kehadiran & Doa Restu (RSVP)
- **Endpoint**: `POST /api/v1/public/invitations/:slug/rsvp`
- **Auth**: Public (Dibatasi rate limit 5 req/menit per IP)
- **Request Body**:
  ```json
  {
    "guestName": "Hendra Wijaya & Keluarga",
    "attendance": "hadir",
    "pax": 2,
    "message": "Selamat menempuh hidup baru Mas Budi & Mbak Ani! Semoga senantiasa sakinah mawaddah warahmah."
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Konfirmasi kehadiran dan ucapan Anda berhasil dikirimkan",
    "data": {
      "id": "rsvp-9021",
      "guestName": "Hendra Wijaya & Keluarga",
      "attendance": "hadir",
      "pax": 2,
      "message": "Selamat menempuh hidup baru...",
      "createdAt": "2026-10-22T10:15:00.000Z"
    }
  }
  ```

#### 3. Ambil Daftar Ucapan / Feed Buku Tamu Publik
- **Endpoint**: `GET /api/v1/public/invitations/:slug/wishes?page=1&limit=20`
- **Auth**: Public
- **Response `200 OK`**: Mengembalikan daftar ucapan dari tamu untuk ditampilkan di dinding ucapan undangan online.

---

### E. Storage & File Upload Bridge (Gambar & Audio)

Backend bertindak sebagai **bridge dan storage manager** (menggunakan AWS S3, Cloudinary, Firebase Storage, Supabase Storage, atau MinIO).

> **Penjelasan Template Upload**:
> Upload file diorganisir per undangan (`/api/v1/invitations/:id/upload/...`). Setiap file yang diunggah otomatis di-optimize (resize, kompresi WebP, strip EXIF metadata).

#### 1. Upload Foto Tunggal (Mempelai, Cover, Foto Story, atau QRIS)
- **Endpoint**: `POST /api/v1/invitations/:id/upload/photo`
- **Auth**: `Bearer Token`
- **Content-Type**: `multipart/form-data`
- **Form Parameters**:
  - `file`: Binary file (MIME type: `image/jpeg`, `image/png`, `image/webp`. Maks: 5 MB)
  - `category`: String (`"groom"` | `"bride"` | `"story"` | `"qris"` | `"cover"`)
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Foto berhasil diunggah",
    "data": {
      "url": "https://storage.infomase.id/inv-101/groom-1729584000.webp",
      "fileKey": "inv-101/groom-1729584000.webp",
      "size": 184500,
      "width": 1080,
      "height": 1350,
      "format": "webp"
    }
  }
  ```

#### 2. Upload Batch Galeri Foto (Multiple Files)
- **Endpoint**: `POST /api/v1/invitations/:id/upload/gallery-batch`
- **Auth**: `Bearer Token`
- **Content-Type**: `multipart/form-data`
- **Form Parameters**:
  - `files`: Array of image files (maksimal 10 foto sekaligus, max 5MB per file)
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "3 foto galeri berhasil diunggah",
    "data": [
      {
        "id": "gal-photo-1",
        "url": "https://storage.infomase.id/inv-101/gallery-1.webp",
        "caption": ""
      },
      {
        "id": "gal-photo-2",
        "url": "https://storage.infomase.id/inv-101/gallery-2.webp",
        "caption": ""
      }
    ]
  }
  ```

#### 3. Upload File Musik Latar (MP3)
- **Endpoint**: `POST /api/v1/invitations/:id/upload/audio`
- **Auth**: `Bearer Token`
- **Content-Type**: `multipart/form-data`
- **Form Parameters**:
  - `file`: Binary file (MIME type: `audio/mpeg`, `audio/mp3`, maks 10 MB)
  - `title`: String opsional
  - `artist`: String opsional
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Audio musik berhasil diunggah",
    "data": {
      "url": "https://storage.infomase.id/inv-101/audio-bgm.mp3",
      "title": "Shane Filan - Beautiful in White",
      "durationSeconds": 220
    }
  }
  ```

#### 4. Hapus File dari Storage
- **Endpoint**: `DELETE /api/v1/invitations/:id/assets`
- **Auth**: `Bearer Token`
- **Request Body**:
  ```json
  {
    "fileKey": "inv-101/groom-1729584000.webp"
  }
  ```
- **Response `200 OK`**: `{ "success": true, "message": "File berhasil dihapus dari storage" }`

---

### F. Manajemen Tamu (Guest Manager & WhatsApp Generator)

Fitur untuk mengelola daftar tamu personal, generate tautan unik dengan nama tamu di cover (`?to=Nama+Tamu`), dan generator pesan WhatsApp siap kirim.

#### 1. Ambil Daftar Tamu
- **Endpoint**: `GET /api/v1/invitations/:id/guests?search=hendra&category=VIP&page=1&limit=50`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "guests": [
        {
          "id": "gst-1",
          "name": "Bpk. H. Hendra Wijaya & Keluarga",
          "category": "VIP",
          "phone": "08123456789",
          "personalLink": "https://infomase.id/invite/budi-ani?to=Bpk.+H.+Hendra+Wijaya+%26+Keluarga",
          "createdAt": "2026-10-22T08:00:00Z"
        }
      ],
      "stats": {
        "total": 142,
        "vip": 24,
        "keluarga": 35,
        "sahabat": 40,
        "temanKantor": 30,
        "umum": 13
      }
    }
  }
  ```

#### 2. Tambah Tamu Baru
- **Endpoint**: `POST /api/v1/invitations/:id/guests`
- **Auth**: `Bearer Token`
- **Request Body**:
  ```json
  {
    "name": "Ibu Ratna & Suami",
    "category": "Sahabat",
    "phone": "081399887766"
  }
  ```
- **Response `201 Created`**: Mengembalikan object tamu baru beserta link personalnya.

#### 3. Import Tamu Sekaligus (Bulk Upload)
- **Endpoint**: `POST /api/v1/invitations/:id/guests/bulk`
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
- **Response `201 Created`**: `{ "success": true, "insertedCount": 3 }`

#### 4. Generator Teks Template WhatsApp
- **Endpoint**: `GET /api/v1/invitations/:id/guests/:guestId/wa-message`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "guestName": "Bpk. H. Hendra Wijaya & Keluarga",
      "phoneNumber": "08123456789",
      "waUrl": "https://api.whatsapp.com/send?phone=628123456789&text=...",
      "message": "Kepada Yth.\n*Bpk. H. Hendra Wijaya & Keluarga*\n\nAssalamu’alaikum Warahmatullahi Wabarakatuh...\n🔗 https://infomase.id/invite/budi-ani?to=Bpk.+H.+Hendra+Wijaya+%26+Keluarga"
    }
  }
  ```

#### 5. Hapus Tamu
- **Endpoint**: `DELETE /api/v1/invitations/:id/guests/:guestId`
- **Auth**: `Bearer Token`
- **Response `200 OK`**: `{ "success": true, "message": "Tamu berhasil dihapus" }`

---

### G. Manajemen RSVP & Buku Tamu (Dashboard Owner)

Dashboard pemilik undangan untuk memantau siapa saja yang hadir, ragu-ragu, atau berhalangan, serta memoderasi pesan ucapan.

#### 1. Ambil Data RSVP & Buku Tamu
- **Endpoint**: `GET /api/v1/invitations/:id/rsvps?attendance=hadir&search=bambang&page=1&limit=50`
- **Auth**: `Bearer Token`
- **Query Params**:
  - `attendance`: `"all"` | `"hadir"` | `"ragu"` | `"tidak"`
  - `search`: String pencarian nama
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "rsvps": [
        {
          "id": "rsvp-101",
          "guestName": "Hendra Wijaya",
          "attendance": "hadir",
          "pax": 2,
          "message": "Selamat menempuh hidup baru!",
          "createdAt": "2026-10-22T09:30:00Z"
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

#### 2. Hapus / Moderasi Ucapan Spam
- **Endpoint**: `DELETE /api/v1/invitations/:id/rsvps/:rsvpId`
- **Auth**: `Bearer Token`
- **Response `200 OK`**: `{ "success": true, "message": "Ucapan berhasil dihapus" }`

#### 3. Export Data RSVP ke Excel/CSV
- **Endpoint**: `GET /api/v1/invitations/:id/rsvps/export?format=xlsx`
- **Auth**: `Bearer Token`
- **Response**: Binary file download (`Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).

---

### H. Statistik & Ringkasan Metrik

- **Endpoint**: `GET /api/v1/invitations/:id/stats`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "pageViews": 1420,
      "uniqueVisitors": 850,
      "deviceBreakdown": {
        "mobile": "92%",
        "desktop": "8%"
      },
      "attendanceRate": "76%",
      "daysLeftToEvent": 37
    }
  }
  ```

---

## 5. Keamanan, CORS, & Rate Limiting

### 5.1 Pengaturan CORS (Cross-Origin Resource Sharing)
Backend wajib mengizinkan origin frontend Next.js:
```javascript
// Express.js / Fastify CORS config
const allowedOrigins = [
  'http://localhost:3000',
  'https://infomase.id',
  'https://www.infomase.id'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 5.2 Rate Limiting
- **Endpoint Publik RSVP** (`/api/v1/public/.../rsvp`): Maksimal **10 requests per menit** per IP.
- **Endpoint Login / Register** (`/api/v1/auth/...`): Maksimal **5 percobaan gagal per 15 menit** per IP (mencegah brute-force).
- Gunakan Redis atau `express-rate-limit`.

### 5.3 Validasi Input & Sanitasi XSS
- Semua ucapan doa dari tamu (`message`) wajib di-sanitize menggunakan pustaka seperti `DOMPurify` atau `sanitize-html` di backend sebelum disimpan ke database untuk mencegah serangan Stored XSS.
- Validasi skema request body menggunakan pustaka seperti **Zod** atau **Joi**.

---

## 6. Panduan Integrasi Frontend Next.js

Saat backend siap, frontend Next.js di repo ini hanya perlu menghubungkan HTTP Client melalui file `src/lib/api.ts`:

```typescript
// Contoh implementasi di frontend Next.js:
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('infomase_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan pada server');
  return data;
}
```

---
*Dokumentasi ini disiapkan secara komprehensif untuk pengembang backend platform InfoMase.*
