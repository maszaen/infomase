# CodeIgniter 4 Backend Architecture Blueprint — Undangan Online (InfoMase)

Dokumen ini merancang arsitektur backend berbasis **CodeIgniter 4 (CI4 4.4+ / 4.5+)** yang modern, idiomatik, tangguh, dan terstandarisasi. Arsitektur ini dirancang khusus untuk menggantikan backend lama `infomase-backend` (CodeIgniter 3 yang deprecated) dengan fondasi yang bersih, teruji, mudah dirawat (*maintainable*), serta selaras 100% dengan dokumen spesifikasi:
- `docs/DATABASE_DESIGN.md` (Skema Relasional 3NF & InnoDB Engine)
- `docs/API_SPECIFICATION.md` (Kontrak REST API & JSON Envelope)
- `docs/BUSINESS_FLOW.md` (Alur Bisnis, Siklus Hidup Entitas, & Publish Guard)

---

## 1. Architectural Philosophy & Framework Realism

### 1.1 Idiomatic CodeIgniter 4 vs. Over-Abstraction
Dalam pengembangan backend PHP modern, sering terjadi kesalahan arsitektural berupa pemindahan pola framework lain (seperti *Spring Boot Java* atau *Laravel DDD*) secara mentah ke CodeIgniter 4. Hal ini kerap melahirkan struktur yang rumit (*Interface Soup*, *Repository Pattern* berlebihan, DTO refleksi) yang sebenarnya merupakan **anti-pattern** pada CI4.

Filosofi arsitektur sistem ini adalah **Pragmatic Layered Architecture**:
1. **Model Bukan Sekadar DAO**: `CodeIgniter\Model` pada CI4 sudah merupakan perpaduan *Active Record* dan *Data Mapper*. Model CI4 sudah memiliki fitur bawaan untuk:
   - Sanitasi `$allowedFields`
   - Pemetaan entitas otomatis (`$returnType = Entity::class`)
   - Otomasi timestamp (`created_at`, `updated_at`, `deleted_at`)
   - Soft deletes bawaan
   - Event callbacks (`beforeInsert`, `afterInsert`, `beforeUpdate`, dll.)
   - Built-in validation ruleset
2. **Penolakan Strict Repository Pattern**:
   - Membungkus setiap `Model` dengan `RepositoryInterface` dan `Eloquent/ModelRepository` hanya untuk memanggil `$this->model->find($id)` menambah 2x hingga 3x boilerplate tanpa keuntungan nyata, serta memperlambat siklus eksekusi PHP (*overhead call stack*).
   - Akses data langsung menggunakan Model CI4 yang dikombinasikan dengan Entities domain adalah pendekatan resmi dan paling efisien (*idiomatic*).
3. **Peran Vital Service Layer (`App\Services`)**:
   - Controller tidak boleh memuat business logic rumit, perhitungan katering, koordinasi transaksi multi-tabel, atau interaksi pihak ketiga.
   - Aturan bisnis diisolasi di **Service Layer**. Service memanggil satu atau lebih Model, mengelola transaksi atomik database (ACID), memvalidasi kelayakan lisensi (*Publish Guard*), dan menangani penyimpanan berkas.

### 1.2 Ringkasan Lapisan Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 Frontend                      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (Bearer JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Filters (Middleware)                    │
│   • CorsFilter            • JwtAuthFilter                   │
│   • RateLimiterFilter     • InvitationOwnerFilter (Anti-IDOR)│
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Thin Controllers (V1)                     │
│   • Parameter Parsing     • Payload Validation Trigger      │
│   • Service Orchestration • Unified Response Envelope       │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Service Layer                         │
│   • AuthService           • InvitationService               │
│   • ContentService        • LicenceService (Publish Guard)  │
│   • OrderService          • GuestService                    │
│   • RsvpService           • MediaService / Storage          │
│             (Atomic Database Transactions ACID)             │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Data Access & Domain Entities                │
│   • CI4 Models (Active Record, Scopes, Relational Queries)   │
│   • CI4 Entities (Type Casting, Mutators, Business Helper)  │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               MySQL 8.0+ Database (InnoDB 3NF)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & PSR-4 Namespace Map

Struktur folder backend mengikuti standar PSR-4 CodeIgniter 4 dengan pemisahan API versi 1 (`V1`):

