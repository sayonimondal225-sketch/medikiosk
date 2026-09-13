import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Page, Steps } from '../components/ui';
import { VoiceTextarea } from '../components/fields';
import { useMediStore } from '../store/useMediStore';

export default function PatientHistory() {
  const { draft, setDraftClinical } = useMediStore();
  const nav = useNavigate();
  const c = draft.clinical;

  const set = (k: string) => (v: string) => setDraftClinical({ [k]: v } as Record<string, string>);

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.consent) { nav('/patient/consent'); return; }
    nav('/patient/ayurveda');
  };

  return (
    <Page>
      <Steps steps={['Register', 'Consent', 'History', 'Ayurveda', 'Documents', 'Done']} current={2} />
      <h1 className="font-display mt-5 text-3xl font-bold text-slate-900 dark:text-white">Medical History</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Step 3 of 6 — tap <strong>Voice</strong> on any long field to dictate; you can always edit afterwards. English by default, structured for Indian-language expansion.</p>
      <form onSubmit={next} className="glass mt-6 grid gap-5 rounded-2xl p-6 md:grid-cols-2">
        <VoiceTextarea label="Chief complaint *" value={c.chiefComplaint || ''} onChange={set('chiefComplaint')} placeholder="e.g. Gastric discomfort and disturbed sleep for 2 weeks" hint="One or two lines — the main reason for today's visit." />
        <VoiceTextarea label="History of present illness" value={c.hpi || ''} onChange={set('hpi')} rows={4} placeholder="Onset, duration, relieving/aggravating factors, treatment so far…" />
        <VoiceTextarea label="Past medical history" value={c.pastMedical || ''} onChange={set('pastMedical')} placeholder="Diabetes, hypertension, thyroid, asthma…" />
        <VoiceTextarea label="Past surgical history" value={c.pastSurgical || ''} onChange={set('pastSurgical')} placeholder="Surgeries with year…" />
        <VoiceTextarea label="Medication history" value={c.medications || ''} onChange={set('medications')} placeholder="Drug, dose, frequency…" />
        <VoiceTextarea label="Allergy history" value={c.allergies || ''} onChange={set('allergies')} placeholder="Drug/food allergy + reaction…" />
        <VoiceTextarea label="Family history" value={c.familyHistory || ''} onChange={set('familyHistory')} placeholder="Parents/siblings — diabetes, cardiac, thyroid…" />
        <VoiceTextarea label="Personal history" value={c.personalHistory || ''} onChange={set('personalHistory')} placeholder="Diet, sleep, tobacco/alcohol, occupation, exercise…" />
        <div className="md:col-span-2">
          <VoiceTextarea label="Review of systems" value={c.ros || ''} onChange={set('ros')} rows={3} placeholder="GI, sleep, cardiac, respiratory, neuro — positives and key negatives…" />
        </div>
        <div className="flex gap-3 md:col-span-2">
          <Link to="/patient/consent" className="glass inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200"><ArrowLeft size={15} /> Back</Link>
          <button className="btn-sheen inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg">Continue to Ayurveda <ArrowRight size={15} /></button>
        </div>
      </form>
    </Page>
  );
}
