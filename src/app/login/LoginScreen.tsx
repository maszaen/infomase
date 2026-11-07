'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { AuthShell } from '@/components/auth/AuthShell';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const safeRedirect = redirectTarget.startsWith('/') ? redirectTarget : '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) router.replace(safeRedirect);
  }, [isAuthenticated, router, safeRedirect]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      router.push(safeRedirect);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Tidak bisa masuk. Periksa kembali email dan kata sandi Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Masuk ke konsol"
      subtitle="Kelola undangan, tamu, dan konfirmasi kehadiran dari satu tempat."
      footer={
        <>
          Belum punya akun?{' '}
          <Link
            href={safeRedirect !== '/dashboard' ? `/register?redirect=${encodeURIComponent(safeRedirect)}` : '/register'}
            style={{ fontWeight: 600, textDecoration: 'none' }}
          >
            Daftar
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="stack-4" noValidate>
        {error && (
          <div className="notice notice-danger" role="alert">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="login-email">
            Email
          </label>
          <div className="input-icon-left">
            <Mail size={15} />
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              className="form-input"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="row-between" style={{ gap: 8 }}>
            <label className="form-label" htmlFor="login-password">
              Kata sandi
            </label>
          </div>
          <div className="input-icon-left" style={{ position: 'relative' }}>
            <Lock size={15} />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              className="form-input"
              placeholder="••••••••"
              style={{ paddingRight: 'var(--space-10)' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              style={{
                position: 'absolute',
                right: 8,
                display: 'flex',
                padding: 4,
                border: 'none',
                background: 'transparent',
                color: 'var(--ink-400)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
          {loading ? 'Memproses…' : 'Masuk'}
          {!loading && <ArrowRight size={15} />}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-narrow" style={{ paddingBlock: 'var(--space-16)' }}>Memuat…</div>}>
      <LoginForm />
    </Suspense>
  );
}