```
backend-ci4/
├── app/
│   ├── Common.php                             # Fungsi helper global
│   ├── Config/
│   │   ├── App.php                            # Base URL, Timezone (Asia/Jakarta), Locale (id)
│   │   ├── Autoload.php                       # Namespaces & PSR-4 mappings
│   │   ├── Cors.php                           # Konfigurasi native CORS (CI4 4.4+)
│   │   ├── Database.php                       # Koneksi database MySQL 8 (InnoDB, utf8mb4)
│   │   ├── Filters.php                        # Registrasi alias filter HTTP
│   │   ├── JWT.php                            # Konfigurasi Secret Key, Algoritma, & TTL Token
│   │   ├── Routes.php                         # Definisi rute RESTful API v1
│   │   └── Validation.php                     # Ruleset kustom validasi input
│   ├── Controllers/
│   │   ├── BaseController.php                 # Controller dasar bawaan CI4
│   │   └── Api/
│   │       ├── BaseApiController.php          # RESTful Base Controller (Unified Response Helper)
│   │       └── V1/
│   │           ├── AuthController.php         # Register, Login, Refresh, Logout, Me
│   │           ├── TemplateController.php     # Katalog template publik & detail spesifikasi
│   │           ├── InvitationController.php   # CRUD Undangan, Check-slug, Publish, Duplicate
│   │           ├── ContentController.php      # Couple, Events, Quotes, Stories, Gallery, Gift, Music
│   │           ├── MediaController.php        # Upload photo, batch gallery, upload MP3
│   │           ├── GuestController.php        # CRUD Tamu, Bulk add, WA Link, Check-in Hari-H
│   │           ├── RsvpController.php         # Rekap RSVP, Hapus spam ucapan, Ekspor CSV
│   │           ├── OrderController.php        # Checkout template, Riwayat pesanan, Lisensi
│   │           ├── PublicInvitationController.php # Endpoint tamu: /public/invitations/:slug
│   │           └── DashboardController.php    # Metrik ringkasan konsol pengguna
│   ├── Database/
│   │   ├── Migrations/                        # Migrasi skema database relasional (InnoDB 3NF)
│   │   │   ├── 2026-11-06-000001_CreateTemplateCategoriesTable.php
│   │   │   ├── 2026-11-06-000002_CreateTemplatesTable.php
│   │   │   ├── 2026-11-06-000003_CreateUsersTable.php
│   │   │   ├── 2026-11-06-000004_CreateUserTokensTable.php
│   │   │   ├── 2026-11-06-000005_CreateInvitationsTable.php
│   │   │   ├── 2026-11-06-000006_CreateInvitationCouplesTable.php
│   │   │   ├── 2026-11-06-000007_CreateInvitationQuotesTable.php
│   │   │   ├── 2026-11-06-000008_CreateInvitationEventsTable.php
│   │   │   ├── 2026-11-06-000009_CreateInvitationStoriesTable.php
│   │   │   ├── 2026-11-06-000010_CreateInvitationGalleriesTable.php
│   │   │   ├── 2026-11-06-000011_CreateInvitationMusicsTable.php
│   │   │   ├── 2026-11-06-000012_CreateInvitationBankAccountsTable.php
│   │   │   ├── 2026-11-06-000013_CreateInvitationGiftsTable.php
│   │   │   ├── 2026-11-06-000014_CreateInvitationGuestsTable.php
│   │   │   ├── 2026-11-06-000015_CreateInvitationRsvpsTable.php
│   │   │   ├── 2026-11-06-000016_CreateInvitationWaTemplatesTable.php
│   │   │   ├── 2026-11-06-000017_CreateOrdersTable.php
│   │   │   ├── 2026-11-06-000018_CreateTemplateLicencesTable.php
│   │   │   └── 2026-11-06-000019_CreateInvitationVisitorLogsTable.php
│   │   └── Seeds/                             # Master seeders data tema & demo
│   │       ├── DatabaseSeeder.php
│   │       ├── TemplateCategorySeeder.php
│   │       └── TemplateSeeder.php             # 8 Desain Template (undangan_1 s.d. undangan_8)
│   ├── Entities/                              # Domain Entities CI4 (Type casting & mutators)
│   │   ├── UserEntity.php
│   │   ├── UserTokenEntity.php
│   │   ├── TemplateCategoryEntity.php
│   │   ├── TemplateEntity.php
│   │   ├── InvitationEntity.php
│   │   ├── CoupleEntity.php
│   │   ├── QuoteEntity.php
│   │   ├── EventEntity.php
│   │   ├── StoryEntity.php
│   │   ├── GalleryEntity.php
│   │   ├── MusicEntity.php
│   │   ├── BankAccountEntity.php
│   │   ├── GiftEntity.php
│   │   ├── GuestEntity.php
│   │   ├── RsvpEntity.php
│   │   ├── WaTemplateEntity.php
│   │   ├── OrderEntity.php
│   │   ├── TemplateLicenceEntity.php
│   │   └── VisitorLogEntity.php
│   ├── Filters/                               # HTTP Interceptors & Security Guards
│   │   ├── CorsFilter.php                     # Handler CORS Preflight (OPTIONS) & Headers
│   │   ├── JwtAuthFilter.php                  # Guard Token JWT Authorization: Bearer
│   │   ├── InvitationOwnerFilter.php          # Anti-IDOR: Validasi kepemilikan user_id
│   │   └── RateLimiterFilter.php              # Throttling endpoint publik & otentikasi
│   ├── Helpers/
│   │   ├── response_helper.php                # Helper format JSON seragam
│   │   └── slug_helper.php                    # Sanitasi & transliterasi URL slug
│   ├── Models/                                # CI4 Active Record & Data Mapper Models
│   │   ├── UserModel.php
│   │   ├── UserTokenModel.php
│   │   ├── TemplateCategoryModel.php
│   │   ├── TemplateModel.php
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
│   │   ├── TemplateLicenceModel.php
│   │   └── VisitorLogModel.php
│   ├── Services/                              # Business Logic Layer (ACID Transactions)
│   │   ├── AuthService.php                    # Hash, JWT issuance, token rotation, session revoke
│   │   ├── InvitationService.php              # Slug generator, auto-suffix, duplicate, core CRUD
│   │   ├── ContentService.php                 # Pembaruan granular couple, events, gallery, dll.
│   │   ├── LicenceService.php                 # Entitlement check & Publish Guard validator
│   │   ├── OrderService.php                   # Reference generator, checkout, auto-issue licence
│   │   ├── GuestService.php                   # Bulk parsing (text/CSV), WhatsApp link generator
│   │   ├── RsvpService.php                    # Konfirmasi publik, spam throttle, catering calculator
│   │   └── MediaService.php                   # Upload validation, image resizing (GD), file storage
│   └── Validation/
│       └── CustomRules.php                    # Aturan validasi: no HP Indonesia, slug format
├── public/
│   ├── index.php                              # Entry point HTTP server
│   ├── .htaccess                              # Apache mod_rewrite & security headers
│   └── uploads/                               # Berkas media publik
│       ├── avatars/
│       ├── photos/
│       ├── qris/
│       └── audio/
├── writable/
│   ├── cache/                                 # Cache query & file cache
│   ├── logs/                                  # Log rotasi harian (log-YYYY-MM-DD.php)
│   ├── session/                               # File session (jika diperlukan)
│   └── uploads/                               # Temp directory upload berkas
├── env                                        # Environment file (.env)
├── phpunit.xml.dist                           # Konfigurasi PHPUnit testing
└── composer.json
```

---

