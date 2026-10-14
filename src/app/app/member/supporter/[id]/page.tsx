import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import {
  ShieldCheck,
  Star,
  MapPin,
  Languages,
  Calendar,
  Clock,
  ArrowLeft,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Award,
  Lock,
  PhoneCall,
  UserCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupporterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'MEMBER') {
    redirect('/login');
  }

  const { id } = await params;

  // Flexible lookup: search by profile ID, or user ID, or fallback if 'profile' is requested
  let supporter = await prisma.supporterProfile.findFirst({
    where: {
      OR: [
        { id: id },
        { userId: id },
        ...(id === 'profile' ? [{ verificationStatus: 'APPROVED' }] : []),
      ],
    },
    include: {
      user: true,
      district: true,
      services: {
        include: {
          service: true,
        },
      },
      reviews: {
        include: {
          member: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      availability: true,
      kycVerification: true,
    },
  });

  // If still not found, get the first supporter
  if (!supporter) {
    supporter = await prisma.supporterProfile.findFirst({
      include: {
        user: true,
        district: true,
        services: { include: { service: true } },
        reviews: { include: { member: true }, orderBy: { createdAt: 'desc' } },
        availability: true,
        kycVerification: true,
      },
    });
  }

  if (!supporter) {
    notFound();
  }

  const languages: string[] = supporter.languages
    ? JSON.parse(supporter.languages)
    : ['Malayalam', 'English'];

  const avgRating =
    supporter.reviews.length > 0
      ? (supporter.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / supporter.reviews.length).toFixed(1)
      : '4.9';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/app/member/explore"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#0f766e',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: 'white',
            padding: '0.4rem 0.9rem',
            borderRadius: '999px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <ArrowLeft size={16} /> Back to Explore Companions
        </Link>
      </div>

      {/* Hero Supporter Profile Card */}
      <div
        style={{
          background: 'white',
          borderRadius: '1.75rem',
          border: '1px solid #cbd5e1',
          boxShadow: '0 12px 35px -5px rgba(0,0,0,0.05)',
          padding: '2.5rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: '2rem' }}>
          {/* Avatar */}
          <div
            style={{
              position: 'relative',
              width: 140,
              height: 140,
              borderRadius: '1.5rem',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
              border: '3px solid #99f6e4',
              flexShrink: 0,
              boxShadow: '0 8px 20px rgba(13,148,136,0.15)',
            }}
          >
            <Image
              src={supporter.photoUrl || '/avatars/default.svg'}
              alt={supporter.user.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {supporter.user.name}
                  </h1>
                  {supporter.verificationStatus === 'APPROVED' && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: '#f0fdf4',
                        color: '#15803d',
                        padding: '0.3rem 0.85rem',
                        borderRadius: '999px',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      <ShieldCheck size={15} color="#16a34a" /> Verified Aadhaar KYC
                    </span>
                  )}
                </div>
                <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '0.35rem 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} color="#0d9488" />
                  {supporter.city}, {supporter.district?.name || 'Kerala'}
                </p>
              </div>

              {/* Rating & Reliability Stats */}
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.65rem 1rem', borderRadius: '0.875rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: '#d97706', fontWeight: 800, fontSize: '1.2rem' }}>
                    <Star size={17} fill="#f59e0b" color="#f59e0b" /> {avgRating}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#854d0e', fontWeight: 600 }}>{supporter.reviews.length} reviews</div>
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.65rem 1rem', borderRadius: '0.875rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: '#15803d', fontSize: '1.2rem' }}>{supporter.reliabilityScore}%</div>
                  <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>Reliability Score</div>
                </div>
              </div>
            </div>

            {/* Languages & Preference */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ background: '#f1f5f9', color: '#334155', fontSize: '0.8rem', fontWeight: 600, padding: '0.3rem 0.75rem', borderRadius: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Languages size={14} color="#64748b" /> {languages.join(', ')}
              </span>
              <span style={{ background: '#f1f5f9', color: '#334155', fontSize: '0.8rem', fontWeight: 600, padding: '0.3rem 0.75rem', borderRadius: '0.5rem', textTransform: 'capitalize' }}>
                Gender: {(supporter.gender || 'Any').toLowerCase()}
              </span>
              <span style={{ background: '#ccfbf1', color: '#0f766e', fontSize: '0.8rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '0.5rem' }}>
                ₹399 / hour
              </span>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <Link
                href={`/app/member/book/${supporter.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.9rem 2rem',
                  background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  borderRadius: '0.875rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(13,148,136,0.35)',
                }}
                id="book-supporter-btn"
              >
                <HeartHandshake size={18} /> Book Session with {supporter.user.name.split(' ')[0]}
              </Link>
              <Link
                href="/app/member/messages"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.25rem',
                  background: 'white',
                  color: '#0f766e',
                  border: '1px solid #99f6e4',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  borderRadius: '0.875rem',
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={16} /> Send Message
              </Link>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div style={{ marginTop: '2rem', paddingTop: '1.75rem', borderTop: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            About Me
          </h2>
          <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: 1.7, margin: 0 }}>
            {supporter.shortBio || 'Warm, patient, and empathetic — I love connecting with people and making their day a little brighter.'}
          </p>
        </div>
      </div>

      {/* Grid: Offered Services & Weekly Availability */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Services Offered */}
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
            <CheckCircle2 size={20} color="#0d9488" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Services Offered ({supporter.services.length})
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {supporter.services.map(({ service }: any) => (
              <div
                key={service.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.875rem',
                  padding: '1rem 1.25rem',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{service.name}</div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0', lineHeight: 1.5 }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Availability Calendar */}
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
            <Calendar size={20} color="#0d9488" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Weekly Companion Availability
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => {
              const dayNum = idx + 1;
              const slot = supporter.availability.find((a: any) => a.dayOfWeek === dayNum);
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
                    {slot ? `${slot.startTime} - ${slot.endTime}` : 'Unavailable'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Verified Member Reviews */}
      <div
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          border: '1px solid #cbd5e1',
          padding: '2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <Star size={20} fill="#f59e0b" color="#f59e0b" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Member Reviews & Ratings ({supporter.reviews.length})
          </h2>
        </div>

        {supporter.reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
            No reviews yet. Be the first member to share your companion experience!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {supporter.reviews.map((rev: any) => (
              <div
                key={rev.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    {rev.member?.name || 'Verified Member'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d97706', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {rev.rating} / 5
                  </div>
                </div>
                <p style={{ color: '#334155', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
