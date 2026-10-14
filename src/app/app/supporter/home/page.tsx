import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  BadgeCheck,
  CalendarDays,
  Clock,
  DollarSign,
  Star,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export default async function SupporterHomePage() {
  const session = await getSession();
  if (!session || session.role !== 'SUPPORTER') redirect('/login');

  const [supporterProfile, todayBookings, pendingRequests, completedBookings] = await Promise.all([
    prisma.supporterProfile.findUnique({
      where: { userId: session.id },
      include: { kycVerification: true },
    }),
    prisma.booking.findMany({
      where: {
        supporter: { userId: session.id },
        status: { in: ['ACCEPTED', 'IN_PROGRESS'] },
        scheduledAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      include: { member: { include: { user: true } }, service: true },
      orderBy: { scheduledAt: 'asc' },
    }),
    prisma.booking.count({
      where: {
        supporter: { userId: session.id },
        status: 'REQUESTED',
      },
    }),
    prisma.booking.findMany({
      where: {
        supporter: { userId: session.id },
        status: 'COMPLETED',
      },
      select: { supporterEarnings: true },
    }),
  ]);

  if (!supporterProfile) redirect('/login');

  // Show onboarding screen if not approved
  if (supporterProfile.verificationStatus === 'PENDING_REVIEW') {
    return <OnboardingStatus stage="PENDING_REVIEW" />;
  }
  if (supporterProfile.verificationStatus === 'REJECTED') {
    return <OnboardingStatus stage="REJECTED" reason={supporterProfile.rejectionReason} />;
  }
  if (supporterProfile.membershipStatus !== 'ACTIVE') {
    return <OnboardingStatus stage="AWAITING_MEMBERSHIP" />;
  }

  const totalEarnings = completedBookings.reduce((s, b) => s + b.supporterEarnings, 0);
  const firstName = session.name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {format(new Date(), 'EEEE, dd MMMM yyyy')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          {
            label: 'Pending Requests',
            value: pendingRequests,
            icon: AlertCircle,
            color: '#f59e0b',
            href: '/app/supporter/requests',
          },
          {
            label: "Today's Sessions",
            value: todayBookings.length,
            icon: CalendarDays,
            color: 'var(--teal-500)',
            href: '/app/supporter/schedule',
          },
          {
            label: 'Total Earned',
            value: `₹${totalEarnings.toLocaleString('en-IN')}`,
            icon: DollarSign,
            color: '#16a34a',
            href: '/app/supporter/earnings',
          },
          {
            label: 'Reliability',
            value: `${supporterProfile.reliabilityScore.toFixed(0)}%`,
            icon: TrendingUp,
            color: 'var(--teal-600)',
            href: '/app/supporter/profile',
          },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div className="stat-label">{stat.label}</div>
                <div
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.625rem',
                    background: `${stat.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <stat.icon size={14} color={stat.color} />
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Membership banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--teal-500), var(--teal-700))',
          borderRadius: '1.25rem',
          padding: '1.25rem 1.75rem',
          color: 'white',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BadgeCheck size={22} />
          <div>
            <div style={{ fontWeight: 600 }}>Supporter Membership Active</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              Expires {supporterProfile.membershipExpiresAt ? format(supporterProfile.membershipExpiresAt, 'dd MMM yyyy') : 'N/A'}
            </div>
          </div>
        </div>
        <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}>
          KYC Verified ✓
        </span>
      </div>

      {/* Pending requests banner */}
      {pendingRequests > 0 && (
        <Link
          href="/app/supporter/requests"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '1rem',
            padding: '1.25rem 1.5rem',
            textDecoration: 'none',
            color: '#92400e',
            marginBottom: '2rem',
          }}
          id="pending-requests-banner"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} />
            <div>
              <div style={{ fontWeight: 600 }}>
                {pendingRequests} pending request{pendingRequests !== 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Respond before they expire</div>
            </div>
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Review →</span>
        </Link>
      )}

      {/* Today's sessions */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Today's Sessions</h2>
          <Link href="/app/supporter/schedule" style={{ color: 'var(--teal-600)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
            View Calendar →
          </Link>
        </div>

        {todayBookings.length === 0 ? (
          <div
            style={{
              background: 'white',
              border: '1px dashed var(--border)',
              borderRadius: '1.25rem',
              padding: '2.5rem',
              textAlign: 'center',
            }}
          >
            <CalendarDays size={32} color="var(--neutral-300)" style={{ marginBottom: '0.75rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No sessions scheduled for today.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todayBookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                  alignItems: 'center',
                }}
              >
                <div className="avatar">{booking.member.user.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{booking.member.user.name.split(' ')[0]}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {booking.service.name} · {booking.mode === 'VIDEO_CALL' ? '📹 Video' : '📍 In Person'}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Clock size={12} /> {format(booking.scheduledAt, 'h:mm a')}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {booking.durationHours}h
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--teal-600)', fontSize: '0.95rem' }}>
                    ₹{booking.supporterEarnings.toLocaleString('en-IN')}
                  </div>
                  <span className={`badge ${booking.status === 'IN_PROGRESS' ? 'badge-teal' : 'badge-green'}`} style={{ marginTop: '0.25rem' }}>
                    {booking.status === 'IN_PROGRESS' ? 'In Progress' : 'Confirmed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function OnboardingStatus({ stage, reason }: { stage: string; reason?: string | null }) {
  const stages = {
    PENDING_REVIEW: {
      emoji: '⏳',
      title: 'Application Under Review',
      desc: 'Our team is reviewing your KYC documents. This usually takes 24–48 hours. We will notify you once approved.',
      color: '#f59e0b',
    },
    REJECTED: {
      emoji: '❌',
      title: 'Application Rejected',
      desc: reason || 'Your application was not approved. Please contact support for more information.',
      color: '#ef4444',
    },
    AWAITING_MEMBERSHIP: {
      emoji: '💳',
      title: 'Pay Membership to Go Live',
      desc: 'Your KYC is approved! Pay the ₹499/year membership to activate your profile and start receiving requests.',
      color: 'var(--teal-500)',
    },
  };

  const info = stages[stage as keyof typeof stages];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
      }}
    >
      <div className="card" style={{ maxWidth: 480, textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{info.emoji}</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>{info.title}</h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{info.desc}</p>
        {stage === 'AWAITING_MEMBERSHIP' && (
          <Link href="/app/supporter/membership" className="btn btn-primary btn-lg" id="pay-membership-btn">
            Pay ₹499 — Go Live
          </Link>
        )}
        {stage === 'REJECTED' && (
          <a href="mailto:support@withyou.in" className="btn btn-outline">Contact Support</a>
        )}
      </div>
    </div>
  );
}