## 3. Controller Layer & API Response Standardization

### 3.1 BaseApiController Pattern
Semua API Controller mewarisi `App\Controllers\Api\BaseApiController`. Controller ini mengintegrasikan `CodeIgniter\API\ResponseTrait` dan mengunci format respon JSON sesuai spesifikasi kontrak `docs/API_SPECIFICATION.md` Bagian 1.3:

```php
<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

abstract class BaseApiController extends ResourceController
{
    /**
     * Mengembalikan respon JSON sukses standar (HTTP 200 / 201).
     */
    protected function respondSuccess(
        mixed $data = null,
        string $message = 'Operasi berhasil dijalankan',
        int $statusCode = ResponseInterface::HTTP_OK,
        ?array $meta = null
    ): ResponseInterface {
        $payload = [
            'success'   => true,
            'message'   => $message,
            'data'      => $data,
            'timestamp' => date('c'),
        ];

        if ($meta !== null) {
            $payload['meta'] = $meta;
        }

        return $this->response
            ->setStatusCode($statusCode)
            ->setJSON($payload);
    }

    /**
     * Respon helper khusus untuk pembuatan resource baru (HTTP 201 Created).
     */
    protected function respondCreated(mixed $data = null, string $message = 'Resource berhasil dibuat'): ResponseInterface
    {
        return $this->respondSuccess($data, $message, ResponseInterface::HTTP_CREATED);
    }

    /**
     * Mengembalikan respon JSON error terstruktur.
     */
    protected function respondError(
        string $message,
        int $statusCode = ResponseInterface::HTTP_BAD_REQUEST,
        string $errorCode = 'BAD_REQUEST',
        array $details = []
    ): ResponseInterface {
        $payload = [
            'success'   => false,
            'message'   => $message,
            'error'     => [
                'code'    => $errorCode,
                'details' => $details,
            ],
            'timestamp' => date('c'),
        ];

        return $this->response
            ->setStatusCode($statusCode)
            ->setJSON($payload);
    }

    /**
     * Helper khusus validasi input gagal (HTTP 422 Unprocessable Entity / HTTP 400).
     */
    protected function respondValidationErrors(array $errors, string $message = 'Validasi input gagal'): ResponseInterface
    {
        $formattedDetails = [];
        foreach ($errors as $field => $errMessage) {
            $formattedDetails[] = [
                'field'   => $field,
                'message' => $errMessage,
            ];
        }

        return $this->respondError(
            $message,
            ResponseInterface::HTTP_UNPROCESSABLE_ENTITY,
            'VALIDATION_ERROR',
            $formattedDetails
        );
    }

    /**
     * Helper respon Resource Tidak Ditemukan (HTTP 404 Not Found).
     */
    protected function respondNotFound(string $message = 'Data tidak ditemukan', string $errorCode = 'RESOURCE_NOT_FOUND'): ResponseInterface
    {
        return $this->respondError($message, ResponseInterface::HTTP_NOT_FOUND, $errorCode);
    }

    /**
     * Helper respon Akses Ditolak (HTTP 403 Forbidden).
     */
    protected function respondForbidden(string $message = 'Akses ditolak', string $errorCode = 'FORBIDDEN_ACCESS'): ResponseInterface
    {
        return $this->respondError($message, ResponseInterface::HTTP_FORBIDDEN, $errorCode);
    }

    /**
     * Helper respon Tidak Terotentikasi (HTTP 401 Unauthorized).
     */
    protected function respondUnauthorized(string $message = 'Sesi tidak valid atau telah kedaluwarsa', string $errorCode = 'UNAUTHORIZED'): ResponseInterface
    {
        return $this->respondError($message, ResponseInterface::HTTP_UNAUTHORIZED, $errorCode);
    }
}
```

### 3.2 Thin Controller Implementation Blueprint
Contoh implementasi controller tipis (`InvitationController`) yang hanya bertugas membaca request, memvalidasi form, memanggil service, dan merespons:

```php
<?php

namespace App\Controllers\Api\V1;

use App\Controllers\Api\BaseApiController;
use App\Services\InvitationService;
use CodeIgniter\HTTP\ResponseInterface;

class InvitationController extends BaseApiController
{
    protected InvitationService $invitationService;

    public function __construct()
    {
        $this->invitationService = new InvitationService();
    }

    public function create(): ResponseInterface
    {
        $rules = [
            'title'         => 'required|min_length[3]|max_length[150]',
            'templateId'    => 'required|is_natural_no_zero',
            'countdownDate' => 'required|valid_date[Y-m-d H:i:s]',
        ];

        if (!$this->validate($rules)) {
            return $this->respondValidationErrors($this->validator->getErrors());
        }

        $userId = service('authContext')->getUserId();
        $payload = $this->request->getJSON(true);

        try {
            $invitation = $this->invitationService->createInvitation($userId, $payload);
            return $this->respondCreated($invitation->toApiResponse(), 'Undangan berhasil dibuat');
        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), 400, 'INVALID_INPUT');
        } catch (\Throwable $e) {
            log_message('error', '[InvitationController::create] ' . $e->getMessage());
            return $this->respondError('Gagal memproses pembuatan undangan', 500, 'INTERNAL_SERVER_ERROR');
        }
    }
}
```

---

## 4. Models & Domain Entities (Idiomatic CI4 Pattern)

### 4.1 Standar Model CI4
Model CI4 mewarisi `CodeIgniter\Model`. Model dikonfigurasi dengan:
- Sanitasi ketat `$allowedFields` (mencegah *Mass Assignment Vulnerability*).
- Pemetaan otomatis ke Entity class (`$returnType = InvitationEntity::class`).
- Pengelolaan otomatis kolom `created_at`, `updated_at`, dan `deleted_at`.
- Callback model (misal `beforeInsert` untuk meng-generate UUID v4 `public_id`).

