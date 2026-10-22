import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display, Cinzel } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
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
    <html lang="id" className={`${jakarta.variable} ${playfair.variable} ${cinzel.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
