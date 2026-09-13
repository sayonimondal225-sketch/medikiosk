import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Page, StatusBadge } from '../components/ui';
import { inputCls } from '../components/fields';
import { useMediStore } from '../store/useMediStore';

export default function DoctorToday() {
  const { encounters } = useMediStore();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('ALL');
  const today = encounters.filter((e) => e.visitDate === '2026-09-11');
  const list = today.filter((e) => {
    if (filter !== 'ALL' && e.status !== filter) return false;
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return e.regId.toLowerCase().includes(s) || e.patientName.toLowerCase().includes(s);
  });

  return (
    <Page>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Today's patients</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-slate-900 dark:text-white">11 September 2026 — {list.length} in view</h1>
      <div className="glass mt-5 flex flex-wrap items-center gap-2.5 rounded-2xl p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or Registration ID…" className={`${inputCls} !pl-10`} />
        </div>
        {['ALL', 'WAITING', 'CHECKED_IN', 'IN_CONSULTATION', 'COMPLETED'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3.5 py-2 text-xs font-bold ${filter === f ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300'}`}>
            {f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {list.map((e) => (
          <Link key={e.regId} to={`/doctor/encounter/${encodeURIComponent(e.regId)}`} className="glass card-lift rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display font-bold text-slate-900 dark:text-white">{e.patientName}</p>
                <p className="font-mono2 text-xs text-teal-700 dark:text-teal-300">{e.regId} • {e.patientId}</p>
                <p className="mt-1.5 line-clamp-2 text-[13px] text-slate-600 dark:text-slate-400">{e.chiefComplaint || 'No chief complaint recorded yet.'}</p>
              </div>
              <StatusBadge status={e.status} />
            </div>
            <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-teal-700 dark:text-teal-300">Open full record <ArrowRight size={13} /></p>
          </Link>
        ))}
        {list.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 md:col-span-2 dark:border-white/15 dark:text-slate-400">No patients match this filter.</p>}
      </div>
    </Page>
  );
}
