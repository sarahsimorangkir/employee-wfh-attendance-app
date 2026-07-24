import { useEffect } from 'react';
import { Button } from './Button';

interface Props {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
}

export function Modal({
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  isLoading = false,
}: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none cursor-pointer"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="px-6 py-4 text-slate-700 text-sm">{children}</div>
        {onConfirm && (
          <div className="flex items-center justify-end gap-3 px-6 py-3 bg-slate-50 border-t border-slate-200">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
