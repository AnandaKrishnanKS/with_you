import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User, Mail, Phone, MapPin, ShieldCheck, Calendar, HeartHandshake, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default async function MemberProfilePage() {
  const session = await getSession();
  if (!session || session.role !== 'MEMBER') {
    redirect('/login');
  }

  const member = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      memberProfile: {
        include: { district: true },
      },
      memberships: true,
    },
  });

  if (!member || !member.memberProfile) {
    redirect('/login');
  }

  const profile = member.memberProfile;
  const membership = member.memberships[0];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          My Account & Member Profile
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem' }}>
          Manage your personal details, emergency contact information, and annual pass subscription.
        </p>
      </div>

      {/* Main Profile Card */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.75rem', borderBottom: '1px solid #f1f5f9', marginBottom: '2rem' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(13,148,136,0.25)',
              flexShrink: 0,
            }}
          >
            {member.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {member.name}
              </h2>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  background: '#f0fdf4',
                  color: '#166534',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  border: '1px solid #bbf7d0',
                }}
              >
                <CheckCircle2 size={14} color="#16a34a" /> Verified Member
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
              Member ID: {member.id}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.75rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={14} color="#0d9488" /> Email Address
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{member.email}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={14} color="#0d9488" /> Mobile Phone
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>+91 {member.phone}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="#0d9488" /> Location & District
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              {profile.city}, {profile.district?.name || 'Kerala'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldAlert size={14} color="#dc2626" /> Emergency Contact
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              {profile.emergencyContactName || 'Priya Menon'} ({profile.emergencyContactPhone || '9876543210'})
            </div>
          </div>
        </div>
      </div>

      {/* Membership Pass Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
          color: 'white',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          boxShadow: '0 20px 40px -10px rgba(15, 118, 110, 0.35)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#ccfbf1', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '999px', textTransform: 'uppercase' }}>
              Active Pass
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: '0.5rem 0 0' }}>
              WITH YOU Annual Member Pass
            </h3>
          </div>
          <span style={{ background: '#5eead4', color: '#0f766e', fontSize: '0.8rem', fontWeight: 800, padding: '0.35rem 0.85rem', borderRadius: '999px' }}>
            ₹199 / year
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#99f6e4', fontWeight: 600 }}>MEMBERSHIP STATUS</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginTop: '0.2rem' }}>ACTIVE</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#99f6e4', fontWeight: 600 }}>VALID UNTIL</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginTop: '0.2rem' }}>
              {membership ? new Date(membership.validUntil).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '365 Days'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#99f6e4', fontWeight: 600 }}>COMPANION BOOKINGS</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginTop: '0.2rem' }}>Unlimited Requests</div>
          </div>
        </div>
      </div>
    </div>
  );
}
