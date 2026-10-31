'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarCheck2,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  MessageSquareHeart,
  FileText,
  Palette,
  Plus,
  Receipt,
  Star,
  Users,
  X,
} from 'lucide-react';
import { Wordmark } from '@/components/ui/Brand';
import { useAuth } from '@/lib/authContext';
import { useInvitationStore } from '@/lib/invitationStore';

export interface RailInvitationSummary {
  id: string;
  title: string;
  slug: string;
}

interface ConsoleRailProps {
  open: boolean;
  onClose: () => void;
  invitations: RailInvitationSummary[];
  activeId: string;
  onCreate: () => void;
  onLogout: () => void;
}

const STUDIO_ITEMS = [
  { key: 'design', label: 'Desain & lisensi', icon: Palette },
  { key: 'content', label: 'Konten', icon: FileText },
  { key: 'guests', label: 'Tamu & WhatsApp', icon: Users },
  { key: 'rsvp', label: 'RSVP & ucapan', icon: MessageSquareHeart },
  { key: 'day', label: 'Hari-H', icon: CalendarCheck2 },
];

export function ConsoleRail({ open, onClose, invitations, activeId, onCreate, onLogout }: ConsoleRailProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { data } = useInvitationStore();

  const studioMatch = pathname.match(/^\/dashboard\/undangan\/([^/]+)/);
  const studioId = studioMatch?.[1];
  const studioInvitation = studioId ? invitations.find((item) => item.id === studioId) : undefined;
  const studio = studioInvitation
    ? { id: studioInvitation.id, title: studioInvitation.title, slug: studioInvitation.slug }
    : studioId
      ? { id: studioId, title: data.title, slug: data.slug }
      : null;

  const accountItems = [
    { key: 'overview', label: 'Ringkasan', icon: LayoutGrid, href: '/dashboard' },
    { key: 'orders', label: 'Pesanan & lisensi', icon: Receipt, href: '/dashboard/orders' },
    { key: 'katalog', label: 'Katalog template', icon: Star, href: '/dashboard/katalog' },
  ];

  const isActive = (key: string) =>
    (key === 'overview' && pathname === '/dashboard') || pathname === `/dashboard/${key}`;

  return (
    <>
      <div
        className={`sidebar-backdrop${open ? ' show' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={`rail${open ? ' open' : ''}`} aria-label="Navigasi konsol">
        <div className="rail-head">
          <Wordmark size={24} onClick={onClose} />
          <button
            type="button"
            className="btn btn-icon btn-sm btn-ghost rail-close"
            onClick={onClose}
            aria-label="Tutup menu"
          >
            <X size={16} />
          </button>
        </div>

        {studio ? (
          <>
            <div className="rail-context">
              <span className="rail-context-label">Sedang diedit</span>
              <div className="rail-context-title">{studio.title}</div>
              <div className="rail-context-slug">/invite/{studio.slug}</div>
            </div>

            <nav className="rail-nav" aria-label="Bagian undangan">
              {STUDIO_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={`/dashboard/undangan/${studio.id}/${item.key}`}
                    className="rail-item"
                    aria-current={
                      pathname === `/dashboard/undangan/${studio.id}/${item.key}` ? 'page' : undefined
                    }
                    onClick={onClose}
                  >
                    <Icon size={16} /> {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="sidebar-footer stack-2">
              <Link
                href={`/invite/${studio.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-secondary btn-block"
              >
                Lihat undangan publik
              </Link>
            </div>
          </>
        ) : (
          <>
            <nav className="rail-nav" aria-label="Navigasi akun">
              <span className="sidebar-section-label">Akun</span>
              {accountItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="rail-item"
                    aria-current={isActive(item.key) ? 'page' : undefined}
                    onClick={onClose}
                  >
                    <Icon size={16} /> {item.label}
                  </Link>
                );
              })}

              <span className="sidebar-section-label">Undangan Anda</span>
              {invitations.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/dashboard/undangan/${inv.id}/content`}
                  className="rail-item"
                  onClick={onClose}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: inv.id === activeId ? 'var(--brand)' : 'var(--ink-300)',
                      flexShrink: 0,
                    }}
                  />
                  <span className="text-truncate">{inv.title}</span>
                </Link>
              ))}

              <button type="button" className="rail-item" onClick={onCreate}>
                <Plus size={16} /> Undangan baru
              </button>

              <span className="sidebar-section-label">Bantuan</span>
              <a
                href="https://wa.me/6281234567890"
                className="rail-item"
                target="_blank"
                rel="noreferrer"
              >
                <LifeBuoy size={16} /> Hubungi dukungan
              </a>
            </nav>

            <div className="sidebar-footer">
              {user ? (
                <div className="rail-account">
                  <span className="avatar" title={user.email}>
                    {user.name?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                  <div className="rail-account-name">
                    <b>{user.name || 'Akun saya'}</b>
                    <span>{user.email}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost btn-icon"
                    onClick={onLogout}
                    aria-label="Keluar"
                    title="Keluar"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <div className="stack-2">
                  <div className="rail-account">
                    <span className="avatar">?</span>
                    <div className="rail-account-name">
                      <b>Mode baca</b>
                      <span className="rail-account-hint">Masuk untuk menyimpan perubahan</span>
                    </div>
                  </div>
                  <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                    <Link href="/login" className="btn btn-sm btn-primary" style={{ flex: 1 }}>
                      Masuk
                    </Link>
                    <Link href="/register" className="btn btn-sm btn-secondary" style={{ flex: 1 }}>
                      Daftar
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export function RailToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="btn btn-icon btn-sm btn-ghost sidebar-mobile-toggle"
      onClick={onClick}
      aria-label="Buka menu navigasi"
    >
      <LayoutGrid size={18} />
    </button>
  );
}

export function RailClose({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="btn btn-icon btn-sm btn-ghost" onClick={onClick} aria-label="Tutup menu">
      <X size={16} />
    </button>
  );
}
