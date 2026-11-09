import { LogLevel, type Configuration } from "@azure/msal-browser";

const getRedirectUri = () => {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    return "http://localhost:3000/";
};
export const msalConfig: Configuration = {
    auth: {
        clientId: "9e7ca505-a379-44ef-8f1e-b715aeb340eb",
        authority:
            "https://login.microsoftonline.com/b6ec92ed-2ff4-4552-a46c-1c1e1d33c795",
        redirectUri: getRedirectUri(),
        postLogoutRedirectUri: getRedirectUri(),
    },
    cache: {
        cacheLocation: "sessionStorage",
    },
    system: {
        loggerOptions: {
            logLevel: LogLevel.Warning,
            piiLoggingEnabled: false,
        },
    },
};

export const loginRequest = {
    scopes: ["User.Read", "Files.Read.All", "Sites.Read.All"],
};