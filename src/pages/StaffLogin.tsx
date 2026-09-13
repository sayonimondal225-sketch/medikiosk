import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Stethoscope, ClipboardList, Leaf, ShieldCheck, Loader2 } from 'lucide-react';
import { Page } from '../components/ui';
import { inputCls, Field } from '../components/fields';
import { useMediStore } from '../store/useMediStore';

const QUICK = [
  { u: 'reception', p: 'reception123', role: 'Receptionist', icon: ClipboardList, desc: 'Queue, verification & check-in' },
  { u: 'doctor', p: 'doctor123', role: 'Doctor', icon: Stethoscope, desc: 'Queue, records & AI approval' },
  { u: 'vaidya', p: 'ayurveda123', role: 'Ayurvedic Doctor', icon: Leaf, desc: 'Ayurveda + clinical records' },
  { u: 'admin', p: 'admin123', role: 'Administrator', icon: ShieldCheck, desc: 'Users, audit & security' },
];

export default function StaffLogin() {
  const { login, user } = useMediStore();
  const [username, setUsername] = useState('doctor');
  const [password, setPassword] = useState('doctor123');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };

  const destFor = (role: string) => {
    if (role === 'receptionist') return '/reception';
    if (role === 'admin') return '/admin';
    return '/doctor/dashboard';
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      const r = login(username, password);
      setBusy(false);
      if (!r.ok) { setError(r.error || 'Login failed'); return; }
      const role = useMediStore.getState().user?.role || 'doctor';
      nav(loc.state?.from || destFor(role), { replace: true });
    }, 500);
  };

  return (
    <Page narrow>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Role-based access</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-slate-900 dark:text-white">Staff Login</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Authentication + RBAC demo. Sessions are demo tokens; a Registration ID alone never unlocks records.
        {user && <span className="ml-1 font-semibold">Signed in as {user.name}.</span>}
      </p>

      <form onSubmit={submit} className="glass mt-6 rounded-2xl p-6">
        <div className="grid gap-4">
          <Field label="Username">
            <input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </Field>
          <Field label="Password">
            <input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </Field>
          {error && <p className="rounded-xl border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{error}</p>}
          <button disabled={busy} className="btn-sheen inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60">
            {busy && <Loader2 size={16} className="animate-spin" />} Sign in securely
          </button>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            Demo hashing + audit logging enabled. Production requires bcrypt/argon2, HTTPS-only cookies, rate limiting and env-managed secrets.
          </p>
        </div>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {QUICK.map((q) => (
          <button key={q.u} onClick={() => { setUsername(q.u); setPassword(q.p); setError(null); }}
            className="glass card-lift rounded-2xl p-4 text-left">
            <span className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-violet-500 text-white"><q.icon size={17} /></span>
              <span>
                <span className="block text-sm font-bold text-slate-900 dark:text-white">{q.role}</span>
                <span className="font-mono2 block text-[11px] text-slate-500 dark:text-slate-400">{q.u} / {q.p}</span>
              </span>
            </span>
            <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400">{q.desc}</span>
          </button>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Patient? No login needed — <Link className="font-semibold text-teal-600 dark:text-teal-300" to="/patient/register">register at the kiosk →</Link>
      </p>
    </Page>
  );
}
