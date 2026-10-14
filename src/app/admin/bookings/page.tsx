import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { format } from 'date-fns';
import { getRegionConfig } from '@/lib/config';
import Link from 'next/link';
import {
  Calendar,
  ShieldCheck,
  MapPin,
  ArrowLeft,
  Clock,
  Video,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const config = await getRegionConfig('KL');

  const params = await searchParams;
  const statusFilter = params?.status || 'ALL';

  const whereClause: any = {};
  if (statusFilter !== 'ALL') {
    whereClause.status = statusFilter;
  }

  const bookings = await prisma.booking.findMany({
    where: whereClause,
    include: {
      member: { include: { user: true } },
      supporter: { include: { user: true } },
      service: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalCount = await prisma.booking.count();
  const completedCount = await prisma.booking.count({ where: { status: 'COMPLETED' } });
  const requestedCount = await prisma.booking.count({ where: { status: 'REQUESTED' } });
  const totalVolume = await prisma.booking.aggregate({
    _sum: { totalAmount: true },
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Compact Top Header Bar */}
      <div
        style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <Link
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#64748b',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.35rem 0.65rem',
              borderRadius: '0.5rem',
              background: '#f1f5f9',
            }}
          >
            <ArrowLeft size={14} /> Admin Dashboard
          </Link>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            Platform Bookings Audit & Ledger
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/admin/users" className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Users</Link>
          <Link href="/admin/reports" className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Reports & SOS</Link>
          <Link href="/admin/regions" className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Regions</Link>
        </div>
      </div>

      {/* Main Content with Balanced Compact Spacing */}
      <div style={{ padding: '1.25rem 1.5rem 3rem', maxWidth: 1250, margin: '0 auto' }}>
        {/* Compact Summary Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          {/* Total Bookings */}
          <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '0.875rem', padding: '1rem 1.25rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Bookings</span>
              <div style={{ width: 28, height: 28, borderRadius: '0.375rem', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={15} />
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{totalCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>All-Time Companion Volume</div>
          </div>

          {/* Gross Financial Volume */}
          <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '0.875rem', padding: '1rem 1.25rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Gross Fare Volume</span>
              <div style={{ width: 28, height: 28, borderRadius: '0.375rem', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={15} />
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16a34a' }}>₹{(totalVolume._sum.totalAmount || 0).toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>Gross Member Bookings</div>
          </div>

          {/* Completed Sessions */}
          <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '0.875rem', padding: '1rem 1.25rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Completed</span>
              <div style={{ width: 28, height: 28, borderRadius: '0.375rem', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={15} />
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#047857' }}>{completedCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{config.supporterSharePercent}% Disbursed to Supporters</div>
          </div>

          {/* Pending Requests */}
          <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '0.875rem', padding: '1rem 1.25rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pending Requests</span>
              <div style={{ width: 28, height: 28, borderRadius: '0.375rem', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={15} />
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706' }}>{requestedCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>Awaiting Companion Response</div>
          </div>
        </div>

        {/* Compact Bookings Table Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid #cbd5e1',
            padding: '1.25rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}
        >
          {/* Header & Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#0d9488" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Bookings Audit Table ({bookings.length})
              </h2>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', background: '#f1f5f9', padding: '0.2rem', borderRadius: '0.5rem' }}>
              {[
                { status: 'ALL', label: 'All' },
                { status: 'REQUESTED', label: 'Requested' },
                { status: 'ACCEPTED', label: 'Accepted' },
                { status: 'IN_PROGRESS', label: 'Active' },
                { status: 'COMPLETED', label: 'Completed' },
                { status: 'CANCELLED_BY_MEMBER', label: 'Cancelled' },
              ].map((t) => (
                <Link
                  key={t.status}
                  href={`/admin/bookings${t.status !== 'ALL' ? `?status=${t.status}` : ''}`}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    background: statusFilter === t.status ? 'white' : 'transparent',
                    color: statusFilter === t.status ? '#0f172a' : '#64748b',
                    boxShadow: statusFilter === t.status ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bookings Table with Compact Cell Padding */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Booking Ref</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Service & Mode</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Member</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Supporter</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Schedule</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Fare (Gross / Net)</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                      No bookings matching the selected status filter.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => {
                    const isCompleted = b.status === 'COMPLETED';
                    const isRequested = b.status === 'REQUESTED';
                    const isAccepted = b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS';
                    const isCancelled = b.status.includes('CANCELLED');

                    return (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        {/* ID Ref */}
                        <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', fontSize: '0.775rem' }}>
                          {b.id.substring(0, 10)}...
                        </td>

                        {/* Service & Mode */}
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{b.service.name}</div>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: b.mode === 'IN_PERSON' ? '#0d9488' : '#2563eb',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                            }}
                          >
                            {b.mode === 'IN_PERSON' ? '📍 In-Person' : '🎥 Video Call'}
                          </span>
                        </td>

                        {/* Member */}
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#334155' }}>
                          {b.member.user.name}
                        </td>

                        {/* Supporter */}
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#334155' }}>
                          {b.supporter.user.name}
                        </td>

                        {/* Schedule */}
                        <td style={{ padding: '0.65rem 0.85rem', color: '#64748b', fontSize: '0.78rem' }}>
                          <div>{format(new Date(b.scheduledAt), 'MMM dd, yyyy')}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{format(new Date(b.scheduledAt), 'hh:mm a')} ({b.durationHours}h)</div>
                        </td>

                        {/* Fare */}
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>₹{b.totalAmount}</div>
                          <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>Net: ₹{b.supporterEarnings.toFixed(1)}</div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.15rem 0.55rem',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: isCompleted ? '#f0fdf4' : isRequested ? '#fffbeb' : isAccepted ? '#eff6ff' : '#fef2f2',
                              color: isCompleted ? '#166534' : isRequested ? '#b45309' : isAccepted ? '#1e40af' : '#991b1b',
                              border: `1px solid ${isCompleted ? '#bbf7d0' : isRequested ? '#fde68a' : isAccepted ? '#bfdbfe' : '#fca5a5'}`,
                            }}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
