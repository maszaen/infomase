# REST API Specification — Undangan Online (InfoMase)

Dokumen ini memuat spesifikasi teknis lengkap kontrak antarmuka pemrograman aplikasi (*REST API Specification*) untuk platform **Undangan Online (InfoMase)**. Spesifikasi ini dirancang secara independen dan telah diaudit secara menyeluruh agar selaras 100% dengan kebutuhan frontend Next.js 16 (`src/lib/api.ts`, `src/types/invitation.ts`, `src/types/auth.ts`, `src/lib/orders.ts`, komponen konsol Studio Editor, dan template publik), skema basis data relasional pada `docs/DATABASE_DESIGN.md`, serta backend CodeIgniter 4.

---

## 1. Global Conventions & Standards

### 1.1 Base URL & Environment
- **Base URL Development (Direct)**: `http://localhost:8080/api/v1` atau `http://localhost:8000/wedding_digital/api/v1`
- **Base URL Production**: `https://api.infomase.id/api/v1`
- **Frontend Reverse Proxy (Next.js)**: `/api/proxy/...`
  - Seluruh panggilan API dari browser diarahkan melalui Next.js route handler (`/api/proxy/[...path]`) yang meneruskan permintaan ke backend. Hal ini mencegah kendala CORS dan menyederhanakan manajemen domain cookies/headers.
  - Proxy mendukung penuh metode HTTP: `GET`, `POST`, `PUT`, `PATCH`, dan `DELETE`.

### 1.2 Global Headers
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access_token>
ngrok-skip-browser-warning: true
```
> [!NOTE]
> Untuk endpoint unggah berkas (foto galeri, audio, bukti pembayaran), header `Content-Type` tidak boleh disetel secara manual ke `application/json`, melainkan diserahkan kepada klien/browser agar membentuk `multipart/form-data` dengan *boundary* yang valid.

### 1.3 Case Convention & Transformation Matrix
Untuk menjamin konsistensi antara frontend dan backend:
- **API Request & Response Payloads**: Wajib menggunakan **`camelCase`** (contoh: `templateId`, `countdownDate`, `guestName`, `phoneNumber`, `accountNumber`). Hal ini sesuai kontrak tipe TypeScript pada `src/types/invitation.ts`, `src/types/auth.ts`, dan `src/lib/orders.ts`.
- **Database Schema**: Menggunakan **`snake_case`** (contoh: `template_id`, `countdown_date`, `guest_name`, `phone_number`, `account_number`) sesuai `docs/DATABASE_DESIGN.md`.
- **Backend Responsibility**: Lapisan controller / presenter backend bertugas memetakan kolom basis data (`snake_case`) menjadi properti JSON (`camelCase`) pada respons, serta menerima kunci `camelCase` (dengan fallback kompatibilitas alias) pada permintaan mutasi.

### 1.4 Format Standar Response Envelope

#### Respon Sukses (HTTP 200, 201)
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
  "timestamp": "2026-11-06T12:00:00.000Z"
}
```

#### Respon Error (HTTP 400, 401, 403, 404, 409, 422, 429, 500)
```json
{
  "success": false,
  "message": "Validasi input gagal atau hak akses ditolak",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Format email tidak valid atau sudah terdaftar"
      }
    ]
  },
  "timestamp": "2026-11-06T12:00:00.000Z"
}
```

### 1.5 Authentication, Multi-tenant Isolation & Ownership Guard

1. **Public Endpoints (Tanpa Autentikasi)**:
   - Autentikasi: `None`
   - Meliputi katalog template (`/templates`), pendaftaran (`/auth/register`), masuk (`/auth/login`), penyegaran token (`/auth/refresh-token`), dan seluruh endpoint publik tamu undangan (`/public/invitations/:slug`, `/public/invitations/:slug/rsvp`, `/public/invitations/:slug/wishes`).
   - Dilindungi oleh pembatas laju permintaan (*Rate Limiting*): maksimal 30 request/menit untuk penayangan dan 5 submit RSVP per 10 menit per IP.

2. **User-Authenticated Endpoints**:
   - Wajib menyertakan header `Authorization: Bearer <access_token>`.
   - Token JWT diverifikasi menggunakan algoritma HMAC-SHA256. Jika token tidak ditemukan atau tidak valid, server mengembalikan `401 Unauthorized` (`code: "UNAUTHORIZED"` atau `"INVALID_TOKEN"`). Jika masa aktif berakhir, server mengembalikan `401 Unauthorized` (`code: "TOKEN_EXPIRED"`).

3. **Ownership Guard (Isolasi Data Antar-Undangan)**:
   - Setiap operasi yang menargetkan sub-sumber daya undangan (`/invitations/:id/...`, baik tamu, acara, galeri, maupun RSVP) **wajib** memeriksa kepemilikan:
     1. Cari rekaman undangan berdasarkan `:id` (dapat berupa `public_id` UUID maupun ID internal).
     2. Jika undangan tidak ditemukan di sistem: kembalikan `404 Not Found` (`code: "NOT_FOUND"`, message: `"Undangan tidak ditemukan"`).
     3. Jika undangan ditemukan namun `invitation.user_id !== authenticated_user.id`: kembalikan `403 Forbidden` (`code: "FORBIDDEN"`, message: `"Anda tidak memiliki akses ke undangan ini"`).
   - Pengguna dilarang keras dapat memanipulasi atau mengintip tamu dan RSVP milik pengguna lain (*Insecure Direct Object References - IDOR prevention*).

---

## 2. Authentication & Profile Endpoints

