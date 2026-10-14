'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2, AlertCircle, Loader2, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { updateRegionConfigAction } from './actions';

interface RegionConfigFormProps {
  regionId: string;
  initialConfig: {
    memberYearlyFee: number;
    supporterYearlyFee: number;
    hourlyBookingFee: number;
    platformCommissionPercent: number;
  };
}

export default function RegionConfigForm({ regionId, initialConfig }: RegionConfigFormProps) {
  const router = useRouter();

  const [memberYearlyFee, setMemberYearlyFee] = useState(initialConfig.memberYearlyFee);
  const [supporterYearlyFee, setSupporterYearlyFee] = useState(initialConfig.supporterYearlyFee);
  const [hourlyBookingFee, setHourlyBookingFee] = useState(initialConfig.hourlyBookingFee);
  const [platformCommissionPercent, setPlatformCommissionPercent] = useState(
    initialConfig.platformCommissionPercent
  );

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live dynamic calculations
  const safeCommission = isNaN(platformCommissionPercent) ? 0 : platformCommissionPercent;
  const safeHourly = isNaN(hourlyBookingFee) ? 0 : hourlyBookingFee;
  const supporterSharePercent = Math.max(0, parseFloat((100 - safeCommission).toFixed(2)));
  const supporterEarnings = parseFloat(((safeHourly * supporterSharePercent) / 100).toFixed(2));
  const platformFee = parseFloat(((safeHourly * safeCommission) / 100).toFixed(2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await updateRegionConfigAction({
        regionId,
        memberYearlyFee: Number(memberYearlyFee),
        supporterYearlyFee: Number(supporterYearlyFee),
        hourlyBookingFee: Number(hourlyBookingFee),
        platformCommissionPercent: Number(platformCommissionPercent),
      });

      if (res.success && res.data) {
        setSuccessMessage(
          `Configuration saved! Platform commission is now ${res.data.platformCommissionPercent}% (Supporters receive ${res.data.supporterSharePercent}% · ₹${res.data.supporterHourlyEarnings.toFixed(2)}/hr). All pages have been updated.`
        );
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Failed to update configuration.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {successMessage && (
        <div
          style={{
            marginBottom: '1.25rem',
            padding: '1rem',
            borderRadius: '0.75rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
          }}
        >
          <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
          <div>
            <strong>Saved & Synchronized!</strong>
            <p style={{ margin: '0.25rem 0 0', lineHeight: 1.4 }}>{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            marginBottom: '1.25rem',
            padding: '1rem',
            borderRadius: '0.75rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}
        >
          <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Member Yearly Fee */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '0.4rem',
          }}
        >
          Member Yearly Pass Fee (₹)
        </label>
        <input
          type="number"
          name="memberYearlyFee"
          value={memberYearlyFee}
          onChange={(e) => setMemberYearlyFee(parseFloat(e.target.value) || 0)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid #cbd5e1',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          required
        />
      </div>

      {/* Supporter Yearly Fee */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '0.4rem',
          }}
        >
          Supporter Partner Yearly Pass Fee (₹)
        </label>
        <input
          type="number"
          name="supporterYearlyFee"
          value={supporterYearlyFee}
          onChange={(e) => setSupporterYearlyFee(parseFloat(e.target.value) || 0)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid #cbd5e1',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          required
        />
      </div>

      {/* Hourly Booking Fee */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '0.4rem',
          }}
        >
          Hourly Session Fee (₹/hr)
        </label>
        <input
          type="number"
          name="hourlyBookingFee"
          value={hourlyBookingFee}
          onChange={(e) => setHourlyBookingFee(parseFloat(e.target.value) || 0)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid #cbd5e1',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          required
        />
      </div>

      {/* Platform Commission Percent */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '0.4rem',
          }}
        >
          Platform Commission (%)
        </label>
        <input
          type="number"
          step="0.1"
          name="platformCommissionPercent"
          value={platformCommissionPercent}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setPlatformCommissionPercent(isNaN(val) ? 0 : val);
          }}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid #cbd5e1',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          required
        />
      </div>

      {/* Live Split Calculation Card */}
      <div
        style={{
          marginBottom: '1.75rem',
          padding: '1.25rem',
          borderRadius: '0.875rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0d9488',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <Sparkles size={14} /> Live Earnings Split Preview
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '0.75rem',
              borderRadius: '0.625rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534' }}>
              Supporter ({supporterSharePercent}%)
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d', marginTop: '0.2rem' }}>
              ₹{supporterEarnings.toFixed(2)}/hr
            </div>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              padding: '0.75rem',
              borderRadius: '0.625rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
              Platform ({safeCommission}%)
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#334155', marginTop: '0.2rem' }}>
              ₹{platformFee.toFixed(2)}/hr
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.875rem',
          borderRadius: '0.75rem',
          background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
          color: 'white',
          fontWeight: 600,
          fontSize: '0.95rem',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Saving Changes...
          </>
        ) : (
          <>
            <Save size={16} /> Save Pricing Config
          </>
        )}
      </button>
    </form>
  );
}
