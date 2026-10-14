import Link from 'next/link';
import { Heart, MapPin, Phone, Mail, Globe, ShieldCheck, Lock, Sparkles, User, UserCheck } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #090d16 0%, #020617 100%)',
        color: '#94a3b8',
        padding: '5rem 1.5rem 2.5rem',
        fontSize: '0.875rem',
        fontFamily: "'Inter', sans-serif",
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Top Platonic Guarantee Banner */}
        <div
          style={{
            background: 'rgba(13, 148, 136, 0.1)',
            border: '1px solid rgba(20, 184, 166, 0.25)',
            borderRadius: '1.25rem',
            padding: '1.25rem 1.75rem',
            marginBottom: '3.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.75rem',
                background: '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={20} color="white" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                100% Platonic Companionship Guarantee
              </div>
              <div style={{ color: '#99f6e4', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                Strict zero-tolerance policy against romantic, escort, or sexual solicitations. Aadhaar KYC verified.
              </div>
            </div>
          </div>
          <Link
            href="/safety"
            style={{
              color: '#5eead4',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            Read Safety Policy →
          </Link>
        </div>

        {/* Links Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem',
          }}
        >
          {/* Brand & Mission */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                with <span style={{ color: '#2dd4bf' }}>you</span>
              </span>
            </Link>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.65, margin: 0 }}>
              Connecting members with verified, compassionate companions for emotional support, elder care, outings, and practical help across Kerala.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5eead4', fontSize: '0.8rem', fontWeight: 600 }}>
                <MapPin size={14} /> Active across all 14 Kerala Districts
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.78rem' }}>
                <Lock size={13} /> DPDP Act 2023 Compliant Platform
              </div>
            </div>
          </div>

          {/* Quick Portals & Signin */}
          <div>
            <h3 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Portals & Sign In
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <li>
                <Link href="/login" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Sign In (Member / Supporter)
                </Link>
              </li>
              <li>
                <Link href="/register/member" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Member Pass Registration (₹199/yr)
                </Link>
              </li>
              <li>
                <Link href="/register/supporter" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Supporter Partner Application (₹499/yr)
                </Link>
              </li>
              <li>
                <Link href="/admin" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.8rem' }}>
                  Admin Portal (Staff Only)
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Safety */}
          <div>
            <h3 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Trust & Platform
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <li>
                <Link href="/faq" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/safety" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Safety Center & Aadhaar KYC
                </Link>
              </li>
              <li>
                <Link href="/pricing" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Pricing & Payout Model
                </Link>
              </li>
              <li>
                <Link href="/guidelines" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Community Conduct Code
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Refund & Escrow Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Support & Legal
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <li>
                <a href="mailto:support@withyou.test" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} /> support@withyou.test
                </a>
              </li>
              <li>
                <a href="tel:+919000000000" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={14} /> SOS Helpline: 112 / 1091
                </a>
              </li>
              <li>
                <Link href="/terms" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Privacy Policy (DPDP Act)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#64748b',
          }}
        >
          <div>
            © 2026 WITH YOU Platform. All rights reserved. Developed for Kerala, India.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
            Built with <Heart size={13} color="#f43f5e" fill="#f43f5e" /> for platonic support & care in Kerala
          </div>
        </div>
      </div>
    </footer>
  );
}
