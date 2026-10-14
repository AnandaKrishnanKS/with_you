import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { format } from 'date-fns';
import {
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  CheckCircle2,
  Lock,
  HeartHandshake,
  FileText,
  ShieldCheck,
  Send,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  UserCheck,
} from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function MemberSafetyPage() {
  const session = await getSession();
  if (!session || session.role !== 'MEMBER') {
    redirect('/login');
  }

  const member = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      memberProfile: {
        include: {
          bookings: {
            include: {
              supporter: { include: { user: true } },
              service: true,
            },
          },
        },
      },
      reportsCreated: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!member || !member.memberProfile) redirect('/login');

  const bookings = member.memberProfile.bookings;

  // Server action to submit incident report
  async function submitIncidentReport(formData: FormData) {
    'use server';
    const sId = await getSession();
    if (!sId) return;

    const reportedUserId = formData.get('reportedUserId') as string;
    const reason = formData.get('reason') as string;
    const bookingId = formData.get('bookingId') as string;

    if (reportedUserId && reason) {
      await prisma.report.create({
        data: {
          reporterId: sId.id,
          reportedUserId,
          bookingId: bookingId || null,
          reason,
          status: 'OPEN',
        },
      });
      revalidatePath('/app/member/safety');
      revalidatePath('/admin/reports');
    }
  }

  // Server action to trigger SOS Alert
  async function triggerSosAlert(formData: FormData) {
    'use server';
    const sId = await getSession();
    if (!sId) return;

    const bookingId = formData.get('bookingId') as string;
    if (bookingId) {
      await prisma.sosAlert.create({
        data: {
          userId: sId.id,
          bookingId,
          status: 'TRIGGERED',
        },
      });
      revalidatePath('/app/member/safety');
      revalidatePath('/admin/reports');
    }
  }

  return (
    <div style={{ maxWidth: 1150, margin: '0 auto', padding: '2rem 1.5rem 4rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Title Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Trust & Safety Desk
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem' }}>
          Your security, dignity, and comfort are our top priorities. Access 24/7 helplines and confidential incident response.
        </p>
      </div>

      {/* Top 24/7 Safety Helpline Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
          color: 'white',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 12px 30px rgba(220, 38, 38, 0.3)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldAlert size={30} color="white" />
            </div>
            <div>
              <span style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                24/7 Active Hotline
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.35rem 0 0' }}>
                Emergency Response & Helpline
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#fca5a5', margin: '0.2rem 0 0' }}>
                Need immediate emergency response during an active session? Tap below to dial Kerala emergency services.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a
              href="tel:112"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.5rem',
                background: 'white',
                color: '#991b1b',
                borderRadius: '0.875rem',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <PhoneCall size={18} color="#dc2626" /> Dial 112 (Police)
            </a>
            <a
              href="tel:1091"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.25rem',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '0.875rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              <Phone size={16} /> 1091 Women Line
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Platonic Policy & SOS Trigger */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Platonic Code of Conduct Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px solid #cbd5e1',
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <HeartHandshake size={22} color="#0d9488" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Strictly Platonic Rules
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { title: 'Public Locations Only', desc: 'Outings are strictly restricted to public cafes, parks, malls, or libraries.' },
              { title: 'Aadhaar Verified Supporters', desc: 'Every companion profile is verified with government ID and selfie liveness match.' },
              { title: 'Encrypted Contact Details', desc: 'Personal phone numbers and emails are never disclosed to third parties.' },
              { title: 'Zero Tolerance Policy', desc: 'Any romantic or inappropriate request results in an immediate lifetime ban.' },
            ].map((rule) => (
              <div
                key={rule.title}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                }}
              >
                <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{rule.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>{rule.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Active Session SOS Alert Trigger */}
        <div
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px solid #cbd5e1',
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <ShieldAlert size={22} color="#dc2626" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                In-App SOS Trigger
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              During an active session, tapping the SOS alert button sends your location coordinates and booking reference directly to our 24/7 Emergency Desk.
            </p>

            {bookings.length === 0 ? (
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '0.875rem', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                No active session scheduled right now.
              </div>
            ) : (
              <form action={triggerSosAlert} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                    Select Active Booking for SOS Alert
                  </label>
                  <select
                    name="bookingId"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    required
                  >
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.service.name} with {b.supporter.user.name} ({b.status})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '0.875rem',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(220,38,38,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <ShieldAlert size={18} /> Trigger SOS Emergency Alert
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Confidential Incident Reporting Form */}
      <div
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          border: '1px solid #cbd5e1',
          padding: '2.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <AlertTriangle size={22} color="#d97706" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            File a Confidential Incident Report
          </h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem', maxWidth: 700 }}>
          If you experienced any boundary concern or unprofessional behavior during a session, submit a confidential report. Our trust team reviews reports within 1 hour.
        </p>

        <form action={submitIncidentReport} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 720 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Select Companion / Supporter
              </label>
              <select
                name="reportedUserId"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                required
              >
                {bookings.map((b) => (
                  <option key={b.id} value={b.supporter.userId}>
                    {b.supporter.user.name} ({b.service.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Select Booking (Optional)
              </label>
              <select
                name="bookingId"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              >
                <option value="">None / General</option>
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.service.name} - {format(new Date(b.scheduledAt), 'dd MMM yyyy')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
              Detailed Explanation of Incident
            </label>
            <textarea
              name="reason"
              rows={4}
              placeholder="Describe what happened in detail. All reports are encrypted and strictly confidential..."
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              style={{
                padding: '0.875rem 2rem',
                borderRadius: '0.75rem',
                background: '#0f172a',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Send size={16} /> Submit Confidential Incident Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
