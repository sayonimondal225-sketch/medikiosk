import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Copy, Check, Info, ArrowRight } from 'lucide-react';
import { Page, Steps } from '../components/ui';
import { useMediStore } from '../store/useMediStore';

export default function PatientSubmitted() {
  const { encounters } = useMediStore();
  const [ids, setIds] = useState<{ patientId: string; regId: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('medikiosk-last-ids');
      if (raw) { setIds(JSON.parse(raw)); return; }
    } catch { /* noop */ }
    const latest = encounters[0];
    if (latest) setIds({ patientId: latest.patientId, regId: latest.regId });
    else setIds({ patientId: 'PAT-00084721', regId: 'REG-2026-0911-0042' });
  }, [encounters]);

  const copy = async (label: string, val: string) => {
    try { await navigator.clipboard.writeText(val); } catch { /* noop */ }
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Page narrow>
      <Steps steps={['Register', 'Consent', 'History', 'Ayurveda', 'Documents', 'Done']} current={5} />
      <div className="glass mt-6 rounded-3xl p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-xl shadow-emerald-500/30">
          <CheckCircle2 size={32} />
        </span>
        <h1 className="font-display mt-4 text-3xl font-bold text-slate-900 dark:text-white">Case submitted successfully</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">Your case is now in the reception queue for <strong>11 September 2026</strong>. Please share the Registration ID at the desk for check-in.</p>

        <div className="mx-auto mt-6 grid max-w-md gap-3">
          {[
            { label: 'Patient ID', val: ids?.patientId || '—', sub: 'Permanent — same across all visits' },
            { label: 'Registration ID', val: ids?.regId || '—', sub: 'Current visit / encounter only' },
          ].map((r) => (
            <div key={r.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{r.label}</p>
              <p className="font-mono2 mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{r.val}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{r.sub}</p>
              <button onClick={() => copy(r.label, r.val)} className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-teal-500 hover:text-teal-700 dark:border-white/10 dark:text-slate-300">
                {copied === r.label ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />} {copied === r.label ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-5 flex max-w-md gap-2.5 rounded-2xl border border-sky-300 bg-sky-50 p-4 text-left text-[13px] leading-relaxed text-sky-900 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200">
          <Info size={17} className="mt-0.5 shrink-0" />
          <p><strong>Important:</strong> the Registration ID identifies this visit/encounter — it is <u>not</u> an authentication credential and alone never grants access to your full medical record. Records open only for authorized staff roles.</p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/patient/register" className="glass rounded-xl px-5 py-3 text-sm font-bold text-slate-800 dark:text-white">Register another patient</Link>
          <Link to="/" className="btn-sheen inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-5 py-3 text-sm font-bold text-white">Back to Home <ArrowRight size={15} /></Link>
        </div>
      </div>
    </Page>
  );
}
