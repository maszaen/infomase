'use client';

import React, { Suspense, use } from 'react';
import { notFound } from 'next/navigation';
import { DesignSection } from '@/components/console/sections/DesignSection';
import { ContentSection } from '@/components/console/sections/ContentSection';
import { GuestsSection } from '@/components/console/sections/GuestsSection';
import { RsvpSection } from '@/components/console/sections/RsvpSection';
import { DaySection } from '@/components/console/sections/DaySection';

const SECTIONS = {
  design: DesignSection,
  content: ContentSection,
  guests: GuestsSection,
  rsvp: RsvpSection,
  day: DaySection,
} as const;

type SectionKey = keyof typeof SECTIONS;

function StudioSectionContent({
  params,
}: {
  params: Promise<{ id: string; section: string }>;
}) {
  const { id, section } = use(params);
  const key = section as SectionKey;

  if (!(key in SECTIONS)) notFound();

  const Section = SECTIONS[key];

  return (
    <div className="page-content">
      <Section invitationId={id} />
    </div>
  );
}

export default function StudioSectionPage({
  params,
}: {
  params: Promise<{ id: string; section: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="page-content">
          <span className="meta">Memuat bagian…</span>
        </div>
      }
    >
      <StudioSectionContent params={params} />
    </Suspense>
  );
}
