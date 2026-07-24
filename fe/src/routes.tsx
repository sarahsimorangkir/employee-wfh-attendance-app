import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AttendancePage from './pages/employee/AttendancePage';
import HistoryPage from './pages/employee/HistoryPage';
import EmployeeListPage from './pages/admin/EmployeeListPage';
import EmployeeFormPage from './pages/admin/EmployeeFormPage';
import AttendanceMonitorPage from './pages/admin/AttendanceMonitorPage';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Employee routes */}
          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/history"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <EmployeeListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees/new"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <EmployeeFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <EmployeeFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendances"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AttendanceMonitorPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="*"
            element={
              <Navigate
                to={
                  user
                    ? user.role === 'ADMIN'
                      ? '/admin/attendances'
                      : '/attendance'
                    : '/login'
                }
                replace
              />
            }
          />
        </Routes>
      </main>
    </>
  );
}
