import React, { useState } from 'react';
import { Layers, ArrowRight, Search, Plus, HardDrive } from 'lucide-react';
import { Brand, Promotion, User } from '../../types';

interface BrandsCatalogProps {
  currentUser: User;
  brands: Brand[];
  promotions: Promotion[];
  onNavigate: (view: string, brandId?: string, promoId?: string) => void;
  onOpenCreateBrand?: () => void;
}

export const BrandsCatalog: React.FC<BrandsCatalogProps> = ({
  currentUser,
  brands,
  promotions,
  onNavigate,
  onOpenCreateBrand
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isAdmin = currentUser.role === 'admin';

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {isAdmin ? 'Catálogo General de Marcas' : 'Marcas Autorizadas'}
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            {isAdmin
              ? 'Gestión centralizada de marcas y sincronización con SharePoint Online.'
              : 'Explora las marcas oficiales a las que tienes acceso para descargar sus activos digitales.'}
          </p>
        </div>

        {isAdmin && onOpenCreateBrand && (
          <button
            onClick={onOpenCreateBrand}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
          >
            <Plus size={15} />
            Nueva Marca
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por marca o categoría..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
        />
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBrands.map((brand) => {
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
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  {brandPromos.length} {brandPromos.length === 1 ? 'Promoción' : 'Promociones'}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                {/* <div className="text-xs font-semibold text-blue-600 mb-1">{brand.category}</div> */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">{brand.name}</h3>
                <p className="text-xs text-slate-500 mb-4 flex-1 line-clamp-3 leading-relaxed">{brand.description}</p>

                {brand.sharepointFolderPath && (
                  <div className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 mt-2 inline-flex items-center gap-1.5 max-w-full overflow-hidden truncate" title={`Carpeta SharePoint: ${brand.sharepointFolderPath}`}>
                    <HardDrive size={11} className="text-blue-500 shrink-0" />
                    <span className="truncate">{brand.sharepointFolderPath}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span>Creado en {brand.createdAt}</span>
                  <span className="font-semibold text-blue-600 inline-flex items-center gap-1">
                    Ver promociones
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBrands.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
          <Layers size={32} className="mx-auto text-slate-400 mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No se encontraron marcas</h3>
          <p className="text-xs text-slate-500 mt-1">
            Prueba a modificar los términos de búsqueda o ponte en contacto con el administrador.
          </p>
        </div>
      )}
    </div>
  );
};
