import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MSAL Connect Yakalanmamış Hata:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#191b22] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#282c37] border border-white/10 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle size={32} />
            </div>

            <h1 className="text-xl font-bold mb-2">MSAL Connect Yüklenirken Bir Sorun Oluştu</h1>
            <p className="text-sm text-gray-300 mb-6">
              Mehmet Serttaş Anadolu Lisesi sosyal ağı yüklenirken beklenmedik bir durumla karşılaşıldı.
              Verileri sıfırlayarak veya sayfayı yenileyerek devam edebilirsiniz.
            </p>

            {this.state.error && (
              <div className="bg-[#1e222a] border border-white/5 rounded-lg p-3 mb-6 text-left overflow-auto max-h-32 text-xs text-red-300 font-mono">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#6364ff] hover:bg-[#5657ea] text-white font-semibold text-sm transition-all cursor-pointer"
              >
                <RefreshCw size={16} />
                <span>Sayfayı Yenile</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition-all cursor-pointer border border-white/10"
              >
                <Trash2 size={16} />
                <span>Verileri Sıfırla ve Başlat</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
