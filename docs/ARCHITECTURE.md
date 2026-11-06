# CodeIgniter 4 Backend Architecture Blueprint — Undangan Online (InfoMase)

Dokumen ini merancang arsitektur backend berbasis **CodeIgniter 4 (CI4)** modern, modular, dan bersih (*Clean Layered Architecture*). Arsitektur ini dirancang khusus untuk menggantikan backend lama `infomase-backend` (CodeIgniter 3 yang deprecated) dengan fondasi yang tangguh, mudah dirawat (*maintainable*), teruji, dan sesuai standar industri.

---

## 1. Architectural Philosophy & Layered Structure

Aplikasi backend dibangun dengan pola **Controller-Service-Model-Entity Layering**:
- **Thin Controllers**: Controller hanya bertugas menangani protokol HTTP, membaca parameter request, memanggil service layer terkait, dan mengembalikan format respon JSON terstandarisasi. Tidak ada business logic rumit atau query database langsung di controller.
- **Dedicated Service Layer**: Seluruh aturan bisnis (*business rules*), komputasi, kalkulasi katering, validasi lisensi, koordinasi transaksi database (ACID), dan pemrosesan berkas diisolasi di layer `App\Services`.
- **Entities & Models**:
  - `App\Entities`: Representasi objek domain dengan getter/setter, casting tipe data otomatis, dan mutator.
  - `App\Models`: Query builder CI4 murni yang menangani relasi basis data, scope query, pagination, dan aturan `$allowedFields`.
- **Filters (Middleware)**: Menangani cross-cutting concerns seperti CORS, otentikasi JWT Bearer, rate limiting, dan validasi kepemilikan resource (*Ownership Guard*).

---

## 2. CodeIgniter 4 Directory Tree Blueprint

