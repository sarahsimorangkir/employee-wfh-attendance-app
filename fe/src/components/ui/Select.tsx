import { SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({ label, options, error, id, ...rest }: Props) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="mb-4">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full px-3 py-2 border rounded-md text-sm bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
        {...rest}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
    </div>
  );
}
