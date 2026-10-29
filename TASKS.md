# Daftar Task & Verifikasi Kode (Git Status)

Berikut adalah daftar pekerjaan (*tasks*) yang telah selesai dikerjakan beserta bukti verifikasi baris per baris (*proof line by line*) berdasarkan `git status`.

---

## 1. Ringkasan List Task (`<work><why?>`)

- Membuat route API proxy Next.js agar request ke backend tidak terhalang isu CORS dan warning browser ngrok
- Menyusun dokumentasi spesifikasi REST API agar integrasi kontrak endpoint backend jelas dan terdata
- Menyesuaikan client API dan normalisasi payload status RSVP agar format data attendance dan pax cocok dengan skema backend
- Menambahkan tipe data UserSubscription agar struktur paket langganan dan kuota akun terdefinisi dengan jelas
- Mengimplementasikan state subscription dan simulasi masa aktif akun di AuthContext agar status langganan dapat dipantau langsung
- Memperbarui tipe data template dan ornamen agar mendukung identitas 10 tema baru
- Menyediakan dataset dan metadata lengkap untuk 10 tema template agar katalog desain undangan terisi penuh
- Menambahkan fungsi buat, duplikasi salinan, dan hapus multi-undangan di store agar user dapat mengelola banyak undangan sekaligus
- Menerapkan subscription guard pada fungsi toggle publish di store agar undangan tidak bisa dipublikasikan jika masa aktif akun expired
- Menambahkan tab filter kategori dan search input di TemplatePicker agar user mudah mencari dan memfilter tema undangan
- Memperbaiki syntax error penutup JSX ternary pada TemplatePicker agar proses compile build aplikasi berhasil
- Memperbarui katalog showcase tema di landing page agar selaras menampilkan 10 tema baru
- Menyesuaikan link navigasi pada navbar landing page agar mengarah langsung ke katalog template
- Menambahkan variabel warna CSS untuk 10 tema agar styling visual konsisten di setiap halaman tema
- Membuat komponen ornamen visual SVG kustom khas daerah agar tema memiliki dekorasi budaya seperti gunungan dan siger
- Menyesuaikan teks salam adat dan bingkai foto pada amplop cover agar tampil dinamis sesuai tema yang dipilih tamu
- Mengintegrasikan ornamen dan class CSS tema pada renderer undangan agar visual tema aktif tampil utuh
- Menyesuaikan pembacaan data undangan berdasarkan slug di halaman publik agar tamu melihat data undangan yang tepat
- Menambahkan input nomor HP tamu dan tombol kirim direct WhatsApp agar link undangan personal bisa langsung dikirim via chat
- Menghubungkan fungsi hapus RSVP ke backend API agar penghapusan data kehadiran tersinkronisasi ke database server
- Merombak dashboard utama dengan memisahkan konsol daftar undangan dan editor studio agar alur kerja pengelolaan lebih teratur
- Menambahkan modal buat undangan baru serta modal peringatan upgrade akun agar user dapat menambah undangan dan mengetahui batas kuota
- Menyesuaikan font dan metadata global pada root layout agar tipografi seluruh aplikasi konsisten

---

## 2. Verifikasi Baris per Baris (Line by Line with Proof)

### 1. Route API Proxy Next.js
- **Task:** Membuat route API proxy Next.js agar request ke backend tidak terhalang isu CORS dan warning browser ngrok
- **File:** `src/app/api/proxy/[...path]/route.ts` (Lines 45-56)
- **Bukti Kode:**
```typescript
const headers: Record<string, string> = {
  Accept: 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

const authHeader = req.headers.get('authorization');
if (authHeader) headers['Authorization'] = authHeader;
```

---

### 2. Dokumentasi Spesifikasi REST API
- **Task:** Menyusun dokumentasi spesifikasi REST API agar integrasi kontrak endpoint backend jelas dan terdata
- **File:** `LIST_API.txt` (Lines 6-16)
- **Bukti Kode:**
```text
[1] BASE URL & HEADERS
Base URL (Ngrok)     : https://elvin-affectional-edwardo.ngrok-free.dev/wedding_digital/api/v1
Headers Standar:
- Authorization: Bearer <ACCESS_TOKEN>  (Wajib untuk endpoint non-public)
- ngrok-skip-browser-warning: true      (Wajib jika menggunakan tunneling ngrok)
```

---

