export type Role = 'patient' | 'receptionist' | 'doctor' | 'ayurveda_doctor' | 'admin';
export type EncounterStatus = 'WAITING' | 'CHECKED_IN' | 'IN_CONSULTATION' | 'COMPLETED';
export type SummaryStatus = 'DRAFT' | 'AI_GENERATED' | 'DOCTOR_REVIEWED' | 'DOCTOR_APPROVED';

export interface DemoUser {
  username: string;
  passHash: string;
  role: Exclude<Role, 'patient'>;
  name: string;
  department: string;
}

export interface Patient {
  patientId: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  createdAt: string;
}

export interface AyurvedaData {
  prakriti: string;
  vikriti: string;
  sara: string;
  samhanana: string;
  pramana: string;
  satmya: string;
  sattva: string;
  aharaShakti: string;
  vyayamaShakti: string;
  vaya: string;
  agni: string;
  koshta: string;
  ahara: string;
  vihara: string;
  dashavidha: string;
  notes: string;
}

export interface DocRecord {
  id: string;
  name: string;
  mime: string;
  size: number;
  uploadedAt: string;
  ocrText: string;
  ocrConfidence: number;
  aiDocSummary: string;
}

export interface Encounter {
  regId: string;
  patientId: string;
  patientName: string;
  visitDate: string;
  visitNumber: number;
  status: EncounterStatus;
  chiefComplaint: string;
  hpi: string;
  pastMedical: string;
  pastSurgical: string;
  medications: string;
  allergies: string;
  familyHistory: string;
  personalHistory: string;
  ros: string;
  ayurveda: AyurvedaData;
  documents: DocRecord[];
  aiSummary: string;
  aiStatus: SummaryStatus;
  doctorNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEntry {
  id: string;
  time: string;
  actor: string;
  role: string;
  action: string;
  details: string;
}

export const emptyAyurveda = (): AyurvedaData => ({
  prakriti: '', vikriti: '', sara: '', samhanana: '', pramana: '',
  satmya: '', sattva: '', aharaShakti: '', vyayamaShakti: '', vaya: '',
  agni: '', koshta: '', ahara: '', vihara: '', dashavidha: '', notes: '',
});
