'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Check, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { AuthShell } from '@/components/auth/AuthShell';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const checks = [
    { label: 'Minimal 8 karakter', ok: password.length >= 8 },
    { label: 'Kata sandi sama', ok: confirmPassword.length > 0 && password === confirmPassword },
  ];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak sama.');
      return;
    }

    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, phoneNumber: phoneNumber.trim() || undefined });
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Pendaftaran gagal. Pastikan email belum pernah dipakai.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Buat akun"
      subtitle="Gratis. Template pertama Anda tidak dikenakan biaya."
      footer={
        <>
          Sudah punya akun?{' '}
          <Link href="/login" style={{ fontWeight: 600, textDecoration: 'none' }}>
            Masuk
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
          <label className="form-label" htmlFor="register-name">
            Nama lengkap
          </label>
          <div className="input-icon-left">
            <User size={15} />
            <input
              id="register-name"
              className="form-input"
              required
              autoComplete="name"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-email">
            Email
          </label>
          <div className="input-icon-left">
            <Mail size={15} />
            <input
              id="register-email"
              type="email"
              className="form-input"
              required
              autoComplete="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-phone">
            Nomor WhatsApp <span style={{ color: 'var(--ink-400)', fontWeight: 400 }}>(opsional)</span>
          </label>
          <div className="input-icon-left">
            <Phone size={15} />
            <input
              id="register-phone"
              type="tel"
              className="form-input"
              autoComplete="tel"
              placeholder="081234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-password">
            Kata sandi
          </label>
          <div className="input-icon-left" style={{ position: 'relative' }}>
            <Lock size={15} />
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              required
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
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

        <div className="form-group">
          <label className="form-label" htmlFor="register-confirm">
            Ulangi kata sandi
          </label>
          <div className="input-icon-left" style={{ position: 'relative' }}>
            <Lock size={15} />
            <input
              id="register-confirm"
              type={showConfirm ? 'text' : 'password'}
              className="form-input"
              required
              autoComplete="new-password"
              placeholder="Ulangi kata sandi"
              style={{ paddingRight: 'var(--space-10)' }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
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
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {(password || confirmPassword) && (
            <div className="row" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-0-5)' }}>
              {checks.map((check) => (
                <span
                  key={check.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 'var(--text-2xs)',
                    color: check.ok ? 'var(--success)' : 'var(--ink-500)',
                  }}
                >
                  <Check size={12} /> {check.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
          {loading ? 'Membuat akun…' : 'Buat akun'}
          {!loading && <ArrowRight size={15} />}
        </button>

        <p className="meta" style={{ textAlign: 'center' }}>
          Dengan mendaftar Anda menyetujui pemrosesan data untuk keperluan undangan Anda sendiri.
        </p>
      </form>
    </AuthShell>
  );
}
