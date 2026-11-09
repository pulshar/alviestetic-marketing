
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

export async function getFolderContents(
    instance: IPublicClientApplication,
    account: AccountInfo,
    folderPath: string
) {
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
        `/drives/${documentLibrary.id}/root:/${encodedPath}:/children?$select=id,name,webUrl,folder,file,size,lastModifiedDateTime`
    );

    return result.value;
}
