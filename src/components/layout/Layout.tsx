import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Layers,
  Bell,
  User as UserIcon,
  LogOut,
  RotateCcw,
  GraduationCap
} from 'lucide-react';
import { User, Brand } from '../../types';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Isotype } from '../ui/Isotype';

interface BreadcrumbItem {
  label: string;
  view: string;
  brandId?: string;
  promoId?: string;
}

interface LayoutProps {
  currentUser: User;
  authorizedBrands: Brand[];
  activeView: string;
  activeBrandId?: string;
  breadcrumbs: BreadcrumbItem[];
  unreadCount: number;
  clientsCount?: number;
  brandsCount?: number;
  coursesCount?: number;
  onNavigate: (view: string, brandId?: string, promoId?: string) => void;
  onSwitchDemoUser?: (userId: string) => void;
  onResetDemoData: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentUser,
  authorizedBrands,
  activeView,
  activeBrandId,
  breadcrumbs,
  unreadCount,
  clientsCount,
  brandsCount,
  coursesCount,
  onNavigate,
  onResetDemoData,
  onLogout,
  children
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isClient = currentUser.role === 'client';

  // Close user dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleToggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  const handleMobileNavigate = (view: string, brandId?: string, promoId?: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(view, brandId, promoId);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* ======================================================== */}
      {/* 1. DESKTOP SIDEBAR (Visible on >=768px for ALL users)     */}
      {/* ======================================================== */}
      <div className="hidden md:block shrink-0 z-40 transition-all duration-200">
        <Sidebar
          currentUser={currentUser}
          authorizedBrands={authorizedBrands}
          activeView={activeView}
          activeBrandId={activeBrandId}
          isCollapsed={isCollapsed}
          unreadCount={unreadCount}
          clientsCount={clientsCount}
          brandsCount={brandsCount}
          coursesCount={coursesCount}
          onNavigate={onNavigate}
          onToggleCollapse={handleToggleCollapse}
          onLogout={onLogout}
        />
      </div>

      {/* ======================================================== */}
      {/* 2. ADMIN MOBILE DRAWER (Only on mobile for Admin)        */}
      {/* ======================================================== */}
      {!isClient && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-72 h-full bg-slate-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              currentUser={currentUser}
              authorizedBrands={authorizedBrands}
              activeView={activeView}
              activeBrandId={activeBrandId}
              isCollapsed={false}
              unreadCount={unreadCount}
              clientsCount={clientsCount}
              brandsCount={brandsCount}
              coursesCount={coursesCount}
              onNavigate={handleMobileNavigate}
              onToggleCollapse={() => setIsMobileMenuOpen(false)}
              onLogout={onLogout}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CLIENT MOBILE TOP BAR (Strictly mobile <768px only)   */}
      {/* ======================================================== */}
      {isClient && (
        <header className="md:hidden fixed top-0 left-0 right-0 h-15 bg-white/97 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 z-40">
          {/* Brand mark on the left */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0"
            title="Ir al inicio de Alviestetic"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-extrabold text-[0.95rem] tracking-tight">
              <Isotype className="w-4.5 h-4" />
            </div>
            <span className="text-[1.1rem] font-extrabold tracking-tight text-slate-900">Alviestetic</span>
          </button>

          {/* Adapted User & Notifications Action Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => onNavigate('updates')}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                aria-label="Notificaciones"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Profile Button with Dropdown Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                aria-label="Menú de usuario"
                aria-expanded={isUserMenuOpen}
              >
                <img
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                  src={
                    currentUser.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                  }
                />
                <span className="hidden sm:inline text-xs font-medium text-slate-700 max-w-[120px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* User info header */}
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mb-1.5">
                      {currentUser.company}
                    </div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white">
                      {currentUser.role === 'admin' ? 'Administrador' : 'Cliente Autorizado'}
                    </span>
                  </div>

                  {/* Navigation & actions */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon size={14} className="text-slate-400" />
                      <span>Mi perfil y ajustes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onResetDemoData();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <RotateCcw size={14} className="text-slate-400" />
                      <span>Restaurar datos demo</span>
                    </button>
                  </div>

                  {/* Logout item */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* ======================================================== */}
      {/* 4. MAIN CONTENT VIEWPORT                                 */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Desktop Topbar: Always visible on desktop for ALL users  */}
        <div className={`sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 ${isClient ? 'hidden md:block' : 'block'}`}>
          <Navbar
            currentUser={currentUser}
            breadcrumbs={breadcrumbs}
            unreadCount={unreadCount}
            onNavigate={onNavigate}
            onResetDemoData={onResetDemoData}
          />
        </div>

        {/* Page Body: normal padding on desktop, client mobile padding on <=767px */}
        <main
          className={`flex-1 px-4 py-5 md:px-10 md:py-8 max-w-[1400px] w-full mx-auto ${
            isClient ? 'pt-18 pb-22 md:pt-8 md:pb-8' : ''
          }`}
        >
          {children}
        </main>
      </div>

      {/* ======================================================== */}
      {/* 5. CLIENT MOBILE BOTTOM NAV (Strictly mobile <768px only)*/}
      {/* ======================================================== */}
      {isClient && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 h-15 bg-white/98 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0)] z-40 shadow-[0_-4px_14px_rgba(15,23,42,0.04)]"
          aria-label="Navegación principal de la app"
        >
          {/* Tab 1: Inicio */}
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 min-h-[3.25rem] bg-transparent border-none cursor-pointer text-[0.7rem] font-medium transition-colors relative ${
              activeView === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Inicio</span>
          </button>

          {/* Tab 2: Marcas */}
          <button
            onClick={() => onNavigate('brands')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 min-h-[3.25rem] bg-transparent border-none cursor-pointer text-[0.7rem] font-medium transition-colors relative ${
              activeView === 'brands' ||
              activeView === 'brand_detail' ||
              activeView === 'promotion_detail'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers size={20} />
            <span>Marcas</span>
          </button>

          {/* Tab 3: Cursos */}
          <button
            onClick={() => onNavigate('courses')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 min-h-[3.25rem] bg-transparent border-none cursor-pointer text-[0.7rem] font-medium transition-colors relative ${
              activeView === 'courses' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap size={20} />
            <span>Cursos</span>
          </button>

          {/* Tab 4: Novedades */}
          <button
            onClick={() => onNavigate('updates')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 min-h-[3.25rem] bg-transparent border-none cursor-pointer text-[0.7rem] font-medium transition-colors relative ${
              activeView === 'updates' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell size={20} />
            <span>Novedades</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-[calc(50%-18px)] bg-red-500 text-white text-[0.65rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>
      )}
    </div>
  );
};
