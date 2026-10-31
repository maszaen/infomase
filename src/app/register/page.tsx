import type { Metadata } from 'next';
import RegisterScreen from './RegisterScreen';

export const metadata: Metadata = {
  title: 'Buat akun',
  description: 'Buat akun InfoMase dan mulai menyusun undangan pernikahan digital Anda.',
  robots: { index: false, follow: false },
  openGraph: { title: 'Buat akun', description: 'Buat akun InfoMase dan mulai menyusun undangan pernikahan digital Anda.' },
};

export default function Page() {
  return <RegisterScreen />;
}
