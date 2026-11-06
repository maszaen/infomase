# Comprehensive Project Audit — Undangan Online (InfoMase)

## 1. Executive Summary & Audit Overview

Audit ini dilakukan secara menyeluruh terhadap seluruh codebase repositori **Undangan Online** (aplikasi berbasis Next.js 16 App Router dengan styling CSS variables/design token, komponen React modular, dan integrasi template interaktif). Audit ini bertujuan membedah implementasi frontend aktual, alur navigasi, manajemen state, dummy data, interaksi pengguna, serta kebutuhan persistensi data guna menyusun rancangan database relasional dan arsitektur backend baru berbasis **CodeIgniter 4 (CI4)**.

Berdasarkan ketentuan arsitektur:
- Proyek backend lama `infomase-backend` (berbasis CodeIgniter 3) dinyatakan **deprecated** dan tidak dijadikan fondasi backend baru.
- Frontend aktual (`src/`) adalah **sumber kebenaran tunggal (single source of truth)** untuk merekonstruksi business rules dan data models.
- Seluruh kebutuhan bisnis yang diidentifikasi mencakup ekosistem multi-undangan (*multi-invitation*), kepemilikan data berbasis pengguna (*user-centric ownership*), model monetisasi beli-per-template (*pay-per-template perpetual licence*), katering dan meja resepsionis hari-H, hingga distribusi tautan personal via WhatsApp.

---

## 2. Project & Repository Structure

### 2.1 Struktur Direktori Utama
```
undangan-online/
├── docs/                                  # Dokumentasi teknis & audit sistem
│   └── AUDIT.md                           # Audit historis refaktor UI/UX & token
├── infomase-backend/                      # [DEPRECATED] Codebase lama CI3 (akan dihapus)
│   ├── application/
│   ├── modules/
│   ├── ci3.sql / database_wedding_digital.sql
│   └── LIST_API.txt / BACKEND_API_SPECIFICATION.md
├── public/                                # Static assets & standalone HTML templates
│   ├── asset/                             # Gambar umum & musik
│   └── template/                          # Bundel 8 tema HTML siap tayang
│       ├── template-bridge.js             # Jembatan universal iframe/standalone template
│       ├── undangan_1/ ... undangan_8/    # Template statis terisolasi
├── src/                                   # Source code aplikasi Next.js 16
│   ├── app/                               # App Router (Pages, Layouts, API Proxy)
│   │   ├── (marketing)/page.tsx           # Landing page utama
│   │   ├── login/ & register/             # Alur autentikasi publik
│   │   ├── checkout/                      # Alur pembayaran lisensi template
│   │   ├── dashboard/                     # Area konsol pengguna terotentikasi
│   │   │   ├── katalog/                   # Showcase katalog template
│   │   │   ├── orders/                    # Riwayat pesanan & lisensi
│   │   │   └── undangan/[id]/[section]/   # Studio editor 5 bagian
│   │   ├── invite/[slug]/                 # Halaman undangan publik untuk tamu
│   │   └── api/proxy/[...path]/           # Reverse proxy ke API backend
│   ├── components/                        # Reusable React components
│   │   ├── auth/                          # AuthShell & guards
│   │   ├── console/                       # ConsoleRail, PageHeader, StudioChrome, Modals
│   │   │   └── sections/                  # ContentSection, DesignSection, GuestsSection, RsvpSection, DaySection
│   │   ├── invitation/                    # EnvelopeCover, Couple, Events, Gallery, Music, RSVP, Gift, dll.
│   │   │   └── templates/                 # 8 React Template Components & Registry
│   │   ├── marketing/                     # LandingPage, Nav, Footer
│   │   └── ui/                            # Modal, Toast, Brand
│   ├── lib/                               # Core business logic & state providers
│   │   ├── api.ts                         # HTTP fetch client & backend endpoint adapters
│   │   ├── authContext.tsx                # Auth state provider (JWT token & profile)
│   │   ├── defaultData.ts                 # Demo seed 2026 & template presets
│   │   ├── formatDate.ts                  # Intl helper format tanggal Indonesia
│   │   ├── invitationStore.tsx            # Global invitation store (Context + Provider)
│   │   ├── orders.ts                      # Domain pesanan & lisensi permanen
│   │   └── templates.ts                   # Katalog template resmi, harga, palet, alias
│   ├── styles/                            # CSS modul & tema template
│   └── types/                             # TypeScript interfaces & types
│       ├── auth.ts                        # User, AuthTokens, ApiResponse
│       └── invitation.ts                  # InvitationData, EventDetail, GuestItem, RSVPItem, dll.
└── undangan_1/ ... undangan_8/            # Source folder template HTML murni
```

