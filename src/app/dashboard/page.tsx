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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={28} color="#0f172a" className="music-spinning" />
          <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 500 }}>
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
      {/* Top Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 24px',
        }}
      >
        <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Brand & Back to Home */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link
              href="/"
              className="btn btn-sm btn-subtle"
              style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}
            >
              <ChevronLeft size={16} />
              Landing Page
            </Link>

            <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#0f172a',
                  }}
                >
                  Info<span style={{ color: '#2563eb' }}>Mase</span> Studio
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  {data.templateId.toUpperCase()}
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
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
                fontSize: '0.76rem',
                fontWeight: 600,
                color: '#065f46',
                background: '#ecfdf5',
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid #a7f3d0',
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
              style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: 6 }}
              title="Reset ke Data Default"
            >
              <RotateCcw size={13} />
              Reset Default
            </button>

            <a
              href={`/invite/${data.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-gold"
              style={{ padding: '7px 14px', fontSize: '0.8rem', textDecoration: 'none', borderRadius: 6 }}
            >
              <ExternalLink size={13} />
              Buka Web Publik
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Tab Toggle */}
      <div
        style={{
          display: 'none',
          padding: '10px 16px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
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
      <main style={{ flex: 1, padding: '24px 0 60px', background: '#f8fafc' }}>
        <div className="container-wide">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.35fr) minmax(380px, 0.85fr)',
              gap: 28,
              alignItems: 'flex-start',
            }}
          >
            {/* Left Column: Navigation Tabs & Tab Content */}
            <div style={{ minWidth: 0 }}>
              {/* Main Navigation Bar (Flat Tab Bar) */}
              <div
                style={{
                  padding: 4,
                  borderRadius: 10,
                  display: 'flex',
                  gap: 4,
                  marginBottom: 20,
                  overflowX: 'auto',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
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
                      style={{
                        flex: 1,
                        padding: '9px 14px',
                        fontSize: '0.85rem',
                        borderRadius: 6,
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontWeight: isActive ? 700 : 500,
                        border: 'none',
                        cursor: 'pointer',
                        background: isActive ? '#0f172a' : 'transparent',
                        color: isActive ? '#ffffff' : '#475569',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={15} />
                      <span>{tab.label}</span>
                      {typeof tab.count === 'number' && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '1px 6px',
                            borderRadius: 999,
                            background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                            color: isActive ? '#ffffff' : '#0f172a',
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
            <div style={{ position: 'sticky', top: 80 }}>
              <LivePreviewPanel data={data} onAddRSVP={addRSVP} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