#### Contoh: `app/Models/InvitationModel.php`
```php
<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Entities\InvitationEntity;

class InvitationModel extends Model
{
    protected $table            = 'invitations';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = InvitationEntity::class;
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'public_id',
        'user_id',
        'slug',
        'title',
        'template_id',
        'is_published',
        'published_at',
        'countdown_date',
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['generatePublicId'];

    protected function generatePublicId(array $data): array
    {
        if (empty($data['data']['public_id'])) {
            $data['data']['public_id'] = 'inv_' . bin2hex(random_bytes(12));
        }
        return $data;
    }

    /**
     * Scope query untuk mencari berdasarkan public_id.
     */
    public function findByPublicId(string $publicId): ?InvitationEntity
    {
        return $this->where('public_id', $publicId)->first();
    }

    /**
     * Scope query untuk mencari berdasarkan slug aktif (publik).
     */
    public function findPublishedBySlug(string $slug): ?InvitationEntity
    {
        return $this->where('slug', $slug)
            ->where('is_published', 1)
            ->first();
    }
}
```

### 4.2 Standar Entity CI4 & Type Casting
Entity domain mewarisi `CodeIgniter\Entity\Entity`. Fitur utama yang dimanfaatkan:
- **`$casts`**: Konversi otomatis tipe kolom MySQL ke tipe data PHP:
  * Kolom boolean (`TINYINT(1)`) &rarr; `'boolean'` (`is_published`, `autoplay`, `is_checked_in`, `is_default`).
  * Kolom angka (`INT`, `BIGINT`) &rarr; `'integer'`.
  * Kolom harga (`DECIMAL(12,2)`) &rarr; `'float'`.
  * Kolom JSON (`includes_json`, `palette_json`, `assigned_categories_json`) &rarr; `'json-array'`.
- **`$dates`**: Konversi otomatis string tanggal MySQL menjadi objek `CodeIgniter\I18n\Time`.
- **Accessors & Mutators**: Method `get...()` dan `set...()` untuk enkapsulasi logika data.

#### Contoh: `app/Entities/InvitationEntity.php`
```php
<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;
use CodeIgniter\I18n\Time;

/**
 * @property int $id
 * @property string $public_id
 * @property int $user_id
 * @property string $slug
 * @property string $title
 * @property int $template_id
 * @property bool $is_published
 * @property Time|null $published_at
 * @property Time $countdown_date
 * @property Time $created_at
 * @property Time $updated_at
 * @property Time|null $deleted_at
 */
class InvitationEntity extends Entity
{
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
        'published_at',
        'countdown_date',
    ];

    protected $casts = [
        'id'           => 'integer',
        'user_id'      => 'integer',
        'template_id'  => 'integer',
        'is_published' => 'boolean',
    ];

    /**
     * Memeriksa apakah undangan sedang tayang aktif.
     */
    public function isLive(): bool
    {
        return $this->attributes['is_published'] === 1 || $this->attributes['is_published'] === true;
    }

    /**
     * Konversi representasi Entity ke format API response frontend (camelCase).
     */
    public function toApiResponse(): array
    {
        return [
            'id'            => $this->attributes['public_id'],
            'title'         => $this->attributes['title'],
            'slug'          => $this->attributes['slug'],
            'templateId'    => (int) $this->attributes['template_id'],
            'isPublished'   => (bool) $this->attributes['is_published'],
            'publishedAt'   => $this->published_at ? $this->published_at->toIso8601String() : null,
            'countdownDate' => $this->countdown_date ? $this->countdown_date->toIso8601String() : null,
            'createdAt'     => $this->created_at ? $this->created_at->toIso8601String() : null,
            'updatedAt'     => $this->updated_at ? $this->updated_at->toIso8601String() : null,
        ];
    }
}
```

---

## 5. Database Migrations & Seeders Architecture

### 5.1 Standar Migration CI4 (`CodeIgniter\Database\Migration`)
Semua tabel dibuat melalui class migration dengan memanfaatkan `$this->forge`.
- Menggunakan storage engine `InnoDB`.
- Karakter set `utf8mb4` dan collation `utf8mb4_unicode_ci`.
- Mendefinisikan *Foreign Key Constraints* eksplisit dengan `ON DELETE CASCADE` atau `ON DELETE RESTRICT`.

#### Contoh: `2026-11-06-000005_CreateInvitationsTable.php`
```php
<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateInvitationsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'BIGINT',
                'constraint'     => 20,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'public_id' => [
                'type'       => 'VARCHAR',
                'constraint' => 36,
            ],
            'user_id' => [
                'type'       => 'BIGINT',
                'constraint' => 20,
                'unsigned'   => true,
            ],
            'slug' => [
                'type'       => 'VARCHAR',
                'constraint' => 80,
            ],
            'title' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
            ],
            'template_id' => [
                'type'       => 'INT',
                'constraint' => 10,
                'unsigned'   => true,
            ],
            'is_published' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],
            'published_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'countdown_date' => [
                'type' => 'DATETIME',
            ],
            'created_at' => [
                'type'    => 'DATETIME',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP'),
            ],
            'updated_at' => [
                'type'    => 'DATETIME',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('public_id', 'uk_invitations_public_id');
        $this->forge->addUniqueKey('slug', 'uk_invitations_slug');
        $this->forge->addKey(['user_id', 'is_published'], false, 'idx_invitations_user_published');

        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE', 'fk_invitations_user');
        $this->forge->addForeignKey('template_id', 'templates', 'id', 'RESTRICT', 'CASCADE', 'fk_invitations_template');

        $this->forge->createTable('invitations', true, [
            'ENGINE'  => 'InnoDB',
            'COLLATE' => 'utf8mb4_unicode_ci',
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('invitations', true);
    }
}
```

### 5.2 Seeder Pattern (`CodeIgniter\Database\Seeder`)
Seeder digunakan untuk menginisialisasi 8 template master (*Boho Botanical*, *Modern Minimalist*, *Royal Islamic*, dll.) dan kategori tema.

