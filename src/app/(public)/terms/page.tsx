import { ShieldCheck, HeartHandshake } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Legal Agreement</span>
        <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="text-sm text-slate-500">Effective Date: October 2026 • Region: Kerala, India</p>
      </div>

      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-900 space-y-2">
        <h2 className="font-bold text-base flex items-center gap-2 text-rose-800">
          <ShieldCheck className="w-5 h-5" /> Strict 100% Platonic Service Policy
        </h2>
        <p className="text-sm leading-relaxed">
          WITH YOU is strictly a platform for <strong>platonic companionship, emotional support, and practical assistance</strong>. Any sexual, romantic, or escort-style solicitation is explicitly prohibited. Zero tolerance is enforced; violators will be permanently banned and reported to law enforcement.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 space-y-6 text-slate-700 text-sm leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Overview of Platform</h2>
          <p>
            WITH YOU connects registered Members who seek companionship or non-medical practical assistance with verified Supporters. Supporters act as independent micro-entrepreneurs. WITH YOU acts strictly as a technology marketplace facilitator.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Member & Supporter Responsibilities</h2>
          <p>
            All users must be at least 18 years of age. Supporters undergo identity verification via Aadhaar and liveness photo checks. Members agree to respect personal boundaries and conduct all first-time in-person interactions in public locations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Escrow Payments & Fees</h2>
          <p>
            All booking fees are paid securely through escrow and released to supporters upon successful session completion. Platform fees are strictly non-negotiable.
          </p>
        </section>
      </div>
    </div>
  );
}
