import JSZip from 'jszip';
import { Asset, User } from '../types';
import { storageService } from './storageService';
import { authService } from './authService';

class AssetService {
  getAssetsForPromotion(promotionId: string, user: User | null): Asset[] {
    if (!user) return [];
    const promotions = storageService.getPromotions();
    const promo = promotions.find(p => p.id === promotionId);
    if (!promo || !authService.canAccessBrand(user, promo.brandId)) return [];

    const allAssets = storageService.getAssets();
    return allAssets.filter(a => a.promotionId === promotionId);
  }

  getAssetById(id: string, user: User | null): Asset | null {
    if (!user) return null;
    const allAssets = storageService.getAssets();
    const asset = allAssets.find(a => a.id === id);
    if (!asset || !authService.canAccessBrand(user, asset.brandId)) return null;
    return asset;
  }

  // Trigger real file download for single asset
  async downloadSingleAsset(asset: Asset, user: User | null): Promise<void> {
    try {
      // Create a clean filename
      const cleanTitle = asset.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      const ext = asset.format.toLowerCase();
      const filename = `${cleanTitle}.${ext}`;

      // Try fetching blob directly, fallback to anchor download
      try {
        const response = await fetch(asset.url);
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        } else {
          throw new Error('Direct fetch failed');
        }
      } catch {
        // Fallback: direct download link
        const link = document.createElement('a');
        link.href = asset.downloadUrl;
        link.target = '_blank';
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      if (user) {
        storageService.addActivity({
          userId: user.id,
          userName: user.name,
          action: 'download_single',
          description: `Descargó el archivo "${asset.title}" (${asset.format})`
        });
      }
    } catch (err) {
      console.error('Error downloading single asset:', err);
    }
  }

  // Generate real ZIP archive in browser with JSZip and trigger download
  async downloadAssetsAsZip(
    assets: Asset[],
    zipName: string,
    user: User | null,
    onProgress?: (percent: number, currentAsset: string) => void
  ): Promise<void> {
    if (assets.length === 0) return;

    const zip = new JSZip();
    const total = assets.length;

    // Add Readme / Index manifest inside the ZIP
    const manifestContent = [
      `============================================================`,
      `ALVIESTETIC — PORTAL DE DISTRIBUCIÓN DE MATERIAL GRÁFICO`,
      `Lote descargado: ${zipName}`,
      `Fecha: ${new Date().toLocaleString('es-ES')}`,
      `Total archivos: ${total}`,
      `============================================================\n`,
      ...assets.map((a, i) => `${i + 1}. ${a.title} [${a.format}] - ${a.fileSizeFormatted} (${a.dimensions || a.duration || 'N/A'})`),
      `\nTodos los derechos de propiedad intelectual pertenecen a sus respectivas marcas.`
    ].join('\n');

    zip.file('INDICE_DE_ARCHIVOS_ALVIESTETIC.txt', manifestContent);

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const percentStart = Math.round((i / total) * 70);
      onProgress?.(percentStart, asset.title);

      const cleanTitle = asset.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      const ext = asset.format.toLowerCase();
      const filename = `${String(i + 1).padStart(2, '0')}_${cleanTitle}.${ext}`;

      try {
        const response = await fetch(asset.url);
        if (response.ok) {
          const blob = await response.blob();
          zip.file(filename, blob);
        } else {
          // If fetch fails (e.g. CORS), create a descriptor proxy file with download link
          zip.file(
            `${filename}.enlace.txt`,
            `Archivo: ${asset.title}\nTipo: ${asset.type}\nFormato: ${asset.format}\nTamaño: ${asset.fileSizeFormatted}\nEnlace directo de descarga: ${asset.downloadUrl}`
          );
        }
      } catch {
        // Fallback payload representation
        zip.file(
          `${filename}.enlace.txt`,
          `Archivo: ${asset.title}\nTipo: ${asset.type}\nFormato: ${asset.format}\nTamaño: ${asset.fileSizeFormatted}\nEnlace directo de descarga: ${asset.downloadUrl}`
        );
      }
    }

    onProgress?.(80, 'Comprimiendo archivos en ZIP...');

    const zipBlob = await zip.generateAsync(
      { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
      (metadata) => {
        const genPercent = 80 + Math.round((metadata.percent / 100) * 20);
        onProgress?.(Math.min(99, genPercent), 'Finalizando paquete ZIP...');
      }
    );

    onProgress?.(100, 'Descarga completada');

    // Trigger download of the generated .zip file
    const downloadUrl = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${zipName.replace(/[^a-zA-Z0-9_-]/g, '_')}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);

    if (user) {
      storageService.addActivity({
        userId: user.id,
        userName: user.name,
        action: 'download_zip',
        description: `Descargó paquete ZIP de ${assets.length} archivos para "${zipName}"`
      });
    }
  }
}

export const assetService = new AssetService();
