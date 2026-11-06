import React, { useState, useEffect } from 'react';
import { UserPlus, Building2, Mail, User } from 'lucide-react';
import { User as UserType, Brand, ClientStatus } from '../../types';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../ui/Modal';

interface ClientModalProps {
  isOpen: boolean;
  editingClient: UserType | null;
  availableBrands: Brand[];
  onClose: () => void;
  onSave: (data: {
    name: string;
    email: string;
    company: string;
    assignedBrandIds: string[];
    status: ClientStatus;
  }) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  editingClient,
  availableBrands,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<ClientStatus>('active');
  const [assignedBrandIds, setAssignedBrandIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name);
      setEmail(editingClient.email);
      setCompany(editingClient.company);
      setStatus(editingClient.status);
      setAssignedBrandIds(editingClient.assignedBrandIds);
    } else {
      setName('');
      setEmail('');
      setCompany('');
      setStatus('active');
      setAssignedBrandIds(availableBrands.length > 0 ? [availableBrands[0].id] : []);
    }
    setError(null);
  }, [editingClient, isOpen, availableBrands]);

  if (!isOpen) return null;

  const handleBrandToggle = (brandId: string) => {
    if (assignedBrandIds.includes(brandId)) {
      setAssignedBrandIds(assignedBrandIds.filter(id => id !== brandId));
    } else {
      setAssignedBrandIds([...assignedBrandIds, brandId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor indica el nombre completo del cliente.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor introduce un correo electrónico válido.');
      return;
    }
    if (!company.trim()) {
      setError('Por favor indica la empresa o entidad asociada.');
      return;
    }

    onSave({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
      assignedBrandIds,
      status
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <ModalHeader
        icon={<UserPlus size={18} className="text-blue-600" />}
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente Autorizado'}
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre completo
              </label>
              <div className="relative flex items-center">
                <User size={15} className="absolute left-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Laura Martín"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo electrónico (Login)
              </label>
              <div className="relative flex items-center">
                <Mail size={15} className="absolute left-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@cliente.es"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Empresa / Distribuidora
              </label>
              <div className="relative flex items-center">
                <Building2 size={15} className="absolute left-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ej. Distribuciones Martín & Co."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estado de la cuenta
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ClientStatus)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
              >
                <option value="active">Activo (acceso inmediato concedido)</option>
                <option value="inactive">Inactivo (acceso revocado)</option>
                <option value="invited">Invitado (pendiente de primer acceso)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marcas asignadas (Control de visibilidad)
              </label>
              <p className="text-xs text-slate-500 mb-2">
                El cliente solo podrá ver y descargar las campañas de las marcas seleccionadas:
              </p>
              <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-48 overflow-y-auto">
                {availableBrands.map((brand) => {
                  const isChecked = assignedBrandIds.includes(brand.id);
                  return (
                    <label
                      key={brand.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        isChecked ? 'bg-blue-50/80 border border-blue-200' : 'bg-white border border-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleBrandToggle(brand.id)}
                        className="w-4 h-4 text-blue-600 rounded accent-blue-600"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {brand.name}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {brand.category}
                        </span>
                      </div>
                    </label>
                  );
                })}
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
            {editingClient ? 'Guardar Cambios' : 'Crear Cliente'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
