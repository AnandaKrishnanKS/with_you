import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Video,
  Receipt,
  AlertTriangle,
  Star,
  PhoneCall,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  REQUESTED: { label: 'Pending Acceptance', color: '#d97706', bg: '#fef3c7' },
  ACCEPTED: { label: 'Confirmed & Scheduled', color: '#16a34a', bg: '#dcfce7' },
  IN_PROGRESS: { label: 'In Progress Now', color: '#0d9488', bg: '#ccfbf1' },
  COMPLETED: { label: 'Session Completed', color: '#475569', bg: '#f1f5f9' },
  CANCELLED_BY_MEMBER: { label: 'Cancelled by You', color: '#dc2626', bg: '#fef2f2' },
  CANCELLED_BY_SUPPORTER: { label: 'Cancelled by Supporter', color: '#dc2626', bg: '#fef2f2' },
  DECLINED: { label: 'Declined by Supporter', color: '#dc2626', bg: '#fef2f2' },
  EXPIRED: { label: 'Request Expired', color: '#64748b', bg: '#f1f5f9' },
};

export default async function MemberBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'MEMBER') redirect('/login');

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      member: { include: { user: true } },
      supporter: { include: { user: true, district: true } },
      service: true,
      review: true,
      payments: true,
      refunds: true,
    },
  });

  if (!booking) notFound();

  // Verify ownership
  if (booking.member.userId !== session.id) {
    redirect('/app/member/bookings');
  }

  const statusInfo = STATUS_CONFIG[booking.status] || { label: booking.status, color: '#475569', bg: '#f1f5f9' };
  const bookingId = booking.id;
  const bookingTotal = booking.totalAmount;

  // Server action to cancel booking
  async function cancelBooking() {
    'use server';
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED_BY_MEMBER',
        cancelledAt: new Date(),
        cancelReason: 'Cancelled by member via dashboard',
        refundAmount: bookingTotal,
      },
    });
    revalidatePath(`/app/member/bookings/${bookingId}`);
    revalidatePath('/app/member/bookings');
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem 4rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Back Button */}
      <Link
        href="/app/member/bookings"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#0f766e',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={16} /> Back to My Bookings
      </Link>

      {/* Main Header Card */}
      <div
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          border: '1px solid #cbd5e1',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: statusInfo.bg,
                color: statusInfo.color,
                padding: '0.3rem 0.85rem',
                borderRadius: '999px',
                marginBottom: '0.5rem',
              }}
            >
              {statusInfo.label}
            </span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {booking.service.name}
            </h1>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
              Booking Reference: <code>{booking.id}</code>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f766e' }}>
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Held securely in Escrow</div>
          </div>
        </div>

        {/* Supporter Banner */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '1.25rem',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '0.875rem', overflow: 'hidden', background: '#ccfbf1', flexShrink: 0 }}>
              <Image
                src={booking.supporter.photoUrl || '/avatars/default.svg'}
                alt={booking.supporter.user.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {booking.supporter.user.name}
                <ShieldCheck size={16} color="#16a34a" />
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.15rem' }}>
                {booking.supporter.city}, {booking.supporter.district?.name || 'Kerala'}
              </div>
            </div>
          </div>

          <Link
            href={`/app/member/supporter/${booking.supporterId}`}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '0.75rem',
              background: 'white',
              color: '#0f766e',
              border: '1px solid #99f6e4',
              fontWeight: 600,
              fontSize: '0.85rem',
              textDecoration: 'none',
            }}
          >
            View Full Profile →
          </Link>
        </div>
      </div>

      {/* Session Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Date & Time */}
        <div style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid #cbd5e1', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={15} color="#0d9488" /> Scheduled Date & Time
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            {format(new Date(booking.scheduledAt), 'EEEE, dd MMMM yyyy')}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>
            {format(new Date(booking.scheduledAt), 'hh:mm a')} ({booking.durationHours} Hours Session)
          </div>
        </div>

        {/* Location / Mode */}
        <div style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid #cbd5e1', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={15} color="#0d9488" /> Mode & Location
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            {booking.mode === 'VIDEO_CALL' ? '📹 HD Video Room' : '📍 In-Person Outing'}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>
            {booking.meetingLocation || (booking.mode === 'VIDEO_CALL' ? 'In-App Video Room' : 'Public location')}
          </div>
        </div>
      </div>

      {/* Booking Notes */}
      {booking.notes && (
        <div style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid #cbd5e1', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Notes / Special Requests
          </div>
          <p style={{ color: '#334155', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>{booking.notes}</p>
        </div>
      )}

      {/* Review Section */}
      {booking.review && (
        <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a16207' }}>Your Review & Rating</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d97706', fontWeight: 700 }}>
              <Star size={16} fill="#f59e0b" color="#f59e0b" /> {booking.review.rating} / 5
            </span>
          </div>
          <p style={{ color: '#854d0e', fontSize: '0.9rem', margin: 0 }}>"{booking.review.comment}"</p>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        {booking.status === 'COMPLETED' && !booking.review && (
          <Link
            href={`/app/member/review/${booking.id}`}
            style={{
              padding: '0.85rem 1.5rem',
              borderRadius: '0.75rem',
              background: '#0d9488',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Star size={16} /> Leave Review for {booking.supporter.user.name.split(' ')[0]}
          </Link>
        )}

        {['REQUESTED', 'ACCEPTED'].includes(booking.status) && (
          <form action={cancelBooking}>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '0.75rem',
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fca5a5',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Cancel Booking (100% Refundable)
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
