import React from 'react';
import { Bell, RotateCcw, ChevronRight } from 'lucide-react';
import { User } from '../../types';

interface BreadcrumbItem {
  label: string;
  view: string;
  brandId?: string;
  promoId?: string;
}

interface NavbarProps {
  currentUser: User;
  breadcrumbs: BreadcrumbItem[];
  unreadCount: number;
  onNavigate: (view: string, brandId?: string, promoId?: string) => void;
  onResetDemoData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  breadcrumbs,
  unreadCount,
  onNavigate,
  onResetDemoData
}) => {
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-3.5 h-17 w-full">
      <div className="flex items-center gap-4 min-w-0">
        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis" aria-label="Migas de pan">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label + idx}>
                {idx > 0 && <ChevronRight size={14} className="text-slate-400 shrink-0" />}
                {isLast ? (
                  <span className="text-slate-900 font-semibold truncate">{crumb.label}</span>
                ) : (
                  <button
                    onClick={() => onNavigate(crumb.view, crumb.brandId, crumb.promoId)}
                    className="text-slate-500 hover:text-slate-900 transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Factory Reset Demo Button */}
        <button
          onClick={onResetDemoData}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap border bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          title="Restaurar datos iniciales de demostración en localStorage"
        >
          <RotateCcw size={14} />
          <span className="text-xs">Restaurar demo</span>
        </button>

        {/* Notifications Icon */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 bg-transparent border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          onClick={() => onNavigate('updates')}
          title="Centro de Novedades"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[0.65rem] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
