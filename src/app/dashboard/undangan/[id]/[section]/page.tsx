'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarCheck2, FileText, MessageSquareHeart, Palette, Users } from 'lucide-react';
import { DesignSection } from '@/components/console/sections/DesignSection';
import { ContentSection } from '@/components/console/sections/ContentSection';
import { GuestsSection } from '@/components/console/sections/GuestsSection';
import { RsvpSection } from '@/components/console/sections/RsvpSection';
import { DaySection } from '@/components/console/sections/DaySection';

const SECTIONS = {
  design: { title: 'Desain & lisensi', icon: Palette, Component: DesignSection },
  content: { title: 'Konten undangan', icon: FileText, Component: ContentSection },
  guests: { title: 'Tamu & WhatsApp', icon: Users, Component: GuestsSection },
  rsvp: { title: 'RSVP & ucapan', icon: MessageSquareHeart, Component: RsvpSection },
  day: { title: 'Hari-H', icon: CalendarCheck2, Component: DaySection },
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
        {(Object.keys(SECTIONS) as SectionKey[]).map((item) => {
          const { title, icon: Icon } = SECTIONS[item];
          const active = item === key;
          return (
            <Link
              key={item}
              href={`/dashboard/undangan/${id}/${item}`}
              className={`tab${active ? ' is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={14} aria-hidden />
              {title}
            </Link>
          );
        })}
      </nav>

      <Component invitationId={id} />
    </div>
  );
}