```
backend-ci4/
├── app/
│   ├── Common.php
│   ├── Config/
│   │   ├── App.php                            # Base URL, Timezone (Asia/Jakarta), Locale (id)
│   │   ├── Autoload.php                       # Namespaces & PSR-4 mapping
│   │   ├── Cors.php                           # Konfigurasi CORS resmi CI4
│   │   ├── Database.php                       # Koneksi database MySQL 8 (InnoDB)
│   │   ├── Filters.php                        # Registrasi alias filter HTTP
│   │   ├── JWT.php                            # Konfigurasi secret key, algoritma & TTL token
│   │   ├── Routes.php                         # Definisi rute RESTful API v1
│   │   ├── Validation.php                     # Ruleset validasi kustom
│   ├── Controllers/
│   │   ├── BaseController.php                 # Controller dasar
│   │   ├── Api/
│   │   │   ├── BaseApiController.php          # Helper JSON response: respondSuccess, respondError
│   │   │   ├── V1/
│   │   │   │   ├── AuthController.php         # Register, Login, Refresh, Logout, Me
│   │   │   │   ├── TemplateController.php     # Katalog template publik & detail
│   │   │   │   ├── InvitationController.php   # CRUD Undangan, Check-slug, Publish, Duplicate
│   │   │   │   ├── ContentController.php      # Couple, Events, Quotes, Stories, Gallery, Gift, Music
│   │   │   │   ├── MediaController.php        # Upload photo, batch gallery, upload MP3
│   │   │   │   ├── GuestController.php        # CRUD Tamu, Bulk add, WA Link, Check-in Hari-H
│   │   │   │   ├── RsvpController.php         # Rekap RSVP, Hapus ucapan, Ekspor CSV
│   │   │   │   ├── OrderController.php        # Checkout template, Riwayat pesanan, Lisensi
│   │   │   │   ├── PublicInvitationController.php # Endpoint tamu: /public/invitations/:slug
│   │   │   │   └── DashboardController.php    # Metrik ringkasan konsol pengguna
│   ├── Database/
│   │   ├── Migrations/                        # Seluruh migrasi skema tabel relasional
│   │   └── Seeds/                             # Seeder master template (8 tema), kategori, demo data
│   ├── Entities/                              # Domain Objects CI4
│   │   ├── UserEntity.php
│   │   ├── InvitationEntity.php
│   │   ├── CoupleEntity.php
│   │   ├── EventEntity.php
│   │   ├── GuestEntity.php
│   │   ├── RsvpEntity.php
│   │   ├── OrderEntity.php
│   │   └── LicenceEntity.php
│   ├── Filters/                               # HTTP Interceptors
│   │   ├── CorsFilter.php                     # CORS Preflight & Header handler
│   │   ├── JwtAuthFilter.php                  # Validasi Authorization Bearer JWT
│   │   ├── ResourceOwnerFilter.php            # Verifikasi kepemilikan resource (Anti-IDOR)
│   │   └── RateLimiterFilter.php              # Throttling endpoint publik & auth
│   ├── Helpers/
│   │   ├── response_helper.php                # Format JSON envelope seragam
│   │   └── slug_helper.php                    # Sanitasi URL slug generator
│   ├── Models/                                # CI4 Active Record Models
│   │   ├── UserModel.php
│   │   ├── UserTokenModel.php
│   │   ├── TemplateModel.php
│   │   ├── TemplateCategoryModel.php
│   │   ├── InvitationModel.php
│   │   ├── CoupleModel.php
│   │   ├── QuoteModel.php
│   │   ├── EventModel.php
│   │   ├── StoryModel.php
│   │   ├── GalleryModel.php
│   │   ├── MusicModel.php
│   │   ├── BankAccountModel.php
│   │   ├── GiftModel.php
│   │   ├── GuestModel.php
│   │   ├── RsvpModel.php
│   │   ├── WaTemplateModel.php
│   │   ├── OrderModel.php
│   │   └── TemplateLicenceModel.php
│   ├── Services/                              # Business Logic Layer
│   │   ├── AuthService.php                    # Hash, JWT issuance, token rotation
│   │   ├── InvitationService.php              # Create invitation, duplicate, check slug
│   │   ├── ContentService.php                 # Granular updates to couple, events, gallery, etc.
│   │   ├── LicenceService.php                 # Check entitlement, publish guard validation
│   │   ├── OrderService.php                   # Transaction checkout, reference generation
│   │   ├── GuestService.php                   # Bulk parsing, WhatsApp link generator
│   │   ├── RsvpService.php                    # Public submit, spam check, catering metrics
│   │   └── MediaService.php                   # File storage, image resizing, MIME validation
│   └── Validation/
│       └── CustomRules.php                    # Phone number validation, custom slug rules
├── public/
│   ├── index.php                              # Entry point HTTP
│   └── uploads/                               # Symlink direktori aset upload (publicly accessible)
│       ├── avatars/
│       ├── photos/
│       ├── qris/
│       └── audio/
├── writable/
│   ├── logs/                                  # Log rotasi harian
│   └── uploads/                               # Penyimpanan berkas asli sebelum optimasi
├── env                                        # Konfigurasi environment (DB, JWT_SECRET, dll)
└── composer.json
```

---

## 3. Layer Responsibilities & Implementation Pattern

### 3.1 BaseApiController & Response Standardizer
Setiap controller API mewarisi `BaseApiController` yang mengimplementasikan metode output JSON seragam:
```php
namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

abstract class BaseApiController extends ResourceController
{
    protected function respondSuccess($data = null, string $message = 'Sukses', int $statusCode = 200, ?array $meta = null): ResponseInterface
    {
        $response = [
            'success'   => true,
            'message'   => $message,
            'data'      => $data,
            'timestamp' => date('c'),
        ];
        if ($meta !== null) {
            $response['meta'] = $meta;
        }
        return $this->response->setStatusCode($statusCode)->setJSON($response);
    }

    protected function respondError(string $message, int $statusCode = 400, ?string $errorCode = null, ?array $details = null): ResponseInterface
    {
        $response = [
            'success'   => false,
            'message'   => $message,
            'error'     => [
                'code'    => $errorCode ?? 'ERROR',
                'details' => $details ?? [],
            ],
            'timestamp' => date('c'),
        ];
        return $this->response->setStatusCode($statusCode)->setJSON($response);
    }
}
```

