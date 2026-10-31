'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DesignSection } from '@/components/console/sections/DesignSection';
import { ContentSection } from '@/components/console/sections/ContentSection';
import { GuestsSection } from '@/components/console/sections/GuestsSection';
import { RsvpSection } from '@/components/console/sections/RsvpSection';
import { DaySection } from '@/components/console/sections/DaySection';

const SECTIONS = {
  design: { title: 'Desain & lisensi', Component: DesignSection },
  content: { title: 'Konten undangan', Component: ContentSection },
  guests: { title: 'Tamu & WhatsApp', Component: GuestsSection },
  rsvp: { title: 'RSVP & ucapan', Component: RsvpSection },
  day: { title: 'Hari-H', Component: DaySection },
} as const;

type SectionKey = keyof typeof SECTIONS;

export default function StudioSectionPage({
  params,
}: {
  params: Promise<{ id: string; section: string }>;
}) {
  const { id, section } = use(params);
  const key = section as SectionKey;

  if (!(key in SECTIONS)) notFound();

  const { Component } = SECTIONS[key];

  return (
    <div className="page-content">
      <nav className="studio-tabs" aria-label="Bagian undangan">
        {(Object.keys(SECTIONS) as SectionKey[]).map((item) => (
          <Link
            key={item}
            href={`/dashboard/undangan/${id}/${item}`}
            className="tab"
            aria-current={item === key ? 'page' : undefined}
            style={item === key ? { color: 'var(--ink-900)', borderBottomColor: 'var(--brand)', fontWeight: 620 } : undefined}
          >
            {SECTIONS[item].title}
          </Link>
        ))}
      </nav>

      <Component invitationId={id} />
    </div>
  );
}
