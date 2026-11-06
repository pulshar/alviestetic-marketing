import React from 'react';
import { Download, Tag } from 'lucide-react';
import { Asset, User } from '../../types';
import { assetService } from '../../services/assetService';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../ui/Modal';

interface AssetLightboxProps {
  asset: Asset | null;
  user: User | null;
  onClose: () => void;
}

export const AssetLightbox: React.FC<AssetLightboxProps> = ({ asset, user, onClose }) => {
  if (!asset) return null;

  const handleDownload = () => {
    assetService.downloadSingleAsset(asset, user);
  };

  return (
    <Modal isOpen={Boolean(asset)} onClose={onClose} maxWidth="5xl">
      <ModalHeader
        icon={
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white">
            {asset.format}
          </span>
        }
        title={asset.title}
        onClose={onClose}
      />

      <ModalContent noPadding>
        {/* Media Player / Image Viewer */}
        <div className="relative bg-slate-950 flex items-center justify-center min-h-[360px] max-h-[520px] overflow-hidden">
          {asset.type === 'video' ? (
            <video
              src={asset.url}
              controls
              autoPlay
              className="max-h-[500px] w-auto max-w-full"
            >
              Tu navegador no soporta la reproducción de este vídeo.
            </video>
          ) : (
            <img
              src={asset.url}
              alt={asset.title}
              className="max-h-[500px] w-auto max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* Asset Technical Details */}
        <div className="p-6 bg-white space-y-4">
          <div>
            <p className="text-sm text-slate-600 leading-relaxed">{asset.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Tipo & Formato</span>
              <span className="font-semibold text-slate-800 uppercase">
                {asset.type === 'video' ? 'Vídeo' : 'Fotografía'} · {asset.format}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Tamaño de archivo</span>
              <span className="font-semibold text-slate-800 font-mono tabular-nums">
                {asset.fileSizeFormatted}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">
                {asset.type === 'video' ? 'Duración' : 'Resolución'}
              </span>
              <span className="font-semibold text-slate-800 font-mono tabular-nums">
                {asset.dimensions || asset.duration || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Fecha de publicación</span>
              <span className="font-semibold text-slate-800 tabular-nums">
                {new Date(asset.publishedAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {asset.tags && asset.tags.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <Tag size={14} className="text-slate-400" />
              <span className="text-xs text-slate-500">Etiquetas:</span>
              <div className="flex flex-wrap gap-1.5">
                {asset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ModalContent>

      <ModalFooter>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Download size={15} />
          Descargar archivo original ({asset.fileSizeFormatted})
        </button>
      </ModalFooter>
    </Modal>
  );
};
