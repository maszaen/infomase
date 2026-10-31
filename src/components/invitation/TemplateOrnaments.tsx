'use client';

import React from 'react';
import { TemplateId } from '@/types/invitation';

interface OrnamentProps {
  templateId?: TemplateId | string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TemplateTopOrnament: React.FC<OrnamentProps> = ({ templateId = 'rustic', size = 48, style }) => {
  switch (templateId) {
    case 'royal-gold':
      // Art Deco Luxury Gold Crest
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>
          <svg width={size * 1.5} height={size * 0.75} viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 5L68 25L90 28L72 40L78 60L60 48L42 60L48 40L30 28L52 25L60 5Z" fill="#d4af37" opacity="0.85" />
            <line x1="10" y1="30" x2="45" y2="30" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="75" y1="30" x2="110" y2="30" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="15" cy="30" r="3" fill="#d4af37" />
            <circle cx="105" cy="30" r="3" fill="#d4af37" />
          </svg>
        </div>
      );

    case 'islamic':
    case 'islamic-emerald':
    case 'royal-islamic':
      // Mihrab Arch & Basmalah Calligraphic Ornament
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1-5)', ...style }}>
          <svg width={size * 1.8} height={size * 0.8} viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 4C45 4 20 28 20 58H120C120 28 95 4 70 4Z" stroke="#e0c075" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M70 12C50 12 30 32 30 58H110C110 32 90 12 70 12Z" stroke="#e0c075" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.5" />
            <circle cx="70" cy="32" r="5" fill="#e0c075" />
            <line x1="5" y1="58" x2="135" y2="58" stroke="#e0c075" strokeWidth="1.5" />
          </svg>
          <div style={{ fontFamily: 'Amiri, serif', fontSize: '1.25rem', color: '#e0c075', letterSpacing: '0.05em' }}>
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
        </div>
      );

    case 'sakura':
    case 'sakura-pastel':
      // Delicate Sakura Blossom Motif
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>
          <svg width={size * 1.4} height={size * 0.8} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 5 Petals */}
            <circle cx="50" cy="22" r="10" fill="#fbcfe8" opacity="0.8" />
            <circle cx="60" cy="30" r="10" fill="#f472b6" opacity="0.7" />
            <circle cx="56" cy="42" r="10" fill="#fb7185" opacity="0.75" />
            <circle cx="44" cy="42" r="10" fill="#f472b6" opacity="0.7" />
            <circle cx="40" cy="30" r="10" fill="#fbcfe8" opacity="0.8" />
            <circle cx="50" cy="33" r="4" fill="#ffffff" />
            {/* Floating petals */}
            <path d="M22 28C22 28 28 20 32 26C36 32 26 34 22 28Z" fill="#fb7185" opacity="0.6" />
            <path d="M78 35C78 35 84 27 88 33C92 39 82 41 78 35Z" fill="#f472b6" opacity="0.6" />
          </svg>
        </div>
      );

    case 'modern-minimalist':
      // Swiss Editorial Grid & Monogram Frame
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, ...style }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2-5)' }}>
            <div style={{ width: 40, height: 1, background: '#09090b' }} />
            <span style={{ fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 500, color: '#09090b' }}>
              VOLUME NO. MMXXVI
            </span>
            <div style={{ width: 40, height: 1, background: '#09090b' }} />
          </div>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: '#71717a', textTransform: 'uppercase' }}>
            PRIVATE EDITORIAL EDITION
          </span>
        </div>
      );

    case 'jawa-keraton':
      // Gunungan Wayang Kulit Silhouette Motif
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1-5)', ...style }}>
          <svg width={size * 1.5} height={size * 1.2} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 4C35 25 15 45 10 74H90C85 45 65 25 50 4Z" fill="#ca8a04" opacity="0.25" stroke="#ca8a04" strokeWidth="1.5" />
            <path d="M50 15C40 30 25 48 22 70H78C75 48 60 30 50 15Z" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            {/* Trunk of Tree of Life inside Gunungan */}
            <line x1="50" y1="25" x2="50" y2="74" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="50" cy="35" r="4" fill="#ca8a04" />
            <circle cx="42" cy="48" r="3" fill="#ca8a04" />
            <circle cx="58" cy="48" r="3" fill="#ca8a04" />
          </svg>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', color: '#b45309', fontWeight: 500, textTransform: 'uppercase' }}>
            SERAT ULEM DHAUPING PENGANTEN
          </div>
        </div>
      );

    case 'sunda-siger':
      // Mahkota Siger Sunda Silhouette Ornament
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1-5)', ...style }}>
          <svg width={size * 1.6} height={size * 0.9} viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Siger Crown Peaks */}
            <path d="M15 60L25 35L40 50L60 15L80 50L95 35L105 60H15Z" fill="#eab308" opacity="0.3" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="60" cy="12" r="4" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="25" cy="32" r="3" fill="#eab308" />
            <circle cx="95" cy="32" r="3" fill="#eab308" />
            {/* Ronce Melati Garland line */}
            <path d="M20 62C40 68 80 68 100 62" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#14532d', fontWeight: 500, textTransform: 'uppercase' }}>
            PARENGAN ADAT SUNDA • WILUJENG SUMPING
          </div>
        </div>
      );

    case 'celestial-starry':
      // Moon & Polaris Constellations Motif
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, ...style }}>
          <svg width={size * 1.4} height={size * 0.9} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Crescent Moon */}
            <path d="M50 10C42 10 36 18 36 28C36 38 44 46 54 46C50 44 48 40 48 35C48 25 54 18 60 14C57 11 53 10 50 10Z" fill="#facc15" />
            {/* Sparkle Stars */}
            <circle cx="70" cy="18" r="2.5" fill="#ffffff" />
            <circle cx="78" cy="34" r="1.5" fill="#facc15" />
            <circle cx="28" cy="22" r="2" fill="#818cf8" />
            <circle cx="24" cy="38" r="1.5" fill="#ffffff" />
            {/* Constellation line */}
            <line x1="28" y1="22" x2="36" y2="28" stroke="#818cf8" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.6" />
            <line x1="50" y1="28" x2="70" y2="18" stroke="#facc15" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.6" />
          </svg>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', color: '#facc15', fontWeight: 500, textTransform: 'uppercase' }}>
            WRITTEN IN THE STARS
          </div>
        </div>
      );

    case 'terracotta-boho':
      // Terracotta Sunburst & Pampas Fronds
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, ...style }}>
          <svg width={size * 1.5} height={size * 0.9} viewBox="0 0 110 65" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Arch portal */}
            <path d="M35 60V35C35 24 44 15 55 15C66 15 75 24 75 35V60" stroke="#ea580c" strokeWidth="2" fill="none" />
            {/* Half Sunburst Rays */}
            <circle cx="55" cy="35" r="8" fill="#ea580c" opacity="0.4" />
            <line x1="55" y1="22" x2="55" y2="17" stroke="#ea580c" strokeWidth="1.5" />
            <line x1="45" y1="25" x2="41" y2="21" stroke="#ea580c" strokeWidth="1.5" />
            <line x1="65" y1="25" x2="69" y2="21" stroke="#ea580c" strokeWidth="1.5" />
            {/* Pampas grass spray left/right */}
            <path d="M25 58C30 45 40 40 45 42" stroke="#d97706" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M85 58C80 45 70 40 65 42" stroke="#d97706" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', color: '#ea580c', fontWeight: 500, textTransform: 'uppercase' }}>
            BOHEMIAN SUN-WASHED CELEBRATION
          </div>
        </div>
      );

    case 'neo-glassmorphism':
      // Futuristic Neon Cyan Cyber Badge
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1-5)', ...style }}>
          <div
            style={{
              padding: '4px 16px',
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid #38bdf8',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            <span style={{ fontSize: '0.68rem', letterSpacing: '0.24em', color: '#38bdf8', fontWeight: 500, textTransform: 'uppercase' }}>
              CYBER INVITATION • PROTOCOL 2026
            </span>
          </div>
        </div>
      );

    case 'rustic':
    default:
      // Eucalyptus Botanical Leaves Branch
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>
          <svg width={size * 1.5} height={size * 0.75} viewBox="0 0 110 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 25C30 18 70 32 100 25" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
            {/* Eucalyptus round leaves */}
            <ellipse cx="30" cy="18" rx="8" ry="6" fill="#78350f" opacity="0.35" transform="rotate(-15 30 18)" />
            <ellipse cx="50" cy="30" rx="9" ry="7" fill="#d97706" opacity="0.4" transform="rotate(20 50 30)" />
            <ellipse cx="70" cy="20" rx="8" ry="6" fill="#78350f" opacity="0.35" transform="rotate(-10 70 20)" />
            <ellipse cx="88" cy="28" rx="7" ry="5" fill="#d97706" opacity="0.3" transform="rotate(15 88 28)" />
            <circle cx="55" cy="25" r="3" fill="#78350f" />
          </svg>
        </div>
      );
  }
};

