import React from 'react';
import { Archive, CheckCircle2, Loader2, X } from 'lucide-react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../ui/Modal';

interface ZipProgressModalProps {
  isOpen: boolean;
  progressPercent: number;
  currentStatus: string;
  totalFiles: number;
  onClose: () => void;
}

export const ZipProgressModal: React.FC<ZipProgressModalProps> = ({
  isOpen,
  progressPercent,
  currentStatus,
  totalFiles,
  onClose
}) => {
  if (!isOpen) return null;

  const isComplete = progressPercent >= 100;

  return (
    <Modal isOpen={isOpen} onClose={isComplete ? onClose : () => {}} maxWidth="md">
      <ModalHeader
        icon={<Archive size={18} className="text-blue-600" />}
        title={isComplete ? 'Descarga preparada' : 'Generando paquete ZIP...'}
        onClose={isComplete ? onClose : undefined}
      />

      <ModalContent>
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              {isComplete ? 'Archivos comprimidos con éxito' : `Empaquetando ${totalFiles} recursos`}
            </span>
            <span className="font-mono font-bold text-blue-600 tabular-nums">
              {progressPercent}%
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 rounded-full ${
                isComplete ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            {isComplete ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <Loader2 size={16} className="animate-spin text-blue-600 shrink-0" />
            )}
            <span className="truncate">{currentStatus}</span>
          </div>

          {isComplete && (
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              El archivo comprimido <strong>.zip</strong> se ha guardado en tu carpeta de descargas con su índice y metadatos correspondientes.
            </p>
          )}
        </div>
      </ModalContent>

      {isComplete && (
        <ModalFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Aceptar
          </button>
        </ModalFooter>
      )}
    </Modal>
  );
};
