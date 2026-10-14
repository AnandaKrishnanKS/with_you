import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe, MapPin, Save, Settings, CheckCircle2, ShieldCheck } from 'lucide-react';
import RegionConfigForm from './RegionConfigForm';

export const dynamic = 'force-dynamic';

export default async function AdminRegionsPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') redirect('/login');

  let region = await prisma.region.findFirst({
    where: { code: 'KL' },
    include: {
      configs: {
        orderBy: { updatedAt: 'desc' },
      },
      districts: {
        include: {
          _count: {
            select: {
              memberProfiles: true,
              supporterProfiles: true,
            },
          },
        },
      },
    },
  });

  const activeRegion = region || await prisma.region.create({
    data: {
      code: 'KL',
      name: 'Kerala',
      country: 'IN',
      active: true,
      configs: {
        create: {
          memberYearlyFee: 199,
          supporterYearlyFee: 499,
          hourlyBookingFee: 399,
          platformCommissionPercent: 20,
          currency: 'INR',
          taxPercent: 18,
          cancelFullRefundHours: 24,
          cancelPartialRefundHours: 2,
          cancelPartialRefundPercent: 50,
        },
      },
    },
    include: {
      configs: true,
      districts: {
        include: {
          _count: {
            select: {
              memberProfiles: true,
              supporterProfiles: true,
            },
          },
        },
      },
    },
  });

  const config = activeRegion.configs[0] || {
    memberYearlyFee: 199,
    supporterYearlyFee: 499,
    hourlyBookingFee: 399,
    platformCommissionPercent: 20,
    taxPercent: 18,
    cancelFullRefundHours: 24,
    cancelPartialRefundHours: 2,
    cancelPartialRefundPercent: 50,
  };

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
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>Region & Pricing Config</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ccfbf1', color: '#0f766e', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>
            <Globe size={14} /> Kerala (KL, IN) — Active
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Config Form */}
          <div style={{ background: 'white', borderRadius: '1.25rem', padding: '2rem', border: '1px solid #cbd5e1', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Settings size={20} color="#0d9488" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Fee & Rate Parameters</h2>
            </div>

            <RegionConfigForm
              regionId={activeRegion.id}
              initialConfig={{
                memberYearlyFee: config.memberYearlyFee,
                supporterYearlyFee: config.supporterYearlyFee,
                hourlyBookingFee: config.hourlyBookingFee,
                platformCommissionPercent: config.platformCommissionPercent,
              }}
            />
          </div>

          {/* Districts Overview */}
          <div style={{ background: 'white', borderRadius: '1.25rem', padding: '2rem', border: '1px solid #cbd5e1', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={20} color="#0d9488" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Kerala Districts ({activeRegion.districts.length})
                </h2>
              </div>
              <span style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                All 14 Operational
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: 420, overflowY: 'auto' }}>
              {activeRegion.districts.map((d) => (
                <div
                  key={d.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{d.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>State: {d.state}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#334155' }}>
                    <div><strong>{d._count.memberProfiles}</strong> Members</div>
                    <div><strong>{d._count.supporterProfiles}</strong> Supporters</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
