'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { BrandMark } from '@/components/ui/Brand';

export function AuthLoading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <BrandMark size={28} />
      <span className="meta">Memeriksa sesi…</span>
    </div>
  );
}

/** Lightweight guard: reading is public, mutations are not. */
export function AuthNotice({
  title = 'Masuk untuk mengelola undangan',
  body = 'Anda bisa melihat seluruh konsol dalam mode baca. Masuk untuk menyimpan perubahan dan mempublikasikan undangan.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <h2 style={{ fontSize: 'var(--text-md)' }}>{title}</h2>
        <p style={{ fontSize: 'var(--text-sm)', marginTop: 4 }}>{body}</p>
      </div>
      <div className="row" style={{ gap: 'var(--space-2)' }}>
        <Link href="/login" className="btn btn-secondary">
          Masuk
        </Link>
        <Link href="/register" className="btn btn-primary">
          Daftar gratis
        </Link>
      </div>
    </div>
  );
}

export function useOptionalAuth() {
  try {
    return useAuth();
  } catch {
    return null;
  }
}
