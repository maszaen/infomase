'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDemo, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login({ email: email.trim(), password });
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Login gagal. Silakan periksa kembali email dan password Anda.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('zaenal.arifin99@gmail.com');
    setPassword('Password123!');
    setErrorMessage(null);
  };

  const handleDemoLogin = () => {
    loginDemo();
    router.push('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 16px',
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: 'var(--text-primary)',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
            }}
          >
            IM
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            InfoMase<span style={{ color: '#2563eb' }}>.id</span>
          </span>
        </Link>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto' }}>
          Info acara mase! Masuk ke studio undangan sat-set Anda.
        </p>
      </div>

      {/* Login Card */}
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '32px 28px',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}
        >
          Masuk ke Akun
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 22 }}>
          Kelola desain undangan, daftar tamu WhatsApp, dan pantau kehadiran RSVP.
        </p>

        {errorMessage && (
          <div
            style={{
              padding: '14px',
              borderRadius: 10,
              background: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#991b1b',
              fontSize: '0.82rem',
              marginBottom: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>{errorMessage}</div>
            </div>
            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: '1px dashed #fca5a5',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: '0.76rem', color: '#7f1d1d' }}>
                Backend belum aktif? Masuk tanpa backend:
              </span>
              <button
                type="button"
                onClick={handleDemoLogin}
                style={{
                  background: '#991b1b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                Masuk Mode Demo ➔
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                className="form-input"
                style={{ paddingLeft: 38 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>
                Password
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Silakan hubungi administrator backend untuk reset password.');
                }}
                style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none' }}
              >
                Lupa sandi?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: 38, paddingRight: 38 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              Ingat saya di perangkat ini
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-gold"
            style={{
              width: '100%',
              padding: '11px',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            {isLoading ? 'Sedang Masuk...' : 'Masuk ke Studio'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Divider */}
        <div style={{ margin: '18px 0 14px', position: 'relative', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderBottom: '1px solid var(--border-default)' }} />
          <span style={{ position: 'relative', background: '#ffffff', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            atau untuk pengujian
          </span>
        </div>

        {/* Instant Demo Login Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '0.84rem',
            fontWeight: 600,
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
          }}
          title="Masuk langsung ke Dashboard tanpa menunggu server backend aktif"
        >
          <Sparkles size={15} color="#2563eb" />
          Masuk Mode Demo (Tanpa Backend)
        </button>

        {/* Demo Credentials Box */}
        <div
          style={{
            marginTop: 16,
            padding: '12px 14px',
            background: 'var(--bg-secondary)',
            borderRadius: 10,
            border: '1px solid var(--border-default)',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={13} color="#2563eb" />
              Kredensial API Backend
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563eb',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Isi Form
            </button>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>
            Email: <b>zaenal.arifin99@gmail.com</b> | Pass: <b>Password123!</b>
          </span>
        </div>

        {/* Register Footer Link */}
        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: '1px solid var(--border-default)',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
          }}
        >
          Belum punya akun InfoMase?{' '}
          <Link
            href="/register"
            style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'underline' }}
          >
            Daftar Gratis Sekarang
          </Link>
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          ← Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}
