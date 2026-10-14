import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { AlertTriangle, ShieldCheck, ArrowLeft, CheckCircle2, Clock, PhoneCall, User, ShieldAlert } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') redirect('/login');

  const [reports, sosAlerts] = await Promise.all([
    prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: true,
        reportedUser: true,
        booking: {
          include: {
            service: true,
          },
        },
      },
    }),
    prisma.sosAlert.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        booking: {
          include: {
            service: true,
          },
        },
      },
    }),
  ]);

  // Server Action: Update SOS Alert Status
  async function updateSosStatus(formData: FormData) {
    'use server';
    const alertId = formData.get('alertId') as string;
    const status = formData.get('status') as string;
    if (alertId && status) {
      await prisma.sosAlert.update({
        where: { id: alertId },
        data: { status },
      });
      revalidatePath('/admin/reports');
    }
  }

  // Server Action: Update Report Status
  async function updateReportStatus(formData: FormData) {
    'use server';
    const reportId = formData.get('reportId') as string;
    const status = formData.get('status') as string;
    if (reportId && status) {
      await prisma.report.update({
        where: { id: reportId },
        data: { status },
      });
      revalidatePath('/admin/reports');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1.25rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/admin" style={{ color: '#0f766e', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>
              <ArrowLeft size={16} /> Admin Dashboard
            </Link>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>Reports & SOS Emergencies</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', padding: '0.35rem 0.85rem', borderRadius: '999px', color: '#991b1b', fontSize: '0.8rem', fontWeight: 700 }}>
            <PhoneCall size={14} color="#dc2626" /> Emergency Desk Active
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1.5rem' }}>
        {/* Top Emergency Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'white', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Active SOS Alerts</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: sosAlerts.filter(a => a.status === 'TRIGGERED').length > 0 ? '#dc2626' : '#16a34a', marginTop: '0.2rem' }}>
              {sosAlerts.filter(a => a.status === 'TRIGGERED').length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Open User Reports</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706', marginTop: '0.2rem' }}>
              {reports.filter(r => r.status === 'OPEN').length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Resolved Incidents</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0d9488', marginTop: '0.2rem' }}>
              {reports.filter(r => r.status === 'RESOLVED').length + sosAlerts.filter(a => a.status === 'RESOLVED').length}
            </div>
          </div>
        </div>

        {/* SOS Emergency Alerts Section */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <ShieldAlert size={22} color="#dc2626" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Live SOS Emergency Alerts ({sosAlerts.length})
            </h2>
          </div>

          {sosAlerts.length === 0 ? (
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
              <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 600, color: '#0f172a' }}>No Active Emergency Alerts</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>All companion sessions are proceeding safely.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sosAlerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    background: alert.status === 'TRIGGERED' ? '#fef2f2' : 'white',
                    border: alert.status === 'TRIGGERED' ? '2px solid #fca5a5' : '1px solid #cbd5e1',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                      <span
                        style={{
                          background: alert.status === 'TRIGGERED' ? '#dc2626' : alert.status === 'ACKNOWLEDGED' ? '#d97706' : '#16a34a',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                        }}
                      >
                        {alert.status}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Triggered on {format(alert.createdAt, 'dd MMM yyyy, hh:mm a')}
                      </span>
                    </div>

                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                      Alert Triggered by: {alert.user.name} ({alert.user.phone})
                    </div>
                    {alert.booking && (
                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                        Service: <strong>{alert.booking.service.name}</strong> · Location: {alert.booking.meetingLocation || 'Video Call'}
                      </div>
                    )}
                  </div>

                  {/* Actions Form */}
                  <form action={updateSosStatus} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="hidden" name="alertId" value={alert.id} />
                    {alert.status === 'TRIGGERED' && (
                      <button type="submit" name="status" value="ACKNOWLEDGED" style={{ background: '#d97706', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                        Acknowledge Call
                      </button>
                    )}
                    {alert.status !== 'RESOLVED' && (
                      <button type="submit" name="status" value="RESOLVED" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                        Mark Resolved
                      </button>
                    )}
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Misconduct Reports Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <AlertTriangle size={22} color="#d97706" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              User Conduct Reports ({reports.length})
            </h2>
          </div>

          {reports.length === 0 ? (
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
              <ShieldCheck size={32} color="#0d9488" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 600, color: '#0f172a' }}>Zero Misconduct Reports</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>All members and supporters are maintaining platonic community guidelines.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reports.map((rpt) => (
                <div
                  key={rpt.id}
                  style={{
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ background: rpt.status === 'OPEN' ? '#fef3c7' : '#f1f5f9', color: rpt.status === 'OPEN' ? '#92400e' : '#475569', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '999px' }}>
                        {rpt.status}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Reported on {format(rpt.createdAt, 'dd MMM yyyy')}
                      </span>
                    </div>

                    <form action={updateReportStatus} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="hidden" name="reportId" value={rpt.id} />
                      {rpt.status === 'OPEN' && (
                        <button type="submit" name="status" value="UNDER_INVESTIGATION" style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                          Investigate
                        </button>
                      )}
                      {rpt.status !== 'RESOLVED' && (
                        <button type="submit" name="status" value="RESOLVED" style={{ background: '#0d9488', color: 'white', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                          Resolve
                        </button>
                      )}
                    </form>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>REPORTER</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{rpt.reporter.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>{rpt.reporter.email}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>REPORTED USER</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#dc2626' }}>{rpt.reportedUser.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>{rpt.reportedUser.email}</div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Reason / Allegation:</div>
                    <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>{rpt.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
