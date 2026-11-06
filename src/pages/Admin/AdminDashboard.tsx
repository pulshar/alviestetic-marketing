import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Power,
  HardDrive,
  Activity,
  CheckCircle,
  DownloadCloud,
  GraduationCap,
  RefreshCw,
  ExternalLink,
  Globe,
  CheckCircle2,
  AlertCircle,
  Shield,
  FolderTree
} from 'lucide-react';
import { User, Brand, Promotion, ActivityLog, ClientStatus, Course, TutorLmsConfig } from '../../types';
import { clientService, CreateClientDTO } from '../../services/clientService';
import { brandService } from '../../services/brandService';
import { storageService } from '../../services/storageService';
import { courseService } from '../../services/courseService';
import { ClientModal } from '../../components/clients/ClientModal';
import { BrandModal } from '../../components/brands/BrandModal';

interface AdminDashboardProps {
  currentUser: User;
  clients: User[];
  brands: Brand[];
  promotions: Promotion[];
  activityLogs: ActivityLog[];
  activeSubTab?: 'overview' | 'clients' | 'brands' | 'activity' | 'courses';
  onTabChange?: (tab: 'overview' | 'clients' | 'brands' | 'activity' | 'courses') => void;
  onRefreshData: () => void;
  onNavigateToBrand: (brandId: string) => void;
  onNavigateToBrandsCatalog?: () => void;
  onNavigateToCourses?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  clients,
  brands,
  promotions,
  activityLogs,
  activeSubTab = 'overview',
  onTabChange,
  onRefreshData,
  onNavigateToBrand,
  onNavigateToBrandsCatalog,
  onNavigateToCourses
}) => {
  const [currentTab, setCurrentTab] = useState<'overview' | 'clients' | 'brands' | 'activity' | 'courses'>(activeSubTab);

  // Sync internal tab state if activeSubTab prop changes (e.g. from sidebar clicks)
  useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleTabChange = (tab: 'overview' | 'clients' | 'brands' | 'activity' | 'courses') => {
    setCurrentTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  const [clientSearch, setClientSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ClientStatus>('all');

  // Courses & Tutor LMS State
  const [tutorConfig, setTutorConfig] = useState<TutorLmsConfig>(() => storageService.getTutorConfig());
  const [coursesList, setCoursesList] = useState<Course[]>(() => storageService.getCourses());
  const [isTestingEndpoint, setIsTestingEndpoint] = useState(false);
  const [endpointTestResult, setEndpointTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Client modal state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<User | null>(null);

  // Brand modal state
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Calculations
  const activeClientsCount = clients.filter((c) => c.status === 'active').length;

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.company.toLowerCase().includes(clientSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Client Actions
  const handleOpenCreateClient = () => {
    setEditingClient(null);
    setIsClientModalOpen(true);
  };

  const handleOpenEditClient = (client: User) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };

  const handleSaveClient = (data: CreateClientDTO) => {
    if (editingClient) {
      clientService.updateClient(editingClient.id, data, currentUser);
    } else {
      clientService.createClient(data, currentUser);
    }
    onRefreshData();
  };

  const handleToggleStatus = (clientId: string) => {
    clientService.toggleClientStatus(clientId, currentUser);
    onRefreshData();
  };

  const handleDeleteClient = (clientId: string, clientName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el cliente de prueba "${clientName}"?`)) {
      clientService.deleteClient(clientId, currentUser);
      onRefreshData();
    }
  };

  // Brand Actions
  const handleOpenCreateBrand = () => {
    setEditingBrand(null);
    setIsBrandModalOpen(true);
  };

  const handleOpenEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = (data: any) => {
    if (editingBrand) {
      brandService.updateBrand(editingBrand.id, data);
    } else {
      brandService.createBrand(data);
    }
    onRefreshData();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Title & Sub navigation tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Panel de Gestión y Control Corporativo
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervisa los accesos, audita la distribución de activos y vincula tus bibliotecas de SharePoint Online.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentTab === 'clients' && (
            <button
              onClick={handleOpenCreateClient}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={15} />
              Nuevo Cliente
            </button>
          )}
          {currentTab === 'brands' && (
            <button
              onClick={handleOpenCreateBrand}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={15} />
              Nueva Marca
            </button>
          )}
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Total Clientes</span>
          <span className="text-3xl font-extrabold text-slate-900 tabular-nums leading-none">{clients.length}</span>
          <span className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <CheckCircle size={13} /> {activeClientsCount} activos con acceso
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Marcas en Catálogo</span>
          <span className="text-3xl font-extrabold text-slate-900 tabular-nums leading-none">{brands.length}</span>
          <span className="text-xs text-slate-500 mt-2 font-mono">
            {promotions.length} campañas activas
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Promociones Totales</span>
          <span className="text-3xl font-extrabold text-slate-900 tabular-nums leading-none">{promotions.length}</span>
          <span className="text-xs text-slate-500 mt-2 font-mono">
            Carpetas SharePoint listas
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Actividad Registrada</span>
          <span className="text-3xl font-extrabold text-slate-900 tabular-nums leading-none">{activityLogs.length}</span>
          <span className="text-xs text-slate-500 mt-2 font-mono">
            Descargas & accesos
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange('overview')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer transition-colors whitespace-nowrap ${currentTab === 'overview'
            ? 'bg-slate-900 text-white font-bold'
            : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <Shield size={15} />
          <span>Panel de Control</span>
        </button>
        <button
          onClick={() => handleTabChange('clients')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer transition-colors whitespace-nowrap ${currentTab === 'clients'
            ? 'bg-slate-900 text-white font-bold'
            : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <Users size={15} />
          <span>Gestión de Clientes ({clients.length})</span>
        </button>
        <button
          onClick={() => handleTabChange('brands')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer transition-colors whitespace-nowrap ${currentTab === 'brands'
            ? 'bg-slate-900 text-white font-bold'
            : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <FolderTree size={15} />
          <span>Marcas & SharePoint ({brands.length})</span>
        </button>
        <button
          onClick={() => handleTabChange('activity')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer transition-colors whitespace-nowrap ${currentTab === 'activity'
            ? 'bg-slate-900 text-white font-bold'
            : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <Activity size={15} />
          <span>Registro de Auditoría</span>
        </button>
        <button
          onClick={() => handleTabChange('courses')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer transition-colors whitespace-nowrap ${currentTab === 'courses'
            ? 'bg-slate-900 text-white font-bold'
            : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <GraduationCap size={15} />
          <span>Cursos ({coursesList.length})</span>
        </button>
      </div>

      {/* VIEW: OVERVIEW */}
      {currentTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Client list preview */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Clientes Recientes</h3>
              <button
                onClick={() => handleTabChange('clients')}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Ver todos
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {clients.slice(0, 4).map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{c.name}</span>
                    <span className="text-[11px] text-slate-500">{c.email} · {c.company}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold inline-block ${c.status === 'active'
                      ? 'text-emerald-700 bg-emerald-100'
                      : c.status === 'invited'
                        ? 'text-amber-700 bg-amber-100'
                        : 'text-rose-700 bg-rose-100'
                      }`}
                  >
                    {c.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SharePoint Sync Readiness Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HardDrive size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Integración SharePoint Online & Power Automate
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                La arquitectura del portal está preparada para enlazarse con Microsoft Graph API y flujos de Power Automate. Cuando se publiquen nuevos lotes en las carpetas de SharePoint, el sistema notificará automáticamente a los clientes con permisos para dicha marca.
              </p>

              <div className="space-y-2 font-mono text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                {brands.map((b) => (
                  <div key={b.id} className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{b.name}:</span>
                    <span className="truncate ml-2 text-slate-500">{b.sharepointFolderPath}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Estado: Simulación de permisos activa (Capa de servicios desacoplada para producción).
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CLIENTS MANAGEMENT TABLE */}
      {currentTab === 'clients' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Table Toolbar */}
          <div className="p-4 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Buscar cliente por nombre, email o empresa..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Estado:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none font-medium text-slate-700"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="invited">Invitado</option>
              </select>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 whitespace-nowrap">Cliente</th>
                  <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 whitespace-nowrap">Empresa</th>
                  <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 whitespace-nowrap">Marcas Asignadas</th>
                  <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 whitespace-nowrap">Estado</th>
                  <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 whitespace-nowrap">Fecha de Alta</th>
                  <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 whitespace-nowrap text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => {
                  const assignedBrands = brands.filter((b) =>
                    client.assignedBrandIds.includes(b.id)
                  );
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 border-b border-slate-100 align-middle">
                        <div className="font-bold text-slate-900">{client.name}</div>
                        <div className="text-xs text-slate-500">{client.email}</div>
                      </td>
                      <td className="py-4 px-6 border-b border-slate-100 align-middle">
                        <span className="text-xs text-slate-700 font-medium">
                          {client.company}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b border-slate-100 align-middle">
                        <div className="flex flex-wrap gap-1.5">
                          {assignedBrands.map((b) => (
                            <span key={b.id} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              {b.name}
                            </span>
                          ))}
                          {assignedBrands.length === 0 && (
                            <span className="text-xs text-slate-400 italic">Sin marcas</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-slate-100 align-middle">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold inline-block ${client.status === 'active'
                            ? 'text-emerald-700 bg-emerald-100'
                            : client.status === 'invited'
                              ? 'text-amber-700 bg-amber-100'
                              : 'text-rose-700 bg-rose-100'
                            }`}
                        >
                          {client.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b border-slate-100 align-middle">
                        <span className="text-xs text-slate-500 font-mono tabular-nums">
                          {new Date(client.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b border-slate-100 align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(client.id)}
                            className="bg-transparent border border-slate-200 px-2.5 py-1.5 rounded-md text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                            title={
                              client.status === 'active'
                                ? 'Desactivar acceso'
                                : 'Activar acceso'
                            }
                          >
                            <Power size={13} />
                            <span className="hidden sm:inline">
                              {client.status === 'active' ? 'Desactivar' : 'Activar'}
                            </span>
                          </button>

                          <button
                            onClick={() => handleOpenEditClient(client)}
                            className="bg-transparent border border-slate-200 px-2.5 py-1.5 rounded-md text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                            title="Editar datos y marcas"
                          >
                            <Edit2 size={13} />
                            <span className="hidden sm:inline">Editar</span>
                          </button>

                          <button
                            onClick={() => handleDeleteClient(client.id, client.name)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Eliminar cliente de prueba"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No se han encontrado clientes que coincidan con la búsqueda.
            </div>
          )}
        </div>
      )}

      {/* VIEW: BRANDS MANAGEMENT */}
      {currentTab === 'brands' && (
        <div className="space-y-4">
          {onNavigateToBrandsCatalog && (
            <div className="flex justify-end">
              <button
                onClick={onNavigateToBrandsCatalog}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Ver catálogo de marcas como cliente</span>
                <ExternalLink size={12} />
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {brands.map((brand) => {
              const brandPromos = promotions.filter((p) => p.brandId === brand.id);
              const clientsWithAccess = clients.filter((c) =>
                c.assignedBrandIds.includes(brand.id)
              );

              return (
                <div
                  key={brand.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-xs"
                >
                  <div className="h-32 bg-slate-900 relative">
                    <img
                      src={brand.coverImageUrl}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {brandPromos.length} Promociones
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                      {brand.category}
                    </span> */}
                    <h3 className="text-base font-bold text-slate-900 mb-1">{brand.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {brand.description}
                    </p>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1 mb-3 font-mono">
                      <div className="text-slate-500">SharePoint Folder:</div>
                      <div className="text-slate-800 font-bold truncate">
                        {brand.sharepointFolderPath}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 mb-4">
                      {clientsWithAccess.length} clientes autorizados
                    </div>

                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleOpenEditBrand(brand)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 size={12} /> Editar marca & SP
                      </button>

                      <button
                        onClick={() => onNavigateToBrand(brand.id)}
                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Ver promociones →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: ACTIVITY LOGS */}
      {currentTab === 'activity' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Auditoría de Descargas y Acciones
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {activityLogs.length} eventos registrados
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    {log.action.includes('download') ? (
                      <DownloadCloud size={15} className="text-blue-600" />
                    ) : (
                      <Activity size={15} className="text-slate-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 mr-2">{log.userName}</span>
                    <span className="text-slate-600">{log.description}</span>
                  </div>
                </div>

                <div className="text-slate-400 font-mono text-[11px] shrink-0 ml-4">
                  {new Date(log.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}{' '}
                  · {new Date(log.timestamp).toLocaleDateString('es-ES')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: COURSES & TUTOR LMS */}
      {currentTab === 'courses' && (
        <div className="space-y-6">
          {/* Integration Configuration Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Integración WordPress · Tutor LMS REST API
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sincronización automática de cursos (online y presenciales) al iniciar sesión el cliente.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    setIsTestingEndpoint(true);
                    setEndpointTestResult(null);
                    const res = await courseService.testEndpoint(tutorConfig.baseUrl, tutorConfig.coursesEndpoint);
                    setIsTestingEndpoint(false);
                    setEndpointTestResult(res);
                  }}
                  disabled={isTestingEndpoint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Globe size={14} />
                  <span>{isTestingEndpoint ? 'Comprobando...' : 'Comprobar Conexión'}</span>
                </button>

                <button
                  onClick={async () => {
                    setIsTestingEndpoint(true);
                    await courseService.syncCoursesOnLogin(currentUser);
                    setIsTestingEndpoint(false);
                    setCoursesList(storageService.getCourses());
                    setTutorConfig(storageService.getTutorConfig());
                    onRefreshData();
                  }}
                  disabled={isTestingEndpoint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={isTestingEndpoint ? 'animate-spin' : ''} />
                  <span>Sincronizar Cursos Ahora</span>
                </button>

                <button
                  onClick={() => {
                    courseService.simulateNewWordPressCourse();
                    setCoursesList(storageService.getCourses());
                    onRefreshData();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-colors shadow-xs cursor-pointer"
                  title="Simula la publicación de un nuevo curso en WordPress y dispara una notificación real al cliente"
                >
                  <Plus size={14} />
                  <span>Simular Nuevo Curso en WP</span>
                </button>
              </div>
            </div>

            {/* Test result message */}
            {endpointTestResult && (
              <div
                className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${endpointTestResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
              >
                {endpointTestResult.success ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold">
                    {endpointTestResult.success ? 'Conexión verificada:' : 'Aviso de conexión:'}{' '}
                  </span>
                  <span>{endpointTestResult.message}</span>
                </div>
              </div>
            )}

          </div>

          {/* Courses Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Cursos Sincronizados en Plataforma ({coursesList.length})
              </h3>
              <div className="flex items-center gap-3">
                {onNavigateToCourses && (
                  <button
                    onClick={onNavigateToCourses}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver catálogo como cliente</span>
                    <ExternalLink size={12} />
                  </button>
                )}
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">
                  Online & Presenciales
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Curso</th>
                    <th className="py-3 px-4">Modalidad</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Docente</th>
                    <th className="py-3 px-4">Precio</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coursesList.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.coverImageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block line-clamp-1">
                              {course.title}
                            </span>
                            <span className="text-[11px] text-slate-500 line-clamp-1">
                              {course.location || 'Campus Virtual Alviestetic'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${course.type === 'presencial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {course.type === 'presencial' ? 'Presencial' : 'Online'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
                          {course.categoryName || 'General'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {course.instructor.name}
                      </td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">
                        {course.price}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={course.enrollUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <span>Ver en web</span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ClientModal
        isOpen={isClientModalOpen}
        editingClient={editingClient}
        availableBrands={brands}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveClient}
      />

      <BrandModal
        isOpen={isBrandModalOpen}
        editingBrand={editingBrand}
        onClose={() => setIsBrandModalOpen(false)}
        onSave={handleSaveBrand}
      />
    </div>
  );
};
