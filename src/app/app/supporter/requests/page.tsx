import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { MapPin, Clock, CalendarDays, Users, MessageCircle } from 'lucide-react';
import AcceptDeclineButtons from './AcceptDeclineButtons';

export const dynamic = 'force-dynamic';

export default async function RequestsPage() {
  const session = await getSession();
  if (!session || session.role !== 'SUPPORTER') redirect('/login');

  const requests = await prisma.booking.findMany({
    where: {
      supporter: { userId: session.id },
      status: 'REQUESTED',
    },
    include: {
      member: { include: { user: true, district: true } },
      service: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Booking Requests</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {requests.length} pending request{requests.length !== 1 ? 's' : ''}
        </p>
      </div>

      {requests.length === 0 ? (
        <div
          style={{
            background: 'white',
            border: '1px dashed var(--border)',
            borderRadius: '1.25rem',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <MessageCircle size={40} color="var(--neutral-300)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No pending requests right now.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            New requests will appear here as Members book your services.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map((req) => (
            <div
              key={req.id}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '1.25rem',
                padding: '1.5rem',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="avatar" style={{ width: '3.25rem', height: '3.25rem', fontSize: '1.25rem' }}>
                  {req.member.user.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    {req.member.user.name.split(' ')[0]}
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.875rem' }}> (Member)</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                    {req.member.district?.name || req.member.city}
                  </div>
                </div>
                <span className="badge badge-amber">New Request</span>
              </div>

              {/* Details grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  background: 'var(--neutral-50)',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Service
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{req.service.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Mode
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {req.mode === 'VIDEO_CALL' ? '📹 Video Call' : '📍 In Person'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Date & Time
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CalendarDays size={13} />
                    {format(req.scheduledAt, 'dd MMM, h:mm a')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Duration
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={13} />
                    {req.durationHours} hour{req.durationHours !== 1 ? 's' : ''}
                  </div>
                </div>
                {req.meetingLocation && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      Location (visible after acceptance)
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      <MapPin size={13} /> 📍 [Revealed after you accept]
                    </div>
                  </div>
                )}
                {req.notes && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      Notes from Member
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      "{req.notes}"
                    </div>
                  </div>
                )}
              </div>

              {/* Earnings preview */}
              <div
                style={{
                  background: 'var(--teal-50)',
                  border: '1px solid var(--teal-100)',
                  borderRadius: '0.75rem',
                  padding: '0.875rem 1rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.875rem', color: 'var(--teal-700)' }}>Your Earnings</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--teal-700)' }}>
                  ₹{req.supporterEarnings.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Actions */}
              <AcceptDeclineButtons bookingId={req.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
