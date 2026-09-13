import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UploadCloud, FileText, ArrowRight, ArrowLeft, Loader2, ScanLine, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Page, Steps } from '../components/ui';
import { useMediStore } from '../store/useMediStore';
import type { DocRecord } from '../lib/types';
import { uid } from '../lib/ids';
import { mockOCR, mockDocSummary } from '../lib/ai';

const ACCEPT = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const MAX_MB = 10;

export default function PatientDocuments() {
  const { draft, audit } = useMediStore();
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  const handleFiles = async (files: FileList | null) => {
    setError(null);
    if (!files?.length) return;
    for (const f of Array.from(files)) {
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      const okType = ACCEPT.includes(f.type) || ['pdf', 'jpg', 'jpeg', 'png'].includes(ext);
      if (!okType) { setError(`“${f.name}” rejected — only PDF, JPG, JPEG, PNG are supported.`); continue; }
      if (f.size > MAX_MB * 1024 * 1024) { setError(`“${f.name}” exceeds ${MAX_MB} MB limit.`); continue; }
      const id = uid('doc');
      setBusy(f.name);
      // Simulate pipeline: Upload → Validate → OCR → Structure → AI summary
      await new Promise((r) => setTimeout(r, 900));
      const ocr = mockOCR(f.name);
      await new Promise((r) => setTimeout(r, 500));
      const doc: DocRecord = {
        id, name: f.name, mime: f.type || 'application/octet-stream', size: f.size,
        uploadedAt: new Date().toISOString(), ocrText: ocr.text,
        ocrConfidence: ocr.confidence, aiDocSummary: mockDocSummary(ocr.text, f.name),
      };
      setDocs((d) => [...d, doc]);
      audit('DOCUMENT_UPLOAD', `“${f.name}” uploaded + OCR (${Math.round(ocr.confidence * 100)}%) for ${draft.personal.name || 'patient'}`);
      setBusy(null);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const submitCase = async () => {
    setError(null);
    if (!draft.personal.name || !draft.consent) { nav('/patient/register'); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1100));
    const st = useMediStore.getState();
    const existingPids = st.patients.map((p) => p.patientId);
    const patientId = `PAT-${String(Math.floor(10000000 + Math.random() * 89999999))}`;
    void existingPids;
    const seq = String(st.encounters.filter((e) => e.visitDate === '2026-09-11').length + 42).padStart(4, '0');
    const regId = `REG-2026-0911-${seq}`;
    const prior = st.encounters.filter((e) => e.patientName === draft.personal.name).length;
    st.upsertPatient({
      patientId, name: draft.personal.name || 'Unknown', age: Number(draft.personal.age) || 0,
      gender: draft.personal.gender || 'Other', phone: draft.personal.phone || '',
      address: draft.personal.address || '', bloodGroup: draft.personal.bloodGroup || '',
      emergencyContact: draft.personal.emergencyContact || '', createdAt: new Date().toISOString(),
    });
    st.addEncounter({
      regId, patientId, patientName: draft.personal.name || 'Unknown', visitDate: '2026-09-11',
      visitNumber: prior + 1, status: 'WAITING',
      chiefComplaint: draft.clinical.chiefComplaint || '', hpi: draft.clinical.hpi || '',
      pastMedical: draft.clinical.pastMedical || '', pastSurgical: draft.clinical.pastSurgical || '',
      medications: draft.clinical.medications || '', allergies: draft.clinical.allergies || '',
      familyHistory: draft.clinical.familyHistory || '', personalHistory: draft.clinical.personalHistory || '',
      ros: draft.clinical.ros || '', ayurveda: draft.ayurveda, documents: docs,
      aiSummary: '', aiStatus: 'DRAFT', doctorNotes: '',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    st.audit('CASE_SUBMITTED', `${regId} created for ${patientId} (${draft.personal.name}) with ${docs.length} document(s)`);
    try {
      sessionStorage.setItem('medikiosk-last-ids', JSON.stringify({ patientId, regId }));
    } catch { /* noop */ }
    st.resetDraft();
    setSubmitting(false);
    nav('/patient/submitted');
  };

  return (
    <Page narrow>
      <Steps steps={['Register', 'Consent', 'History', 'Ayurveda', 'Documents', 'Done']} current={4} />
      <h1 className="font-display mt-5 text-3xl font-bold text-slate-900 dark:text-white">Medical Documents + OCR</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Step 5 of 6 — Upload → Validate → OCR → Extracted Text → Clean/Structure → AI Summary → Doctor Review.</p>

      <button onClick={() => fileRef.current?.click()}
        className="glass card-lift mt-6 flex w-full flex-col items-center gap-2 rounded-2xl border-dashed !border-2 border-teal-500/40 px-6 py-10 text-center">
        <UploadCloud size={34} className="text-teal-600 dark:text-teal-300" />
        <span className="font-bold text-slate-800 dark:text-white">{busy ? `Processing “${busy}”…` : 'Click to upload reports'}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">PDF, JPG, JPEG, PNG • max {MAX_MB} MB each • validated before OCR</span>
        <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </button>
      {busy && <p className="mt-3 inline-flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300"><Loader2 size={15} className="animate-spin" /> Running OCR pipeline…</p>}
      {error && <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"><AlertTriangle size={15} className="mt-0.5 shrink-0" />{error}</p>}

      <div className="mt-5 grid gap-4">
        {docs.map((d) => (
          <div key={d.id} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="flex items-center gap-2 font-bold text-slate-800 dark:text-white"><FileText size={17} className="text-teal-600" />{d.name}</p>
              <button onClick={() => setDocs((x) => x.filter((y) => y.id !== d.id))} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={13} /> Validated • OCR {(d.ocrConfidence * 100).toFixed(0)}% • {(d.size / 1024).toFixed(0)} KB</p>
            <div className="mt-3 rounded-xl border border-amber-300/70 bg-amber-50/70 p-3.5 dark:border-amber-500/25 dark:bg-amber-500/[0.07]">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300"><ScanLine size={12} /> OCR output — machine-generated, may be imperfect</p>
              <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap font-mono2 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">{d.ocrText}</pre>
            </div>
            <p className="mt-2.5 rounded-xl bg-violet-500/[0.08] p-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300"><strong className="text-violet-700 dark:text-violet-300">AI doc summary (draft):</strong> {d.aiDocSummary}</p>
          </div>
        ))}
        {docs.length === 0 && !busy && (
          <p className="rounded-2xl border border-slate-200 bg-white/60 p-4 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">No documents yet — you can submit without reports and upload later at the desk.</p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link to="/patient/ayurveda" className="glass inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200"><ArrowLeft size={15} /> Back</Link>
        <button onClick={submitCase} disabled={submitting} className="btn-sheen inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60">
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={15} />} Submit Case ({docs.length} doc{docs.length === 1 ? '' : 's'})
        </button>
      </div>
    </Page>
  );
}
