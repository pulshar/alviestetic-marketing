import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Download,
  CheckSquare,
  Square,
  Play,
  Archive,
  Image as ImageIcon,
  HardDrive,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Promotion, Brand, Asset, User } from '../../types';
import { assetService } from '../../services/assetService';
import { AssetLightbox } from '../../components/gallery/AssetLightbox';
import { ZipProgressModal } from '../../components/gallery/ZipProgressModal';
import { useMsal } from '@azure/msal-react';
import { getFolderContents, sharePointItemToAsset } from '../../services/sharepointService';

interface PromotionDetailProps {
  promotion: Promotion;
  brand: Brand;
  assets: Asset[];
  currentUser: User;
  onBack: () => void;
}

export const PromotionDetail: React.FC<PromotionDetailProps> = ({
  promotion,
  brand,
  assets: initialAssets,
  currentUser,
  onBack
}) => {
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  const [liveAssets, setLiveAssets] = useState<Asset[] | null>(null);
  const [loadingSharePoint, setLoadingSharePoint] = useState(false);
  const [isSharePointConnected, setIsSharePointConnected] = useState(false);

  // Load from SharePoint if user is authenticated and path is configured
  useEffect(() => {
    let cancelled = false;

    async function fetchFromSharePoint() {
      if (!account || !promotion.sharepointSubfolderPath) {
        setLiveAssets(null);
        setIsSharePointConnected(false);
        return;
      }

      try {
        setLoadingSharePoint(true);
        const items = await getFolderContents(
          instance,
          account,
          promotion.sharepointSubfolderPath
        );

        const files = items.filter((item) => item.folder === undefined);
        if (!cancelled && files.length > 0) {
          const mapped = files.map((f) =>
            sharePointItemToAsset(f, brand.id, promotion.id)
          );
          setLiveAssets(mapped);
          setIsSharePointConnected(true);
        } else if (!cancelled) {
          setIsSharePointConnected(false);
        }
      } catch (err) {
        console.warn('SharePoint subfolder not found, using fallback data:', err);
        if (!cancelled) {
          setIsSharePointConnected(false);
        }
      } finally {
        if (!cancelled) {
          setLoadingSharePoint(false);
        }
      }
    }

    fetchFromSharePoint();

    return () => {
      cancelled = true;
    };
  }, [instance, account, promotion.sharepointSubfolderPath, brand.id, promotion.id]);

  const assets = liveAssets && liveAssets.length > 0 ? liveAssets : initialAssets;

  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Modals state
  const [activeLightboxAsset, setActiveLightboxAsset] = useState<Asset | null>(null);

  // ZIP progress state
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipStatusText, setZipStatusText] = useState('');
  const [zipTotalFiles, setZipTotalFiles] = useState(0);

  // Filter and search logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesType = filterType === 'all' || asset.type === filterType;
      const matchesSearch =
        asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [assets, filterType, searchQuery]);

  const imageCount = assets.filter((a) => a.type === 'image').length;
  const videoCount = assets.filter((a) => a.type === 'video').length;

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
    setIsZipping(true);
    setZipProgress(0);
    setZipStatusText('Iniciando empaquetado...');
    setZipTotalFiles(assetsToZip.length);

    try {
      await assetService.downloadAssetsAsZip(
        assetsToZip,
        `${brand.slug}_${promotion.id}_${zipLabel}`,
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
    <div className="flex flex-col gap-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors self-start cursor-pointer"
      >
        <ArrowLeft size={14} />
        Volver a {brand.name}
      </button>

      {/* Promotion Hero Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            {brand.name} · {promotion.season}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">{promotion.title}</h1>
          <p className="text-sm text-slate-600 leading-relaxed">{promotion.description}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 font-mono flex-wrap">
            <div className="flex items-center gap-2">
              <HardDrive size={13} className="text-blue-500" />
              <span>SharePoint: {promotion.sharepointSubfolderPath}</span>
            </div>
            {loadingSharePoint && (
              <span className="inline-flex items-center gap-1 text-[11px] text-blue-600">
                <Loader2 size={12} className="animate-spin" />
                Sincronizando...
              </span>
            )}
            {isSharePointConnected && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                En vivo desde SharePoint Online
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleDownloadBatch(assets, 'completa')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <Archive size={14} />
            Descargar todos ({assets.length}) en .ZIP
          </button>
        </div>
      </div>

      {/* Gallery Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border-none cursor-pointer whitespace-nowrap transition-all ${filterType === 'all'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            Todos ({assets.length})
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border-none cursor-pointer whitespace-nowrap transition-all ${filterType === 'image'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            Fotografías ({imageCount})
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border-none cursor-pointer whitespace-nowrap transition-all ${filterType === 'video'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            Vídeos ({videoCount})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Select all toggle */}
          <button
            onClick={handleSelectAll}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            {selectedAssetIds.length === filteredAssets.length && filteredAssets.length > 0 ? (
              <CheckSquare size={16} className="text-blue-600" />
            ) : (
              <Square size={16} />
            )}
            <span>
              {selectedAssetIds.length === filteredAssets.length && filteredAssets.length > 0
                ? 'Deseleccionar todos'
                : 'Seleccionar todos'}
            </span>
          </button>

          {/* Search box */}
          <div className="relative flex items-center min-w-56 flex-1 sm:flex-none">
            <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o formato..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Asset Cards Grid */}
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
                title="Seleccionar para descarga múltiple"
              />

              {/* Format Badge */}
              <div className="absolute top-3 right-3 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                {asset.format}
              </div>

              {/* Media Thumbnail */}
              <div className="relative h-48 bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center group">
                <img
                  src={asset.thumbnailUrl}
                  alt={asset.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {asset.type === 'video' && (
                  <div className="absolute w-11 h-11 rounded-full bg-slate-900/70 backdrop-blur-xs text-white flex items-center justify-center pointer-events-none">
                    <Play size={18} className="fill-white translate-x-0.5" />
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col flex-1">
                <h4 className="text-sm font-semibold text-slate-900 mb-1.5 line-clamp-2 leading-snug" title={asset.title}>
                  {asset.title}
                </h4>

                <div className="text-xs text-slate-500 mb-3 font-mono tabular-nums">
                  {asset.fileSizeFormatted} · {asset.dimensions || asset.duration || 'N/A'}
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
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl text-slate-500">
          <ImageIcon size={32} className="mx-auto text-slate-400 mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No se encontraron archivos</h3>
          <p className="text-xs text-slate-500 mt-1">
            Ningún recurso coincide con los filtros aplicados en esta promoción.
          </p>
        </div>
      )}

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

      {/* Lightbox Modal */}
      <AssetLightbox
        asset={activeLightboxAsset}
        user={currentUser}
        onClose={() => setActiveLightboxAsset(null)}
      />

      {/* ZIP Progress Modal */}
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
