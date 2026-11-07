import type { Metadata } from 'next';
import KatalogClient from './KatalogClient';

export const metadata: Metadata = {
  title: 'Katalog Template Undangan',
  description:
    'Pilih desain undangan pernikahan digital: sekali bayar per template, aktif permanen tanpa langganan.',
  openGraph: {
    title: 'Katalog Template Undangan · InfoMase',
    description:
      'Pilih desain undangan pernikahan digital: sekali bayar per template, aktif permanen tanpa langganan.',
  },
};

export default function KatalogPage() {
  return <KatalogClient />;
}
