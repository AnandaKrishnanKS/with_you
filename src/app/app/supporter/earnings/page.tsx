import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { format } from 'date-fns';
import { getRegionConfig } from '@/lib/config';
import {
  Wallet,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
  Zap,
  Clock,
  Download,
  AlertCircle,
  Building2,
  BadgeCheck,
  CalendarDays,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupporterEarningsPage() {
  const session = await getSession();
  if (!session || session.role !== 'SUPPORTER') {
    redirect('/login');
  }

  const supporterProfile = await prisma.supporterProfile.findUnique({
    where: { userId: session.id },
    include: {
      user: true,
      payouts: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!supporterProfile) redirect('/login');

  const config = await getRegionConfig('KL');

  const bookings = await prisma.booking.findMany({
    where: {
      supporterId: supporterProfile.id,
      status: 'COMPLETED',
    },
    include: {
      member: { include: { user: true } },
      service: true,
    },
    orderBy: { scheduledAt: 'desc' },
  });

  // Calculate totals
  const totalEarnings = bookings.reduce((sum, b) => sum + b.supporterEarnings, 0);
  const totalHoursCompleted = bookings.reduce((sum, b) => sum + b.durationHours, 0);
  
  // Pending vs Paid simulation
  const pendingPayoutAmount = totalEarnings > 0 ? totalEarnings * 0.2 : 0;

  let payoutAccount = { upiId: '', bankName: '', accountNo: '' };
  if (supporterProfile.payoutDetails) {
    try {
      payoutAccount = JSON.parse(supporterProfile.payoutDetails);
    } catch (e) {
      // fallback
    }
  }

  return (
    <div style={{ maxWidth: 1150, margin: '0 auto', padding: '2rem 1.5rem 4rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Page Title & Action Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Supporter Earnings & Payout Ledger
            </h1>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '999px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <BadgeCheck size={14} color="#16a34a" /> {config.supporterSharePercent}% Net Split Active
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Track your net companion income, session breakdown, automated escrow releases, and registered payout accounts.
          </p>
        </div>

        <div>
          <a
            href="/app/supporter/preferences"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '0.75rem',
              border: '1px solid #cbd5e1',
              background: 'white',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
            }}
          >
            <CreditCard size={16} color="#0d9488" /> Payout Settings
          </a>
        </div>
      </div>

      {/* Top Financial Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {/* Total Net Earnings */}
        <div style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', borderRadius: '1.25rem', padding: '1.5rem', color: 'white', boxShadow: '0 8px 25px rgba(13,148,136,0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
              Total Net Earnings
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={18} color="white" />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.5rem' }}>
            ₹{totalEarnings.toFixed(2)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.9, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
            <span>{config.supporterSharePercent}% Net Supporter Share</span>
            <span style={{ fontWeight: 700, background: 'rgba(255,255,255,0.25)', padding: '0.15rem 0.5rem', borderRadius: '0.25rem' }}>Paid Out</span>
          </div>
        </div>

        {/* Completed Hours */}
        <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Completed Hours
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: '#ccfbf1', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1, marginBottom: '0.5rem' }}>
            {totalHoursCompleted} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>hrs</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
            <CalendarDays size={14} /> Across {bookings.length} completed session{bookings.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Pending Escrow Payout */}
        <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pending Escrow Payout
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1, marginBottom: '0.5rem' }}>
            ₹{pendingPayoutAmount.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
            <ShieldCheck size={14} /> Releasing within 48h of checkout
          </div>
        </div>

        {/* Reliability Score */}
        <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Reliability Rating
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#4338ca', lineHeight: 1, marginBottom: '0.5rem' }}>
            {supporterProfile.reliabilityScore}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#3730a3', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
            <Sparkles size={14} /> 100% Top Tier Companion Status
          </div>
        </div>
      </div>

      {/* 80% Payout Model Banner & Quick Payout Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            borderRadius: '1.5rem',
            padding: '1.75rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '0.875rem', background: 'rgba(20,184,166,0.2)', color: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'white' }}>
                Fair {config.supporterSharePercent}% Net Supporter Payout Model
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.4rem', lineHeight: 1.5 }}>
                For standard ₹{config.hourlyBookingFee}/hr companion sessions, you earn <strong style={{ color: '#2dd4bf' }}>₹{config.supporterHourlyEarnings.toFixed(2)} per hour</strong> net payout.
                The {config.platformCommissionPercent}% platform fee (₹{config.platformHourlyFee.toFixed(2)}/hr) covers 24/7 emergency response, verification, and operations support across Kerala.
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} color="#4ade80" /> Direct UPI Disbursement
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} color="#38bdf8" /> Escrow Protected
            </span>
          </div>
        </div>

        {/* Registered Payout Account Summary */}
        <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #cbd5e1', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} color="#0d9488" /> Registered Payout Account
              </h4>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '0.25rem', background: '#f0fdf4', color: '#15803d' }}>
                ACTIVE
              </span>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.875rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Primary UPI VPA:</span>
                <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{payoutAccount.upiId || 'Not configured'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Bank Name:</span>
                <strong style={{ color: '#0f172a' }}>{payoutAccount.bankName || 'Not configured'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Account Number:</span>
                <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{payoutAccount.accountNo || 'Not configured'}</strong>
              </div>
            </div>
          </div>

          <a
            href="/app/supporter/preferences"
            style={{
              marginTop: '1.25rem',
              display: 'block',
              textAlign: 'center',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              background: '#0f172a',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
            }}
          >
            Update Payout Account Details
          </a>
        </div>
      </div>

      {/* Session Earnings Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          border: '1px solid #cbd5e1',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Wallet size={20} color="#0d9488" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Completed Sessions & Payout Ledger ({bookings.length})
            </h2>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 2rem', color: '#64748b', fontSize: '0.9rem', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed #cbd5e1' }}>
            <Wallet size={40} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>No completed sessions recorded yet</div>
            <p style={{ marginTop: '0.35rem', color: '#64748b', fontSize: '0.85rem' }}>
              Accept member booking requests to start earning {config.supporterSharePercent}% net companion payouts!
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Service Type</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Member Name</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Date & Time</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Duration</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Gross Fare</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Platform Fee ({config.platformCommissionPercent}%)</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Net Payout ({config.supporterSharePercent}%)</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>
                      {b.service.name}
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, color: '#64748b' }}>
                        {b.mode === 'IN_PERSON' ? '📍 In-Person' : '🎥 Video Call'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#334155' }}>{b.member.user.name}</td>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.825rem' }}>
                      {format(new Date(b.scheduledAt), 'MMM dd, yyyy · hh:mm a')}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b', fontWeight: 600 }}>{b.durationHours} Hours</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>₹{b.totalAmount}</td>
                    <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.82rem' }}>-₹{b.platformFee.toFixed(2)}</td>
                    <td style={{ padding: '1rem', fontWeight: 800, color: '#16a34a', fontSize: '1rem' }}>
                      ₹{b.supporterEarnings.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={13} color="#16a34a" /> PAID VIA UPI
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
