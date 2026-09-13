import { Link } from 'react-router-dom';
import { ArrowRight, MonitorSmartphone, FileScan, BrainCircuit, UserCheck, ShieldCheck } from 'lucide-react';
import { Page, Reveal } from '../components/ui';

const phases = [
  { icon: MonitorSmartphone, t: '1 · Kiosk registration & consent', d: 'Patient enters demographics at /patient/register, reviews consent at /patient/consent. Validation + audit from the first keystroke.' },
  { icon: BrainCircuit, t: '2 · Modern + Ayurveda case-taking', d: 'Chief complaint → HPI → PMH → ROS with voice-to-text on every long field; then Prakriti → Dashavidha in a structured Ayurveda sheet.' },
  { icon: FileScan, t: '3 · Documents + OCR pipeline', d: 'Upload → Validate → OCR → Extracted text → Clean/Structure → AI summary → Doctor review. Every OCR block is labelled machine-generated.' },
  { icon: UserCheck, t: '4 · Reception check-in queue', d: 'Reception searches the Registration ID, verifies limited info only, and moves WAITING → CHECKED_IN. No clinical editing allowed.' },
  { icon: ShieldCheck, t: '5 · Doctor review & approval', d: 'Doctor opens the encounter, reads longitudinal history, generates the AI overview, edits, marks Reviewed → Approved, and completes the visit.' },
];

export default function HowItWorks() {
  return (
    <Page>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Workflow</p>
      <h1 className="font-display mt-2 max-w-2xl text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">How MediKiosk works — kiosk to clinic</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">Data model: <span className="font-mono2 rounded bg-slate-900 px-2 py-0.5 text-xs text-teal-300 dark:bg-white/10">PATIENT → ENCOUNTER → HISTORY / AYURVEDA / DOCUMENTS / SUMMARY</span>. Every revisit reuses the same Patient ID.</p>
      <div className="mt-8 grid gap-5">
        {phases.map((p, i) => (
          <Reveal key={p.t} delay={i * 0.05}>
            <div className="glass card-lift flex gap-4 rounded-2xl p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-violet-500 text-white shadow-lg"><p.icon size={22} /></span>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{p.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/patient/register" className="btn-sheen inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-5 py-3 text-sm font-bold text-white">Try the patient flow <ArrowRight size={15} /></Link>
        <Link to="/login" className="glass rounded-xl px-5 py-3 text-sm font-bold text-slate-800 dark:text-white">Staff demo logins</Link>
      </div>
    </Page>
  );
}
