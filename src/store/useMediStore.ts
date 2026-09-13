import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuditEntry, AyurvedaData, DemoUser, Encounter, Patient } from '../lib/types';
import { emptyAyurveda } from '../lib/types';
import { demoHash, uid } from '../lib/ids';

export type Theme = 'light' | 'dark';

interface Draft {
  personal: Partial<Patient> & { name?: string };
  consent: boolean;
  clinical: Partial<Encounter>;
  ayurveda: AyurvedaData;
}

interface MediState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;

  user: DemoUser | null;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;

  patients: Patient[];
  encounters: Encounter[];
  audits: AuditEntry[];
  audit: (action: string, details: string) => void;

  draft: Draft;
  setDraftPersonal: (p: Partial<Patient>) => void;
  setDraftConsent: (v: boolean) => void;
  setDraftClinical: (c: Partial<Encounter>) => void;
  setDraftAyurveda: (a: Partial<AyurvedaData>) => void;
  resetDraft: () => void;

  upsertPatient: (p: Patient) => void;
  addEncounter: (e: Encounter) => void;
  updateEncounter: (regId: string, patch: Partial<Encounter>, auditAction?: string) => void;
  getEncountersByPatient: (pid: string) => Encounter[];
  seedIfEmpty: () => void;
}

const USERS: DemoUser[] = [
  { username: 'reception', passHash: demoHash('reception123'), role: 'receptionist', name: 'Riya Sharma', department: 'Front Desk' },
  { username: 'doctor', passHash: demoHash('doctor123'), role: 'doctor', name: 'Dr. Arjun Mehta', department: 'General Medicine' },
  { username: 'vaidya', passHash: demoHash('ayurveda123'), role: 'ayurveda_doctor', name: 'Dr. Kavya Nair', department: 'Ayurveda' },
  { username: 'admin', passHash: demoHash('admin123'), role: 'admin', name: 'System Administrator', department: 'IT' },
];

function seedPatients(): Patient[] {
  return [
    { patientId: 'PAT-00084721', name: 'Aarav Patel', age: 42, gender: 'Male', phone: '+91 98200 11223', address: 'Andheri West, Mumbai', bloodGroup: 'B+', emergencyContact: '+91 98200 44556', createdAt: '2026-09-01T09:12:00' },
    { patientId: 'PAT-00084655', name: 'Meera Iyer', age: 35, gender: 'Female', phone: '+91 99870 33445', address: 'Kothrud, Pune', bloodGroup: 'O+', emergencyContact: '+91 99870 99881', createdAt: '2026-09-11T08:02:00' },
    { patientId: 'PAT-00084510', name: 'Rohan Das', age: 28, gender: 'Male', phone: '+91 90040 77889', address: 'Salt Lake, Kolkata', bloodGroup: 'A+', emergencyContact: '+91 90040 11223', createdAt: '2026-09-11T08:20:00' },
    { patientId: 'PAT-00084402', name: 'Fatima Khan', age: 51, gender: 'Female', phone: '+91 98110 55667', address: 'Okhla, New Delhi', bloodGroup: 'AB+', emergencyContact: '+91 98110 88990', createdAt: '2026-09-11T08:41:00' },
    { patientId: 'PAT-00084317', name: 'Vikram Rao', age: 60, gender: 'Male', phone: '+91 98450 22334', address: 'Jayanagar, Bengaluru', bloodGroup: 'O-', emergencyContact: '+91 98450 66778', createdAt: '2026-09-11T09:05:00' },
  ];
}

