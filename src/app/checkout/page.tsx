import type { Metadata } from 'next';
import CheckoutScreen from './CheckoutScreen';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Selesaikan pembelian lisensi template. Bayar sekali, undangan itu milik Anda.',
  robots: { index: false, follow: false },
  openGraph: { title: 'Checkout', description: 'Selesaikan pembelian lisensi template. Bayar sekali, undangan itu milik Anda.' },
};

export default function Page() {
  return <CheckoutScreen />;
}
