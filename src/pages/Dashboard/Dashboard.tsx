import React from 'react';
import { Download, ArrowRight, Eye, Bell, GraduationCap } from 'lucide-react';
import { User, Brand, Promotion, Asset } from '../../types';
import { assetService } from '../../services/assetService';

interface DashboardProps {
  currentUser: User;
  authorizedBrands: Brand[];
  promotions: Promotion[];
  recentAssets: Asset[];
  unreadCount: number;
  onNavigate: (view: string, brandId?: string, promoId?: string) => void;
  onSelectAsset: (asset: Asset) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  authorizedBrands,
  promotions,
  recentAssets,
  unreadCount,
  onNavigate,
  onSelectAsset
}) => {
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-7 md:p-9 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="max-w-xl">
          <div className="text-[0.8125rem] font-semibold uppercase tracking-widest text-sky-400 mb-1.5">
            {isAdmin ? 'Panel de Administración' : 'Portal Privado de Cliente'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-2.5">
            Bienvenido, {currentUser.name}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Accede al material publicitario, kits de prensa, fotografías en alta definición y recursos audiovisuales aprobados para {currentUser.company}.
          </p>
        </div>

        <div className="flex gap-6 bg-white/5 border border-white/10 px-6 py-4 rounded-xl backdrop-blur-xs shrink-0 self-start md:self-auto">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-extrabold text-white tabular-nums leading-none">
              {authorizedBrands.length}
            </span>
            <span className="text-xs text-slate-400 mt-1.5">
              {isAdmin ? 'Marcas en catálogo' : 'Marcas autorizadas'}
            </span>
          </div>
          <div className="w-[1px] bg-slate-700 self-stretch" />
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-extrabold text-white tabular-nums leading-none">
              {promotions.length}
            </span>
            <span className="text-xs text-slate-400 mt-1.5">Promociones activas</span>
          </div>
        </div>
      </section>

      {/* Unread Updates Alert Notice */}
      {unreadCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-amber-800">
            <div className="w-10 h-10 rounded-xl bg-amber-200 flex items-center justify-center shrink-0 border border-amber-400">
              <Bell size={22} />
            </div>
            <div>
              <div className="font-bold text-sm text-amber-900">
                Tienes {unreadCount} {unreadCount === 1 ? 'novedad pendiente' : 'novedades pendientes'} de lectura
              </div>
              <div className="text-xs text-amber-700 mt-0.5">
                Se han publicado nuevos cursos formativos o material promocional en tu cuenta.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('updates')}
            className="px-4 py-2 text-sm sm:text-xs font-semibold text-amber-950 bg-amber-200/90 hover:bg-amber-300 rounded-lg transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Ver novedades
          </button>
        </div>
      )}

      {/* Academy & Courses Highlight Banner */}
      {/* <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs border border-blue-900/40">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-400/20">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white mt-0.5">
              Cursos Online y Talleres Clínicos Presenciales
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Programas formativos tanto en formato online como talleres presenciales.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('courses')}
          className="px-4 py-2 text-sm sm:text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-xs transition-all hover:scale-[1.02] shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Explorar Cursos</span>
        </button>
      </div> */}

      {/* Brands Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAdmin ? 'Todas las Marcas' : 'Tus Marcas Autorizadas'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Selecciona una marca para explorar sus promociones y descargar contenido oficial.
            </p>
          </div>
          {/* <button
            onClick={() => onNavigate('brands')}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Ver catálogo</span>
            <ArrowRight size={14} />
          </button> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {authorizedBrands.map((brand) => {
            const brandPromos = promotions.filter((p) => p.brandId === brand.id);
            return (
              <div
                key={brand.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300 flex flex-col"
                onClick={() => onNavigate('brand_detail', brand.id)}
              >
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={brand.coverImageUrl}
                    alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded">
                    {brandPromos.length} {brandPromos.length === 1 ? 'Promoción' : 'Promociones'}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {/* <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">{brand.category}</div> */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{brand.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1 leading-relaxed">{brand.description}</p>

                  <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-xs text-slate-500">
                    <span>Actualizado para 2026</span>
                    <span className="font-semibold text-blue-600 flex items-center gap-1">
                      Explorar materiales
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Materials Published */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Últimos Materiales Publicados</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recursos gráficos y piezas de vídeo recientemente incorporadas al portal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentAssets.slice(0, 4).map((asset) => (
            <div
              key={asset.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-slate-300 transition-all hover:shadow-md cursor-pointer"
              onClick={() => onSelectAsset(asset)}
            >
              <div className="relative h-40 bg-slate-900 overflow-hidden">
                <img
                  src={asset.thumbnailUrl}
                  alt={asset.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded uppercase">
                  {asset.format}
                </div>
                {asset.type === 'video' && (
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Vídeo {asset.duration || ''}
                  </div>
                )}
              </div>

              <div className="p-3.5 flex flex-col flex-1">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                  {asset.title}
                </h4>
                <div className="text-[11px] text-slate-500 font-mono tabular-nums mb-3">
                  {asset.fileSizeFormatted} · {asset.dimensions || asset.duration || 'N/A'}
                </div>

                <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Eye size={12} /> Vista previa
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      assetService.downloadSingleAsset(asset, currentUser);
                    }}
                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    title="Descargar archivo"
                  >
                    <Download size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