function seedEncounters(): Encounter[] {
  const ay = emptyAyurveda();
  const mk = (over: Partial<Encounter> & { regId: string; patientId: string; patientName: string }): Encounter => ({
    visitDate: '2026-09-11', visitNumber: 1, status: 'WAITING',
    chiefComplaint: '', hpi: '', pastMedical: '', pastSurgical: '', medications: '',
    allergies: '', familyHistory: '', personalHistory: '', ros: '',
    ayurveda: { ...ay }, documents: [], aiSummary: '', aiStatus: 'DRAFT',
    doctorNotes: '', createdAt: '2026-09-11T09:00:00', updatedAt: '2026-09-11T09:00:00',
    ...over,
  });
  return [
    mk({ regId: 'REG-2026-0901-0012', patientId: 'PAT-00084721', patientName: 'Aarav Patel', visitDate: '2026-09-01', visitNumber: 1, status: 'COMPLETED', chiefComplaint: 'Recurrent acidity and bloating after meals', hpi: 'Burning epigastric pain 3 months, worse at night. On antacids with partial relief.', pastMedical: 'GERD (2023)', medications: 'Pantoprazole 40mg OD (SOS)', ayurveda: { ...ay, prakriti: 'Pitta-Kapha', agni: 'Vishamagni', koshta: 'Madhyama', ahara: 'Katu-Amla dominant, irregular timing', vihara: 'Sedentary IT work, late nights', dashavidha: 'Prakriti Pitta-Kapha; Vikriti Pitta vriddhi; Bala madhyama.' }, aiSummary: '', aiStatus: 'DOCTOR_APPROVED', doctorNotes: 'Advised lifestyle correction + follow-up. Agni assessment by Vaidya recorded.' }),
    mk({ regId: 'REG-2026-0911-0042', patientId: 'PAT-00084721', patientName: 'Aarav Patel', visitDate: '2026-09-11', visitNumber: 2, status: 'WAITING', chiefComplaint: 'Persistent gastric discomfort, disturbed sleep', hpi: 'Continued acidity despite PPI; disturbed sleep 2 weeks, work stress high.', pastMedical: 'GERD (2023); Allergic rhinitis', pastSurgical: 'Appendectomy (2015)', medications: 'Pantoprazole 40mg OD', allergies: 'Dust — sneezing', familyHistory: 'Father: T2DM; Mother: hypothyroid', personalHistory: 'Smoker (occasional), tea 4 cups/day', ros: 'GI: heartburn+, bloating+. Sleep: broken. No chest pain, no fever.', ayurveda: { ...ay, prakriti: 'Pitta-Kapha', vikriti: 'Pitta vriddhi, Vata anulomana kshaya', agni: 'Mandagni', koshta: 'Krura', ahara: 'Viruddha — milk with sour fruits occasionally', vihara: 'Ratrijagarana (late nights), Divaswapna occasionally', dashavidha: 'Prakriti Pitta-Kapha; Sara asthi-majja madhyama; Samhanana madhyama; Satmya sarva-rasa; Sattva madhyama; Ahara shakti avara.' }, aiSummary: '', aiStatus: 'DRAFT', doctorNotes: '' }),
    mk({ regId: 'REG-2026-0911-0007', patientId: 'PAT-00084655', patientName: 'Meera Iyer', visitDate: '2026-09-11', visitNumber: 1, status: 'CHECKED_IN', chiefComplaint: 'Migraine episodes twice a month', hpi: 'Left-sided throbbing headache with nausea, 6 months. Trigger: missed meals, screen time.', pastMedical: 'Migraine without aura', medications: 'Paracetamol SOS', allergies: 'NKDA', familyHistory: 'Mother: migraine', personalHistory: 'Vegetarian, yoga 3x/week', ros: 'Neuro: headache as above. No visual aura, no weakness.', ayurveda: { ...ay, prakriti: 'Vata-Pitta', agni: 'Vishamagni', koshta: 'Madhyama' }, aiSummary: '', aiStatus: 'DRAFT', doctorNotes: '' }),
    mk({ regId: 'REG-2026-0911-0019', patientId: 'PAT-00084510', patientName: 'Rohan Das', visitDate: '2026-09-11', visitNumber: 1, status: 'IN_CONSULTATION', chiefComplaint: 'Low back ache after long sitting', hpi: 'Dull LBA 2 months, radiates to left thigh occasionally. No trauma.', pastMedical: 'Nil significant', medications: 'Nil regular', allergies: 'NKDA', familyHistory: 'Nil', personalHistory: 'Software engineer, 10h sitting', ros: 'MSK: lumbar tenderness+, SLR 70° left.', ayurveda: { ...ay, prakriti: 'Vata-Kapha', agni: 'Samagni', vihara: 'Prolonged sitting (Asatmya vihara)' }, aiSummary: '', aiStatus: 'DRAFT', doctorNotes: '' }),
    mk({ regId: 'REG-2026-0911-0023', patientId: 'PAT-00084402', patientName: 'Fatima Khan', visitDate: '2026-09-11', visitNumber: 3, status: 'WAITING', chiefComplaint: 'Joint pain in knees, morning stiffness', hpi: 'Bilateral knee pain 1 year, stiffness >30 min mornings. Difficulty climbing stairs.', pastMedical: 'Hypothyroidism; OA knees (suspected)', medications: 'Thyroxine 75mcg OD', allergies: 'Penicillin — rash', familyHistory: 'Mother: OA', personalHistory: 'Homemaker, limited activity', ros: 'MSK: knee crepitus+, effusion trace right.', ayurveda: { ...ay, prakriti: 'Kapha-Vata', vikriti: 'Vata vriddhi in sandhi', agni: 'Mandagni', koshta: 'Madhyama', vaya: 'Madhyama (51y)' }, aiSummary: '', aiStatus: 'DRAFT', doctorNotes: '' }),
    mk({ regId: 'REG-2026-0911-0031', patientId: 'PAT-00084317', patientName: 'Vikram Rao', visitDate: '2026-09-11', visitNumber: 1, status: 'WAITING', chiefComplaint: 'High BP follow-up, headache', hpi: 'Known hypertensive, BP 150/95 at home yesterday. Mild occipital headache.', pastMedical: 'Hypertension (2021); Dyslipidaemia', medications: 'Amlodipine 5mg OD; Atorvastatin 10mg HS', allergies: 'NKDA', familyHistory: 'Father: CAD', personalHistory: 'Ex-smoker, walks 20 min/day', ros: 'CVS: no chest pain. Neuro: mild headache.', ayurveda: { ...ay, prakriti: 'Pitta-Vata', agni: 'Tikshnagni', koshta: 'Mridu' }, aiSummary: '', aiStatus: 'DRAFT', doctorNotes: '' }),
  ];
}

