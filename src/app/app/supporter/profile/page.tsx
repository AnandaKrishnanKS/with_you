import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Image from 'next/image';
import {
  ShieldCheck,
  MapPin,
  Languages,
  User,
  Star,
  Clock,
  Heart,
  Calendar,
  CheckCircle2,
  Award,
  PhoneCall,
  Sparkles,
  Edit,
} from 'lucide-react';

export default async function SupporterProfilePage() {
  const session = await getSession();
  if (!session || session.role !== 'SUPPORTER') {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      supporterProfile: {
        include: {
          district: true,
          kycVerification: true,
          services: { include: { service: true } },
          availability: true,
          reviews: true,
        },
      },
    },
  });

  if (!user || !user.supporterProfile) redirect('/login');

  const profile = user.supporterProfile;
  const languages: string[] = profile.languages ? JSON.parse(profile.languages) : ['Malayalam', 'English'];

  const avgRating =
    profile.reviews.length > 0
      ? (profile.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / profile.reviews.length).toFixed(1)
      : '5.0';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Title Bar */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Supporter Profile & Companion Settings
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Manage your public bio, offered services, availability schedule, and emergency contacts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              background: profile.availabilityStatus === 'ONLINE' ? '#f0fdf4' : '#f1f5f9',
              color: profile.availabilityStatus === 'ONLINE' ? '#166534' : '#475569',
              border: `1px solid ${profile.availabilityStatus === 'ONLINE' ? '#bbf7d0' : '#cbd5e1'}`,
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: profile.availabilityStatus === 'ONLINE' ? '#22c55e' : '#94a3b8' }} />
            {profile.availabilityStatus === 'ONLINE' ? 'Online & Available' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          border: '1px solid #cbd5e1',
          padding: '2.5rem',
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.04)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: '2rem' }}>
          <div
            style={{
              position: 'relative',
              width: 120,
              height: 120,
              borderRadius: '1.25rem',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
              border: '2px solid #99f6e4',
              flexShrink: 0,
            }}
          >
            <Image
              src={profile.photoUrl || '/avatars/default.svg'}
              alt={user.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {user.name}
              </h2>
              {profile.verificationStatus === 'APPROVED' ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: '#f0fdf4',
                    color: '#15803d',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <ShieldCheck size={14} color="#16a34a" /> Aadhaar KYC Verified
                </span>
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: '#fef3c7',
                    color: '#92400e',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    border: '1px solid #fde68a',
                  }}
                >
                  Verification Pending
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
              <MapPin size={15} color="#0d9488" />
              <span>{profile.city}, {profile.district?.name || 'Kerala'}</span>
            </div>

            {/* Quick Metrics Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Reliability Score</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0d9488', marginTop: '0.1rem' }}>{profile.reliabilityScore}%</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Rating</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={16} fill="#f59e0b" color="#f59e0b" /> {avgRating} ({profile.reviews.length} reviews)
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Languages</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginTop: '0.25rem' }}>{languages.join(', ')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div style={{ marginTop: '2rem', paddingTop: '1.75rem', borderTop: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            About Me / Public Bio
          </h3>
          <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
            {profile.shortBio || 'Empathetic companion providing emotional listening, outings help, and elder care.'}
          </p>
        </div>
      </div>

      {/* Grid: Services Offered & Weekly Availability */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Offered Services */}
        <div
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px solid #cbd5e1',
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Sparkles size={20} color="#0d9488" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Offered Services ({profile.services.length})</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {profile.services.map(({ service }: any) => (
              <div
                key={service.id}
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#166534' }}>{service.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.15rem' }}>{service.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Availability */}
        <div
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px solid #cbd5e1',
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Calendar size={20} color="#0d9488" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Weekly Active Schedule</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => {
              const dayNum = idx + 1;
              const slot = profile.availability.find((a: any) => a.dayOfWeek === dayNum);
              return (
                <div
                  key={dayName}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    background: slot ? '#f0fdfa' : '#f8fafc',
                    border: `1px solid ${slot ? '#ccfbf1' : '#e2e8f0'}`,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: slot ? '#0f766e' : '#94a3b8' }}>{dayName}</div>
                  <div style={{ fontSize: '0.78rem', color: slot ? '#0d9488' : '#94a3b8', marginTop: '0.2rem', fontWeight: 600 }}>
                    {slot ? `${slot.startTime} - ${slot.endTime}` : 'Off'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Emergency Contact & Safety Info */}
      <div
        style={{
          background: '#0f172a',
          color: 'white',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(15,23,42,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <PhoneCall size={20} color="#5eead4" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Emergency Contact Details</h3>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 1rem', lineHeight: 1.6 }}>
          Used strictly by our 24/7 trust desk during active companion bookings or SOS emergency alerts.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', background: 'rgba(255,255,255,0.06)', padding: '1rem 1.25rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>CONTACT NAME</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginTop: '0.1rem' }}>{profile.emergencyContactName || 'Rajan Nair'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>PHONE NUMBER</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#5eead4', marginTop: '0.1rem' }}>+91 {profile.emergencyContactPhone || '9876543211'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
