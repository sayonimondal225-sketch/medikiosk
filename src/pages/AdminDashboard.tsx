import { useState } from 'react';
import { Users, ScrollText, Settings, Building2, ShieldCheck } from 'lucide-react';
import { Page } from '../components/ui';
import { inputCls } from '../components/fields';
import { useMediStore } from '../store/useMediStore';

const STAFF = [
  { u: 'reception', n: 'Riya Sharma', r: 'receptionist', d: 'Front Desk' },
  { u: 'doctor', n: 'Dr. Arjun Mehta', r: 'doctor', d: 'General Medicine' },
  { u: 'vaidya', n: 'Dr. Kavya Nair', r: 'ayurveda_doctor', d: 'Ayurveda' },
  { u: 'admin', n: 'System Administrator', r: 'admin', d: 'IT' },
];

export default function AdminDashboard() {
  const { audits, encounters, patients, audit } = useMediStore();
  const [tab, setTab] = useState('users');
  const [q, setQ] = useState('');
  const [note, setNote] = useState<string | null>(null);

  const filteredAudits = audits.filter((a) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (a.action + a.actor + a.details + a.role).toLowerCase().includes(s);
  });

  return (
    <Page>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Administrator</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-slate-900 dark:text-white">System Administration</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{patients.length} patients • {encounters.length} encounters • {audits.length} audit events</p>

      <div className="glass mt-5 flex gap-1.5 overflow-x-auto rounded-2xl p-1.5">
        {[
          { id: 'users', l: 'Users & Roles', icon: Users },
          { id: 'audit', l: 'Audit Logs', icon: ScrollText },
          { id: 'security', l: 'Security', icon: ShieldCheck },
          { id: 'system', l: 'Departments', icon: Building2 },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-[13px] font-bold ${tab === t.id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'}`}>
            <t.icon size={14} /> {t.l}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="glass mt-5 overflow-hidden rounded-2xl">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead><tr className="border-b border-slate-200 text-[11px] uppercase tracking-widest text-slate-500 dark:border-white/10 dark:text-slate-400">
              <th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Department</th><th className="px-5 py-3">Permissions</th>
            </tr></thead>
            <tbody>
              {STAFF.map((s) => (
                <tr key={s.u} className="border-b border-slate-100 last:border-0 dark:border-white/5">
                  <td className="px-5 py-3.5"><p className="font-bold text-slate-800 dark:text-slate-100">{s.n}</p><p className="font-mono2 text-xs text-slate-500">{s.u}</p></td>
                  <td className="px-5 py-3.5"><span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-bold text-teal-700 dark:text-teal-300">{s.r.replace('_', ' ')}</span></td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{s.d}</td>
                  <td className="max-w-[280px] px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                    {s.r === 'receptionist' ? 'Lookup + check-in only. No clinical edit, no doctor functions.' : s.r === 'doctor' ? 'Assigned/current clinical records, AI review + approve.' : s.r === 'ayurveda_doctor' ? 'Clinical + Ayurveda records per permissions.' : 'Users, roles, departments, audit, security config.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="flex items-center gap-1.5 border-t border-slate-200 px-5 py-3 text-[11px] text-slate-500 dark:border-white/10 dark:text-slate-400"><Settings size={12} /> Role edits are audited. Demo passwords: reception123 / doctor123 / ayurveda123 / admin123.</p>
        </div>
      )}

      {tab === 'audit' && (
        <div className="mt-5">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter audit trail — e.g. APPROVED, CHECK_IN, doctor…" className={`${inputCls} max-w-md`} />
          <div className="glass mt-4 overflow-hidden rounded-2xl">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead><tr className="border-b border-slate-200 text-[11px] uppercase tracking-widest text-slate-500 dark:border-white/10 dark:text-slate-400">
                <th className="px-5 py-3">Time</th><th className="px-5 py-3">Actor</th><th className="px-5 py-3">Action</th><th className="px-5 py-3">Details</th>
              </tr></thead>
              <tbody>
                {filteredAudits.slice(0, 80).map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 last:border-0 dark:border-white/5">
                    <td className="font-mono2 whitespace-nowrap px-5 py-2.5 text-[11px] text-slate-500">{new Date(a.time).toLocaleString()}</td>
                    <td className="px-5 py-2.5 text-xs"><strong className="text-slate-800 dark:text-slate-100">{a.actor}</strong> <span className="text-slate-500">({a.role})</span></td>
                    <td className="px-5 py-2.5"><span className="rounded-md bg-slate-900 px-2 py-0.5 font-mono2 text-[11px] font-bold text-teal-300 dark:bg-white/10">{a.action}</span></td>
                    <td className="max-w-[320px] truncate px-5 py-2.5 text-xs text-slate-600 dark:text-slate-300" title={a.details}>{a.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAudits.length === 0 && <p className="p-6 text-center text-sm text-slate-500">No audit events match. Actions like check-in, AI generation and approvals appear here automatically.</p>}
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="glass mt-5 grid gap-4 rounded-2xl p-6 text-sm leading-relaxed text-slate-600 md:grid-cols-2 dark:text-slate-300">
          {[
            ['Authentication', 'Demo salted hash + session token; production: bcrypt/argon2, HTTPS-only cookies, MFA for doctors/admins.'],
            ['Authorization / RBAC', 'Route guards + (documented) API guards per role. Registration ID alone never opens a record.'],
            ['Input & file validation', 'Required-field checks, phone/age validation, PDF/JPG/PNG + 10MB file gate before OCR.'],
            ['Audit logging', 'Creation, updates, uploads, AI generate/edit/approve and sensitive access — all with actor, role, timestamp.'],
            ['Secrets', 'No secrets in client bundle. Use .env server-side (JWT_SECRET, DB_URL, OCR_KEY) with rotation.'],
            ['Web hardening', 'Helmet headers, CORS allowlist, rate limits, XSS escaping, CSRF tokens, encrypted backups.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-slate-200 p-4 dark:border-white/10"><p className="font-bold text-slate-900 dark:text-white">{t}</p><p className="mt-1 text-[13px]">{d}</p></div>
          ))}
          <button onClick={() => { audit('SECURITY_REVIEW', 'Admin reviewed security checklist'); setNote('Security review recorded in audit log ✓'); setTimeout(() => setNote(null), 2000); }}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white md:col-span-2 dark:bg-white dark:text-slate-900">Record security review in audit log</button>
          {note && <p className="text-xs font-bold text-emerald-600 md:col-span-2">{note}</p>}
        </div>
      )}

      {tab === 'system' && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['General Medicine', 'Dr. Arjun Mehta', '4 today'],
            ['Ayurveda', 'Dr. Kavya Nair', '2 today'],
            ['Front Desk', 'Riya Sharma', '6 check-ins'],
            ['Radiology / Lab', 'OCR pipeline', `${encounters.reduce((n, e) => n + e.documents.length, 0)} docs`],
          ].map(([d, lead, stat]) => (
            <div key={d} className="glass rounded-2xl p-5">
              <p className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white"><Building2 size={15} className="text-teal-600" />{d}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{lead}</p>
              <p className="font-mono2 mt-2 text-xs text-slate-500">{stat}</p>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}