### 2.1 Registrasi Akun Baru
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
        "id": "usr_9f8a7b6c5d4e",
        "name": "Budi Santoso",
        "email": "budi@example.com",
        "phoneNumber": "081234567890",
        "avatar": null,
        "role": "USER",
        "totalInvitations": 0,
        "createdAt": "2026-11-06T12:00:00Z"
      },
      "token": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
        "refreshToken": "7f8b9a1c2d3e4f...",
        "expiresIn": 86400
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
    },
    "timestamp": "2026-11-06T12:00:00.000Z"
  }
  ```
- **Error Responses**:
  - `409 Conflict`: `{"code": "EMAIL_ALREADY_EXISTS", "message": "Email sudah terdaftar"}`
  - `422 Unprocessable Entity`: Validasi format gagal (`password` < 6 karakter, format email salah).
- **Database Mapping**: Insert ke tabel `users` dan `user_tokens`.

### 2.2 Login Akun
- **Endpoint**: `POST /auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "budi@example.com",
    "password": "Password123!"
  }
  ```
- **Response `200 OK`**: Struktur respon identik dengan registrasi (mengembalikan `user` dan token sesi).
- **Error Responses**:
  - `401 Unauthorized`: `{"code": "INVALID_CREDENTIALS", "message": "Email atau kata sandi tidak cocok"}`
- **Database Mapping**: Verifikasi kata sandi terhadap `users.password_hash`, catat token sesi di `user_tokens`.

### 2.3 Profil Pengguna Aktif (`Me`)
- **Endpoint**: `GET /auth/me`
- **Auth**: `Bearer <token>`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "usr_9f8a7b6c5d4e",
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "phoneNumber": "081234567890",
      "avatar": "https://api.infomase.id/uploads/avatars/user-1.jpg",
      "role": "USER",
      "totalInvitations": 2,
      "createdAt": "2026-11-06T12:00:00Z"
    },
    "timestamp": "2026-11-06T12:00:00.000Z"
  }
  ```

### 2.4 Refresh Access Token
- **Endpoint**: `POST /auth/refresh-token`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "refreshToken": "7f8b9a1c2d3e4f..."
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Token akses berhasil diperbarui",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
      "expiresIn": 86400
    },
    "timestamp": "2026-11-06T12:00:00.000Z"
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"code": "INVALID_REFRESH_TOKEN", "message": "Refresh token tidak valid atau telah dicabut"}`

### 2.5 Logout Akun
- **Endpoint**: `POST /auth/logout`
- **Auth**: `Bearer <token>`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Berhasil keluar dan sesi diakhiri"
  }
  ```
- **Database Mapping**: Set `user_tokens.is_revoked = 1` atau hapus baris token aktif.

---

## 3. Templates & Catalog Endpoints

### 3.1 Daftar Katalog Template
- **Endpoint**: `GET /templates`
- **Auth**: Public
- **Query Params**:
  - `category` (*opsional*): Filter slug kategori (misal: `botanical`, `minimalist`, `javanese`).
  - `status` (*opsional*): `available` (default) atau `all`.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "boho-botanical",
        "name": "Boho Botanical",
        "tagline": "Aquarel hangat, dedaunan bergoyang, dan gate cover 3D.",
        "category": "Botanical & Rustic",
        "price": 0,
        "compareAtPrice": null,
        "includes": [
          "Gate cover 3D book flip",
          "Animasi daun & bunga (wind sway)",
          "Musik latar autoplay",
          "Galeri, love story, amplop digital, RSVP",
          "1 undangan · aktif tanpa batas"
        ],
        "palette": {
          "primary": "#79624C",
          "accent": "#8C735B",
          "surface": "#FAF7F2",
          "ink": "#382E25"
        },
        "typography": {
          "heading": "Cormorant Garamond",
          "body": "Archivo"
        },
        "ornament": "Botanical bouquet, pampas, monstera, anggrek",
        "previewImage": "/template/undangan_1/img/foto_mempelai_dummy.jpg",
        "demoSlug": "raka-sinta",
        "status": "available",
        "badge": "Gratis untuk dicoba"
      }
    ]
  }
  ```

### 3.2 Detail Template by ID / Code
- **Endpoint**: `GET /templates/:id`
- **Auth**: Public
- **Response `200 OK`**: Mengembalikan metadata template tunggal lengkap.

---

## 4. Invitation Management Endpoints (Owner Console)

### 4.1 Daftar Undangan Milik Pengguna
- **Endpoint**: `GET /invitations`
- **Auth**: `Bearer <token>`
- **Query Params**:
  - `status` (*opsional*): `all`, `draft`, `published`, `archived`
  - `search` (*opsional*): Pencarian berdasarkan judul atau slug
  - `page` (*opsional*): Nomor halaman (default: `1`)
  - `limit` (*opsional*): Batas data per halaman (default: `10`)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Daftar undangan berhasil diambil",
    "data": [
      {
        "id": "inv_1234567890",
        "slug": "raka-sinta",
        "title": "Raka & Sinta",
        "templateId": "boho-botanical",
        "isPublished": true,
        "countdownDate": "2026-12-12T08:00:00",
        "totalGuests": 120,
        "totalRsvp": 45,
        "updatedAt": "2026-11-06T12:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
  ```

