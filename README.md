# MediKiosk — AI-Assisted Patient Case-Taking & Clinical Record Management

Brand-new premium 3D healthcare web app (SIH demo build). White ↔ Black theme toggle,
interactive 3D hero (react-three-fiber), patient kiosk flow, voice-to-text, Ayurveda case-taking,
document OCR pipeline (simulated), reception queue, doctor dashboard + encounter record,
AI clinical summary (assistive only), RBAC, admin + audit trail.

## Quick start

```bash
npm install --legacy-peer-deps
npm run dev
```

Demo logins: `reception / reception123`, `doctor / doctor123`, `vaidya / ayurveda123`, `admin / admin123`.
Patient kiosk needs no login.

## Demo flow (18 steps)

Patient Register → Consent → History → Ayurveda → Documents → Submit (Patient ID + Registration ID)
→ Reception login → Check-in by Registration ID → Doctor dashboard (11 Sept 2026)
→ Open encounter → History timeline → Documents/OCR → Generate AI summary → Review/Edit → Approve → Complete.

Try: `REG-2026-0911-0042` (Aarav Patel, PAT-00084721).

## Notes

- OCR + AI summary are simulated client-side and always labelled machine-generated/draft.
- Auth/RBAC/audit are demo-grade (localStorage + zustand persist). Production needs a real backend:
  bcrypt/argon2, HTTPS-only sessions, per-role API guards, encrypted storage, env secrets (see `.env.example`).
- AI safety: summaries never diagnose/prescribe; Doctor Reviewed → Approved gate enforced in UI + audit.
