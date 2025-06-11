/** @jsxImportSource react */
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MarkAttendancePage from './pages/MarkAttendancePage';
import StudentRegistrationPage from './pages/StudentRegistrationPage';
import StudentListPage from './pages/StudentListPage';
import StatisticsPage from './pages/StatisticsPage';
import { UserRole } from './types';
import LoadingSpinner from './components/LoadingSpinner';


interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner message="Authenticating..." />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Optional: redirect to an unauthorized page or home
    return <Navigate to="/" replace />; 
  }

  return <Outlet />; // Render child routes/components
};


const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes - Common to both roles */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mark-attendance" element={<MarkAttendancePage />} />
        </Route>

        {/* Protected Routes - Lecturer Only */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.LECTURER]} />}>
          <Route path="/register-student" element={<StudentRegistrationPage />} />
          <Route path="/students" element={<StudentListPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Route>
        
        {/* Fallback for unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;