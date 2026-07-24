import { InputHTMLAttributes, useState } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextInput({ label, error, id, type, ...rest }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const isPassword = type === 'password';

  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label}
      </label>
      <input
        id={inputId}
        type={currentType}
        className={`w-full px-3 py-2 border rounded-md text-sm bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
        {...rest}
      />
      {isPassword && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id={`${inputId}-show-checkbox`}
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <label
            htmlFor={`${inputId}-show-checkbox`}
            className="text-xs text-slate-600 cursor-pointer select-none"
          >
            Show password
          </label>
        </div>
      )}
      {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
    </div>
  );
}
