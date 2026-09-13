import { useCallback, useEffect, useRef, useState } from 'react';

interface VoiceOpts {
  lang?: string;
  onResult?: (text: string) => void;
}

/**
 * Web Speech API wrapper. English default; `lang` prop keeps Indian-language
 * support (hi-IN, ta-IN, ...) one line away. Graceful when unsupported/denied.
 */
export function useVoiceInput(opts: VoiceOpts = {}) {
  const { lang = 'en-IN', onResult } = opts;
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => {
    if (typeof window === 'undefined') return false;
    const w = window as unknown as Record<string, unknown>;
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
  });
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<{ stop: () => void; abort?: () => void } | null>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch { /* noop */ }
    setListening(false);
  }, []);

  const start = useCallback(() => {
    setError(null);
    if (typeof window === 'undefined') return;
    const w = window as unknown as Record<string, new (o?: unknown) => any>;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setError('Voice input is not supported in this browser. Please type instead.');
      return;
    }
    try {
      const rec = new Ctor();
      rec.lang = lang;
      rec.interimResults = true;
      rec.continuous = true;
      rec.onresult = (ev: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
        let text = '';
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const r = ev.results[i];
          if (r && r[0]) text += r[0].transcript;
        }
        if (text.trim()) onResultRef.current?.(text);
      };
      rec.onerror = (ev: { error?: string }) => {
        const code = ev?.error || 'error';
        if (code === 'not-allowed' || code === 'service-not-allowed') {
          setError('Microphone blocked. Allow mic access in the browser, then retry.');
        } else if (code === 'no-speech') {
          setError('No speech detected — try again closer to the mic.');
        } else if (code !== 'aborted') {
          setError('Voice recognition paused. You can keep typing manually.');
        }
        setListening(false);
      };
      rec.onend = () => setListening(false);
      recRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      setError('Could not start voice input. Please type instead.');
    }
  }, [lang]);

  useEffect(() => () => { try { recRef.current?.stop(); } catch { /* noop */ } }, []);

  return { listening, supported, error, start, stop, clearError: () => setError(null) };
}
