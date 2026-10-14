import { HeartHandshake, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Community Safety</span>
        <h1 className="text-3xl font-extrabold text-slate-900">Platonic & Safety Guidelines</h1>
        <p className="text-sm text-slate-500">Creating a safe, respectful environment for everyone in Kerala</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Do's */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> What Is Encouraged (Do's)
          </h2>
          <ul className="space-y-2.5 text-xs font-medium text-emerald-800">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">•</span> Friendly, active listening and empathetic conversation.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">•</span> Accompanying members to public cafes, parks, shopping, or weddings.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">•</span> Assisting seniors with hospital appointments and gentle walks.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">•</span> Punctuality, clear communication, and mutual respect.
            </li>
          </ul>
        </div>

        {/* Dont's */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-rose-900 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-600" /> Prohibited Behaviors (Don'ts)
          </h2>
          <ul className="space-y-2.5 text-xs font-medium text-rose-800">
            <li className="flex items-start gap-2">
              <span className="text-rose-600">•</span> Any romantic flirtation, physical intimacy, or sexual requests.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600">•</span> Asking for cash outside the platform escrow system.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600">•</span> First-time meetings in private non-public spaces.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600">•</span> Providing medical or professional psychological therapy (non-clinical platform).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
