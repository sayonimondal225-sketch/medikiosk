import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-violet-600 text-white"><Activity size={18} /></span>
            <span className="font-display text-lg font-bold text-slate-900 dark:text-white">MediKiosk</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            AI-assisted patient case-taking & clinical record management — digitizing registration,
            modern + Ayurveda case sheets, OCR documents, and doctor-reviewed AI summaries.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <ShieldCheck size={12} /> SIH demo build — assistive AI only, doctor approves all care
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Patient</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link className="text-slate-600 hover:text-teal-600 dark:text-slate-400" to="/patient/register">Register as Patient</Link>
            <Link className="text-slate-600 hover:text-teal-600 dark:text-slate-400" to="/patient/consent">Consent</Link>
            <Link className="text-slate-600 hover:text-teal-600 dark:text-slate-400" to="/patient/documents">Upload Reports</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Staff</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link className="text-slate-600 hover:text-teal-600 dark:text-slate-400" to="/login">Staff Login</Link>
            <Link className="text-slate-600 hover:text-teal-600 dark:text-slate-400" to="/reception">Reception Queue</Link>
            <Link className="text-slate-600 hover:text-teal-600 dark:text-slate-400" to="/doctor/dashboard">Doctor Dashboard</Link>
            <Link className="text-slate-600 hover:text-teal-600 dark:text-slate-400" to="/admin">Admin & Audit</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200/60 py-4 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-500">
        <span className="inline-flex items-center gap-1.5"><HeartPulse size={12} className="text-rose-500" /> MediKiosk • Patient → Encounter → History • Built for SIH demonstration</span>
      </div>
    </footer>
  );
}
