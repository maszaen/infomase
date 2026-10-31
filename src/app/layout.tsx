import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo/wght.css';
import '@fontsource-variable/archivo/wght-italic.css';
import '@fontsource-variable/cormorant-garamond/wght.css';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource/alex-brush/latin-400.css';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://infomase.id'),
  title: {
    default: 'InfoMase — Beli template undangan digital, sekali bayar',
    template: '%s · InfoMase',
  },
  description:
    'Pilih template undangan pernikahan digital, bayar sekali per template, dan undangan itu jadi milik Anda untuk acara tersebut. Editor live, RSVP real-time, amplop digital, dan broadcast WhatsApp personal.',
  keywords: [
    'undangan pernikahan digital',
    'template undangan online',
    'undangan web',
    'rsvp online',
    'infomase',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'InfoMase — Beli template undangan digital, sekali bayar',
    description:
      'Template undangan pernikahan digital yang bisa Anda beli satu per satu. Sekali bayar, satu undangan, tanpa langganan.',
  },
};

export const viewport: Viewport = {
  // ink-900: the browser chrome should match the dark console header.
  themeColor: '#14151a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <a href="#konten" className="skip-link">
          Lompat ke konten
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
