import { ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">DPDP Compliance</span>
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="text-sm text-slate-500">Digital Personal Data Protection (DPDP) Act Compliant</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 space-y-6 text-slate-700 text-sm leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-600" /> Data Collection & Identity Privacy
          </h2>
          <p>
            We collect personal information necessary for safe platform operations: name, phone number, email, location district, emergency contact details, and government identity verification numbers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">Aadhaar Data Protection</h2>
          <p>
            Full Aadhaar numbers are never stored on our servers. Identity verification is processed in real time by licensed authentication partners. Only the last 4 digits and verification status flags are stored in our encrypted database.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">Data Deletion Rights</h2>
          <p>
            Members and Supporters can request complete account and data erasure anytime by contacting privacy@withyou.test.
          </p>
        </section>
      </div>
    </div>
  );
}
