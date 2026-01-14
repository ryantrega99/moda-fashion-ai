
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
    // Check if we already have an API key (e.g., set via Vercel Env Vars)
    if (process.env.API_KEY) {
      setIsAuthorized(true);
    }
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleConnectEngine = async () => {
    // Proceed immediately to satisfy "easy entry" and prevent "stuck" UI
    setIsAuthorized(true);
    
    // Trigger the key selection dialog if the platform supports it
    if (window.aistudio?.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
      } catch (err) {
        console.warn("Key selection dialog could not be opened.", err);
      }
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
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/5 p-12 rounded-[60px] text-center shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[40px] flex items-center justify-center mx-auto mb-10">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
            </svg>
          </div>
          
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">
            LUXE<span className="text-white/40">.AI</span>
          </h1>
          
          <p className="text-white/40 text-[11px] mb-12 uppercase tracking-widest leading-relaxed">
            Professional 8K Fashion Studio. <br/> Hubungkan Engine untuk Memulai.
          </p>

          <button 
            onClick={handleConnectEngine}
            className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all active:scale-95 text-[11px] shadow-2xl"
          >
            CONNECT STUDIO ENGINE
          </button>
          
          <p className="mt-10 text-[8px] text-white/10 uppercase tracking-[0.4em] font-black italic">
            Visual Production Suite v3.2
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
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-black/60 backdrop-blur-3xl sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <div className="h-1 w-10 bg-white/20 rounded-full"></div>
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
              {activeView === 'dashboard' ? 'CORE SYSTEM // ROOT' : `STUDIO // ${selectedTool?.title}`}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest italic">8K ENGINE READY</span>
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
