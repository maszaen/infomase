# REST API Specification — Undangan Online (InfoMase)

Dokumen ini memuat spesifikasi lengkap kontrak antarmuka pemrograman aplikasi (*REST API Specification*) untuk backend CodeIgniter 4 platform **Undangan Online**. Format API ini selaras dengan kebutuhan frontend Next.js 16 (`src/lib/api.ts`), aman, modular, dan menerapkan isolasi data multi-tenant.

---

## 1. Global Conventions & Standards

### 1.1 Base URL & Versioning
- **Base URL Development**: `http://localhost:8080/api/v1`
- **Base URL Production**: `https://api.infomase.id/api/v1`
- **Frontend Reverse Proxy**: `/api/proxy/...` &rarr; diarahkan ke base URL backend untuk menghindari kendala CORS pada browser.

### 1.2 Global Headers
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access_token>
```
*Catatan: Untuk upload berkas, `Content-Type` adalah `multipart/form-data`.*

### 1.3 Format Standar Response Envelope

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

#### Respon Error (HTTP 400, 401, 403, 404, 409, 422, 500)
```json
{
  "success": false,
  "message": "Validasi input gagal",
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

---

## 2. Authentication & Profile Endpoints

### 2.1 Registrasi Akun
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
        "phoneNumber": "6281234567890",
        "avatar": null,
        "role": "USER",
        "createdAt": "2026-11-06T12:00:00Z"
      },
      "token": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
        "refreshToken": "7f8b9a1c2d3e4f...",
        "expiresIn": 86400
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```
- **Database Operations**: Insert ke tabel `users` dan `user_tokens`.

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
- **Response `200 OK`**: Mengembalikan payload `user` dan `token` yang sama dengan registrasi.
- **Database Operations**: Verifikasi hash kata sandi pada tabel `users`, catat sesi baru di `user_tokens`.

### 2.3 Profil Pengguna Aktif (`Me`)
- **Endpoint**: `GET /auth/me`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "usr_9f8a7b6c5d4e",
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "phoneNumber": "6281234567890",
      "avatar": "https://api.infomase.id/uploads/avatars/user-1.jpg",
      "role": "USER",
      "totalInvitations": 2,
      "createdAt": "2026-11-06T12:00:00Z"
    }
  }
  ```

### 2.4 Refresh Token
- **Endpoint**: `POST /auth/refresh-token`
- **Auth**: Public
- **Request Body**: `{ "refreshToken": "7f8b9a1c2d3e4f..." }`
- **Response `200 OK`**: `{ "success": true, "data": { "accessToken": "eyJhb...", "expiresIn": 86400 } }`

### 2.5 Logout
- **Endpoint**: `POST /auth/logout`
- **Auth**: `Bearer Token`
- **Response `200 OK`**: `{ "success": true, "message": "Berhasil keluar" }`
- **Database Operations**: Hapus row dari `user_tokens` berdasarkan token aktif.

---

## 3. Templates & Catalog Endpoints

### 3.1 Daftar Katalog Template
- **Endpoint**: `GET /templates`
- **Auth**: Public
- **Query Params**: `category` (opsional), `status` (opsional)
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
        "typography": { "heading": "Cormorant Garamond", "body": "Archivo" },
        "ornament": "Botanical bouquet, pampas, monstera, anggrek",
        "previewImage": "/template/undangan_1/img/foto_mempelai_dummy.jpg",
        "demoSlug": "raka-sinta",
        "status": "available",
        "badge": "Gratis untuk dicoba"
      }
    ]
  }
  ```

---

## 4. Invitation Management Endpoints (Owner Console)

### 4.1 Ringkasan Dashboard Akun
- **Endpoint**: `GET /dashboard/summary`
- **Auth**: `Bearer Token`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "totalInvitations": 2,
      "totalLicences": 1,
      "totalGuests": 150,
      "totalConfirmedPax": 85,
      "totalSpent": 49000,
      "activeInvitationId": "inv_1234567890"
    }
  }
  ```

