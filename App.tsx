
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

  useEffect(() => {
    const checkAuth = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsAuthorized(hasKey);
      } else {
        // Fallback for non-AI Studio environments if needed
        setIsAuthorized(!!process.env.API_KEY);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleConnectEngine = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Per aturan: asumsikan sukses setelah membuka dialog untuk menghindari race condition
      setIsAuthorized(true);
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
        <div className="w-12 h-12 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center p-6 bg-luxury">
        <div className="max-w-md w-full bg-[#080808] border border-white/5 p-12 rounded-[48px] text-center gold-glow">
          <div className="w-20 h-20 bg-gradient-to-br from-[#f7e1ad] to-[#d4af37] rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">LUXE<span className="gold-text">.AI</span></h1>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
            Engine memerlukan otorisasi API Key untuk memproses render 8K. Silakan hubungkan project Anda.
          </p>
          <button 
            onClick={handleConnectEngine}
            className="w-full py-5 bg-[#d4af37] text-black rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl active:scale-95"
          >
            Connect Studio Engine
          </button>
          <p className="mt-8 text-[9px] text-slate-600 uppercase tracking-widest font-bold">
            Required: <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-amber-500 underline">Paid GCP Project Key</a>
          </p>
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
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#050505]/80 backdrop-blur-2xl sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              {activeView === 'dashboard' ? 'LUXE.AI OVERVIEW' : `STUDIO / ${selectedTool?.title}`}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/5 rounded-full border border-amber-500/10">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic">NANO BANANA 2.5 ACTIVE</span>
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
