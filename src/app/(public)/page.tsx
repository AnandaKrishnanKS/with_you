import Link from 'next/link';
import {
  ShieldCheck,
  Star,
  HeartHandshake,
  Coffee,
  PartyPopper,
  Users,
  ShoppingBag,
  Map,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { getRegionConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

const SERVICES = [
  {
    icon: HeartHandshake,
    name: 'Emotional Support',
    desc: 'A compassionate listener for when you need to talk and feel heard.',
    modes: ['In Person', 'Video Call'],
    color: '#fce7f3',
    iconColor: '#db2777',
  },
  {
    icon: Coffee,
    name: 'Outings Companion',
    desc: 'Join you for dinner, movies, cafés, walks, and social outings.',
    modes: ['In Person'],
    color: '#fef9c3',
    iconColor: '#ca8a04',
  },
  {
    icon: PartyPopper,
    name: 'Event Companion',
    desc: 'Attend functions, weddings, and family events together.',
    modes: ['In Person'],
    color: '#ede9fe',
    iconColor: '#7c3aed',
  },
  {
    icon: Users,
    name: 'Elder Care Companionship',
    desc: 'Friendly visits, conversation, and hospital accompaniment for seniors.',
    modes: ['In Person', 'Video Call'],
    color: '#dcfce7',
    iconColor: '#16a34a',
  },
  {
    icon: ShoppingBag,
    name: 'Household Help',
    desc: 'Light errands, grocery shopping, and organizing assistance.',
    modes: ['In Person'],
    color: '#fff7ed',
    iconColor: '#ea580c',
  },
  {
    icon: Map,
    name: 'Local Travel Partner',
    desc: 'Sightseeing and day trips within the city or district.',
    modes: ['In Person'],
    color: 'var(--teal-50)',
    iconColor: 'var(--teal-600)',
  },
];


const WHO_WE_HELP = [
  { emoji: '👴', title: 'Elderly Individuals', desc: 'Need companionship, someone to talk to, or help getting to appointments.' },
  { emoji: '🏙️', title: 'New to the City', desc: 'Settling into a new city and looking for a friendly local companion.' },
  { emoji: '💙', title: 'Feeling Lonely', desc: 'Going through a tough phase and need a non-judgmental presence.' },
  { emoji: '🙌', title: 'Need a Helping Hand', desc: 'Need light practical assistance with errands and everyday tasks.' },
];

const FAQS = [
  {
    q: 'Is this a dating or romantic service?',
    a: 'Absolutely not. With You is a strictly platonic companionship platform. All Supporters sign a code of conduct agreement, and any attempt to provide or solicit romantic or sexual services results in immediate account termination and reporting to authorities.',
  },
  {
    q: 'How are Supporters verified?',
    a: 'Every Supporter goes through Aadhaar-based identity verification, a live selfie liveness check, face matching, and background review before they are approved. Their profiles are only visible to logged-in Members.',
  },
  {
    q: 'What if I need to cancel a booking?',
    a: 'Full refund if cancelled more than 24 hours before the session. 50% refund within 2–24 hours. No refund if cancelled within 2 hours. If the Supporter cancels, you always get a full refund.',
  },
  {
    q: 'How are payments handled?',
    a: 'All payments go through Razorpay. Booking fees are held by With You and released to the Supporter after the session is marked complete. Your payment details are never shared with the Supporter.',
  },
  {
    q: 'Can I use this for medical care?',
    a: 'No. Our Elder Care service is strictly for non-medical companionship — conversation, walks, and accompanying to appointments. We do not provide nurses, caregivers, or medical professionals.',
  },
  {
    q: 'Is my personal information safe?',
    a: 'Yes. We comply with India\'s DPDP Act 2023. Personal details and contact information are never shared between Members and Supporters. All data is encrypted at rest and in transit.',
  },
];

export default async function HomePage() {
  const config = await getRegionConfig('KL');

  const memberSteps = [
    { n: 1, title: 'Sign up & verify', desc: `Create your account with phone OTP and get a ₹${config.memberYearlyFee}/year membership.` },
    { n: 2, title: 'Browse & book', desc: 'Filter verified Supporters by service, area, language, and availability.' },
    { n: 3, title: 'Connect safely', desc: 'Meet at a public place or video call. Rate and review after every session.' },
  ];

  const supporterSteps = [
    { n: 1, title: 'Apply & get verified', desc: 'Complete Aadhaar KYC and selfie verification. We review within 48 hours.' },
    { n: 2, title: 'Set your schedule', desc: `Choose your services, availability, and areas. Pay ₹${config.supporterYearlyFee}/year to go live.` },
    { n: 3, title: 'Earn & grow', desc: `Accept requests, earn ₹${Math.round(config.supporterHourlyEarnings)}+ per hour (${config.supporterSharePercent}% of booking), and build your reputation.` },
  ];

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--teal-50) 0%, var(--bg) 100%)',
          padding: '4.5rem 0 5.5rem',
          textAlign: 'center',
          borderBottom: '1px solid var(--border)',
        }}
        className="section"
      >
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Kicker Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'white',
              color: 'var(--teal-700)',
              border: '1px solid var(--teal-200)',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <Sparkles size={15} color="var(--teal-600)" />
            <span>Trusted Platonic Companionship in Kerala</span>
          </div>

          {/* Main Heading */}
          <h1 className="heading-xl" style={{ marginBottom: '1.5rem', lineHeight: 1.15 }}>
            Someone to be there,{' '}
            <span className="text-accent" style={{ fontStyle: 'italic' }}>
              with you
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              marginBottom: '2.5rem',
              maxWidth: 620,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Connect with verified, compassionate Supporters for platonic companionship, emotional
            support, and practical assistance — whenever you need a listening ear or helping hand in Kerala.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '3rem',
            }}
          >
            <Link
              href="/register/member"
              className="btn btn-primary btn-lg"
              id="hero-find-supporter"
            >
              Find a Supporter <ArrowRight size={18} />
            </Link>

            <Link
              href="/register/supporter"
              className="btn btn-outline btn-lg"
              id="hero-become-supporter"
            >
              Become a Supporter
            </Link>
          </div>

          {/* Trust Indicators */}
          <div
            style={{
              display: 'flex',
              gap: '1.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              borderTop: '1px solid var(--border)',
              paddingTop: '2rem',
            }}
          >
            {[
              { icon: BadgeCheck, label: '100% Aadhaar Verified', color: '#16a34a' },
              { icon: ShieldCheck, label: 'Strictly Platonic Guarantee', color: 'var(--teal-600)' },
              { icon: Star, label: '4.8 ★ Rated Network', color: '#d97706' },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                }}
              >
                <Icon size={18} color={color} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Simple Process</div>
            <h2 className="heading-lg">How It Works</h2>
          </div>

          <div className="grid-2" style={{ gap: '3rem' }}>
            {/* Member */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--teal-50)',
                  color: 'var(--teal-700)',
                  padding: '0.375rem 1rem',
                  borderRadius: '100px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem',
                }}
              >
                <Users size={14} /> For Members
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {memberSteps.map((step) => (
                  <div key={step.n} style={{ display: 'flex', gap: '1.25rem' }}>
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        background: 'var(--teal-500)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        flexShrink: 0,
                        marginTop: '0.15rem',
                      }}
                    >
                      {step.n}
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{step.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register/member" className="btn btn-primary" style={{ marginTop: '2rem' }} id="hiw-member-cta">
                Get Started — ₹{config.memberYearlyFee}/year
              </Link>
            </div>

            {/* Supporter */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#fef9c3',
                  color: '#92400e',
                  padding: '0.375rem 1rem',
                  borderRadius: '100px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem',
                }}
              >
                <Sparkles size={14} /> For Supporters
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {supporterSteps.map((step) => (
                  <div key={step.n} style={{ display: 'flex', gap: '1.25rem' }}>
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        background: '#f59e0b',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        flexShrink: 0,
                        marginTop: '0.15rem',
                      }}
                    >
                      {step.n}
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{step.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register/supporter" className="btn btn-outline" style={{ marginTop: '2rem' }} id="hiw-supporter-cta">
                Apply to be a Supporter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────────── */}
      <section
        id="services"
        className="section"
        style={{ background: 'var(--neutral-50)' }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>What We Offer</div>
            <h2 className="heading-lg">Our Services</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', maxWidth: 520, margin: '0.75rem auto 0' }}>
              Each service is tailored to give you real, meaningful support.
            </p>
          </div>
          <div className="grid-3">
            {SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <div key={svc.name} className="card card-hover">
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.875rem',
                      background: svc.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <Icon size={20} color={svc.iconColor} />
                  </div>
                  <h3 className="heading-md" style={{ marginBottom: '0.5rem' }}>{svc.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1rem' }}>
                    {svc.desc}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {svc.modes.map((m) => (
                      <span key={m} className="badge badge-teal">{m}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <section id="pricing" className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Simple Pricing</div>
            <h2 className="heading-lg">Transparent & Affordable</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>No hidden fees. Cancel anytime.</p>
          </div>
          <div className="home-pricing-grid">
            {/* Member membership */}
            <div className="card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div className="section-label" style={{ marginBottom: '0.75rem' }}>Member</div>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--teal-600)', lineHeight: 1 }}>₹{config.memberYearlyFee}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 1.5rem' }}>per year</div>
              <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                {['Unlimited booking requests', 'Access verified Supporters', 'In-app messaging & video', 'Refund protection', 'SOS safety features'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={15} color="var(--teal-500)" style={{ marginTop: 2, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register/member" className="btn btn-primary" style={{ marginTop: '1.75rem', width: '100%' }} id="pricing-member-cta">
                Get Started
              </Link>
            </div>

            {/* Booking fee */}
            <div
              className="card"
              style={{
                textAlign: 'center',
                background: 'var(--teal-600)',
                color: 'white',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '100px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                Most Popular
              </div>
              <div className="section-label" style={{ marginBottom: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Per Booking</div>
              <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>₹{config.hourlyBookingFee}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '0.25rem 0 1.5rem' }}>per hour</div>
              <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                {['Minimum 1 hour booking', 'Paid upfront & held securely', 'Released after session', 'Refund on cancellation', 'Supports Supporter fairly'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={15} color="rgba(255,255,255,0.8)" style={{ marginTop: 2, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register/member" className="btn" style={{ marginTop: '1.75rem', width: '100%', background: 'white', color: 'var(--teal-700)', fontWeight: 600 }} id="pricing-booking-cta">
                Book a Session
              </Link>
            </div>

            {/* Supporter membership */}
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="section-label" style={{ marginBottom: '0.75rem' }}>Supporter</div>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--teal-600)', lineHeight: 1 }}>₹{config.supporterYearlyFee}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 1.5rem' }}>per year</div>
              <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                {[`Earn ₹${Math.round(config.supporterHourlyEarnings)}+ per hour (${config.supporterSharePercent}%)`, 'Set your own schedule', 'In-app scheduling & chat', 'Direct UPI payouts', 'Build your reputation'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={15} color="var(--teal-500)" style={{ marginTop: 2, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register/supporter" className="btn btn-outline" style={{ marginTop: '1.75rem', width: '100%' }} id="pricing-supporter-cta">
                Apply as Supporter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Safety & Privacy ──────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--neutral-50)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '0.75rem' }}>Trust & Safety</div>
              <h2 className="heading-lg" style={{ marginBottom: '1.25rem' }}>Your Safety is Our Priority</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Every Supporter is Aadhaar-verified and face-matched before approval. Our platform is built
                with privacy-by-design and complies with India's DPDP Act 2023.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: BadgeCheck, title: 'Aadhaar + Selfie Verified', desc: 'Every Supporter\'s identity is confirmed through licensed KYC.' },
                  { icon: ShieldCheck, title: 'Strictly Platonic Policy', desc: 'Zero tolerance for romantic or inappropriate conduct.' },
                  { icon: '🆘', title: 'In-App SOS Button', desc: 'Instantly alerts your emergency contact and our team during any session.' },
                  { icon: '🔒', title: 'Encrypted Data', desc: 'PII encrypted at rest. Contact details never shared between parties.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: '0.625rem',
                        background: 'var(--teal-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '1rem',
                      }}
                    >
                      {typeof item.icon === 'string' ? item.icon : <item.icon size={16} color="var(--teal-600)" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{item.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/safety" className="btn btn-outline" style={{ marginTop: '2rem' }}>
                Read Our Safety Policy <ArrowRight size={16} />
              </Link>
            </div>

            {/* Safety illustration */}
            <div className="safety-illustration-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
              <svg viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: 380 }} aria-hidden="true">
                <ellipse cx="200" cy="200" rx="170" ry="150" fill="var(--teal-50)" />
                <path d="M200 60 L280 100 L280 200 C280 248 240 280 200 300 C160 280 120 248 120 200 L120 100 Z" fill="white" stroke="var(--teal-200)" strokeWidth="2" />
                <path d="M200 80 L265 115 L265 200 C265 241 233 270 200 288 C167 270 135 241 135 200 L135 115 Z" fill="var(--teal-50)" />
                <path d="M175 205 L195 225 L230 185" stroke="var(--teal-500)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="200" cy="185" r="30" stroke="var(--teal-400)" strokeWidth="2" fill="none" strokeDasharray="5 4" />
                <text x="140" y="320" fontSize="13" fill="var(--text-muted)" fontFamily="Inter, sans-serif" fontWeight="500">DPDP Act 2023 Compliant</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Help ───────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>For Everyone</div>
            <h2 className="heading-lg">Who We Help</h2>
          </div>
          <div className="grid-4">
            {WHO_WE_HELP.map((item) => (
              <div
                key={item.title}
                className="card"
                style={{ textAlign: 'center', padding: '2rem 1.5rem' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{item.emoji}</div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--neutral-50)' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>FAQ</div>
            <h2 className="heading-lg">Common Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq, i) => (
              <details
                key={i}
                style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <summary
                  style={{
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    listStyle: 'none',
                    fontSize: '0.95rem',
                    userSelect: 'none',
                  }}
                >
                  {faq.q}
                  <ChevronDown size={16} color="var(--text-muted)" />
                </summary>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.75,
                    marginTop: '0.875rem',
                    paddingTop: '0.875rem',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/faq" style={{ color: 'var(--teal-600)', fontWeight: 500, textDecoration: 'none', fontSize: '0.9rem' }}>
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--teal-600) 0%, var(--teal-800) 100%)',
          padding: '5rem 0',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            Ready to find your Supporter?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', maxWidth: 500, margin: '0 auto 2.5rem' }}>
            Join hundreds of people across Kerala who have found a warm, verified companion with With You.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/register/member"
              className="btn btn-lg"
              style={{ background: 'white', color: 'var(--teal-700)', fontWeight: 600 }}
              id="cta-get-started"
            >
              Get Started — ₹199/year
            </Link>
            <Link
              href="/register/supporter"
              className="btn btn-lg"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)' }}
              id="cta-become-supporter"
            >
              Become a Supporter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
