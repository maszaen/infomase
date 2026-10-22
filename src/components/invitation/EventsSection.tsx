'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Navigation, CalendarPlus } from 'lucide-react';
import { InvitationData } from '@/types/invitation';
import { CountdownTimer } from './CountdownTimer';

import { formatFullIndonesianDate } from '@/lib/formatDate';

interface EventsSectionProps {
  data: InvitationData;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ data }) => {
  const createGoogleCalendarLink = (event: typeof data.events[0]) => {
    const title = encodeURIComponent(`${event.title} - ${data.groom.name} & ${data.bride.name}`);
    const details = encodeURIComponent(`Menghadiri ${event.title} pernikahan ${data.groom.fullName} & ${data.bride.fullName} di ${event.locationName}.`);
    const location = encodeURIComponent(`${event.locationName}, ${event.address}`);
    
    // Format YYYYMMDDTHHmm00Z approx
    const dateClean = event.date.replace(/-/g, '');
    const startClean = event.startTime.replace(':', '') + '00';
    const endClean = event.endTime.replace(':', '') + '00';
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateClean}T${startClean}Z/${dateClean}T${endClean}Z&details=${details}&location=${location}`;
  };

  return (
    <section id="acara" style={{ padding: '36px 16px', textAlign: 'center' }}>
      <div style={{ marginBottom: 20 }}>
        <span
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--inv-accent)',
            fontWeight: 700,
          }}
        >
          Rangkaian Acara
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.9rem',
            color: 'var(--inv-primary)',
            marginTop: 4,
          }}
        >
          Waktu &amp; Lokasi
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--inv-text-muted)', marginTop: 4 }}>
          Menghitung hari menuju ikatan suci kedua mempelai
        </p>
      </div>

      {/* Countdown Timer */}
      <CountdownTimer targetDate={data.countdownDate} />

      {/* Event Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
        {data.events.map((event, idx) => (
          <div
            key={event.id || idx}
            style={{
              background: 'var(--inv-card)',
              border: '1px solid var(--inv-border)',
              borderRadius: 22,
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top decorative badge */}
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--inv-accent)',
                padding: '4px 14px',
                borderRadius: 999,
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                marginBottom: 12,
              }}
            >
              {event.title}
            </div>

            {/* Date Box */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '8px 0', color: 'var(--inv-primary)' }}>
              <Calendar size={18} color="var(--inv-accent)" />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
                {formatFullIndonesianDate(event.date)}
              </span>
            </div>

            {/* Time Box */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.88rem', color: 'var(--inv-text)', marginBottom: 16 }}>
              <Clock size={16} color="var(--inv-accent)" />
              <span>
                Pukul {event.startTime} - {event.endTime} {event.timezone || 'WIB'}
              </span>
            </div>

            <div style={{ height: 1, width: '80%', background: 'var(--inv-border)', margin: '14px auto' }} />

            {/* Location & Address */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--inv-primary)', marginBottom: 4 }}>
                {event.locationName}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--inv-text-muted)', lineHeight: 1.5, maxWidth: 280, margin: '0 auto' }}>
                {event.address}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href={event.mapsUrl || 'https://maps.google.com'}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{
                  background: 'var(--gold-gradient)',
                  color: '#0e141f',
                  fontSize: '0.85rem',
                  padding: '10px 18px',
                  borderRadius: 999,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Navigation size={16} />
                Buka di Google Maps
              </a>

              <a
                href={createGoogleCalendarLink(event)}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: '0.8rem',
                  color: 'var(--inv-accent)',
                  fontWeight: 600,
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: '1px solid var(--inv-border)',
                  background: 'rgba(0,0,0,0.03)',
                  textDecoration: 'none',
                }}
              >
                <CalendarPlus size={15} />
                Simpan ke Kalender
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
