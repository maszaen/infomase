import { redirect } from 'next/navigation';

export default async function StudioIndex({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/dashboard/undangan/${id}/content`);
}
