import { useEffect, useState, type ReactNode } from "react";
import {
    PublicClientApplication,
    type IPublicClientApplication,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

interface Props {
    children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        msalInstance.initialize().then(() => {
            setReady(true);
        });
    }, []);

    if (!ready) return <p>Conectando con Microsoft...</p>;

    return (
        <MsalProvider instance={msalInstance}>
            {children}
        </MsalProvider>
    );
}