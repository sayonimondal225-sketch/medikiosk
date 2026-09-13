import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useMediStore } from './store/useMediStore';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import StaffLogin from './pages/StaffLogin';
import PatientRegister from './pages/PatientRegister';
import PatientConsent from './pages/PatientConsent';
import PatientHistory from './pages/PatientHistory';
import PatientAyurveda from './pages/PatientAyurveda';
import PatientDocuments from './pages/PatientDocuments';
import PatientSubmitted from './pages/PatientSubmitted';
import ReceptionDashboard from './pages/ReceptionDashboard';
import ReceptionCheckin from './pages/ReceptionCheckin';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorToday from './pages/DoctorToday';
import EncounterDetail from './pages/EncounterDetail';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const theme = useMediStore((s) => s.theme);
  const dark = theme === 'dark';
  return (
    <div className={`theme-fade min-h-screen ${dark ? 'bg-[#05080f] text-slate-100' : 'bg-[#f7fafc] text-slate-900'}`}>
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {dark ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_20%_0%,rgba(45,212,191,0.14),transparent),radial-gradient(ellipse_55%_45%_at_85%_15%,rgba(139,92,246,0.16),transparent),radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(56,189,248,0.1),transparent)]" />
            <div className="bg-grid-dark absolute inset-0 opacity-60" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_15%_0%,rgba(20,184,166,0.12),transparent),radial-gradient(ellipse_55%_45%_at_85%_10%,rgba(139,92,246,0.1),transparent),radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(56,189,248,0.1),transparent)]" />
            <div className="bg-grid-light absolute inset-0" />
          </>
        )}
      </div>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<StaffLogin />} />

          <Route path="/patient/register" element={<PatientRegister />} />
          <Route path="/patient/consent" element={<PatientConsent />} />
          <Route path="/patient/history" element={<PatientHistory />} />
          <Route path="/patient/ayurveda" element={<PatientAyurveda />} />
          <Route path="/patient/documents" element={<PatientDocuments />} />
          <Route path="/patient/submitted" element={<PatientSubmitted />} />

          <Route path="/reception" element={<ProtectedRoute allow={['receptionist', 'admin']}><ReceptionDashboard /></ProtectedRoute>} />
          <Route path="/reception/check-in" element={<ProtectedRoute allow={['receptionist', 'admin']}><ReceptionCheckin /></ProtectedRoute>} />

          <Route path="/doctor/dashboard" element={<ProtectedRoute allow={['doctor', 'ayurveda_doctor', 'admin']}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/patients/today" element={<ProtectedRoute allow={['doctor', 'ayurveda_doctor', 'admin']}><DoctorToday /></ProtectedRoute>} />
          <Route path="/doctor/encounter/:id" element={<ProtectedRoute allow={['doctor', 'ayurveda_doctor', 'admin']}><EncounterDetail /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute allow={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