---

### 3.2 Service Layer Pattern (Contoh: `LicenceService` & Publish Guard)
Logika verifikasi lisensi sebelum publikasi diisolasi pada service:
```php
namespace App\Services;

use App\Models\InvitationModel;
use App\Models\TemplateModel;
use App\Models\TemplateLicenceModel;
use CodeIgniter\Exceptions\PageNotFoundException;

class LicenceService
{
    protected InvitationModel $invitationModel;
    protected TemplateModel $templateModel;
    protected TemplateLicenceModel $licenceModel;

    public function __construct()
    {
        $this->invitationModel = new InvitationModel();
        $this->templateModel   = new TemplateModel();
        $this->licenceModel    = new TemplateLicenceModel();
    }

    public function canPublish(int $invitationId): bool
    {
        $invitation = $this->invitationModel->find($invitationId);
        if (!$invitation) {
            throw new PageNotFoundException('Undangan tidak ditemukan');
        }

        $template = $this->templateModel->find($invitation->template_id);
        if (!$template) {
            return false;
        }

        // Template gratis selalu boleh tayang
        if ((float) $template->price === 0.00) {
            return true;
        }

        // Template berbayar wajib memiliki lisensi aktif pada undangan ini
        $licence = $this->licenceModel
            ->where('invitation_id', $invitationId)
            ->where('template_id', $template->id)
            ->first();

        return $licence !== null;
    }
}
```

---

## 4. Authentication, Authorization & Security Architecture

### 4.1 JWT Authentication Filter (`JwtAuthFilter.php`)
- Memeriksa header `Authorization: Bearer <token>`.
- Mendekode payload JWT menggunakan library `firebase/php-jwt`.
- Memverifikasi status token dan masa aktif.
- Menyematkan objek pengguna yang terotentikasi ke request context (`$request->user = $userPayload`).

### 4.2 Resource Ownership Guard Filter (`ResourceOwnerFilter.php`)
- **Mencegah Kerentanan IDOR (*Insecure Direct Object Reference*)**:
- Setiap kali request ditujukan ke endpoint `/api/v1/invitations/(:segment)/...`, filter ini secara otomatis memeriksa:
  ```php
  $invitation = $invitationModel->where('public_id', $invitationPublicId)->first();
  if (!$invitation || $invitation->user_id !== $currentAuthUser->id) {
      return service('response')->setStatusCode(403)->setJSON([
          'success' => false,
          'message' => 'Anda tidak memiliki hak akses untuk mengubah undangan ini',
          'error'   => ['code' => 'FORBIDDEN_RESOURCE_ACCESS']
      ]);
  }
  ```

---

## 5. Routing Architecture (`app/Config/Routes.php`)

