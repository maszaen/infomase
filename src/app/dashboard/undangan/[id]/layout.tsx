import type { Metadata } from 'next';
import StudioChrome from './StudioChrome';

export const metadata: Metadata = {
  title: 'Studio undangan',
  description: 'Edit konten, tamu, RSVP, dan desain undangan Anda.',
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  return <StudioChrome params={params}>{children}</StudioChrome>;
}
