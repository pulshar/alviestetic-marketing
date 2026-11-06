import React, { useState } from 'react';
import { Bell, CheckCheck, ArrowRight, Check } from 'lucide-react';
import { PortalUpdate, Brand, Promotion, User } from '../../types';

interface UpdatesCenterProps {
  currentUser: User;
  updates: PortalUpdate[];
  brands: Brand[];
  promotions: Promotion[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigateToPromotion: (brandId?: string, promoId?: string) => void;
  onNavigateToCourse?: (courseId?: string) => void;
}

export const UpdatesCenter: React.FC<UpdatesCenterProps> = ({
  currentUser,
  updates,
  brands,
  promotions,
  onMarkRead,
  onMarkAllRead,
  onNavigateToPromotion,
  onNavigateToCourse
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'promotions' | 'courses'>('all');

  const filteredUpdates = updates.filter((u) => {
    if (selectedCategoryFilter === 'all') return true;
    if (selectedCategoryFilter === 'courses') return u.category === 'course';
    if (selectedCategoryFilter === 'promotions') return u.category !== 'course';
    return true;
  });

  const unreadTotal = updates.filter((u) => !u.readByUserIds.includes(currentUser.id)).length;
  const coursesUpdatesCount = updates.filter(u => u.category === 'course').length;
  const promoUpdatesCount = updates.filter(u => u.category !== 'course').length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Centro de Novedades y Formación</h1>
          <p className="text-sm text-slate-500">
            Mantente al día con las nuevas campañas, lanzamientos de productos y nuevos cursos incorporados a la Academia Alviestetic.
          </p>
        </div>

        {unreadTotal > 0 && (
          <button
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 self-start sm:self-auto cursor-pointer"
          >
            <CheckCheck size={16} className="text-blue-600" />
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Filter by Category */}
      <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-500 mr-2 shrink-0">
          Tipo de novedad:
        </span>
        <button
          onClick={() => setSelectedCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border border-transparent cursor-pointer whitespace-nowrap transition-colors ${
            selectedCategoryFilter === 'all'
              ? 'bg-slate-900 text-white font-semibold'
              : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Todas las novedades ({updates.length})
        </button>
        <button
          onClick={() => setSelectedCategoryFilter('courses')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border border-transparent cursor-pointer whitespace-nowrap transition-colors ${
            selectedCategoryFilter === 'courses'
              ? 'bg-slate-900 text-white font-semibold'
              : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Cursos Academia ({coursesUpdatesCount})
        </button>
        <button
          onClick={() => setSelectedCategoryFilter('promotions')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border border-transparent cursor-pointer whitespace-nowrap transition-colors ${
            selectedCategoryFilter === 'promotions'
              ? 'bg-slate-900 text-white font-semibold'
              : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Campañas & Marcas ({promoUpdatesCount})
        </button>
      </div>

      {/* Updates List */}
      <div className="flex flex-col gap-4">
        {filteredUpdates.map((update) => {
          const isUnread = !update.readByUserIds.includes(currentUser.id);
          const isCourse = update.category === 'course';
          const brand = update.brandId ? brands.find((b) => b.id === update.brandId) : null;
          const promo = update.promotionId ? promotions.find((p) => p.id === update.promotionId) : null;

          return (
            <article
              key={update.id}
              className={`rounded-xl border p-6 flex flex-col gap-3 transition-colors relative ${
                isUnread
                  ? 'border-blue-200 bg-sky-50/30'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {isUnread && (
                <div className="absolute top-5 right-5 flex items-center gap-1.5 text-[0.7rem] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  <span className={`w-1.5 h-1.5 rounded-full ${isCourse ? 'bg-amber-500' : 'bg-blue-600'}`} />
                  {isCourse ? 'Nuevo curso disponible' : 'Nueva publicación'}
                </div>
              )}

              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {isCourse ? (
                  <span className="font-semibold text-blue-700">Academia Alviestetic · Tutor LMS</span>
                ) : (
                  `${brand?.name || 'Marca Oficial'} · ${promo?.season || 'Campaña'}`
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">{update.title}</h3>

              <p className="text-sm text-slate-600 leading-relaxed">{update.description}</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="font-mono tabular-nums">
                    {new Date(update.publishedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-slate-700 font-mono">
                    {isCourse ? 'Formación médica' : `+${update.newAssetsCount || 1} archivos nuevos`}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {isUnread && (
                    <button
                      onClick={() => onMarkRead(update.id)}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={13} />
                      Marcar leída
                    </button>
                  )}

                  {isCourse ? (
                    <button
                      onClick={() => {
                        onMarkRead(update.id);
                        if (onNavigateToCourse) {
                          onNavigateToCourse(update.courseId);
                        } else {
                          onNavigateToPromotion();
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
                    >
                      <span>Ver curso</span>
                      <ArrowRight size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateToPromotion(update.brandId, update.promotionId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                    >
                      <span>Ir a la promoción</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredUpdates.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl text-slate-500">
          <Bell size={32} className="mx-auto text-slate-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No hay novedades disponibles</h3>
          <p className="text-xs text-slate-500 mt-1">
            No se han registrado publicaciones recientes para el filtro seleccionado.
          </p>
        </div>
      )}
    </div>
  );
};
