import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import ReviewForm from './ReviewForm';
import { ArrowLeft } from 'lucide-react';

export default async function MemberReviewPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'MEMBER') {
    redirect('/login');
  }

  const { bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      supporter: {
        include: { user: true },
      },
      service: true,
      review: true,
    },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <Link
        href="/app/member/bookings"
        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Bookings
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="text-center space-y-2">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-teal-50 border-2 border-teal-100 shadow-sm">
            <Image
              src={booking.supporter.photoUrl || '/avatars/default.svg'}
              alt={booking.supporter.user.name}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-xl font-bold text-slate-900">How was your session with {booking.supporter.user.name}?</h1>
          <p className="text-xs text-slate-500">{booking.service.name} • {new Date(booking.scheduledAt).toLocaleDateString()}</p>
        </div>

        <ReviewForm bookingId={booking.id} existingReview={booking.review} />
      </div>
    </div>
  );
}
