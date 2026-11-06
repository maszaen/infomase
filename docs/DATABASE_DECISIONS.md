# Architectural Decision Records (ADR) — Undangan Online (InfoMase)

Dokumen ini mendokumentasikan keputusan-keputusan arsitektur penting (*Architectural Decision Records - ADR*), alternatif rancangan yang dipertimbangkan, justifikasi teknis pemilihan, analisis trade-off, mitigasi risiko, serta pertanyaan terbuka (*open questions*) untuk implementasi backend CodeIgniter 4 platform **Undangan Online**.

---

## ADR-001: Pemilihan Database Engine (MySQL 8.0+ dengan InnoDB Engine)

### Status: ACCEPTED

### Konteks
Sistem membutuhkan penyimpanan data relasional yang andal, berkecepatan tinggi, mendukung transaksi ACID, memfasilitasi integritas referensial (foreign keys), serta memiliki dukungan ekosistem terbaik pada framework CodeIgniter 4 dan infrastruktur server di Indonesia.

### Alternatif yang Dievaluasi
1. **PostgreSQL 15+**: Sangat kaya fitur untuk JSON query dan geo-spatial, namun driver CI4 untuk PostgreSQL memiliki sedikit variasi sintaks pada migration builder dan kurang umum di hosting PHP shared/VPS standar di Indonesia.
2. **MongoDB / Dokumen NoSQL**: Fleksibel untuk dokumen JSON dinamis, namun tidak memiliki integritas referensial native yang ketat, sulit menjamin isolasi multi-tenant yang aman dari IDOR, dan memerlukan extension terpisah pada PHP.
3. **MySQL 8.0+ / MariaDB 10.5+ (InnoDB)**: Standar de-facto ekosistem PHP dan CodeIgniter 4, performa join sangat tinggi, dukungan JSON data types native, dan ketersediaan luas.

### Keputusan & Alasan
Dipilih **MySQL 8.0+ (atau MariaDB 10.5+) dengan storage engine InnoDB**.
- Driver `MySQLi` pada CodeIgniter 4 adalah driver paling stabil dan diuji paling intensif oleh komunitas CI4.
- InnoDB menyediakan isolasi transaksi tingkat baris (*row-level locking*) dan integritas referensial penuh dengan `ON DELETE CASCADE`.
- Karakter set `utf8mb4` dengan collation `utf8mb4_unicode_ci` mendukung penuh penyimpanan teks doa restu ber-emoji dan aksara lokal.

### Trade-offs & Risiko
- *Trade-off*: Sedikit lebih ketat dalam mendefinisikan skema dibandingkan NoSQL.
- *Mitigasi*: Menggunakan fitur migrasi database CodeIgniter 4 (`spark migrate`) untuk memelihara versi skema secara terprogram.

---

## ADR-002: Strategi Primary Key (Internal BIGINT AUTO_INCREMENT + External UUID / String Identifier)

### Status: ACCEPTED

### Konteks
Penggunaan auto-increment ID (`1, 2, 3...`) pada URL atau REST API publik menimbulkan kerentanan **IDOR (*Insecure Direct Object Reference*)** dan memudahkan kompetitor mengukur volume transaksi/pengguna secara langsung (*enumeration attack*). Di sisi lain, menggunakan UUIDv4 sebagai primary key fisik pada InnoDB menyebabkan fragmentasi indeks B-Tree yang parah dan penurunan performa `INSERT` serta `JOIN`.

### Alternatif yang Dievaluasi
1. **Murni Auto-Increment INT/BIGINT**: Cepat dan hemat memori, namun berbahaya jika terekspos di API publik.
2. **Murni UUIDv4 sebagai Primary Key**: Aman dari enumerasi, namun menyebabkan fragmentasi B-Tree dan ukuran foreign key 4x lebih besar (16-36 byte vs 4-8 byte) di seluruh tabel anak.
3. **Dual-Key Strategy (Internal BIGINT + External Public String ID)**: Menggabungkan keunggulan keduanya.

