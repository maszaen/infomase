import { MarketingNav } from '@/components/marketing/MarketingNav';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { LandingPage } from '@/components/marketing/LandingPage';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <MarketingNav />
      <main id="konten" style={{ flex: 1 }}>
        <LandingPage />
      </main>
      <MarketingFooter />
    </div>
  );
}
