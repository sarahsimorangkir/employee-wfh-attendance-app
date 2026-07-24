import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeeApi } from '../../api/employee.api';
import { TextInput } from '../../components/ui/TextInput';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export default function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [employeeCode, setEmployeeCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      loadEmployee(parseInt(id));
    }
  }, [id]);

  const loadEmployee = async (empId: number) => {
    try {
      const res = await employeeApi.getById(empId);
      const emp = res.data;
      setEmployeeCode(emp.employeeCode);
      setFullName(emp.fullName);
      setEmail(emp.email);
      setRole(emp.role);
      setDepartment(emp.department || '');
      setPosition(emp.position || '');
    } catch {
      setError('Failed to load employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isEdit && id) {
        await employeeApi.update(parseInt(id), {
          employeeCode,
          fullName,
          email,
          role,
          department: department || undefined,
          position: position || undefined,
        });
      } else {
        await employeeApi.create({
          employeeCode,
          fullName,
          email,
          password,
          role,
          department: department || undefined,
          position: position || undefined,
        });
      }
      navigate('/admin/employees');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to save employee',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        {isEdit ? 'Edit Employee' : 'Add Employee'}
      </h1>

      {error && (
        <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Employee Code"
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          required
          placeholder="e.g. EMP001"
        />
        <TextInput
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="e.g. John Doe"
        />
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="e.g. john@company.com"
        />

        {!isEdit && (
          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Minimum 6 characters"
          />
        )}

        <Select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'EMPLOYEE' | 'ADMIN')}
          options={[
            { value: 'EMPLOYEE', label: 'Employee' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
        />
        <TextInput
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="e.g. Engineering"
        />
        <TextInput
          label="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="e.g. Software Engineer"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/employees')}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
}
