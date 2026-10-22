'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <div style={{ margin: '24px 0', textAlign: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, maxWidth: 340, margin: '0 auto' }}>
        {units.map((unit) => (
          <div
            key={unit.label}
            style={{
              background: 'var(--inv-card)',
              border: '1px solid var(--inv-border)',
              borderRadius: 14,
              padding: '12px 6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 700,
                color: 'var(--inv-primary)',
                lineHeight: 1.1,
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--inv-text-muted)', fontWeight: 600 }}>
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