#### Contoh: `TemplateSeeder.php`
```php
<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class TemplateSeeder extends Seeder
{
    public function run()
    {
        $templates = [
            [
                'code'                 => 'boho-botanical',
                'folder_id'            => 'undangan_1',
                'name'                 => 'Boho Botanical',
                'tagline'              => 'Aquarel hangat, dedaunan bergoyang, dan gate cover 3D.',
                'category_id'          => 1,
                'price'                => 0.00,
                'compare_at_price'     => null,
                'includes_json'        => json_encode([
                    'Gate cover 3D book flip',
                    'Animasi daun & bunga (wind sway)',
                    'Musik latar autoplay',
                    'Galeri, love story, amplop digital, RSVP',
                    '1 undangan · aktif tanpa batas',
                ]),
                'palette_json'         => json_encode([
                    'primary' => '#79624C',
                    'accent'  => '#8C735B',
                    'surface' => '#FAF7F2',
                    'ink'     => '#382E25',
                ]),
                'typography_json'      => json_encode([
                    'heading' => 'Cormorant Garamond',
                    'body'    => 'Archivo',
                ]),
                'ornament_description' => 'Botanical bouquet, pampas, monstera, anggrek',
                'preview_image'        => '/template/undangan_1/img/foto_mempelai_dummy.jpg',
                'demo_slug'            => 'raka-sinta',
                'status'               => 'available',
                'badge'                => 'Populer',
                'sort_order'           => 1,
            ],
            // 7 template lainnya (undangan_2 s.d. undangan_8)...
        ];

        $this->db->table('templates')->insertBatch($templates);
    }
}
```

---

## 6. HTTP Filters & Security Infrastructure

Sistem menerapkan 4 filter HTTP pada pipa perantara (*request lifecycle*):

### 6.1 JwtAuthFilter (`app/Filters/JwtAuthFilter.php`)
- Mengekstrak header HTTP `Authorization: Bearer <token>`.
- Mendekode payload JWT menggunakan library `firebase/php-jwt` dengan secret key dari file konfigurasi `app/Config/JWT.php`.
- Menemukan entitas pengguna aktif di `UserModel`.
- Memvalidasi bahwa status akun adalah `ACTIVE`.
- Mendaftarkan user yang terotentikasi ke **Auth Context Service Singleton** (`service('authContext')->setUser($user)`), sehingga dapat diakses secara aman di seluruh controller tanpa ketergantungan pada *dynamic property* PHP 8.2+.

```php
<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\UserModel;

class JwtAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getServer('HTTP_AUTHORIZATION') ?? $request->getHeaderLine('Authorization');
        if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'success'   => false,
                    'message'   => 'Token otentikasi tidak ditemukan',
                    'error'     => ['code' => 'UNAUTHORIZED_NO_TOKEN'],
                    'timestamp' => date('c'),
                ]);
        }

        $token = $matches[1];
        $jwtConfig = config('JWT');

        try {
            $decoded = JWT::decode($token, new Key($jwtConfig->secretKey, $jwtConfig->algorithm));
            $userModel = new UserModel();
            $user = $userModel->find($decoded->sub);

            if (!$user || $user->status !== 'ACTIVE') {
                return service('response')
                    ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                    ->setJSON([
                        'success'   => false,
                        'message'   => 'Sesi pengguna tidak valid atau akun dinonaktifkan',
                        'error'     => ['code' => 'UNAUTHORIZED_INVALID_ACCOUNT'],
                        'timestamp' => date('c'),
                    ]);
            }

            // Daftarkan user ke AuthContext singleton
            service('authContext')->setUser($user);

        } catch (\Throwable $e) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'success'   => false,
                    'message'   => 'Sesi telah kedaluwarsa atau token tidak valid',
                    'error'     => ['code' => 'UNAUTHORIZED_EXPIRED_TOKEN'],
                    'timestamp' => date('c'),
                ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No post-processing needed
    }
}
```

### 6.2 InvitationOwnerFilter — Anti-IDOR Guard (`app/Filters/InvitationOwnerFilter.php`)
Filter ini mengamankan seluruh rute di bawah `api/v1/invitations/(:segment)/...` dari kerentanan **Insecure Direct Object Reference (IDOR)**:
1. Membaca parameter segmen `invitation_id` (baik `public_id` seperti `inv_9f8a...` maupun integer ID).
2. Memeriksa keberadaan undangan di basis data.
3. Memastikan bahwa `invitation.user_id === authContext.getUserId()`.
4. Jika bukan milik user yang sedang login, request langsung dihentikan dengan **HTTP 403 Forbidden**.
5. Jika valid, objek `$invitation` disimpan di `service('invitationContext')->setInvitation($invitation)` sehingga downstream controller **tidak perlu melakukan query select ulang ke database**.

```php
<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\InvitationModel;

class InvitationOwnerFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $uri = $request->getUri();
        // Segment 4 pada /api/v1/invitations/{invitationId}/...
        $invitationPublicId = $uri->getSegment(4);

        if (empty($invitationPublicId)) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                ->setJSON([
                    'success'   => false,
                    'message'   => 'Identifier undangan wajib disertakan',
                    'error'     => ['code' => 'MISSING_INVITATION_IDENTIFIER'],
                    'timestamp' => date('c'),
                ]);
        }

        $invitationModel = new InvitationModel();
        $invitation = $invitationModel->findByPublicId($invitationPublicId);

        if (!$invitation) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND)
                ->setJSON([
                    'success'   => false,
                    'message'   => 'Undangan tidak ditemukan',
                    'error'     => ['code' => 'INVITATION_NOT_FOUND'],
                    'timestamp' => date('c'),
                ]);
        }

        $currentUserId = service('authContext')->getUserId();
        if ($invitation->user_id !== $currentUserId) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_FORBIDDEN)
                ->setJSON([
                    'success'   => false,
                    'message'   => 'Anda tidak memiliki hak akses untuk mengubah undangan ini',
                    'error'     => ['code' => 'FORBIDDEN_RESOURCE_ACCESS'],
                    'timestamp' => date('c'),
                ]);
        }

        // Simpan objek undangan yang telah terverifikasi ke context
        service('invitationContext')->setInvitation($invitation);
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}
```

