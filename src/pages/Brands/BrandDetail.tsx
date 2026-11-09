import React, { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import {
  ArrowLeft,
  ArrowRight,
  HardDrive,
  Folder,
  FileText,
  ExternalLink,
  ChevronRight,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Brand, Promotion, User } from '../../types';
import { getFolderContents } from '../../services/sharepointService';
import { loginRequest } from '../../auth/authConfig';

interface BrandDetailProps {
  brand: Brand;
  promotions: Promotion[];
  currentUser: User;
  onNavigate: (view: string, brandId?: string, promoId?: string) => void;
  onBack: () => void;
}

interface SharePointItem {
  id: string;
  name: string;
  webUrl: string;
  folder?: object;
  file?: object;
  size?: number;
  lastModifiedDateTime?: string;
}

export const BrandDetail: React.FC<BrandDetailProps> = ({
  brand,
  promotions,
  onNavigate,
  onBack
}) => {
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  const basePath = (
    brand.sharepointFolderPath || `/Marcas/${brand.name}`
  ).replace(/^\/+|\/+$/g, '');

  const [currentPath, setCurrentPath] = useState(basePath);
  const [items, setItems] = useState<SharePointItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Reiniciar la navegación cuando cambia la marca
  useEffect(() => {
    setCurrentPath(basePath);
  }, [brand.id, basePath]);

  // Consultar el contenido de la carpeta actual
  useEffect(() => {
    let cancelled = false;

    async function loadContents() {
      if (!account) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const result = await getFolderContents(
          instance,
          account,
          currentPath
        );

        if (!cancelled) {
          setItems(result as SharePointItem[]);
        }
      } catch (err) {
        if (!cancelled) {
          setItems([]);
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo consultar SharePoint.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadContents();

    return () => {
      cancelled = true;
    };
  }, [instance, account, currentPath]);

  const handleManualRefresh = async () => {
    if (!account) return;
    try {
      setLoading(true);
      setError('');
      const result = await getFolderContents(instance, account, currentPath);
      setItems(result as SharePointItem[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo consultar SharePoint.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConnectMicrosoft = async () => {
    try {
      setIsConnecting(true);
      setError('');
      await instance.loginPopup(loginRequest);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al conectar con Microsoft.'
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // Entrar en una subcarpeta
  const openFolder = (folderName: string) => {
    setCurrentPath(`${currentPath}/${folderName}`);
  };

  // Volver a la carpeta anterior
  const goToParentFolder = () => {
    if (currentPath === basePath) return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    setCurrentPath(parentPath);
  };

  // Navegar a un nivel concreto del breadcrumb
  const navigateToBreadcrumbIndex = (index: number) => {
    const segments = currentPath.split('/').filter(Boolean);
    const newPath = segments.slice(0, index + 1).join('/');
    setCurrentPath(newPath);
  };

  const pathSegments = currentPath.split('/').filter(Boolean);

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2 min-w-0">
              <HardDrive size={15} className="text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-800 shrink-0">
                SharePoint Folder:
              </span>
              <span className="font-mono text-slate-500 truncate text-[11px]">
                {currentPath}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SharePoint Explorer */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="text-lg font-bold text-slate-900">
                Documentos en SharePoint de {brand.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Consulta en tiempo real las carpetas y documentos alojados en Microsoft SharePoint (Graph API).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {account && (
              <button
                onClick={handleManualRefresh}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                title="Actualizar listado de archivos"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                <span>Actualizar</span>
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumb Navigation Bar */}
        <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <HardDrive size={14} className="text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-600">Sitio:</span>
          {pathSegments.map((part, index) => {
            const isLast = index === pathSegments.length - 1;
            return (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight size={13} className="text-slate-400 shrink-0" />}
                {isLast ? (
                  <span className="font-bold text-slate-900 bg-slate-200/70 px-2 py-0.5 rounded">
                    {part}
                  </span>
                ) : (
                  <button
                    onClick={() => navigateToBreadcrumbIndex(index)}
                    className="hover:text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0 text-slate-600 font-medium"
                  >
                    {part}
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="p-5">
          {/* Back button within folders */}
          {currentPath !== basePath && (
            <button
              onClick={goToParentFolder}
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 mb-4 cursor-pointer"
            >
              <ArrowLeft size={14} />
              Volver a la carpeta anterior
            </button>
          )}

          {/* Not logged into Microsoft */}
          {!account && (
            <div className="p-6 rounded-xl bg-amber-50/70 border border-amber-200 text-center flex flex-col items-center">
              <HardDrive size={32} className="text-amber-600 mb-2" />
              <h3 className="text-sm font-bold text-amber-900 mb-1">
                Sesión de Microsoft 365 requerida
              </h3>
              <p className="text-xs text-amber-700 max-w-md mb-4">
                Para explorar las carpetas y descargar documentos de SharePoint Online en tiempo real, conecta tu cuenta corporativa de Microsoft.
              </p>
              <button
                onClick={handleConnectMicrosoft}
                disabled={isConnecting}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isConnecting ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-blue-400" />
                    <span>Conectando con Microsoft...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
                      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                    </svg>
                    <span>Conectar Microsoft 365</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Loading state */}
          {account && loading && (
            <div className="flex items-center justify-center gap-3 py-10 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin text-blue-600" />
              <span>Consultando documentos en SharePoint Online...</span>
            </div>
          )}

          {/* Error state */}
          {account && !loading && error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-500 mt-0.5" />
              <div>
                <strong className="block font-bold">No se pudo consultar SharePoint:</strong>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {account && !loading && !error && items.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500 flex flex-col items-center">
              <Folder size={32} className="text-slate-300 mb-2" />
              <p className="font-medium text-slate-700">Esta carpeta no contiene documentos ni subcarpetas.</p>
              <p className="text-xs text-slate-400 mt-0.5">Ruta actual: {currentPath}</p>
            </div>
          )}

          {/* Files and Folders List */}
          {account && !loading && !error && items.length > 0 && (
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {items.map((item) => {
                const isFolder = item.folder !== undefined;
                const sizeStr = formatFileSize(item.size);

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3.5 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isFolder ? (
                        <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                          <Folder size={18} />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                          <FileText size={18} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {isFolder ? 'Carpeta de archivos' : 'Documento'}
                          {sizeStr && ` · ${sizeStr}`}
                          {item.lastModifiedDateTime && (
                            <>
                              {' · Modificado: '}
                              {new Date(item.lastModifiedDateTime).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isFolder ? (
                        <button
                          onClick={() => openFolder(item.name)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Abrir carpeta</span>
                          <ArrowRight size={13} />
                        </button>
                      ) : (
                        <a
                          href={item.webUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <span>Ver en SharePoint</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Promotions Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Promociones y Campañas ({promotions.length})
          </h2>
          <p className="text-xs text-slate-500">
            Selecciona una promoción para consultar sus fotografías, vídeos y kits de prensa.
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {promo.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex-1 line-clamp-3 leading-relaxed">
                  {promo.description}
                </p>

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
