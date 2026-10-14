'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, Eye, EyeOff, ShieldCheck, User, Heart, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

type Mode = 'phone' | 'email';
type Step = 'input' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('email');
  const [step, setStep] = useState<Step>('input');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Quick fill helper for dev test accounts
  function quickFillAccount(type: 'member' | 'supporter' | 'admin') {
    setMode('email');
    setStep('input');
    setError('');
    setInfo('');
    if (type === 'member') {
      setEmail('member@withyou.test');
      setPassword('Member@123');
      setPhone('9000000001');
    } else if (type === 'supporter') {
      setEmail('supporter@withyou.test');
      setPassword('Supporter@123');
      setPhone('9000000002');
    } else if (type === 'admin') {
      setEmail('admin@withyou.test');
      setPassword('Admin@123');
      setPhone('9000000000');
    }
  }

  async function handleSendOtp() {
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep('otp');
      setInfo(data.message || 'OTP sent successfully!');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    const code = otp.join('');
    if (code.length !== 6) { setError('Enter all 6 digits of the OTP.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.newUser) {
        router.push(`/register/member?phone=${phone}`);
      } else {
        redirectByRole(data.user.role);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailLogin() {
    if (!email || !password) { setError('Please enter both email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      redirectByRole(data.user.role);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  function redirectByRole(role: string) {
    if (role === 'ADMIN') router.push('/admin');
    else if (role === 'SUPPORTER') router.push('/app/supporter/home');
    else router.push('/app/member/home');
  }

  function handleOtpChange(val: string, idx: number) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  }

  function handleOtpKey(e: React.KeyboardEvent, idx: number) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 0%, #f0fdf4 0%, #e6f4f1 40%, #f8fafc 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Back navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#0f766e',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '0.4rem 0.8rem',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <ArrowLeft size={15} /> Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#0f766e', fontWeight: 600 }}>
            <ShieldCheck size={14} color="#0d9488" /> 100% Secure & Platonic
          </div>
        </div>

        {/* Main Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: '1.5rem',
            padding: '2.5rem 2rem',
            border: '1px solid rgba(204, 251, 241, 0.8)',
            boxShadow: '0 20px 50px -10px rgba(15, 118, 110, 0.12), 0 8px 20px -6px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 8px 16px rgba(13, 148, 136, 0.25)',
              }}
            >
              <Heart size={22} color="#ffffff" fill="#ffffff" />
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              with <span style={{ color: '#0d9488' }}>you</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              {step === 'otp' ? `Enter 6-digit OTP sent to +91 ${phone}` : 'Sign in to access your companion account'}
            </p>
          </div>

          {/* Quick Demo Credentials Panel */}
          {step === 'input' && (
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ccfbf1 100%)',
                border: '1px solid #99f6e4',
                borderRadius: '1rem',
                padding: '0.875rem 1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                <Sparkles size={13} color="#0d9488" /> Instant Demo Login (1-Tap)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => quickFillAccount('member')}
                  style={{
                    background: email === 'member@withyou.test' ? '#0d9488' : 'white',
                    color: email === 'member@withyou.test' ? 'white' : '#0f766e',
                    border: '1px solid #99f6e4',
                    borderRadius: '0.625rem',
                    padding: '0.4rem 0.2rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                  }}
                  id="demo-btn-member"
                >
                  Member
                </button>
                <button
                  type="button"
                  onClick={() => quickFillAccount('supporter')}
                  style={{
                    background: email === 'supporter@withyou.test' ? '#0d9488' : 'white',
                    color: email === 'supporter@withyou.test' ? 'white' : '#0f766e',
                    border: '1px solid #99f6e4',
                    borderRadius: '0.625rem',
                    padding: '0.4rem 0.2rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                  }}
                  id="demo-btn-supporter"
                >
                  Supporter
                </button>
                <button
                  type="button"
                  onClick={() => quickFillAccount('admin')}
                  style={{
                    background: email === 'admin@withyou.test' ? '#0d9488' : 'white',
                    color: email === 'admin@withyou.test' ? 'white' : '#0f766e',
                    border: '1px solid #99f6e4',
                    borderRadius: '0.625rem',
                    padding: '0.4rem 0.2rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                  }}
                  id="demo-btn-admin"
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          {/* Mode Switcher */}
          {step === 'input' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: '#f1f5f9',
                padding: '0.25rem',
                borderRadius: '0.875rem',
                marginBottom: '1.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => { setMode('email'); setError(''); }}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '0.625rem',
                  border: 'none',
                  background: mode === 'email' ? 'white' : 'transparent',
                  color: mode === 'email' ? '#0f172a' : '#64748b',
                  fontWeight: mode === 'email' ? 600 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: mode === 'email' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                }}
                id="tab-email"
              >
                <Mail size={15} /> Email Login
              </button>
              <button
                type="button"
                onClick={() => { setMode('phone'); setError(''); }}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '0.625rem',
                  border: 'none',
                  background: mode === 'phone' ? 'white' : 'transparent',
                  color: mode === 'phone' ? '#0f172a' : '#64748b',
                  fontWeight: mode === 'phone' ? 600 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: mode === 'phone' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                }}
                id="tab-phone"
              >
                <Phone size={15} /> Phone OTP
              </button>
            </div>
          )}

          {/* Feedback banners */}
          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>⚠️</span> {error}
            </div>
          )}

          {info && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={16} color="#16a34a" /> {info}
            </div>
          )}

          {/* EMAIL FORM */}
          {mode === 'email' && (
            <form onSubmit={(e) => { e.preventDefault(); handleEmailLogin(); }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }} htmlFor="email-input">
                  Email Address
                </label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="name@withyou.test"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }} htmlFor="password-input">
                    Password
                  </label>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 3rem 0.75rem 1rem',
                      borderRadius: '0.75rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '0.2rem',
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '0.875rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                  transition: 'all 0.2s ease',
                }}
                id="email-login-btn"
              >
                {loading ? 'Signing in…' : 'Sign In with Email'}
              </button>
            </form>
          )}

          {/* PHONE OTP — STEP 1 */}
          {mode === 'phone' && step === 'input' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }} htmlFor="phone-input">
                  10-Digit Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>
                    +91
                  </span>
                  <input
                    id="phone-input"
                    type="tel"
                    placeholder="9000000001"
                    value={phone}
                    maxLength={10}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 3.5rem',
                      borderRadius: '0.75rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '0.875rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                }}
                id="send-otp-btn"
              >
                {loading ? 'Sending OTP…' : 'Send One-Time Password'}
              </button>
            </div>
          )}

          {/* PHONE OTP — STEP 2 */}
          {mode === 'phone' && step === 'otp' && (
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {otp.map((val, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKey(e, i)}
                    style={{
                      width: '2.75rem',
                      height: '3.25rem',
                      borderRadius: '0.625rem',
                      border: '2px solid #cbd5e1',
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      outline: 'none',
                      color: '#0f172a',
                    }}
                    id={`otp-${i}`}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '0.875rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                  marginBottom: '0.75rem',
                }}
                id="verify-otp-btn"
              >
                {loading ? 'Verifying…' : 'Verify & Enter Dashboard'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('input'); setOtp(['', '', '', '', '', '']); setError(''); setInfo(''); }}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                ← Change mobile number
              </button>
            </div>
          )}

          {/* Registration Links */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link href="/register/member" style={{ color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}>
                Join as Member →
              </Link>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <Link href="/register/supporter" style={{ color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}>
                Become a Supporter →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
