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

function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout } = useAuth();
  const { invitations, activeId } = useInvitationStore();
  const { railOpen, closeRail, openCreate, createOpen, closeCreate } = useConsoleChrome();

  return (
    <div className="shell">
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
      <CreateInvitationModal open={createOpen} onClose={closeCreate} />
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
