import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...rest
}: Props) {
  const baseClasses =
    'inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 focus:ring-slate-400',
    danger:
      'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