### 4.2 Daftar Undangan Milik Pengguna
- **Endpoint**: `GET /invitations`
- **Auth**: `Bearer Token`
- **Query Params**: `status` (`all`, `draft`, `published`, `archived`), `search`, `page`, `limit`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
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
    "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
  }
  ```

### 4.3 Cek Ketersediaan Slug
- **Endpoint**: `GET /invitations/check-slug?slug=raka-sinta`
- **Auth**: `Bearer Token`
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

### 4.4 Pembuatan Undangan Baru
- **Endpoint**: `POST /invitations`
- **Auth**: `Bearer Token`
- **Request Body**:
  ```json
  {
    "title": "Raka & Sinta",
    "slug": "raka-sinta",
    "templateId": "boho-botanical",
    "groomName": "Raka",
    "brideName": "Sinta",
    "eventDate": "2026-12-12"
  }
  ```
- **Response `201 Created`**: Mengembalikan objek `InvitationData` lengkap.

### 4.5 Ambil Detail Undangan by ID
- **Endpoint**: `GET /invitations/:id`
- **Auth**: `Bearer Token` (Ownership Guard: `user_id` cocok)
- **Response `200 OK`**: Mengembalikan objek `InvitationData` lengkap beserta seluruh anak entitasnya.

### 4.6 Update Pengaturan Umum Undangan
- **Endpoint**: `PUT /invitations/:id/general`
- **Auth**: `Bearer Token` + Ownership Guard
- **Request Body**: `{ "title": "The Wedding of Raka & Sinta", "slug": "raka-sinta" }`

### 4.7 Toggle Status Publikasi (Publish / Unpublish)
- **Endpoint**: `PATCH /invitations/:id/publish`
- **Auth**: `Bearer Token` + Ownership Guard
- **Response `200 OK` (Sukses Publish)**:
  ```json
  {
    "success": true,
    "message": "Undangan berhasil dipublikasikan",
    "data": { "isPublished": true, "publishedAt": "2026-11-06T12:00:00Z" }
  }
  ```
- **Response `403 Forbidden` (Jika Template Berbayar Belum Dibeli)**:
  ```json
  {
    "success": false,
    "message": "Lisensi template diperlukan sebelum menayangkan undangan",
    "error": { "code": "LICENCE_REQUIRED", "templateId": "modern-minimalist" }
  }
  ```

### 4.8 Duplikasi Undangan
- **Endpoint**: `POST /invitations/:id/duplicate`
- **Auth**: `Bearer Token` + Ownership Guard
- **Response `201 Created`**: Mengembalikan objek undangan baru hasil kloning.

### 4.9 Hapus Undangan
- **Endpoint**: `DELETE /invitations/:id`
- **Auth**: `Bearer Token` + Ownership Guard
- **Response `200 OK`**: `{ "success": true, "message": "Undangan berhasil dihapus" }`
- **Database Operations**: Soft delete record di tabel `invitations`.

---

## 5. Invitation Content Section Endpoints

### 5.1 Update Profil Mempelai (Couple)
- **Endpoint**: `PUT /invitations/:id/couple`
- **Auth**: `Bearer Token` + Ownership Guard
- **Request Body**:
  ```json
  {
    "groom": {
      "name": "Raka",
      "fullName": "Raka Pratama, S.Kom.",
      "fatherName": "Bpk. Bambang Sutrisno",
      "motherName": "Ibu Sri Wahyuni",
      "photo": "https://api.infomase.id/uploads/photos/groom-1.jpg",
      "instagram": "rakapratama",
      "bio": "Putra pertama dari dua bersaudara"
    },
    "bride": {
      "name": "Sinta",
      "fullName": "Sinta Maharani, S.Ds.",
      "fatherName": "Bpk. Hendra Gunawan",
      "motherName": "Ibu Dewi Lestari",
      "photo": "https://api.infomase.id/uploads/photos/bride-1.jpg",
      "instagram": "sintamhrn",
      "bio": "Putri bungsu dari tiga bersaudara"
    }
  }
  ```

### 5.2 Update Rangkaian Acara (Events)
- **Endpoint**: `PUT /invitations/:id/events`
- **Auth**: `Bearer Token` + Ownership Guard
- **Request Body**:
  ```json
  {
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
      },
      {
        "id": "evt_2",
        "title": "Resepsi Pernikahan",
        "date": "2026-12-12",
        "startTime": "11:00",
        "endTime": "14:00",
        "timezone": "WIB",
        "locationName": "Graha Saka Ballroom",
        "address": "Jl. Pandanaran No. 100, Semarang",
        "mapsUrl": "https://maps.google.com/..."
      }
    ]
  }
  ```

### 5.3 Update Kutipan (Quote)
- **Endpoint**: `PUT /invitations/:id/quote`
- **Auth**: `Bearer Token` + Ownership Guard
- **Request Body**:
  ```json
  {
    "text": "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...",
    "source": "QS. Ar-Rum: 21",
    "translation": "Semoga menjadi keluarga sakinah mawaddah warahmah"
  }
  ```

### 5.4 Update Linimasa Kisah Cinta (Stories)
- **Endpoint**: `PUT /invitations/:id/stories`
- **Auth**: `Bearer Token` + Ownership Guard
- **Request Body**: Array of stories (`year`, `title`, `description`, `image`).

### 5.5 Update Galeri Foto (Gallery)
- **Endpoint**: `PUT /invitations/:id/gallery`
- **Auth**: `Bearer Token` + Ownership Guard
- **Request Body**: Array of gallery items (`url`, `caption`, `sortOrder`).

### 5.6 Update Rekening Amplop & Alamat Kado
- **Endpoint**: `PUT /invitations/:id/gift-data`
- **Auth**: `Bearer Token` + Ownership Guard
- **Request Body**:
  ```json
  {
    "bankAccounts": [
      {
        "bankName": "BANK BCA",
        "accountNumber": "1234567890",
        "accountHolder": "Raka Pratama",
        "qrisUrl": "https://api.infomase.id/uploads/qris/qris-1.jpg"
      }
    ],
    "giftAddress": {
      "recipientName": "Raka Pratama & Sinta",
      "phone": "081234567890",
      "fullAddress": "Jl. Melati No. 12, Kotabaru, Kota Yogyakarta 55224"
    }
  }
  ```

### 5.7 Update Musik Latar
- **Endpoint**: `PUT /invitations/:id/music`
- **Auth**: `Bearer Token` + Ownership Guard
- **Request Body**: `{ "title": "A Thousand Years", "artist": "Christina Perri", "url": "https://api.infomase.id/uploads/audio/song.mp3", "autoplay": true }`

---

## 6. Storage & File Upload Endpoints

### 6.1 Upload Foto Tunggal
- **Endpoint**: `POST /invitations/:id/upload/photo`
- **Auth**: `Bearer Token` + Ownership Guard
- **Form Data**: `photo` (file, max 5MB), `type` (`groom`, `bride`, `cover`, `ogImage`, `qris`)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
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

### 6.2 Upload Galeri Batch
- **Endpoint**: `POST /invitations/:id/upload/gallery-batch`
- **Auth**: `Bearer Token` + Ownership Guard
- **Form Data**: `photos[]` (multiple files)
- **Response `200 OK`**: Array of uploaded photo objects.

### 6.3 Upload Audio MP3
- **Endpoint**: `POST /invitations/:id/upload/audio`
- **Auth**: `Bearer Token` + Ownership Guard
- **Form Data**: `audio` (file MP3, max 10MB), `title` (opsional), `artist` (opsional)

---

## 7. Guest Management Endpoints

### 7.1 Ambil Daftar Tamu (Pagination, Search, Filter)
- **Endpoint**: `GET /invitations/:id/guests`
- **Auth**: `Bearer Token` + Ownership Guard
- **Query Params**: `search`, `category` (`Keluarga`, `Sahabat`, `Teman Kantor`, `VIP`, `Umum`), `page`, `limit`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "guests": [
        {
          "id": "gst_1",
          "guestCode": "ABC12",
          "name": "Budi Santoso & Keluarga",
          "category": "Keluarga",
          "phone": "6281234567890",
          "maxPax": 2,
          "isCheckedIn": false,
          "customInviteLink": "https://infomase.id/invite/raka-sinta?to=Budi+Santoso+%26+Keluarga"
        }
      ],
      "stats": { "total": 150, "vip": 20, "keluarga": 45, "sahabat": 50, "temanKantor": 25, "umum": 10 }
    },
    "meta": { "page": 1, "limit": 25, "total": 150, "totalPages": 6 }
  }
  ```

