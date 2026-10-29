import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';

const archivo = localFont({
  src: [
    { path: '../fonts/Archivo-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/Archivo-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/Archivo-Medium.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/Archivo-Medium.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/Archivo-Medium.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'InfoMase - Bikin Undangan Digital Sat-Set, Tamu Auto Merapat!',
  description: 'Info acara mase! Bikin undangan digital sat-set, tamu auto merapat. Praktis, mewah, musik romantis autoplay, amplop QRIS langsung cair, dan peta Google Maps anti nyasar.',
  keywords: ['undangan online', 'undangan pernikahan digital', 'infomase', 'wedding invitation', 'undangan web sat set'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${archivo.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
