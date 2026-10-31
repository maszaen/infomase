import type { Metadata } from 'next';
import InvitationView from './InvitationView';

/**
 * The invitation itself is a private, client-rendered experience, but the link
 * is shared in WhatsApp — so the *preview* has to look like a wedding, not like
 * the product. Title/description come from the slug; the artwork is the
 * template's poster frame.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pretty = slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' & ');

  const title = pretty ? `${pretty} — Undangan Pernikahan` : 'Undangan Pernikahan';
  const description = pretty
    ? `Undangan pernikahan ${pretty}. Buka tautan untuk melihat detail acara, RSVP, dan mengirim ucapan.`
    : 'Undangan pernikahan digital. Buka tautan untuk melihat detail acara dan mengirim RSVP.';

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: 'article',
      images: [{ url: '/template/undangan_1/img/foto_mempelai_dummy.jpg' }],
    },
  };
}

export default function InvitePage() {
  return <InvitationView />;
}
