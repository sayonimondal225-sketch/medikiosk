import type { DocRecord, Encounter } from './types';

/** Deterministic demo OCR text per filename — clearly labelled machine-generated. */
export function mockOCR(fileName: string): { text: string; confidence: number } {
  const lower = fileName.toLowerCase();
  const base =
    `MACHINE-GENERATED OCR (may contain errors — verify against original scan)\n` +
    `— — —\n`;
  if (lower.includes('cbc') || lower.includes('blood')) {
    return {
      confidence: 0.91,
      text:
        base +
        `CITY CARE PATHOLOGY  •  CBC REPORT\nHb: 11.2 g/dL (L)  •  TLC: 8,400 /uL\nPlatelets: 2.1 Lakh/uL  •  ESR: 28 mm/hr\nMCV 82 fL, MCH 27 pg. Impression: mild microcytic picture.`,
    };
  }
  if (lower.includes('xray') || lower.includes('chest') || lower.includes('x-ray')) {
    return {
      confidence: 0.84,
      text:
        base +
        `RADIOLOGY — CHEST X-RAY PA VIEW\nLung fields: bilateral bronchovascular prominence.\nCardiac silhouette within normal limits. No focal consolidation.\nImpression: ? early bronchitic changes. Correlate clinically.`,
    };
  }
  if (lower.includes('thyroid') || lower.includes('tft')) {
    return {
      confidence: 0.88,
      text:
        base +
        `THYROID FUNCTION TEST\nTSH: 6.8 uIU/mL (H)  •  FT4: 1.0 ng/dL  •  FT3: 2.9 pg/mL\nImpression: subclinical hypothyroidism pattern.`,
    };
  }
  return {
    confidence: 0.82,
    text:
      base +
      `GENERAL MEDICAL REPORT (scanned)\nVitals noted, routine investigations attached.\nKey phrases extracted: follow-up advised, medication compliance to be reviewed,\nAyurvedic lifestyle history recorded separately in case sheet.`,
  };
}

export function mockDocSummary(ocrText: string, fileName: string): string {
  const snippet = ocrText.slice(0, 220).replace(/\n/g, ' ');
  return (
    `AI-organized extract from “${fileName}” (for doctor review only): ` +
    `${snippet}… Key values flagged for verification; no diagnosis inferred.`
  );
}

/** Builds a doctor-facing case overview. Assistive only — never a diagnosis. */
export function buildAISummary(e: Encounter, priorVisits: number): string {
  const lines = [
    `AI-GENERATED CLINICAL OVERVIEW — assistive draft, requires doctor review. It does not diagnose, prescribe, or replace clinical judgment.`,
    ``,
    `Patient ${e.patientName} (${e.patientId}) • Visit ${e.visitNumber} • ${e.visitDate} • Prior visits on record: ${priorVisits}.`,
    ``,
    `Chief complaint: ${e.chiefComplaint || '—'}`,
    `HPI: ${(e.hpi || '—').slice(0, 400)}`,
    `PMH: ${e.pastMedical || '—'} | Surgical: ${e.pastSurgical || '—'}`,
    `Medications: ${e.medications || '—'} | Allergies: ${e.allergies || '—'}`,
    `Family: ${e.familyHistory || '—'} | Personal: ${e.personalHistory || '—'}`,
    `ROS: ${e.ros || '—'}`,
    ``,
    `Ayurveda snapshot — Prakriti: ${e.ayurveda.prakriti || '—'}, Vikriti: ${e.ayurveda.vikriti || '—'}, Agni: ${e.ayurveda.agni || '—'}, Koshta: ${e.ayurveda.koshta || '—'}, Nidra/Vihara: ${(e.ayurveda.vihara || '—').slice(0, 160)}. Dashavidha: ${(e.ayurveda.dashavidha || '—').slice(0, 200)}`,
    ``,
    e.documents.length
      ? `Documents (${e.documents.length}): ` +
        e.documents.map((d: DocRecord) => `“${d.name}” (OCR conf ${(d.ocrConfidence * 100).toFixed(0)}%): ${(d.aiDocSummary || '').slice(0, 140)}`).join(' | ')
      : `Documents: none uploaded for this visit.`,
    ``,
    `Suggested review checklist for doctor: (1) verify OCR values against scans, (2) reconcile medication/allergy lists via voice-confirmed history, (3) assess Ayurveda findings with qualified Vaidya review, (4) record final plan in Doctor Notes, then mark Reviewed → Approved.`,
  ];
  return lines.join('\n');
}