### 6.3 CORS Filter & Native CI4 4.4+ Configuration
CI4 4.4+ menyediakan integrasi native CORS melalui `app/Config/Cors.php`:

```php
<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Cors extends BaseConfig
{
    public array $default = [
        'allowedOrigins'         => ['http://localhost:3000', 'https://infomase.id', 'https://www.infomase.id'],
        'allowedOriginsPatterns' => [],
        'supportsCredentials'    => true,
        'allowedHeaders'         => ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
        'exposedHeaders'         => ['Content-Disposition'],
        'allowedMethods'         => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        'maxAge'                 => 7200,
    ];
}
```

### 6.4 Registrasi Filter (`app/Config/Filters.php`)
```php
<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Filters\CSRF;
use CodeIgniter\Filters\DebugToolbar;
use CodeIgniter\Filters\Honeypot;
use CodeIgniter\Filters\InvalidChars;
use CodeIgniter\Filters\SecureHeaders;
use CodeIgniter\Filters\CorsFilter;
use App\Filters\JwtAuthFilter;
use App\Filters\InvitationOwnerFilter;
use App\Filters\RateLimiterFilter;

class Filters extends BaseConfig
{
    public array $aliases = [
        'csrf'           => CSRF::class,
        'toolbar'        => DebugToolbar::class,
        'honeypot'       => Honeypot::class,
        'invalidchars'   => InvalidChars::class,
        'secureheaders'  => SecureHeaders::class,
        'cors'           => CorsFilter::class,
        'jwt_auth'       => JwtAuthFilter::class,
        'resource_owner' => InvitationOwnerFilter::class,
        'rate_limiter'   => RateLimiterFilter::class,
    ];

    public array $globals = [
        'before' => [
            'cors',
        ],
        'after' => [
            'toolbar',
        ],
    ];
}
```

---

## 7. Service Layer & Atomic Transactions

### 7.1 Mengapa Service Layer Wajib?
Service Layer bertanggung jawab atas:
1. **Koordinasi Transaksi Database (ACID)**: Menjamin bahwa operasi pembuatan undangan baru selalu menginsert record default ke tabel `invitations`, `invitation_couples`, dan `invitation_events` secara atomik. Jika salah satu gagal, seluruh transaksi di-rollback secara otomatis.
2. **Validasi Aturan Bisnis (*Business Invariants*)**: Memeriksa lisensi aktif sebelum mengizinkan tombol "Tayangkan", menghitung safety buffer katering, memastikan slug tidak duplikat.
3. **Penyembunyian ID Internal**: Mengonversi `public_id` publik ke `id` internal integer untuk operasi relasional yang cepat.

### 7.2 Transaksi Database Idiomatik CI4
CI4 menyediakan dua cara menangani transaksi:
- **Pendekatan A: Strict Exception Transactions (CI4 4.3+)**:
  ```php
  $db->transException(true)->transStart();
  // ... operasi query model ...
  $db->transComplete();
  ```
  Jika terjadi kegagalan atau query error, CI4 langsung melempar `CodeIgniter\Database\Exceptions\DatabaseException` dan me-rollback transaksi.
- **Pendekatan B: Manual Transactions dengan Try-Catch**:
  Sangat ideal ketika ada proses non-database (misal upload berkas atau generate file QR) yang harus dibatalkan jika operasi gagal:

```php
<?php

namespace App\Services;

use Config\Database;
use App\Models\InvitationModel;
use App\Models\CoupleModel;
use App\Models\EventModel;
use App\Entities\InvitationEntity;
use CodeIgniter\Database\Exceptions\DatabaseException;

class InvitationService
{
    protected InvitationModel $invitationModel;
    protected CoupleModel $coupleModel;
    protected EventModel $eventModel;

    public function __construct()
    {
        $this->invitationModel = new InvitationModel();
        $this->coupleModel     = new CoupleModel();
        $this->eventModel      = new EventModel();
    }

    /**
     * Membuat draft undangan baru beserta record pasangan dan acara perdana secara atomik.
     */
    public function createInvitation(int $userId, array $data): InvitationEntity
    {
        $db = Database::connect();
        $db->transBegin();

        try {
            // 1. Generate & pastikan keunikan slug
            $baseSlug = url_title($data['title'], '-', true);
            $finalSlug = $this->resolveUniqueSlug($baseSlug);

            // 2. Simpan entitas utama Undangan
            $invitation = new InvitationEntity([
                'user_id'        => $userId,
                'slug'           => $finalSlug,
                'title'          => $data['title'],
                'template_id'    => (int) $data['templateId'],
                'is_published'   => 0,
                'countdown_date' => $data['countdownDate'],
            ]);

            $invitationId = $this->invitationModel->insert($invitation, true);
            if (!$invitationId) {
                throw new DatabaseException('Gagal menyimpan entitas undangan: ' . json_encode($this->invitationModel->errors()));
            }

            // 3. Simpan record default Profil Mempelai
            $this->coupleModel->insert([
                'invitation_id'   => $invitationId,
                'groom_name'      => 'Mempelai Pria',
                'groom_full_name' => 'Nama Lengkap Pria',
                'bride_name'      => 'Mempelai Wanita',
                'bride_full_name' => 'Nama Lengkap Wanita',
            ]);

            // 4. Simpan record default Acara Utama (Akad / Resepsi)
            $this->eventModel->insert([
                'public_id'     => 'evt_' . bin2hex(random_bytes(8)),
                'invitation_id' => $invitationId,
                'title'         => 'Akad Nikah',
                'event_date'    => date('Y-m-d', strtotime($data['countdownDate'])),
                'start_time'    => '08:00:00',
                'end_time'      => '10:00:00',
                'timezone'      => 'WIB',
                'location_name' => 'Masjid / Gedung Pertemuan',
                'address'       => 'Jl. Contoh Alamat Pernikahan No. 1',
                'sort_order'    => 1,
            ]);

            if ($db->transStatus() === false) {
                $db->transRollback();
                throw new DatabaseException('Status transaksi database gagal dieksekusi');
            }

            $db->transCommit();
            return $this->invitationModel->find($invitationId);

        } catch (\Throwable $e) {
            $db->transRollback();
            throw $e;
        }
    }

    /**
     * Otomasi penomoran suffix slug jika terjadi benturan nama (misal: raka-sinta, raka-sinta-2).
     */
    protected function resolveUniqueSlug(string $baseSlug): string
    {
        $slug = $baseSlug;
        $counter = 2;

        while ($this->invitationModel->where('slug', $slug)->countAllResults() > 0) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
```

