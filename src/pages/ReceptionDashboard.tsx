import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserCheck, Clock, CheckCircle2, Stethoscope, Lock } from 'lucide-react';
import { Page, StatusBadge } from '../components/ui';
import { inputCls } from '../components/fields';
import { useMediStore, statusLabel } from '../store/useMediStore';
import type { EncounterStatus } from '../lib/types';

const FLOW: EncounterStatus[] = ['WAITING', 'CHECKED_IN', 'IN_CONSULTATION', 'COMPLETED'];

export default function ReceptionDashboard() {
  const { encounters, patients, updateEncounter, user } = useMediStore();
  const [q, setQ] = useState('');
  const today = encounters.filter((e) => e.visitDate === '2026-09-11');
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return today;
    return today.filter((e) => e.regId.toLowerCase().includes(s) || e.patientName.toLowerCase().includes(s) || e.patientId.toLowerCase().includes(s));
  }, [q, today]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { WAITING: 0, CHECKED_IN: 0, IN_CONSULTATION: 0, COMPLETED: 0 };
    today.forEach((e) => { c[e.status] = (c[e.status] || 0) + 1; });
    return c;
  }, [today]);

  const advance = (regId: string, next: EncounterStatus) => {
    updateEncounter(regId, { status: next }, next === 'CHECKED_IN' ? 'CHECK_IN' : 'STATUS_CHANGE');
  };

  return (
    <Page>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Reception • {user?.name}</p>
          <h1 className="font-display mt-2 text-3xl font-bold text-slate-900 dark:text-white">Today's Queue — 11 September 2026</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{today.length} registered • limited verification view only — no clinical editing.</p>
        </div>
        <Link to="/reception/check-in" className="btn-sheen inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg"><UserCheck size={16} /> Open Check-in Desk</Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {FLOW.map((s) => (
          <div key={s} className="glass rounded-2xl p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {s === 'WAITING' ? <Clock size={12} /> : s === 'COMPLETED' ? <CheckCircle2 size={12} /> : <Stethoscope size={12} />} {statusLabel(s)}
            </p>
            <p className="font-display mt-1 text-3xl font-bold text-slate-900 dark:text-white">{counts[s] || 0}</p>
          </div>
        ))}
      </div>

      <div className="glass mt-6 rounded-2xl p-5">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Registration ID, Patient ID or name — e.g. REG-2026-0911-0042" className={`${inputCls} !pl-10`} />
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400"><Lock size={11} /> Reception sees limited demographics only — chief complaint and records stay locked.</div>
      </div>

      <div className="mt-5 grid gap-4">
        {filtered.map((e, idx) => {
          const p = patients.find((x) => x.patientId === e.patientId);
          const stepIdx = FLOW.indexOf(e.status);
          return (
            <div key={e.regId} className="glass card-lift rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">#{idx + 1} in queue</p>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{e.patientName} <span className="font-mono2 text-xs font-medium text-slate-500">• {e.patientId}</span></h3>
                  <p className="font-mono2 mt-1 text-[13px] font-bold text-teal-700 dark:text-teal-300">{e.regId}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{p?.phone} • {p?.gender}, {p?.age}y • Visit {e.visitNumber}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
              <div className="mt-4 flex items-center gap-1.5">
                {FLOW.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center gap-1.5">
                    <div className={`h-2 flex-1 rounded-full ${i <= stepIdx ? 'bg-gradient-to-r from-teal-500 to-sky-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                  </div>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">WAITING → CHECKED_IN → IN_CONSULTATION → COMPLETED</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {e.status === 'WAITING' && <button onClick={() => advance(e.regId, 'CHECKED_IN')} className="rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-4 py-2 text-xs font-bold text-white shadow">Check In →</button>}
                {e.status === 'CHECKED_IN' && <button onClick={() => advance(e.regId, 'IN_CONSULTATION')} className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow">Send to Consultation →</button>}
                {e.status !== 'COMPLETED' && e.status !== 'WAITING' && <span className="text-xs text-slate-500 dark:text-slate-400">Further moves happen in the doctor's room.</span>}
                {e.status === 'COMPLETED' && <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={13} /> Encounter completed</span>}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">No patients match “{q}”. Try REG-2026-0911-0042.</p>}
      </div>
    </Page>
  );
}
