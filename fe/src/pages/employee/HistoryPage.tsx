import { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendance.api';
import { Attendance } from '../../types';
import { Table } from '../../components/ui/Table';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

const API_URL = import.meta.env.VITE_API_URL;

export default function HistoryPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await attendanceApi.getMyHistory({ page, limit });
      setAttendances(res.data.data);
      setTotal(res.data.total);
    } catch {
      // handle silently
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const columns = [
    { key: 'attendanceDate', header: 'Date' },
    {
      key: 'checkInTime',
      header: 'Check-in Time',
      render: (item: Attendance) =>
        new Date(item.checkInTime).toLocaleTimeString(),
    },
    {
      key: 'photoUrl',
      header: 'Photo',
      render: (item: Attendance) => (
        <img
          src={`${API_URL}${item.photoUrl}`}
          alt="Attendance"
          className="w-12 h-12 object-cover rounded-md cursor-pointer border border-slate-200 shadow-2xs hover:opacity-80 transition-opacity"
          onClick={() => window.open(`${API_URL}${item.photoUrl}`, '_blank')}
        />
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (item: Attendance) => item.notes || '-',
    },
  ];

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Attendance History</h1>

      {attendances.length === 0 ? (
        <EmptyState message="No attendance records yet" />
      ) : (
        <>
          <Table columns={columns} data={attendances} />

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