### 3. Normalisasi Payload RSVP di API Client
- **Task:** Menyesuaikan client API dan normalisasi payload status RSVP agar format data attendance dan pax cocok dengan skema backend yg baru
- **File:** `src/lib/api.ts` (Lines 548-562)
- **Bukti Kode:**
```typescript
const attUpper = (payload.attendance || 'HADIR').toUpperCase();
const normalizedAttendance =
  attUpper === 'HADIR' ? 'HADIR' : attUpper === 'TIDAK' || attUpper === 'TIDAK_HADIR' ? 'TIDAK_HADIR' : 'RAGU';
const finalPax = payload.totalPax ?? payload.pax ?? 1;

const body = {
  guestName: payload.guestName,
  attendance: normalizedAttendance,
  totalPax: finalPax,
  pax: finalPax,
  message: payload.message,
  guestCode: payload.guestCode || '',
};
```

---

### 4. Tipe Data UserSubscription
- **Task:** Menambahkan tipe data UserSubscription agar struktur paket langganan dan kuota akun terdefinisi dengan jelas
- **File:** `src/types/auth.ts` (Lines 1-9)
- **Bukti Kode:**
```typescript
export interface UserSubscription {
  plan: 'free' | 'pro' | 'vip';
  planName: string;
  status: 'active' | 'expired';
  expiresAt: string;
  daysRemaining: number;
  maxInvitations: number;
  canPublish: boolean;
}
```

---

### 5. State Subscription & Simulasi Expired
- **Task:** Mengimplementasikan state subscription dan simulasi masa aktif akun di AuthContext agar status langganan dapat dipantau langsung
- **File:** `src/lib/authContext.tsx` (Lines 87-105)
- **Bukti Kode:**
```typescript
const toggleSubscriptionSimulation = useCallback((forcedStatus?: 'active' | 'expired') => {
  setSubscriptionState((prev) => {
    const nextStatus = forcedStatus || (prev.status === 'active' ? 'expired' : 'active');
    const updated: UserSubscription = {
      ...prev,
      status: nextStatus,
      canPublish: nextStatus === 'active',
      daysRemaining: nextStatus === 'active' ? 30 : 0,
    };
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  });
}, []);
```

---

### 6. Pembaruan Tipe Data Tema & Ornamen
- **Task:** Memperbarui tipe data template dan ornamen agar mendukung identitas 10 tema baru
- **File:** `src/types/invitation.ts` (Lines 1-15)
- **Bukti Kode:**
```typescript
export type TemplateId =
  | 'rustic'
  | 'royal-gold'
  | 'islamic'
  | 'sakura'
  | 'modern-minimalist'
  | 'jawa-keraton'
  | 'sunda-siger'
  | 'celestial-starry'
  | 'terracotta-boho'
  | 'neo-glassmorphism';
```

---

### 7. Dataset & Metadata 10 Tema Undangan
- **Task:** Menyediakan dataset dan metadata lengkap untuk 10 tema template agar katalog desain undangan terisi penuh
- **File:** `src/lib/defaultData.ts` (Lines 70-105)
- **Bukti Kode:**
```typescript
{
  id: 'jawa-keraton',
  name: 'Jawa Klasik Keraton',
  category: 'Tradisional Nusantara',
  themeColor: '#3e2723',
  accentColor: '#b45309',
  description: 'Kemegahan adat keraton Jawa dengan ornamen gunungan wayang kulit, aksara Jawa, dan motif batik klasik sogan.',
  ornament: 'Gunungan Wayang & Motif Batik Parang',
}
```

---

### 8. Fitur Multi-Undangan (CRUD & Duplikasi)
- **Task:** Menambahkan fungsi buat, duplikasi salinan, dan hapus multi-undangan di store agar user dapat mengelola banyak undangan sekaligus
- **File:** `src/lib/invitationStore.ts` (Lines 40-65)
- **Bukti Kode:**
```typescript
const duplicated: InvitationData = {
  ...source,
  id: copyId,
  slug: copySlug,
  title: `${source.title} (Salinan)`,
  isPublished: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  rsvpList: [],
};
const updatedList = [duplicated, ...invitations];
saveInvitationsList(updatedList, copyId);
```

---