---

## 3. Frontend Inventory: Routing & User Journey

### 3.1 Peta Halaman & Navigasi
Aplikasi memiliki 3 hierarki navigasi utama:
1. **Zona Publik & Marketing**:
   - `/` : Landing page dengan showcase fitur, live mockup demo, katalog mini, langkah pemesanan, dan FAQ.
   - `/login` : Form masuk akun dengan email & password.
   - `/register` : Form registrasi pengguna baru (Nama, Email, WhatsApp, Password & Konfirmasi).
   - `/invite/[slug]` : Halaman undangan publik interaktif untuk tamu dengan pembacaan query param `?to=Nama+Tamu`.
2. **Zona Konsol Akun (`/dashboard`)**:
   - `/dashboard` : Ringkasan akun (Overview), metrik agregat tamu & RSVP, kartu undangan aktif, tombol cepat salin tautan, toggle status publikasi draf/tayang, dan modal pembuatan undangan baru.
   - `/dashboard/katalog` : Katalog lengkap 8 template desain dengan filter kategori, input pencarian, pratinjau harga, dan tombol buat undangan langsung dari template.
   - `/dashboard/orders` : Riwayat pesanan lisensi template, kode referensi unik (`IM-XXXX-XXXX`), metode pembayaran, status lunas, dan rekap nilai belanja (*lifetime value*).
   - `/checkout?template=[id]&undangan=[invitationId]` : Halaman pembayaran lisensi template dengan pilihan metode (QRIS, Transfer Bank, E-Wallet) dan penerbitan bukti lisensi instan.
3. **Zona Studio Editor Undangan (`/dashboard/undangan/[id]/[section]`)**:
   - `.../design` : Manajemen template desain aktif (8 pilihan tema), status lisensi permanen undangan, tombol ganti template visual, dan CTA beli lisensi jika template berbayar belum dimiliki.
   - `.../content` : Editor konten lengkap dengan **7 tab** (`couple`: Mempelai Pria & Wanita, `events`: Acara [Akad, Resepsi, Maps], `quote`: Kutipan, `story`: Kisah Cinta, `gallery`: Galeri Foto, `gift`: Rekening Bank & Alamat Kado, `music`: Musik Latar & Autoplay). Dilengkapi live preview frame ponsel interaktif.
   - `.../day` : Alat operasional hari-H pernikahan: Kalkulator Katering otomatis berbasis total pax konfirmasi hadir RSVP dengan buffer (0%, 10%, 15%, 25%) split 60% prasmanan & 40% gubukan, Meja Resepsionis / Check-in kehadiran tamu interaktif (berbasis local state komponen), serta tombol Ekspor Rekap RSVP CSV. *(Catatan teknis: Rangkaian jadwal acara dikelola di route `.../content` tab Acara, bukan di `.../day`. Fitur live streaming dan calendar reminder tidak diimplementasikan di frontend saat ini).*
   - `.../guests` : Manajemen daftar tamu (tambah manual single, bulk import baris baru format `Nama; NoWA`), filter kategori tamu (Keluarga, Sahabat, Teman Kantor, VIP, Umum), editor master-detail template pesan WhatsApp berkategori dengan variabel dinamis (`{guestName}`, `{eventDate}`, dll.), dan tombol kirim personal WA via deep-link `https://wa.me/...`.
   - `.../rsvp` : Manajemen buku tamu dan konfirmasi kehadiran masuk (filter status Semua/Hadir/Ragu/Tidak Hadir, rekap estimasi total pax hadir, daftar pesan doa restu, hapus ucapan tidak pantas, dan ekspor berkas spreadsheet CSV).

---

## 4. Reusable Components & UI Patterns

