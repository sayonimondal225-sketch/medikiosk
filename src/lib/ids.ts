export function makePatientId(existing: string[] = []): string {
  let id = '';
  do {
    const n = Math.floor(10000000 + Math.random() * 89999999);
    id = `PAT-${String(n).padStart(8, '0')}`;
  } while (existing.includes(id));
  // Deterministic demo default
  return id;
}

export function makeRegId(date = new Date(), seq = 42): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `REG-${y}-${m}${d}-${String(seq).padStart(4, '0')}`;
}

export function todayISO(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Simple non-crypto demo hash (real backend must use bcrypt/argon2). */
export function demoHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return 'h_' + h.toString(16);
}
