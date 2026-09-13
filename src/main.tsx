import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { useMediStore } from './store/useMediStore';

try {
  const saved = localStorage.getItem('medikiosk-theme');
  const persisted = localStorage.getItem('medikiosk-v1');
  let theme: string | null = saved;
  if (!theme && persisted) {
    try { theme = (JSON.parse(persisted)?.state as { theme?: string })?.theme || null; } catch { /* noop */ }
  }
  if (theme === 'dark') document.documentElement.classList.add('dark');
} catch { /* noop */ }

function Boot() {
  const seedIfEmpty = useMediStore((s) => s.seedIfEmpty);
  React.useEffect(() => { seedIfEmpty(); }, [seedIfEmpty]);
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Boot />
    </BrowserRouter>
  </React.StrictMode>
);
