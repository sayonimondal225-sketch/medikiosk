import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Page, Steps } from '../components/ui';
import { useMediStore } from '../store/useMediStore';

export default function PatientConsent() {
  const { draft, setDraftConsent, audit } = useMediStore();
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const next = () => {
    if (!draft.personal.name) { nav('/patient/register'); return; }
    if (!draft.consent) { setErr('Please accept the consent to continue — it authorizes digitization and doctor review of your case.'); return; }
    audit('CONSENT_RECORDED', `Consent accepted by ${draft.personal.name}`);
    nav('/patient/history');
  };

  return (
    <Page narrow>
      <Steps steps={['Register', 'Consent', 'History', 'Ayurveda', 'Documents', 'Done']} current={1} />
      <h1 className="font-display mt-5 text-3xl font-bold text-slate-900 dark:text-white">Consent & Privacy</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Step 2 of 6 — informed consent for {draft.personal.name || 'the patient'}.</p>
      <div className="glass mt-6 rounded-2xl p-6">
        <div className="flex items-start gap-3 rounded-xl border border-teal-500/25 bg-teal-500/[0.07] p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-300" />
          <p>I consent to MediKiosk digitizing my registration, case history, Ayurveda information and uploaded reports for treatment by the care team. I understand my data is role-restricted, audit-logged, and that AI outputs are assistive drafts reviewed by a doctor. I can request correction or deletion per hospital policy.</p>
        </div>
        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm dark:border-white/10">
          <input type="checkbox" checked={draft.consent} onChange={(e) => setDraftConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-teal-600" />
          <span className="text-slate-700 dark:text-slate-300">I have read and accept the consent above, including sensitive medical data processing and audit logging.</span>
        </label>
        {err && <p className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{err}</p>}
        <div className="mt-5 flex gap-3">
          <Link to="/patient/register" className="glass inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200"><ArrowLeft size={15} /> Back</Link>
          <button onClick={next} className="btn-sheen inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg">Accept & Continue <ArrowRight size={15} /></button>
        </div>
      </div>
    </Page>
  );
}