| Komponen | Lokasi File | Fungsi & Perilaku |
|---|---|---|
| `Modal` | `src/components/ui/Modal.tsx` | Dialog universal accessible (`role="dialog"`, `aria-modal`, focus-trap, ESC listener, backdrop click). |
| `Toast` / `ToastProvider` | `src/components/ui/Toast.tsx` | Sistem notifikasi melayang tanpa `alert()` bawaan browser (info, success, error, duration timer). |
| `ConsoleChrome` | `src/components/console/ConsoleChrome.tsx` | Shell navigasi konsol dengan sidebar/rail responsif, trigger modal create, dan drawer mobile. |
| `ConsoleRail` | `src/components/console/ConsoleRail.tsx` | Navigasi samping 2 level konteks: level akun (Ringkasan, Pesanan, Katalog) vs level undangan aktif (Desain, Konten, Tamu, RSVP, Hari-H). |
| `ConsolePageHeader` | `src/components/console/ConsolePageHeader.tsx` | Header konsisten dengan slot breadcrumb/title tunggal, deskripsi, dan tombol aksi (Actions slot). |
| `CreateInvitationModal` | `src/components/console/CreateInvitationModal.tsx` | Form modal pembuatan undangan baru dengan live slug preview, pemilihan tema awal, dan auto-redirect ke studio. |
| `AuthenticatedGate` | `src/components/console/AuthenticatedGate.tsx` | Presenter state otentikasi (`AuthLoading`, `AuthNotice`). Konsol dashboard mendukung mode baca / eksplorasi demo (*read-only exploration*) tanpa redirect paksa ke `/login` bila token belum ada. |
| `InvitationRenderer` | `src/components/invitation/InvitationRenderer.tsx` | Komponen perender undangan digital dinamis yang memetakan `templateId` ke komponen tema React yang tepat. |
| `EnvelopeCover` | `src/components/invitation/EnvelopeCover.tsx` | Sampul amplop digital / gate pembuka dengan efek buku lipat 3D, animasi ornamen, dan sapaan personal tamu. |
| `FloatingMusicPlayer` | `src/components/invitation/FloatingMusicPlayer.tsx` | Pemutar audio latar terapung dengan auto-play saat buka cover, tombol toggle play/pause, dan animasi piringan hitam/vinyl. |

---

## 5. State Management & Data Flow Audit

### 5.1 `AuthContext` (`src/lib/authContext.tsx`)
- Mengelola state identitas pengguna (`user: User | null`), token JWT (`token: string | null`), status otentikasi (`isAuthenticated`), dan state loading (`isLoading`).
- Menyediakan method `login`, `register`, `logout`, `refreshProfile`, dan `loginDemo`.
- Token dan profile disinkronkan ke `localStorage` (`infomase_token`, `infomase_refresh_token`, `infomase_user`).
- **Catatan Desain**: State otentikasi telah dipisahkan murni untuk identitas pengguna. Seluruh urusan kepemilikan dan hak akses undangan berpindah ke `InvitationProvider` dan model `orders/licences`.

### 5.2 `InvitationProvider` (`src/lib/invitationStore.tsx`)
- Store global reaktif berbasis React Context yang mengelola:
  - `invitations: InvitationData[]` : Seluruh daftar undangan yang dimiliki akun aktif.
  - `activeId: string` : ID undangan yang sedang dibuka di studio.
  - `data: InvitationData` : Objek undangan aktif yang sedang diedit.
  - `orders: Order[]` : Seluruh transaksi pembelian template.
  - `licences: TemplateLicence[]` : Seluruh lisensi aktif yang dimiliki.
- Fungsi mutasi data:
  - `createInvitation(input)` : Membuat undangan baru dalam status draf dengan slug unik.
  - `duplicateInvitation(id)` : Menduplikasi undangan beserta kontennya ke slug baru `-xxx` (draf tanpa menyalin data tamu & RSVP).
  - `deleteInvitation(id)` : Menghapus undangan dari daftar.
  - `togglePublish(id)` : Mengubah status draf menjadi tayang atau sebaliknya. Memeriksa aturan `needsPurchase(id)`: jika template berbayar dan belum memiliki lisensi untuk undangan tersebut, aksi ditolak dengan pesan `licence-required`.
  - `purchase(input)` : Memproses checkout template dan menerbitkan lisensi permanen (`TemplateLicence`).
  - Pembaruan granular: `updateGroom`, `updateBride`, `updateGeneral`, `updateQuote`, `updateEvents`, `addEvent`, `deleteEvent`, `updateStories`, `updateGallery`, `updateMusic`, `updateBankAccounts`, `updateGiftAddress`, `addRSVP`, `deleteRSVP`, `addGuest`, `deleteGuest`, `updateWaTemplates`.

