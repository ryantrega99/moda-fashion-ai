
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
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        onHomeClick={handleGoHome} 
        activeView={activeView} 
        onToolClick={handleLaunchTool}
        activeToolId={selectedTool?.id}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-slate-400">
              {activeView === 'dashboard' ? 'Dashboard Overview' : `Studio / ${selectedTool?.title}`}
            </h2>
            <span className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 font-black uppercase tracking-widest">
              MODA PRO v3.2
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold hover:bg-slate-800 transition-colors uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>
              Global Style
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-l border-slate-800 pl-4 uppercase tracking-wider">
              <span>ID</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </header>

        {/* View Rendering */}
        <div className="p-8">
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
