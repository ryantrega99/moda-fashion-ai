
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
      name: 'PREMIUM MALE (HD)',
      items: [
        { id: 'koko-ai', title: 'ELITE KOKO RENDER', badge: 'PRO', category: 'PRIA' },
        { id: 'celana-pria', title: 'LUX TROUSERS', badge: 'HD', category: 'PRIA' }
      ]
    },
    {
      name: 'PREMIUM FEMALE (HD)',
      items: [
        { id: 'gamis-ai', title: 'GAMIS ROYALTY', badge: 'VOGUE', category: 'WANITA' },
        { id: 'cewek-ai', title: 'DESIGNER PIECES', badge: '4K', category: 'WANITA' }
      ]
    }
  ];

  return (
    <aside className="w-72 bg-[#080808] border-r border-white/5 flex flex-col h-full z-20">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#f7e1ad] to-[#d4af37] rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/10">
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tighter text-white leading-none">LUXE<span className="text-[#d4af37]">.AI</span></h1>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">HD Visual Suite</p>
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
          <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
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
                    ? 'bg-amber-500/5 text-[#d4af37] border-amber-500/20'
                    : 'text-slate-500 border-transparent hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-1 rounded-full ${activeToolId === item.id ? 'bg-[#d4af37]' : 'bg-slate-800'}`}></div>
                    <span className="text-[10px] font-bold uppercase tracking-wide">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[7px] font-black border border-white/5 px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
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
        <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/5 flex items-center justify-center text-[10px] font-black text-amber-500">HD</div>
            <div>
              <p className="text-[9px] font-black text-white uppercase leading-none mb-1">Lux Engine</p>
              <p className="text-[7px] text-amber-500/80 font-bold uppercase tracking-widest">Active 8K Mode</p>
            </div>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#d4af37] w-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