---

## 6. Dummy Data & Mock Services Audit

### 6.1 `src/lib/defaultData.ts`
- **DEMO_INVITATION**: Objek contoh berstruktur lengkap dengan slug `raka-sinta`, template `boho-botanical` (gratis), bertanggal masa depan `2026-12-12` (menghindari countdown kedaluwarsa).
- **DEFAULT_WA_TEMPLATES**: 3 template pesan WhatsApp standar:
  1. *Formal / Sopan* (ditugaskan untuk kategori Keluarga, VIP, Umum).
  2. *Santai / Teman Akrab* (ditugaskan untuk kategori Sahabat, Teman Kantor).
  3. *Singkat / Direct Link* (template cadangan to-the-point).
- Menggunakan placeholder dinamis: `{guestName}`, `{eventDate}`, `{eventTime}`, `{venueName}`, `{venueAddress}`, `{groomName}`, `{brideName}`, `{link}`.
- **PRESET_PHOTOS**: Kumpulan foto Unsplash pasangan siap pakai untuk pengujian galeri dan profil mempelai.

### 6.2 `src/lib/orders.ts` (Mock Checkout Service)
- Mensimulasikan gateway pembayaran:
  - Menerima `templateId`, `invitationId`, `amount`, `method` (`qris`, `bank-transfer`, `ewallet`).
  - Menghasilkan ID pesanan `ord-<timestamp>`, kode referensi `IM-XXXX-XXXX`, dan lisensi permanen `lic-<timestamp>`.
  - Menyimpan transaksi ke local storage `infomase_orders_v1` dan `infomase_licences_v1`.

### 6.3 `src/lib/api.ts` (API Client & Adapter)
- Menyediakan konektor HTTP ke backend dengan fallback elegan jika backend offline:
  - Upload file: jika backend offline, file gambar dibaca lokal menjadi base64 Data URL untuk pratinjau tanpa merusak alur pengisian formulir.
  - Public invitation fetch: membaca endpoint `/public/invitations/:slug` dengan fallback ke store lokal jika server offline.

---

## 7. Form Submission & Validation Audit

| Formulir | Elemen Input | Validasi Sisi Klien | Kebutuhan Validasi Backend CI4 |
|---|---|---|---|
| Registrasi | Nama, Email, No HP, Password, Confirm Password | Password min 8 karakter, konfirmasi password cocok, email format valid | `required`, `valid_email`, `is_unique[users.email]`, `min_length[8]`, `regex_match` (format HP Indonesia) |
| Login | Email, Password | Input required | `required`, `valid_email`, verifikasi hash `password_verify` |
| Buat Undangan | Nama Pria, Nama Wanita, Tanggal Acara, Template | Nama pria & wanita wajib diisi | `required`, sanitasi string, auto-generate slug, `is_unique[invitations.slug]`, validasi eksistensi template |
| Edit Profil Mempelai | Nama panggilan, nama lengkap, nama ayah/ibu, foto, instagram, bio | String required untuk nama panggilan & foto | Sanitasi string, validasi format username Instagram, validasi URL/path foto |
| Edit Acara | Judul, tanggal, jam mulai, jam selesai, zona waktu, nama tempat, alamat, URL maps | Tanggal `YYYY-MM-DD`, Jam `HH:mm`, URL Maps valid | `required`, `valid_date[Y-m-d]`, format waktu `H:i`, `valid_url`, timezone whitelist (`WIB`,`WITA`,`WIT`) |
| Edit Rekening / Hadiah | Nama bank, nomor rekening, atas nama, URL QRIS, alamat fisik pengiriman | Nomor rekening numeric | `required`, `numeric`, sanitasi string, `max_length` |
| Tambah Tamu (Single) | Nama, kategori, nomor HP (di UI); max pax & catatan (di API adapter) | Nama required, format nomor HP diawali 08/62 | `required`, sanitasi nama, normalisasi format MSISDN `628...` |
| Tambah Tamu (Bulk) | Textarea multi-baris (`Nama` atau `Nama, NoHP`) | Parser memecah per baris `\n` dan pemisah `;`, `,`, `\|` | Validasi batch payload array, limit maksimal 500 tamu per request |
| Form Kirim RSVP (Publik) | Nama tamu, kehadiran (Hadir/Tidak), ucapan | Nama required, pesan required | `required`, sanitasi XSS pada ucapan pesan, `in_list[HADIR,TIDAK_HADIR,RAGU]`, `integer`, `greater_than_equal_to[1]`, rate limiting IP publik |
| Checkout Lisensi Template | Template ID, Undangan ID, metode bayar (QRIS/Bank Transfer/E-Wallet) | Pilihan metode valid | `required`, validasi eksistensi order, penerbitan perpetual licence (simulasi checkout instan di frontend) |

