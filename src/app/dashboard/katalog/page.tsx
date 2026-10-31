import type { Metadata } from 'next';
import KatalogScreen from './KatalogScreen';

export const metadata: Metadata = {
  title: 'Katalog template',
  // inherits the `%s · InfoMase` template from the root layout
  description: 'Pilih desain undangan: satu desain, satu harga, satu acara.',
  robots: { index: false, follow: false },
  openGraph: { title: 'Katalog template', description: 'Pilih desain undangan: satu desain, satu harga, satu acara.' },
};

export default function Page() {
  return <KatalogScreen />;
}
