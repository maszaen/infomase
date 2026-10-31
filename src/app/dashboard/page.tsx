'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { invitationsApi } from '@/lib/api';
import { useInvitationStore } from '@/lib/invitationStore';
import { AVAILABLE_TEMPLATES } from '@/lib/defaultData';
import { TemplateId } from '@/types/invitation';
import { TemplatePicker } from '@/components/dashboard/TemplatePicker';
import { EditorForm } from '@/components/dashboard/EditorForm';
import { GuestManager } from '@/components/dashboard/GuestManager';
import { RSVPManager } from '@/components/dashboard/RSVPManager';
import { LivePreviewPanel } from '@/components/dashboard/LivePreviewPanel';
import {
  LayoutGrid,
  LayoutTemplate,
  Edit3,
  Users,
  MessageSquareHeart,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  Save,
  LogOut,
  Lock,
  ArrowRight,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  Crown,
  CreditCard,
  Globe,
  X,
  Layers,
  Utensils,
  Search,
  QrCode,
  Calculator,
  ClipboardCheck,
  Menu,
  Info,
} from 'lucide-react';

type ConsoleView = 'dashboard' | 'invitations' | 'studio' | 'catering' | 'reception' | 'subscription';
type StudioTab = 'template' | 'editor' | 'guests' | 'rsvp';
type ToastState = { type: 'success' | 'error' | 'info'; text: string } | null;

