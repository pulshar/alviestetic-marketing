import React from 'react';
import { ArrowLeft, ArrowRight, HardDrive } from 'lucide-react';
import { Brand, Promotion, User } from '../../types';

interface BrandDetailProps {
  brand: Brand;
  promotions: Promotion[];
  currentUser: User;
  onNavigate: (view: string, brandId?: string, promoId?: string) => void;
  onBack: () => void;
}

export const BrandDetail: React.FC<BrandDetailProps> = ({
  brand,
  promotions,
  onNavigate,
  onBack
}) => {
  return (
    <div className="flex flex-col gap-7">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors self-start cursor-pointer"
      >
        <ArrowLeft size={14} />
        Volver a todas las marcas
      </button>

      {/* Brand Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row md:items-stretch shadow-xs">
        <div className="flex-1 min-h-[14rem] bg-slate-100">
          <img
            src={brand.coverImageUrl}
            alt={brand.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 md:flex-[1.2] p-8 flex flex-col justify-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            {brand.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {brand.name}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {brand.description}
          </p>

          {/* SharePoint Prepared Metadata */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2 min-w-0">
              <HardDrive size={15} className="text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-800 shrink-0">SharePoint Folder:</span>
              <span className="font-mono text-slate-500 truncate text-[11px]">
                {brand.sharepointFolderPath || brand.sharepointFolderUrl}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Promotions Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Promociones y Campañas ({promotions.length})
          </h2>
          <p className="text-xs text-slate-500">
            Selecciona una promoción para consultar y descargar sus fotografías, vídeos y kits de prensa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300 flex flex-col"
              onClick={() => onNavigate('promotion_detail', brand.id, promo.id)}
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={promo.coverImageUrl}
                  alt={promo.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  {promo.season}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{promo.title}</h3>
                <p className="text-xs text-slate-500 mb-3 flex-1 line-clamp-3 leading-relaxed">{promo.description}</p>

                <div className="text-[11px] text-slate-400 font-mono mb-3">
                  Subcarpeta: {promo.sharepointSubfolderPath}
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-xs text-slate-500">
                  <span className="font-mono">
                    {promo.assetCount} archivos disponibles
                  </span>
                  <span className="font-semibold text-blue-600 inline-flex items-center gap-1">
                    Abrir galería
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {promotions.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-sm">
            Actualmente no hay promociones activas registradas para esta marca.
          </div>
        )}
      </div>
    </div>
  );
};
