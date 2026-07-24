import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="font-bold text-lg text-slate-900 tracking-tight">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            WFH Attendance
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {user.role === 'EMPLOYEE' && (
            <>
              <Link
                to="/attendance"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive('/attendance') && !isActive('/attendance/history')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Check In
              </Link>
              <Link
                to="/attendance/history"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive('/attendance/history')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                History
              </Link>
            </>
          )}

          {user.role === 'ADMIN' && (
            <>
              <Link
                to="/admin/attendances"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/attendances')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Attendance Monitor
              </Link>
              <Link
                to="/admin/employees"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/employees')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Employees
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium text-slate-800">{user.fullName}</span>
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium border border-slate-200">
            {user.role}
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md text-xs transition-colors border border-slate-300 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
