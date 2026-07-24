import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeApi } from '../../api/employee.api';
import { Employee } from '../../types';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deactivateTarget, setDeactivateTarget] = useState<Employee | null>(
    null,
  );
  const [isDeactivating, setIsDeactivating] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchEmployees();
  }, [page, search]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await employeeApi.getAll({ search, page, limit });
      setEmployees(res.data.data);
      setTotal(res.data.total);
    } catch {
      // handle silently
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    setIsDeactivating(true);
    try {
      await employeeApi.deactivate(deactivateTarget.id);
      setDeactivateTarget(null);
      fetchEmployees();
    } catch {
      // handle silently
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleReactivate = async (employee: Employee) => {
    try {
      await employeeApi.update(employee.id, { isActive: true });
      fetchEmployees();
    } catch {
      // handle silently
    }
  };

  const totalPages = Math.ceil(total / limit);

  const columns = [
    { key: 'employeeCode', header: 'Code' },
    { key: 'fullName', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'department', header: 'Department', render: (e: Employee) => e.department || '-' },
    { key: 'position', header: 'Position', render: (e: Employee) => e.position || '-' },
    {
      key: 'isActive',
      header: 'Status',
      render: (e: Employee) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            e.isActive
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {e.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (e: Employee) => (
        <div className="flex items-center gap-2">
          <button
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
            onClick={() => navigate(`/admin/employees/${e.id}/edit`)}
          >
            Edit
          </button>
          {e.isActive ? (
            <button
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
              onClick={() => setDeactivateTarget(e)}
            >
              Deactivate
            </button>
          ) : (
            <button
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              onClick={() => handleReactivate(e)}
            >
              Activate
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
        <Button onClick={() => navigate('/admin/employees/new')}>
          Add Employee
        </Button>
      </div>

      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search by name, email, or code..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-3.5 py-2 border border-slate-300 rounded-md text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : employees.length === 0 ? (
        <EmptyState message="No employees found" />
      ) : (
        <>
          <Table columns={columns} data={employees} />

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

      {deactivateTarget && (
        <Modal
          title="Deactivate Employee"
          onClose={() => setDeactivateTarget(null)}
          onConfirm={handleDeactivate}
          confirmText="Deactivate"
          confirmVariant="danger"
          isLoading={isDeactivating}
        >
          <p>
            Are you sure you want to deactivate{' '}
            <strong className="text-slate-900">{deactivateTarget.fullName}</strong>? They will no longer be
            able to log in.
          </p>
        </Modal>
      )}
    </div>
  );
}
