
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudioView from './components/StudioView';
import { AppView, FashionTool } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [selectedTool, setSelectedTool] = useState<FashionTool | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      // Tunggu sebentar untuk memastikan window.aistudio terinjeksi
      setTimeout(async () => {
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (hasKey && process.env.API_KEY) {
            setIsAuthorized(true);
          }
        } else if (process.env.API_KEY) {
          // Fallback jika API_KEY sudah ada di env Vercel
          setIsAuthorized(true);
        }
        setIsLoading(false);
      }, 500);
    };
    initAuth();
  }, []);

  const handleConnectEngine = async () => {
    setIsConnecting(true);
    
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Asumsi sukses sesuai protokol untuk menghindari race condition
        setIsAuthorized(true);
      } catch (err) {
        console.error("Gagal membuka pemilihan kunci:", err);
        alert("Gagal menghubungkan ke Google AI Studio. Pastikan browser Anda mendukung.");
      } finally {
        setIsConnecting(false);
      }
    } else {
      // Jika diakses di luar lingkungan AI Studio
      setIsConnecting(false);
      alert("Lingkungan Google AI Studio tidak terdeteksi. Silakan buka aplikasi ini melalui dashboard AI Studio atau pastikan API Key sudah terpasang di Vercel Environment Variables.");
    }
  };

  const handleLaunchTool = (tool: FashionTool) => {
    setSelectedTool(tool);
    setActiveView('studio');
  };

  const handleGoHome = () => {
    setActiveView('dashboard');
    setSelectedTool(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] animate-pulse">Initializing Luxe Engine...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center p-6 bg-luxury">
        <div className="max-w-md w-full bg-[#080808] border border-white/5 p-12 rounded-[48px] text-center gold-glow animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 bg-gradient-to-br from-[#f7e1ad] to-[#d4af37] rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <svg className="w-10 h-10 text-black relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
            </svg>
          </div>
          
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">
            LUXE<span className="gold-text">.AI</span>
          </h1>
          
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 mb-10">
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Engine memerlukan <span className="text-amber-500 font-bold">API Key Gratis</span> untuk memproses render Ultra HD 8K.
            </p>
          </div>

          <button 
            onClick={handleConnectEngine}
            disabled={isConnecting}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${
              isConnecting 
              ? 'bg-white/10 text-slate-500 cursor-not-allowed' 
              : 'bg-[#d4af37] text-black hover:bg-white hover:shadow-amber-500/20'
            }`}
          >
            {isConnecting ? (
              <div className="w-5 h-5 border-2 border-slate-500/20 border-t-slate-500 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            )}
            {isConnecting ? 'CONNECTING...' : 'CONNECT STUDIO ENGINE'}
          </button>
          
          <div className="mt-10 space-y-3">
            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-black">
              Get Free Key: <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-amber-500 underline decoration-amber-500/30 hover:decoration-amber-500 transition-all">Google AI Studio</a>
            </p>
            <p className="text-[8px] text-slate-700 uppercase tracking-[0.2em]">Authorized Professional Visual Suite v3.2</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-slate-100 overflow-hidden">
      <Sidebar 
        onHomeClick={handleGoHome} 
        activeView={activeView} 
        onToolClick={handleLaunchTool}
        activeToolId={selectedTool?.id}
      />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#050505]/80 backdrop-blur-3xl sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
              {activeView === 'dashboard' ? 'LUXE.AI // CORE ENGINE' : `STUDIO // ${selectedTool?.title}`}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-500/5 rounded-full border border-amber-500/10 shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]"></div>
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic">8K NANO FLASH ACTIVE</span>
             </div>
          </div>
        </header>
        <div className="p-10">
          {activeView === 'dashboard' ? (
            <Dashboard onLaunchTool={handleLaunchTool} />
          ) : (
            <StudioView tool={selectedTool} onBack={handleGoHome} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
