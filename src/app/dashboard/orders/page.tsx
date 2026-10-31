import type { Metadata } from 'next';
import OrdersScreen from './OrdersScreen';

export const metadata: Metadata = {
  title: 'Pesanan & lisensi',
  // inherits the `%s · InfoMase` template from the root layout
  description: 'Riwayat pembelian dan lisensi template yang aktif untuk setiap undangan.',
  openGraph: { title: 'Pesanan & lisensi', description: 'Riwayat pembelian dan lisensi template yang aktif untuk setiap undangan.' },
};

export default function Page() {
  return <OrdersScreen />;
}
