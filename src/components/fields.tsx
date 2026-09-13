import type { ReactNode } from 'react';
import { Mic, MicOff, AlertTriangle } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

export function VoiceButton({ onText, lang }: { onText: (t: string) => void; lang?: string }) {
  const v = useVoiceInput({ lang, onResult: (chunk) => onText(chunk) });
  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => (v.listening ? v.stop() : v.start())}
        title={v.listening ? 'Stop voice input' : 'Start voice input (English)'}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs transition-all ${
          v.listening
            ? 'recording-pulse border-red-400 bg-red-500 text-white'
            : 'border-slate-300 bg-white text-slate-500 hover:border-teal-500 hover:text-teal-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:border-teal-400'
        }`}
      >
        {v.listening ? <MicOff size={13} /> : <Mic size={13} />}
      </button>
      {v.error && (
        <span className="inline-flex max-w-[220px] items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400" title={v.error}>
          <AlertTriangle size={11} /> mic issue
        </span>
      )}
    </span>
  );
}

export function VoiceTextarea({
  label, value, onChange, placeholder, rows = 3, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; hint?: string;
}) {
  const v = useVoiceInput({ onResult: (chunk) => onChange((value ? value.replace(/\s+$/, '') + ' ' : '') + chunk) });
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-[13px] font-semibold text-slate-700 dark:text-slate-200">
        <span>{label} {v.listening && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-600 dark:text-red-400"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> listening…</span>}</span>
        <span className="inline-flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => (v.listening ? v.stop() : v.start())}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all ${
              v.listening
                ? 'recording-pulse border-red-400 bg-red-500 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-teal-500 hover:text-teal-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-300'
            }`}
          >
            {v.listening ? <MicOff size={12} /> : <Mic size={12} />}
            {v.listening ? 'Stop' : 'Voice'}
          </button>
        </span>
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-300 bg-white/80 px-3.5 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/25 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      {(hint || v.error) && (
        <span className="mt-1 block text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {v.error ? <span className="text-amber-600 dark:text-amber-400">{v.error} </span> : null}{hint}
        </span>
      )}
    </label>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">{hint}</span>}
    </label>
  );
}

export const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white/80 px-3.5 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/25 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:placeholder:text-slate-500';