### 4.2 Cek Ketersediaan Slug URL
- **Endpoint**: `GET /invitations/check-slug?slug=:slug`
- **Auth**: `Bearer <token>`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "slug": "raka-sinta",
      "available": false,
      "previewUrl": "https://infomase.id/invite/raka-sinta"
    }
  }
  ```

### 4.3 Pembuatan Undangan Baru
- **Endpoint**: `POST /invitations`
- **Auth**: `Bearer <token>`
- **Request Body (Format Lengkap / Wizard)**:
  ```json
  {
    "title": "Raka & Sinta",
    "slug": "raka-sinta",
    "templateId": "boho-botanical",
    "countdownDate": "2026-12-12T08:00:00",
    "groom": {
      "name": "Raka",
      "fullName": "Raka Pratama, S.Kom."
    },
    "bride": {
      "name": "Sinta",
      "fullName": "Sinta Maharani, S.Ds."
    },
    "events": [
      {
        "title": "Akad Nikah",
        "date": "2026-12-12",
        "startTime": "08:00",
        "endTime": "10:00",
        "locationName": "Masjid Raya Baiturrahman",
        "address": "Jl. Teuku Umar No. 1, Semarang"
      }
    ]
  }
  ```
  *(Catatan: Backend juga menerima payload ringkas `{ title, slug, templateId, groomName, brideName, eventDate }` untuk kompatibilitas form cepat).*
- **Response `201 Created`**: Mengembalikan objek `InvitationData` lengkap siap render di Studio Editor.
- **Error Responses**:
  - `409 Conflict`: `{"code": "SLUG_ALREADY_EXISTS", "message": "Slug URL sudah digunakan oleh undangan lain"}`

### 4.4 Ambil Detail Lengkap 1 Undangan
- **Endpoint**: `GET /invitations/:id`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "inv_1234567890",
      "slug": "raka-sinta",
      "title": "Raka & Sinta",
      "templateId": "boho-botanical",
      "isPublished": true,
      "createdAt": "2026-11-06T10:00:00Z",
      "updatedAt": "2026-11-06T12:00:00Z",
      "groom": {
        "name": "Raka",
        "fullName": "Raka Pratama, S.Kom.",
        "fatherName": "Bpk. Bambang Sutrisno",
        "motherName": "Ibu Sri Wahyuni",
        "photo": "https://api.infomase.id/uploads/photos/photo_groom.webp",
        "instagram": "rakapratama",
        "bio": "Putra pertama dari dua bersaudara"
      },
      "bride": {
        "name": "Sinta",
        "fullName": "Sinta Maharani, S.Ds.",
        "fatherName": "Bpk. Hendra Gunawan",
        "motherName": "Ibu Dewi Lestari",
        "photo": "https://api.infomase.id/uploads/photos/photo_bride.webp",
        "instagram": "sintamhrn",
        "bio": "Putri bungsu dari tiga bersaudara"
      },
      "quote": {
        "text": "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu...",
        "source": "QS. Ar-Rum: 21",
        "translation": "Semoga menjadi keluarga sakinah mawaddah warahmah"
      },
      "events": [
        {
          "id": "evt_1",
          "title": "Akad Nikah",
          "date": "2026-12-12",
          "startTime": "08:00",
          "endTime": "10:00",
          "timezone": "WIB",
          "locationName": "Masjid Raya Baiturrahman",
          "address": "Jl. Teuku Umar No. 1, Semarang",
          "mapsUrl": "https://maps.google.com/..."
        }
      ],
      "countdownDate": "2026-12-12T08:00:00",
      "stories": [
        {
          "id": "sty_1",
          "year": "2021",
          "title": "Pertama Berjumpa",
          "description": "Bertemu di bangku perkuliahan...",
          "image": "https://api.infomase.id/uploads/photos/story_1.webp"
        }
      ],
      "gallery": [
        {
          "id": "gal_1",
          "url": "https://api.infomase.id/uploads/photos/prewed_1.webp",
          "caption": "Foto sesi prewedding"
        }
      ],
      "music": {
        "title": "A Thousand Years",
        "artist": "Christina Perri",
        "url": "https://api.infomase.id/uploads/audio/song.mp3",
        "autoplay": true
      },
      "bankAccounts": [
        {
          "id": "bnk_1",
          "bankName": "BANK BCA",
          "accountNumber": "1234567890",
          "accountHolder": "Raka Pratama",
          "qrisUrl": "https://api.infomase.id/uploads/qris/qris.webp"
        }
      ],
      "giftAddress": {
        "recipientName": "Raka Pratama & Sinta",
        "phone": "081234567890",
        "fullAddress": "Jl. Melati No. 12, Kota Semarang 50134"
      },
      "rsvpList": [],
      "guests": []
    }
  }
  ```

### 4.5 Update Holistik / Parsial Undangan (Studio Editor Save)
> [!IMPORTANT]
> Endpoint ini adalah rute utama yang dipanggil oleh konsol frontend (`invitationsApi.update(id, payload)` pada `src/lib/api.ts`). Menerima pembaruan parsial maupun penuh untuk seluruh entitas anak undangan dalam satu transaksi atomik.

- **Endpoint**: `PUT /invitations/:id`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Request Body**: `Partial<InvitationData>` (mengirimkan properti yang dimutasi: `title`, `slug`, `templateId`, `isPublished`, `groom`, `bride`, `events`, `stories`, `gallery`, `bankAccounts`, `giftAddress`, `quote`, `music`, dsb.).
- **Response `200 OK`**: Mengembalikan objek `InvitationData` yang telah terupdate.
- **Database Operations**: Mutasi tabel `invitations` dan tabel anak terkait (`invitation_couples`, `invitation_events`, `invitation_stories`, `invitation_galleries`, `invitation_bank_accounts`) secara transaksional.

### 4.6 Sub-Resource Modular Update Endpoints (Opsional / Granular)
Untuk integrasi klien yang membutuhkan mutasi per-seksi mandiri:
- `PUT /invitations/:id/general`: Mengubah `{ title, slug }`.
- `PUT /invitations/:id/couple`: Mengubah `{ groom: PersonInfo, bride: PersonInfo }`.
- `PUT /invitations/:id/events`: Mengubah `{ events: EventDetail[] }`.
- `PUT /invitations/:id/quote`: Mengubah `{ text, source, translation }`.
- `PUT /invitations/:id/stories`: Mengubah `{ stories: LoveStory[] }`.
- `PUT /invitations/:id/gallery`: Mengubah `{ gallery: GalleryPhoto[] }`.
- `PUT /invitations/:id/gift-data`: Mengubah `{ bankAccounts: BankAccount[], giftAddress }`.
- `PUT /invitations/:id/music`: Mengubah `{ title, artist, url, autoplay }`.

