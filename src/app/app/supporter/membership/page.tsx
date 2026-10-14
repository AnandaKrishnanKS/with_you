import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getRegionConfig } from '@/lib/config';
import { Award, CheckCircle, ShieldCheck, HeartHandshake } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupporterMembershipPage() {
  const session = await getSession();
  if (!session || session.role !== 'SUPPORTER') {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      supporterProfile: true,
      memberships: true,
    },
  });

  if (!user || !user.supporterProfile) redirect('/login');

  const config = await getRegionConfig('KL');
  const membership = user.memberships[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Supporter Annual Pass</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your platform verification and supporter annual pass subscription.</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-teal-900 text-white rounded-2xl p-8 shadow-md relative overflow-hidden space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-300">Verified Supporter Subscription</div>
            <h2 className="text-2xl font-bold mt-1">WITH YOU Partner Pass</h2>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300 pt-4 border-t border-slate-700/60">
          <div>
            <div className="text-slate-400">Annual Fee</div>
            <div className="text-lg font-bold text-white mt-0.5">₹{config.supporterYearlyFee} / year</div>
          </div>
          <div>
            <div className="text-slate-400">Platform Share</div>
            <div className="text-lg font-bold text-white mt-0.5">{config.supporterSharePercent}% Earnings Retained</div>
          </div>
          <div>
            <div className="text-slate-400">Valid Until</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {membership ? new Date(membership.validUntil).toLocaleDateString() : 'Active'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
