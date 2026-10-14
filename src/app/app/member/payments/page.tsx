import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { format } from 'date-fns';
import {
  Receipt,
  CheckCircle2,
  Download,
  ShieldCheck,
  CreditCard,
  Lock,
  Wallet,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  FileText,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MemberPaymentsPage() {
  const session = await getSession();
  if (!session || session.role !== 'MEMBER') {
    redirect('/login');
  }

  const member = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      memberProfile: true,
      memberships: true,
    },
  });

  if (!member) redirect('/login');

  const payments = await prisma.payment.findMany({
    where: { userId: session.id },
    include: {
      booking: {
        include: {
          service: true,
          supporter: {
            include: { user: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Also query bookings for member to calculate total spent & escrow
  const bookings = await prisma.booking.findMany({
    where: { member: { userId: session.id } },
    include: {
      service: true,
      supporter: { include: { user: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 199); // includes ₹199 member pass
  const escrowHeld = bookings
    .filter((b) => ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS'].includes(b.status))
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div style={{ maxWidth: 1150, margin: '0 auto', padding: '2rem 1.5rem 4rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Payments, Escrow & Official Receipts
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem' }}>
          Track companion session payments, view escrow status, and download tax-compliant digital receipts.
        </p>
      </div>

      {/* Top Financial Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {/* Card 1: Total Spent */}
        <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Invested
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: '#ccfbf1', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#0d9488', marginTop: '0.5rem', fontWeight: 600 }}>
            Includes Annual Pass & Sessions
          </div>
        </div>

        {/* Card 2: Escrow Protection */}
        <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Funds Held in Escrow
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>
            ₹{escrowHeld.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '0.5rem', fontWeight: 600 }}>
            Released after session completion
          </div>
        </div>

        {/* Card 3: Member Pass Status */}
        <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Member Pass Status
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: '#f0fdf4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>
            ₹199 / year
          </div>
          <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '0.5rem', fontWeight: 600 }}>
            Active · Unlimited Bookings
          </div>
        </div>
      </div>

      {/* Escrow Guarantee Notice Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ccfbf1 100%)',
          border: '1px solid #99f6e4',
          borderRadius: '1.25rem',
          padding: '1.25rem 1.75rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ width: 42, height: 42, borderRadius: '0.75rem', background: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldCheck size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f766e' }}>
            100% Escrow Refund Guarantee
          </div>
          <div style={{ fontSize: '0.85rem', color: '#115e59', marginTop: '0.15rem', lineHeight: 1.5 }}>
            Booking payments are held safely in platform escrow and are only released to Supporters after the companion session ends. Full 100% refund if cancelled &gt;24h prior.
          </div>
        </div>
      </div>

      {/* Transactions Table Section */}
      <div
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          border: '1px solid #cbd5e1',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Receipt size={20} color="#0d9488" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Transaction Receipts & Ledger
            </h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            {bookings.length + 1} Record{bookings.length !== 0 ? 's' : ''}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.85rem 1rem', borderRadius: '0.5rem 0 0 0.5rem' }}>Reference / Receipt ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Description & Service</th>
                <th style={{ padding: '0.85rem 1rem' }}>Companion / Provider</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Amount (INR)</th>
                <th style={{ padding: '0.85rem 1rem', borderRadius: '0 0.5rem 0.5rem 0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Member Pass Row */}
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 700, color: '#0f766e', fontSize: '0.82rem' }}>
                  WY-MEM-2026-001
                </td>
                <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  WITH YOU Annual Member Pass
                </td>
                <td style={{ padding: '1rem', color: '#64748b' }}>Platform License</td>
                <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.82rem' }}>05 Oct 2026</td>
                <td style={{ padding: '1rem', fontWeight: 800, color: '#0f172a' }}>₹199.00</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={13} color="#16a34a" /> PAID & ACTIVE
                  </span>
                </td>
              </tr>

              {/* Bookings Rows */}
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 600, color: '#475569', fontSize: '0.82rem' }}>
                    WY-PAY-{b.id.substring(0, 8).toUpperCase()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{b.service.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.1rem' }}>
                      {b.mode === 'VIDEO_CALL' ? 'HD Video Call Session' : 'In-Person Outing'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#334155' }}>
                    {b.supporter.user.name}
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.82rem' }}>
                    {format(new Date(b.scheduledAt), 'dd MMM yyyy')}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{b.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {['REQUESTED', 'ACCEPTED', 'IN_PROGRESS'].includes(b.status) ? (
                      <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Lock size={12} color="#d97706" /> HELD IN ESCROW
                      </span>
                    ) : b.status === 'COMPLETED' ? (
                      <span style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={13} color="#16a34a" /> RELEASED TO HOST
                      </span>
                    ) : (
                      <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                        REFUNDED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
