# Database Architecture & Relational Schema Design — Undangan Online (InfoMase)

Dokumen ini memuat spesifikasi perancangan database relasional lengkap untuk backend CodeIgniter 4 platform **Undangan Online**. Desain ini dibangun dengan paradigma **User-Centric Architecture** dan **Invitation-Scoped Child Resource Isolation** yang memenuhi kaidah normalisasi **Third Normal Form (3NF)** serta performa tinggi untuk lalu lintas publik (*read-heavy*).

---

## 1. Database Architecture Paradigm & Engine Evaluation

### 1.1 Evaluasi & Pemilihan Database Engine
- **Engine Terpilih**: **MySQL 8.0+ / MariaDB 10.5+** dengan storage engine **InnoDB**.
- **Justifikasi Teknis**:
  1. **Dukungan Penuh CodeIgniter 4**: Driver database default `MySQLi` pada CodeIgniter 4 memiliki performa dan kompatibilitas paling matang pada ekosistem hosting PHP/Linux di Indonesia.
  2. **Transaksi ACID**: InnoDB menjamin integritas transaksi atomik saat memproses checkout pesanan lisensi, pembuatan undangan beserta anak entitasnya, serta mutasi status kehadiran tamu.
  3. **Foreign Key Constraints & Cascading**: InnoDB mendukung penuh `ON DELETE CASCADE` dan `ON DELETE RESTRICT` untuk mengamankan integritas referensial.
  4. **Karakter Set UTF8MB4**: Menggunakan collation `utf8mb4_unicode_ci` yang mendukung penyimpanan simbol kaligrafi, karakter multibyte, dan emoji (seperti ucapan doa restu tamu yang sarat emoji hati dan bunga).
  5. **B-Tree & Composite Indexing**: Mendukung composite index yang sangat cepat untuk filtering multi-kolom `(user_id, status)` dan `(invitation_id, created_at)`.

### 1.2 Strategi Primary Key & Public Identifier
- **Internal Primary Key**: Menggunakan **`BIGINT UNSIGNED AUTO_INCREMENT`** untuk primary key fisik setiap tabel database. Hal ini memaksimalkan kecepatan traversal indeks B-Tree, efisiensi memori buffer pool InnoDB, dan kecepatan operasi `JOIN`.
- **Public External Identifier (UUID / ULID / Slug)**: Kolom string publik unik bertipe `VARCHAR(64)` (seperti `inv_...`, `usr_...`, `ord_...`, `gst_...`) diekspos ke REST API dan frontend.
  - **Manfaat**: Mencegah serangan enumerasi ID (*ID enumeration / Insecure Direct Object References - IDOR*), menyembunyikan volume transaksi riil dari publik, dan mempermudah sinkronisasi ID di sisi klien.

---

## 2. Normalization Strategy & Entity Classification

### 2.1 Analisis Normalisasi (1NF, 2NF, 3NF)
1. **First Normal Form (1NF)**: Setiap atribut bernilai atomik. Tidak ada pengelompokan array atau daftar bersarang di dalam satu kolom teks (misal: acara, galeri foto, rekening bank, tamu, dan RSVP dipecah menjadi tabel-tabel tersendiri).
2. **Second Normal Form (2NF)**: Seluruh atribut non-kunci bergantung penuh pada primary key masing-masing entitas, tanpa adanya ketergantungan parsial pada kunci gabungan.
3. **Third Normal Form (3NF)**: Tidak ada ketergantungan transitif (*transitive dependency*). Data turunan (seperti total pax hadir atau persentase kehadiran) tidak disimpan sebagai kolom statis yang rentan desinkronisasi, melainkan dikomputasi saat query agregasi dijalankan.

### 2.2 Klasifikasi Entitas & Matriks Kepemilikan Data

| Klasifikasi | Daftar Tabel | Penjelasan Kepemilikan |
|---|---|---|
| **System-Owned / Master** | `templates`, `template_categories`, `system_settings` | Dikelola oleh pengembang / administrator sistem; bersifat global dan dibaca secara *read-only* oleh pengguna umum. |
| **User-Owned** | `users`, `user_tokens`, `orders` | Melekat langsung pada entitas pengguna (*user account level*). Satu user dapat memiliki banyak order dan banyak undangan. |
| **Invitation-Owned** | `invitations`, `invitation_couples`, `invitation_quotes`, `invitation_events`, `invitation_stories`, `invitation_galleries`, `invitation_musics`, `invitation_bank_accounts`, `invitation_gifts`, `invitation_guests`, `invitation_rsvps`, `invitation_wa_templates`, `template_licences` | Melekat langsung pada entitas undangan tertentu. Data antar-undangan terisolasi secara mutlak bahkan di dalam satu akun yang sama. |
| **Reference / Audit Logs** | `invitation_visitor_logs`, `rsvp_wish_likes` | Data log operasional dan interaksi publik untuk audit analitik dan metrik. |

