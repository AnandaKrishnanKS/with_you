import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BadgeCheck, Star, MapPin, Languages, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface SearchParams {
  service?: string;
  mode?: string;
  district?: string;
  lang?: string;
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await getSession();
  if (!session || session.role !== 'MEMBER') redirect('/login');

  const params = await searchParams;

  const [services, districts, supporters] = await Promise.all([
    prisma.service.findMany({ where: { active: true } }),
    prisma.district.findMany({ orderBy: { name: 'asc' } }),
    prisma.supporterProfile.findMany({
      where: {
        verificationStatus: 'APPROVED',
        membershipStatus: 'ACTIVE',
        ...(params.service ? { services: { some: { service: { key: params.service } } } } : {}),
        ...(params.district ? { districtId: params.district } : {}),
      },
      include: {
        user: { select: { name: true } },
        district: true,
        services: { include: { service: true } },
        reviews: { select: { rating: true } },
      },
      take: 20,
    }),
  ]);

  function getAvgRating(reviews: { rating: number }[]) {
    if (!reviews.length) return null;
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  }

  function getLanguages(langJson: string): string[] {
    try { return JSON.parse(langJson); } catch { return []; }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Find a Supporter</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Browse verified Supporters across Kerala
        </p>
      </div>

      {/* Filters */}
      <form
        method="GET"
        style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '1.75rem',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          padding: '1rem 1.25rem',
        }}
      >
        <select
          name="service"
          defaultValue={params.service || ''}
          className="input"
          style={{ flex: '1 1 180px', width: 'auto' }}
          id="filter-service"
        >
          <option value="">All Services</option>
          {services.map((s) => (
            <option key={s.id} value={s.key}>{s.name}</option>
          ))}
        </select>

        <select
          name="district"
          defaultValue={params.district || ''}
          className="input"
          style={{ flex: '1 1 180px', width: 'auto' }}
          id="filter-district"
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          name="mode"
          defaultValue={params.mode || ''}
          className="input"
          style={{ flex: '1 1 150px', width: 'auto' }}
          id="filter-mode"
        >
          <option value="">All Modes</option>
          <option value="IN_PERSON">In Person</option>
          <option value="VIDEO_CALL">Video Call</option>
        </select>

        <button type="submit" className="btn btn-primary" id="apply-filters">
          Filter
        </button>
        {(params.service || params.district || params.mode) && (
          <Link href="/app/member/explore" className="btn btn-ghost">Clear</Link>
        )}
      </form>

      {/* Results */}
      <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        {supporters.length} supporter{supporters.length !== 1 ? 's' : ''} found
      </div>

      {supporters.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem' }}>No Supporters match your filters.</p>
          <Link href="/app/member/explore" className="btn btn-outline" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Reset Filters
          </Link>
        </div>
      ) : (
        <div className="grid-3">
          {supporters.map((sp) => {
            const avg = getAvgRating(sp.reviews);
            const langs = getLanguages(sp.languages);
            const firstName = sp.user.name.split(' ')[0];

            return (
              <Link
                key={sp.id}
                href={`/app/member/supporter/${sp.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                id={`supporter-card-${sp.id}`}
              >
                <div className="supporter-card">
                  {/* Photo / Avatar */}
                  <div className="supporter-card-photo">
                    <span style={{ fontSize: '4rem' }}>
                      {sp.gender === 'FEMALE' ? '👩' : '👨'}
                    </span>
                  </div>
                  <div className="supporter-card-body">
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{firstName}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                          <span className="verified-badge">
                            <BadgeCheck size={10} /> Verified
                          </span>
                        </div>
                      </div>
                      {avg && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: 600, color: '#92400e' }}>
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          {avg}
                          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.78rem' }}>
                            ({sp.reviews.length})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* District */}
                    {sp.district && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <MapPin size={12} /> {sp.city || sp.district.name}
                      </div>
                    )}

                    {/* Bio */}
                    {sp.shortBio && (
                      <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {sp.shortBio}
                      </p>
                    )}

                    {/* Services */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                      {sp.services.slice(0, 3).map((ss) => (
                        <span key={ss.serviceId} className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                          {ss.service.name.split(' ')[0]}
                        </span>
                      ))}
                      {sp.services.length > 3 && (
                        <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>+{sp.services.length - 3}</span>
                      )}
                    </div>

                    {/* Languages */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <Languages size={12} />
                      {langs.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
