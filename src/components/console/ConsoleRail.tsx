'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  CreditCard,
  LayoutGrid,
  LogOut,
  Menu,
  Plus,
  Receipt,
  Star,
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

/**
 * Navigation was previously a flat list of six items where three were the same
 * destination. Now there are exactly two levels:
 *   account level  → Ringkasan / Pesanan
 *   invitation level → Studio (Design, Konten, Tamu, RSVP, Hari-H)
 */
export function ConsoleRail({ open, onClose, invitations, activeId, onCreate, onLogout }: ConsoleRailProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { data } = useInvitationStore();

  // Studio context comes from the route, so the rail can never disagree with
  // the page header about which invitation is open.
  const inStudio = pathname.startsWith('/dashboard/undangan/');
  const studio = inStudio ? { title: data.title, slug: data.slug } : null;

  const accountItems = [
    { key: 'overview', label: 'Ringkasan', icon: LayoutGrid, href: '/dashboard' },
    { key: 'orders', label: 'Pesanan & lisensi', icon: Receipt, href: '/dashboard/orders' },
    { key: 'katalog', label: 'Katalog template', icon: Star, href: '/dashboard/katalog' },
  ];

  const isActive = (key: string) =>
    (key === 'overview' && pathname === '/dashboard') || pathname === `/dashboard/${key}`;

  return (
    <>
      <div className={`sidebar-backdrop${open ? ' show' : ''}`} onClick={onClose} aria-hidden={!open} />
      <aside className={`rail${open ? ' open' : ''}`} aria-label="Navigasi konsol">
        <div className="rail-brand">
          <Wordmark size={24} />
        </div>

        {studio ? (
          <>
            <div style={{ padding: 'var(--space-3) var(--space-3) 0' }}>
              <Link href="/dashboard" className="btn btn-sm btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <ChevronLeft size={15} /> Semua undangan
              </Link>
            </div>

            <div style={{ padding: 'var(--space-3) var(--space-4) var(--space-2)', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="label" style={{ fontSize: 'var(--text-2xs)' }}>
                Sedang diedit
              </span>
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 620,
                  color: 'var(--ink-900)',
                  marginTop: 'var(--space-0-5)',
                  overflowWrap: 'anywhere',
                }}
              >
                {studio.title}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-2xs)',
                  color: 'var(--ink-500)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                /invite/{studio.slug}
              </div>
            </div>

            <nav className="rail-nav" aria-label="Bagian undangan">
              {[
                { key: 'design', label: 'Desain & lisensi' },
                { key: 'content', label: 'Konten' },
                { key: 'guests', label: 'Tamu & WhatsApp' },
                { key: 'rsvp', label: 'RSVP & ucapan' },
                { key: 'day', label: 'Hari-H' },
              ].map((item) => (
                <Link
                  key={item.key}
                  href={`/dashboard/undangan/${activeId}/${item.key}`}
                  className="rail-item"
                  aria-current={pathname === `/dashboard/undangan/${activeId}/${item.key}` ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="sidebar-footer">
              <Link
                href={`/invite/${studio.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-secondary"
                style={{ width: '100%' }}
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
                  style={{ gap: 8 }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: inv.id === activeId ? 'var(--brand)' : 'var(--ink-300)',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {inv.title}
                  </span>
                </Link>
              ))}

              <button type="button" className="rail-item" onClick={onCreate} style={{ marginTop: 4 }}>
                <Plus size={16} /> Undangan baru
              </button>

              <span className="sidebar-section-label">Bantuan</span>
              <a
                href="https://wa.me/6281234567890"
                className="rail-item"
                target="_blank"
                rel="noreferrer"
              >
                <CreditCard size={16} /> Hubungi dukungan
              </a>
            </nav>

            <div className="sidebar-footer">
              <div className="row-nowrap" style={{ gap: 8 }}>
                <span className="avatar" title={user?.email ?? ''}>
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--ink-900)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.name ?? 'Tamu'}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-2xs)',
                      color: 'var(--ink-500)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.email ?? 'belum masuk'}
                  </div>
                </div>
                <button type="button" className="btn btn-sm btn-ghost btn-icon" onClick={onLogout} aria-label="Keluar">
                  <LogOut size={15} />
                </button>
              </div>
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
      <Menu size={18} />
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