---

## 3. Comprehensive Database Schema Specification

### 3.1 Master Data Tables

#### Tabel: `template_categories`
Kategori desain template undangan.
```sql
CREATE TABLE `template_categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `templates`
Katalog master desain tema undangan digital.
```sql
CREATE TABLE `templates` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'URL-safe code: boho-botanical, modern-minimalist, dll',
  `folder_id` VARCHAR(50) NOT NULL COMMENT 'Folder fisik aset: undangan_1 .. undangan_8',
  `name` VARCHAR(100) NOT NULL,
  `tagline` VARCHAR(255) NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '0.00 = Gratis selamanya',
  `compare_at_price` DECIMAL(12,2) NULL COMMENT 'Harga coret promosi',
  `includes_json` JSON NOT NULL COMMENT 'Daftar fitur/keunggulan paket template',
  `palette_json` JSON NOT NULL COMMENT 'Warna primary, accent, surface, ink',
  `typography_json` JSON NOT NULL COMMENT 'Font heading dan body',
  `ornament_description` VARCHAR(255) NULL,
  `preview_image` VARCHAR(255) NOT NULL,
  `demo_slug` VARCHAR(100) NULL,
  `status` ENUM('available', 'coming_soon', 'deprecated') NOT NULL DEFAULT 'available',
  `badge` VARCHAR(50) NULL COMMENT 'Populer, Spesial Islami, dll',
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  CONSTRAINT `fk_templates_category` FOREIGN KEY (`category_id`) REFERENCES `template_categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.2 User & Authentication Tables

#### Tabel: `users`
Akun pengguna terdaftar pemilik undangan.
```sql
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE COMMENT 'UUID v4 untuk identifikasi publik API',
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(30) NULL,
  `avatar_url` VARCHAR(255) NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `status` ENUM('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION') NOT NULL DEFAULT 'ACTIVE',
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `user_tokens`
Manajemen token sesi dan rotasi refresh token.
```sql
CREATE TABLE `user_tokens` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `refresh_token_hash` VARCHAR(64) NOT NULL UNIQUE,
  `device_info` VARCHAR(255) NULL,
  `ip_address` VARCHAR(45) NULL,
  `expires_at` DATETIME NOT NULL,
  `is_revoked` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_tokens_user_revoked` (`user_id`, `is_revoked`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.3 Core Invitation Tables

#### Tabel: `invitations`
Induk entitas undangan digital (satu user dapat memiliki banyak undangan).
```sql
CREATE TABLE `invitations` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE COMMENT 'UUID v4',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'Pemilik undangan',
  `slug` VARCHAR(80) NOT NULL UNIQUE COMMENT 'URL unik: contoh raka-sinta',
  `title` VARCHAR(150) NOT NULL COMMENT 'Label judul: Raka & Sinta',
  `template_id` INT UNSIGNED NOT NULL COMMENT 'Template desain aktif',
  `is_published` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0: Draf, 1: Tayang Publik',
  `published_at` DATETIME NULL,
  `countdown_date` DATETIME NOT NULL COMMENT 'Acuan hitung mundur hari-H',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  CONSTRAINT `fk_invitations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_invitations_template` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`) ON DELETE RESTRICT,
  INDEX `idx_invitations_user_published` (`user_id`, `is_published`),
  INDEX `idx_invitations_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `invitation_couples`
Profil kedua mempelai (Pria & Wanita) untuk satu undangan.
```sql
CREATE TABLE `invitation_couples` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invitation_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  -- Mempelai Pria
  `groom_name` VARCHAR(50) NOT NULL,
  `groom_full_name` VARCHAR(100) NOT NULL,
  `groom_father_name` VARCHAR(100) NOT NULL DEFAULT '',
  `groom_mother_name` VARCHAR(100) NOT NULL DEFAULT '',
  `groom_photo_url` VARCHAR(255) NOT NULL DEFAULT '',
  `groom_instagram` VARCHAR(50) NULL,
  `groom_bio` TEXT NULL,
  -- Mempelai Wanita
  `bride_name` VARCHAR(50) NOT NULL,
  `bride_full_name` VARCHAR(100) NOT NULL,
  `bride_father_name` VARCHAR(100) NOT NULL DEFAULT '',
  `bride_mother_name` VARCHAR(100) NOT NULL DEFAULT '',
  `bride_photo_url` VARCHAR(255) NOT NULL DEFAULT '',
  `bride_instagram` VARCHAR(50) NULL,
  `bride_bio` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_couple_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `invitation_quotes`
Kutipan agama / kalimat mutiara undangan.
```sql
CREATE TABLE `invitation_quotes` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invitation_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `quote_text` TEXT NOT NULL,
  `quote_source` VARCHAR(150) NOT NULL,
  `quote_translation` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_quotes_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `invitation_events`
