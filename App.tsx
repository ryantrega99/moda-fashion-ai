
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
    // Initial loading sequence
    const init = () => {
      if (process.env.API_KEY) {
        setIsAuthorized(true);
      }
      setIsLoading(false);
    };
    const timer = setTimeout(init, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleConnectEngine = () => {
    // CRITICAL FIX: Proceed to app immediately. 
    // This solves the issue where the button "doesn't go anywhere" in Vercel.
    setIsAuthorized(true);
    
    // Attempt selector only if available
    if (window.aistudio?.openSelectKey) {
      window.aistudio.openSelectKey().catch(() => {});
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
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-[3px] border-white/5 border-t-white rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] animate-pulse">LUXE.AI INITIALIZING</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/5 p-12 rounded-[50px] text-center shadow-2xl animate-in fade-in zoom-in duration-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[35px] flex items-center justify-center mx-auto mb-10 shadow-inner group">
            <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
            </svg>
          </div>
          
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">
            LUXE<span className="text-white/40">.AI</span>
          </h1>
          
          <p className="text-white/40 text-[11px] mb-12 leading-relaxed font-medium px-6 uppercase tracking-widest">
            Elite Visual Studio. <br/> Hubungkan Engine untuk Melanjutkan.
          </p>

          <button 
            onClick={handleConnectEngine}
            className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] hover:bg-[#eee] transition-all duration-300 shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 text-[11px]"
          >
            CONNECT STUDIO ENGINE
          </button>
          
          <div className="mt-12 space-y-3">
            <p className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-black">
              AUTHORIZED: <span className="text-white/60 font-bold underline">FREE & PAID KEY SUPPORTED</span>
            </p>
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
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-black/60 backdrop-blur-3xl sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <div className="h-1 w-10 bg-white/20 rounded-full"></div>
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
              {activeView === 'dashboard' ? 'CORE SYSTEM // ROOT' : `STUDIO // ${selectedTool?.title}`}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 rounded-full border border-white/10 shadow-inner group">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest italic">8K NANO FLASH ACTIVE</span>
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
