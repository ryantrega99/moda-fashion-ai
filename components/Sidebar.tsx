
import React from 'react';
import { Category, FashionTool, AppView } from '../types';

interface SidebarProps {
  onHomeClick: () => void;
  onToolClick: (tool: FashionTool) => void;
  activeView: AppView;
  activeToolId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onHomeClick, onToolClick, activeView, activeToolId }) => {
  const powerTools: FashionTool[] = [
    {
      id: 'mannequin-remover',
      title: 'Manequin Remover',
      description: 'Hapus total manekin & limb dengan output HD PNG transparan.',
      category: Category.VISUAL,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      badge: 'PNG'
    }
  ];

  const categories = [
    {
      name: 'KOLEKSI PRIA (REAL PHOTO)',
      items: [
        { id: 'koko-ai', title: 'Baju Koko Studio', category: Category.STYLING, badge: '9:16' },
        { id: 'pants-men', title: 'Celana Pria Editor', category: Category.STYLING },
      ]
    },
    {
      name: 'KOLEKSI WANITA (REAL PHOTO)',
      items: [
        { id: 'gamis-ai', title: 'Gamis Luxury', category: Category.STYLING, badge: '9:16' },
        { id: 'cewek-ai', title: 'Baju Cewek Designer', category: Category.STYLING, badge: 'NEW' },
      ]
    }
  ];

  return (
    <aside className="w-72 bg-[#020617] border-r border-slate-900 flex flex-col h-full shadow-2xl z-20 relative">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0014 20.222m1.962-14.24a2 2 0 01.813 3.946l-4.54 2.126a3 3 0 00-1.744 3.128l.45 4.512M12 3v3m3-3v3M9 3v3" />
            </svg>
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-white">MODA<span className="text-indigo-500 italic">FX</span></h1>
            <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.3em]">Anti-AI Visual Engine</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-8 mt-2">
        <div>
          <button 
            onClick={onHomeClick}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              activeView === 'dashboard' 
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black text-indigo-400 uppercase mb-1 px-2 tracking-[0.2em]">Surgical Power Tool</p>
          {powerTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => onToolClick(tool)}
              className={`w-full flex items-center justify-between px-3 py-4 rounded-2xl transition-all border relative overflow-hidden group ${
                activeToolId === tool.id
                ? 'bg-white text-slate-950 border-white shadow-2xl scale-[1.02]'
                : 'bg-indigo-500/5 text-indigo-400 border-indigo-500/10 hover:bg-indigo-500/10 hover:border-indigo-500/30'
              }`}
            >
              {activeToolId === tool.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 animate-pulse"></div>
              )}
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg transition-colors ${activeToolId === tool.id ? 'bg-slate-950/10' : 'bg-indigo-500/10'}`}>
                  {tool.icon}
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black block tracking-tight uppercase">ISOLASI PNG</span>
                  <span className="text-[8px] opacity-60 font-black block uppercase italic">Ghost Mannequin</span>
                </div>
              </div>
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded transition-colors ${activeToolId === tool.id ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'}`}>PNG</span>
            </button>
          ))}
        </div>

        {categories.map((cat) => (
          <div key={cat.name}>
            <p className="text-[10px] font-bold text-slate-600 uppercase mb-3 px-2 tracking-[0.2em]">{cat.name}</p>
            <div className="space-y-1">
              {cat.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onToolClick(item as FashionTool)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group relative ${
                    activeToolId === item.id
                    ? 'bg-slate-900 text-white border border-slate-800 shadow-lg'
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                  }`}
                >
                   {activeToolId === item.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-500 rounded-full"></div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${activeToolId === item.id ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-800 group-hover:bg-indigo-500'}`}></div>
                    <span className="text-xs font-bold uppercase tracking-tight">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[7px] font-black border px-1.5 py-0.5 rounded uppercase ${activeToolId === item.id ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
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
        <div className="p-4 bg-slate-900/40 rounded-3xl border border-slate-900/50 flex flex-col gap-3">
           <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-[10px] text-indigo-400 shadow-inner">FX</div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-tighter">Fashion Editor</p>
              <p className="text-[8px] text-indigo-400 font-bold uppercase">NANO BANANA ACTIVE</p>
            </div>
           </div>
           <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
             <div className="w-[100%] h-full bg-gradient-to-r from-indigo-500 to-indigo-300"></div>
           </div>
           <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest text-center">Engine Reliability 100%</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