### 9. Subscription Guard pada Fungsi Publish
- **Task:** Menerapkan subscription guard pada fungsi toggle publish di store agar undangan tidak bisa dipublikasikan jika masa aktif akun expired
- **File:** `src/lib/invitationStore.ts` (Lines 85-100)
- **Bukti Kode:**
```typescript
// RULE ENFORCEMENT: If subscription is expired, user CANNOT publish!
if (willPublish && !canPublish) {
  return {
    success: false,
    error: 'SUBSCRIPTION_EXPIRED',
  };
}
```

---

### 10. Filter Kategori & Search Input Template
- **Task:** Menambahkan tab filter kategori dan search input di TemplatePicker agar user mudah mencari dan memfilter tema undangan
- **File:** `src/components/dashboard/TemplatePicker.tsx` (Lines 36-45)
- **Bukti Kode:**
```typescript
const filteredTemplates = templateList.filter((tmpl) => {
  const matchesCategory = activeCategory === 'all' || tmpl.category === activeCategory;
  const matchesSearch =
    !search.trim() ||
    tmpl.name.toLowerCase().includes(search.toLowerCase()) ||
    tmpl.description.toLowerCase().includes(search.toLowerCase()) ||
    (tmpl.styleTag && tmpl.styleTag.toLowerCase().includes(search.toLowerCase())) ||
    (tmpl.ornament && tmpl.ornament.toLowerCase().includes(search.toLowerCase()));
  return matchesCategory && matchesSearch;
});
```

---

### 11. Perbaikan Syntax Penutup JSX
- **Task:** Memperbaiki syntax error penutup JSX ternary pada TemplatePicker agar proses compile build aplikasi berhasil
- **File:** `src/components/dashboard/TemplatePicker.tsx` (Lines 255-260)
- **Bukti Kode:**
```typescript
        })}
      </div>
      )}
    </div>
  );
```

---

### 12. Katalog Showcase di Landing Page
- **Task:** Memperbarui katalog showcase tema di landing page agar selaras menampilkan 10 tema baru
- **File:** `src/components/landing/TemplateShowcase.tsx` (Lines 25-40)
- **Bukti Kode:**
```typescript
const [activeCategory, setActiveCategory] = useState<string>('all');
const filteredTemplates = AVAILABLE_TEMPLATES.filter(
  (tmpl) => activeCategory === 'all' || tmpl.category === activeCategory
);
```

---

### 13. Navigasi Navbar ke Showcase
- **Task:** Menyesuaikan link navigasi pada navbar landing page agar mengarah langsung ke katalog template
- **File:** `src/components/landing/Navbar.tsx` (Lines 35-42)
- **Bukti Kode:**
```typescript
<a href="#templates" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
  Katalog Desain
</a>
```

---

### 14. Variabel CSS untuk 10 Tema
- **Task:** Menambahkan variabel warna CSS untuk 10 tema agar styling visual konsisten di setiap halaman tema
- **File:** `src/app/globals.css` (Lines 433-450)
- **Bukti Kode:**
```css
.theme-jawa-keraton {
  --inv-bg: #fefce8;
  --inv-bg-alt: #fef3c7;
  --inv-primary: #3e2723;
  --inv-accent: #b45309;
  --inv-text: #3e2723;
  --inv-text-muted: #78350f;
  --inv-card: #fffbeb;
  --inv-border: #ca8a0450;
  font-family: var(--font-serif), Georgia, serif;
}
```

---

### 15. Komponen SVG Ornamen Kustom Tema
- **Task:** Membuat komponen ornamen visual SVG kustom khas daerah agar tema memiliki dekorasi budaya seperti gunungan dan siger
- **File:** `src/components/invitation/TemplateOrnaments.tsx` (Lines 65-85)
- **Bukti Kode:**
```typescript
case 'jawa-keraton':
  // Gunungan Wayang Kulit Khas Jawa
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <svg width={size * 1.3} height={size * 1.5} viewBox="0 0 100 130" fill="none">
        <path d="M50 5C45 25 20 50 15 85C10 110 30 120 50 120C70 120 90 110 85 85C80 50 55 25 50 5Z" stroke="#b45309" strokeWidth="2" />
      </svg>
    </div>
  );
```

---