```php
use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->group('api/v1', ['namespace' => 'App\Controllers\Api\V1', 'filter' => 'cors'], function ($routes) {

    // ---------------------------------------------------- PUBLIC AUTH & CATALOG
    $routes->post('auth/register', 'AuthController::register', ['filter' => 'rate_limiter:auth']);
    $routes->post('auth/login', 'AuthController::login', ['filter' => 'rate_limiter:auth']);
    $routes->post('auth/refresh-token', 'AuthController::refreshToken');
    $routes->get('templates', 'TemplateController::index');
    $routes->get('templates/(:segment)', 'TemplateController::show/$1');

    // ---------------------------------------------------- PUBLIC INVITATIONS (TAMU)
    $routes->group('public', ['filter' => 'rate_limiter:public'], function ($routes) {
        $routes->get('invitations/(:segment)', 'PublicInvitationController::show/$1');
        $routes->post('invitations/(:segment)/rsvp', 'PublicInvitationController::submitRsvp/$1');
        $routes->get('invitations/(:segment)/wishes', 'PublicInvitationController::getWishes/$1');
    });

    // ---------------------------------------------------- PROTECTED USER CONSOLE
    $routes->group('', ['filter' => 'jwt_auth'], function ($routes) {
        // Auth session
        $routes->get('auth/me', 'AuthController::me');
        $routes->post('auth/logout', 'AuthController::logout');

        // Dashboard Overview
        $routes->get('dashboard/summary', 'DashboardController::summary');

        // Invitations Root
        $routes->get('invitations', 'InvitationController::index');
        $routes->post('invitations', 'InvitationController::create');
        $routes->get('invitations/check-slug', 'InvitationController::checkSlug');

        // Orders & Monetization
        $routes->post('orders/checkout', 'OrderController::checkout');
        $routes->get('orders', 'OrderController::index');
        $routes->get('orders/(:segment)', 'OrderController::show/$1');
        $routes->get('licences', 'OrderController::licences');

        // Scoped to specific Invitation (with Resource Ownership Verification)
        $routes->group('invitations/(:segment)', ['filter' => 'resource_owner'], function ($routes) {
            $routes->get('', 'InvitationController::show/$1');
            $routes->delete('', 'InvitationController::delete/$1');
            $routes->patch('publish', 'InvitationController::togglePublish/$1');
            $routes->post('duplicate', 'InvitationController::duplicate/$1');
            $routes->get('stats', 'InvitationController::stats/$1');

            // Content Subsections
            $routes->put('couple', 'ContentController::updateCouple/$1');
            $routes->put('events', 'ContentController::updateEvents/$1');
            $routes->put('quote', 'ContentController::updateQuote/$1');
            $routes->put('stories', 'ContentController::updateStories/$1');
            $routes->put('gallery', 'ContentController::updateGallery/$1');
            $routes->put('gift-data', 'ContentController::updateGiftData/$1');
            $routes->put('music', 'ContentController::updateMusic/$1');

            // Media Uploads
            $routes->post('upload/photo', 'MediaController::uploadPhoto/$1');
            $routes->post('upload/gallery-batch', 'MediaController::uploadGalleryBatch/$1');
            $routes->post('upload/audio', 'MediaController::uploadAudio/$1');
            $routes->delete('assets', 'MediaController::deleteAsset/$1');

            // Guest Manager
            $routes->get('guests', 'GuestController::index/$1');
            $routes->post('guests', 'GuestController::create/$1');
            $routes->post('guests/bulk', 'GuestController::bulkCreate/$1');
            $routes->put('guests/(:segment)', 'GuestController::update/$1/$2');
            $routes->delete('guests/(:segment)', 'GuestController::delete/$1/$2');
            $routes->get('guests/(:segment)/wa-message', 'GuestController::waMessage/$1/$2');
            $routes->patch('guests/(:segment)/check-in', 'GuestController::checkIn/$1/$2');
            $routes->get('wa-templates', 'GuestController::getWaTemplates/$1');
            $routes->put('wa-templates', 'GuestController::updateWaTemplates/$1');

            // RSVP Manager
            $routes->get('rsvps', 'RsvpController::index/$1');
            $routes->delete('rsvps/(:segment)', 'RsvpController::delete/$1/$2');
            $routes->get('rsvps/export', 'RsvpController::exportCsv/$1');
        });
    });
});
```

---

## 6. High-Traffic Caching & Public Read Strategy

Tautan undangan pernikahan di WhatsApp sering kali dibuka oleh ribuan tamu dalam hitungan menit setelah pesan disebarkan. Untuk mencegah beban query database berlebih (*thundering herd problem*):
1. **Public Invitation Cache**:
   - Respon endpoint `GET /api/v1/public/invitations/:slug` di-cache menggunakan Redis atau File Cache bawaan CI4 selama **10 menit**.
   - Setiap kali pemilik memperbarui konten undangan di studio editor, service otomatis menghapus cache slug bersangkutan (*cache invalidation on write*).
2. **Asynchronous Visitor Logging**:
   - Pencatatan log pengunjung (`invitation_visitor_logs`) tidak memblokir respon HTTP ke tamu.
3. **Optimasi Buffer Pool MySQL**:
   - Tabel `invitations`, `templates`, dan `invitation_events` memiliki indeks komposit dan ukuran baris yang ramping sehingga seluruh tabel aktif termuat di RAM (*InnoDB Buffer Pool*).

