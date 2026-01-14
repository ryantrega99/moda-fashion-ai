
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
    // Selalu izinkan masuk ke Dashboard agar user bisa menggunakan openSelectKey() jika key env kosong
    const timer = setTimeout(() => {
      // Jika ada API_KEY di env, kita anggap authorized otomatis
      if (process.env.API_KEY && process.env.API_KEY !== "undefined" && process.env.API_KEY !== "") {
        setIsAuthorized(true);
      }
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleConnectEngine = () => {
    // Force enter the app immediately - users shouldn't be stuck on the gate
    setIsAuthorized(true);
    
    // Attempt key selection if platform allows
    if (window.aistudio?.openSelectKey) {
      window.aistudio.openSelectKey().catch((err) => {
        console.warn("Could not open key selector auto-magically:", err);
      });
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
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_15px_rgba(0,245,255,0.1)]"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center p-6 bg-cyber">
        <div className="max-w-md w-full bg-[#050505] border border-cyan-500/10 p-12 rounded-[50px] text-center cyan-glow animate-in fade-in zoom-in duration-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          
          <div className="w-24 h-24 bg-cyan-500/5 border border-cyan-500/20 rounded-[35px] flex items-center justify-center mx-auto mb-10 group shadow-inner">
            <svg className="w-10 h-10 text-cyan-400 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">
            MODA<span className="cyan-text">FX</span>
          </h1>
          
          <p className="text-slate-500 text-[11px] mb-12 uppercase tracking-widest leading-relaxed">
            Cyber-Fashion Asset Studio. <br/> Engine Siap Digunakan.
          </p>

          <button 
            onClick={handleConnectEngine}
            className="w-full py-6 bg-cyan-500 text-black rounded-3xl font-black uppercase tracking-[0.3em] hover:bg-white hover:shadow-[0_0_40px_rgba(0,245,255,0.5)] transition-all active:scale-95 text-[11px]"
          >
            LAUNCH MODAFX ENGINE
          </button>
          
          <p className="mt-10 text-[8px] text-cyan-500/30 uppercase tracking-[0.5em] font-black italic">
            Visual Suite v3.5 // NANO BANANA ENGINE
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-slate-100 overflow-hidden">
      <Sidebar 
        onHomeClick={handleGoHome} 
        activeView={activeView} 
        onToolClick={handleLaunchTool}
        activeToolId={selectedTool?.id}
      />
      <main className="flex-1 flex flex-col overflow-y-auto relative bg-cyber">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-black/80 backdrop-blur-2xl sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <div className="h-1 w-10 bg-cyan-500/30 rounded-full"></div>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">
              {activeView === 'dashboard' ? 'MODAFX // CORE SYSTEM' : `STUDIO // ${selectedTool?.title}`}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 px-6 py-2.5 bg-cyan-500/5 rounded-full border border-cyan-500/10">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f5ff]"></div>
                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest italic">NANO-FX ENGINE ACTIVE</span>
             </div>
          </div>
        </header>
        <div className="p-12">
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
