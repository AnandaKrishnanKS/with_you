'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AcceptDeclineButtons({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState<'accept' | 'decline' | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [showDecline, setShowDecline] = useState(false);
  const router = useRouter();

  async function handleAction(action: 'ACCEPTED' | 'DECLINED') {
    setLoading(action === 'ACCEPTED' ? 'accept' : 'decline');
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action, reason: declineReason }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      {showDecline && (
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            className="input"
            placeholder="Reason for declining (optional but helpful)…"
            rows={2}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={() => handleAction('ACCEPTED')}
          disabled={loading !== null}
          id={`accept-${bookingId}`}
        >
          {loading === 'accept' ? <span className="spinner" /> : <CheckCircle size={16} />}
          Accept Request
        </button>
        {!showDecline ? (
          <button
            className="btn btn-outline"
            style={{ flex: 1, borderColor: '#fca5a5', color: '#dc2626' }}
            onClick={() => setShowDecline(true)}
            id={`decline-show-${bookingId}`}
          >
            <XCircle size={16} />
            Decline
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
            <button
              className="btn btn-danger"
              style={{ flex: 1 }}
              onClick={() => handleAction('DECLINED')}
              disabled={loading !== null}
              id={`decline-confirm-${bookingId}`}
            >
              {loading === 'decline' ? <span className="spinner" /> : 'Confirm Decline'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowDecline(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
