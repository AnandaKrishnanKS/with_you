import Link from 'next/link';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { getRegionConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pricing & Membership Fees | With You Kerala',
  description:
    'Transparent annual membership fees, hourly booking rates, and net supporter payouts across Kerala. Zero hidden charges.',
};

const MEMBER_FEATURES = [
  'Unlimited companion browsing & district filtering',
  'Aadhaar-verified Supporter profiles',
  'In-app chat & HD video call room',
  '24/7 SOS Emergency Hotline & Live Location Check-in',
  'Escrow-protected payments with instant cancellation refunds',
  'Rate and review companions after every session',
];

export default async function PricingPage() {
  const config = await getRegionConfig('KL');

  const supporterFeatures = [
    `Earn ${config.supporterSharePercent}% net payout per session (₹${config.supporterHourlyEarnings.toFixed(2)} / hour)`,
    'Full Aadhaar KYC & selfie verification badge',
    'Set your own weekly availability hours',
    'Choose your services (Outings, Elder Care, Events, Travel)',
    'Direct UPI & bank payouts within 48 hours of session',
    'Comprehensive host safety guidelines & support',
  ];

  const pricingFaqs = [
    {
      q: 'Why is there an annual membership fee?',
      a: 'The annual fee covers identity verification (Aadhaar KYC), 24/7 SOS emergency monitoring, cloud video calling infrastructure, and platform trust operations in Kerala.',
    },
    {
      q: 'How does the session fee work?',
      a: `Sessions are billed at a flat rate of ₹${config.hourlyBookingFee} per hour (minimum 1 hour). Payment is held safely in escrow and only released to the Supporter after the companion session ends successfully.`,
    },
    {
      q: 'What is the cancellation refund policy?',
      a: `Full 100% refund if cancelled more than ${config.cancelFullRefundHours} hours prior. ${config.cancelPartialRefundPercent}% refund if cancelled between ${config.cancelPartialRefundHours} to ${config.cancelFullRefundHours} hours before the session. If a Supporter cancels, you receive a 100% immediate refund.`,
    },
    {
      q: 'Are there any hidden service charges or taxes?',
      a: 'No hidden charges! Prices listed include standard platform processing. Complete payment receipts are provided in your Member dashboard.',
    },
  ];

  return (
    <div style={{ background: '#fafaf9', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section
        style={{
          background: 'radial-gradient(circle at 50% 0%, #ccfbf1 0%, #f0fdf4 40%, #ffffff 100%)',
          padding: '4.5rem 1.5rem 3.5rem',
          borderBottom: '1px solid #e2e8f0',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#0d9488',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={13} /> Transparent Pricing
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            Simple, Honest & Affordable
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
            Pay a modest annual pass to unlock Kerala’s verified companionship directory, then pay a flat hourly
            session rate. All companion payouts are fair and transparent.
          </p>
        </div>
      </section>

      {/* ── Pricing Cards ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '-2.5rem auto 0', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '2rem' }}>
          {/* Member Card */}
          <div
            className="pricing-card"
            style={{
              background: 'white',
              borderRadius: '1.75rem',
              padding: '2.5rem 2rem',
              border: '1px solid #cbd5e1',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ background: '#ccfbf1', color: '#0f766e', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '999px', textTransform: 'uppercase' }}>
                  For Members
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>Annual Member Pass</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                For individuals seeking verified companions for conversation, outings, elder care, or event support.
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>₹{config.memberYearlyFee}</span>
                <span style={{ color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>/ year</span>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {MEMBER_FEATURES.map((feat) => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.875rem', color: '#334155' }}>
                      <CheckCircle2 size={17} color="#0d9488" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link
              href="/register/member"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.9rem',
                borderRadius: '0.875rem',
                background: '#0f172a',
                color: 'white',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
              id="pricing-member-btn"
            >
              Get Member Pass — ₹{config.memberYearlyFee} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Session Billed Card */}
          <div
            className="pricing-card"
            style={{
              background: 'linear-gradient(145deg, #0f766e 0%, #115e59 100%)',
              color: 'white',
              borderRadius: '1.75rem',
              padding: '2.5rem 2rem',
              boxShadow: '0 20px 40px -10px rgba(15, 118, 110, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Session Rate
            </div>
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: '#ccfbf1', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '999px', textTransform: 'uppercase' }}>
                  Per Booking
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: '0 0 0.5rem' }}>Standard Hourly Rate</h2>
              <p style={{ color: '#99f6e4', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Paid upfront per booking request. Held securely in platform escrow until session completes.
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>₹{config.hourlyBookingFee}</span>
                <span style={{ color: '#99f6e4', fontWeight: 500, fontSize: '0.95rem' }}>/ hour</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    'Min 1-hour booking duration',
                    `Supporter receives ${config.supporterSharePercent}% (₹${config.supporterHourlyEarnings.toFixed(2)}/hr)`,
                    `Platform fee covers safety & operations (${config.platformCommissionPercent}% - ₹${config.platformHourlyFee.toFixed(2)}/hr)`,
                    `100% refund if cancelled >${config.cancelFullRefundHours} hours prior`,
                    'Zero cash payments — 100% digital & verified',
                  ].map((feat) => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.875rem', color: '#f0fdf4' }}>
                      <CheckCircle2 size={17} color="#5eead4" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link
              href="/register/member"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.9rem',
                borderRadius: '0.875rem',
                background: 'white',
                color: '#0f766e',
                fontWeight: 700,
                textDecoration: 'none',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
              id="pricing-session-btn"
            >
              Book a Companion <ArrowRight size={16} />
            </Link>
          </div>

          {/* Supporter Card */}
          <div
            className="pricing-card"
            style={{
              background: 'white',
              borderRadius: '1.75rem',
              padding: '2.5rem 2rem',
              border: '1px solid #cbd5e1',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '999px', textTransform: 'uppercase' }}>
                  For Supporters
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>Partner Pass</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                For empathetic individuals in Kerala offering companions, elder care, and outing support.
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>₹{config.supporterYearlyFee}</span>
                <span style={{ color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>/ year</span>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {supporterFeatures.map((feat) => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.875rem', color: '#334155' }}>
                      <CheckCircle2 size={17} color="#d97706" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link
              href="/register/supporter"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.9rem',
                borderRadius: '0.875rem',
                background: '#d97706',
                color: 'white',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
              id="pricing-supporter-btn"
            >
              Apply as Supporter — ₹{config.supporterYearlyFee} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Net Payout & Earnings Breakdown ───────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '4rem auto', padding: '0 1.5rem' }}>
        <div
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ color: '#0d9488', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Fair Earnings Model
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '0.35rem' }}>
              How Session Payments are Split
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.4rem' }}>
              We keep companion earnings high while maintaining a robust safety network.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #bbf7d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                Supporter Share ({config.supporterSharePercent}%)
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#15803d', margin: '0.5rem 0' }}>
                ₹{config.supporterHourlyEarnings.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#166534' }}>Directly transferred to Supporter bank/UPI after completion</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Platform Share ({config.platformCommissionPercent}%)
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#334155', margin: '0.5rem 0' }}>
                ₹{config.platformHourlyFee.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Covers Aadhaar KYC verification, SOS desk, and platform operations</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ───────────────────────────────────────────────── */}
      <section style={{ maxWidth: 800, margin: '4rem auto 6rem', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Pricing Frequently Asked Questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pricingFaqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.25rem 1.5rem',
                border: '1px solid #e2e8f0',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.5rem' }}>{faq.q}</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
