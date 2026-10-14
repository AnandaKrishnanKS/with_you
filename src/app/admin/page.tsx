import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Users,
  CalendarDays,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ShieldAlert,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') redirect('/login');

  const [totalUsers, totalBookings, totalRevenue, pendingVerifications, recentBookings, pendingSupporters] =
    await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.supporterProfile.count({ where: { verificationStatus: 'PENDING_REVIEW' } }),
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          member: { include: { user: true } },
          supporter: { include: { user: true } },
          service: true,
        },
      }),
      prisma.supporterProfile.findMany({
        where: { verificationStatus: 'PENDING_REVIEW' },
        include: { user: true, kycVerification: true, district: true },
        take: 5,
      }),
    ]);

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: '#0d9488' },
    { label: 'Total Bookings', value: totalBookings, icon: CalendarDays, color: '#7c3aed' },
    {
      label: 'Total Revenue',
      value: `₹${((totalRevenue._sum.amount || 0)).toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: '#16a34a',
    },
    { label: 'Pending KYC', value: pendingVerifications, icon: Clock, color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Clean Top Header Bar */}
      <div
        style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600 }}>
            with <span style={{ color: '#0d9488' }}>you</span>
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'Inter, sans-serif',
              background: '#fee2e2',
              color: '#991b1b',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              fontWeight: 800,
              letterSpacing: '0.05em',
            }}
          >
            ADMIN CONTROL
          </span>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '0.625rem',
              border: '1px solid #cbd5e1',
              background: 'white',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Log Out
          </button>
        </form>
      </div>

      {/* Main Admin Content Container */}
      <div style={{ padding: '1.75rem 2rem 3rem', maxWidth: 1250, margin: '0 auto' }}>
        
        {/* Page Title Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Admin Dashboard & Hub
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Kerala Platform Monitoring & Safety Operations
          </p>
        </div>

        {/* TOP QUICK NAVIGATION MODULES (Brought to the top) */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Quick Admin Modules
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {/* Manage Users */}
            <Link
              href="/admin/users"
              style={{
                background: 'white',
                border: '1.5px solid #cbd5e1',
                borderRadius: '1rem',
                padding: '1.15rem 1.25rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.625rem', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>Manage Users</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{totalUsers} Registered Accounts</div>
                </div>
              </div>
              <ArrowUpRight size={16} color="#0d9488" />
            </Link>

            {/* All Bookings */}
            <Link
              href="/admin/bookings"
              style={{
                background: 'white',
                border: '1.5px solid #cbd5e1',
                borderRadius: '1rem',
                padding: '1.15rem 1.25rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.625rem', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarDays size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>All Bookings</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{totalBookings} Total Audit Logs</div>
                </div>
              </div>
              <ArrowUpRight size={16} color="#7c3aed" />
            </Link>

            {/* Reports & SOS */}
            <Link
              href="/admin/reports"
              style={{
                background: 'white',
                border: '1.5px solid #cbd5e1',
                borderRadius: '1rem',
                padding: '1.15rem 1.25rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.625rem', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>Reports & SOS</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Emergency Incidents</div>
                </div>
              </div>
              <ArrowUpRight size={16} color="#e11d48" />
            </Link>

            {/* Region Config */}
            <Link
              href="/admin/regions"
              style={{
                background: 'white',
                border: '1.5px solid #cbd5e1',
                borderRadius: '1rem',
                padding: '1.15rem 1.25rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.625rem', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>Region Config</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Kerala Fee Rules</div>
                </div>
              </div>
              <ArrowUpRight size={16} color="#0284c7" />
            </Link>
          </div>
        </div>

        {/* Key Platform Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1rem', padding: '1.25rem 1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</span>
                <div
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '0.625rem',
                    background: `${s.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <s.icon size={16} color={s.color} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Pending Verifications & Recent Bookings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {/* Pending KYC Verifications */}
          <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#f59e0b" /> Pending KYC Approvals ({pendingVerifications})
            </h2>
            {pendingSupporters.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem', background: '#f8fafc', borderRadius: '0.875rem', fontSize: '0.9rem' }}>
                ✅ All supporter verifications are up to date!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {pendingSupporters.map((sp) => (
                  <div key={sp.id} style={{ padding: '1rem', borderRadius: '0.875rem', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div className="avatar" style={{ width: 34, height: 34, fontSize: '0.85rem' }}>{sp.user.name.charAt(0)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{sp.user.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {sp.city || sp.district?.name} · {format(sp.createdAt, 'dd MMM yyyy')}
                        </div>
                      </div>
                      {sp.kycVerification && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: '#ccfbf1', color: '#0f766e' }}>
                          KYC {sp.kycVerification.status}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <ApproveButton supporterId={sp.id} action="APPROVED" />
                      <ApproveButton supporterId={sp.id} action="REJECTED" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Bookings Audit */}
          <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarDays size={18} color="#7c3aed" /> Recent Bookings Feed
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.875rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      {b.member.user.name.split(' ')[0]} → {b.supporter.user.name.split(' ')[0]}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.1rem' }}>
                      {b.service.name} · {format(b.scheduledAt, 'dd MMM')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>₹{b.totalAmount}</div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '999px',
                        background:
                          b.status === 'COMPLETED'
                            ? '#dcfce7'
                            : b.status === 'ACCEPTED'
                              ? '#dbeafe'
                              : '#fef9c3',
                        color:
                          b.status === 'COMPLETED'
                            ? '#15803d'
                            : b.status === 'ACCEPTED'
                              ? '#1e40af'
                              : '#92400e',
                        fontWeight: 700,
                      }}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApproveButton({ supporterId, action }: { supporterId: string; action: 'APPROVED' | 'REJECTED' }) {
  return (
    <form action={`/api/admin/supporters/${supporterId}/verify`} method="POST" style={{ flex: 1 }}>
      <input type="hidden" name="status" value={action} />
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '0.4rem',
          borderRadius: '0.5rem',
          fontWeight: 700,
          fontSize: '0.8rem',
          cursor: 'pointer',
          border: action === 'APPROVED' ? 'none' : '1px solid #fca5a5',
          background: action === 'APPROVED' ? '#0d9488' : '#fff1f2',
          color: action === 'APPROVED' ? 'white' : '#dc2626',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem',
        }}
      >
        {action === 'APPROVED' ? <><CheckCircle size={13} /> Approve</> : <><XCircle size={13} /> Reject</>}
      </button>
    </form>
  );
}
