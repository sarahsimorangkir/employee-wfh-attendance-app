import { useState, useEffect, FormEvent } from 'react';
import { attendanceApi } from '../../api/attendance.api';
import { Attendance } from '../../types';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

const API_URL = import.meta.env.VITE_API_URL;

export default function AttendancePage() {
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(
    null,
  );
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // form state
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    checkTodayAttendance();
  }, []);

  const checkTodayAttendance = async () => {
    try {
      const res = await attendanceApi.getMyHistory({ limit: 10 });
      const found = res.data.data.find((a) => a.attendanceDate === today);
      if (found) {
        setTodayAttendance(found);
        setIsCheckedIn(true);
      }
    } catch {
      // no attendance yet
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!photo) {
      setError('Please select a photo');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('photo', photo);
      if (notes) formData.append('notes', notes);

      const res = await attendanceApi.checkIn(formData);
      setTodayAttendance(res.data);
      setIsCheckedIn(true);
      setSuccess('Attendance submitted successfully!');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to submit attendance',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Daily Attendance</h1>
      <p className="text-sm text-slate-500 mb-6">Today: {today}</p>

      {isCheckedIn && todayAttendance ? (
        <div className="max-w-md space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-sm font-medium">
            ✓ Already checked in at{' '}
            {new Date(todayAttendance.checkInTime).toLocaleTimeString()}
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 shadow-2xs max-w-xs">
            <img
              src={`${API_URL}${todayAttendance.photoUrl}`}
              alt="Attendance photo"
              className="w-full h-auto object-cover"
            />
          </div>
          {todayAttendance.notes && (
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-200">
              <strong className="text-slate-800">Notes:</strong> {todayAttendance.notes}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-md">
              {success}
            </div>
          )}

          <div>
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Photo *
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              required
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-64 h-64 object-cover rounded-lg border border-slate-200 shadow-2xs"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Working from home, Bandung"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Submit Attendance
          </Button>
        </form>
      )}
    </div>
  );
}
