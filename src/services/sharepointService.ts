
import type {
    IPublicClientApplication,
    AccountInfo,
} from "@azure/msal-browser";
import { loginRequest } from "../auth/authConfig";

const GRAPH_URL = "https://graph.microsoft.com/v1.0";

export async function getGraphToken(
    instance: IPublicClientApplication,
    account: AccountInfo
): Promise<string> {
    try {
        const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account,
        });
        return response.accessToken;
    } catch (error) {
        console.warn("acquireTokenSilent falló, solicitando vía popup:", error);
        const response = await instance.acquireTokenPopup({
            ...loginRequest,
            account,
        });
        return response.accessToken;
    }
}

export async function graphRequest(
    token: string,
    endpoint: string
) {
    const response = await fetch(`${GRAPH_URL}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Graph ${response.status}: ${error}`);
    }

    return response.json();
}

export interface SharePointFolder {
    id: string;
    name: string;
    webUrl: string;
    lastModifiedDateTime?: string;
}

export async function getBrandFolders(
    instance: IPublicClientApplication,
    account: AccountInfo
): Promise<SharePointFolder[]> {
    const token = await getGraphToken(instance, account);

    // Identificar el sitio de SharePoint
    const site = await graphRequest(
        token,
        "/sites/grupoalviestetic.sharepoint.com"
    );

    // Identificar la biblioteca Documentos
    const drives = await graphRequest(
        token,
        `/sites/${site.id}/drives`
    );

    const documentLibrary = drives.value.find(
        (drive: { name: string }) => drive.name === "Documentos"
    );

    if (!documentLibrary) {
        throw new Error("No se encontró la biblioteca Documentos.");
    }

    // Obtener las carpetas de la biblioteca
    const result = await graphRequest(
        token,
        `/drives/${documentLibrary.id}/root/children?$select=id,name,webUrl,folder,lastModifiedDateTime`
    );

    return result.value.filter(
        (item: { folder?: object }) => item.folder !== undefined
    );
}

export interface SharePointDriveItem {
    id: string;
    name: string;
    webUrl: string;
    size?: number;
    lastModifiedDateTime?: string;
    folder?: object;
    file?: { mimeType?: string };
    image?: { width?: number; height?: number };
    video?: { duration?: number; width?: number; height?: number };
    '@microsoft.graph.downloadUrl'?: string;
}

export async function getFolderContents(
    instance: IPublicClientApplication,
    account: AccountInfo,
    folderPath: string
): Promise<SharePointDriveItem[]> {
    const token = await getGraphToken(instance, account);

    const site = await graphRequest(
        token,
        "/sites/grupoalviestetic.sharepoint.com"
    );

    const drives = await graphRequest(
        token,
        `/sites/${site.id}/drives`
    );

    const documentLibrary = drives.value.find(
        (drive: { name: string }) => drive.name === "Documentos"
    );

    if (!documentLibrary) {
        throw new Error("No se encontró la biblioteca Documentos.");
    }

    const encodedPath = folderPath
        .split("/")
        .filter(Boolean)
        .map(segment => encodeURIComponent(segment))
        .join("/");

    const result = await graphRequest(
        token,
        `/drives/${documentLibrary.id}/root:/${encodedPath}:/children?$select=id,name,webUrl,folder,file,image,video,size,lastModifiedDateTime,@microsoft.graph.downloadUrl`
    );

    return result.value || [];
}

import type { Asset, AssetFormat } from "../types";

export function sharePointItemToAsset(
    item: SharePointDriveItem,
    brandId: string,
    folderOrPromoPath: string = ''
): Asset {
    const mime = item.file?.mimeType || '';
    const isVideo = mime.startsWith('video/') || /\.(mp4|webm|mov|avi|mkv)$/i.test(item.name);
    const rawExt = item.name.split('.').pop()?.toUpperCase() || (isVideo ? 'MP4' : 'JPG');

    let format: AssetFormat = 'JPG';
    if (rawExt === 'PNG') format = 'PNG';
    else if (rawExt === 'MP4') format = 'MP4';
    else if (rawExt === 'WEBM') format = 'WEBM';
    else if (rawExt === 'PDF') format = 'PDF';
    else if (rawExt === 'ZIP') format = 'ZIP';
    else if (isVideo) format = 'MP4';
    else if (['JPG', 'JPEG'].includes(rawExt)) format = 'JPG';
    else format = 'FILE';

    const bytes = item.size || 0;
    let sizeFormatted = '0 B';
    if (bytes >= 1024 * 1024 * 1024) {
        sizeFormatted = `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    } else if (bytes >= 1024 * 1024) {
        sizeFormatted = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else if (bytes >= 1024) {
        sizeFormatted = `${(bytes / 1024).toFixed(1)} KB`;
    } else if (bytes > 0) {
        sizeFormatted = `${bytes} B`;
    }

    const downloadUrl = item['@microsoft.graph.downloadUrl'] || item.webUrl;
    const cleanTitle = item.name.replace(/\.[^/.]+$/, '');

    let dimensions: string | undefined = undefined;
    if (item.image?.width && item.image?.height) {
        dimensions = `${item.image.width} × ${item.image.height} px`;
    } else if (item.video?.width && item.video?.height) {
        dimensions = `${item.video.width} × ${item.video.height} px`;
    }

    let duration: string | undefined = undefined;
    if (item.video?.duration) {
        const totalSecs = Math.round(item.video.duration / 1000);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        duration = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    return {
        id: item.id,
        promotionId: folderOrPromoPath || 'sharepoint',
        brandId,
        title: cleanTitle,
        description: `Archivo en SharePoint Online: ${item.name}`,
        type: isVideo ? 'video' : 'image',
        format,
        fileSizeBytes: bytes,
        fileSizeFormatted: sizeFormatted,
        dimensions,
        duration,
        url: downloadUrl,
        thumbnailUrl: downloadUrl,
        downloadUrl: downloadUrl,
        publishedAt: item.lastModifiedDateTime || new Date().toISOString(),
        tags: [rawExt.toLowerCase(), isVideo ? 'video' : 'fotografia', 'sharepoint']
    };
}
