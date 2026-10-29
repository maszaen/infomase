'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, Check } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDemo, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      setErrorMessage(err.message || 'Login gagal. Silakan periksa kembali email dan password Anda.');
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
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--surface)' }}>
      {/* Left panel — brand showcase */}
      <aside
        className="auth-aside"
        style={{
          width: 460,
          flexShrink: 0,
          background: 'var(--ink)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 40,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, #000 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, #000 40%, transparent 100%)',
          }}
        />

        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none', position: 'relative' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'var(--brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v6m0 0 4.5 2.6M12 8 7.5 10.6" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 15v7" />
            </svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
            Info<span style={{ color: '#6ea8ff' }}>Mase</span>
          </span>
        </Link>

        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.3 }}>
            Kelola undangan, tamu, dan RSVP dari satu konsol.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
            {[
              'Editor live dengan preview HP real-time',
              'Broadcast WhatsApp personal per tamu',
              'Rekap RSVP & estimasi porsi katering',
              'Amplop digital QRIS tanpa potongan',
            ].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'rgba(255,255,255,0.8)' }}>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'rgba(0, 81, 195, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check size={11} color="#6ea8ff" />
                </span>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', fontSize: 12.5, color: 'rgba(255,255,255,0.5)' }}>
          &ldquo;Rata-rata bikin undangan cuma 5 menit.&rdquo; — 150.000+ pasangan
        </div>
      </aside>

      {/* Right panel — form */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          background: 'var(--surface)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 24 }} className="auth-mobile-brand">
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: 'var(--brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v6m0 0 4.5 2.6M12 8 7.5 10.6" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 15v7" />
                </svg>
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                Info<span style={{ color: 'var(--brand)' }}>Mase</span>
              </span>
            </Link>
          </div>

          <h1 style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em' }}>Masuk ke akun</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ink-2)', margin: '6px 0 24px' }}>
            Kelola desain undangan, daftar tamu WhatsApp, dan pantau kehadiran RSVP.
          </p>

          {errorMessage && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger)',
                fontSize: 13,
                marginBottom: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="btn btn-sm btn-danger"
                style={{ alignSelf: 'flex-start' }}
              >
                Masuk Mode Demo
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="stack-md">
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-icon-left">
                <Mail size={15} />
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Silakan hubungi administrator untuk reset password.');
                  }}
                  style={{ fontSize: 12, color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}
                >
                  Lupa sandi?
                </a>
              </div>
              <div className="input-icon-left">
                <Lock size={15} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingRight: 36 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--ink-3)',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    borderRadius: 'var(--radius-xs)',
                  }}
                  aria-label="Tampilkan password"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-lg btn-primary" style={{ width: '100%', marginTop: 4 }}>
              {isLoading ? 'Memproses...' : 'Masuk ke Konsol'}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>

          <div style={{ margin: '18px 0 14px', position: 'relative', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderBottom: '1px solid var(--border)' }} />
            <span
              style={{
                position: 'relative',
                background: 'var(--surface)',
                padding: '0 10px',
                fontSize: 12,
                color: 'var(--ink-3)',
              }}
            >
              atau untuk pengujian
            </span>
          </div>

          <button type="button" onClick={handleDemoLogin} className="btn btn-secondary" style={{ width: '100%' }}>
            <Sparkles size={14} color="var(--brand)" />
            Masuk Mode Demo (Tanpa Backend)
          </button>

          <div
            style={{
              marginTop: 14,
              padding: '11px 13px',
              background: 'var(--surface-hover)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              fontSize: 12.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: 'var(--ink-2)' }}>
              Kredensial API: <b>zaenal.arifin99@gmail.com</b>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--brand)',
                fontWeight: 600,
                fontSize: 12.5,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Isi Form
            </button>
          </div>

          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--ink-2)',
            }}
          >
            Belum punya akun?{' '}
            <Link href="/register" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
              Daftar gratis
            </Link>
          </div>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Link href="/" style={{ fontSize: 12.5, color: 'var(--ink-3)', textDecoration: 'none' }}>
              ← Kembali ke halaman utama
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .auth-aside { display: none; }

        @media (min-width: 960px) {
          .auth-aside { display: flex; }
          .auth-mobile-brand { display: none; }
        }
      `}</style>
    </div>
  );
}
