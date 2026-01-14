
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
      name: 'ISOLATION ENGINE',
      items: [
        { id: 'mannequin-remover', title: 'HD GHOST PNG', badge: '8K', category: 'SURGICAL' }
      ]
    },
    {
      name: 'MALE COLLECTION',
      items: [
        { id: 'koko-ai', title: 'ELITE KOKO', badge: 'PRO', category: 'PRIA' },
        { id: 'celana-pria', title: 'LUX TROUSERS', badge: 'HD', category: 'PRIA' }
      ]
    },
    {
      name: 'FEMALE COLLECTION',
      items: [
        { id: 'gamis-ai', title: 'GAMIS ROYALTY', badge: 'VOGUE', category: 'WANITA' },
        { id: 'cewek-ai', title: 'DESIGNER PIECES', badge: '4K', category: 'WANITA' }
      ]
    }
  ];

  return (
    <aside className="w-72 bg-[#080808] border-r border-white/5 flex flex-col h-full z-20 relative">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={onHomeClick}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#f7e1ad] to-[#d4af37] rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/20 group-hover:scale-105 transition-transform duration-500">
            <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-white leading-none italic uppercase">LUXE<span className="text-[#d4af37]">.AI</span></h1>
            <p className="text-[7px] text-slate-600 font-black uppercase tracking-[0.4em] mt-1.5">Elite Visual Engine</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-10 custom-scrollbar">
        <button 
          onClick={onHomeClick}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
            activeView === 'dashboard' ? 'bg-amber-500/10 text-white shadow-inner border border-amber-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <svg className={`w-5 h-5 transition-colors ${activeView === 'dashboard' ? 'text-amber-500' : 'group-hover:text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dashboard</span>
        </button>

        {sections.map((section) => (
          <div key={section.name} className="space-y-4">
            <p className="text-[8px] font-black text-slate-700 uppercase px-5 tracking-[0.3em]">{section.name}</p>
            <div className="space-y-1.5">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onToolClick(item as any)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 border group ${
                    activeToolId === item.id
                    ? 'bg-amber-500/5 text-amber-500 border-amber-500/30'
                    : 'text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeToolId === item.id ? 'bg-[#d4af37] shadow-[0_0_8px_#d4af37]' : 'bg-slate-800'}`}></div>
                    <span className="text-[11px] font-bold uppercase tracking-tight">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[7px] font-black border border-white/10 px-2 py-0.5 rounded bg-black/60 text-slate-400 group-hover:border-amber-500/30 group-hover:text-amber-500 transition-all">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 mt-auto border-t border-white/5 bg-[#050505]/50">
        <div className="bg-gradient-to-br from-[#111] to-[#080808] border border-white/5 rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-[11px] font-black text-amber-500 border border-amber-500/20 shadow-inner">8K</div>
            <div>
              <p className="text-[10px] font-black text-white uppercase leading-none mb-1.5 italic tracking-tighter">Pro Status</p>
              <p className="text-[7px] text-amber-500 font-black uppercase tracking-[0.2em] opacity-80">Unlimited Access</p>
            </div>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-[#d4af37] to-[#f7e1ad] w-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
