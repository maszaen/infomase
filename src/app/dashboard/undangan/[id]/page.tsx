import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';

async function RedirectToContent({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactNode> {
  const { id } = await params;
  redirect(`/dashboard/undangan/${id}/content`);
  return null;
}

export default function StudioIndex({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <RedirectToContent params={params} />
    </Suspense>
  );
}
