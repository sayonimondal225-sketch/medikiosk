import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Leaf, Info } from 'lucide-react';
import { Page, Steps } from '../components/ui';
import { Field, VoiceTextarea, inputCls } from '../components/fields';
import { useMediStore } from '../store/useMediStore';

const SELECTS: Record<string, string[]> = {
  prakriti: ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tridoshaja'],
  vikriti: ['Vata vriddhi', 'Pitta vriddhi', 'Kapha vriddhi', 'Vata kshaya', 'Pitta kshaya', 'Kapha kshaya', 'Sama'],
  sara: ['Pravara', 'Madhyama', 'Avara', 'Tvak', 'Rakta', 'Mamsa', 'Meda', 'Asthi', 'Majja', 'Shukra'],
  samhanana: ['Pravara (compact)', 'Madhyama', 'Avara (lax)'],
  satmya: ['Sarva-rasa', 'Eka-rasa', 'Vyamishra'],
  sattva: ['Pravara', 'Madhyama', 'Avara'],
  agni: ['Samagni', 'Vishamagni', 'Tikshnagni', 'Mandagni'],
  koshta: ['Mridu', 'Madhyama', 'Krura'],
  vaya: ['Bala', 'Madhyama', 'Vriddha'],
};

const LABELS: Record<string, string> = {
  prakriti: 'Prakriti (constitution)', vikriti: 'Vikriti (current imbalance)', sara: 'Sara (tissue excellence)',
  samhanana: 'Samhanana (compactness)', pramana: 'Pramana (measurements)', satmya: 'Satmya (suitability)',
  sattva: 'Sattva (mental strength)', aharaShakti: 'Ahara Shakti (digestive power)', vyayamaShakti: 'Vyayama Shakti (exercise capacity)',
  vaya: 'Vaya (age group)', agni: 'Agni (digestive fire)', koshta: 'Koshta (bowel nature)',
};

export default function PatientAyurveda() {
  const { draft, setDraftAyurveda } = useMediStore();
  const nav = useNavigate();
  const a = draft.ayurveda;

  return (
    <Page>
      <Steps steps={['Register', 'Consent', 'History', 'Ayurveda', 'Documents', 'Done']} current={3} />
      <div className="mt-5 flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"><Leaf size={20} /></span>
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Ayurveda Case Taking</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Step 4 of 6 — structured Dashavidha-aligned capture. Final wording stays reviewable by qualified Vaidyas.</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-[13px] text-emerald-900 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200">
        <Info size={16} className="mt-0.5 shrink-0" />
        <p>The exact clinical form is configurable. This structured draft helps the Vaidya assess Prakriti–Vikriti, Agni, Koshta and lifestyle before the consultation.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); nav('/patient/documents'); }} className="glass mt-6 rounded-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(LABELS).map(([k, label]) => (
            <Field key={k} label={label}>
              {SELECTS[k] ? (
                <select className={inputCls} value={(a as unknown as Record<string, string>)[k] || ''} onChange={(e) => setDraftAyurveda({ [k]: e.target.value })}>
                  <option value="">Select…</option>
                  {SELECTS[k].map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input className={inputCls} value={(a as unknown as Record<string, string>)[k] || ''} onChange={(e) => setDraftAyurveda({ [k]: e.target.value })} placeholder="Describe briefly…" />
              )}
            </Field>
          ))}
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <VoiceTextarea label="Ahara (diet details)" value={a.ahara} onChange={(v) => setDraftAyurveda({ ahara: v })} placeholder="Staple diet, tastes dominant, timings, viruddha combinations…" />
          <VoiceTextarea label="Vihara (lifestyle)" value={a.vihara} onChange={(v) => setDraftAyurveda({ vihara: v })} placeholder="Sleep, work posture, exercise, Ratrijagarana / Divaswapna…" />
        </div>
        <div className="mt-5">
          <VoiceTextarea label="Dashavidha Pariksha observations" value={a.dashavidha} onChange={(v) => setDraftAyurveda({ dashavidha: v })} rows={4} placeholder="Prakriti, Vikriti, Sara, Samhanana, Pramana, Satmya, Sattva, Ahara/Vyayama shakti, Vaya — examination notes…" />
        </div>
        <div className="mt-5">
          <VoiceTextarea label="Additional Ayurveda notes" value={a.notes} onChange={(v) => setDraftAyurveda({ notes: v })} rows={2} placeholder="Nidra, Mala-Mutra pravritti, Manasika bhava…" />
        </div>
        <div className="mt-6 flex gap-3">
          <Link to="/patient/history" className="glass inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200"><ArrowLeft size={15} /> Back</Link>
          <button className="btn-sheen inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg">Continue to Documents <ArrowRight size={15} /></button>
        </div>
      </form>
    </Page>
  );
}
