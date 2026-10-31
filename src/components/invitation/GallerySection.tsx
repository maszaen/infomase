'use client';

import React, { useState } from 'react';
import { InvitationData } from '@/types/invitation';

interface GallerySectionProps {
  data: InvitationData;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ data }) => {
  const [activePhoto, setActivePhoto] = useState<{ url: string; caption: string } | null>(null);

  const defaultPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
      caption: 'Raka & Sinta - Prewedding Outdoor',
      isTall: true,
      delay: 'delay-100',
    },
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      caption: 'Momen Manis',
      isTall: true,
      delay: 'delay-150',
    },
    {
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80',
      caption: 'Senyum Bahagia',
      isTall: false,
      delay: 'delay-200',
    },
    {
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80',
      caption: 'Simbol Cincin Pernikahan',
      isTall: false,
      delay: 'delay-250',
    },
    {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Raka Pratama',
      isTall: false,
      delay: 'delay-300',
    },
    {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      caption: 'Sinta Maharani',
      isTall: false,
      delay: 'delay-350',
    },
  ];

  const galleryList = (data.gallery && data.gallery.length >= 6)
    ? data.gallery.slice(0, 6).map((item, idx) => ({
        url: item.url,
        caption: item.caption || defaultPhotos[idx].caption,
        isTall: idx === 0 || idx === 1,
        delay: defaultPhotos[idx].delay,
      }))
    : defaultPhotos;

  return (
    <section id="galeri" className="py-8 px-6 relative">
      {/* Top Corner Bouquets (Mekar 1 per 1: Daun/Gandum -> Bunga) */}
      {/* Left Corner */}
      <div className="absolute top-2 left-0 w-28 h-28 pointer-events-none select-none z-10 overflow-visible">
        {/* 1. Daun Palm (daun hijau) - Mekar Pertama */}
        <div className="absolute inset-0 pointer-events-none reveal-foliage">
          <div className="absolute bottom-0 -left-[24px] w-22" style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}>
            <img src="/asset/img/daun_1.png" alt="Palm" className="botanical-img w-full wind-palm-1 opacity-80" />
          </div>
        </div>
        {/* 2. Bunga Anggrek - Mekar Kedua */}
        <div className="absolute inset-0 pointer-events-none reveal-flower-pair">
          <img
            src="/asset/img/bunga_1.png"
            alt="Orchid"
            className="botanical-img absolute bottom-1.5 -left-2.5 w-14 rotate-[10deg] origin-center wind-orchid-1 drop-shadow-sm"
          />
        </div>
      </div>

      {/* Right Corner */}
      <div className="absolute top-2 right-0 w-28 h-28 pointer-events-none select-none z-10 overflow-visible">
        {/* 1. Pampas (daun gandum) - Mekar Pertama */}
        <div className="absolute inset-0 pointer-events-none reveal-foliage">
          <div className="absolute bottom-0 -right-[24px] w-22" style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}>
            <img src="/asset/img/bunga_8.png" alt="Pampas" className="botanical-img w-full wind-pampas-1 opacity-80" />
          </div>
        </div>
        {/* 2. Bunga Anthurium - Mekar Kedua */}
        <div className="absolute inset-0 pointer-events-none reveal-flower-pair">
          <img
            src="/asset/img/bunga_5.png"
            alt="Anthurium"
            className="botanical-img absolute bottom-1.5 -right-2.5 w-14 -rotate-[15deg] origin-bottom-right wind-anthurium drop-shadow-sm"
          />
        </div>
      </div>

      <div className="text-center mb-6 pt-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--art-accent)] font-semibold block mb-1">
          OUR MOMENTS
        </span>
        <h3 className="font-serif text-3xl text-[var(--art-ink)] font-semibold">
          Galeri Foto
        </h3>
        <p className="text-xs text-[var(--art-ink-muted)] mt-1">
          Potret cinta dan kebahagiaan kami
        </p>
      </div>

      {/* 6-Photo Grid (Masonry 2 Columns) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {galleryList.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setActivePhoto({ url: photo.url, caption: photo.caption })}
            className={`${photo.isTall ? 'aspect-3/4' : 'aspect-square'} rounded-2xl overflow-hidden shadow-xs cursor-pointer group reveal-scale ${photo.delay}`}
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500 sepia-[.10]"
            />
          </div>
        ))}
      </div>

      {/* Romantic Quote */}
      <div className="text-center px-4">
        <p className="font-serif text-sm text-[var(--art-ink)] italic leading-relaxed mb-2">
          &ldquo;Cinta bukanlah tentang menemukan seseorang yang sempurna, tetapi tentang melihat seseorang yang tidak sempurna dengan cara yang sempurna.&rdquo;
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-[var(--art-line)]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--art-accent)]"></span>
          <span className="w-8 h-[1px] bg-[var(--art-line)]"></span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          id="lightboxModal"
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            className="max-w-md w-full bg-[var(--art-card)] rounded-3xl overflow-hidden shadow-2xl border border-[var(--art-line)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                id="lightboxImg"
                src={activePhoto.url}
                alt="Preview"
                className="w-full max-h-[70vh] object-cover"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-3 text-center">
              <p id="lightboxCaption" className="font-serif text-sm text-[var(--art-ink)] font-semibold">
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
