import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Page, Steps } from '../components/ui';
import { Field, inputCls } from '../components/fields';
import { useMediStore } from '../store/useMediStore';

const STEPS = ['Register', 'Consent', 'History', 'Ayurveda', 'Documents', 'Done'];

export default function PatientRegister() {
  const { draft, setDraftPersonal } = useMediStore();
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();
  const p = draft.personal;

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p.name?.trim() || !p.age || !p.gender || !p.phone?.trim()) {
      setErr('Please complete name, age, gender and phone — all are required for registration.');
      return;
    }
    if (!/^[\d+\s-]{8,15}$/.test(p.phone.trim())) { setErr('Enter a valid phone number (8–15 digits).'); return; }
    if (Number(p.age) < 0 || Number(p.age) > 120) { setErr('Enter a valid age (0–120).'); return; }
    nav('/patient/consent');
  };

  return (
    <Page narrow>
      <Steps steps={STEPS} current={0} />
      <h1 className="font-display mt-5 text-3xl font-bold text-slate-900 dark:text-white">Patient Registration</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Step 1 of 6 — personal information. No login needed at the kiosk.</p>
      <form onSubmit={next} className="glass mt-6 grid gap-4 rounded-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name *"><input className={inputCls} value={p.name || ''} onChange={(e) => setDraftPersonal({ name: e.target.value })} placeholder="e.g. Aarav Patel" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age *"><input className={inputCls} type="number" min={0} max={120} value={p.age ?? ''} onChange={(e) => setDraftPersonal({ age: Number(e.target.value) })} placeholder="42" /></Field>
            <Field label="Gender *">
              <select className={inputCls} value={p.gender || ''} onChange={(e) => setDraftPersonal({ gender: e.target.value })}>
                <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
            </Field>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone *"><input className={inputCls} value={p.phone || ''} onChange={(e) => setDraftPersonal({ phone: e.target.value })} placeholder="+91 98XXX XXXXX" /></Field>
          <Field label="Blood group">
            <select className={inputCls} value={p.bloodGroup || ''} onChange={(e) => setDraftPersonal({ bloodGroup: e.target.value })}>
              <option value="">Select</option>{['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Address"><input className={inputCls} value={p.address || ''} onChange={(e) => setDraftPersonal({ address: e.target.value })} placeholder="Area, City" /></Field>
        <Field label="Emergency contact"><input className={inputCls} value={p.emergencyContact || ''} onChange={(e) => setDraftPersonal({ emergencyContact: e.target.value })} placeholder="Name + phone" /></Field>
        {err && <p className="rounded-xl border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{err}</p>}
        <button className="btn-sheen inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg">Continue to Consent <ArrowRight size={15} /></button>
      </form>
    </Page>
  );
}
