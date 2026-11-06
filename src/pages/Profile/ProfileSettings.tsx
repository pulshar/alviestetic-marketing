import React, { useState } from 'react';
import { User, Brand } from '../../types';
import { UserCheck, Shield, Building, Mail, Bell, RotateCcw, LogOut, Check } from 'lucide-react';

interface ProfileSettingsProps {
  currentUser: User;
  authorizedBrands: Brand[];
  onLogout: () => void;
  onResetDemoData: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  currentUser,
  authorizedBrands,
  onLogout,
  onResetDemoData
}) => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [webPush, setWebPush] = useState(true);
  const [batchDigest, setBatchDigest] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Perfil de Usuario & Configuración
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Información de la cuenta, permisos de marca asignados y preferencias de recepción de novedades.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <Check size={16} className="text-emerald-600" />
          <span>Preferencias guardadas correctamente en la sesión local.</span>
        </div>
      )}

      {/* User Info Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={
              currentUser.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border border-slate-200"
          />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
            <p className="text-xs text-slate-500">{currentUser.company}</p>
            <span className="inline-block mt-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white">
              {currentUser.role === 'admin' ? 'Administrador Corporativo' : 'Cliente Autorizado'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">Correo electrónico de acceso</span>
            <span className="font-semibold text-slate-800">{currentUser.email}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Estado de la cuenta</span>
            <span className="font-semibold text-emerald-600 uppercase">
              {currentUser.status} (Acceso Activo)
            </span>
          </div>
        </div>

        {/* Authorized Brands */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Marcas Vinculadas a tu Licencia
          </h3>
          <div className="flex flex-wrap gap-2">
            {authorizedBrands.map((b) => (
              <span
                key={b.id}
                className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
              >
                {b.name} ({b.category})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Preferences (Section 6.12 & Section 9 Web Push readiness) */}
      <form onSubmit={handleSaveNotifications} className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Preferencias de Notificaciones (Web Push & SharePoint)
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Configura cómo deseas recibir avisos cuando se publiquen nuevos lotes o campañas en las carpetas de SharePoint de tus marcas:
        </p>

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={webPush}
              onChange={(e) => setWebPush(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Notificaciones Web Push (Navegador)
              </span>
              <span className="text-[11px] text-slate-500 block">
                Recibe alertas instantáneas en tu equipo cuando el backend detecte nuevas cargas desde Power Automate.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={batchDigest}
              onChange={(e) => setBatchDigest(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Agrupación por lote o publicación
              </span>
              <span className="text-[11px] text-slate-500 block">
                Evita recibir un aviso por cada archivo suelto y agrupa las novedades en un único aviso por campaña.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Resumen por correo electrónico
              </span>
              <span className="text-[11px] text-slate-500 block">
                Envía una síntesis de nuevos recursos a {currentUser.email}.
              </span>
            </div>
          </label>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Guardar preferencias
          </button>
        </div>
      </form>

      {/* Demo Actions & Session Management */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 mb-0.5">Restaurar Datos de Demostración</h4>
          <p className="text-[11px] text-slate-500">
            Reinicia las modificaciones en clientes, marcas y lecturas de localStorage al estado original.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onResetDemoData}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw size={14} />
            Restaurar Demo
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
