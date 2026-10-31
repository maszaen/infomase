import type { Metadata } from 'next';
import DashboardShell from '@/components/console/DashboardShell';

export const metadata: Metadata = {
  title: { default: 'Konsol', template: '%s · InfoMase' },
  description:
    'Kelola undangan, tamu, RSVP, dan lisensi template Anda dari satu tempat.',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
