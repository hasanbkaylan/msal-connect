import React, { useState } from 'react';
import type { SupabaseConfig } from '../../types/mastodon';
import { StorageService, SupabaseClientHelper } from '../../services/storage';
import { X, Database, CheckCircle, AlertCircle, RefreshCw, Moon, Sun, Monitor, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onConfigUpdated }) => {
  const [config, setConfig] = useState<SupabaseConfig>(StorageService.getSupabaseConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTheme, setActiveTheme] = useState(StorageService.getTheme());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await SupabaseClientHelper.testConnection(config.url, config.anonKey);
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    StorageService.saveSupabaseConfig({
      ...config,
      isConnected: testResult ? testResult.success : config.isConnected,
    });
    setSavedSuccess(true);
    onConfigUpdated?.();
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleThemeChange = (theme: string) => {
    setActiveTheme(theme);
    StorageService.saveTheme(theme);
  };

  const handleResetData = () => {
    if (window.confirm('Tüm veriler varsayılan Mehmet Serttaş Anadolu Lisesi (MSAL Connect) durumuna sıfırlansın mı?')) {
      StorageService.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#282c37] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Database className="text-[#6364ff]" size={22} />
            <h2 className="text-lg font-bold text-white">MSAL Connect Ayarları</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Supabase Integration Card */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white text-base">Supabase Entegrasyonu</h3>
                <p className="text-xs text-gray-400">
                  Şu anda sistem kesintisiz <span className="text-emerald-400 font-semibold">Demo / LocalStorage</span> verileriyle çalışmaktadır. Kendi Supabase projenizi bağlayabilirsiniz.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={config.url}
                  onChange={(e) => setConfig({ ...config, url: e.target.value })}
                  className="w-full bg-[#1e222a] border border-white/10 rounded-lg px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#6364ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Supabase Anon (Public) Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={config.anonKey}
                  onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
                  className="w-full bg-[#1e222a] border border-white/10 rounded-lg px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#6364ff]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing || !config.url || !config.anonKey}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 text-gray-200 text-xs font-medium cursor-pointer"
                >
                  {testing ? <RefreshCw className="animate-spin" size={14} /> : <Database size={14} />}
                  Bağlantıyı Test Et
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                    testResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-950/40 border-red-500/30 text-red-300'
                  }`}
                >
                  {testResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          </section>

          {/* Theme Selector */}
          <section className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="font-semibold text-white">Görünüm ve Tema</h3>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleThemeChange('mastodon-classic')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                  activeTheme === 'mastodon-classic'
                    ? 'border-[#6364ff] bg-[#6364ff]/10 text-white'
                    : 'border-white/10 bg-[#1e222a] text-gray-400 hover:text-white'
                }`}
              >
                <Monitor size={18} />
                <span className="text-xs font-medium">Mastodon Klasik</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                  activeTheme === 'dark'
                    ? 'border-[#6364ff] bg-[#6364ff]/10 text-white'
                    : 'border-white/10 bg-[#1e222a] text-gray-400 hover:text-white'
                }`}
              >
                <Moon size={18} />
                <span className="text-xs font-medium">Koyu Tema</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                  activeTheme === 'light'
                    ? 'border-[#6364ff] bg-[#6364ff]/10 text-white'
                    : 'border-white/10 bg-[#1e222a] text-gray-400 hover:text-white'
                }`}
              >
                <Sun size={18} />
                <span className="text-xs font-medium">Açık Tema</span>
              </button>
            </div>
          </section>

          {/* Reset Demo Data */}
          <section className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white text-xs">Okul Verilerini Sıfırla</p>
              <p className="text-[11px] text-gray-400">Varsayılan Mehmet Serttaş AL gönderi ve bildirimleri yüklenir.</p>
            </div>
            <button
              type="button"
              onClick={handleResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium cursor-pointer"
            >
              <RotateCcw size={13} /> Sıfırla
            </button>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#1f232b]">
          <span className="text-xs text-gray-400">
            {savedSuccess ? '✅ Başarıyla kaydedildi!' : 'GitHub Pages Uyumlu'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-medium cursor-pointer"
            >
              Kapat
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-[#6364ff] hover:bg-[#5657ea] text-white text-xs font-semibold cursor-pointer shadow-md"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