### 4.7 Toggle Status Publikasi (Publish / Unpublish)
- **Endpoint**: `PATCH /invitations/:id/publish` *(atau via `PUT /invitations/:id` dengan payload `{"isPublished": boolean}`)*
- **Auth**: `Bearer <token>` + Ownership Guard
- **Business Rule Entitlement**:
  - Jika `templateId` yang digunakan adalah template berbayar (`price > 0`), sistem **wajib** memeriksa apakah ada rekaman lisensi permanen aktif di tabel `template_licences` untuk pasangan `(invitation_id, template_id)`.
  - Jika belum memiliki lisensi: Tolak perubahan status dan kembalikan HTTP `403 Forbidden`.
- **Response `200 OK` (Sukses Publish)**:
  ```json
  {
    "success": true,
    "message": "Undangan berhasil dipublikasikan dan dapat diakses tamu",
    "data": {
      "isPublished": true,
      "publishedAt": "2026-11-06T12:00:00Z"
    }
  }
  ```
- **Response `403 Forbidden` (Lisensi Belum Dibeli)**:
  ```json
  {
    "success": false,
    "message": "Lisensi desain diperlukan sebelum menayangkan undangan berbayar",
    "error": {
      "code": "LICENCE_REQUIRED",
      "templateId": "royal-javanese"
    }
  }
  ```

### 4.8 Duplikasi Undangan (Clone)
- **Endpoint**: `POST /invitations/:id/duplicate`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Response `201 Created`**: Mengembalikan objek undangan baru hasil kloning dengan slug baru dan status draf (`isPublished: false`).

### 4.9 Statistik & Metrik Performa Undangan
> [!NOTE]
> Dipanggil oleh fungsi `invitationsApi.getStats(id)` pada `src/lib/api.ts` untuk menampilkan metrik halaman konsol dan Meja Resepsionis.

- **Endpoint**: `GET /invitations/:id/stats`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "pageViews": 320,
      "uniqueVisitors": 230,
      "totalGuests": 150,
      "totalHadir": 65,
      "totalTidakHadir": 10,
      "totalBelumKonfirmasi": 75,
      "totalPax": 110,
      "totalUcapan": 72,
      "deviceBreakdown": {
        "mobile": "92%",
        "desktop": "8%"
      },
      "attendanceRate": "73%",
      "daysLeftToEvent": 26
    }
  }
  ```

### 4.10 Hapus Undangan
- **Endpoint**: `DELETE /invitations/:id`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Response `200 OK`**: `{"success": true, "message": "Undangan berhasil dihapus"}`
- **Database Operations**: Soft delete record di tabel `invitations` (`deleted_at = NOW()`).

---

## 5. Storage & File Upload Endpoints

### 5.1 Upload Foto Tunggal
- **Endpoint**: `POST /invitations/:id/upload/photo`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `photo` (atau alias `file`): Berkas biner gambar (JPG, PNG, WebP; maksimal 5MB).
  - `type` (atau alias `category`): Kategori gambar (`groom`, `bride`, `cover`, `ogImage`, `qrCode`, `story`, `qris`).
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Foto berhasil diunggah",
    "data": {
      "url": "https://api.infomase.id/uploads/photos/photo_672b1234.webp",
      "fileName": "photo_672b1234.webp",
      "type": "groom",
      "size": 421050,
      "width": 1200,
      "height": 1600,
      "format": "webp"
    }
  }
  ```

### 5.2 Upload Galeri Foto Batch
- **Endpoint**: `POST /invitations/:id/upload/gallery-batch`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `photos[]` (atau alias `files[]`): Array berkas biner gambar (maksimal 10 berkas sekaligus).
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Galeri berhasil diunggah",
    "data": [
      {
        "id": "gal_1",
        "url": "https://api.infomase.id/uploads/photos/gal_1.webp",
        "caption": ""
      }
    ]
  }
  ```

### 5.3 Upload Musik Latar (Audio MP3)
- **Endpoint**: `POST /invitations/:id/upload/audio`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `audio` (atau alias `file`): Berkas biner audio (MP3, M4A, WAV; maksimal 10MB).
  - `title` (*opsional*): Judul lagu.
  - `artist` (*opsional*): Nama artis/penyanyi.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Musik latar berhasil diunggah",
    "data": {
      "url": "https://api.infomase.id/uploads/audio/wedding_song.mp3",
      "fileName": "wedding_song.mp3",
      "title": "A Thousand Years",
      "durationSeconds": 285
    }
  }
  ```

### 5.4 Hapus Berkas Media dari Server
> [!NOTE]
> Dipanggil oleh fungsi `uploadApi.deleteAsset(invitationId, fileUrl)` pada `src/lib/api.ts` saat menghapus foto atau audio yang tidak lagi terpakai.

- **Endpoint**: `DELETE /invitations/:id/assets`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Request Body**:
  ```json
  {
    "fileUrl": "https://api.infomase.id/uploads/photos/photo_672b1234.webp"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Berkas media berhasil dihapus dari storage server"
  }
  ```

---

## 6. Guest Management Endpoints

