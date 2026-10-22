'use client';

import React from 'react';
import { Home, Users, Calendar, Heart, Image, Gift, MessageSquare } from 'lucide-react';

interface BottomNavBarProps {
  onScrollTo: (id: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ onScrollTo }) => {
  const navItems = [
    { id: 'cover', label: 'Cover', icon: Home },
    { id: 'mempelai', label: 'Mempelai', icon: Users },
    { id: 'acara', label: 'Acara', icon: Calendar },
    { id: 'kisah', label: 'Kisah', icon: Heart },
    { id: 'galeri', label: 'Galeri', icon: Image },
    { id: 'amplop', label: 'Kado', icon: Gift },
    { id: 'ucapan', label: 'Ucapan', icon: MessageSquare },
  ];

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 12,
        margin: '0 auto',
        maxWidth: 340,
        zIndex: 40,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 999,
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onScrollTo(item.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '4px 6px',
              cursor: 'pointer',
              opacity: 0.75,
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={item.label}
          >
            <Icon size={16} />
            <span style={{ fontSize: '0.62rem', fontWeight: 600 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
