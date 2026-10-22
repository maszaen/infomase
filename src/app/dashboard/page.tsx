'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useInvitationStore } from '@/lib/invitationStore';
import { TemplatePicker } from '@/components/dashboard/TemplatePicker';
import { EditorForm } from '@/components/dashboard/EditorForm';
import { GuestManager } from '@/components/dashboard/GuestManager';
import { RSVPManager } from '@/components/dashboard/RSVPManager';
import { LivePreviewPanel } from '@/components/dashboard/LivePreviewPanel';
import {
  Sparkles,
  LayoutTemplate,
  Edit3,
  Users,
  MessageSquareHeart,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  Smartphone,
  Eye,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    data,
    isLoaded,
    setTemplateId,
    updateGroom,
    updateBride,
    updateGeneral,
    updateQuote,
    updateCountdownDate,
    updateEvent,
    addEvent,
    deleteEvent,
    updateStories,
    updateGallery,
    updateMusic,
    updateBankAccounts,
    updateGiftAddress,
    addRSVP,
    deleteRSVP,
    addGuest,
    deleteGuest,
    resetToDefault,
  } = useInvitationStore();

  const [mainTab, setMainTab] = useState<'template' | 'editor' | 'guests' | 'rsvp'>('editor');
  const [mobileView, setMobileView] = useState<'content' | 'preview'>('content');

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={32} color="var(--gold-400)" className="music-spinning" />
          <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Memuat Dasbor Studio InfoMase...
          </p>
        </div>
      </div>
    );
  }

  const navTabs = [
    { id: 'template', label: 'Pilih Template', icon: LayoutTemplate, count: undefined },
    { id: 'editor', label: 'Editor Konten', icon: Edit3, count: undefined },
    { id: 'guests', label: 'Daftar Tamu (WA)', icon: Users, count: data.guests.length },
    { id: 'rsvp', label: 'Buku Tamu / RSVP', icon: MessageSquareHeart, count: data.rsvpList.length },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(10, 13, 20, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-glass)',
          padding: '14px 24px',
        }}
      >
        <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Brand & Back to Home */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link
              href="/"
              className="btn btn-sm btn-subtle"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <ChevronLeft size={16} />
              Landing Page
            </Link>

            <div style={{ height: 20, width: 1, background: 'var(--border-glass)' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  InfoMase <span className="text-gradient-gold">Studio</span>
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                  {data.templateId.toUpperCase()}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {data.title} ({data.groom.name} &amp; {data.bride.name})
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Autosave status indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.78rem',
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <CheckCircle2 size={13} />
              <span>Tersimpan Otomatis</span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset data undangan ke contoh awal? Semua perubahan saat ini akan digantikan data default.')) {
                  resetToDefault();
                }
              }}
              className="btn btn-sm btn-glass"
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              title="Reset ke Data Default"
            >
              <RotateCcw size={14} />
              Reset Default
            </button>

            <a
              href={`/invite/${data.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-gold"
              style={{ padding: '8px 16px', fontSize: '0.82rem', textDecoration: 'none' }}
            >
              <ExternalLink size={14} />
              Buka Web Publik
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Tab Toggle between Form and Live Preview */}
      <div
        style={{
          display: 'none',
          padding: '10px 16px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-glass)',
        }}
        className="mobile-preview-switch"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
          <button
            type="button"
            onClick={() => setMobileView('content')}
            className={`btn btn-sm ${mobileView === 'content' ? 'btn-gold' : 'btn-glass'}`}
          >
            <Edit3 size={14} />
            Editor Panel
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`btn btn-sm ${mobileView === 'preview' ? 'btn-gold' : 'btn-glass'}`}
          >
            <Eye size={14} />
            Live Preview
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <main style={{ flex: 1, padding: '28px 0 60px' }}>
        <div className="container-wide">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.35fr) minmax(380px, 0.85fr)',
              gap: 32,
              alignItems: 'flex-start',
            }}
          >
            {/* Left Column: Navigation Tabs & Tab Content */}
            <div style={{ minWidth: 0 }}>
              {/* Main Navigation Bar */}
              <div
                className="glass-card"
                style={{
                  padding: 8,
                  borderRadius: 18,
                  display: 'flex',
                  gap: 8,
                  marginBottom: 24,
                  overflowX: 'auto',
                }}
              >
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = mainTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMainTab(tab.id as any)}
                      className={`btn ${isActive ? 'btn-gold' : 'btn-glass'}`}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        fontSize: '0.88rem',
                        borderRadius: 14,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                      {typeof tab.count === 'number' && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 6px',
                            borderRadius: 999,
                            background: isActive ? '#00000025' : 'rgba(255,255,255,0.15)',
                            fontWeight: 700,
                          }}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              {mainTab === 'template' && (
                <TemplatePicker
                  selectedTemplateId={data.templateId}
                  onSelect={(id) => setTemplateId(id)}
                />
              )}

              {mainTab === 'editor' && (
                <EditorForm
                  data={data}
                  onUpdateGroom={updateGroom}
                  onUpdateBride={updateBride}
                  onUpdateGeneral={updateGeneral}
                  onUpdateQuote={updateQuote}
                  onUpdateCountdownDate={updateCountdownDate}
                  onUpdateEvent={updateEvent}
                  onAddEvent={addEvent}
                  onDeleteEvent={deleteEvent}
                  onUpdateStories={updateStories}
                  onUpdateGallery={updateGallery}
                  onUpdateBankAccounts={updateBankAccounts}
                  onUpdateGiftAddress={updateGiftAddress}
                  onUpdateMusic={updateMusic}
                />
              )}

              {mainTab === 'guests' && (
                <GuestManager
                  data={data}
                  onAddGuest={addGuest}
                  onDeleteGuest={deleteGuest}
                />
              )}

              {mainTab === 'rsvp' && (
                <RSVPManager
                  data={data}
                  onDeleteRSVP={deleteRSVP}
                />
              )}
            </div>

            {/* Right Column: Sticky Live Smartphone Mockup */}
            <div style={{ position: 'sticky', top: 90 }}>
              <LivePreviewPanel data={data} onAddRSVP={addRSVP} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