### 6.1 Ambil Daftar Tamu (Pagination, Search, Filter)
- **Endpoint**: `GET /invitations/:id/guests`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Query Params**:
  - `search` (*opsional*): Filter nama tamu.
  - `category` (*opsional*): `all`, `Keluarga`, `Sahabat`, `Teman Kantor`, `VIP`, `Umum`.
  - `attendance` (*opsional*): `all`, `hadir`, `tidak`, `ragu`.
  - `page` (*opsional*): Nomor halaman (default: `1`).
  - `limit` (*opsional*): Jumlah data per halaman (default: `25`).
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "guests": [
        {
          "id": "gst_1",
          "name": "Budi Santoso & Keluarga",
          "category": "Keluarga",
          "phone": "081234567890",
          "guestCode": "ABC12",
          "maxPax": 2,
          "notes": "Meja A1",
          "isCheckedIn": false,
          "customInviteLink": "https://infomase.id/invite/raka-sinta?to=Budi+Santoso+%26+Keluarga"
        }
      ],
      "stats": {
        "total": 150,
        "vip": 20,
        "keluarga": 45,
        "sahabat": 50,
        "temanKantor": 25,
        "umum": 10
      }
    },
    "meta": {
      "page": 1,
      "limit": 25,
      "total": 150,
      "totalPages": 6
    }
  }
  ```

### 6.2 Tambah Tamu Satuan
- **Endpoint**: `POST /invitations/:id/guests`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Request Body**:
  ```json
  {
    "name": "Dr. H. Ahmad Fauzi",
    "category": "VIP",
    "phoneNumber": "081298765432",
    "maxPax": 2,
    "notes": "Meja Utama"
  }
  ```
  *(Catatan: Properti telepon menerima `phoneNumber` maupun `phone`).*
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Tamu baru berhasil ditambahkan",
    "data": {
      "id": "gst_99",
      "name": "Dr. H. Ahmad Fauzi",
      "category": "VIP",
      "phone": "081298765432",
      "guestCode": "V8X1K",
      "maxPax": 2,
      "notes": "Meja Utama",
      "isCheckedIn": false,
      "customInviteLink": "https://infomase.id/invite/raka-sinta?to=Dr.+H.+Ahmad+Fauzi"
    }
  }
  ```

### 6.3 Tambah Tamu Massal (Bulk Insert)
- **Endpoint**: `POST /invitations/:id/guests/bulk`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Request Body**:
  ```json
  {
    "guests": [
      { "name": "Andi Saputra", "category": "Sahabat", "phoneNumber": "0811111111" },
      { "name": "Dimas Nugraha", "category": "Teman Kantor", "phoneNumber": "0822222222" }
    ]
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Tamu massal berhasil ditambahkan",
    "data": {
      "insertedCount": 2
    }
  }
  ```

### 6.4 Impor Daftar Tamu dari CSV
- **Endpoint**: `POST /invitations/:id/guests/import`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Content-Type**: `multipart/form-data`
- **Form Data**: `file` (berkas CSV dengan kolom: Nama, Kategori, No HP, Max Pax, Catatan).
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Berkas CSV berhasil diproses",
    "data": {
      "importedCount": 45,
      "skippedCount": 2
    }
  }
  ```

### 6.5 Generate Pesan WhatsApp & Link Chat
- **Endpoint**: `GET /invitations/:id/guests/:guest_id/wa-message`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "guestName": "Dr. H. Ahmad Fauzi",
      "phoneNumber": "6281298765432",
      "message": "Kepada Yth. Bapak Dr. H. Ahmad Fauzi...\nBuka undangan resmi di: https://infomase.id/invite/raka-sinta?to=Dr.+H.+Ahmad+Fauzi",
      "waLink": "https://api.whatsapp.com/send?phone=6281298765432&text=...",
      "waUrl": "https://api.whatsapp.com/send?phone=6281298765432&text=..."
    }
  }
  ```

### 6.6 Hapus Tamu Satuan
- **Endpoint**: `DELETE /invitations/:id/guests/:guest_id`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Response `200 OK`**: `{"success": true, "message": "Data tamu berhasil dihapus"}`

### 6.7 Hapus Tamu Massal (Bulk Delete)
- **Endpoint**: `POST /invitations/:id/guests/bulk-delete`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Request Body**:
  ```json
  {
    "guestIds": ["gst_1", "gst_2", "gst_3"]
  }
  ```
- **Response `200 OK`**: `{"success": true, "data": {"deletedCount": 3}}`

### 6.8 Check-in Tamu Hari-H (Meja Resepsionis)
- **Endpoint**: `PATCH /invitations/:id/guests/:guest_id/check-in`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Request Body**: `{"isCheckedIn": true}` *(atau kosong untuk toggle)*
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "gst_1",
      "isCheckedIn": true,
      "checkedInAt": "2026-12-12T09:15:00Z"
    }
  }
  ```

---

## 7. RSVP & Guestbook Management Endpoints

### 7.1 Daftar RSVP Masuk (Owner Console)
- **Endpoint**: `GET /invitations/:id/rsvps`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Query Params**:
  - `attendance` (atau `status`): `all`, `hadir`, `tidak`, `ragu`.
  - `search`: Filter nama pengirim ucapan.
  - `page`: Nomor halaman (default: `1`).
  - `limit`: Batas per halaman (default: `20`).
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "rsvps": [
        {
          "id": "rsvp_1",
          "guestName": "Andi Saputra",
          "attendance": "hadir",
          "pax": 2,
          "message": "Selamat menempuh hidup baru sahabatku!",
          "createdAt": "2026-11-06T10:30:00Z"
        }
      ],
      "summary": {
        "totalPastiHadir": 45,
        "totalEstimasiPax": 78,
        "totalRagu": 12,
        "totalBerhalangan": 5,
        "totalUcapan": 62
      }
    },
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 62,
      "totalPages": 4
    }
  }
  ```

### 7.2 Hapus / Moderasi Pesan RSVP Spam
- **Endpoint**: `DELETE /invitations/:id/rsvps/:rsvp_id`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Response `200 OK`**: `{"success": true, "message": "Pesan ucapan berhasil dihapus"}`

