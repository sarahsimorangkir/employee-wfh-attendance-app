import { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendance.api';
import { Attendance } from '../../types';
import { Table } from '../../components/ui/Table';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

const API_URL = import.meta.env.VITE_API_URL;

export default function AttendanceMonitorPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchEmployee, setSearchEmployee] = useState('');

  useEffect(() => {
    fetchAttendances();
  }, [page, dateFrom, dateTo]);

  const fetchAttendances = async () => {
    setIsLoading(true);
    try {
      const res = await attendanceApi.getAll({
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page,
        limit,
      });
      setAttendances(res.data.data);
      setTotal(res.data.total);
    } catch {
      // handle silently
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  // client-side filter by employee name/code for the current page
  const filtered = searchEmployee
    ? attendances.filter(
        (a) =>
          a.employee.fullName
            .toLowerCase()
            .includes(searchEmployee.toLowerCase()) ||
          a.employee.employeeCode
            .toLowerCase()
            .includes(searchEmployee.toLowerCase()),
      )
    : attendances;

  const columns = [
    {
      key: 'employeeCode',
      header: 'Emp. Code',
      render: (a: Attendance) => a.employee.employeeCode,
    },
    {
      key: 'employeeName',
      header: 'Employee Name',
      render: (a: Attendance) => a.employee.fullName,
    },
    { key: 'attendanceDate', header: 'Date' },
    {
      key: 'checkInTime',
      header: 'Check-in Time',
      render: (a: Attendance) =>
        new Date(a.checkInTime).toLocaleTimeString(),
    },
    {
      key: 'photoUrl',
      header: 'Photo',
      render: (a: Attendance) => (
        <img
          src={`${API_URL}${a.photoUrl}`}
          alt="Attendance"
          className="w-12 h-12 object-cover rounded-md cursor-pointer border border-slate-200 shadow-2xs hover:opacity-80 transition-opacity"
          onClick={() => window.open(`${API_URL}${a.photoUrl}`, '_blank')}
        />
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (a: Attendance) => a.notes || '-',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Attendance Monitor</h1>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search employee..."
            value={searchEmployee}
            onChange={(e) => setSearchEmployee(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-md text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
          <label className="flex items-center gap-2">
            <span>From:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="flex items-center gap-2">
            <span>To:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState message="No attendance records found" />
      ) : (
        <>
          <Table columns={columns} data={filtered} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6 text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <span className="text-slate-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
