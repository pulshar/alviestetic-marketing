import React, { useEffect, useState, useMemo } from 'react';
import { useMsal } from '@azure/msal-react';
import {
  ArrowLeft,
  ArrowRight,
  HardDrive,
  Folder,
  FileText,
  ChevronRight,
  Loader2,
  RefreshCw,
  AlertCircle,
  Search,
  Download,
  CheckSquare,
  Square,
  Play,
  Archive,
  LayoutGrid,
  List,
  ExternalLink,
  Tag
} from 'lucide-react';
import { Brand, Promotion, Asset, User } from '../../types';
import {
  getFolderContents,
  sharePointItemToAsset,
  SharePointDriveItem
} from '../../services/sharepointService';
import { loginRequest } from '../../auth/authConfig';
import { assetService } from '../../services/assetService';
import { AssetLightbox } from '../../components/gallery/AssetLightbox';
import { ZipProgressModal } from '../../components/gallery/ZipProgressModal';

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
  currentUser,
  onNavigate,
  onBack
}) => {
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  const basePath = (
    brand.sharepointFolderPath || `/Marcas/${brand.name}`
  ).replace(/^\/+|\/+$/g, '');

  const [currentPath, setCurrentPath] = useState(basePath);
  const [items, setItems] = useState<SharePointDriveItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Gallery filters and view state
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [activeLightboxAsset, setActiveLightboxAsset] = useState<Asset | null>(null);

  // ZIP packaging progress state
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipStatusText, setZipStatusText] = useState('');
  const [zipTotalFiles, setZipTotalFiles] = useState(0);

  // Reset path when brand changes
  useEffect(() => {
    setCurrentPath(basePath);
    setSelectedAssetIds([]);
  }, [brand.id, basePath]);

  // Load SharePoint folder contents
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
          setItems(result);
          setSelectedAssetIds([]);
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
      setItems(result);
      setSelectedAssetIds([]);
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

  // Split into subfolders and media files
  const subfolders = useMemo(() => {
    return items.filter((item) => item.folder !== undefined);
  }, [items]);

  const rawFiles = useMemo(() => {
    return items.filter((item) => item.folder === undefined);
  }, [items]);

  // Convert SharePoint files into rich Asset models
  const assets: Asset[] = useMemo(() => {
    return rawFiles.map((item) =>
      sharePointItemToAsset(item, brand.id, currentPath)
    );
  }, [rawFiles, brand.id, currentPath]);

  // Filter and search logic on assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesType = filterType === 'all' || asset.type === filterType;
      const matchesSearch =
        asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.format.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [assets, filterType, searchQuery]);

  const imageCount = useMemo(
    () => assets.filter((a) => a.type === 'image').length,
    [assets]
  );
  const videoCount = useMemo(
    () => assets.filter((a) => a.type === 'video').length,
    [assets]
  );

  // Folder navigation handlers
  const openFolder = (folderName: string) => {
    setCurrentPath(`${currentPath}/${folderName}`);
  };

  const goToParentFolder = () => {
    if (currentPath === basePath) return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    setCurrentPath(parentPath);
  };

  const navigateToBreadcrumbIndex = (index: number) => {
    const segments = currentPath.split('/').filter(Boolean);
    const newPath = segments.slice(0, index + 1).join('/');
    setCurrentPath(newPath);
  };

  const pathSegments = currentPath.split('/').filter(Boolean);

  // Selection handlers
  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedAssetIds.includes(id)) {
      setSelectedAssetIds(selectedAssetIds.filter((item) => item !== id));
    } else {
      setSelectedAssetIds([...selectedAssetIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAssetIds.length === filteredAssets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(filteredAssets.map((a) => a.id));
    }
  };

  // ZIP packaging trigger
  const handleDownloadBatch = async (assetsToZip: Asset[], zipLabel: string) => {
    if (assetsToZip.length === 0) return;
    setIsZipping(true);
    setZipProgress(0);
    setZipStatusText('Iniciando empaquetado desde SharePoint...');
    setZipTotalFiles(assetsToZip.length);

    const safeFolderName = currentPath.split('/').pop() || brand.name;
    try {
      await assetService.downloadAssetsAsZip(
        assetsToZip,
        `${brand.slug}_${safeFolderName}_${zipLabel}`,
        currentUser,
        (percent, status) => {
          setZipProgress(percent);
          setZipStatusText(status);
        }
      );
    } catch (err) {
      console.error('Error bundling ZIP:', err);
      setZipStatusText('Error al generar el archivo ZIP');
    }
  };

  const handleDownloadSingle = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation();
    assetService.downloadSingleAsset(asset, currentUser);
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

      {/* SharePoint Explorer & Asset Gallery */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Header & Status */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="text-lg font-bold text-slate-900">
                Archivos en SharePoint de {brand.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Explora, previsualiza y descarga en tiempo real fotografías, vídeos y documentos desde SharePoint Online.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {account && assets.length > 0 && (
              <button
                onClick={() => handleDownloadBatch(assets, 'completa')}
                disabled={loading || isZipping}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Archive size={14} />
                <span>Descargar todos ({assets.length}) en .ZIP</span>
              </button>
            )}

            {account && (
              <button
                onClick={handleManualRefresh}
                disabled={loading}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
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

          {/* Subfolders list (if any) */}
          {subfolders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Subcarpetas disponibles ({subfolders.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {subfolders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => openFolder(folder.name)}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-300 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Folder size={17} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-blue-700">
                          {folder.name}
                        </span>
                        <span className="text-[10px] text-slate-400">Carpeta SharePoint</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Not logged into Microsoft */}
          {!account && (
            <div className="p-7 rounded-xl bg-amber-50/70 border border-amber-200 text-center flex flex-col items-center">
              <HardDrive size={34} className="text-amber-600 mb-2.5" />
              <h3 className="text-sm font-bold text-amber-900 mb-1">
                Sesión de Microsoft 365 requerida
              </h3>
              <p className="text-xs text-amber-700 max-w-md mb-4">
                Inicia sesión con tu cuenta corporativa para explorar las carpetas, previsualizar fotografías y vídeos, y descargar recursos en ZIP desde SharePoint Online.
              </p>
              <button
                onClick={handleConnectMicrosoft}
                disabled={isConnecting}
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
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
            <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500">
              <Loader2 size={20} className="animate-spin text-blue-600" />
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

          {/* Empty state (no files and no subfolders) */}
          {account && !loading && !error && items.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500 flex flex-col items-center">
              <Folder size={32} className="text-slate-300 mb-2" />
              <p className="font-medium text-slate-700">Esta carpeta no contiene documentos ni subcarpetas.</p>
              <p className="text-xs text-slate-400 mt-0.5">Ruta actual: {currentPath}</p>
            </div>
          )}

          {/* GALLERY CONTROLS TOOLBAR (When files exist) */}
          {account && !loading && !error && assets.length > 0 && (
            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                {/* Type Filters */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border-none cursor-pointer whitespace-nowrap transition-all ${filterType === 'all'
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-transparent text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Todos ({assets.length})
                  </button>
                  <button
                    onClick={() => setFilterType('image')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border-none cursor-pointer whitespace-nowrap transition-all ${filterType === 'image'
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-transparent text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Fotografías ({imageCount})
                  </button>
                  <button
                    onClick={() => setFilterType('video')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border-none cursor-pointer whitespace-nowrap transition-all ${filterType === 'video'
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-transparent text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Vídeos ({videoCount})
                  </button>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Select all toggle */}
                  <button
                    onClick={handleSelectAll}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                  >
                    {selectedAssetIds.length === filteredAssets.length && filteredAssets.length > 0 ? (
                      <CheckSquare size={15} className="text-blue-600" />
                    ) : (
                      <Square size={15} />
                    )}
                    <span>
                      {selectedAssetIds.length === filteredAssets.length && filteredAssets.length > 0
                        ? 'Deseleccionar todos'
                        : 'Seleccionar todos'}
                    </span>
                  </button>

                  {/* View Mode Toggle (Grid vs List) */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      title="Vista cuadrícula"
                    >
                      <LayoutGrid size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      title="Vista lista"
                    >
                      <List size={14} />
                    </button>
                  </div>

                  {/* Search box */}
                  <div className="relative flex items-center min-w-52 flex-1 sm:flex-none">
                    <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por nombre o formato..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none focus:border-blue-600 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* GRID VIEW */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredAssets.map((asset) => {
                    const isSelected = selectedAssetIds.includes(asset.id);
                    return (
                      <div
                        key={asset.id}
                        className={`bg-white rounded-xl border overflow-hidden flex flex-col transition-all relative cursor-pointer hover:border-slate-300 hover:shadow-md ${isSelected
                          ? 'border-blue-600 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]'
                          : 'border-slate-200'
                          }`}
                        onClick={() => setActiveLightboxAsset(asset)}
                      >
                        {/* Checkbox for selection */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => { }}
                          onClick={(e) => handleToggleSelect(asset.id, e)}
                          className="absolute top-3 left-3 z-10 w-5 h-5 cursor-pointer accent-blue-600"
                          title="Seleccionar para descarga múltiple en ZIP"
                        />

                        {/* Format Badge */}
                        <div className="absolute top-3 right-3 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                          {asset.format}
                        </div>

                        {/* Media Thumbnail */}
                        <div className="relative h-44 bg-slate-900 overflow-hidden flex items-center justify-center group">
                          {asset.type === 'video' ? (
                            <>
                              <img
                                src={asset.thumbnailUrl}
                                alt={asset.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-85"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute w-10 h-10 rounded-full bg-slate-900/70 backdrop-blur-xs text-white flex items-center justify-center pointer-events-none">
                                <Play size={16} className="fill-white translate-x-0.5" />
                              </div>
                            </>
                          ) : asset.format === 'PDF' ? (
                            <div className="w-full h-full bg-red-950/40 flex flex-col items-center justify-center text-red-300 p-4">
                              <FileText size={36} className="mb-2 text-red-400" />
                              <span className="text-xs font-bold uppercase tracking-wider">Documento PDF</span>
                            </div>
                          ) : (
                            <img
                              src={asset.thumbnailUrl}
                              alt={asset.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-4 flex flex-col flex-1">
                          <h4
                            className="text-sm font-semibold text-slate-900 mb-1.5 line-clamp-2 leading-snug"
                            title={asset.title}
                          >
                            {asset.title}
                          </h4>

                          <div className="text-xs text-slate-500 mb-3 font-mono tabular-nums">
                            {asset.fileSizeFormatted}
                            {asset.dimensions && ` · ${asset.dimensions}`}
                            {asset.duration && ` · ${asset.duration}`}
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                            <button
                              onClick={(e) => handleDownloadSingle(asset, e)}
                              className="bg-slate-900 text-white px-2.5 py-1.5 rounded-md text-xs font-medium hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Descargar este archivo"
                            >
                              <Download size={13} />
                              <span>Descargar</span>
                            </button>

                            <a
                              href={asset.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:text-blue-800 text-[11px] inline-flex items-center gap-1"
                              title="Abrir en SharePoint"
                            >
                              <span>SharePoint</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* LIST VIEW */}
              {viewMode === 'list' && (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {filteredAssets.map((asset) => {
                    const isSelected = selectedAssetIds.includes(asset.id);
                    return (
                      <div
                        key={asset.id}
                        onClick={() => setActiveLightboxAsset(asset)}
                        className={`p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/40' : ''
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => { }}
                            onClick={(e) => handleToggleSelect(asset.id, e)}
                            className="w-4 h-4 cursor-pointer accent-blue-600"
                          />
                          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                            {asset.type === 'video' ? <Play size={16} /> : <FileText size={16} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {asset.title}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {asset.format} · {asset.fileSizeFormatted}
                              {asset.dimensions && ` · ${asset.dimensions}`}
                              {asset.duration && ` · ${asset.duration}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => handleDownloadSingle(asset, e)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Download size={13} />
                            <span>Descargar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {filteredAssets.length === 0 && (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">
                  Ningún archivo coincide con los filtros aplicados en esta carpeta.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar for Batch Selection (ZIP Download) */}
      {selectedAssetIds.length > 0 && (
        <div className="fixed bottom-6 md:bottom-6 max-sm:bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center justify-between sm:justify-start gap-4 z-40 max-w-sm sm:max-w-none w-[calc(100%-2rem)] sm:w-auto animate-in fade-in slide-in-from-bottom-2">
          <div className="text-xs font-semibold">
            <span className="font-mono text-blue-400 font-bold">{selectedAssetIds.length}</span>{' '}
            {selectedAssetIds.length === 1 ? 'archivo seleccionado' : 'archivos seleccionados'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedAssetIds([])}
              className="px-3 py-1 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                const selectedAssets = assets.filter((a) => selectedAssetIds.includes(a.id));
                handleDownloadBatch(selectedAssets, 'seleccion');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-colors shadow-lg cursor-pointer"
            >
              <Archive size={14} />
              Descargar (.ZIP)
            </button>
          </div>
        </div>
      )}

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

      {/* Lightbox Modal for detail preview & video playback */}
      <AssetLightbox
        asset={activeLightboxAsset}
        user={currentUser}
        onClose={() => setActiveLightboxAsset(null)}
      />

      {/* ZIP Packaging Modal with progress percentage */}
      <ZipProgressModal
        isOpen={isZipping}
        progressPercent={zipProgress}
        currentStatus={zipStatusText}
        totalFiles={zipTotalFiles}
        onClose={() => setIsZipping(false)}
      />
    </div>
  );
};