### 7.3 Ekspor Rekap RSVP ke Berkas CSV
- **Endpoint**: `GET /invitations/:id/rsvps/export`
- **Auth**: `Bearer <token>` (atau parameter query `?token=<access_token>`)
- **Response**: Stream berkas berformat `text/csv; charset=utf-8` dengan header `Content-Disposition: attachment; filename="rekap-rsvp-[slug].csv"`.
- **Kolom CSV**: `Nama Tamu; Status Kehadiran; Pax; Pesan / Ucapan; Tanggal Konfirmasi`.

### 7.4 Ringkasan Statistik RSVP & Kalkulator Katering
- **Endpoint**: `GET /invitations/:id/rsvps/stats`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "confirmedPax": 78,
      "hadirCount": 45,
      "raguCount": 12,
      "tidakHadirCount": 5,
      "totalResponses": 62,
      "recommendedCateringPortions": 90,
      "bufferPercentage": 15
    }
  }
  ```

---

## 8. Monetization, Orders & Perpetual Licences Endpoints

> [!IMPORTANT]
> Sesuai perancangan arsitektur `docs/DATABASE_DESIGN.md` dan modul domain `src/lib/orders.ts`:
> - InfoMase **TIDAK MENGGUNAKAN** model langganan bulanan (*subscription* / *expiry date*).
> - Monetisasi berbasis **Perpetual Licence (Lisensi Permanen)**: satu pembayaran untuk satu template pada satu undangan, berlaku selamanya tanpa kedaluwarsa.

### 8.1 Checkout & Pembelian Lisensi Template
- **Endpoint**: `POST /orders/checkout` *(alias: `POST /orders`)*
- **Auth**: `Bearer <token>`
- **Request Body**:
  ```json
  {
    "templateId": "royal-javanese",
    "invitationId": "inv_1234567890",
    "paymentMethod": "qris"
  }
  ```
  *(Opsi `paymentMethod`: `qris`, `bank-transfer`, `ewallet`).*
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Pembelian berhasil dan lisensi permanen aktif",
    "data": {
      "order": {
        "id": "ord_998877",
        "reference": "IM-K8NM-2P9X",
        "templateId": "royal-javanese",
        "invitationId": "inv_1234567890",
        "invitationTitle": "The Wedding of Raka & Sinta",
        "amount": 49000,
        "currency": "IDR",
        "status": "paid",
        "method": "qris",
        "createdAt": "2026-11-06T12:00:00Z",
        "paidAt": "2026-11-06T12:00:00Z"
      },
      "licence": {
        "id": "lic_112233",
        "templateId": "royal-javanese",
        "invitationId": "inv_1234567890",
        "orderId": "ord_998877",
        "kind": "perpetual",
        "issuedAt": "2026-11-06T12:00:00Z"
      }
    }
  }
  ```

### 8.2 Riwayat Pesanan Pengguna
- **Endpoint**: `GET /orders`
- **Auth**: `Bearer <token>`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "ord_998877",
        "reference": "IM-K8NM-2P9X",
        "templateId": "royal-javanese",
        "invitationId": "inv_1234567890",
        "invitationTitle": "The Wedding of Raka & Sinta",
        "amount": 49000,
        "currency": "IDR",
        "status": "paid",
        "method": "qris",
        "createdAt": "2026-11-06T12:00:00Z",
        "paidAt": "2026-11-06T12:00:00Z"
      }
    ]
  }
  ```

### 8.3 Ambil Detail 1 Pesanan
- **Endpoint**: `GET /orders/:id`
- **Auth**: `Bearer <token>` + Ownership Guard
- **Response `200 OK`**: Mengembalikan objek `Order` lengkap beserta detail lisensi yang terkait.

### 8.4 Unggah Bukti Pembayaran Manual (Transfer Bank)
- **Endpoint**: `POST /orders/:id/proof` *(alias: `POST /orders/:id/payment`)*
- **Auth**: `Bearer <token>` + Ownership Guard
- **Content-Type**: `multipart/form-data`
- **Form Data**: `proof` (berkas gambar struk transfer, JPG/PNG/WebP, max 5MB).
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Bukti pembayaran berhasil diunggah dan sedang diverifikasi",
    "data": {
      "orderId": "ord_998877",
      "paymentProofUrl": "https://api.infomase.id/uploads/proofs/proof_ord_998877.jpg",
      "status": "pending"
    }
  }
  ```

### 8.5 Webhook Pembayaran Otomatis (Payment Gateway)
- **Endpoint**: `POST /payments/webhook`
- **Auth**: Signature Header (`X-Callback-Signature`)
- **Request Body**: Payload webhook gateway (Midtrans / Xendit / QRIS simulator).
- **Business Rule**: Jika status pembayaran `settlement` / `paid`, ubah `orders.status = 'paid'`, set `orders.paid_at = NOW()`, dan otomatis terbitkan baris baru di `template_licences`.

