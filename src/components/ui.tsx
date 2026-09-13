import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { EncounterStatus, SummaryStatus } from '../lib/types';

export function Page({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`mx-auto w-full ${narrow ? 'max-w-3xl' : 'max-w-7xl'} px-4 py-8 sm:px-6`}
    >
      {children}
    </motion.main>
  );
}

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StatusBadge({ status }: { status: EncounterStatus | SummaryStatus | string }) {
  const map: Record<string, string> = {
    WAITING: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25',
    CHECKED_IN: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/25',
    IN_CONSULTATION: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/25',
    COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25',
    DRAFT: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10',
    AI_GENERATED: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/25',
    DOCTOR_REVIEWED: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/25',
    DOCTOR_APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25',
  };
  const label = String(status).replace(/_/g, ' ');
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${map[String(status)] || map.DRAFT}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {label}
    </span>
  );
}

export function Steps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i < current ? 'bg-emerald-500 text-white' : i === current ? 'bg-gradient-to-br from-teal-500 to-sky-600 text-white shadow' : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>
            {i + 1}
          </span>
          <span className={`text-xs font-semibold ${i === current ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{s}</span>
          {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-slate-300 dark:bg-white/15" />}
        </li>
      ))}
    </ol>
  );
}
