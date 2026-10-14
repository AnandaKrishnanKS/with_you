import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquare,
  ShieldCheck,
  Calendar,
  Clock,
  Video,
  Send,
  User,
  Heart,
  PhoneCall,
  CheckCheck,
} from 'lucide-react';

export default async function MemberMessagesPage() {
  const session = await getSession();
  if (!session || session.role !== 'MEMBER') {
    redirect('/login');
  }

  const memberProfile = await prisma.memberProfile.findUnique({
    where: { userId: session.id },
  });

  if (!memberProfile) redirect('/login');

  const bookings = await prisma.booking.findMany({
    where: { memberId: memberProfile.id },
    include: {
      supporter: {
        include: { user: true },
      },
      service: true,
      conversation: {
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
    orderBy: { scheduledAt: 'desc' },
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem 4rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Messages & Video Rooms
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem' }}>
          Communicate with your Supporters before sessions or join your HD video call room.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px solid #cbd5e1',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ccfbf1', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <MessageSquare size={28} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>No Active Conversations Yet</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: 460, margin: '0 auto 1.5rem' }}>
            Once you book a Supporter for an outing or video session, your private chat room will appear here.
          </p>
          <Link
            href="/app/member/explore"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.875rem',
              background: '#0d9488',
              color: 'white',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Explore Verified Supporters
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Conversation List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {bookings.map((b) => {
              const msgs = b.conversation?.messages || [];
              const lastMsg = msgs[msgs.length - 1];

              return (
                <div
                  key={b.id}
                  style={{
                    background: 'white',
                    borderRadius: '1.25rem',
                    border: '1px solid #cbd5e1',
                    padding: '1.5rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ position: 'relative', width: 48, height: 48, borderRadius: '0.875rem', overflow: 'hidden', background: '#ccfbf1', flexShrink: 0 }}>
                        <Image
                          src={b.supporter.photoUrl || '/avatars/default.svg'}
                          alt={b.supporter.user.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          {b.supporter.user.name}
                          <ShieldCheck size={16} color="#16a34a" />
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 600, marginTop: '0.1rem' }}>
                          {b.service.name}
                        </div>
                      </div>
                    </div>

                    <span style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px', textTransform: 'uppercase' }}>
                      {b.status}
                    </span>
                  </div>

                  {/* Chat Preview / Sample Messages */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.875rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                      💬 <em>{lastMsg ? lastMsg.text : `Hi ${b.supporter.user.name.split(' ')[0]}, looking forward to our session!`}</em>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {b.mode === 'VIDEO_CALL' && (
                      <Link
                        href={`/app/member/messages`}
                        style={{
                          flex: 1,
                          padding: '0.65rem 1rem',
                          borderRadius: '0.75rem',
                          background: '#059669',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <Video size={16} /> Open HD Video Room
                      </Link>
                    )}

                    <Link
                      href={`/app/member/supporter/${b.supporterId}`}
                      style={{
                        padding: '0.65rem 1rem',
                        borderRadius: '0.75rem',
                        background: 'white',
                        color: '#0f766e',
                        border: '1px solid #99f6e4',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        textAlign: 'center',
                      }}
                    >
                      View Companion Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