### 8.6 Daftar Lisensi Aktif Pengguna
- **Endpoint**: `GET /licences`
- **Auth**: `Bearer <token>`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "lic_112233",
        "templateId": "royal-javanese",
        "invitationId": "inv_1234567890",
        "orderId": "ord_998877",
        "kind": "perpetual",
        "issuedAt": "2026-11-06T12:00:00Z"
      }
    ]
  }
  ```

---

## 9. Public Invitation Endpoints (Tamu Undangan)

### 9.1 Ambil Detail Web Undangan Publik by Slug
- **Endpoint**: `GET /public/invitations/:slug`
- **Auth**: Public (Rate Limited)
- **Query Params**:
  - `to` (*opsional*): Nama atau kode tamu undangan untuk personalisasi salam pembuka cover (misal: `?to=Budi+Santoso`).
- **Business Rule Publik**:
  - Hanya merespon jika `invitations.is_published = 1` (status = `published`).
  - Jika undangan masih berstatus draf (`is_published = 0`), server **wajib** mengembalikan HTTP `404 Not Found` (`code: "INVITATION_NOT_PUBLISHED"`, message: `"Undangan belum dipublikasikan"`).
  - Data yang dikembalikan disanitasi: **tidak mengekspos** email user pemilik, nomor telepon privat, atau ID internal yang sensitif.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "inv_1234567890",
      "slug": "raka-sinta",
      "title": "The Wedding of Raka & Sinta",
      "templateId": "boho-botanical",
      "groom": {
        "name": "Raka",
        "fullName": "Raka Pratama, S.Kom.",
        "fatherName": "Bpk. Bambang Sutrisno",
        "motherName": "Ibu Sri Wahyuni",
        "photo": "https://api.infomase.id/uploads/photos/photo_groom.webp",
        "instagram": "rakapratama"
      },
      "bride": {
        "name": "Sinta",
        "fullName": "Sinta Maharani, S.Ds.",
        "fatherName": "Bpk. Hendra Gunawan",
        "motherName": "Ibu Dewi Lestari",
        "photo": "https://api.infomase.id/uploads/photos/photo_bride.webp",
        "instagram": "sintamhrn"
      },
      "quote": {
        "text": "Dan di antara tanda-tanda (kebesaran)-Nya...",
        "source": "QS. Ar-Rum: 21"
      },
      "events": [
        {
          "id": "evt_1",
          "title": "Akad Nikah",
          "date": "2026-12-12",
          "startTime": "08:00",
          "endTime": "10:00",
          "timezone": "WIB",
          "locationName": "Masjid Raya Baiturrahman",
          "address": "Jl. Teuku Umar No. 1, Semarang",
          "mapsUrl": "https://maps.google.com/..."
        }
      ],
      "countdownDate": "2026-12-12T08:00:00",
      "stories": [ ... ],
      "gallery": [ ... ],
      "music": {
        "title": "A Thousand Years",
        "artist": "Christina Perri",
        "url": "https://api.infomase.id/uploads/audio/song.mp3",
        "autoplay": true
      },
      "bankAccounts": [ ... ],
      "giftAddress": { ... },
      "personalizedGuest": {
        "name": "Budi Santoso",
        "category": "Keluarga"
      }
    }
  }
  ```

### 9.2 Kirim Konfirmasi RSVP & Doa Restu
- **Endpoint**: `POST /public/invitations/:slug/rsvp`
- **Auth**: Public (Rate Limited: Maksimal 5 submit per IP per 10 menit)
- **Request Body**:
  ```json
  {
    "guestName": "Dimas & Nadia",
    "attendance": "HADIR",
    "totalPax": 2,
    "pax": 2,
    "message": "Selamat berbahagia Raka & Sinta! Semoga menjadi keluarga yang sakinah, mawaddah, dan warahmah.",
    "guestCode": "ABC12"
  }
  ```
  *(Catatan: Nilai `attendance` dinormalisasi secara otomatis: `'HADIR'` &rarr; `hadir`, `'TIDAK_HADIR'`/`'TIDAK'` &rarr; `tidak`, `'RAGU'` &rarr; `ragu`).*
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Terima kasih, konfirmasi kehadiran dan doa restu Anda telah tersimpan",
    "data": {
      "id": "rsvp_8877",
      "guestName": "Dimas & Nadia",
      "attendance": "hadir",
      "pax": 2,
      "message": "Selamat berbahagia Raka & Sinta!...",
      "createdAt": "2026-11-06T12:30:00Z"
    }
  }
  ```
- **Database Operations**: Insert ke tabel `invitation_rsvps`. Jika `guestCode` cocok dengan rekaman di `invitation_guests`, tautkan foreign key `guest_id`.

### 9.3 Ambil Daftar Ucapan Doa Restu Publik (Buku Tamu)
- **Endpoint**: `GET /public/invitations/:slug/wishes`
- **Auth**: Public (Rate Limited & Cached)
- **Query Params**:
  - `page` (*opsional*): Halaman (default: `1`).
  - `limit` (*opsional*): Jumlah item (default: `20`, maksimal: `50`).
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "rsvp_8877",
        "guestName": "Dimas & Nadia",
        "attendance": "hadir",
        "pax": 2,
        "message": "Selamat berbahagia Raka & Sinta!",
        "createdAt": "2026-11-06T12:30:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 62,
      "totalPages": 4
    }
  }
  ```

---

## 10. Database Mapping & Relational Integrity Matrix

Tabel berikut memetakan setiap sumber daya API dan entitas JSON secara langsung ke struktur tabel MySQL pada `docs/DATABASE_DESIGN.md`:

