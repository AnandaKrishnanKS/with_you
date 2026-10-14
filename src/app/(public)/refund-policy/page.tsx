import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Fair Escrow</span>
        <h1 className="text-3xl font-extrabold text-slate-900">Cancellation & Refund Policy</h1>
        <p className="text-sm text-slate-500">Transparent cancellation rules for Members & Supporters</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 space-y-6 text-slate-700 text-sm leading-relaxed shadow-sm">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 space-y-1">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-teal-600" /> &gt; 24 Hours Before Session
            </h3>
            <p className="text-xs text-slate-600">100% full refund with zero cancellation charges.</p>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
              <RefreshCw className="w-5 h-5 text-amber-600" /> 2 to 24 Hours Before Session
            </h3>
            <p className="text-xs text-slate-600">50% refund (50% retained to compensate supporter's reserved time).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
