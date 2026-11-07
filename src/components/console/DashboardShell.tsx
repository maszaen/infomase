'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { InvitationProvider, useInvitationStore } from '@/lib/invitationStore';
import { ToastProvider } from '@/components/ui/Toast';
import { ConsoleRail } from '@/components/console/ConsoleRail';
import { CreateInvitationModal } from '@/components/console/CreateInvitationModal';
import { useAuth } from '@/lib/authContext';
import { BrandMark } from '@/components/ui/Brand';
import { ConsoleChromeProvider, useConsoleChrome } from '@/components/console/ConsoleChrome';

const subscribeNoop = () => () => {};

function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { invitations, activeId } = useInvitationStore();
  const { railOpen, closeRail, openCreate, createOpen, createTemplateId, closeCreate } = useConsoleChrome();
  const isImpersonating = React.useSyncExternalStore(
    subscribeNoop,
    () => sessionStorage.getItem('is_impersonating') === 'true',
    () => false
  );

  return (
    <div className="shell">
      {isImpersonating && (
        <aside
          role="status"
          aria-label="Mode impersonasi admin aktif"
          className="impersonate-banner"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 9999,
            width: '100%',
            background: 'var(--brand-warn, #b45309)',
            color: '#ffffff',
            padding: '7px 16px',
            fontSize: '12.5px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <span>
            🛡️ <strong>Mode Bantuan Admin:</strong> Anda sedang mengelola workspace klien <strong>{user?.name || 'Klien'}</strong> ({user?.email})
          </span>
          <a
            href="http://localhost:8080/admin/users"
            onClick={() => sessionStorage.removeItem('is_impersonating')}
            style={{
              background: '#ffffff',
              color: '#b45309',
              padding: '3px 10px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '11.5px',
              textDecoration: 'none',
              marginLeft: '12px',
            }}
          >
            Kembali ke Admin Console &rarr;
          </a>
        </aside>
      )}
      <ConsoleRail
        open={railOpen}
        onClose={closeRail}
        invitations={invitations.map((i) => ({ id: i.id, title: i.title, slug: i.slug }))}
        activeId={activeId}
        onCreate={openCreate}
        onLogout={async () => {
          await logout();
          router.push('/');
        }}
      />
      <main className="shell-main">{children}</main>
      <CreateInvitationModal open={createOpen} onClose={closeCreate} initialTemplateId={createTemplateId} />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface-sunken)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <BrandMark size={34} />
            <span className="meta">Memuat konsol…</span>
          </div>
        </div>
      }
    >
      <ToastProvider>
        <InvitationProvider>
          <ConsoleChromeProvider>
            <Shell>{children}</Shell>
          </ConsoleChromeProvider>
        </InvitationProvider>
      </ToastProvider>
    </Suspense>
  );
}
