'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck, Calendar, Clock, MapPin, CheckCircle2, ArrowRight, Loader2, Info } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  allowedModes: string;
}

interface SupporterData {
  id: string;
  photoUrl: string | null;
  name: string;
  city: string;
  districtName: string;
  services: Service[];
  hourlyRate: number;
  commissionPercent: number;
}

export default function BookingForm({ supporter }: { supporter: SupporterData }) {
  const router = useRouter();

  const [selectedServiceId, setSelectedServiceId] = useState(supporter.services[0]?.id || '');
  const [mode, setMode] = useState<'IN_PERSON' | 'VIDEO_CALL'>('IN_PERSON');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [durationHours, setDurationHours] = useState(2);
  const [meetingLocation, setMeetingLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hourlyRate = supporter.hourlyRate;
  const subtotal = hourlyRate * durationHours;
  const gst = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gst;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();

      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supporterId: supporter.id,
          serviceId: selectedServiceId,
          mode,
          scheduledAt,
          durationHours,
          meetingLocation: mode === 'IN_PERSON' ? meetingLocation : 'Online Video Call',
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create booking.');
      }

      router.push('/app/member/bookings?success=true');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Booking Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Supporter Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-teal-50 border border-teal-100 shrink-0">
            <Image
              src={supporter.photoUrl || '/avatars/default.svg'}
              alt={supporter.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Booking Session With</div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {supporter.name}
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </h2>
            <p className="text-xs text-slate-500">{supporter.city}, {supporter.districtName}</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-sm p-4 rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        {/* 1. Select Service */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" /> 1. Select Service
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {supporter.services.map((s) => (
              <label
                key={s.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedServiceId === s.id
                    ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    checked={selectedServiceId === s.id}
                    onChange={() => setSelectedServiceId(s.id)}
                    className="mt-1 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{s.description}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 2. Session Mode */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" /> 2. Interaction Mode
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('IN_PERSON')}
              className={`p-4 rounded-xl border text-left transition-all ${
                mode === 'IN_PERSON'
                  ? 'border-teal-600 bg-teal-50/50 font-semibold text-teal-900'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-bold">In Person</div>
              <div className="text-xs text-slate-500 mt-1">Meet at café, public venue, or event</div>
            </button>
            <button
              type="button"
              onClick={() => setMode('VIDEO_CALL')}
              className={`p-4 rounded-xl border text-left transition-all ${
                mode === 'VIDEO_CALL'
                  ? 'border-teal-600 bg-teal-50/50 font-semibold text-teal-900'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-bold">Video Call</div>
              <div className="text-xs text-slate-500 mt-1">Virtual online video companion session</div>
            </button>
          </div>
        </div>

        {/* 3. Date, Time & Duration */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" /> 3. Date & Duration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={scheduledDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Hours)</label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
                <option value={3}>3 hours</option>
                <option value={4}>4 hours</option>
                <option value={6}>6 hours</option>
              </select>
            </div>
          </div>

          {mode === 'IN_PERSON' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> Meeting Location / Public Venue
              </label>
              <input
                type="text"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                placeholder="e.g. Lulu Mall Cafe, Kakkanad, Kochi"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">For safety, all first-time in-person sessions must occur in public places.</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Special Notes / Context for Supporter</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any context, goals, or topics for your companionship session..."
              rows={2}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Price Breakdown & Payment */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm sticky top-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Price Breakdown
          </h3>

          <div className="space-y-2.5 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Hourly Rate</span>
              <span>₹{hourlyRate}/hr</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span>{durationHours} {durationHours === 1 ? 'hour' : 'hours'}</span>
            </div>
            <div className="flex justify-between font-medium text-slate-800 pt-2 border-t border-slate-100">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>GST (18%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="text-teal-700">₹{totalAmount}</span>
            </div>
          </div>

          <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-teal-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>
              <strong>100% Platonic Guarantee:</strong> Funds held in escrow until session completion. Full refund up to 24h before session.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Confirming Booking...
              </>
            ) : (
              <>
                Confirm & Pay ₹{totalAmount} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            By booking, you agree to WITH YOU Platonic Guidelines & Terms of Service.
          </p>
        </div>
      </div>
    </form>
  );
}
