import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useMediStore } from '../store/useMediStore';
import type { Role } from '../lib/types';

export default function ProtectedRoute({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { user } = useMediStore();
  const loc = useLocation();
  const role: Role = user ? user.role : 'patient';
  if (!allow.includes(role)) {
    if (!user && (allow.includes('doctor') || allow.includes('receptionist') || allow.includes('admin') || allow.includes('ayurveda_doctor'))) {
      return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
    }
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