### 7.2 Tambah Tamu Satuan
- **Endpoint**: `POST /invitations/:id/guests`
- **Auth**: `Bearer Token` + Ownership Guard
- **Request Body**: `{ "name": "Budi Santoso", "category": "Keluarga", "phoneNumber": "081234567890", "maxPax": 2, "notes": "Meja A1" }`

### 7.3 Tambah Tamu Massal (Bulk Insert)
- **Endpoint**: `POST /invitations/:id/guests/bulk`
- **Auth**: `Bearer Token` + Ownership Guard
- **Request Body**:
  ```json
  {
    "guests": [
      { "name": "Andi Saputra", "category": "Sahabat", "phoneNumber": "0811111111" },
      { "name": "Dimas Nugraha", "category": "Teman Kantor", "phoneNumber": "0822222222" }
    ]
  }
  ```
- **Response `201 Created`**: `{ "success": true, "data": { "insertedCount": 2 } }`

### 7.4 Generate WhatsApp Message Link
- **Endpoint**: `GET /invitations/:id/guests/:guestId/wa-message`
- **Auth**: `Bearer Token` + Ownership Guard
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "guestName": "Budi Santoso",
      "phoneNumber": "6281234567890",
      "message": "Kepada Yth. Budi Santoso...\nBuka undangan di: https://infomase.id/invite/raka-sinta?to=Budi+Santoso",
      "waLink": "https://api.whatsapp.com/send?phone=6281234567890&text=..."
    }
  }
  ```

### 7.5 Check-in Tamu Hari-H
- **Endpoint**: `PATCH /invitations/:id/guests/:guestId/check-in`
- **Auth**: `Bearer Token` + Ownership Guard
- **Response `200 OK`**: `{ "success": true, "data": { "isCheckedIn": true, "checkedInAt": "2026-12-12T09:15:00Z" } }`

---

## 8. RSVP & Guestbook Endpoints

### 8.1 Daftar RSVP Masuk (Owner Console)
- **Endpoint**: `GET /invitations/:id/rsvps`
- **Auth**: `Bearer Token` + Ownership Guard
- **Query Params**: `attendance` (`all`, `hadir`, `tidak`, `ragu`), `search`, `page`, `limit`
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
    }
  }
  ```