### 16. Salam Adat & Frame Amplop Dinamis
- **Task:** Menyesuaikan teks salam adat dan bingkai foto pada amplop cover agar tampil dinamis sesuai tema yang dipilih tamu
- **File:** `src/components/invitation/EnvelopeCover.tsx` (Lines 90-105)
- **Bukti Kode:**
```typescript
<span style={{ fontSize: '0.76rem', color: 'var(--inv-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block' }}>
  {data.templateId === 'jawa-keraton'
    ? 'Katur Dhumateng Panjenenganipun'
    : data.templateId === 'sunda-siger'
    ? 'Katur Ka Pangersa'
    : 'Kepada Yth. Bapak/Ibu/Saudara/i'}
</span>
```

---

### 17. Integrasi Renderer Tema Undangan
- **Task:** Mengintegrasikan ornamen dan class CSS tema pada renderer undangan agar visual tema aktif tampil utuh
- **File:** `src/components/invitation/InvitationRenderer.tsx` (Lines 38-58)
- **Bukti Kode:**
```typescript
case 'jawa-keraton':
  return 'theme-jawa-keraton';
case 'sunda-siger':
  return 'theme-sunda-siger';
case 'celestial-starry':
  return 'theme-celestial-starry';
case 'terracotta-boho':
  return 'theme-terracotta-boho';
case 'neo-glassmorphism':
  return 'theme-neo-glassmorphism';
```

---

### 18. Routing Multi-Undangan Public Page
- **Task:** Menyesuaikan pembacaan data undangan berdasarkan slug di halaman publik agar tamu melihat data undangan yang tepat
- **File:** `src/app/invite/[slug]/page.tsx` (Lines 35-55)
- **Bukti Kode:**
```typescript
const localMatch = getInvitationBySlug(slug);
if (localMatch) {
  setInvitation(localMatch);
}
```

---

### 19. Nomor HP & Tombol Direct Kirim WA Tamu
- **Task:** Menambahkan input nomor HP tamu dan tombol kirim direct WhatsApp agar link undangan personal bisa langsung dikirim via chat
- **File:** `src/components/dashboard/GuestManager.tsx` (Lines 230-243)
- **Bukti Kode:**
```typescript
{guest.phone && (
  <a
    href={`https://api.whatsapp.com/send?phone=${guest.phone.replace(/^0/, '62').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(generateWhatsAppMessage(guest.name))}`}
    target="_blank"
    rel="noreferrer"
    className="btn btn-sm btn-gold"
  >
    <MessageCircle size={13} />
    Kirim WA
  </a>
)}
```

---

### 20. Hapus Data RSVP ke Backend API
- **Task:** Menghubungkan fungsi hapus RSVP ke backend API agar penghapusan data kehadiran tersinkronisasi ke database server
- **File:** `src/components/dashboard/RSVPManager.tsx` (Lines 16-24)
- **Bukti Kode:**
```typescript
const handleDeleteItem = async (rsvpId: string) => {
  try {
    await rsvpsApi.delete(data.id, rsvpId);
  } catch (e) {
    console.warn('Backend delete RSVP offline or failed, deleting locally', e);
  }
  onDeleteRSVP(rsvpId);
};
```

---

### 21. Pemisahan Konsol Dashboard & Studio Editor
- **Task:** Merombak dashboard utama dengan memisahkan konsol daftar undangan dan editor studio agar alur kerja pengelolaan lebih teratur
- **File:** `src/app/dashboard/page.tsx` (Lines 96-105)
- **Bukti Kode:**
```typescript
// View state: 'dashboard' (Main Console) or 'studio' (Editor)
const [viewMode, setViewMode] = useState<'dashboard' | 'studio'>('dashboard');
const [studioTab, setStudioTab] = useState<'template' | 'editor' | 'guests' | 'rsvp'>('editor');
```

---

### 22. Modal Buat Baru & Peringatan Upgrade Akun
- **Task:** Menambahkan modal buat undangan baru serta modal peringatan upgrade akun agar user dapat menambah undangan dan mengetahui batas kuota
- **File:** `src/app/dashboard/page.tsx` (Lines 106-115)
- **Bukti Kode:**
```typescript
const [showCreateModal, setShowCreateModal] = useState(false);
const [showUpgradeModal, setShowUpgradeModal] = useState(false);
const [showExpiredWarningModal, setShowExpiredWarningModal] = useState(false);
```

---

### 23. Pengaturan Font & Tipografi Global
- **Task:** Menyesuaikan font dan metadata global pada root layout agar tipografi seluruh aplikasi konsisten
- **File:** `src/app/layout.tsx` (Lines 25-35)
- **Bukti Kode:**
```typescript
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```
