import type { Metadata } from 'next';
import LoginScreen from './LoginScreen';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke konsol InfoMase untuk mengelola undangan Anda.',
  robots: { index: false, follow: false },
  openGraph: { title: 'Masuk', description: 'Masuk ke konsol InfoMase untuk mengelola undangan Anda.' },
};

export default function Page() {
  return <LoginScreen />;
}