Rangkaian acara pernikahan (Akad, Resepsi, Pemberkatan, dll).
```sql
CREATE TABLE `invitation_events` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE,
  `invitation_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(100) NOT NULL COMMENT 'Akad Nikah, Resepsi, dll',
  `event_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `timezone` VARCHAR(10) NOT NULL DEFAULT 'WIB' COMMENT 'WIB, WITA, WIT',
  `location_name` VARCHAR(150) NOT NULL,
  `address` TEXT NOT NULL,
  `maps_url` VARCHAR(500) NOT NULL DEFAULT '',
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_events_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE,
  INDEX `idx_events_invitation_date` (`invitation_id`, `event_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `invitation_stories`
Linimasa perjalanan kisah cinta pasangan.
```sql
CREATE TABLE `invitation_stories` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE,
  `invitation_id` BIGINT UNSIGNED NOT NULL,
  `year_label` VARCHAR(30) NOT NULL COMMENT 'Tahun / Periode',
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(255) NULL,
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_stories_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE,
  INDEX `idx_stories_invitation_order` (`invitation_id`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `invitation_galleries`
Foto-foto album kenangan / prewedding.
```sql
CREATE TABLE `invitation_galleries` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE,
  `invitation_id` BIGINT UNSIGNED NOT NULL,
  `photo_url` VARCHAR(255) NOT NULL,
  `caption` VARCHAR(255) NULL,
  `width` INT UNSIGNED NULL,
  `height` INT UNSIGNED NULL,
  `file_size` INT UNSIGNED NULL,
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_galleries_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE,
  INDEX `idx_galleries_invitation_order` (`invitation_id`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `invitation_musics`
Pengaturan lagu tema latar belakang undangan.
```sql
CREATE TABLE `invitation_musics` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invitation_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `artist` VARCHAR(150) NOT NULL,
  `audio_url` VARCHAR(255) NOT NULL,
  `autoplay` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_musics_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `invitation_bank_accounts`
Nomor rekening bank & dompet digital untuk amplop online.
```sql
CREATE TABLE `invitation_bank_accounts` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE,
  `invitation_id` BIGINT UNSIGNED NOT NULL,
  `bank_name` VARCHAR(50) NOT NULL COMMENT 'BCA, MANDIRI, BRI, BNI, dll',
  `account_number` VARCHAR(50) NOT NULL,
  `account_holder` VARCHAR(100) NOT NULL,
  `qris_image_url` VARCHAR(255) NULL,
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bank_accounts_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE,
  INDEX `idx_bank_invitation` (`invitation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `invitation_gifts`
Alamat pengiriman kado fisik pernikahan.
```sql
CREATE TABLE `invitation_gifts` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invitation_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `recipient_name` VARCHAR(100) NOT NULL,
  `phone_number` VARCHAR(30) NOT NULL,
  `full_address` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_gifts_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.4 Guests & RSVP Tables

#### Tabel: `invitation_guests`
Buku daftar tamu per undangan beserta status check-in hari-H.
```sql
CREATE TABLE `invitation_guests` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE,
  `invitation_id` BIGINT UNSIGNED NOT NULL,
  `guest_code` VARCHAR(20) NOT NULL UNIQUE COMMENT 'Kode alfanumerik pendek untuk link personal',
  `name` VARCHAR(150) NOT NULL,
  `category` ENUM('Keluarga', 'Sahabat', 'Teman Kantor', 'VIP', 'Umum') NOT NULL DEFAULT 'Umum',
  `phone_number` VARCHAR(30) NULL,
  `max_pax` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `notes` VARCHAR(255) NULL,
  `is_checked_in` TINYINT(1) NOT NULL DEFAULT 0,
  `checked_in_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_guests_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE,
  INDEX `idx_guests_invitation_category` (`invitation_id`, `category`),
  INDEX `idx_guests_invitation_name` (`invitation_id`, `name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `invitation_rsvps`
Data konfirmasi kehadiran dan ucapan buku tamu dari publik.
```sql
CREATE TABLE `invitation_rsvps` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE,
  `invitation_id` BIGINT UNSIGNED NOT NULL,
  `guest_id` BIGINT UNSIGNED NULL COMMENT 'Terkait ke guests jika via personalized link',
  `guest_name` VARCHAR(150) NOT NULL,
  `attendance` ENUM('hadir', 'tidak', 'ragu') NOT NULL DEFAULT 'hadir',
  `pax` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `message` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rsvps_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rsvps_guest` FOREIGN KEY (`guest_id`) REFERENCES `invitation_guests` (`id`) ON DELETE SET NULL,
  INDEX `idx_rsvps_invitation_attendance` (`invitation_id`, `attendance`),
  INDEX `idx_rsvps_invitation_created` (`invitation_id`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `invitation_wa_templates`
Format draft pesan WhatsApp berkategori untuk distribusi undangan.
```sql
CREATE TABLE `invitation_wa_templates` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE,
  `invitation_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL COMMENT 'Formal, Santai, Singkat',
  `body` TEXT NOT NULL,
  `assigned_categories_json` JSON NOT NULL COMMENT 'Array: ["Keluarga", "VIP"]',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wa_templates_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE,
  INDEX `idx_wa_invitation` (`invitation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.5 Monetization, Orders & Perpetual Licences

#### Tabel: `orders`
Transaksi checkout pembelian lisensi template.
```sql
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE,
  `reference` VARCHAR(30) NOT NULL UNIQUE COMMENT 'Format IM-XXXX-XXXX untuk referensi nota',
  `user_id` BIGINT UNSIGNED NOT NULL,
  `invitation_id` BIGINT UNSIGNED NOT NULL,
  `template_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'IDR',
  `status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `payment_method` ENUM('qris', 'bank-transfer', 'ewallet') NOT NULL,
  `paid_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_orders_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_orders_template` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`) ON DELETE RESTRICT,
  INDEX `idx_orders_user_status` (`user_id`, `status`),
  INDEX `idx_orders_reference` (`reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabel: `template_licences`
Hak kepemilikan lisensi desain permanen per undangan (*perpetual licence*).
```sql
CREATE TABLE `template_licences` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(36) NOT NULL UNIQUE,
  `invitation_id` BIGINT UNSIGNED NOT NULL,
  `template_id` INT UNSIGNED NOT NULL,
  `order_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `kind` ENUM('perpetual') NOT NULL DEFAULT 'perpetual',
  `issued_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_licences_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_licences_template` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_licences_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT,
  UNIQUE KEY `uk_invitation_template_licence` (`invitation_id`, `template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.6 Analytics & Audit Tables

#### Tabel: `invitation_visitor_logs`
Log kunjungan mentah untuk statistik penayangan halaman.
```sql
CREATE TABLE `invitation_visitor_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invitation_id` BIGINT UNSIGNED NOT NULL,
  `guest_id` BIGINT UNSIGNED NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `user_agent` VARCHAR(255) NULL,
  `device_type` ENUM('mobile', 'desktop', 'tablet') NOT NULL DEFAULT 'mobile',
  `visited_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_logs_invitation` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE,
  INDEX `idx_logs_invitation_date` (`invitation_id`, `visited_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. Constraint & Indexing Strategy Summary

### 4.1 Unique Constraints
- `users(email)`: Menjamin tidak ada registrasi ganda dengan email yang sama.
- `invitations(slug)`: Menjamin tidak ada konflik URL antar-undangan di seluruh sistem.
- `invitation_guests(guest_code)`: Menjamin kode tautan personal bersifat unik.
- `orders(reference)`: Menjamin nomor referensi nota pembayaran tidak tertukar.
- `template_licences(invitation_id, template_id)`: Menjamin 1 undangan hanya perlu membeli 1 lisensi permanen untuk desain template yang sama (mencegah double charge).

### 4.2 Composite Indexes untuk Performa Maksimal
- `invitations(user_id, is_published)`: Mempercepat filter daftar draf vs tayang pada konsol user.
- `invitation_events(invitation_id, event_date)`: Mempercepat pengurutan jadwal acara dari yang paling awal.
- `invitation_guests(invitation_id, category)`: Mempercepat tab filter tamu berdasarkan kategori di studio.
- `invitation_rsvps(invitation_id, attendance)`: Mempercepat kalkulasi agregat pax hadir, ragu, dan tidak hadir untuk kalkulator katering.
- `invitation_rsvps(invitation_id, created_at DESC)`: Mempercepat pemuatan linimasa ucapan tamu publik (*pagination*).

