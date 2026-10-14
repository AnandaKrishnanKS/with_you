import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const DAYS = [
  { num: 1, label: 'Monday' },
  { num: 2, label: 'Tuesday' },
  { num: 3, label: 'Wednesday' },
  { num: 4, label: 'Thursday' },
  { num: 5, label: 'Friday' },
  { num: 6, label: 'Saturday' },
  { num: 0, label: 'Sunday' },
];

export default async function SupporterSchedulePage() {
  const session = await getSession();
  if (!session || session.role !== 'SUPPORTER') {
    redirect('/login');
  }

  const supporter = await prisma.supporterProfile.findUnique({
    where: { userId: session.id },
    include: { availability: true },
  });

  if (!supporter) redirect('/login');

  // Server action to save full weekly schedule
  async function saveSchedule(formData: FormData) {
    'use server';
    const sSession = await getSession();
    if (!sSession) return;

    const sProfile = await prisma.supporterProfile.findUnique({
      where: { userId: sSession.id },
    });
    if (!sProfile) return;

    // Delete existing availability slots for this supporter
    await prisma.availability.deleteMany({
      where: { supporterId: sProfile.id },
    });

    // Re-create slots for each active day
    for (const day of DAYS) {
      const active = formData.get(`active_${day.num}`) === 'on';
      const startTime = (formData.get(`start_${day.num}`) as string) || '09:00';
      const endTime = (formData.get(`end_${day.num}`) as string) || '18:00';

      if (active) {
        await prisma.availability.create({
          data: {
            supporterId: sProfile.id,
            dayOfWeek: day.num,
            startTime,
            endTime,
          },
        });
      }
    }

    revalidatePath('/app/supporter/schedule');
    revalidatePath(`/app/member/supporter/${sProfile.id}`);
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Weekly Availability & Schedule Manager
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Set your active days and hours for receiving companion booking requests in Kerala.
          </p>
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 1rem',
            borderRadius: '999px',
            background: supporter.availabilityStatus === 'ONLINE' ? '#f0fdf4' : '#f8fafc',
            color: supporter.availabilityStatus === 'ONLINE' ? '#166534' : '#475569',
            border: `1px solid ${supporter.availabilityStatus === 'ONLINE' ? '#bbf7d0' : '#e2e8f0'}`,
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: supporter.availabilityStatus === 'ONLINE' ? '#22c55e' : '#94a3b8' }} />
          Status: {supporter.availabilityStatus}
        </span>
      </div>

      {/* Main Schedule Form Card */}
      <div
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          border: '1px solid #cbd5e1',
          padding: '2.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar size={22} color="#0d9488" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              7-Day Working Hours Grid
            </h2>
          </div>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            {supporter.availability.length} Active Slot{supporter.availability.length !== 1 ? 's' : ''} Configured
          </span>
        </div>

        <form action={saveSchedule}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {DAYS.map((day) => {
              const slot = supporter.availability.find((a) => a.dayOfWeek === day.num);
              const isActive = !!slot;

              return (
                <div
                  key={day.num}
                  style={{
                    background: isActive ? '#f0fdfa' : '#f8fafc',
                    border: `1px solid ${isActive ? '#ccfbf1' : '#e2e8f0'}`,
                    borderRadius: '1rem',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 160 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        name={`active_${day.num}`}
                        defaultChecked={isActive}
                        style={{ width: 18, height: 18, accentColor: '#0d9488', cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{day.label}</span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>From:</span>
                      <input
                        type="time"
                        name={`start_${day.num}`}
                        defaultValue={slot?.startTime || '09:00'}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '0.625rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          background: 'white',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>To:</span>
                      <input
                        type="time"
                        name={`end_${day.num}`}
                        defaultValue={slot?.endTime || '18:00'}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '0.625rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          background: 'white',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        background: isActive ? '#dcfce7' : '#f1f5f9',
                        color: isActive ? '#15803d' : '#64748b',
                      }}
                    >
                      {isActive ? 'Active' : 'Off Day'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              style={{
                padding: '0.9rem 2.25rem',
                borderRadius: '0.875rem',
                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(13,148,136,0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              id="save-schedule-btn"
            >
              <Save size={18} /> Save Availability Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
