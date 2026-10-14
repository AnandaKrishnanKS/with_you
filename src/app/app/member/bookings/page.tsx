import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarDays, Clock, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  REQUESTED: { label: 'Pending', badge: 'badge-amber' },
  ACCEPTED: { label: 'Confirmed', badge: 'badge-green' },
  IN_PROGRESS: { label: 'In Progress', badge: 'badge-teal' },
  COMPLETED: { label: 'Completed', badge: 'badge-gray' },
  CANCELLED_BY_MEMBER: { label: 'Cancelled', badge: 'badge-red' },
  CANCELLED_BY_SUPPORTER: { label: 'Cancelled by Supporter', badge: 'badge-red' },
  DECLINED: { label: 'Declined', badge: 'badge-red' },
  EXPIRED: { label: 'Expired', badge: 'badge-gray' },
};

export default async function MemberBookingsPage() {
  const session = await getSession();
  if (!session || session.role !== 'MEMBER') redirect('/login');

  const bookings = await prisma.booking.findMany({
    where: { member: { userId: session.id } },
    include: {
      supporter: { include: { user: true } },
      service: true,
      review: true,
    },
    orderBy: { scheduledAt: 'desc' },
  });

  const upcoming = bookings.filter((b) => ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS'].includes(b.status));
  const past = bookings.filter((b) => !['REQUESTED', 'ACCEPTED', 'IN_PROGRESS'].includes(b.status));

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>My Bookings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--teal-700)' }}>
            Upcoming ({upcoming.length})
          </h2>
          <BookingList bookings={upcoming} />
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Past ({past.length})
          </h2>
          <BookingList bookings={past} />
        </section>
      )}

      {bookings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <CalendarDays size={40} color="var(--neutral-300)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>You have no bookings yet.</p>
        </div>
      )}
    </div>
  );
}

function BookingList({ bookings }: { bookings: any[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {bookings.map((b) => {
        const cfg = STATUS_CONFIG[b.status] || { label: b.status, badge: 'badge-gray' };
        return (
          <div
            key={b.id}
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '1rem',
              padding: '1.25rem 1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div className="avatar" style={{ width: '3rem', height: '3rem', fontSize: '1.1rem' }}>
                {b.supporter.user.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 700 }}>{b.supporter.user.name.split(' ')[0]}</div>
                  <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  {b.service.name} · {b.mode === 'VIDEO_CALL' ? '📹 Video Call' : '📍 In Person'}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <CalendarDays size={12} />
                    {format(b.scheduledAt, 'dd MMM yyyy, h:mm a')}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    {b.durationHours}h
                  </span>
                  {b.meetingLocation && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <MapPin size={12} />
                      {['REQUESTED'].includes(b.status) ? '[Location hidden until accepted]' : b.meetingLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 700, color: 'var(--teal-700)' }}>
                ₹{b.totalAmount.toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a href={`/app/member/bookings/${b.id}`} className="btn btn-outline btn-sm">
                  View Details
                </a>
                {b.status === 'COMPLETED' && !b.review && (
                  <a href={`/app/member/review/${b.id}`} className="btn btn-primary btn-sm">
                    Leave Review
                  </a>
                )}
                {b.review && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 600, fontSize: '0.875rem' }}>
                    ★ {b.review.rating}/5
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
