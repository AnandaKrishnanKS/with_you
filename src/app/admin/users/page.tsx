import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { format } from 'date-fns';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import {
  Users,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  UserX,
  Search,
  ArrowLeft,
  ShieldAlert,
  BadgeCheck,
  Building2,
  Filter,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string; search?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const params = await searchParams;
  const roleFilter = params?.role || 'ALL';

  const whereClause: any = {};
  if (roleFilter !== 'ALL') {
    whereClause.role = roleFilter;
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    include: {
      memberProfile: { include: { district: true } },
      supporterProfile: { include: { district: true, kycVerification: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const memberCount = await prisma.user.count({ where: { role: 'MEMBER' } });
  const supporterCount = await prisma.user.count({ where: { role: 'SUPPORTER' } });
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });

  // Server Action to toggle user active/suspended status
  async function toggleUserStatus(formData: FormData) {
    'use server';
    const aSession = await getSession();
    if (!aSession || aSession.role !== 'ADMIN') return;

    const targetUserId = formData.get('userId') as string;
    const currentStatus = formData.get('currentStatus') as string;
    const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';

    await prisma.user.update({
      where: { id: targetUserId },
      data: { status: newStatus },
    });

    revalidatePath('/admin/users');
    revalidatePath('/admin');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Top Header Bar */}
      <div
        style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#64748b',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.4rem 0.75rem',
              borderRadius: '0.5rem',
              background: '#f1f5f9',
            }}
          >
            <ArrowLeft size={16} /> Back to Admin Dashboard
          </Link>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            User Management Directory
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/admin/bookings" className="btn btn-outline btn-sm">Bookings</Link>
          <Link href="/admin/reports" className="btn btn-outline btn-sm">Reports & SOS</Link>
          <Link href="/admin/regions" className="btn btn-outline btn-sm">Regions</Link>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: 1250, margin: '0 auto' }}>
        {/* Metric Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {/* Total Users */}
          <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Registered</span>
              <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>{users.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>Platform User Directory</div>
          </div>

          {/* Members */}
          <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Members</span>
              <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#2563eb' }}>{memberCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>Bookings & Support Seekers</div>
          </div>

          {/* Supporters */}
          <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supporters</span>
              <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BadgeCheck size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16a34a' }}>{supporterCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>Verified Companions</div>
          </div>

          {/* Admins */}
          <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Admins</span>
              <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#9333ea' }}>{adminCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>System Administrators</div>
          </div>
        </div>

        {/* User Table Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px solid #cbd5e1',
            padding: '1.75rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          {/* Table Header & Filters */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Users size={20} color="#0d9488" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                User Accounts Data Table ({users.length})
              </h2>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '0.75rem' }}>
              {[
                { role: 'ALL', label: 'All Users' },
                { role: 'MEMBER', label: 'Members' },
                { role: 'SUPPORTER', label: 'Supporters' },
                { role: 'ADMIN', label: 'Admins' },
              ].map((t) => (
                <Link
                  key={t.role}
                  href={`/admin/users${t.role !== 'ALL' ? `?role=${t.role}` : ''}`}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    background: roleFilter === t.role ? 'white' : 'transparent',
                    color: roleFilter === t.role ? '#0f172a' : '#64748b',
                    boxShadow: roleFilter === t.role ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Table Data */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>User Profile</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Contact Info</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Joined Date</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const districtName =
                    u.memberProfile?.district?.name ||
                    u.supporterProfile?.district?.name ||
                    'Kerala';
                  const city = u.memberProfile?.city || u.supporterProfile?.city || 'Kochi';
                  const initial = u.name.charAt(0).toUpperCase();
                  const isSuspended = u.status === 'SUSPENDED';

                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', background: isSuspended ? '#fef2f2' : 'white' }}>
                      {/* Name & ID */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              background: u.role === 'ADMIN' ? '#faf5ff' : u.role === 'SUPPORTER' ? '#f0fdfa' : '#eff6ff',
                              color: u.role === 'ADMIN' ? '#9333ea' : u.role === 'SUPPORTER' ? '#0d9488' : '#2563eb',
                              border: `1px solid ${u.role === 'ADMIN' ? '#d8b4fe' : u.role === 'SUPPORTER' ? '#99f6e4' : '#bfdbfe'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.9rem',
                            }}
                          >
                            {initial}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.925rem' }}>{u.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>ID: {u.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '1rem', fontSize: '0.825rem' }}>
                        <div style={{ color: '#334155', fontWeight: 600 }}>{u.email}</div>
                        <div style={{ color: '#64748b', marginTop: '0.15rem' }}>+91 {u.phone}</div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: u.role === 'ADMIN' ? '#f3e8ff' : u.role === 'SUPPORTER' ? '#ccfbf1' : '#dbeafe',
                            color: u.role === 'ADMIN' ? '#7e22ce' : u.role === 'SUPPORTER' ? '#0f766e' : '#1e40af',
                          }}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Location */}
                      <td style={{ padding: '1rem', fontSize: '0.825rem', color: '#475569', fontWeight: 500 }}>
                        {city}, {districtName}
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '1rem', fontSize: '0.825rem', color: '#64748b' }}>
                        {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: isSuspended ? '#fee2e2' : '#f0fdf4',
                            color: isSuspended ? '#991b1b' : '#166534',
                            border: `1px solid ${isSuspended ? '#fca5a5' : '#bbf7d0'}`,
                          }}
                        >
                          {u.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <form action={toggleUserStatus} style={{ display: 'inline-block' }}>
                          <input type="hidden" name="userId" value={u.id} />
                          <input type="hidden" name="currentStatus" value={u.status} />
                          <button
                            type="submit"
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: `1px solid ${isSuspended ? '#bbf7d0' : '#fca5a5'}`,
                              background: isSuspended ? '#f0fdf4' : '#fff1f2',
                              color: isSuspended ? '#166534' : '#be123c',
                            }}
                          >
                            {isSuspended ? 'Activate User' : 'Suspend'}
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