### Keputusan & Alasan
Dipilih **Dual-Key Strategy**:
- Setiap tabel memiliki kolom `id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY` untuk seluruh relasi internal dan join antartabel.
- Setiap tabel yang terekspos ke API memiliki kolom `public_id VARCHAR(36) NOT NULL UNIQUE` (atau format slug/prefix seperti `inv_...`, `usr_...`, `gst_...`) yang diindeks.
- REST API hanya menerima dan menampilkan `public_id` atau `slug`, sedangkan relasi internal antar-tabel di backend selalu mengacu pada `id` numerik.

### Trade-offs & Risiko
- *Trade-off*: Diperlukan satu lookup tambahan `WHERE public_id = ?` di service layer untuk mendapatkan `id` numerik internal sebelum melakukan join.
- *Mitigasi*: Karena kolom `public_id` memiliki indeks unik (*unique index*), overhead query lookup mendekati 0 milidetik ($O(\log N)$).

---

## ADR-003: Model Monetisasi Beli-per-Template (Perpetual Licence) vs Berlangganan (Subscription)

### Status: ACCEPTED

### Konteks
Pada audit frontend ditemukan inkonsistensi historis: klaim di landing page menjanjikan *"Sekali bayar, beres selamanya"*, tetapi di versi lama terdapat simulasi langganan akun dengan masa aktif 30 hari. Hal ini berpotensi menjadi sengketa konsumen saat undangan digital pengantin mati sebelum atau sesudah hari-H pernikahan.

### Alternatif yang Dievaluasi
1. **Model Langganan Akun Bulanan (SaaS Subscription)**: Menagih biaya per bulan/tahun untuk akun. Tidak cocok untuk produk pernikahan yang merupakan momen sekali seumur hidup (*one-off event*).
2. **Model Beli-per-Template (Pay-per-Template Perpetual Licence)**: Harga melekat pada template yang dipilih. Pembelian menghasilkan lisensi permanen (*perpetual*) yang terikat ke satu undangan dan tidak pernah kedaluwarsa.

### Keputusan & Alasan
Dipilih **Model Beli-per-Template (Perpetual Licence)**:
- Sesuai dengan psikologi konsumen pengantin: *"Bayar sekali untuk acara pernikahan kami"*.
- Lisensi dicatat di tabel `template_licences` dengan kolom `kind = 'perpetual'`.
- Undangan berstatus tayang tidak akan pernah dinonaktifkan secara otomatis hanya karena berlalunya tanggal.
- Pengguna yang memiliki beberapa acara berbeda (misal: acara keluarga pihak wanita dan ngunduh mantu pihak pria) dapat membuat undangan terpisah dan membayar lisensi sesuai template yang dipakai pada masing-masing undangan.

---

## ADR-004: Normalisasi Relasional Penuh vs Penyimpanan JSON Kolom Tunggal untuk Child Resources

### Status: ACCEPTED

### Konteks
Frontend mengelola objek `InvitationData` yang kaya akan array bersarang: `events[]`, `stories[]`, `gallery[]`, `bankAccounts[]`, `guests[]`, dan `rsvpList[]`. Muncul godaan untuk menyimpan seluruh objek tersebut sebagai satu dokumen JSON besar di kolom `invitations.data_json`.

### Alternatif yang Dievaluasi
1. **Monolithic JSON Column**: Menyimpan seluruh konfigurasi undangan dalam 1 kolom `JSON`. Cepat saat membaca satu undangan utuh, namun:
   - Mustahil melakukan query agregat cepat (misal: menghitung total pax hadir untuk katering).
   - Sulit melakukan pagination, searching, dan filtering pada ribuan tamu dan ucapan RSVP.
   - Risiko benturan penulisan bersamaan (*race condition* / data loss) jika dua admin mengubah bagian berbeda secara simultan.
2. **Normalized Relational Tables**: Memecah setiap komponen menjadi tabel tersendiri (`invitation_events`, `invitation_galleries`, `invitation_guests`, `invitation_rsvps`, dll).

### Keputusan & Alasan
Dipilih **Normalized Relational Tables (Kaidah 3NF)**:
- Data tamu (`invitation_guests`) dan RSVP (`invitation_rsvps`) bertumbuh dinamis dan memerlukan pengurutan (*sorting*), filter status kehadiran, pagination, dan kalkulasi agregasi instan.
- Integritas data terjamin melalui foreign key constraints.
- Kolom JSON hanya diizinkan untuk data murni presentasional statis yang tidak pernah di-filter atau di-join (seperti `palette_json` dan `typography_json` pada tabel master `templates`).

