
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudioView from './components/StudioView';
import { AppView, FashionTool } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [selectedTool, setSelectedTool] = useState<FashionTool | null>(null);

  const handleLaunchTool = (tool: FashionTool) => {
    setSelectedTool(tool);
    setActiveView('studio');
  };

  const handleGoHome = () => {
    setActiveView('dashboard');
    setSelectedTool(null);
  };

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
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic">NANO BANANA ACTIVE</span>
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
