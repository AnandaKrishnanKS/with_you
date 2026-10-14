import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  PhoneCall,
  HeartHandshake,
  UserCheck,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Eye,
  Shield,
  Phone,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'Trust & Safety Center | With You Kerala',
  description:
    'Our multi-layered trust system: Aadhaar KYC, live selfie liveness checks, strictly platonic guidelines, emergency SOS hotline, and DPDP 2023 compliance.',
};

const SAFETY_PILLARS = [
  {
    icon: UserCheck,
    title: '1. Government Aadhaar KYC & Selfie Liveness',
    desc: 'Every Supporter profile undergoes automated Aadhaar credential verification, face matching, and live selfie liveness testing to prevent fake profiles or impersonation.',
  },
  {
    icon: MapPin,
    title: '2. Public Location Protocol',
    desc: 'All in-person companion sessions are restricted to verified public spaces (cafés, parks, malls, libraries, public events). Private residential or hotel sessions are prohibited.',
  },
  {
    icon: PhoneCall,
    title: '3. Real-Time In-App SOS Button',
    desc: 'Both Members and Supporters have access to an instant SOS emergency button during active bookings, sending geo-location coordinates to our 24/7 trust desk and emergency contact.',
  },
  {
    icon: Lock,
    title: '4. Encrypted & Anonymized Contact',
    desc: 'Personal phone numbers and personal emails are never shared between Members and Supporters. All communication occurs inside our encrypted app room.',
  },
];

const PLATONIC_RULES = [
  'Zero tolerance for romantic, dating, or escort solicitations',
  'No physical intimacy or inappropriate touching',
  'Sessions take place strictly in approved public areas or video calls',
  'No asking for personal financial loans, gifts, or private contact details',
  'Immediate lifetime ban and legal reporting for any policy violations',
];

const KERALA_HELPLINES = [
  { name: 'Kerala Police Emergency', number: '112', icon: Shield },
  { name: 'Kerala Women Helpline', number: '1091', icon: Phone },
  { name: 'Cyber Crime Helpline', number: '1930', icon: Lock },
  { name: 'With You SOS Desk', number: '+91 90000 00000', icon: PhoneCall },
];

export default function PublicSafetyPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #115e59 100%)',
          color: 'white',
          padding: '5rem 1.5rem 4rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 1rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              color: '#ccfbf1',
            }}
          >
            <ShieldCheck size={16} color="#5eead4" /> Trust & Safety Architecture
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            Your Safety is Our Highest Priority
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: '#ccfbf1',
              lineHeight: 1.7,
              maxWidth: 640,
              margin: '0 auto 2.5rem',
            }}
          >
            We have engineered a comprehensive multi-layered trust system so you can find platonic support and companionship with complete peace of mind across Kerala.
          </p>
        </div>
      </section>

      {/* ── Platonic Policy Banner ────────────────────────────────────── */}
      <section style={{ maxWidth: 1000, margin: '-2rem auto 3rem', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2rem',
            border: '2px solid #99f6e4',
            boxShadow: '0 10px 30px -5px rgba(13, 148, 136, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.75rem',
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} color="#dc2626" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Strictly Platonic Guarantee
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                WITH YOU is NOT a dating or romantic service.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {PLATONIC_RULES.map((rule) => (
              <div key={rule} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#0d9488" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 Safety Pillars ──────────────────────────────────────────── */}
      <section style={{ maxWidth: 1000, margin: '4rem auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: '#0d9488', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Multi-Layer Protection
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginTop: '0.35rem' }}>
            4 Pillars of Companion Security
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {SAFETY_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                style={{
                  background: 'white',
                  borderRadius: '1.25rem',
                  padding: '1.75rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.875rem',
                    background: '#ccfbf1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={22} color="#0f766e" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Emergency Helplines ───────────────────────────────────────── */}
      <section style={{ maxWidth: 1000, margin: '4rem auto 6rem', padding: '0 1.5rem' }}>
        <div
          style={{
            background: '#0f172a',
            color: 'white',
            borderRadius: '1.75rem',
            padding: '2.5rem',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ color: '#5eead4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Immediate Help
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.35rem' }}>
              Emergency Helplines (Kerala)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Our 24/7 trust desk works closely with state law enforcement and emergency services.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {KERALA_HELPLINES.map((hl) => {
              const Icon = hl.icon;
              return (
                <div
                  key={hl.name}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    textAlign: 'center',
                  }}
                >
                  <Icon size={20} color="#5eead4" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>{hl.name}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{hl.number}</div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link
              href="/register/member"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#0d9488',
                color: 'white',
                padding: '0.75rem 1.75rem',
                borderRadius: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Get Started Safely <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