| Resource API | Endpoint Utama | Properti JSON API (camelCase) | Tabel Basis Data MySQL | Kolom Basis Data (snake_case) |
|---|---|---|---|---|
| **Users** | `/auth/register`, `/auth/login`, `/auth/me` | `id`, `name`, `email`, `phoneNumber`, `avatar`, `role` | `users` | `public_id`, `name`, `email`, `phone_number`, `avatar_url`, `role` |
| **Tokens** | `/auth/register`, `/auth/login`, `/auth/refresh-token` | `accessToken`, `refreshToken`, `expiresIn` | `user_tokens` | `refresh_token_hash`, `expires_at`, `is_revoked` |
| **Templates** | `/templates`, `/templates/:id` | `id`, `name`, `tagline`, `price`, `palette`, `typography` | `templates` | `code`, `name`, `tagline`, `price`, `palette_json`, `typography_json` |
| **Invitations** | `/invitations`, `/invitations/:id`, `/public/invitations/:slug` | `id`, `slug`, `title`, `templateId`, `isPublished`, `countdownDate` | `invitations` | `public_id`, `slug`, `title`, `template_id`, `is_published`, `countdown_date` |
| **Couple** | Bagian dari `/invitations/:id` & `/couple` | `groom.name`, `groom.photo`, `bride.name`, `bride.photo` | `invitation_couples` | `groom_name`, `groom_photo_url`, `bride_name`, `bride_photo_url` |
| **Events** | Bagian dari `/invitations/:id` & `/events` | `events[].id`, `title`, `date`, `startTime`, `locationName` | `invitation_events` | `public_id`, `title`, `event_date`, `start_time`, `location_name` |
| **Quotes** | Bagian dari `/invitations/:id` & `/quote` | `quote.text`, `quote.source`, `quote.translation` | `invitation_quotes` | `quote_text`, `quote_source`, `quote_translation` |
| **Stories** | Bagian dari `/invitations/:id` & `/stories` | `stories[].id`, `year`, `title`, `description`, `image` | `invitation_stories` | `public_id`, `year_label`, `title`, `description`, `image_url` |
| **Galleries** | Bagian dari `/invitations/:id` & `/gallery` | `gallery[].id`, `url`, `caption` | `invitation_galleries` | `public_id`, `photo_url`, `caption`, `sort_order` |
| **Music** | Bagian dari `/invitations/:id` & `/music` | `music.title`, `music.artist`, `music.url`, `music.autoplay` | `invitation_musics` | `title`, `artist`, `audio_url`, `autoplay` |
| **Bank Accounts** | Bagian dari `/invitations/:id` & `/gift-data` | `bankAccounts[].bankName`, `accountNumber`, `qrisUrl` | `invitation_bank_accounts` | `bank_name`, `account_number`, `account_holder`, `qris_image_url` |
| **Gifts** | Bagian dari `/invitations/:id` & `/gift-data` | `giftAddress.recipientName`, `phone`, `fullAddress` | `invitation_gifts` | `recipient_name`, `phone_number`, `full_address` |
| **Guests** | `/invitations/:id/guests`, `/guests/bulk` | `id`, `name`, `category`, `phone`, `guestCode`, `maxPax` | `invitation_guests` | `public_id`, `name`, `category`, `phone_number`, `guest_code`, `max_pax` |
| **RSVPs** | `/invitations/:id/rsvps`, `/public/.../rsvp` | `id`, `guestName`, `attendance`, `pax`, `message` | `invitation_rsvps` | `public_id`, `guest_name`, `attendance`, `pax`, `message` |
| **WA Templates** | Bagian dari `/invitations/:id` | `waTemplates[].name`, `body`, `assignedCategories` | `invitation_wa_templates` | `name`, `body`, `assigned_categories_json`, `is_default` |
| **Orders** | `/orders/checkout`, `/orders`, `/orders/:id` | `id`, `reference`, `amount`, `status`, `method` | `orders` | `public_id`, `reference`, `amount`, `status`, `payment_method` |
| **Licences** | `/licences`, `/orders/checkout` | `id`, `templateId`, `invitationId`, `kind`, `issuedAt` | `template_licences` | `public_id`, `template_id`, `invitation_id`, `kind`, `issued_at` |
| **Visitor Logs** | `/invitations/:id/stats` | `pageViews`, `uniqueVisitors`, `deviceBreakdown` | `invitation_visitor_logs` | `invitation_id`, `ip_address`, `device_type`, `visited_at` |

---

## 11. Error Response Matrix & Status Codes

| HTTP Code | Error Code | Skenario Pemicu | Format Respon Khas |
|---|---|---|---|
| **400 Bad Request** | `BAD_REQUEST` | Sintaksis JSON rusak atau parameter rute wajib tidak dikirimkan. | `{"code": "BAD_REQUEST", "message": "ID undangan wajib disertakan"}` |
| **401 Unauthorized** | `UNAUTHORIZED` | Header `Authorization` tidak ada atau format bukan `Bearer <token>`. | `{"code": "UNAUTHORIZED", "message": "Sesi tidak ditemukan, silakan login"}` |
| **401 Unauthorized** | `TOKEN_EXPIRED` | Token JWT telah melewati masa berlaku (`exp`). | `{"code": "TOKEN_EXPIRED", "message": "Sesi telah berakhir, silakan login kembali"}` |
| **403 Forbidden** | `FORBIDDEN` | Pengguna mencoba membaca/mengubah undangan milik akun pengguna lain. | `{"code": "FORBIDDEN", "message": "Anda tidak memiliki akses ke undangan ini"}` |
| **403 Forbidden** | `LICENCE_REQUIRED` | Pengguna mencoba menayangkan draf dengan template berbayar tanpa lisensi. | `{"code": "LICENCE_REQUIRED", "message": "Lisensi diperlukan sebelum tayang"}` |
| **404 Not Found** | `NOT_FOUND` | Undangan, tamu, RSVP, atau berkas tidak ditemukan di sistem. | `{"code": "NOT_FOUND", "message": "Data yang dicari tidak ditemukan"}` |
| **409 Conflict** | `CONFLICT` | Duplikasi data unik (slug URL undangan sudah digunakan atau email kembar). | `{"code": "CONFLICT", "message": "Slug URL sudah digunakan oleh pengguna lain"}` |
| **422 Unprocessable**| `VALIDATION_ERROR` | Validasi input formulir gagal (nama kosong, format email salah, dsb). | `{"code": "VALIDATION_ERROR", "details": [{"field": "name", "message": "Nama wajib diisi"}]}` |
| **429 Too Many Req** | `RATE_LIMIT_EXCEEDED`| Melampaui kuota submit RSVP atau spamming endpoint publik. | `{"code": "RATE_LIMIT_EXCEEDED", "message": "Terlalu banyak permintaan, coba lagi nanti"}` |
| **500 Internal Error**| `INTERNAL_SERVER_ERROR`| Kesalahan server internal atau kegagalan koneksi basis data. | `{"code": "INTERNAL_SERVER_ERROR", "message": "Terjadi kesalahan pada sistem backend"}` |
