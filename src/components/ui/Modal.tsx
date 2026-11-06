import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl';
  children: React.ReactNode;
  className?: string;
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen = true,
  onClose,
  maxWidth = 'lg',
  children,
  className = ''
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-h-[90vh] flex flex-col overflow-hidden relative ${maxWidthMap[maxWidth]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const ModalHeader: React.FC<{
  title?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}> = ({ title, icon, onClose, children, className = '' }) => {
  return (
    <div className={`px-6 py-4.5 border-b border-slate-200 flex items-center justify-between ${className}`}>
      {children ? (
        children
      ) : (
        <>
          <div className="flex items-center gap-2.5">
            {icon}
            {title && (
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {title}
              </h3>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Cerrar modal"
            >
              <X size={18} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export const ModalContent: React.FC<{
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`overflow-y-auto flex-1 ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};

export const ModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 ${className}`}
    >
      {children}
    </div>
  );
};
