'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  MapPin,
  UserCheck,
} from 'lucide-react';

export default function RegisterMemberPage() {
  const router = useRouter();

  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: 'Kochi',
    districtId: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hardcoded initial list of Kerala districts
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
      name: `Member User ${randomNum}`,
      email: `member${randomNum}@withyou.test`,
      phone: `98765${randomNum}10`,
      password: 'Member@123',
      city: 'Kochi',
      districtId: 'district-ernakulam',
      emergencyContactName: 'Dr. Ramesh Nair',
      emergencyContactPhone: '9847012345',
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
          role: 'MEMBER',
          ...formData,
          districtId: formData.districtId || 'district-ernakulam',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      router.push('/app/member/home');
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
          maxWidth: 640,
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
            Member Registration & Pass Setup
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Access verified, background-checked Supporters for platonic companionship and assistance in Kerala.
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
              id="demo-fill-member-btn"
            >
              <Zap size={14} color="#0d9488" /> ⚡ 1-Click Demo Auto-fill Form
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
                placeholder="e.g. Anjali Menon"
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
                }}
                id="member-reg-name"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="10-digit mobile number"
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
                }}
                id="member-reg-phone"
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
                placeholder="name@example.com"
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
                }}
                id="member-reg-email"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Password *
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
                }}
                id="member-reg-password"
              />
            </div>
          </div>

          {/* Row 3: District & City */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                District (Kerala)
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
                }}
                id="member-reg-district"
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
                City / Location
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Kakkanad, Kochi"
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
                }}
                id="member-reg-city"
              />
            </div>
          </div>

          {/* Row 4: Emergency Contacts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', paddingTop: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                placeholder="Family / Relative Name"
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
                }}
                id="member-reg-emergency-name"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                placeholder="10-digit number"
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
                }}
                id="member-reg-emergency-phone"
              />
            </div>
          </div>

          {/* Platonic Policy Box */}
          <div
            style={{
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              borderRadius: '0.875rem',
              padding: '1rem',
              fontSize: '0.8rem',
              color: '#0f766e',
              lineHeight: 1.5,
              marginTop: '0.5rem',
            }}
          >
            <div style={{ fontWeight: 800, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <ShieldCheck size={16} /> 100% Platonic Code of Conduct Guarantee
            </div>
            Annual Member Pass: <strong>₹199/year</strong>. By registering, you agree to treat Supporters with dignity and adhere strictly to non-romantic companionship standards.
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
            id="submit-member-reg-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Registering Account...
              </>
            ) : (
              <>
                Complete Member Signup <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p style={{ textAlign: 'center', fontSize: '0.825rem', color: '#64748b', marginTop: '1.5rem', margin: '1.5rem 0 0' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ fontWeight: 800, color: '#0d9488', textDecoration: 'none' }}>
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
