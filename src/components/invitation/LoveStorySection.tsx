'use client';

import React from 'react';
import { InvitationData } from '@/types/invitation';

interface LoveStorySectionProps {
  data: InvitationData;
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ data }) => {
  const storyImage =
    data.stories[0]?.image ||
    data.gallery[1]?.url ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

  const milestones =
    data.stories && data.stories.length > 0
      ? data.stories.slice(0, 3)
      : [
          { id: '1', year: '2020', title: 'Pertama Bertemu' },
          { id: '2', year: '2022', title: 'Komitmen' },
          { id: '3', year: '2024', title: 'Lamaran' },
        ];

  return (
    <section id="kisah" className="py-8 px-6">
      <div className="paper-card rounded-3xl p-6 text-center relative overflow-hidden reveal">
        {/* Couple Horizontal Photo */}
        <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 shadow-xs">
          <img
            src={storyImage}
            alt="Love Story"
            className="w-full h-full object-cover sepia-[.10]"
          />
        </div>

        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C735B] font-semibold block mb-1">
          OUR STORY
        </span>
        <h3 className="font-serif text-2xl text-[#382E25] font-semibold mb-3">
          Kisah Cinta Kami
        </h3>

        <p className="text-xs text-[#786755] leading-relaxed italic mb-4">
          &ldquo;Tidak ada kebetulan dalam takdir Allah. Setiap detik perjalanan yang kami lalui adalah persiapan untuk menyatu dalam ikatan yang suci ini.&rdquo;
        </p>

        {/* Milestones Timeline */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#D5C6B1]/40 text-center reveal delay-200">
          {milestones.map((st) => (
            <div key={st.id} className="p-2 rounded-xl bg-white/70">
              <span className="block text-xs font-bold text-[#8C735B]">{st.year}</span>
              <span className="text-[10px] text-[#786755]">{st.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
