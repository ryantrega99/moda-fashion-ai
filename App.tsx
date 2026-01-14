
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudioView from './components/StudioView';
import { AppView, FashionTool } from './types';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [selectedTool, setSelectedTool] = useState<FashionTool | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>(localStorage.getItem('vogue_api_key') || '');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(true);

  // Synchronize authorization state
  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);
      
      // 1. AI Studio Environment
      if (window.aistudio) {
        const hasStudioKey = await window.aistudio.hasSelectedApiKey();
        if (hasStudioKey) {
          setIsAuthorized(true);
          setIsChecking(false);
          return;
        }
      }

      // 2. Vercel Env Variable
      const envKey = process.env.API_KEY;
      if (envKey && envKey !== 'undefined' && envKey.length > 5) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // 3. Manual Entry
      if (userApiKey && userApiKey.trim().length > 10) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [userApiKey]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as any).elements.apiKey.value;
    if (input.trim()) {
      localStorage.setItem('vogue_api_key', input);
      setUserApiKey(input);
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

  const getEffectiveApiKey = () => {
    return userApiKey || process.env.API_KEY || '';
  };

  if (isChecking) return <div className="h-screen bg-[#050505] flex items-center justify-center text-emerald-500 font-black tracking-widest animate-pulse uppercase italic">V-Engine Loading...</div>;

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-emerald-500/10 rounded-[48px] p-12 text-center shadow-2xl relative overflow-hidden emerald-glow">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
          <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-emerald-500/20">
            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">Engine Locked</h1>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
            VOGUE AI memerlukan <span className="text-emerald-400 font-bold italic">Gemini API Key</span> untuk menjalankan render di Vercel.
          </p>
          <form onSubmit={handleSaveKey} className="space-y-4">
            <input 
              name="apiKey"
              type="password"
              placeholder="Masukkan API Key Anda..."
              className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
              required
            />
            <button 
              type="submit"
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[24px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
            >
              Buka Akses Engine
            </button>
          </form>
          <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-slate-700">
            Belum punya kunci? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">Dapatkan Gratis →</a>
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
              {activeView === 'dashboard' ? 'V-ENGINE OVERVIEW' : `STUDIO / ${selectedTool?.title}`}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest italic">V-ENGINE ACTIVE</span>
             </div>
             <button 
              onClick={() => { localStorage.removeItem('vogue_api_key'); setUserApiKey(''); window.location.reload(); }}
              className="text-[9px] font-black text-slate-600 hover:text-red-500 transition-colors uppercase tracking-widest"
             >
              Reset Key
             </button>
          </div>
        </header>
        <div className="p-10">
          {activeView === 'dashboard' ? (
            <Dashboard onLaunchTool={handleLaunchTool} />
          ) : (
            <StudioView tool={selectedTool} onBack={handleGoHome} apiKey={getEffectiveApiKey()} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
