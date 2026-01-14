
import React from 'react';
import { FashionTool, AppView } from '../types';

interface SidebarProps {
  onHomeClick: () => void;
  onToolClick: (tool: FashionTool) => void;
  activeView: AppView;
  activeToolId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onHomeClick, onToolClick, activeView, activeToolId }) => {
  const sections = [
    {
      name: 'SURGICAL POWER TOOL',
      items: [
        { id: 'mannequin-remover', title: 'ISOLASI PNG', badge: 'PNG', category: 'SURGICAL' }
      ]
    },
    {
      name: 'KOLEKSI PRIA (REAL PHOTO)',
      items: [
        { id: 'koko-ai', title: 'BAJU KOKO STUDIO', badge: '9:16', category: 'PRIA' },
        { id: 'celana-pria', title: 'CELANA PRIA EDITOR', badge: 'PRO', category: 'PRIA' }
      ]
    },
    {
      name: 'KOLEKSI WANITA (REAL PHOTO)',
      items: [
        { id: 'gamis-ai', title: 'GAMIS LUXURY', badge: '9:16', category: 'WANITA' },
        { id: 'cewek-ai', title: 'BAJU CEWEK DESIGNER', badge: 'NEW', category: 'WANITA' }
      ]
    }
  ];

  return (
    <aside className="w-72 bg-[#080a0f] border-r border-white/5 flex flex-col h-full z-20">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-white leading-none">VOGUE<span className="text-emerald-500">AI</span></h1>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">SURGICAL VISUAL ENGINE</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-8">
        <button 
          onClick={onHomeClick}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeView === 'dashboard' ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
        </button>

        {sections.map((section) => (
          <div key={section.name} className="space-y-3">
            <p className="text-[9px] font-black text-slate-600 uppercase px-4 tracking-widest">{section.name}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onToolClick(item as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border ${
                    activeToolId === item.id
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/5'
                    : 'text-slate-500 border-transparent hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${activeToolId === item.id ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                    <span className="text-[10px] font-bold uppercase tracking-wide">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[7px] font-black border border-white/10 px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 mt-auto">
        <div className="bg-[#0c0f16] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[10px] font-black text-emerald-400">AI</div>
            <div>
              <p className="text-[9px] font-black text-white uppercase leading-none mb-1">Fashion Editor</p>
              <p className="text-[7px] text-emerald-500 font-bold uppercase tracking-widest">Gemini 3 Pro Active</p>
            </div>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
          </div>
          <p className="text-[7px] text-slate-600 font-bold uppercase mt-2 text-center tracking-widest">Engine Reliability 100%</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