### 7.3 Publish Guard & LicenceService
Sebelum sebuah undangan diubah statusnya menjadi tayang publik (`is_published = 1`), `LicenceService::assertCanPublish()` memastikan:
1. Jika template berharga Rp 0 (`price == 0`), publikasi diizinkan seketika.
2. Jika template berbayar (`price > 0`), sistem memverifikasi keberadaan baris pada tabel `template_licences` dengan status permanen (*perpetual*). Jika belum dibeli, server melempar exception bertipe `LICENCE_REQUIRED`.

```php
<?php

namespace App\Services;

use App\Models\InvitationModel;
use App\Models\TemplateModel;
use App\Models\TemplateLicenceModel;

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
            return false;
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

## 8. File Upload & Media Storage Strategy

### 8.1 CI4 Upload API & Image Processing
Semua proses unggah berkas (foto profil mempelai, galeri prewedding, bukti QRIS, dan lagu latar MP3) dikelola melalui service `MediaService`.

Aturan pengamanan unggah berkas:
1. **Validasi MIME Type Murni**: Memeriksa file signature (magic bytes), bukan sekadar ekstensi file.
2. **Pengacakan Nama Berkas**: Menggunakan `$file->getRandomName()` untuk mencegah *Path Traversal* dan penimpaan file sengaja.
3. **Kompresi & Resize Otomatis**: Foto berukuran besar di-downscale menggunakan pustaka `CodeIgniter\Images\Handlers\GDHandler` ke batas resolusi optimal (maksimal 1600px) untuk mempercepat loading tamu di jaringan seluler.
4. **Isolasi Folder**: Berkas foto ditempatkan pada `public/uploads/photos/`, QRIS pada `public/uploads/qris/`, dan audio pada `public/uploads/audio/`.

#### Contoh: `MediaService.php`
```php
<?php

namespace App\Services;

use CodeIgniter\HTTP\Files\UploadedFile;
use Config\Services;

class MediaService
{
    /**
     * Menyimpan dan mengoptimasi foto tunggal.
     */
    public function storePhoto(UploadedFile $file, string $subfolder = 'photos'): string
    {
        if (!$file->isValid() || $file->hasMoved()) {
            throw new \RuntimeException($file->getErrorString());
        }

        $uploadPath = FCPATH . 'uploads/' . $subfolder;
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        $randomName = $file->getRandomName();
        $file->move($uploadPath, $randomName);

        $targetFilePath = $uploadPath . '/' . $randomName;

        // Optimasi & resize gambar jika melebihi 1600px menggunakan CI4 Image Service
        try {
            Services::image('gd')
                ->withFile($targetFilePath)
                ->resize(1600, 1600, true, 'height')
                ->save($targetFilePath, 85);
        } catch (\Throwable $e) {
            log_message('warning', '[MediaService] Gagal me-resize foto: ' . $e->getMessage());
        }

        return base_url("uploads/{$subfolder}/{$randomName}");
    }
}
```

---

## 9. Comprehensive Routing Architecture (`app/Config/Routes.php`)

Seluruh rute dikelompokkan dengan namespace `App\Controllers\Api\V1`, terlindungi filter CORS global, dan dipetakan 100% selaras dengan `docs/API_SPECIFICATION.md`:

```php
<?php