---

## ADR-005: Isolasi Data Multi-Tenant (Tenant Boundary via Foreign Keys)

### Status: ACCEPTED

### Konteks
Aplikasi mengelola data pribadi pengguna (daftar kontak tamu, nomor HP, pesan pribadi, dan nomor rekening). Kebocoran data antar-pengguna (*cross-tenant data leakage*) adalah pelanggaran privasi serius.

### Keputusan & Alasan
- Setiap resource anak memiliki dependensi foreign key eksplisit ke `invitation_id`, dan `invitation_id` terikat ke `user_id`.
- Diterapkan **Resource Ownership Guard** (`ResourceOwnerFilter`) di tingkat middleware CodeIgniter 4 yang secara otomatis memvalidasi bahwa `invitation.user_id === currentAuthUser.id` sebelum permintaan masuk ke controller.
- Manipulasi ID di parameter URL secara otomatis diblokir dengan HTTP 403 Forbidden.

---

## ADR-006: Strategi Caching Halaman Undangan Publik

### Status: ACCEPTED

### Konteks
Ketika pengantin menyebarkan undangan ke ratusan atau ribuan kontak WhatsApp sekaligus, endpoint publik `GET /api/v1/public/invitations/:slug` akan menerima lonjakan traffic serentak (*viral traffic spike*).

### Keputusan & Alasan
- Menerapkan caching pada layer CodeIgniter 4 Cache (Redis atau File Handler) untuk endpoint publik dengan durasi TTL **10 menit**.
- Menerapkan mekanisme **Cache Invalidation on Write**: Saat pengantin mengedit konten di studio editor atau saat status publish berubah, cache untuk slug bersangkutan langsung dihapus.
- Endpoint pengiriman RSVP publik (`POST /public/invitations/:slug/rsvp`) dilindungi **Rate Limiting Filter** (maksimal 5 request per IP per 10 menit) untuk mencegah bot spam, dan tidak menghapus cache konten utama.

---

## ADR-007: Penyimpanan Berkas Media (Foto & Audio)

### Status: ACCEPTED

### Konteks
Undangan online memerlukan banyak berkas gambar (foto mempelai, galeri prewedding, barcode QRIS) dan berkas lagu MP3.

### Alternatif yang Dievaluasi
1. **Menyimpan Berkas sebagai Base64 / BLOB di Database**: Menyebabkan ukuran database membengkak drastis (*bloat*), memperlambat backup, dan membebani RAM database server.
2. **Menyimpan Berkas Fisik di Filesystem / S3 Storage**: Database hanya menyimpan URL dan metadata berkas (nama, format, dimensi, ukuran).

### Keputusan & Alasan
Dipilih **Penyimpanan Berkas Fisik dengan Simpanan URL di Database**:
- Berkas diunggah melalui endpoint `multipart/form-data`, divalidasi MIME type dan batas ukuran.
- Berkas gambar dikompresi otomatis ke format modern `WebP` menggunakan library Image Manipulation bawaan CI4 untuk menghemat bandwidth.
- Berkas disimpan di direktori `writable/uploads/` dengan symlink publik ke `public/uploads/` (atau dapat dialihkan ke AWS S3 / Cloudflare R2 untuk skala besar).

---

## ADR-008: Strategi Soft Delete vs Hard Delete

### Status: ACCEPTED

### Konteks
Penghapusan data yang salah atau disengaja oleh pengguna dapat menyebabkan hilangnya data berharga atau merusak laporan pembukuan finansial.

### Keputusan & Alasan
- **Tabel `users` dan `invitations`**: Menggunakan **Soft Delete** (`deleted_at`). Jika pengguna menghapus undangan, record tidak langsung dimusnahkan agar transaksi pesanan lisensi terkait tetap memiliki referensi data valid.
- **Tabel `orders` dan `template_licences`**: **DILARANG DIHAPUS (No Delete)**. Transaksi finansial adalah dokumen hukum/audit. Status pembatalan ditandai via kolom `status = 'refunded'`.
- **Tabel Child Spesifik (`invitation_events`, `invitation_stories`, `invitation_galleries`, `invitation_guests`, `invitation_rsvps`)**: Menggunakan **Hard Delete** saat dihapus oleh pemilik dari studio editor, atau **Cascading Delete** saat parent undangan di-purge secara permanen oleh admin.

