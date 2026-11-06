import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  FolderTree,
  Bell,
  Activity,
  GraduationCap
} from 'lucide-react';
import { User, Brand } from '../../types';
import { Isotype } from '../ui/Isotype';

interface SidebarProps {
  currentUser: User;
  authorizedBrands: Brand[];
  activeView: string;
  activeBrandId?: string;
  isCollapsed: boolean;
  unreadCount: number;
  clientsCount?: number;
  brandsCount?: number;
  coursesCount?: number;
  onNavigate: (view: string, brandId?: string, promoId?: string) => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeView,
  activeBrandId,
  isCollapsed,
  unreadCount,
  onNavigate,
  onToggleCollapse,
  onLogout
}) => {
  const isAdmin = currentUser.role === 'admin';

  return (
    <aside
      className="flex flex-col h-screen bg-slate-900 text-slate-50 border-r border-slate-800 sticky top-0 transition-all duration-200 overflow-y-auto overflow-x-hidden select-none shrink-0"
      style={{ width: isCollapsed ? '4.75rem' : '16.5rem' }}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 min-h-17">
        <div
          className="flex items-center gap-3 text-white cursor-pointer select-none"
          onClick={() => onNavigate('dashboard')}
          role="button"
          tabIndex={0}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[0.95rem] tracking-tight shrink-0" title="Alviestetic">
            <Isotype className="w-4.5 h-4" />
          </div>
          {!isCollapsed && <span className="text-[1.1rem] font-bold tracking-tight text-white whitespace-nowrap">Alviestetic</span>}
        </div>
        <button
          className="bg-transparent border-none text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer p-1.5 rounded-md flex items-center justify-center transition-colors"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expandir menú lateral' : 'Plegar menú lateral'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation depending on role */}
      <div className="p-3 flex flex-col gap-1">
        {isAdmin ? (
          <>
            {!isCollapsed && (
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2 whitespace-nowrap">
                Administración
              </span>
            )}

            <button
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border cursor-pointer border-transparent ${
                activeView === 'admin_dashboard'
                  ? 'text-white bg-slate-800 border-slate-700 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => onNavigate('admin_dashboard')}
              title="Panel de Control"
            >
              <Shield size={18} className="shrink-0" />
              {!isCollapsed && <span>Panel de Control</span>}
            </button>

            <button
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border cursor-pointer border-transparent ${
                activeView === 'admin_clients'
                  ? 'text-white bg-slate-800 border-slate-700 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => onNavigate('admin_clients')}
              title="Gestión de Clientes"
            >
              <Users size={18} className="shrink-0" />
              {!isCollapsed && (
                <span className="truncate">Gestión de Clientes</span>
              )}
            </button>

            <button
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border cursor-pointer border-transparent ${
                activeView === 'admin_brands'
                  ? 'text-white bg-slate-800 border-slate-700 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => onNavigate('admin_brands')}
              title="Marcas & SharePoint"
            >
              <FolderTree size={18} className="shrink-0" />
              {!isCollapsed && (
                <span className="truncate">Marcas & SharePoint</span>
              )}
            </button>

            <button
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border cursor-pointer border-transparent ${
                activeView === 'admin_activity'
                  ? 'text-white bg-slate-800 border-slate-700 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => onNavigate('admin_activity')}
              title="Registro de Auditoría"
            >
              <Activity size={18} className="shrink-0" />
              {!isCollapsed && <span>Registro de Auditoría</span>}
            </button>

            <button
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border cursor-pointer border-transparent ${
                activeView === 'admin_courses'
                  ? 'text-white bg-slate-800 border-slate-700 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => onNavigate('admin_courses')}
              title="Cursos"
            >
              <GraduationCap size={18} className="shrink-0" />
              {!isCollapsed && (
                <span className="truncate">Cursos</span>
              )}
            </button>

            {/* Quick Switch: Client Preview for Admin */}
            <div className="pt-2 border-t border-slate-800/60 mt-2">
              <button
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap border cursor-pointer ${
                  ['dashboard', 'brands', 'brand_detail', 'promotion_detail', 'courses', 'updates'].includes(activeView)
                    ? 'text-blue-300 bg-blue-950/60 border-blue-800/60 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                }`}
                onClick={() => {
                  if (['dashboard', 'brands', 'brand_detail', 'promotion_detail', 'courses', 'updates'].includes(activeView)) {
                    onNavigate('admin_dashboard');
                  } else {
                    onNavigate('dashboard');
                  }
                }}
                title={
                  ['dashboard', 'brands', 'brand_detail', 'promotion_detail', 'courses', 'updates'].includes(activeView)
                    ? 'Volver al Panel de Administración'
                    : 'Ver vista previa del portal de cliente'
                }
              >
                {['dashboard', 'brands', 'brand_detail', 'promotion_detail', 'courses', 'updates'].includes(activeView) ? (
                  <>
                    <Shield size={16} className="shrink-0 text-blue-400" />
                    {!isCollapsed && <span>Volver a Admin</span>}
                  </>
                ) : (
                  <>
                    <Layers size={16} className="shrink-0 text-slate-400" />
                    {!isCollapsed && <span>Vista Previa Cliente</span>}
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border cursor-pointer border-transparent ${
                activeView === 'dashboard'
                  ? 'text-white bg-slate-800 border-slate-700 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => onNavigate('dashboard')}
              title="Inicio"
            >
              <LayoutDashboard size={18} className="shrink-0" />
              {!isCollapsed && <span>Inicio</span>}
            </button>

            <button
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border cursor-pointer border-transparent ${
                activeView === 'brands' && !activeBrandId
                  ? 'text-white bg-slate-800 border-slate-700 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => onNavigate('brands')}
              title="Mis Marcas"
            >
              <Layers size={18} className="shrink-0" />
              {!isCollapsed && <span>Mis Marcas</span>}
            </button>

            <button
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border cursor-pointer border-transparent ${
                activeView === 'courses'
                  ? 'text-white bg-slate-800 border-slate-700 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => onNavigate('courses')}
              title="Cursos"
            >
              <GraduationCap size={18} className="shrink-0" />
              {!isCollapsed && <span>Cursos</span>}
            </button>

            <button
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border cursor-pointer border-transparent ${
                activeView === 'updates'
                  ? 'text-white bg-slate-800 border-slate-700 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => onNavigate('updates')}
              title="Centro de Novedades"
            >
              <Bell size={18} className="shrink-0" />
              {!isCollapsed && <span>Novedades</span>}
              {unreadCount > 0 && (
                <span className="ml-auto text-[0.7rem] font-semibold bg-red-500 text-white px-2 py-0.5 rounded-full tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>
          </>
        )}
      </div>

      {/* User & Settings Footer */}
      <div className="mt-auto p-3 border-t border-slate-800 flex flex-col gap-2">
        <div
          className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/80 text-white cursor-pointer hover:bg-slate-800 transition-colors border border-slate-700/50"
          onClick={() => onNavigate('profile')}
          role="button"
          tabIndex={0}
          title="Mi perfil y configuración"
        >
          <img
            src={
              currentUser.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-600"
          />
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-[0.825rem] font-semibold truncate">{currentUser.name}</div>
              <div className="text-[0.7rem] text-slate-400 truncate">
                {isAdmin ? 'Administrador' : currentUser.company}
              </div>
            </div>
          )}
        </div>

        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border border-transparent"
          onClick={onLogout}
          title="Cerrar sesión"
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};