export const useMediStore = create<MediState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: next });
        try {
          document.documentElement.classList.toggle('dark', next === 'dark');
          localStorage.setItem('medikiosk-theme', next);
        } catch { /* noop */ }
      },
      setTheme: (t) => {
        set({ theme: t });
        try {
          document.documentElement.classList.toggle('dark', t === 'dark');
          localStorage.setItem('medikiosk-theme', t);
        } catch { /* noop */ }
      },

      user: null,
      login: (username, password) => {
        const u = USERS.find((x) => x.username === username.trim().toLowerCase());
        if (!u || u.passHash !== demoHash(password)) {
          get().audit('LOGIN_FAILED', `Failed login for “${username}”`);
          return { ok: false, error: 'Invalid credentials. Try doctor / doctor123' };
        }
        set({ user: u });
        get().audit('LOGIN', `${u.name} (${u.role}) signed in`);
        return { ok: true };
      },
      logout: () => {
        const u = get().user;
        set({ user: null });
        if (u) get().audit('LOGOUT', `${u.name} signed out`);
      },

      patients: [],
      encounters: [],
      audits: [],
      audit: (action, details) => {
        const u = get().user;
        const entry: AuditEntry = {
          id: uid('audit'), time: new Date().toISOString(), actor: u ? u.name : 'Patient Kiosk',
          role: u ? u.role : 'patient', action, details,
        };
        set((s) => ({ audits: [entry, ...s.audits].slice(0, 400) }));
      },

      draft: { personal: {}, consent: false, clinical: {}, ayurveda: emptyAyurveda() },
      setDraftPersonal: (p) => set((s) => ({ draft: { ...s.draft, personal: { ...s.draft.personal, ...p } } })),
      setDraftConsent: (v) => set((s) => ({ draft: { ...s.draft, consent: v } })),
      setDraftClinical: (c) => set((s) => ({ draft: { ...s.draft, clinical: { ...s.draft.clinical, ...c } } })),
      setDraftAyurveda: (a) => set((s) => ({ draft: { ...s.draft, ayurveda: { ...s.draft.ayurveda, ...a } } })),
      resetDraft: () => set({ draft: { personal: {}, consent: false, clinical: {}, ayurveda: emptyAyurveda() } }),

      upsertPatient: (p) => set((s) => {
        const i = s.patients.findIndex((x) => x.patientId === p.patientId);
        if (i >= 0) { const arr = [...s.patients]; arr[i] = p; return { patients: arr }; }
        return { patients: [p, ...s.patients] };
      }),
      addEncounter: (e) => set((s) => ({ encounters: [e, ...s.encounters] })),
      updateEncounter: (regId, patch, auditAction) => {
        set((s) => ({
          encounters: s.encounters.map((e) => (e.regId === regId ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e)),
        }));
        if (auditAction) get().audit(auditAction, `${regId}: ${auditAction}`);
      },
      getEncountersByPatient: (pid) => get().encounters.filter((e) => e.patientId === pid).sort((a, b) => a.visitNumber - b.visitNumber),
      seedIfEmpty: () => {
        if (get().patients.length === 0 && get().encounters.length === 0) {
          set({ patients: seedPatients(), encounters: seedEncounters() });
        }
      },
    }),
    { name: 'medikiosk-v1', partialize: (s) => ({ theme: s.theme, patients: s.patients, encounters: s.encounters, audits: s.audits, user: s.user }) }
  )
);

export function statusLabel(s: string): string {
  return s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
