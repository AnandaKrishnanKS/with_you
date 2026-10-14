import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getRegionConfig } from '@/lib/config';
import { revalidatePath } from 'next/cache';
import {
  Settings,
  Shield,
  Bell,
  Lock,
  UserCheck,
  CreditCard,
  PhoneCall,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
  Smartphone,
  ShieldAlert,
  Sliders,
  Check,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupporterPreferencesPage({
  searchParams,
}: {
  searchParams?: Promise<{ updated?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'SUPPORTER') {
    redirect('/login');
  }

  const supporter = await prisma.supporterProfile.findUnique({
    where: { userId: session.id },
    include: { user: true },
  });

  if (!supporter) redirect('/login');

  const config = await getRegionConfig('KL');

  const params = await searchParams;
  const isUpdated = params?.updated === 'true';

  let payoutAccount = {
    upiId: '',
    bankName: '',
    accountNo: '',
    ifscCode: '',
  };
  if (supporter.payoutDetails) {
    try {
      payoutAccount = { ...payoutAccount, ...JSON.parse(supporter.payoutDetails) };
    } catch (e) {
      // fallback
    }
  }

  // Server Action to update supporter preferences
  async function updatePreferences(formData: FormData) {
    'use server';

    const sSession = await getSession();
    if (!sSession || sSession.role !== 'SUPPORTER') return;

    const sProfile = await prisma.supporterProfile.findUnique({
      where: { userId: sSession.id },
    });
    if (!sProfile) return;

    const memberGenderPref = (formData.get('memberGenderPref') as string) || 'ANY';
    const maxSessionLength = parseInt((formData.get('maxSessionLength') as string) || '8', 10);
    const emergencyContactName = (formData.get('emergencyContactName') as string) || '';
    const emergencyContactPhone = (formData.get('emergencyContactPhone') as string) || '';
    const upiId = (formData.get('upiId') as string) || '';
    const bankName = (formData.get('bankName') as string) || '';
    const accountNo = (formData.get('accountNo') as string) || '';
    const ifscCode = (formData.get('ifscCode') as string) || '';

    const updatedPayoutDetails = JSON.stringify({
      upiId,
      bankName,
      accountNo,
      ifscCode,
    });

    await prisma.supporterProfile.update({
      where: { id: sProfile.id },
      data: {
        memberGenderPref,
        maxSessionLength,
        emergencyContactName,
        emergencyContactPhone,
        payoutDetails: updatedPayoutDetails,
      },
    });

    revalidatePath('/app/supporter/preferences');
    revalidatePath('/app/supporter/earnings');
    redirect('/app/supporter/preferences?updated=true');
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Title Header */}
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 42, height: 42, borderRadius: '0.75rem', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sliders size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Preferences & Safety Control Center
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Configure member accept preferences, emergency contacts, location alerts, and direct UPI payout accounts.
            </p>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {isUpdated && (
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '1rem',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#15803d',
            fontWeight: 600,
            fontSize: '0.95rem',
            boxShadow: '0 2px 10px rgba(34,197,94,0.08)',
          }}
        >
          <CheckCircle2 size={22} color="#16a34a" />
          <span>Your companion preferences and payout account details have been successfully updated!</span>
        </div>
      )}

      {/* Preferences Form */}
      <form action={updatePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Card 1: Member Companion Acceptance Rules */}
        <div
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px solid #cbd5e1',
            padding: '2.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '0.625rem', background: '#f0fdfa', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Member Companion Acceptance Rules
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.825rem', margin: 0, marginTop: '0.15rem' }}>
                Set member gender boundaries and maximum session length limits for bookings.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {/* Gender Preference */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Member Gender Preference
              </label>
              <select
                name="memberGenderPref"
                defaultValue={supporter.memberGenderPref}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.875rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#f8fafc',
                  outline: 'none',
                }}
                id="member-gender-pref-select"
              >
                <option value="ANY">Any Member Gender (Default)</option>
                <option value="FEMALE_ONLY">Female Members Only</option>
                <option value="MALE_ONLY">Male Members Only</option>
              </select>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Supporters retain full entitlement to set gender preferences for in-person companion bookings.
              </p>
            </div>

            {/* Max Daily Hours */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Max Session Duration Limit
              </label>
              <select
                name="maxSessionLength"
                defaultValue={supporter.maxSessionLength.toString()}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.875rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#f8fafc',
                  outline: 'none',
                }}
                id="max-session-length-select"
              >
                <option value="2">2 Hours Max / Session</option>
                <option value="4">4 Hours Max / Session</option>
                <option value="6">6 Hours Max / Session</option>
                <option value="8">8 Hours Max / Session (Default)</option>
                <option value="12">12 Hours Max / Full Day</option>
              </select>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Protects companions from burnout and ensures rest intervals between consecutive sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Emergency Contact & Location SOS Safety */}
        <div
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px solid #cbd5e1',
            padding: '2.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '0.625rem', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Safety & Emergency Contact Controls
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.825rem', margin: 0, marginTop: '0.15rem' }}>
                Designated emergency contacts notified automatically when live SOS alerts are triggered.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '1.5rem' }}>
            {/* Contact Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Emergency Contact Name
              </label>
              <input
                type="text"
                name="emergencyContactName"
                defaultValue={supporter.emergencyContactName || ''}
                placeholder="e.g. Anjali Nair (Spouse / Relative)"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.875rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: 'white',
                  outline: 'none',
                }}
                id="emergency-contact-name"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                name="emergencyContactPhone"
                defaultValue={supporter.emergencyContactPhone || ''}
                placeholder="e.g. +91 98765 43210"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.875rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: 'white',
                  outline: 'none',
                }}
                id="emergency-contact-phone"
              />
            </div>
          </div>

          <div
            style={{
              background: '#f8fafc',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <PhoneCall size={24} color="#e11d48" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: '#0f172a' }}>24/7 Platform SOS Integration:</strong> During active in-person companion sessions, tapping the red SOS button immediately broadcasts your GPS coordinates to this contact and local Kerala emergency responders.
            </p>
          </div>
        </div>

        {/* Card 3: Payout Account & Direct UPI Details */}
        <div
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px solid #cbd5e1',
            padding: '2.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '0.625rem', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Direct UPI & Bank Payout Account
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.825rem', margin: 0, marginTop: '0.15rem' }}>
                Your {config.supporterSharePercent}% net companion earnings are disbursed directly into this registered account within 48h.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {/* UPI ID */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Primary UPI ID (VPA)
              </label>
              <input
                type="text"
                name="upiId"
                defaultValue={payoutAccount.upiId}
                placeholder="e.g. name@okaxis or 9876543210@paytm"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.875rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: '#0f172a',
                  background: '#f0fdf4',
                  outline: 'none',
                }}
                id="payout-upi-id"
              />
            </div>

            {/* Bank Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                defaultValue={payoutAccount.bankName}
                placeholder="e.g. Federal Bank / HDFC"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.875rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: 'white',
                  outline: 'none',
                }}
                id="payout-bank-name"
              />
            </div>

            {/* Account Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Bank Account Number
              </label>
              <input
                type="text"
                name="accountNo"
                defaultValue={payoutAccount.accountNo}
                placeholder="e.g. 123456789012"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.875rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  color: '#0f172a',
                  background: 'white',
                  outline: 'none',
                }}
                id="payout-account-no"
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                IFSC Code
              </label>
              <input
                type="text"
                name="ifscCode"
                defaultValue={payoutAccount.ifscCode}
                placeholder="e.g. FDRL0001042"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.875rem',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  color: '#0f172a',
                  background: 'white',
                  outline: 'none',
                }}
                id="payout-ifsc-code"
              />
            </div>
          </div>
        </div>

        {/* Save Button Container */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button
            type="submit"
            style={{
              padding: '1rem 2.5rem',
              borderRadius: '0.875rem',
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(13,148,136,0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
            id="save-preferences-btn"
          >
            <Save size={20} /> Save Preferences & Payout Details
          </button>
        </div>
      </form>
    </div>
  );
}
