import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getRegionConfig } from '@/lib/config';
import BookingForm from './BookingForm';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BookSupporterPage({
  params,
}: {
  params: Promise<{ supporterId: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'MEMBER') {
    redirect('/login');
  }

  const { supporterId } = await params;

  const supporter = await prisma.supporterProfile.findUnique({
    where: { id: supporterId },
    include: {
      user: true,
      district: true,
      services: {
        include: {
          service: true,
        },
      },
    },
  });

  if (!supporter) {
    notFound();
  }

  const regionConfig = await getRegionConfig('KL');

  const supporterData = {
    id: supporter.id,
    photoUrl: supporter.photoUrl,
    name: supporter.user.name,
    city: supporter.city || 'Kochi',
    districtName: supporter.district?.name || 'Kerala',
    services: supporter.services.map((s) => ({
      id: s.service.id,
      name: s.service.name,
      description: s.service.description,
      allowedModes: s.service.allowedModes,
    })),
    hourlyRate: regionConfig.hourlyBookingFee,
    commissionPercent: regionConfig.platformCommissionPercent,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <Link
        href={`/app/member/supporter/${supporter.id}`}
        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Supporter Profile
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Book Companionship Session</h1>
        <p className="text-sm text-slate-500 mt-1">Select date, time, and service details to confirm your booking.</p>
      </div>

      <BookingForm supporter={supporterData} />
    </div>
  );
}