/**
 * Returns custom frame border & shadow style for the couple photo portrait
 */
export const getTemplateFrameStyle = (templateId?: string): React.CSSProperties => {
  switch (templateId) {
    case 'royal-gold':
      return {
        borderRadius: '24px',
        border: '3px solid #d4af37',
        boxShadow: '0 0 25px rgba(212, 175, 55, 0.35), 0 15px 35px rgba(0,0,0,0.5)',
      };
    case 'islamic':
    case 'islamic-emerald':
    case 'royal-islamic':
      // Mihrab Arch Portrait Curve
      return {
        borderRadius: '130px 130px 18px 18px',
        border: '3px solid #e0c075',
        boxShadow: '0 12px 30px rgba(6, 78, 59, 0.3)',
      };
    case 'modern-minimalist':
      // Swiss Sharp Editorial
      return {
        borderRadius: '0px',
        border: '2px solid #09090b',
        boxShadow: '10px 10px 0px #09090b',
      };
    case 'jawa-keraton':
      // Archway with Keraton Soga Gold Frame
      return {
        borderRadius: '110px 110px 20px 20px',
        border: '4px double #ca8a04',
        boxShadow: '0 14px 28px rgba(62, 39, 35, 0.25)',
      };
    case 'sunda-siger':
      return {
        borderRadius: '999px',
        border: '4px solid #16a34a',
        boxShadow: '0 10px 25px rgba(20, 83, 45, 0.2)',
      };
    case 'celestial-starry':
      return {
        borderRadius: '30px',
        border: '2px solid #818cf8',
        boxShadow: '0 0 30px rgba(129, 140, 248, 0.4), 0 15px 30px rgba(0,0,0,0.7)',
      };
    case 'terracotta-boho':
      // Mediterranean Arch
      return {
        borderRadius: '140px 140px 12px 12px',
        border: '3px solid #ea580c',
        boxShadow: '0 12px 25px rgba(124, 45, 18, 0.2)',
      };
    case 'neo-glassmorphism':
      return {
        borderRadius: '24px',
        border: '1px solid rgba(56, 189, 248, 0.6)',
        boxShadow: '0 0 25px rgba(56, 189, 248, 0.3), inset 0 0 15px rgba(56, 189, 248, 0.1)',
        backdropFilter: 'blur(16px)',
      };
    case 'sakura':
    case 'sakura-pastel':
      return {
        borderRadius: '999px',
        border: '3px solid #fbcfe8',
        boxShadow: '0 12px 30px rgba(190, 24, 93, 0.18)',
      };
    case 'rustic':
    default:
      return {
        borderRadius: '999px 999px 24px 24px',
        border: '4px solid #fde68a',
        boxShadow: '0 12px 30px rgba(120, 53, 15, 0.18)',
      };
  }
};
