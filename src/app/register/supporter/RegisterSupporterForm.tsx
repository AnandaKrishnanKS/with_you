'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Zap,
} from 'lucide-react';
import { RegionConfigData } from '@/lib/config';

interface RegisterSupporterFormProps {
  config: RegionConfigData;
}

export default function RegisterSupporterForm({ config }: RegisterSupporterFormProps) {
  const router = useRouter();

  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: 'Kochi',
    districtId: 'district-ernakulam',
    gender: 'FEMALE',
    shortBio: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDistricts([
      { id: 'district-ernakulam', name: 'Ernakulam (Kochi)' },
      { id: 'district-thiruvananthapuram', name: 'Thiruvananthapuram' },
      { id: 'district-kozhikode', name: 'Kozhikode' },
      { id: 'district-thrissur', name: 'Thrissur' },
      { id: 'district-kottayam', name: 'Kottayam' },
      { id: 'district-alappuzha', name: 'Alappuzha' },
      { id: 'district-kollam', name: 'Kollam' },
      { id: 'district-palakkad', name: 'Palakkad' },
      { id: 'district-malappuram', name: 'Malappuram' },
      { id: 'district-kannur', name: 'Kannur' },
      { id: 'district-wayanad', name: 'Wayanad' },
      { id: 'district-idukki', name: 'Idukki' },
      { id: 'district-kasaragod', name: 'Kasaragod' },
      { id: 'district-pathanamthitta', name: 'Pathanamthitta' },
    ]);
  }, []);

  const fillDemoData = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFormData({
      name: `Supporter Partner ${randomNum}`,
      email: `supporter${randomNum}@withyou.test`,
      phone: `98765${randomNum}99`,
      password: 'Supporter@123',
      city: 'Kochi',
      districtId: 'district-ernakulam',
      gender: 'FEMALE',
      shortBio: 'Compassionate companion with 3+ years experience in elder care assistance, travel guidance, and active listening.',
      emergencyContactName: 'Rajesh Menon',
      emergencyContactPhone: '9847098765',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'SUPPORTER',
          ...formData,
          languages: ['Malayalam', 'English'],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Supporter registration failed.');

      router.push('/app/supporter/home');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdfa 0%, #e2e8f0 50%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 660,
          background: 'white',
          borderRadius: '1.75rem',
          border: '1px solid #cbd5e1',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '0.875rem', background: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeartHandshake size={24} />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', fontFamily: "'Playfair Display', serif" }}>
              with <span style={{ color: '#0d9488' }}>you</span>
            </span>
          </Link>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '1.25rem', margin: '1.25rem 0 0' }}>
            Apply as a Companion Supporter
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Provide platonic companionship, event company, and elderly support across Kerala. Earn <strong style={{ color: '#0d9488' }}>{config.supporterSharePercent}% net payout</strong> (₹{config.supporterHourlyEarnings.toFixed(2)}+/hr).
          </p>

          {/* Quick Demo Fill Button */}
          <div style={{ marginTop: '1rem' }}>
            <button
              type="button"
              onClick={fillDemoData}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '999px',
                background: '#f0fdfa',
                border: '1px solid #99f6e4',
                color: '#0d9488',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              id="demo-fill-supporter-btn"
            >
              <Zap size={14} color="#0d9488" /> ⚡ 1-Click Demo Auto-fill Application
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '1rem 1.25rem',
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '0.875rem',
              color: '#991b1b',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Row 1: Name & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Arjun Nair"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                id="supporter-reg-name"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Phone Number (WhatsApp) *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 9847012345"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                id="supporter-reg-phone"
              />
            </div>
          </div>

          {/* Row 2: Email & Password */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="arjun@example.com"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                id="supporter-reg-email"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Account Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                id="supporter-reg-pwd"
              />
            </div>
          </div>

          {/* Row 3: District & City */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Primary Kerala District *
              </label>
              <select
                value={formData.districtId}
                onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                id="supporter-reg-district"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                City / Town *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Edappally, Kakkanad"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                id="supporter-reg-city"
              />
            </div>
          </div>

          {/* Row 4: Gender & Emergency Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Gender Identity *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                id="supporter-reg-gender"
              >
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="NON_BINARY">Non-Binary / Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Emergency Contact Phone *
              </label>
              <input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                placeholder="Family / Guardian contact"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                id="supporter-reg-emer-phone"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
              Short Bio & Why You Want to Support Others *
            </label>
            <textarea
              rows={3}
              value={formData.shortBio}
              onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              placeholder="Tell us about yourself, your hobbies, communication style, and empathy background..."
              required
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '0.75rem',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#0f172a',
                background: '#f8fafc',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              id="supporter-reg-bio"
            />
          </div>

          {/* KYC Notice Box */}
          <div
            style={{
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              borderRadius: '0.875rem',
              padding: '1rem',
              fontSize: '0.8rem',
              color: '#0f766e',
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 800, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <ShieldCheck size={16} /> Government KYC Verification Required
            </div>
            After submitting this form, you will complete Aadhaar OCR & face liveness verification. Annual Supporter Partner Pass: <strong>₹{config.supporterYearlyFee}/year</strong>.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.95rem',
              borderRadius: '0.875rem',
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(13,148,136,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.6 : 1,
            }}
            id="submit-supporter-reg-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Submitting Application...
              </>
            ) : (
              <>
                Submit Supporter Application <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p style={{ textAlign: 'center', fontSize: '0.825rem', color: '#64748b', marginTop: '1.5rem', margin: '1.5rem 0 0' }}>
          Already registered?{' '}
          <Link href="/login" style={{ fontWeight: 800, color: '#0d9488', textDecoration: 'none' }}>
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
