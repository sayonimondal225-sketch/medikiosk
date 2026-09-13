import { Link } from 'react-router-dom';
import { Users, Clock, Stethoscope, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Page, StatusBadge } from '../components/ui';
import { useMediStore } from '../store/useMediStore';

export default function DoctorDashboard() {
  const { encounters, user } = useMediStore();
  const today = encounters.filter((e) => e.visitDate === '2026-09-11');
  const waiting = today.filter((e) => e.status === 'WAITING').length;
  const inCons = today.filter((e) => e.status === 'IN_CONSULTATION').length;
  const done = today.filter((e) => e.status === 'COMPLETED').length;
  const pendingAI = today.filter((e) => e.aiStatus === 'DRAFT' || e.aiStatus === 'AI_GENERATED').length;

  return (
    <Page>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">{user?.department} • {user?.name}</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-slate-900 dark:text-white">Doctor Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Patient List — 11 September 2026 • open a record for the full encounter view.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          { icon: Users, l: 'Today', v: today.length, c: 'from-sky-500 to-blue-600' },
          { icon: Clock, l: 'Waiting', v: waiting, c: 'from-amber-500 to-orange-500' },
          { icon: Stethoscope, l: 'In consultation', v: inCons, c: 'from-violet-500 to-purple-600' },
          { icon: CheckCircle2, l: 'Completed', v: done, c: 'from-emerald-500 to-teal-600' },
        ].map((s) => (
          <div key={s.l} className="glass rounded-2xl p-4">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white ${s.c}`}><s.icon size={17} /></span>
            <p className="font-display mt-2 text-2xl font-bold text-slate-900 dark:text-white">{s.v}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.l}</p>
          </div>
        ))}
      </div>

      {pendingAI > 0 && (
        <Link to="/doctor/patients/today" className="mt-4 flex items-center gap-2.5 rounded-2xl border border-violet-300 bg-violet-50 p-4 text-sm text-violet-900 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200">
          <Sparkles size={17} /> {pendingAI} case{pendingAI === 1 ? '' : 's'} awaiting AI summary generation / review <ArrowRight size={15} className="ml-auto" />
        </Link>
      )}

      <div className="glass mt-6 overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-widest text-slate-500 dark:border-white/10 dark:text-slate-400">
                <th className="px-5 py-3.5">Registration ID</th>
                <th className="px-5 py-3.5">Patient Name</th>
                <th className="px-5 py-3.5">Patient ID</th>
                <th className="px-5 py-3.5">Visit Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {today.map((e) => (
                <tr key={e.regId} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-teal-500/[0.05] dark:border-white/5">
                  <td className="font-mono2 px-5 py-3.5 text-[13px] font-bold text-teal-700 dark:text-teal-300">{e.regId}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-100">{e.patientName}</td>
                  <td className="font-mono2 px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">{e.patientId}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{e.visitDate}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={e.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <Link to={`/doctor/encounter/${encodeURIComponent(e.regId)}`} className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-600 dark:bg-white dark:text-slate-900 dark:hover:bg-teal-300">Open <ArrowRight size={12} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to="/doctor/patients/today" className="glass rounded-xl px-5 py-2.5 text-sm font-bold text-slate-800 dark:text-white">Today's patients view →</Link>
      </div>
    </Page>
  );
}
