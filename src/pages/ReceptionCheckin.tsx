import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, CheckCircle2, AlertTriangle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Page, StatusBadge } from '../components/ui';
import { inputCls } from '../components/fields';
import { useMediStore } from '../store/useMediStore';

export default function ReceptionCheckin() {
  const { encounters, patients, updateEncounter } = useMediStore();
  const [regId, setRegId] = useState('REG-2026-0911-0042');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const found = encounters.find((e) => e.regId.toLowerCase() === regId.trim().toLowerCase());
  const patient = found ? patients.find((p) => p.patientId === found.patientId) : undefined;

  const checkIn = () => {
    setMsg(null);
    if (!found) { setMsg({ ok: false, text: `No registration found for “${regId.trim()}”. Verify the ID from the patient's success screen.` }); return; }
    if (found.status !== 'WAITING') { setMsg({ ok: false, text: `${found.regId} is already ${found.status.replace(/_/g, ' ')} — only WAITING patients can be checked in here.` }); return; }
    updateEncounter(found.regId, { status: 'CHECKED_IN' }, 'CHECK_IN');
    setMsg({ ok: true, text: `${found.patientName} (${found.regId}) checked in — now visible in the doctor queue.` });
  };

  return (
    <Page narrow>
      <Link to="/reception" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 dark:text-teal-300"><ArrowLeft size={15} /> Back to queue</Link>
      <h1 className="font-display mt-3 text-3xl font-bold text-slate-900 dark:text-white">Check-in Desk</h1>
      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">Enter the visit Registration ID. Identity verified against limited info only.</p>

      <div className="glass mt-6 rounded-2xl p-6">
        <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-200">Registration ID</label>
        <div className="mt-2 flex gap-2">
          <input value={regId} onChange={(e) => setRegId(e.target.value)} placeholder="REG-2026-0911-0042" className={`${inputCls} font-mono2`} />
          <button onClick={checkIn} className="btn-sheen inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg"><ScanLine size={15} /> Verify</button>
        </div>
        {msg && (
          <p className={`mt-3 flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-sm ${msg.ok ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200' : 'border-red-300 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'}`}>
            {msg.ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}{msg.text}
          </p>
        )}
        {found && patient && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{found.patientName}</p>
                <p className="font-mono2 text-xs text-slate-500 dark:text-slate-400">{found.patientId} • {found.regId}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Phone ending {patient.phone.slice(-5)} • {patient.gender}, {patient.age}y • Visit {found.visitNumber} • {found.visitDate}</p>
              </div>
              <StatusBadge status={found.status} />
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400"><ShieldCheck size={12} className="mt-0.5 shrink-0" /> Clinical history, documents and AI summaries are hidden from reception by role design.</p>
            {found.status === 'WAITING' && <button onClick={checkIn} className="mt-3 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-4 py-2 text-xs font-bold text-white shadow">Confirm Check-In →</button>}
          </div>
        )}
        <div className="mt-4 rounded-xl bg-slate-900 p-3.5 font-mono2 text-[11px] leading-relaxed text-teal-200 dark:bg-white/5">
          ENCOUNTER STATUS: WAITING → CHECKED_IN → IN_CONSULTATION → COMPLETED<br />Try: REG-2026-0911-0042 • REG-2026-0911-0007 • REG-2026-0911-0023
        </div>
      </div>
    </Page>
  );
}
