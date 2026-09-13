import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, UserPlus, Stethoscope, Brain, Leaf, FileScan, ClipboardCheck, History, Sparkles, ShieldCheck, Users, ChevronRight } from 'lucide-react';
import Brain3D from '../components/Brain3D';
import { Reveal } from '../components/ui';
import { useMediStore } from '../store/useMediStore';

const features = [
  { icon: UserPlus, title: 'Digital Patient Registration', text: 'Self-service kiosk registration with validated demographics, contact and emergency details — issuing Patient ID + visit Registration ID in seconds.' },
  { icon: Brain, title: 'AI-Assisted Case Taking', text: 'Structured chief complaint, HPI, PMH, medications, allergies, family & personal history with voice-to-text and review-ready summaries.' },
  { icon: Leaf, title: 'Ayurveda Case Taking', text: 'Prakriti, Vikriti, Sara, Samhanana, Agni, Koshta, Ahara-Vihara and Dashavidha Pariksha — configurable for qualified Vaidya review.' },
  { icon: FileScan, title: 'Medical Document Management', text: 'Upload PDF/JPG/PNG → validate → OCR → clean & structure → AI summary → doctor review. OCR output always labelled machine-generated.' },
  { icon: ClipboardCheck, title: 'Receptionist Check-in', text: 'Search by Registration ID, verify limited info, manage WAITING → CHECKED_IN → IN_CONSULTATION → COMPLETED queue.' },
  { icon: Stethoscope, title: 'Doctor Dashboard', text: '11 September 2026 patient list with Registration ID, name, Patient ID, visit date and live status. One click opens the full record.' },
  { icon: History, title: 'Longitudinal Patient History', text: 'PATIENT → ENCOUNTER → HISTORY timeline. Every revisit links to the same Patient ID — never a disconnected record.' },
  { icon: Sparkles, title: 'AI Clinical Summary', text: 'Assistive overview with AI Generated → Doctor Reviewed → Doctor Approved workflow. Never diagnoses or prescribes alone.' },
  { icon: ShieldCheck, title: 'Secure Role-Based Access', text: 'Patient, Receptionist, Doctor, Ayurvedic Doctor and Admin roles. Registration ID alone never unlocks a full record.' },
];

const demoSteps = [
  'Patient Registration', 'Medical + Ayurveda Case Taking', 'Upload Medical Report', 'Submit Case',
  'Generate Patient ID + Registration ID', 'Receptionist Login', 'Enter Registration ID', 'Check In Patient',
  'Patient Appears in Doctor Queue', 'Doctor Dashboard', 'Open Patient', 'View Complete Current Record',
  'View Previous History', 'View Uploaded Report', 'Generate AI Summary', 'Doctor Reviews / Edits',
  'Doctor Approves', 'Encounter Completed',
];

export default function Home() {
  const dark = useMediStore((s) => s.theme) === 'dark';
  return (
    <div>
      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-2 lg:pt-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
            <Sparkles size={13} /> SIH-ready • AI + 3D Healthcare Platform
          </p>
          <h1 className="font-display mt-5 text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
            <span className="text-slate-900 dark:text-white">Medi</span><span className="text-gradient">Kiosk</span>
          </h1>
          <p className="font-display mt-3 text-lg font-semibold text-slate-700 dark:text-slate-200 sm:text-xl">
            AI-Assisted Patient Case-Taking & Clinical Record Management System
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-slate-600 dark:text-slate-400">
            MediKiosk digitizes patient registration, structured case-taking, medical documents,
            Ayurveda assessment and doctor review — one connected journey from kiosk to clinic,
            with longitudinal history and doctor-approved AI summaries.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/patient/register" className="btn-sheen inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-teal-600/30 transition-transform hover:scale-[1.03]">
              <UserPlus size={17} /> Register as Patient <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="glass card-lift inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-white">
              <Stethoscope size={17} /> Staff Login
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold">
            {['Voice input', 'OCR + AI summary', 'Ayurveda ready', 'RBAC secured'].map((t) => (
              <span key={t} className="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{t}</span>
            ))}
          </div>
          <Link to="/how-it-works" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:gap-2 dark:text-teal-300">
            See the 18-step live demo flow <ChevronRight size={16} />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}
          className={`glass relative h-[380px] overflow-hidden rounded-3xl sm:h-[460px] ${dark ? 'glow-dark' : 'shadow-2xl shadow-teal-600/10'}`}>
          <Brain3D dark={dark} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 via-transparent to-transparent p-5 pt-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-200">Interactive 3D • drag to explore</p>
                <p className="font-display text-lg font-bold text-white">Neural case-intelligence core</p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-xl bg-white/10 px-3 py-1.5 font-mono2 text-[11px] text-cyan-100 backdrop-blur">PAT-00084721</span>
                <span className="rounded-xl bg-white/10 px-3 py-1.5 font-mono2 text-[11px] text-violet-100 backdrop-blur">AI summary ✓</span>
              </div>
            </div>
          </div>
          <div className="glass absolute left-4 top-4 rounded-2xl px-3.5 py-2.5 text-xs">
            <p className="font-bold text-slate-800 dark:text-white">Live queue • 11 Sept 2026</p>
            <p className="text-slate-500 dark:text-slate-400"><span className="font-bold text-amber-500">4</span> waiting • <span className="font-bold text-violet-500">1</span> in consultation</p>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Platform capabilities</p>
          <h2 className="font-display mt-2 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything from kiosk registration to doctor approval
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={Math.min(i * 0.05, 0.3)}>
              <div className="glass card-lift group h-full rounded-2xl p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-sky-600 text-white shadow-lg shadow-teal-500/25 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <f.icon size={20} />
                </span>
                <h3 className="font-display mt-4 text-[17px] font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DEMO FLOW STRIP */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <Reveal>
          <div className={`overflow-hidden rounded-3xl border ${dark ? 'border-white/10 bg-gradient-to-br from-teal-500/10 via-transparent to-violet-500/10' : 'border-slate-200 bg-white shadow-xl shadow-slate-200/60'}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-300"><Users size={13} /> Demo flow — 18 steps</p>
                <h3 className="font-display mt-2 text-2xl font-bold text-slate-900 dark:text-white">Run the full SIH demonstration in minutes</h3>
                <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">Use demo logins — reception / reception123 • doctor / doctor123 • admin / admin123. Patient kiosk needs no login.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/patient/register" className="btn-sheen rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg">Start at Step 1 →</Link>
                <Link to="/login" className="glass rounded-xl px-5 py-3 text-sm font-bold text-slate-800 dark:text-white">Staff logins</Link>
              </div>
            </div>
            <div className="grid gap-2 border-t border-slate-200/60 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3 dark:border-white/10">
              {demoSteps.map((s, i) => (
                <div key={s} className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/60 px-3.5 py-2.5 text-[13px] font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
                  <span className="font-mono2 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-violet-500 text-[11px] font-bold text-white">{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