namespace Config;

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->group('api/v1', ['namespace' => 'App\Controllers\Api\V1', 'filter' => 'cors'], static function ($routes) {

    // ---------------------------------------------------- 1. OTENTIKASI & KATALOG PUBLIK
    $routes->post('auth/register', 'AuthController::register', ['filter' => 'rate_limiter:auth']);
    $routes->post('auth/login', 'AuthController::login', ['filter' => 'rate_limiter:auth']);
    $routes->post('auth/refresh-token', 'AuthController::refreshToken');
    $routes->get('templates', 'TemplateController::index');
    $routes->get('templates/(:segment)', 'TemplateController::show/$1');

    // ---------------------------------------------------- 2. HALAMAN TAMU PUBLIK (READ-HEAVY)
    $routes->group('public', ['filter' => 'rate_limiter:public'], static function ($routes) {
        $routes->get('invitations/(:segment)', 'PublicInvitationController::show/$1');
        $routes->post('invitations/(:segment)/rsvp', 'PublicInvitationController::submitRsvp/$1');
        $routes->get('invitations/(:segment)/wishes', 'PublicInvitationController::getWishes/$1');
    });

    // ---------------------------------------------------- 3. KONSOL PENGGUNA TERAUTENTIKASI (JWT)
    $routes->group('', ['filter' => 'jwt_auth'], static function ($routes) {
        // Sesi Profil
        $routes->get('auth/me', 'AuthController::me');
        $routes->post('auth/logout', 'AuthController::logout');

        // Ringkasan Dashboard
        $routes->get('dashboard/summary', 'DashboardController::summary');

        // Pengelolaan Undangan Utama
        $routes->get('invitations', 'InvitationController::index');
        $routes->post('invitations', 'InvitationController::create');
        $routes->get('invitations/check-slug', 'InvitationController::checkSlug');

        // Monetisasi, Pesanan & Lisensi
        $routes->post('orders/checkout', 'OrderController::checkout');
        $routes->get('orders', 'OrderController::index');
        $routes->get('orders/(:segment)', 'OrderController::show/$1');
        $routes->get('licences', 'OrderController::licences');

        // ------------------------------------------------ 4. SCOPED INVITATION (ANTI-IDOR GUARD)
        $routes->group('invitations/(:segment)', ['filter' => 'resource_owner'], static function ($routes) {
            // Operasi Induk Undangan
            $routes->get('', 'InvitationController::show/$1');
            $routes->put('', 'InvitationController::update/$1');
            $routes->delete('', 'InvitationController::delete/$1');
            $routes->patch('publish', 'InvitationController::togglePublish/$1');
            $routes->post('duplicate', 'InvitationController::duplicate/$1');
            $routes->get('stats', 'InvitationController::stats/$1');

            // Sub-Seksi Konten Studio
            $routes->put('couple', 'ContentController::updateCouple/$1');
            $routes->put('events', 'ContentController::updateEvents/$1');
            $routes->put('quote', 'ContentController::updateQuote/$1');
            $routes->put('stories', 'ContentController::updateStories/$1');
            $routes->put('gallery', 'ContentController::updateGallery/$1');
            $routes->put('gift-data', 'ContentController::updateGiftData/$1');
            $routes->put('music', 'ContentController::updateMusic/$1');

            // Pengunggahan Berkas Media
            $routes->post('upload/photo', 'MediaController::uploadPhoto/$1');
            $routes->post('upload/gallery-batch', 'MediaController::uploadGalleryBatch/$1');
            $routes->post('upload/audio', 'MediaController::uploadAudio/$1');
            $routes->delete('assets', 'MediaController::deleteAsset/$1');

            // Manajemen Buku Tamu & WhatsApp
            $routes->get('guests', 'GuestController::index/$1');
            $routes->post('guests', 'GuestController::create/$1');
            $routes->post('guests/bulk', 'GuestController::bulkCreate/$1');
            $routes->put('guests/(:segment)', 'GuestController::update/$1/$2');
            $routes->delete('guests/(:segment)', 'GuestController::delete/$1/$2');
            $routes->get('guests/(:segment)/wa-message', 'GuestController::waMessage/$1/$2');
            $routes->patch('guests/(:segment)/check-in', 'GuestController::checkIn/$1/$2');
            $routes->get('wa-templates', 'GuestController::getWaTemplates/$1');
            $routes->put('wa-templates', 'GuestController::updateWaTemplates/$1');

            // Rekap RSVP & Operasional Hari-H
            $routes->get('rsvps', 'RsvpController::index/$1');
            $routes->delete('rsvps/(:segment)', 'RsvpController::delete/$1/$2');
            $routes->get('rsvps/export', 'RsvpController::exportCsv/$1');
        });
    });
});
```

---

## 10. High-Traffic Caching & Performance Tuning

Pada saat undangan viral disebarkan via pesan broadcast WhatsApp, ratusan hingga ribuan tamu dapat mengakses tautan `/invite/:slug` secara simultan dalam hitungan menit. Untuk menjaga kestabilan backend:

1. **Output Caching pada Public Invitation**:
   - Respon endpoint `GET /api/v1/public/invitations/(:segment)` di-cache menggunakan cache driver CI4 (Redis pada production atau File cache berkinerja tinggi) dengan TTL **10 menit**.
   - Kunci cache: `cache_public_invitation_{slug}`.
   - **Invalidasi Instan (*Cache Invalidation on Write*)**: Setiap kali pemilik undangan melakukan penyimpanan konten di studio (`ContentController` atau `InvitationController::update`), cache slug bersangkutan langsung dihapus (`cache()->delete(...)`).
2. **Asynchronous Visitor Logging**:
   - Endpoint publik tidak melakukan insert synchronous yang membebani query utama.
   - Pengunjung dicatat secara cepat atau diagregasikan ke buffer sebelum di-flush ke tabel `invitation_visitor_logs`.
3. **Optimasi Buffer Pool & Indeks Komposit MySQL**:
   - Seluruh query publik tamu hanya menyentuh kolom yang tercakup dalam indeks komposit:
     * `invitations(slug, is_published)`
     * `invitation_events(invitation_id, event_date)`
     * `invitation_galleries(invitation_id, sort_order)`
     * `invitation_rsvps(invitation_id, created_at DESC)`
   - Karena struktur 3NF ramping tanpa data redundancy, indeks-indeks ini termuat sepenuhnya dalam *InnoDB Buffer Pool* RAM server.

---

## 11. Security Checklist & Production Hardening

| Area Keamanan | Standar Penerapan CodeIgniter 4 | Status |
|---|---|---|
| **SQL Injection** | Menggunakan Query Builder CI4 dengan parameter binding otomatis di seluruh Model. Tidak ada raw concatenation string. | Diwajibkan |
| **Cross-Site Scripting (XSS)** | Sanitasi output HTML dengan helper `esc()` untuk data buku tamu publik; Content Security Policy (CSP) aktif. | Diwajibkan |
| **IDOR Protection** | Seluruh child-endpoint dilindungi filter `InvitationOwnerFilter` yang mengecek kecocokan `user_id` pemilik vs JWT sub. | Diwajibkan |
| **CORS Preflight** | Native CI4 `CorsFilter` hanya mengizinkan origin resmi frontend Next.js. | Diwajibkan |
| **Mass Assignment** | Model mengunci kolom dengan `$allowedFields` eksplisit di setiap entitas. | Diwajibkan |
| **Rate Limiting** | Endpoint publik dibatasi 60 req/menit dan otentikasi login/register dibatasi 10 req/menit per IP. | Diwajibkan |
| **Upload Execution** | Direktori `public/uploads` dilindungi rule Apache/Nginx yang menolak eksekusi script `.php`, `.phtml`, atau `.sh`. | Diwajibkan |