### 8.2 Hapus Pesan RSVP / Ucapan Spam
- **Endpoint**: `DELETE /invitations/:id/rsvps/:rsvpId`
- **Auth**: `Bearer Token` + Ownership Guard

### 8.3 Ekspor Berkas CSV RSVP
- **Endpoint**: `GET /invitations/:id/rsvps/export`
- **Auth**: `Bearer Token` (atau via query `?token=...`)
- **Response**: File download stream `Content-Type: text/csv; charset=utf-8` dengan nama berkas `rekap-rsvp-[slug].csv`.

---

## 9. Monetization, Orders & Licences Endpoints

### 9.1 Checkout & Pembelian Lisensi Template
- **Endpoint**: `POST /orders/checkout`
- **Auth**: `Bearer Token`
- **Request Body**:
  ```json
  {
    "templateId": "modern-minimalist",
    "invitationId": "inv_1234567890",
    "paymentMethod": "qris"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Pembelian berhasil dan lisensi permanen aktif",
    "data": {
      "order": {
        "id": "ord_998877",
        "reference": "IM-K8NM-2P9X",
        "templateId": "modern-minimalist",
        "invitationId": "inv_1234567890",
        "amount": 49000,
        "currency": "IDR",
        "status": "paid",
        "paymentMethod": "qris",
        "paidAt": "2026-11-06T12:00:00Z"
      },
      "licence": {
        "id": "lic_112233",
        "templateId": "modern-minimalist",
        "invitationId": "inv_1234567890",
        "kind": "perpetual",
        "issuedAt": "2026-11-06T12:00:00Z"
      }
    }
  }
  ```

### 9.2 Riwayat Pesanan Pengguna
- **Endpoint**: `GET /orders`
- **Auth**: `Bearer Token`
- **Response `200 OK`**: Array of `Order` milik user yang bersangkutan.

### 9.3 Daftar Lisensi Aktif Pengguna
- **Endpoint**: `GET /licences`
- **Auth**: `Bearer Token`
- **Response `200 OK`**: Array of `TemplateLicence`.

---

## 10. Public Invitation Endpoints (Tamu Undangan)

### 10.1 Ambil Data Undangan Publik by Slug
- **Endpoint**: `GET /public/invitations/:slug`
- **Auth**: Public (Rate Limited)
- **Query Params**: `to` (nama tamu untuk sapaan personal)
- **Business Rule**: Hanya merespon data jika `is_published = 1` (jika draf, mengembalikan HTTP 404).
- **Response `200 OK`**: Mengembalikan objek payload publik siap render tanpa mengekspos email akun atau rincian pribadi pemilik.

### 10.2 Kirim Konfirmasi RSVP & Doa Restu
- **Endpoint**: `POST /public/invitations/:slug/rsvp`
- **Auth**: Public (Rate Limited: max 5 submit per IP per 10 menit)
- **Request Body**:
  ```json
  {
    "guestName": "Dimas & Nadia",
    "attendance": "HADIR",
    "totalPax": 2,
    "message": "Selamat berbahagia Raka & Sinta! Semoga sakinah mawaddah warahmah.",
    "guestCode": "ABC12"
  }
  ```
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

### 10.3 Ambil Daftar Ucapan Publik (Buku Tamu)
- **Endpoint**: `GET /public/invitations/:slug/wishes`
- **Auth**: Public (Rate Limited & Cached)
- **Query Params**: `page` (default: 1), `limit` (default: 20)
- **Response `200 OK`**: Array of wishes terurut dari yang paling baru.

