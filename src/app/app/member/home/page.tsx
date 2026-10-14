import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format, addDays } from 'date-fns';
import {
  ArrowRight,
  CalendarDays,
  Clock,
  HeartHandshake,
  BadgeCheck,
  Star,
  AlertCircle,
} from 'lucide-react';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  REQUESTED: { bg: '#fef9c3', color: '#92400e', label: 'Pending' },
  ACCEPTED: { bg: '#dcfce7', color: '#15803d', label: 'Confirmed' },
  IN_PROGRESS: { bg: 'var(--teal-50)', color: 'var(--teal-700)', label: 'In Progress' },
  COMPLETED: { bg: 'var(--neutral-100)', color: 'var(--neutral-600)', label: 'Completed' },
  CANCELLED_BY_MEMBER: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
  CANCELLED_BY_SUPPORTER: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled by Supporter' },
};

export default async function MemberHomePage() {
  const session = await getSession();
  if (!session || session.role !== 'MEMBER') redirect('/login');

  const [memberProfile, upcomingBookings, recentActivity] = await Promise.all([
    prisma.memberProfile.findUnique({
      where: { userId: session.id },
      include: { district: true },
    }),
    prisma.booking.findMany({
      where: {
        member: { userId: session.id },
        status: { in: ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS'] },
        scheduledAt: { gte: new Date() },
      },
      include: {
        supporter: { include: { user: true, services: { include: { service: true } } } },
        service: true,
      },
      orderBy: { scheduledAt: 'asc' },
      take: 3,
    }),
    prisma.booking.findMany({
      where: {
        member: { userId: session.id },
        status: 'COMPLETED',
      },
      include: {
        supporter: { include: { user: true } },
        service: true,
      },
      orderBy: { scheduledAt: 'desc' },
      take: 3,
    }),
  ]);

  const membershipActive = memberProfile?.membershipStatus === 'ACTIVE';
  const expiryDate = memberProfile?.membershipExpiresAt
    ? format(memberProfile.membershipExpiresAt, 'dd MMM yyyy')
    : null;

  const firstName = session.name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {format(new Date(), 'EEEE, dd MMMM yyyy')}
        </p>
      </div>

      {/* ── Membership status ──────────────────────────────────────────── */}
      <div
        style={{
          background: membershipActive
            ? 'linear-gradient(135deg, var(--teal-500), var(--teal-700))'
            : 'linear-gradient(135deg, #f59e0b, #d97706)',
          borderRadius: '1.25rem',
          padding: '1.5rem 2rem',
          color: 'white',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem', fontWeight: 500 }}>
            Member Membership
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {membershipActive ? `Active · Expires ${expiryDate}` : 'Inactive — Renew to book sessions'}
          </div>
        </div>
        {membershipActive ? (
          <span
            style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '0.4rem 1rem',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <BadgeCheck size={15} /> Verified Member
          </span>
        ) : (
          <Link
            href="/app/member/membership"
            style={{
              background: 'white',
              color: '#d97706',
              padding: '0.5rem 1.25rem',
              borderRadius: '100px',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Renew ₹199
          </Link>
        )}
      </div>

      {/* ── Quick action ───────────────────────────────────────────────── */}
      <Link
        href="/app/member/explore"
        id="quick-book-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '1.25rem',
          padding: '1.25rem 1.5rem',
          textDecoration: 'none',
          color: 'var(--text-primary)',
          marginBottom: '2rem',
          transition: 'all 0.2s',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: '0.875rem',
              background: 'var(--teal-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HeartHandshake size={20} color="var(--teal-600)" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>Book a Supporter</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Browse verified supporters near you
            </div>
          </div>
        </div>
        <ArrowRight size={18} color="var(--text-muted)" />
      </Link>

      {/* ── Upcoming bookings ──────────────────────────────────────────── */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Upcoming Sessions</h2>
          <Link href="/app/member/bookings" style={{ color: 'var(--teal-600)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
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
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No upcoming sessions.</p>
            <Link href="/app/member/explore" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Book a Session
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcomingBookings.map((booking) => {
              const statusStyle = STATUS_STYLES[booking.status] || STATUS_STYLES['REQUESTED'];
              return (
                <Link
                  key={booking.id}
                  href={`/app/member/bookings/${booking.id}`}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Avatar */}
                  <div className="avatar" style={{ width: '3rem', height: '3rem', fontSize: '1.1rem' }}>
                    {booking.supporter.user.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {booking.supporter.user.name.split(' ')[0]}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                      {booking.service.name} · {booking.mode === 'VIDEO_CALL' ? '📹 Video Call' : '📍 In Person'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <CalendarDays size={12} />
                        {format(booking.scheduledAt, 'dd MMM, h:mm a')}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Clock size={12} />
                        {booking.durationHours}h
                      </span>
                    </div>
                  </div>
                  <span
                    className="badge"
                    style={{ background: statusStyle.bg, color: statusStyle.color, flexShrink: 0 }}
                  >
                    {statusStyle.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Recent sessions ────────────────────────────────────────────── */}
      {recentActivity.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Sessions</h2>
            <Link href="/app/member/bookings" style={{ color: 'var(--teal-600)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActivity.map((booking) => (
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
                  opacity: 0.85,
                }}
              >
                <div className="avatar" style={{ width: '3rem', height: '3rem', fontSize: '1.1rem' }}>
                  {booking.supporter.user.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {booking.supporter.user.name.split(' ')[0]}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {booking.service.name} · {format(booking.scheduledAt, 'dd MMM yyyy')}
                  </div>
                </div>
                <span className="badge badge-gray">Completed</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