---

## 8. Modal, Drawer, & Interaction Patterns

1. **Gate / Cover 3D**: Tamu harus menekan tombol "Buka Undangan" untuk membuka sampul gerbang 3D dan mengaktifkan audio background autoplay (kebijakan browser autoplay audio policy).
2. **Tab Switcher Konten**: 7 tab horizontal di editor studio content (`/dashboard/undangan/[id]/content`) tanpa reload halaman: Mempelai, Acara, Kutipan, Kisah, Galeri, Amplop, Musik.
3. **Kalkulator Katering Interaktif**: Dropdown buffer (+0%, +10%, +15%, +25%) menghitung ulang kebutuhan porsi prasmanan (60%) dan gubukan (40%) secara real-time dari data kehadiran RSVP.
4. **Resepsionis Check-In Toggle**: Tombol centang kehadiran di meja resepsionis menandai tamu yang sudah hadir secara fisik di lokasi (menggunakan local state komponen).
5. **Ekspor Rekap CSV**: Tombol "Ekspor CSV" di halaman RSVP dan "Unduh RSVP" di halaman Hari-H untuk mengunduh rekap spreadsheet kehadiran tamu (`rekap-rsvp-[slug].csv`) ber-encoding UTF-8 dengan BOM.
6. **Copy-to-Clipboard**: Salin tautan undangan, salin teks pesan WhatsApp, dan salin nomor rekening dilengkapi timeout 2 detik untuk visual feedback.

---

## 9. Identified Issues, Gaps & Security Risks in Current System

1. **CORS & Proxy Dependency**: Frontend saat ini mengandalkan proxy internal Next.js (`/api/proxy/...`) untuk menghindari CORS dan warning Ngrok. Backend baru harus memiliki filter CORS native CI4 yang aman dan mendukung preflight `OPTIONS`.
2. **Ketiadaan Verifikasi Server pada Lisensi**: Pembelian lisensi saat ini disimpan di `localStorage` per browser. Pengguna yang berganti perangkat atau menghapus cache browser akan kehilangan status lisensinya. Hal ini **wajib** dipersistensikan di database backend pada tabel `orders` dan `template_licences`.
3. **Keamanan Data Multi-Tenant**: Pada kode saat ini, endpoint publik `/public/invitations/:slug` berpotensi mengekspos seluruh properti internal jika tidak difilter. Backend harus memiliki *data transformer/presenter* yang hanya mengembalikan data publik (tanpa nomor HP internal pemilik, tanpa rekap keuangan lengkap).
4. **Penyimpanan Berkas Sementara**: Upload foto yang gagal mengirim ke server menggunakan Data URL Base64 yang membebani memori dan storage browser (quota limit 5MB). Backend CI4 harus memiliki upload controller terstandarisasi dengan penyimpanan berkas fisik atau cloud object storage.
5. **Potensi Spam RSVP & Ucapan**: Belum ada proteksi captcha atau IP rate limiting pada endpoint submit RSVP publik.

---

## 10. Technical Observations & Backend Requirements

Frontend telah mencapai tingkat kematangan visual dan fungsional yang sangat baik. Untuk mendukung sistem ini secara andal, backend CodeIgniter 4 harus menyediakan:
- Skema database relasional 3NF yang bersih dengan isolasi ketat antar-user dan antar-undangan.
- Token-based Authentication (JWT) dengan refresh token.
- API endpoints RESTful yang seragam dengan envelope respons JSON standar (`success`, `message`, `data`, `meta`, `error`, `timestamp`).
- Role-based & Resource-ownership Authorization Filter di tingkat middleware.
- Endpoint publik berkecepatan tinggi dengan caching layer untuk menampung traffic viral tamu undangan.
- Penanganan media file uploads (`multipart/form-data`) dengan validasi MIME-type dan auto-resizing.
- Mekanisme transaksi database (ACID) untuk pembuatan pesanan, pembayaran lisensi, dan penghapusan bertingkat (*cascade*).