function BrandLogo({ size = 26, spin = false }: { size?: number; spin?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={spin ? { animation: 'brand-spin 1s linear infinite' } : undefined}
      aria-hidden
    >
      <rect width="32" height="32" rx="7" fill="var(--brand)" />
      <path d="M10 21.5V10.5L16 17L22 10.5V21.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
    subscription,
    isSubscriptionActive,
    toggleSubscriptionSimulation,
    renewSubscription,
  } = useAuth();

  const {
    invitations,
    activeId,
    data,
    isLoaded,
    setActiveInvitationId,
    createInvitation,
    duplicateInvitation,
    deleteInvitation,
    togglePublish,
    setTemplateId,
    updateGroom,
    updateBride,
    updateGeneral,
    updateQuote,
    updateCountdownDate,
    updateEvent,
    addEvent,
    deleteEvent,
    updateStories,
    updateGallery,
    updateMusic,
    updateBankAccounts,
    updateGiftAddress,
    addRSVP,
    deleteRSVP,
    addGuest,
    deleteGuest,
    resetToDefault,
  } = useInvitationStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const viewParam = searchParams.get('view');
  const viewMode: ConsoleView = viewParam === 'invitations' || viewParam === 'studio' || viewParam === 'catering' || viewParam === 'reception' || viewParam === 'subscription' ? viewParam : 'dashboard';
  const tabParam = searchParams.get('tab');
  const studioTab: StudioTab = tabParam === 'template' || tabParam === 'guests' || tabParam === 'rsvp' ? tabParam : 'editor';
  const [mobileView, setMobileView] = useState<'content' | 'preview'>('content');
  const [isSaving, setIsSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [invitationFilter, setInvitationFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<ToastState>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExpiredWarningModal, setShowExpiredWarningModal] = useState(false);

  const [newTemplateId, setNewTemplateId] = useState<TemplateId>('undangan-1');
  const [newGroomName, setNewGroomName] = useState('');
  const [newBrideName, setNewBrideName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newEventDate, setNewEventDate] = useState('');

  const [checklistOverrides, setChecklistOverrides] = useState<Record<string, boolean>>({});
  const [receptionSearch, setReceptionSearch] = useState('');
  const [checkedInGuests, setCheckedInGuests] = useState<Record<string, boolean>>({});

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const navigateTo = (view: ConsoleView, tab: StudioTab = studioTab, invitationId = activeId) => {
    const params = new URLSearchParams();
    if (view !== 'dashboard') params.set('view', view);
    if (view === 'studio') {
      params.set('id', invitationId);
      params.set('tab', tab);
    }
    const query = params.toString();
    const url = `/dashboard${query ? `?${query}` : ''}`;
    if (`${window.location.pathname}${window.location.search}` !== url) {
      window.history.pushState(null, '', url);
    }
    setSidebarOpen(false);
    setMobileView('content');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const requestedInvitationId = searchParams.get('id');
  useEffect(() => {
    if (viewMode === 'studio' && requestedInvitationId && requestedInvitationId !== activeId && invitations.some((inv) => inv.id === requestedInvitationId)) {
      setActiveInvitationId(requestedInvitationId);
    }
  }, [viewMode, requestedInvitationId, activeId, invitations, setActiveInvitationId]);

  useEffect(() => {
    setSidebarOpen(false);
    setMobileView('content');
  }, [viewMode, studioTab]);

  // Toast timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToastMessage({ type, text });
  };

  // Real-time countdown calculation
  useEffect(() => {
    const targetDateStr = data?.countdownDate || data?.events?.[0]?.date || '';
    if (!targetDateStr) return;
    const target = new Date(targetDateStr).getTime();
    if (Number.isNaN(target)) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [data?.countdownDate, data?.events]);

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      await invitationsApi.update(data.id, data);
      showToast('success', 'Perubahan undangan berhasil disimpan ke cloud server!');
    } catch {
      showToast('info', 'Tersimpan di penyimpanan lokal konsol (Server backend offline)');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = (invId: string) => {
    const result = togglePublish(invId, isSubscriptionActive);
    if (!result.success) {
      if (result.error === 'SUBSCRIPTION_EXPIRED') {
        setShowExpiredWarningModal(true);
        showToast('error', 'Gagal mempublikasikan: Masa langganan akun Anda telah habis (Expired)!');
      } else {
        showToast('error', result.error || 'Gagal mengubah status publikasi');
      }
    } else if (result.isPublished) {
      showToast('success', 'Undangan BERHASIL dipublikasikan! Tautan publik aktif dan siap disebarkan.');
    } else {
      showToast('info', 'Undangan dialihkan ke mode DRAFT (Tautan publik dinonaktifkan).');
    }
  };

  const handleOpenStudio = (invId: string, initialTab: StudioTab = 'editor') => {
    setActiveInvitationId(invId);
    navigateTo('studio', initialTab, invId);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroomName.trim() || !newBrideName.trim()) {
      showToast('error', 'Mohon isi nama panggilan kedua calon mempelai.');
      return;
    }

    const title = newTitle.trim() || `The Wedding of ${newGroomName.trim()} & ${newBrideName.trim()}`;
    const slug = (newSlug.trim() || `${newGroomName}-${newBrideName}`).toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const created = createInvitation({
      title,
      slug,
      templateId: newTemplateId,
      groomName: newGroomName.trim(),
      brideName: newBrideName.trim(),
      eventDate: newEventDate,
    });

    setShowCreateModal(false);
    setNewGroomName('');
    setNewBrideName('');
    setNewTitle('');
    setNewSlug('');
    setNewEventDate('');
    showToast('success', `Undangan baru "${created.title}" berhasil dibuat! Masuk ke Studio pengeditan.`);
    navigateTo('studio', 'editor', created.id);
  };

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://infomase.id';
    const link = `${origin}/invite/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(slug);
    showToast('success', `Tautan publik disalin: ${link}`);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const checklistItems = useMemo(() => {
    const hasCoupleInfo = Boolean(data?.groom?.name && data?.bride?.name && data?.groom?.fullName);
    const hasEvents = Boolean(data?.events && data.events.length > 0 && data?.events[0]?.locationName);
    const hasGifts = Boolean(data?.bankAccounts && data.bankAccounts.length > 0);
    const hasMedia = Boolean(data?.music?.title && data?.gallery && data.gallery.length > 0);
    const hasGuests = Boolean(data?.guests && data.guests.length > 0);
    const hasRsvp = Boolean(data?.rsvpList && data.rsvpList.length > 0);

    return [
      { id: 'couple', title: 'Lengkapi Biodata & Foto Mempelai', desc: 'Nama lengkap, nama orang tua, dan foto profil mempelai pria & wanita.', autoStatus: hasCoupleInfo, tab: 'editor' as const },
      { id: 'events', title: 'Jadwal Acara & Peta Google Maps', desc: 'Waktu Akad Nikah, Resepsi, alamat gedung, dan link navigasi peta.', autoStatus: hasEvents, tab: 'editor' as const },
      { id: 'gifts', title: 'Rekening Kado Digital & Barcode QRIS', desc: 'Nomor rekening bank atau dompet digital untuk amplop cashless.', autoStatus: hasGifts, tab: 'editor' as const },
      { id: 'media', title: 'Pilih Lagu Romantis & Galeri Foto', desc: 'Lagu latar otomatis dan foto momen prewedding terbaik.', autoStatus: hasMedia, tab: 'editor' as const },
      { id: 'guests', title: 'Import Daftar Tamu & WhatsApp Blast', desc: 'Masukkan tamu dari kontak Excel/WA dan sebar link undangan personal.', autoStatus: hasGuests, tab: 'guests' as const },
      { id: 'rsvp', title: 'Pantau RSVP & Rekap Pax Katering', desc: 'Pastikan jumlah porsi makanan katering sesuai dengan tamu yang hadir.', autoStatus: hasRsvp, tab: 'rsvp' as const },
    ];
  }, [data]);

  const completedChecklistCount = checklistItems.filter(
    (item) => (checklistOverrides[item.id] !== undefined ? checklistOverrides[item.id] : item.autoStatus)
  ).length;
  const checklistPercentage = Math.round((completedChecklistCount / checklistItems.length) * 100);

  const filteredInvitations = invitations.filter((inv) => {
    const matchesFilter =
      invitationFilter === 'all' ? true : invitationFilter === 'published' ? inv.isPublished : !inv.isPublished;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inv.title.toLowerCase().includes(q) ||
      inv.slug.toLowerCase().includes(q) ||
      inv.groom.name.toLowerCase().includes(q) ||
      inv.bride.name.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const totalGuests = invitations.reduce((acc, curr) => acc + (curr.guests?.length || 0), 0);
  const totalRsvps = invitations.reduce((acc, curr) => acc + (curr.rsvpList?.length || 0), 0);
  const totalPublished = invitations.filter((i) => i.isPublished).length;

  const activeHadir = (data?.rsvpList || []).filter((r) => r.attendance === 'hadir');
  const activePax = activeHadir.reduce((acc, curr) => acc + (curr.pax || 1), 0);
  const recommendedCateringPortion = Math.round(activePax * 1.8);
  const checkedInCount = data.guests.filter((guest) => checkedInGuests[guest.id]).length;

  /* ============ Loading & Auth gates ============ */

  if (authLoading || !isLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--canvas)' }}>
        <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <BrandLogo size={34} spin />
          <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>Menyiapkan Konsol InfoMase...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--canvas)', padding: 16 }}>
        <div className="card" style={{ maxWidth: 400, width: '100%', padding: '36px 32px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--brand-subtle)', border: '1px solid var(--info-border)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: 17, marginBottom: 6 }}>Konsol Pengguna InfoMase</h2>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 20 }}>
            Silakan masuk ke akun pengantin Anda untuk mengelola undangan digital, daftar tamu WhatsApp, rekap katering, dan studio pengeditan.
          </p>
          <div className="stack-sm">
            <Link href="/login" className="btn btn-primary" style={{ width: '100%', padding: 10 }}>
              Masuk ke Akun Anda <ArrowRight size={15} />
            </Link>
            <Link href="/register" className="btn btn-secondary" style={{ width: '100%', padding: 10 }}>
              Daftar Akun Baru
            </Link>
          </div>
          <Link href="/" style={{ display: 'inline-block', marginTop: 18, fontSize: 12.5, color: 'var(--ink-3)', textDecoration: 'none' }}>
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  /* ============ Sidebar ============ */

  const studioNavigation: Array<{ id: StudioTab; label: string; icon: typeof Edit3; count?: number }> = [
    { id: 'template', label: 'Template', icon: LayoutTemplate },
    { id: 'editor', label: 'Konten', icon: Edit3 },
    { id: 'guests', label: 'Buku Tamu WA', icon: Users, count: data.guests.length },
    { id: 'rsvp', label: 'RSVP', icon: MessageSquareHeart, count: data.rsvpList.length },
  ];

  const renderSidebar = () => (
    <>
      <div className={`sidebar-backdrop${sidebarOpen ? ' show' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        {viewMode === 'studio' ? (
          <>
            <div className="studio-sidebar-back">
              <button type="button" className="sidebar-item" onClick={() => navigateTo('dashboard')}>
                <ChevronLeft size={16} /> Kembali ke Ringkasan
              </button>
            </div>
            <div className="sidebar-brand">
              <BrandLogo />
              <span style={{ fontWeight: 700, fontSize: 15 }}>InfoMase</span>
              <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>Studio</span>
            </div>
            <div className="studio-project-context">
              <span className="inv-meta-label">Sedang mengedit</span>
              <strong>{data.title}</strong>
              <span>/invite/{data.slug}</span>
            </div>
            <nav className="sidebar-nav" aria-label="Navigasi studio">
              {studioNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} type="button" className={`sidebar-item${studioTab === item.id ? ' active' : ''}`} aria-current={studioTab === item.id ? 'page' : undefined} onClick={() => navigateTo('studio', item.id)}>
                    <Icon size={16} /> {item.label}
                    {item.count !== undefined && <span className="tab-count" style={{ marginLeft: 'auto' }}>{item.count}</span>}
                  </button>
                );
              })}
            </nav>
          </>
        ) : (
          <>
            <a className="sidebar-brand" href="/">
              <BrandLogo />
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>InfoMase</span>
              <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>Console</span>
            </a>
            <nav className="sidebar-nav" aria-label="Navigasi konsol">
              <span className="sidebar-section-label">Menu Utama</span>
              <button type="button" className={`sidebar-item${viewMode === 'dashboard' ? ' active' : ''}`} aria-current={viewMode === 'dashboard' ? 'page' : undefined} onClick={() => navigateTo('dashboard')}>
                <LayoutGrid size={16} /> Ringkasan Konsol
              </button>
              <button type="button" className={`sidebar-item${viewMode === 'invitations' ? ' active' : ''}`} aria-current={viewMode === 'invitations' ? 'page' : undefined} onClick={() => navigateTo('invitations')}>
                <Edit3 size={16} /> Studio Editor
              </button>
              <span className="sidebar-section-label">Alat Hari H</span>
              <button type="button" className={`sidebar-item${viewMode === 'catering' ? ' active' : ''}`} aria-current={viewMode === 'catering' ? 'page' : undefined} onClick={() => navigateTo('catering')}>
                <Calculator size={16} /> Kalkulator Katering
              </button>
              <button type="button" className={`sidebar-item${viewMode === 'reception' ? ' active' : ''}`} aria-current={viewMode === 'reception' ? 'page' : undefined} onClick={() => navigateTo('reception')}>
                <QrCode size={16} /> Meja Resepsionis
              </button>
              <button type="button" className={`sidebar-item${viewMode === 'subscription' ? ' active' : ''}`} aria-current={viewMode === 'subscription' ? 'page' : undefined} onClick={() => navigateTo('subscription')}>
                <CreditCard size={16} /> Langganan &amp; Paket
              </button>
            </nav>
          </>
        )}
        {viewMode === 'studio' ? (
          <div className="sidebar-footer studio-project-context">
            <span className={`badge ${data.isPublished && isSubscriptionActive ? 'badge-success' : 'badge-dark'}`}>
              {data.isPublished && isSubscriptionActive ? 'Undangan dipublikasikan' : 'Undangan belum aktif'}
            </span>
            <span>Fokus pada undangan ini. Kembali ke konsol untuk mengelola proyek lainnya.</span>
          </div>
        ) : (
          <div className="sidebar-footer">
            <div
              className="card"
              style={{ padding: '10px 12px', marginBottom: 8, background: isSubscriptionActive ? 'var(--success-bg)' : 'var(--danger-bg)', borderColor: isSubscriptionActive ? 'var(--success-border)' : 'var(--danger-border)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Crown size={15} color={isSubscriptionActive ? 'var(--success)' : 'var(--danger)'} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{subscription.planName}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                    {isSubscriptionActive ? `${subscription.daysRemaining} hari tersisa` : 'Masa aktif habis'}
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="sidebar-item"
              onClick={() => {
                toggleSubscriptionSimulation();
                showToast('info', `Simulasi langganan: ${isSubscriptionActive ? 'Expired' : 'Aktif'}.`);
              }}
              title="Tombol penguji: simulasi kondisi akun Expired / Aktif"
            >
              <ShieldCheck size={16} /> Simulasi Langganan
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px' }}>
              <div className="avatar" style={{ width: 28, height: 28 }} title={user?.email || 'User Pengantin'}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                style={{ padding: 4 }}
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                title="Keluar / Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );

  const toastHost = toastMessage ? (
    <div className="toast-stack">
      <div className={`toast toast-${toastMessage.type}`}>
        {toastMessage.type === 'success' && <CheckCircle2 size={16} />}
        {toastMessage.type === 'error' && <AlertCircle size={16} />}
        {toastMessage.type === 'info' && <Info size={16} />}
        <span>{toastMessage.text}</span>
      </div>
    </div>
  ) : null;

  /* ============ STUDIO VIEW ============ */

  const renderStudio = () => {
    const sectionDescriptions: Record<StudioTab, string> = {
      template: 'Pilih desain undangan dan lihat hasilnya secara langsung.',
      editor: 'Atur detail pernikahan, foto, dan cerita Anda.',
      guests: 'Kelola daftar tamu dan bagikan undangan personal melalui WhatsApp.',
      rsvp: 'Pantau konfirmasi kehadiran dan ucapan dari tamu Anda.',
    };
    const showPreview = studioTab === 'template' || studioTab === 'editor';

    return (
      <>
        <div className="topbar">
          <div className="row-nowrap studio-topbar-left">
            <button type="button" className="btn btn-icon btn-ghost sidebar-mobile-toggle" onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
              <Menu size={18} />
            </button>
            <div style={{ minWidth: 0 }}>
              <div className="row-nowrap" style={{ gap: 8 }}>
                <h2 className="studio-title" style={{ fontSize: 15, fontWeight: 600 }}>{data.title}</h2>
              </div>
              <div className="studio-subtitle">
                {data.groom.name} &amp; {data.bride.name} · /invite/{data.slug}
              </div>
            </div>
          </div>

          <div className="row-nowrap studio-topbar-actions">
            <button
              type="button"
              onClick={() => handleTogglePublish(data.id)}
              className={`btn btn-sm ${data.isPublished && isSubscriptionActive ? 'btn-success' : 'btn-primary'}`}
              title={data.isPublished ? 'Klik untuk alihkan ke Draft' : 'Klik untuk publikasikan ke tamu'}
            >
              {data.isPublished ? (
                <>
                  <Globe size={14} /> Live
                </>
              ) : (
                <>
                  <Lock size={14} /> {isSubscriptionActive ? 'Publish' : 'Draft (Expired)'}
                </>
              )}
            </button>

            <button type="button" onClick={handleSaveToCloud} disabled={isSaving} className="btn btn-sm btn-secondary" aria-label={isSaving ? 'Menyimpan undangan' : 'Simpan ke cloud'} title="Simpan ke cloud">
              <Save size={14} />
              <span className="topbar-hide-sm">{isSaving ? 'Menyimpan...' : 'Simpan Cloud'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset data undangan ini ke default? Semua perubahan akan dikembalikan ke awal.')) {
                  resetToDefault();
                  showToast('info', 'Undangan direset ke data bawaan.');
                }
              }}
              className="btn btn-icon btn-sm btn-ghost"
              title="Reset ke Template Awal"
            >
              <RotateCcw size={15} />
            </button>

            <a href={`/invite/${data.slug}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary" aria-label="Buka undangan tamu" title="Buka undangan tamu">
              <ExternalLink size={14} /> <span className="topbar-hide-sm">Web Tamu</span>
            </a>
          </div>
        </div>

        <div className="page-content studio-page">
          <div className="studio-toolbar">
            <div>
              <h1 className="studio-page-title">{studioNavigation.find((item) => item.id === studioTab)?.label}</h1>
              <p className="card-subtitle">{sectionDescriptions[studioTab]}</p>
            </div>

            {showPreview && <button
              type="button"
              className="btn btn-sm btn-secondary studio-preview-toggle"
              onClick={() => setMobileView(mobileView === 'content' ? 'preview' : 'content')}
            >
              {mobileView === 'content' ? <ExternalLink size={14} /> : <Edit3 size={14} />}
              {mobileView === 'content' ? 'Lihat Preview' : 'Kembali Mengedit'}
            </button>}
          </div>

          <div className={`studio-grid${showPreview ? '' : ' studio-grid-wide'}`}>
            <div className={`studio-editor-col${showPreview && mobileView === 'preview' ? ' studio-hidden-mobile' : ''}`}>
              <div className="studio-editor-panel">
                {studioTab === 'template' && (
                  <TemplatePicker
                    selectedTemplateId={data.templateId}
                    onSelect={(tid) => {
                      setTemplateId(tid);
                      showToast('info', `Template berhasil diubah ke: ${tid.toUpperCase()}`);
                    }}
                  />
                )}

                {studioTab === 'editor' && (
                  <EditorForm
                    data={data}
                    onUpdateGroom={updateGroom}
                    onUpdateBride={updateBride}
                    onUpdateGeneral={updateGeneral}
                    onUpdateQuote={updateQuote}
                    onUpdateCountdownDate={updateCountdownDate}
                    onUpdateEvent={updateEvent}
                    onAddEvent={addEvent}
                    onDeleteEvent={deleteEvent}
                    onUpdateStories={updateStories}
                    onUpdateGallery={updateGallery}
                    onUpdateBankAccounts={updateBankAccounts}
                    onUpdateGiftAddress={updateGiftAddress}
                    onUpdateMusic={updateMusic}
                  />
                )}

                {studioTab === 'guests' && <GuestManager data={data} onAddGuest={addGuest} onDeleteGuest={deleteGuest} />}

                {studioTab === 'rsvp' && <RSVPManager data={data} onDeleteRSVP={deleteRSVP} />}
              </div>
            </div>

            {showPreview && (
              <div className={`studio-preview-col${mobileView === 'content' ? ' studio-hidden-mobile' : ''}`}>
                <LivePreviewPanel data={data} onAddRSVP={addRSVP} />
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  /* ============ DASHBOARD VIEW ============ */

  const renderDashboard = () => (
    <>
      <div className="topbar">
        <div className="row-nowrap">
          <button type="button" className="btn btn-icon btn-ghost sidebar-mobile-toggle" onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
            <Menu size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Ringkasan Konsol</h2>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Selamat datang kembali, {user?.name}.</div>
          </div>
        </div>
        <div className="row-nowrap">
          <span className={`badge ${isSubscriptionActive ? 'badge-success' : 'badge-danger'}`}>
            <span className={`status-dot ${isSubscriptionActive ? 'status-dot-live' : 'status-dot-locked'}`} />
            {subscription.planName} · {isSubscriptionActive ? `${subscription.daysRemaining} hari` : 'EXPIRED'}
          </span>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={14} /> <span className="topbar-hide-sm">Buat Undangan</span>
          </button>
        </div>
      </div>

      <div className="page-content">
        {/* Hero: active project summary + countdown */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="hero-grid">
            <div className="stack-sm" style={{ minWidth: 0 }}>
              <div className="row">
                <span className="badge badge-blue">
                  <ShieldCheck size={12} /> Proyek Pernikahan Aktif
                </span>
                {data.isPublished ? (
                  isSubscriptionActive ? (
                    <span className="badge badge-success">
                      <span className="status-dot status-dot-live" /> Live (Publik)
                    </span>
                  ) : (
                    <span className="badge badge-danger">
                      <Lock size={11} /> Terkunci (Subs Habis)
                    </span>
                  )
                ) : (
                  <span className="badge badge-dark">
                    <span className="status-dot status-dot-draft" /> Draft
                  </span>
                )}
              </div>
              <h1 className="hero-title">The Wedding of {data.groom.name} &amp; {data.bride.name}</h1>
              <div className="row" style={{ gap: 14, fontSize: 13, color: 'var(--ink-2)' }}>
                <span>
                  Tanggal: <strong style={{ color: 'var(--ink)' }}>{data.events[0]?.date || 'Belum diatur'}</strong>
                </span>
                <span>
                  Gedung: <strong style={{ color: 'var(--ink)' }}>{data.events[0]?.locationName || 'Lokasi Resepsi'}</strong>
                </span>
              </div>
              <div className="row" style={{ marginTop: 8 }}>
                <button type="button" className="btn btn-primary" onClick={() => handleOpenStudio(data.id, 'editor')}>
                  <Edit3 size={14} /> Buka Studio Editor
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => handleCopyLink(data.slug)}>
                  {copiedSlug === data.slug ? <Check size={14} /> : <Copy size={14} />}
                  {copiedSlug === data.slug ? 'Tersalin!' : 'Salin Link'}
                </button>
                <a href={`/invite/${data.slug}`} target="_blank" rel="noreferrer" className="btn btn-secondary">
                  <ExternalLink size={14} /> Pratinjau
                </a>
                <button type="button" className="btn btn-secondary" onClick={() => navigateTo('reception')}>
                  <QrCode size={14} /> Meja Resepsionis
                </button>
              </div>
            </div>

            <div className="countdown-box">
              <span className="stat-card-label">Menuju Hari Bahagia</span>
              <div className="countdown-row">
                {(
                  [
                    [countdown.days, 'Hari'],
                    [countdown.hours, 'Jam'],
                    [countdown.minutes, 'Menit'],
                    [countdown.seconds, 'Detik'],
                  ] as Array<[number, string]>
                ).map(([v, label]) => (
                  <div key={label} className="countdown-unit">
                    <strong>{String(v).padStart(2, '0')}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>/invite/{data.slug}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 20 }}>
          <div className="stat-card">
            <div className="row-nowrap" style={{ justifyContent: 'space-between' }}>
              <span className="stat-card-label">Proyek Undangan</span>
              <span className="stat-icon"><Layers size={16} /></span>
            </div>
            <div className="stat-card-value">{invitations.length}</div>
            <div className="stat-card-desc">{totalPublished} dipublikasikan · {invitations.length - totalPublished} draft</div>
          </div>

          <div className="stat-card">
            <div className="row-nowrap" style={{ justifyContent: 'space-between' }}>
              <span className="stat-card-label">Tamu Diundang (WA)</span>
              <span className="stat-icon"><Users size={16} /></span>
            </div>
            <div className="stat-card-value">{totalGuests}</div>
            <div className="stat-card-desc">Siap disebarkan via WhatsApp Link Generator</div>
          </div>

          <button type="button" className="stat-card card-hover" style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => navigateTo('catering')} title="Klik untuk membuka kalkulator katering detail">
            <div className="row-nowrap" style={{ justifyContent: 'space-between' }}>
              <span className="stat-card-label">Estimasi Pax Katering</span>
              <span className="stat-icon"><Utensils size={16} /></span>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--warning)' }}>{activePax}</div>
            <div className="stat-card-desc">Rekomendasi pesanan: ±{recommendedCateringPortion} porsi (buffer 80%)</div>
          </button>

          <div className="stat-card">
            <div className="row-nowrap" style={{ justifyContent: 'space-between' }}>
              <span className="stat-card-label">Doa &amp; Amplop Digital</span>
              <span className="stat-icon"><MessageSquareHeart size={16} /></span>
            </div>
            <div className="stat-card-value">{totalRsvps}</div>
            <div className="stat-card-desc">{data.bankAccounts.length} rekening transfer &amp; QRIS aktif</div>
          </div>
        </div>

        {/* Checklist */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div>
              <div className="card-title">Checklist Persiapan Undangan Pernikahan</div>
              <div className="card-subtitle">Pantau kesiapan materi undangan Anda sebelum menyebarkan link ke tamu keluarga dan kerabat.</div>
            </div>
            <span className={`badge ${checklistPercentage === 100 ? 'badge-success' : 'badge-blue'}`}>{checklistPercentage}% Selesai</span>
          </div>
          <div className="card-body">
            <div className="progress" style={{ marginBottom: 14 }}>
              <div className={`progress-bar${checklistPercentage === 100 ? ' complete' : ''}`} style={{ width: `${checklistPercentage}%` }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 12 }}>
              {completedChecklistCount} dari {checklistItems.length} tahapan selesai — klik ikon centang untuk menandai manual.
            </div>
            <div className="checklist-grid">
              {checklistItems.map((item) => {
                const isChecked = checklistOverrides[item.id] !== undefined ? checklistOverrides[item.id] : item.autoStatus;
                return (
                  <div key={item.id} className={`checklist-item${isChecked ? ' done' : ''}`}>
                    <button
                      type="button"
                      onClick={() => setChecklistOverrides((prev) => ({ ...prev, [item.id]: !isChecked }))}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginTop: 1, color: isChecked ? 'var(--success)' : 'var(--ink-3)' }}
                      title="Klik untuk menandai selesai/belum"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: isChecked ? 'var(--success)' : 'var(--ink)' }}>{item.title}</span>
                        <button
                          type="button"
                          onClick={() => handleOpenStudio(data.id, item.tab)}
                          className="btn btn-sm btn-ghost"
                          style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--brand)' }}
                        >
                          Atur →
                        </button>
                      </div>
                      <p style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.45 }}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tools quick bar */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body row" style={{ justifyContent: 'space-between' }}>
            <div className="row-nowrap">
              <span className="stat-icon"><ClipboardCheck size={18} /></span>
              <div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', display: 'block' }}>Fitur Tambahan Hari H &amp; Vendor</span>
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                  Gunakan kalkulator katering atau mode meja resepsionis untuk panitia penerima tamu di pintu gedung.
                </span>
              </div>
            </div>
            <div className="row">
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => navigateTo('catering')}>
                <Calculator size={14} /> Kalkulator Katering
              </button>
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => navigateTo('reception')}>
                <QrCode size={14} /> Meja Resepsionis (Hari H)
              </button>
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => navigateTo('subscription')}>
                <CreditCard size={14} /> Kelola Langganan
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );

  const renderInvitations = () => (
    <>
      {/* Invitations management */}
      <div className="row inv-section-head">
        <div>
          <h3 style={{ fontSize: 16 }}>Daftar Undangan &amp; Template Saya</h3>
          <p style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>
            Kelola proyek undangan Anda. Setiap undangan dapat menggunakan template berbeda dengan tautan khusus.
          </p>
        </div>
        <div className="row inv-toolbar">
          <div className="search-box" style={{ width: 210 }}>
            <Search size={14} className="search-icon" />
            <input className="form-input" placeholder="Cari undangan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {searchQuery && (
              <button type="button" className="search-clear" onClick={() => setSearchQuery('')} aria-label="Hapus pencarian">
                <X size={13} />
              </button>
            )}
          </div>
          <div className="segmented">
            <button type="button" className={invitationFilter === 'all' ? 'active' : ''} onClick={() => setInvitationFilter('all')}>
              Semua ({invitations.length})
            </button>
            <button type="button" className={invitationFilter === 'published' ? 'active' : ''} onClick={() => setInvitationFilter('published')}>
              Live ({totalPublished})
            </button>
            <button type="button" className={invitationFilter === 'draft' ? 'active' : ''} onClick={() => setInvitationFilter('draft')}>
              Draft ({invitations.length - totalPublished})
            </button>
          </div>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={14} /> Tambah
          </button>
        </div>
      </div>

      <div className="inv-grid">
        {filteredInvitations.map((inv) => {
          const tMeta = AVAILABLE_TEMPLATES.find((t) => t.id === inv.templateId);
          const isCurrentActive = inv.id === activeId;
          const hadirCount = (inv.rsvpList || []).filter((r) => r.attendance === 'hadir').length;

          return (
            <div
              key={inv.id}
              className="card card-hover"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderColor: isCurrentActive ? 'var(--brand)' : undefined, boxShadow: isCurrentActive ? '0 0 0 1px var(--brand)' : undefined }}
            >
              <div className="inv-card-header" style={{ background: tMeta ? `linear-gradient(135deg, ${tMeta.themeColor} 0%, #1d2733 100%)` : 'linear-gradient(135deg, var(--brand) 0%, #1d2733 100%)' }}>
                <div className="row-nowrap" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className="badge inv-template-badge">{tMeta?.name.split('&')[0] || inv.templateId}</span>
                  {inv.isPublished ? (
                    isSubscriptionActive ? (
                      <span className="badge inv-badge-live">
                        <span className="status-dot" style={{ background: '#fff' }} /> LIVE
                      </span>
                    ) : (
                      <span className="badge inv-badge-locked">
                        <Lock size={11} /> TERKUNCI
                      </span>
                    )
                  ) : (
                    <span className="badge inv-badge-draft">DRAFT</span>
                  )}
                </div>
                <h4 style={{ color: '#fff', fontSize: 16, marginBottom: 2, lineHeight: 1.3 }}>{inv.title}</h4>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)' }}>
                  {inv.groom.name} &amp; {inv.bride.name}
                </div>
              </div>

              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                <div className="row-nowrap inv-slug-row">
                  <span className="inv-slug">
                    <Globe size={12} /> /invite/{inv.slug}
                  </span>
                  <button type="button" className="btn btn-icon btn-sm btn-ghost" onClick={() => handleCopyLink(inv.slug)} title="Salin Tautan Publik">
                    {copiedSlug === inv.slug ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="inv-meta-grid">
                  <div>
                    <span className="inv-meta-label">Tanggal Acara</span>
                    <strong>{inv.events[0]?.date || 'Belum diatur'}</strong>
                  </div>
                  <div>
                    <span className="inv-meta-label">Tamu &amp; RSVP</span>
                    <strong>
                      {inv.guests?.length || 0} tamu · {hadirCount} hadir
                    </strong>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button type="button" className="btn btn-primary" onClick={() => handleOpenStudio(inv.id, 'editor')}>
                    <Edit3 size={14} /> Buka Studio
                  </button>
                  <div className="inv-actions-2col">
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => handleOpenStudio(inv.id, 'guests')}>
                      <Users size={13} /> Tamu WA
                    </button>
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => handleOpenStudio(inv.id, 'rsvp')}>
                      <MessageSquareHeart size={13} /> Data RSVP
                    </button>
                  </div>
                  <div className="row-nowrap" style={{ justifyContent: 'space-between', paddingTop: 4 }}>
                    <a href={`/invite/${inv.slug}`} target="_blank" rel="noreferrer" className="inv-guest-link">
                      <ExternalLink size={12} /> Web Tamu
                    </a>
                    <div className="row-nowrap" style={{ gap: 2 }}>
                      <button type="button" className="btn btn-icon btn-sm btn-ghost" onClick={() => handleTogglePublish(inv.id)} title={inv.isPublished ? 'Jadikan Draft' : 'Publish Sekarang'}>
                        {inv.isPublished ? <Lock size={14} /> : <Globe size={14} />}
                      </button>
                      <button
                        type="button"
                        className="btn btn-icon btn-sm btn-ghost"
                        onClick={() => {
                          const dup = duplicateInvitation(inv.id);
                          showToast('success', `Undangan berhasil diduplikasi: "${dup.title}"`);
                        }}
                        title="Duplikat Undangan"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-icon btn-sm btn-ghost"
                        style={{ color: 'var(--danger)' }}
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus undangan "${inv.title}"?`)) {
                            deleteInvitation(inv.id);
                            showToast('info', 'Undangan telah dihapus.');
                          }
                        }}
                        title="Hapus Undangan"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button type="button" className="inv-add-new" onClick={() => setShowCreateModal(true)}>
          <span className="inv-add-icon"><Plus size={24} /></span>
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>Buat Undangan Baru</span>
          <span style={{ fontSize: 12.5, color: 'var(--ink-3)', maxWidth: 280, lineHeight: 1.5 }}>
            Pilih desain template estetik InfoMase dan buat undangan pernikahan digital Anda berikutnya.
          </span>
        </button>
      </div>

      {filteredInvitations.length === 0 && (
        <div className="empty-state">
          <Search size={30} />
          <h3>Tidak ada undangan cocok</h3>
          <p>Ubah kata kunci pencarian atau filter status undangan.</p>
        </div>
      )}
    </>
  );

  const renderSubscription = () => (
    <div className="console-tool-content">
      <div className="card" style={{ padding: '14px 16px', marginBottom: 18, background: isSubscriptionActive ? 'var(--success-bg)' : 'var(--danger-bg)', borderColor: isSubscriptionActive ? 'var(--success-border)' : 'var(--danger-border)' }}>
        <div className="row-nowrap" style={{ justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 13.5, color: isSubscriptionActive ? 'var(--success)' : 'var(--danger)' }}>Paket Anda: {subscription.planName}</strong>
          <span className={`badge ${isSubscriptionActive ? 'badge-success' : 'badge-danger'}`}>{isSubscriptionActive ? 'AKTIF' : 'EXPIRED'}</span>
        </div>
        <p style={{ fontSize: 12.5, marginTop: 6, color: 'var(--ink-2)', lineHeight: 1.55 }}>
          {isSubscriptionActive
            ? `Masa aktif berlaku hingga ${subscription.expiresAt} (${subscription.daysRemaining} hari tersisa). Anda dapat mempublikasikan undangan tanpa hambatan.`
            : 'Masa berlangganan telah habis. Perpanjang paket sekarang agar tautan undangan publik aktif kembali.'}
        </p>
      </div>

      <div className="modal-2col pricing-2col">
        <div className="card pricing-card pricing-card-pro">
          <div>
            <span className="badge badge-blue" style={{ marginBottom: 8 }}>POPULER</span>
            <h4 style={{ fontSize: 16 }}>Paket Pro Wedding</h4>
            <div style={{ margin: '8px 0 12px' }}>
              <span style={{ fontSize: 22, fontWeight: 700 }}>Rp 149.000</span>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}> / 30 hari</span>
            </div>
            <ul className="pricing-list">
              <li>Publish undangan unlimited</li>
              <li>Kelola tamu WhatsApp tanpa batas</li>
              <li>Rekap RSVP &amp; pax katering otomatis</li>
              <li>Musik latar &amp; amplop digital QRIS</li>
            </ul>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              renewSubscription('pro');
              showToast('success', 'Paket Pro Wedding (30 Hari) berhasil diaktifkan!');
            }}
          >
            Aktifkan Paket Pro
          </button>
        </div>

        <div className="card pricing-card">
          <div>
            <span className="badge badge-dark" style={{ marginBottom: 8 }}>LIFETIME</span>
            <h4 style={{ fontSize: 16 }}>VIP Exclusive</h4>
            <div style={{ margin: '8px 0 12px' }}>
              <span style={{ fontSize: 22, fontWeight: 700 }}>Rp 299.000</span>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}> / 1 tahun</span>
            </div>
            <ul className="pricing-list">
              <li>Semua fitur Pro Wedding</li>
              <li>Masa aktif 365 hari (1 tahun)</li>
              <li>Hingga 20 proyek undangan</li>
              <li>Meja resepsionis &amp; QR check-in</li>
            </ul>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              renewSubscription('vip');
              showToast('success', 'Paket VIP Exclusive (1 Tahun) berhasil diaktifkan!');
            }}
          >
            Pilih VIP Exclusive
          </button>
        </div>
      </div>
    </div>
  );

  const renderCatering = () => (
    <div className="console-tool-content">
      <div className="card" style={{ padding: '16px 18px', background: 'var(--surface-sunken)', marginBottom: 16 }}>
        <div className="modal-2col" style={{ marginBottom: 12 }}>
          <div>
            <span className="inv-meta-label">Total Tamu Diundang</span>
            <strong style={{ fontSize: 18 }}>{data.guests.length} orang</strong>
          </div>
          <div>
            <span className="inv-meta-label">RSVP Konfirmasi Hadir</span>
            <strong style={{ fontSize: 18, color: 'var(--success)' }}>
              {activeHadir.length} tamu ({activePax} pax)
            </strong>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--border)', margin: '10px 0 12px' }} />
        <span className="inv-meta-label">Rumus Rekomendasi Porsi Makanan</span>
        <p style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
          Jumlah porsi ideal = <strong>{activePax} pax hadir × 1.8</strong> (termasuk buffer 10–20% untuk keluarga, panitia WO, &amp; tamu pasangan tak terduga).
        </p>
      </div>

      <div className="modal-2col" style={{ marginBottom: 16 }}>
        <div className="card" style={{ padding: 16, background: 'var(--success-bg)', borderColor: 'var(--success-border)' }}>
          <span className="inv-meta-label" style={{ color: 'var(--success)' }}>MENU UTAMA (BUFFET / PRASMANAN)</span>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)', margin: '6px 0 2px' }}>{Math.round(recommendedCateringPortion * 0.6)}</div>
          <span style={{ fontSize: 11.5, color: 'var(--success)' }}>60% porsi buffet prasmanan</span>
        </div>
        <div className="card" style={{ padding: 16, background: 'var(--info-bg)', borderColor: 'var(--info-border)' }}>
          <span className="inv-meta-label" style={{ color: 'var(--info)' }}>GUBUKAN (FOOD STALL)</span>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--info)', margin: '6px 0 2px' }}>{Math.round(recommendedCateringPortion * 0.4 * 4)}</div>
          <span style={{ fontSize: 11.5, color: 'var(--info)' }}>4 porsi gubukan per pax</span>
        </div>
      </div>

      <div className="card" style={{ padding: '12px 14px', background: 'var(--warning-bg)', borderColor: 'var(--warning-border)' }}>
        <div className="row-nowrap" style={{ gap: 8, fontSize: 12.5, color: 'var(--warning)' }}>
          <AlertTriangle size={15} />
          <span>Angka ini rekomendasi — koordinasikan final dengan katering Anda sebelum hari H.</span>
        </div>
      </div>
    </div>
  );

  const renderReception = () => (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Check-in Hari H</h3>
        <span className="badge badge-success">Hadir: {checkedInCount} dari {data.guests.length} tamu</span>
      </div>
      <div className="card-body">
        <div className="search-box" style={{ marginBottom: 12 }}>
          <Search size={14} className="search-icon" />
          <input className="form-input" placeholder="Ketik nama tamu untuk mencari..." value={receptionSearch} onChange={(e) => setReceptionSearch(e.target.value)} />
          {receptionSearch && (
            <button type="button" className="search-clear" onClick={() => setReceptionSearch('')} aria-label="Hapus pencarian">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="reception-list">
          {data.guests
            .filter((g) => g.name.toLowerCase().includes(receptionSearch.toLowerCase()))
            .map((guest) => {
              const isCheckedIn = checkedInGuests[guest.id] || false;
              return (
                <div key={guest.id} className={`reception-item${isCheckedIn ? ' done' : ''}`}>
                  <div style={{ minWidth: 0 }}>
                    <div className="row-nowrap" style={{ gap: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{guest.name}</span>
                      <span className="badge badge-dark">{guest.category}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{guest.phone || 'Tanpa nomor telepon'}</span>
                  </div>
                  <button
                    type="button"
                    className={`btn btn-sm ${isCheckedIn ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => setCheckedInGuests((prev) => ({ ...prev, [guest.id]: !isCheckedIn }))}
                  >
                    {isCheckedIn ? '✓ Sudah Hadir' : 'Tandai Hadir'}
                  </button>
                </div>
              );
            })}
          {data.guests.filter((g) => g.name.toLowerCase().includes(receptionSearch.toLowerCase())).length === 0 && (
            <div className="empty-state" style={{ padding: 24 }}>
              <Users size={24} />
              <h3 style={{ fontSize: 14 }}>Tidak ada tamu ditemukan</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderConsolePage = () => {
    const titles = {
      dashboard: 'Ringkasan Konsol', studio: 'Studio', invitations: 'Studio Editor',
      catering: 'Kalkulator Katering', reception: 'Meja Resepsionis', subscription: 'Langganan & Paket',
    };
    return (
      <>
        <header className="topbar console-page-topbar">
          <div className="row-nowrap">
            <button type="button" className="btn btn-icon btn-ghost sidebar-mobile-toggle" onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
              <Menu size={18} />
            </button>
            <h1 style={{ fontSize: 15 }}>{titles[viewMode]}</h1>
          </div>
          <span className="badge badge-blue">{viewMode === 'invitations' ? `${invitations.length} proyek` : subscription.planName}</span>
        </header>
        <div className="page-content">
          {viewMode === 'invitations' ? renderInvitations() : (
            <>
              <div className="console-page-heading">
                <div>
                  <h2 style={{ fontSize: 20 }}>{titles[viewMode]}</h2>
                  <p className="card-subtitle">
                    {viewMode === 'catering' ? 'Rencanakan porsi makanan berdasarkan konfirmasi kehadiran tamu.' : viewMode === 'reception' ? 'Cari dan tandai tamu yang sudah hadir di hari pernikahan.' : 'Kelola masa aktif paket dan akses publik undangan Anda.'}
                  </p>
                </div>
                {(viewMode === 'catering' || viewMode === 'reception') && (
                  <label className="console-project-select">
                    <span className="form-label">Undangan aktif</span>
                    <select className="form-select" value={activeId} onChange={(e) => { setActiveInvitationId(e.target.value); setReceptionSearch(''); }}>
                      {invitations.map((inv) => <option key={inv.id} value={inv.id}>{inv.title}</option>)}
                    </select>
                  </label>
                )}
              </div>
              {viewMode === 'catering' && renderCatering()}
              {viewMode === 'reception' && renderReception()}
              {viewMode === 'subscription' && renderSubscription()}
            </>
          )}
        </div>
      </>
    );
  };

  /* ============ MODALS ============ */

  const renderModals = () => (
    <>
      {/* MODAL 1: CREATE INVITATION */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}>
          <div className="modal" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Buat Undangan Digital Baru</div>
                <div className="modal-subtitle">Pilih desain template dan lengkapi data awal pasangan mempelai.</div>
              </div>
              <button type="button" className="btn btn-icon btn-sm btn-ghost" onClick={() => setShowCreateModal(false)} aria-label="Tutup">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateSubmit} className="stack-md">
                <div className="form-group">
                  <span className="form-label">1. Pilih Tema Desain Template</span>
                  <div className="template-picker-grid">
                    {AVAILABLE_TEMPLATES.map((t) => {
                      const isSelected = newTemplateId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          className={`template-option${isSelected ? ' selected' : ''}`}
                          style={isSelected ? { borderColor: t.themeColor, boxShadow: `0 0 0 1px ${t.themeColor}` } : undefined}
                          onClick={() => setNewTemplateId(t.id)}
                        >
                          <span className="template-option-dot" style={{ background: t.themeColor }} />
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{t.name}</span>
                            <span style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-3)' }}>{t.styleTag}</span>
                          </span>
                          {isSelected && <Check size={16} style={{ color: t.themeColor, flexShrink: 0 }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="modal-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-groom">Mempelai Pria (Panggilan) *</label>
                    <input
                      id="new-groom"
                      className="form-input"
                      required
                      placeholder="Contoh: Raka"
                      value={newGroomName}
                      onChange={(e) => {
                        setNewGroomName(e.target.value);
                        if (!newSlug && e.target.value && newBrideName) setNewSlug(`${e.target.value}-${newBrideName}`);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-bride">Mempelai Wanita (Panggilan) *</label>
                    <input
                      id="new-bride"
                      className="form-input"
                      required
                      placeholder="Contoh: Sinta"
                      value={newBrideName}
                      onChange={(e) => {
                        setNewBrideName(e.target.value);
                        if (newGroomName && e.target.value) setNewSlug(`${newGroomName}-${e.target.value}`);
                      }}
                    />
                  </div>
                </div>

                <div className="modal-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-title">Judul Undangan</label>
                    <input id="new-title" className="form-input" placeholder="The Wedding of Raka & Sinta" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-slug">URL Slug Kustom</label>
                    <input id="new-slug" className="form-input" placeholder="raka-sinta" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} />
                    <span className="form-hint">Tautan: /invite/{newSlug || 'nama-slug'}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="new-date">Tanggal Acara Utama (Resepsi)</label>
                  <input id="new-date" type="date" className="form-input" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} />
                </div>

                <div className="modal-footer" style={{ padding: 0, border: 'none' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Buat &amp; Buka Studio <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EXPIRED WARNING */}
      {showExpiredWarningModal && (
        <div className="modal-backdrop" style={{ zIndex: 210 }} onClick={(e) => e.target === e.currentTarget && setShowExpiredWarningModal(false)}>
          <div className="modal" style={{ maxWidth: 440 }}>
            <div className="modal-body" style={{ textAlign: 'center', padding: '32px 26px' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Lock size={26} />
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 8 }}>Langganan Anda Telah Berakhir!</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 20 }}>
                Anda tidak dapat mempublikasikan undangan ke publik karena masa aktif paket telah habis (Expired). Perpanjang paket langganan Anda untuk mengaktifkan kembali fitur publikasi dan menyebarkan undangan ke tamu.
              </p>
              <div className="stack-sm">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowExpiredWarningModal(false);
                    navigateTo('subscription');
                  }}
                >
                  Perpanjang Paket Sekarang <ArrowRight size={15} />
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpiredWarningModal(false)}>
                  Nanti Saja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );

  /* ============ SHELL ============ */

  return (
    <div className="shell">
      <style jsx global>{`
        @keyframes brand-spin {
          to { transform: rotate(360deg); }
        }

        /* Hero */
        .hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 28px; align-items: center; padding: 24px; }
        .hero-title { font-size: clamp(19px, 2.6vw, 26px); line-height: 1.25; }
        .countdown-box {
          display: flex; flex-direction: column; gap: 10px; align-items: center; text-align: center;
          background: var(--surface-sunken); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 18px 22px;
        }
        .countdown-row { display: flex; gap: 8px; }
        .countdown-unit {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
          padding: 8px 6px; min-width: 56px; text-align: center;
        }
        .countdown-unit strong { display: block; font-size: 19px; font-weight: 700; color: var(--brand); font-variant-numeric: tabular-nums; line-height: 1.2; }
        .countdown-unit span { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-3); }

        /* Checklist */
        .checklist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 10px; }
        .checklist-item {
          display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px;
          border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface);
          transition: background 0.12s ease, border-color 0.12s ease;
        }
        .checklist-item.done { background: var(--success-bg); border-color: var(--success-border); }

        /* Invitations */
        .inv-section-head { justify-content: space-between; align-items: flex-end; margin-bottom: 14px; }
        .inv-toolbar { margin-top: 8px; }
        .inv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr)); gap: 16px; }
        .inv-card-header { padding: 18px 20px; color: #fff; }
        .inv-template-badge { background: rgba(255,255,255,0.18); color: #fff; backdrop-filter: blur(4px); text-transform: uppercase; letter-spacing: 0.04em; }
        .inv-badge-live { background: var(--success); color: #fff; }
        .inv-badge-locked { background: var(--danger); color: #fff; }
        .inv-badge-draft { background: rgba(255,255,255,0.25); color: #fff; }
        .inv-slug-row { justify-content: space-between; padding: 7px 10px; background: var(--surface-sunken); border-radius: var(--radius-sm); }
        .inv-slug { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--ink-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .inv-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .inv-meta-label { display: block; font-size: 11px; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.03em; }
        .inv-meta-grid strong { font-size: 13px; font-weight: 600; color: var(--ink); }
        .inv-actions-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .inv-guest-link { display: inline-flex; align-items: center; gap: 4px; font-size: 12.5px; font-weight: 600; color: var(--brand); text-decoration: none; }
        .inv-add-new {
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
          min-height: 300px; padding: 28px 20px; text-align: center; cursor: pointer;
          border: 1.5px dashed var(--border-strong); border-radius: var(--radius-md);
          background: transparent; transition: border-color 0.12s ease, background 0.12s ease;
        }
        .inv-add-new:hover { border-color: var(--brand); background: var(--brand-subtle); }
        .inv-add-icon {
          width: 52px; height: 52px; border-radius: 50%;
          background: var(--surface-sunken); color: var(--ink-2);
          display: flex; align-items: center; justify-content: center;
        }

        /* Studio */
        .studio-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .studio-page { max-width: 1440px; }
        .studio-page-title { font-size: 20px; font-weight: 650; line-height: 1.4; }
        .studio-toolbar > div { min-width: 0; }
        .studio-toolbar .card-subtitle { margin-top: 4px; line-height: 1.6; }
        .studio-grid { display: grid; grid-template-columns: minmax(0, 1fr) 385px; gap: 24px; align-items: start; }
        .studio-editor-panel { min-width: 0; }
        .studio-editor-col { container: studio-editor / inline-size; }
        .studio-preview-col { position: sticky; top: 72px; }
        .studio-stack, .studio-content-editor { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
        .studio-surface, .editor-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; min-width: 0; }
        .editor-section > h3, .editor-section > h4, .editor-section-heading h4 { font-size: 14px; font-weight: 600; line-height: 1.5; }
        .editor-section > h3, .editor-section > h4, .editor-section-heading { margin-bottom: 16px; }
        .editor-section > .form-group + .form-group, .editor-section > .editor-fields + .form-group { margin-top: 14px; }
        .editor-section > .form-label { display: block; margin-bottom: 8px; }
        .editor-section-heading, .editor-field-heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
        .editor-section-heading h4 { min-width: 0; overflow-wrap: anywhere; }
        .editor-field-heading .form-label { flex: 1; min-width: 100px; }
        .editor-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 14px; }
        .editor-couple-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 20px; }
        .editor-fields-story { grid-template-columns: 110px minmax(0, 1fr); }
        .studio-editor-panel .form-group { min-width: 0; }
        .studio-editor-panel .form-input, .studio-editor-panel .form-select, .studio-editor-panel .form-textarea { min-width: 0; max-width: 100%; }
        .studio-editor-panel .btn { white-space: normal; text-align: center; }
        .studio-editor-panel .btn svg { flex-shrink: 0; }
        .studio-editor-panel .form-hint { overflow-wrap: anywhere; line-height: 1.5; }
        .editor-tabs { display: flex; gap: 4px; flex-wrap: wrap; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
        .editor-tabs .tab { padding: 7px 10px; border: 1px solid transparent; border-radius: var(--radius-sm); font-size: 12.5px; }
        .editor-tabs .tab.active { background: var(--brand-subtle); border-color: var(--info-border); color: var(--brand); }
        .editor-section-select { display: none; }
        .editor-presets { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .editor-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 130px), 1fr)); gap: 12px; }
        .studio-actions, .studio-section-toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
        .studio-section-toolbar { justify-content: space-between; gap: 12px; }
        .studio-section-toolbar .search-box { width: min(300px, 100%); }
        .studio-result-count { font-size: 12.5px; color: var(--ink-3); }
        .studio-filters { display: flex; flex-wrap: wrap; gap: 6px; }
        .studio-filters .chip { border-radius: var(--radius-sm); padding: 5px 10px; }
        .studio-filters .chip.active { background: var(--brand-subtle); color: var(--brand); border-color: var(--info-border); }
        .studio-empty { background: var(--surface); border: 1px dashed var(--border-strong); border-radius: var(--radius-md); }
        .studio-editor-panel :is(button, a, select):focus-visible, .preview-controls :is(button, a, input):focus-visible { outline: 2px solid var(--brand); outline-offset: 3px; }
        .template-catalog { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap: 16px; }
        .template-design { min-width: 0; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); }
        .template-design.is-selected { border-color: var(--brand); box-shadow: 0 0 0 1px var(--brand); }
        .template-design-image { position: relative; height: 180px; overflow: hidden; background: var(--surface-hover); }
        .template-design-image img { width: 100%; height: 100%; object-fit: cover; }
        .template-design-image .badge { position: absolute; top: 12px; right: 12px; background: var(--surface); border: 1px solid var(--border); }
        .template-design-body { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
        .template-design-body h3 { font-size: 15px; line-height: 1.5; }
        .template-design-body p { font-size: 12.5px; line-height: 1.6; color: var(--ink-3); }
        .template-design-meta { font-size: 10.5px; text-transform: uppercase; letter-spacing: .04em; color: var(--ink-3); }
        .template-design-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding-top: 12px; margin-top: 4px; border-top: 1px solid var(--border-subtle); }
        .template-swatches { display: flex; gap: 6px; }
        .template-swatches span { width: 16px; height: 16px; border: 1px solid rgba(0,0,0,.12); border-radius: 50%; }
        .guest-add-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); }
        .guest-add-header .segmented { max-width: 100%; }
        .guest-form-grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, .8fr); gap: 14px; }
        .guest-import-footer { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-top: 14px; }
        .guest-import-category { display: flex; flex-direction: column; gap: 6px; }
        .guest-table .guest-name { font-weight: 500; color: var(--ink); min-width: 140px; overflow-wrap: anywhere; }
        .guest-table .guest-link { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .guest-row-actions { display: flex; align-items: center; justify-content: flex-end; gap: 6px; }
        .rsvp-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        .rsvp-stats .stat-card { display: flex; flex-direction: column; padding: 16px; min-width: 0; box-shadow: none; }
        .rsvp-stats .stat-card-label { font-size: 11px; letter-spacing: .02em; }
        .rsvp-stats .stat-card-desc { line-height: 1.5; }
        .rsvp-feed { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); }
        .rsvp-item { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 20px; }
        .rsvp-item + .rsvp-item { border-top: 1px solid var(--border-subtle); }
        .rsvp-message { display: flex; gap: 12px; min-width: 0; }
        .rsvp-message-body { min-width: 0; overflow-wrap: anywhere; }
        .rsvp-message-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
        .rsvp-timestamp { display: block; margin-top: 8px; font-size: 11.5px; color: var(--ink-3); }
        .live-preview { display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; max-width: 385px; margin: 0 auto; }
        .preview-controls { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); }
        .preview-controls-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 12px; }
        .preview-controls-title { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600; }
        .preview-guest { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-top: 1px solid var(--border-subtle); }
        .preview-guest label { font-size: 11.5px; color: var(--ink-3); flex-shrink: 0; }
        .preview-guest input { width: 100%; min-width: 0; border: 0; background: transparent; font: inherit; font-size: 12px; padding: 4px 0; color: var(--ink); }
        .preview-device { position: relative; width: 100%; max-width: 375px; }
        .preview-device > .phone-mockup { position: absolute; top: 0; left: 50%; margin-left: -187.5px; width: 375px; max-width: none; height: 720px; transform-origin: top center; }
        .preview-note { font-size: 11.5px; color: var(--ink-3); text-align: center; line-height: 1.6; max-width: 300px; }
        @container studio-editor (max-width: 640px) {
          .editor-tabs { display: none; }
          .editor-section-select { display: flex; flex-direction: column; gap: 6px; }
          .editor-couple-grid, .guest-form-grid { grid-template-columns: minmax(0, 1fr); }
          .rsvp-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @container studio-editor (max-width: 420px) {
          .studio-surface, .editor-section { padding: 16px; }
          .editor-fields { grid-template-columns: minmax(0, 1fr); }
          .studio-section-toolbar > .search-box { width: 100%; }
          .guest-add-header { align-items: stretch; flex-direction: column; }
          .guest-add-header .segmented > button { flex: 1; }
          .rsvp-item { padding: 16px; gap: 8px; }
          .rsvp-message { gap: 8px; }
          .rsvp-stats { gap: 8px; }
          .rsvp-stats .stat-card { padding: 12px; }
        }
        .studio-preview-toggle { display: none; }
        .studio-topbar-left { min-width: 0; flex: 1; }
        .studio-topbar-actions { flex-shrink: 0; gap: 8px; }
        .studio-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .studio-subtitle { font-size: 12px; color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .studio-grid-wide { grid-template-columns: minmax(0, 1fr); }
        .studio-editor-col, .studio-preview-col { min-width: 0; }
        .studio-sidebar-back { padding: 10px 8px; border-bottom: 1px solid var(--border); }
        .studio-project-context { padding: 16px; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .studio-project-context strong { font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
        .studio-project-context > span:not(.badge) { font-size: 11.5px; color: var(--ink-3); overflow-wrap: anywhere; }
        .console-page-heading { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 22px; }
        .console-project-select { width: min(320px, 100%); }
        .console-tool-content { max-width: 960px; }
        .shell .sidebar svg { flex-shrink: 0; }
        .shell .sidebar.open { z-index: 100; }

        /* Template picker (create modal) */
        .template-picker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .template-option {
          display: flex; align-items: center; gap: 10px; text-align: left;
          padding: 12px; border: 1.5px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface); cursor: pointer;
          transition: border-color 0.12s ease, box-shadow 0.12s ease;
        }
        .template-option:hover { border-color: var(--border-strong); }
        .template-option-dot { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.2); flex-shrink: 0; }

        /* Pricing */
        .pricing-2col { align-items: stretch; }
        .pricing-card { padding: 20px; gap: 18px; display: flex; flex-direction: column; justify-content: space-between; }
        .pricing-card-pro { border: 2px solid var(--brand); background: var(--brand-subtle); }
        .pricing-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; color: var(--ink-2); }
        .pricing-list li::before { content: '✓'; color: var(--success); font-weight: 700; margin-right: 8px; }

        /* Reception */
        .reception-list { display: flex; flex-direction: column; gap: 8px; }
        .reception-item {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface);
          transition: background 0.12s ease, border-color 0.12s ease;
        }
        .reception-item.done { background: var(--success-bg); border-color: var(--success-border); }

        .modal-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        @media (max-width: 1180px) {
          .studio-grid { grid-template-columns: 1fr; }
          .studio-preview-col { position: static; }
          .studio-preview-toggle { display: inline-flex; }
          .studio-hidden-mobile { display: none; }
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .topbar-hide-sm { display: none; }
          .modal-2col, .pricing-2col { grid-template-columns: 1fr; }
          .countdown-unit { min-width: 48px; }
          .countdown-unit strong { font-size: 16px; }
          .inv-toolbar { width: 100%; }
          .inv-toolbar .search-box { width: 100%; }
          .studio-toolbar { flex-direction: column; align-items: stretch; }
          .shell .topbar { height: auto; min-height: var(--topbar-h); flex-wrap: wrap; padding: 10px 16px; }
          .studio-topbar-left { width: 100%; flex-basis: 100%; }
          .studio-topbar-actions { width: 100%; justify-content: flex-end; }
          .inv-template-badge { max-width: 68%; overflow: hidden; text-overflow: ellipsis; display: block; }
          .reception-item { flex-wrap: wrap; }
          .reception-item .row-nowrap { flex-wrap: wrap; }
          .console-project-select { width: 100%; }
          .studio-page { padding: 20px 16px; }
          .studio-page-title { font-size: 18px; }
          .studio-stack, .studio-content-editor { gap: 16px; }
          .guest-table { display: block; }
          .guest-table thead { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); }
          .guest-table tbody { display: block; }
          .guest-table tbody tr { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; padding: 16px; }
          .guest-table tbody tr + tr { border-top: 1px solid var(--border); }
          .guest-table td { border: 0; padding: 0; min-width: 0; }
          .guest-table .guest-name { min-width: 0; }
          .guest-table td:nth-child(3), .guest-table td:nth-child(4), .guest-table td:nth-child(5), .guest-table .table-empty { grid-column: 1 / -1; }
          .guest-table td[data-label]::before { content: attr(data-label); font-size: 11px; color: var(--ink-3); margin-right: 8px; }
          .guest-table .guest-link { max-width: 100%; }
          .guest-row-actions { justify-content: flex-start; flex-wrap: wrap; padding-top: 4px; }
          .studio-editor-panel .modal-header, .studio-editor-panel .modal-body, .studio-editor-panel .modal-footer { padding: 16px; }
          .studio-editor-panel .modal-header > div { min-width: 0; overflow-wrap: anywhere; }
          .studio-topbar-actions { flex-wrap: wrap; }
          .hero-grid { padding: 16px; }
        }
      `}</style>

      {renderSidebar()}
      <main className="shell-main">{viewMode === 'studio' ? renderStudio() : viewMode === 'dashboard' ? renderDashboard() : renderConsolePage()}</main>
      {renderModals()}
      {toastHost}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--canvas)' }}>
          <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <BrandLogo size={34} spin />
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>Memuat Konsol InfoMase...</span>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