---

## ADR-009: Clean Service-Repository Layering vs Fat Controller / Fat Model

### Status: ACCEPTED

### Konteks
CodeIgniter tradisional (seperti pada `infomase-backend` CI3) kerap menempatkan ratusan baris query SQL dan logika bisnis di dalam controller (*Fat Controller*), menyebabkan kode sulit diuji (*untestable*) dan sulit dikembangkan.

### Keputusan & Alasan
Dipilih **Clean Service-Repository Layering**:
- **Controller**: Murni menangani input/output HTTP, otentikasi token, dan return response.
- **Service**: Mengelola alur transaksi, validasi aturan bisnis, kalkulasi katering, dan integrasi antar-model.
- **Model**: Murni menangani query database via CI4 Query Builder.

---

## 5. Analisis Risiko & Mitigasi

| Risiko Arsitektur | Dampak | Probabilitas | Rencana Mitigasi |
|---|---|---|---|
| **Traffic Spike Tamu Viral** | Server backend down saat ribuan tamu membuka link WA serentak | Tinggi | Caching respon publik (TTL 10 menit), CDN caching untuk aset gambar/audio, dan optimasi query indeks B-Tree. |
| **Spam Ucapan & Doa Restu** | Buku tamu dipenuhi promosi judi/spam atau pesan ofensif | Sedang | Rate limiting per IP publik pada endpoint RSVP, sanitasi XSS (`esc()`), dan tombol hapus ucapan di konsol pemilik. |
| **Serangan IDOR Antar-User** | Pengguna nakal mengubah data undangan orang lain dengan menebak ID | Tinggi | Penggunaan UUID/public string ID, ditambah `ResourceOwnerFilter` di middleware yang memverifikasi kepemilikan akun secara ketat. |
| **Penyalahgunaan Upload File** | Hacker mengunggah script webshell PHP berkedok file gambar | Sangat Tinggi | Validasi MIME type berbasis *file binary signature* (bukan hanya ekstensi), simpan berkas di luar web root, dan nonaktifkan eksekusi skrip di direktori upload via `.htaccess` / Nginx config. |
| **Double Charge Pembelian Lisensi** | Pengguna menekan tombol bayar berkali-kali secara simultan | Sedang | Transaksi database ACID dengan `UNIQUE KEY uk_invitation_template_licence (invitation_id, template_id)`. |

---

## 6. Pertanyaan Terbuka (*Open Questions*) untuk Tahap Implementasi

1. **Integrasi Payment Gateway**: Saat ini alur checkout disimulasikan secara deterministik di frontend (`completeCheckout` di `src/lib/orders.ts`). Untuk produksi, apakah payment gateway yang akan diintegrasikan adalah **Midtrans Snap**, **Xendit**, atau **Tripay**?
   * *Rekomendasi Arsitektur*: Desain tabel `orders` sudah memiliki kolom `payment_method`, `reference`, dan `status` yang kompatibel dengan seluruh webhook payment gateway populer di Indonesia.
2. **Penyimpanan Objek Cloud**: Apakah penyimpanan berkas foto dan audio pada fase awal cukup menggunakan filesystem lokal server dengan Nginx web server, atau langsung diarahkan ke S3-compatible storage (seperti Cloudflare R2 / AWS S3)?
   * *Rekomendasi Arsitektur*: Mulai dengan filesystem lokal berstruktur modular di `writable/uploads/`, dan enkapsulasi pemanggilan URL melalui helper `MediaService` agar migrasi ke S3 kelak hanya mengubah satu service provider.
3. **Masa Depan Fitur Amplop Digital Terintegrasi**: Apakah sistem amplop digital di masa depan akan tetap bersifat transfer langsung antar-rekening (P2P tanpa fee), atau akan disediakan rekening penampung sementara (*escrow / payment link*)?
   * *Rekomendasi Arsitektur*: Struktur tabel saat ini dirancang untuk transfer langsung P2P (bebas biaya admin), yang merupakan nilai jual utama bagi pasangan pengantin di Indonesia.

