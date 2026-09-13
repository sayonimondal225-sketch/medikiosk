import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, Sun, Moon, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useMediStore } from '../store/useMediStore';

const links = [
  { to: '/', label: 'Home' },
  { to: '/patient/register', label: 'Patient Registration' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
];

export function ThemeToggle() {
  const { theme, toggleTheme } = useMediStore();
  const dark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? '☀ Light mode' : '🌙 Dark mode'}
      className="group relative inline-flex h-9 w-[68px] items-center rounded-full border border-slate-300 bg-white px-1 shadow-sm transition-all hover:shadow-md dark:border-white/15 dark:bg-white/10"
    >
      <span className="absolute left-1.5 text-slate-400 dark:text-slate-500"><Sun size={14} /></span>
      <span className="absolute right-1.5 text-slate-400 dark:text-amber-300"><Moon size={14} /></span>
      <span
        className={`z-10 flex h-7 w-7 items-center justify-center rounded-full shadow transition-all duration-300 ${
          dark ? 'translate-x-[32px] bg-gradient-to-br from-teal-300 to-violet-400 text-slate-900' : 'translate-x-0 bg-gradient-to-br from-teal-500 to-sky-600 text-white'
        }`}
      >
        {dark ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  );
}

export default function Navbar() {
  const { user, logout } = useMediStore();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-[#05080f]/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <button onClick={() => nav('/')} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-sky-500 to-violet-600 text-white shadow-lg shadow-teal-500/25">
            <Activity size={18} strokeWidth={2.6} />
          </span>
          <span className="text-left leading-none">
            <span className="font-display block text-[17px] font-700 font-bold tracking-tight text-slate-900 dark:text-white">MediKiosk</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">AI • Ayurveda • Care</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'}`}>
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <>
              {user.role === 'receptionist' && <NavLink to="/reception" className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">Reception</NavLink>}
              {(user.role === 'doctor' || user.role === 'ayurveda_doctor') && <NavLink to="/doctor/dashboard" className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">Doctor</NavLink>}
              {user.role === 'admin' && <NavLink to="/admin" className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">Admin</NavLink>}
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {user ? (
            <span className="hidden items-center gap-2 md:inline-flex">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                {user.name} • {user.role.replace('_', ' ')}
              </span>
              <button onClick={() => { logout(); nav('/'); }} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
                <LogOut size={13} /> Out
              </button>
            </span>
          ) : (
            <button onClick={() => nav('/login')} className="btn-sheen hidden rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition-transform hover:scale-[1.02] sm:inline-flex">
              Staff Login
            </button>
          )}
          <button onClick={() => setOpen(!open)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden dark:border-white/10 dark:text-slate-300">
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-[#05080f]/95">
          <div className="grid gap-1">
            {[...links, { to: '/login', label: 'Staff Login' }].map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">
                {l.label}
              </NavLink>
            ))}
            {user?.role === 'receptionist' && <NavLink to="/reception" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-teal-700 dark:text-teal-300">Reception Dashboard</NavLink>}
            {(user?.role === 'doctor' || user?.role === 'ayurveda_doctor') && <NavLink to="/doctor/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-teal-700 dark:text-teal-300">Doctor Dashboard</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-teal-700 dark:text-teal-300">Admin</NavLink>}
          </div>
        </div>
      )}
    </header>
  );
}
