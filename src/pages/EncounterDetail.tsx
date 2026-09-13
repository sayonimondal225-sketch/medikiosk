import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Pencil, CheckCircle2, FileText, History, Loader2, TriangleAlert, ScanLine, Stethoscope } from 'lucide-react';
import { Page, StatusBadge } from '../components/ui';
import { VoiceTextarea } from '../components/fields';
import { useMediStore } from '../store/useMediStore';
import { buildAISummary } from '../lib/ai';

const TABS = ['Overview', 'Clinical', 'Ayurveda', 'Documents', 'History', 'AI Summary'] as const;

export default function EncounterDetail() {
  const { id } = useParams();
  const regId = decodeURIComponent(id || '');
  const { encounters, patients, updateEncounter, user } = useMediStore();
  const enc = encounters.find((e) => e.regId === regId);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');
  const [editing, setEditing] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [noteDraft, setNoteDraft] = useState<string | null>(null);

  const patient = enc ? patients.find((p) => p.patientId === enc.patientId) : undefined;
  const prior = useMemo(() => (enc ? encounters.filter((e) => e.patientId === enc.patientId).sort((a, b) => a.visitNumber - b.visitNumber) : []), [encounters, enc]);

  if (!enc) {
    return (
      <Page narrow>
        <p className="rounded-2xl border border-red-300 bg-red-50 p-6 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          Encounter “{regId}” not found. <Link className="font-bold underline" to="/doctor/dashboard">Back to dashboard</Link>
        </p>
      </Page>
    );
  }

  const generateAI = async () => {
    setAiBusy(true);
    await new Promise((r) => setTimeout(r, 1200));
    const summary = buildAISummary(enc, Math.max(0, prior.length - 1));
    updateEncounter(enc.regId, { aiSummary: summary, aiStatus: 'AI_GENERATED' }, 'AI_SUMMARY_GENERATED');
    setAiBusy(false);
    setTab('AI Summary');
  };

  const saveAIEdit = (text: string) => {
    updateEncounter(enc.regId, { aiSummary: text, aiStatus: 'DOCTOR_REVIEWED' }, 'AI_SUMMARY_EDITED');
    setEditing(false);
  };
  const approve = () => updateEncounter(enc.regId, { aiStatus: 'DOCTOR_APPROVED' }, 'AI_SUMMARY_APPROVED');
  const complete = () => updateEncounter(enc.regId, { status: 'COMPLETED', doctorNotes: noteDraft ?? enc.doctorNotes }, 'ENCOUNTER_COMPLETED');
  const startConsult = () => updateEncounter(enc.regId, { status: 'IN_CONSULTATION' }, 'STATUS_CHANGE');

  const notes = noteDraft ?? enc.doctorNotes;

  return (
    <Page>
      <Link to="/doctor/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 dark:text-teal-300"><ArrowLeft size={15} /> Doctor dashboard</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">{enc.patientName}</h1>
          <p className="font-mono2 mt-1 text-sm text-slate-500 dark:text-slate-400">{enc.regId} • {enc.patientId} • Visit {enc.visitNumber} • {enc.visitDate}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={enc.status} />
          <StatusBadge status={enc.aiStatus} />
          {enc.status !== 'IN_CONSULTATION' && enc.status !== 'COMPLETED' && (
            <button onClick={startConsult} className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow">Start Consultation</button>
          )}
          {enc.status !== 'COMPLETED' && (
            <button onClick={complete} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow"><CheckCircle2 size={13} /> Complete Encounter</button>
          )}
        </div>
      </div>

      <div className="glass mt-5 flex gap-1.5 overflow-x-auto rounded-2xl p-1.5">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all ${tab === t ? 'bg-slate-900 text-white shadow dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Patient Information</h3>
            <dl className="mt-3 grid gap-2 text-sm">
              {[['Name', patient?.name], ['Age / Gender', patient ? `${patient.age}y • ${patient.gender}` : '—'], ['Phone', patient?.phone], ['Blood group', patient?.bloodGroup || '—'], ['Address', patient?.address || '—'], ['Emergency', patient?.emergencyContact || '—']].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-slate-100 pb-2 last:border-0 dark:border-white/5">
                  <dt className="text-slate-500 dark:text-slate-400">{k}</dt><dd className="text-right font-semibold text-slate-800 dark:text-slate-100">{v || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Current Encounter</h3>
            <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">Chief complaint</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{enc.chiefComplaint || '—'}</p>
            <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">HPI (excerpt)</p>
            <p className="mt-1 line-clamp-4 text-sm text-slate-600 dark:text-slate-300">{enc.hpi || '—'}</p>
            <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">Allergies</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{enc.allergies || 'NKDA / not recorded'}</p>
          </div>
          <div className="rounded-2xl border border-violet-300 bg-gradient-to-br from-violet-500/10 to-teal-500/10 p-5 dark:border-violet-500/25">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300"><Sparkles size={13} /> AI Clinical Summary</h3>
            {enc.aiSummary ? (
              <>
                <p className="mt-2 line-clamp-6 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{enc.aiSummary}</p>
                <button onClick={() => setTab('AI Summary')} className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-slate-900">Open review →</button>
              </>
            ) : (
              <>
                <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-400">No AI draft yet for this visit.</p>
                <button onClick={generateAI} disabled={aiBusy} className="btn-sheen mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow disabled:opacity-60">
                  {aiBusy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Generate AI Summary
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'Clinical' && (
        <div className="glass mt-5 grid gap-4 rounded-2xl p-6 md:grid-cols-2">
          {[['Chief Complaint', enc.chiefComplaint], ['History of Present Illness', enc.hpi], ['Past Medical History', enc.pastMedical], ['Past Surgical History', enc.pastSurgical], ['Medication History', enc.medications], ['Allergy History', enc.allergies], ['Family History', enc.familyHistory], ['Personal History', enc.personalHistory]].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{k}</p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">{v || '—'}</p>
            </div>
          ))}
          <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 md:col-span-2 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Review of Systems</p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">{enc.ros || '—'}</p>
          </div>
        </div>
      )}

      {tab === 'Ayurveda' && (
        <div className="glass mt-5 rounded-2xl p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300"><Stethoscope size={15} /> Ayurveda Assessment — reviewable by qualified Vaidya ({user?.name})</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(enc.ayurveda).map(([k, v]) => (
              <div key={k} className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">{k.replace(/([A-Z])/g, ' $1')}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{String(v) || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Documents' && (
        <div className="mt-5 grid gap-4">
          <div className="flex items-center gap-2 rounded-2xl border border-sky-300 bg-sky-50 p-4 text-[13px] text-sky-900 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200">
            <ScanLine size={16} /> Pipeline: Upload → Validate → OCR → Extracted Text → Clean/Structure → AI Summary → Doctor Review.
          </div>
          {enc.documents.length === 0 && <p className="glass rounded-2xl p-6 text-center text-sm text-slate-500 dark:text-slate-400">No reports uploaded for this visit.</p>}
          {enc.documents.map((d) => (
            <div key={d.id} className="glass rounded-2xl p-5">
              <p className="flex items-center gap-2 font-bold text-slate-800 dark:text-white"><FileText size={16} className="text-teal-600" />{d.name}</p>
              <p className="mt-1 text-xs text-slate-500">OCR confidence {(d.ocrConfidence * 100).toFixed(0)}% • {new Date(d.uploadedAt).toLocaleString()}</p>
              <div className="mt-3 rounded-xl border border-amber-300/70 bg-amber-50/70 p-3.5 dark:border-amber-500/25 dark:bg-amber-500/[0.07]">
                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">OCR text — machine-generated, verify vs scan</p>
                <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap font-mono2 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">{d.ocrText}</pre>
              </div>
              <p className="mt-2.5 rounded-xl bg-violet-500/[0.08] p-3 text-xs text-slate-600 dark:text-slate-300"><strong>AI doc summary:</strong> {d.aiDocSummary}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'History' && (
        <div className="glass mt-5 rounded-2xl p-6">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white"><History size={17} /> Longitudinal timeline — {enc.patientId}</h3>
          <div className="mt-5 space-y-0">
            {prior.map((v, i) => (
              <div key={v.regId} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${v.regId === enc.regId ? 'bg-gradient-to-br from-teal-500 to-violet-500 ring-4 ring-teal-500/20' : 'bg-slate-400 dark:bg-slate-600'}`}>{v.visitNumber}</span>
                  {i < prior.length - 1 && <span className="mt-1 w-0.5 flex-1 bg-slate-200 dark:bg-white/10" />}
                </div>
                <div className={`flex-1 rounded-2xl border p-4 ${v.regId === enc.regId ? 'border-teal-500/40 bg-teal-500/[0.06]' : 'border-slate-200 bg-white/60 dark:border-white/10 dark:bg-white/[0.02]'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono2 text-[13px] font-bold text-teal-700 dark:text-teal-300">{v.regId}</p>
                    <StatusBadge status={v.status} />
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">Visit {v.visitNumber} — {v.visitDate} {v.regId === enc.regId ? '(current)' : ''}</p>
                  <p className="mt-1 text-[13px] text-slate-600 dark:text-slate-400">{v.chiefComplaint || '—'}</p>
                  {v.regId !== enc.regId && <Link to={`/doctor/encounter/${encodeURIComponent(v.regId)}`} className="mt-2 inline-block text-xs font-bold text-teal-700 dark:text-teal-300">Open this visit →</Link>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'AI Summary' && (
        <div className="mt-5 grid gap-5 lg:grid-cols-5">
          <div className="rounded-2xl border border-violet-300 bg-gradient-to-b from-violet-500/[0.09] to-transparent p-6 lg:col-span-3 dark:border-violet-500/25">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white"><Sparkles size={12} /> AI Generated — assistive draft</p>
            <div className="mt-3 flex items-center gap-2 text-xs font-bold">
              {(['AI_GENERATED', 'DOCTOR_REVIEWED', 'DOCTOR_APPROVED'] as const).map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 ${enc.aiStatus === s || (s === 'AI_GENERATED' && enc.aiStatus !== 'DRAFT') || (s === 'DOCTOR_REVIEWED' && enc.aiStatus === 'DOCTOR_APPROVED') ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>{['AI Generated', 'Doctor Reviewed', 'Doctor Approved'][i]}</span>
                  {i < 2 && <span>→</span>}
                </span>
              ))}
            </div>
            {!enc.aiSummary ? (
              <button onClick={generateAI} disabled={aiBusy} className="btn-sheen mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60">
                {aiBusy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} {aiBusy ? 'Summarizing case…' : 'Generate AI Clinical Summary'}
              </button>
            ) : editing ? (
              <>
                <textarea value={enc.aiSummary} onChange={(e) => updateEncounter(enc.regId, { aiSummary: e.target.value })} rows={14}
                  className="mt-4 w-full rounded-xl border border-violet-300 bg-white/90 p-4 font-mono2 text-[12.5px] leading-relaxed text-slate-800 dark:border-white/10 dark:bg-black/40 dark:text-slate-100" />
                <div className="mt-3 flex gap-2">
                  <button onClick={() => saveAIEdit(enc.aiSummary)} className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow">Save as Reviewed ✓</button>
                  <button onClick={() => setEditing(false)} className="glass rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-4 font-mono2 text-[12.5px] leading-relaxed text-slate-100 dark:bg-black/50">{enc.aiSummary}</pre>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-violet-400 px-4 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-500/10 dark:text-violet-300"><Pencil size={13} /> Edit</button>
                  {enc.aiStatus === 'AI_GENERATED' && <button onClick={() => updateEncounter(enc.regId, { aiStatus: 'DOCTOR_REVIEWED' }, 'AI_SUMMARY_EDITED')} className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow">Mark Reviewed</button>}
                  {(enc.aiStatus === 'DOCTOR_REVIEWED' || enc.aiStatus === 'AI_GENERATED') && <button onClick={approve} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow"><CheckCircle2 size={13} /> Approve</button>}
                  {enc.aiStatus === 'DOCTOR_APPROVED' && <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-4 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300"><CheckCircle2 size={13} /> Approved by {user?.name}</span>}
                </div>
              </>
            )}
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200">
              <TriangleAlert size={15} className="mt-0.5 shrink-0" /> Safety: this AI organizes history and OCR values for review. It must NOT independently diagnose, prescribe, or replace the doctor — {user?.name} remains the final reviewer and approver.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Doctor Notes (voice enabled)</h3>
            <div className="mt-3">
              <VoiceTextarea label="Assessment & plan" value={notes} onChange={(v) => setNoteDraft(v)} rows={8} placeholder="Examination findings, assessment, plan, follow-up… (dictate or type)" />
            </div>
            <button onClick={() => { updateEncounter(enc.regId, { doctorNotes: notes }, 'NOTE_SAVED'); setNoteDraft(null); }} className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-700 dark:bg-white dark:text-slate-900">Save Notes</button>
            <p className="mt-2 text-[11px] text-slate-500">Saved notes and every approval step are audit-logged with actor + role.</p>
          </div>
        </div>
      )}
    </Page>
  );
}
