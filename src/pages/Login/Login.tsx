import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { User } from '../../types';
import { authService } from '../../services/authService';
import { storageService } from '../../services/storageService';
import { INITIAL_USERS } from '../../data/mockData';
import { Isotype } from '../../components/ui/Isotype';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../auth/authConfig";

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);
  const [isMsLoggingIn, setIsMsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotNotice(null);

    const result = authService.login(email, password);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setError(result.error || 'Credenciales no válidas.');
    }
  };

  const { instance } = useMsal();

  const handleMicrosoftLogin = async () => {
    setError(null);
    setForgotNotice(null);
    setIsMsLoggingIn(true);
    try {
      // Use loginPopup instead of loginRedirect:
      // loginPopup opens a clean top-level window where Entra ID authentication works seamlessly.
      const response = await instance.loginPopup(loginRequest);


      const account = response.account;
      if (!account) {
        throw new Error('No se recibió información de la cuenta de Microsoft.');
      }

      // Check if user exists in local storage
      const users = storageService.getUsers();
      const userEmail = (account.username || '').toLowerCase();
      let matchedUser = users.find(u => u.email.toLowerCase() === userEmail);

      if (!matchedUser) {
        matchedUser = {
          id: `ms_${account.homeAccountId || Date.now()}`,
          name: account.name || account.username,
          email: account.username,
          company: 'Grupo Alviestetic',
          role: 'admin',
          assignedBrandIds: ['brand_1', 'brand_2', 'brand_3'],
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        storageService.saveUsers([...users, matchedUser]);
      }

      storageService.setCurrentUserId(matchedUser.id);
      storageService.addActivity({
        userId: matchedUser.id,
        userName: matchedUser.name,
        action: 'login',
        description: `Inicio de sesión con Microsoft 365 (${account.username})`
      });

      onLoginSuccess(matchedUser);
    } catch (err: unknown) {
      console.error('Error al iniciar sesión con Microsoft:', err);
      const errStr = err instanceof Error ? err.message : String(err);
      if (errStr.includes('user_cancelled')) {
        setError('El inicio de sesión fue cancelado por el usuario.');
      } else if (errStr.includes('popup_window_error') || errStr.includes('block')) {
        setError('El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes (popups) para este dominio e inténtalo de nuevo.');
      } else {
        setError(`Error Microsoft: ${errStr}`);
      }
    } finally {
      setIsMsLoggingIn(false);
    }
  };

  const handleAccess = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleQuickDemo = (userId: string) => {
    setError(null);
    setForgotNotice(null);
    const user = authService.loginDemoUser(userId);
    if (user) {
      onLoginSuccess(user);
    }
  };

  const handleForgotPassword = () => {
    setForgotNotice(
      'Simulación: Se ha generado una solicitud de restablecimiento para el administrador del portal. (Contraseña demo fija: Demo123!)'
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-9">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xl mb-3.5 shadow-xs">
            <Isotype className="w-7 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">Alviestetic</h1>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Portal privado de distribución de material gráfico y audiovisual por marcas
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs mb-4">
            {error}
          </div>
        )}
        {forgotNotice && (
          <div className="p-3 mb-4 text-xs bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">
            {forgotNotice}
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-4">
          {/* Microsoft 365 Login Button */}
          <button
            type="button"
            onClick={handleMicrosoftLogin}
            disabled={isMsLoggingIn}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-all shadow-xs mb-4 cursor-pointer disabled:opacity-60"
          >
            {isMsLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
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
                <span>Acceder con Microsoft 365</span>
              </>
            )}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3 text-[11px] uppercase tracking-wider text-slate-400 font-medium">o con credenciales</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Correo electrónico profesional
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Contraseña
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
              />
              <button
                type="button"
                className="absolute right-3 bg-transparent border-none text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center p-1"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAccess}
            className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold border-none cursor-pointer hover:bg-slate-800 transition-colors shadow-xs mt-2"
          >
            Acceder al Portal
          </button>
        </form>

        {/* Demo Accounts Switcher */}
        <div className="mt-7 pt-6 border-t border-slate-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
            Acceso Rápido con Cuentas Demo
          </div>
          <div className="grid grid-cols-1 gap-2">
            {INITIAL_USERS.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickDemo(user.id)}
                className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer text-left transition-colors hover:bg-blue-50/70 hover:border-blue-200"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{user.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {user.email} · {user.company}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${user.role === 'admin'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-200 text-slate-700'
                    }`}
                >
                  {user.role === 'admin' ? 'Admin' : 'Cliente'}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-center text-slate-400 mt-3">
            Contraseña de demostración: <code className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">Demo123!</code>
          </p>
        </div>
      </div>
    </div>
  );
};
