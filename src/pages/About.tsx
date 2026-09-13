import { ShieldCheck, TriangleAlert, Leaf, Cpu } from 'lucide-react';
import { Page, Reveal } from '../components/ui';

export default function About() {
  return (
    <Page>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">About</p>
      <h1 className="font-display mt-2 max-w-2xl text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">A premium AI + Ayurveda clinical record platform</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-400">
        MediKiosk was designed as an SIH-winning demonstration of responsible clinical AI: digitize intake once,
        keep every visit linked to one Patient ID, surface OCR + AI drafts transparently, and leave every decision
        to a qualified doctor. Ayurveda sections remain structured but configurable — final clinical wording must be
        reviewed by qualified Ayurveda practitioners.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          { icon: Cpu, t: 'Assistive AI, never autonomous', d: 'Summaries organize history and flag OCR values for review. The model never diagnoses, prescribes, or replaces the doctor.' },
          { icon: Leaf, t: 'Modern + Ayurveda, side by side', d: 'Dashavidha Pariksha, Agni, Koshta, Ahara-Vihara and Prakriti/Vikriti captured with the same rigor as ROS and PMH.' },
          { icon: ShieldCheck, t: 'Security treated as clinical safety', d: 'RBAC on routes and (documented) APIs, hashed demo credentials, file validation, audit trail and least-privilege reception access.' },
        ].map((c, i) => (
          <Reveal key={c.t} delay={i * 0.06}>
            <div className="glass h-full rounded-2xl p-6">
              <c.icon size={22} className="text-teal-600 dark:text-teal-300" />
              <h3 className="font-display mt-3 font-bold text-slate-900 dark:text-white">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{c.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-6">
        <div className="flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200">
          <TriangleAlert size={20} className="shrink-0" />
          <p><strong>AI safety rule:</strong> AI-generated content is always labelled, editable, and requires Doctor Reviewed → Doctor Approved progression before it counts as part of the record. High-risk decisions always need qualified clinical review.</p>
        </div>
      </Reveal>
    </Page>
  );
}
