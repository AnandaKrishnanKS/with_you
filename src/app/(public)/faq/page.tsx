import { Metadata } from 'next';
import Link from 'next/link';
import { getRegionConfig } from '@/lib/config';
import {
  HelpCircle,
  ShieldCheck,
  Zap,
  CreditCard,
  Lock,
  Search,
  ChevronDown,
  PhoneCall,
  Mail,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  BadgeCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | With You',
  description:
    'Find answers to common questions about platonic companionship in Kerala, supporter verification, pricing, safety standards, and booking procedures.',
};


export default async function FAQPage() {
  const config = await getRegionConfig('KL');

  const faqItems = [
    {
      category: 'PLATONIC_GUARANTEE',
      question: 'What is "With You" and how does platonic companionship work?',
      answer:
        'With You is Kerala’s first verified platonic companion network. We connect individuals needing emotional support, travel assistance, shopping buddies, senior care help, or event companions with background-checked local Supporters. Every interaction is strictly 100% platonic.',
    },
    {
      category: 'PLATONIC_GUARANTEE',
      question: 'Is this a dating, matchmaking, or romantic service?',
      answer:
        'ABSOLUTELY NOT. With You strictly enforces a 100% Platonic Policy. Any romantic, flirtatious, or inappropriate physical advances are zero-tolerance violations resulting in immediate permanent account termination and referral to Kerala law enforcement.',
    },
    {
      category: 'BOOKING_PRICING',
      question: 'How much does a companion session cost in Kerala?',
      answer:
        `Standard companion bookings are priced at ₹${config.hourlyBookingFee}/hour across all 14 districts in Kerala. There are no hidden fees. Members can also join annual membership passes for special priority matching and lower hourly rates.`,
    },
    {
      category: 'BOOKING_PRICING',
      question: `How does the ${config.supporterSharePercent}% Supporter payout model work?`,
      answer:
        `Supporters retain ${config.supporterSharePercent}% net earnings (₹${config.supporterHourlyEarnings.toFixed(2)}/hr for ₹${config.hourlyBookingFee}/hr sessions). The ${config.platformCommissionPercent}% platform fee (₹${config.platformHourlyFee.toFixed(2)}/hr) covers mandatory background checks, 24/7 emergency SOS command center operations, insurance, and platform maintenance.`,
    },
    {
      category: 'BOOKING_PRICING',
      question: 'What is the booking cancellation & refund policy?',
      answer:
        `Cancellations made more than ${config.cancelFullRefundHours} hours before scheduled start time receive a 100% full refund. Cancellations made between ${config.cancelPartialRefundHours} and ${config.cancelFullRefundHours} hours prior receive a ${config.cancelPartialRefundPercent}% partial refund. Cancellations within ${config.cancelPartialRefundHours} hours are non-refundable to respect the supporter’s reserved schedule.`,
    },
    {
      category: 'SAFETY_VERIFICATION',
      question: 'How are Supporters verified before listing?',
      answer:
        'All Supporters undergo mandatory multi-step verification including Aadhaar Government ID OCR validation, AI selfie face-liveness matching, local police background checks, and an interview by our Kerala Operations team.',
    },
    {
      category: 'SAFETY_VERIFICATION',
      question: 'How does the emergency SOS button work during sessions?',
      answer:
        'Every active booking screen features a 1-tap SOS Emergency button. Tapping it instantly triggers continuous GPS broadcast to our 24/7 Kochi SOS Desk, contacts your emergency kin via SMS, and connects to Kerala Police Dial 112 if requested.',
    },
    {
      category: 'SAFETY_VERIFICATION',
      question: 'What happens if a Member or Supporter violates boundaries?',
      answer:
        'Safety is paramount. Users have instantaneous "End Session & Report" controls in-app. Violations result in immediate suspension, escrow freezing, Aadhaar blacklist across India, and legal filing when applicable.',
    },
    {
      category: 'GENERAL_KERALA',
      question: 'In which Kerala districts is With You available?',
      answer:
        'With You operates across all 14 districts of Kerala: Thiruvananthapuram, Kollam, Pathanamthitta, Alappuzha, Kottayam, Idukki, Ernakulam (Kochi), Thrissur, Palakkad, Malappuram, Kozhikode, Wayanad, Kannur, and Kasaragod.',
    },
    {
      category: 'GENERAL_KERALA',
      question: 'Can I book a Supporter for an entire day or outstation trip?',
      answer:
        'Yes! Multi-hour bookings are supported up to 8 hours per single reservation. Both parties must confirm travel itineraries via in-app chat beforehand, and meetings must commence in verified public transit hubs or public landmarks.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fdfcf9', fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Header Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 100%)',
          color: 'white',
          padding: '4.5rem 1.5rem 4rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 850, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '0.35rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
            <HelpCircle size={15} color="#5eead4" /> Help & Knowledge Base
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 900, lineHeight: 1.15, margin: 0, letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#ccfbf1', marginTop: '1rem', lineHeight: 1.6, maxWidth: 680, margin: '1rem auto 0' }}>
            Everything you need to know about Platonic Companionship in Kerala, Safety Protocols, Fair Payout Model, and Booking Policies.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
        
        {/* Platonic Policy Alert Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
            border: '1.5px solid #99f6e4',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.25rem',
            boxShadow: '0 4px 15px rgba(13,148,136,0.06)',
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '0.875rem', background: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
              100% Strict Platonic Guarantee
            </div>
            <p style={{ fontSize: '0.875rem', color: '#334155', marginTop: '0.35rem', lineHeight: 1.6, margin: '0.35rem 0 0' }}>
              With You operates exclusively as a professional platonic companion network across Kerala. We strictly prohibit dating, romantic arrangements, or illicit activities. All sessions are monitored under our Safety Code of Conduct.
            </p>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {faqItems.map((item, idx) => (
            <details
              key={idx}
              style={{
                background: 'white',
                borderRadius: '1.25rem',
                border: '1px solid #cbd5e1',
                padding: '1.5rem 1.75rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
              <summary
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  listStyle: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  outline: 'none',
                  userSelect: 'none',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '0.375rem',
                      background:
                        item.category === 'PLATONIC_GUARANTEE'
                          ? '#f0fdfa'
                          : item.category === 'BOOKING_PRICING'
                          ? '#f0fdf4'
                          : item.category === 'SAFETY_VERIFICATION'
                          ? '#eff6ff'
                          : '#faf5ff',
                      color:
                        item.category === 'PLATONIC_GUARANTEE'
                          ? '#0d9488'
                          : item.category === 'BOOKING_PRICING'
                          ? '#16a34a'
                          : item.category === 'SAFETY_VERIFICATION'
                          ? '#2563eb'
                          : '#9333ea',
                      border: `1px solid ${
                        item.category === 'PLATONIC_GUARANTEE'
                          ? '#99f6e4'
                          : item.category === 'BOOKING_PRICING'
                          ? '#bbf7d0'
                          : item.category === 'SAFETY_VERIFICATION'
                          ? '#bfdbfe'
                          : '#e9d5ff'
                      }`,
                    }}
                  >
                    {item.category === 'PLATONIC_GUARANTEE'
                      ? 'Policy'
                      : item.category === 'BOOKING_PRICING'
                      ? 'Pricing'
                      : item.category === 'SAFETY_VERIFICATION'
                      ? 'Safety'
                      : 'Careers'}
                  </span>
                  {item.question}
                </span>
                <ChevronDown size={20} color="#64748b" style={{ flexShrink: 0 }} />
              </summary>
              <div
                style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9',
                  fontSize: '0.925rem',
                  color: '#475569',
                  lineHeight: 1.7,
                }}
              >
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Still Have Questions CTA Banner */}
        <div
          style={{
            marginTop: '4rem',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          }}
        >
          <Sparkles size={36} color="#2dd4bf" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white' }}>
            Still Have Unanswered Questions?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: 540, margin: '0.5rem auto 1.75rem' }}>
            Our Kerala Support Team is available 24/7 to assist with member queries, supporter onboarding, and emergency assistance.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="mailto:support@withyou.in"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.75rem',
                borderRadius: '0.875rem',
                background: '#0d9488',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              <Mail size={18} /> Email Support Team
            </a>
            <Link
              href="/safety"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.75rem',
                borderRadius: '0.875rem',
                border: '1.5px solid #475569',
                background: 'transparent',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              <ShieldCheck size={18} /> View Safety Standards
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
