
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
      name: 'STUDIO PRODUKSI',
      items: [
        { id: 'mannequin-remover', title: 'HAPUS MANEKIN', badge: '8K', category: 'SURGICAL' },
        { id: 'model-katalog', title: 'KATALOG MODEL AI', badge: 'PRO', category: 'CATALOG' },
        { id: 'lookbook-pro', title: 'EDITORIAL LOOKBOOK', badge: 'HD', category: 'EDITORIAL' }
      ]
    }
  ];

  return (
    <aside className="w-72 bg-[#050505] border-r border-white/5 flex flex-col h-full z-20 relative">
      <div className="p-10 pb-12">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={onHomeClick}>
          <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,245,255,0.2)] group-hover:scale-110 transition-all duration-500">
            <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-white leading-none italic uppercase">MODA<span className="text-cyan-400">FX</span></h1>
            <p className="text-[7px] text-cyan-500/40 font-black uppercase tracking-[0.4em] mt-2 italic">Visual Production Suite</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-12 space-y-12">
        <button 
          onClick={onHomeClick}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
            activeView === 'dashboard' ? 'bg-cyan-500/10 text-white border border-cyan-500/20' : 'text-slate-600 hover:text-white hover:bg-white/5'
          }`}
        >
          <svg className={`w-5 h-5 transition-colors ${activeView === 'dashboard' ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Dashboard Utama</span>
        </button>

        {sections.map((section) => (
          <div key={section.name} className="space-y-5">
            <p className="text-[8px] font-black text-slate-700 uppercase px-5 tracking-[0.4em] italic">{section.name}</p>
            <div className="space-y-2">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onToolClick(item as any)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 border group ${
                    activeToolId === item.id
                    ? 'bg-cyan-500/5 text-cyan-400 border-cyan-500/20'
                    : 'text-slate-600 border-transparent hover:bg-white/5 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeToolId === item.id ? 'bg-cyan-400 shadow-[0_0_8px_#00f5ff]' : 'bg-slate-800'}`}></div>
                    <span className="text-[11px] font-bold uppercase tracking-tight italic">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[7px] font-black bg-white/5 text-white/30 px-2 py-1 rounded-md group-hover:bg-cyan-500 group-hover:text-black transition-colors">{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 mt-auto border-t border-white/5">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <p className="text-[10px] font-black text-white uppercase mb-2 italic">STATUS ENGINE</p>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f5ff]"></div>
             <span className="text-[8px] text-cyan-400 font-black uppercase tracking-widest">NANO-FX READY</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
