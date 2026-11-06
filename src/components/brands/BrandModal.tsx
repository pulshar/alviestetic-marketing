import React, { useState, useEffect } from 'react';
import { HardDrive, Layers } from 'lucide-react';
import { Brand } from '../../types';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../ui/Modal';

interface BrandModalProps {
  isOpen: boolean;
  editingBrand: Brand | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    slug: string;
    category: string;
    description: string;
    logoUrl: string;
    coverImageUrl: string;
    sharepointFolderUrl: string;
    sharepointDriveId: string;
    sharepointFolderPath: string;
  }) => void;
}

export const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  editingBrand,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [sharepointFolderUrl, setSharepointFolderUrl] = useState('');
  const [sharepointDriveId, setSharepointDriveId] = useState('');
  const [sharepointFolderPath, setSharepointFolderPath] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingBrand) {
      setName(editingBrand.name);
      setSlug(editingBrand.slug);
      setCategory(editingBrand.category);
      setDescription(editingBrand.description);
      setCoverImageUrl(editingBrand.coverImageUrl);
      setSharepointFolderUrl(editingBrand.sharepointFolderUrl || '');
      setSharepointDriveId(editingBrand.sharepointDriveId || '');
      setSharepointFolderPath(editingBrand.sharepointFolderPath || '');
    } else {
      setName('');
      setSlug('');
      setCategory('');
      setDescription('');
      setCoverImageUrl('/src/assets/images/campaign_editorial_showcase_1793627090866.jpg');
      setSharepointFolderUrl('');
      setSharepointDriveId('');
      setSharepointFolderPath('');
    }
    setError(null);
  }, [editingBrand, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor indica el nombre de la marca.');
      return;
    }
    if (!category.trim()) {
      setError('Por favor indica el sector o categoría de la marca.');
      return;
    }

    const calculatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    onSave({
      name: name.trim(),
      slug: calculatedSlug,
      category: category.trim(),
      description: description.trim(),
      logoUrl: coverImageUrl,
      coverImageUrl,
      sharepointFolderUrl: sharepointFolderUrl.trim(),
      sharepointDriveId: sharepointDriveId.trim(),
      sharepointFolderPath: sharepointFolderPath.trim()
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <ModalHeader
        icon={<Layers size={18} className="text-blue-600" />}
        title={editingBrand ? `Editar Marca: ${editingBrand.name}` : 'Crear Nueva Marca'}
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <ModalContent>
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de Marca
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. LUMEN LABS"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoría / Sector
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ej. Dermocosmética"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción comercial
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve reseña del posicionamiento y catálogo de la marca..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Imagen de Portada / Logo URL
              </label>
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="/src/assets/images/... o URL"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            {/* SharePoint Online Integration Readiness Section */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <HardDrive size={15} className="text-blue-600" />
                <span>Configuración de SharePoint Online (Microsoft Graph)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Campos preparados para la futura sincronización automática de archivos y detección por Power Automate:
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  URL de la Carpeta en SharePoint Online
                </label>
                <input
                  type="text"
                  value={sharepointFolderUrl}
                  onChange={(e) => setSharepointFolderUrl(e.target.value)}
                  placeholder="https://empresa.sharepoint.com/sites/Marketing/Marcas/..."
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Ruta relativa SharePoint
                  </label>
                  <input
                    type="text"
                    value={sharepointFolderPath}
                    onChange={(e) => setSharepointFolderPath(e.target.value)}
                    placeholder="/General/Campanas/2026/..."
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Graph Drive ID (Opcional)
                  </label>
                  <input
                    type="text"
                    value={sharepointDriveId}
                    onChange={(e) => setSharepointDriveId(e.target.value)}
                    placeholder="b!..."
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
          >
            {editingBrand ? 'Guardar Marca' : 'Crear Marca'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
