
import React from 'react';
import { FashionTool } from '../types';

interface FashionToolCardProps {
  tool: FashionTool;
  onLaunch: () => void;
}

const FashionToolCard: React.FC<FashionToolCardProps> = ({ tool, onLaunch }) => {
  return (
    <div className="group bg-black border border-white/5 p-10 rounded-[48px] hover:border-cyan-500/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden cyan-glow">
      {tool.badge && (
        <div className="absolute top-8 right-8 bg-cyan-500 text-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic z-10">
          {tool.badge}
        </div>
      )}

      <div className="w-14 h-14 rounded-[22px] bg-white/5 flex items-center justify-center text-cyan-400 mb-8 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500 z-10">
        {tool.icon}
      </div>

      <div className="flex-1 z-10">
        <h4 className="text-2xl font-black mb-4 group-hover:text-cyan-400 transition-colors uppercase italic tracking-tighter text-white">{tool.title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">{tool.description}</p>
      </div>

      <button 
        onClick={onLaunch}
        className="w-full py-5 rounded-[24px] bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-cyan-500 hover:text-black flex items-center justify-center gap-4 group/btn active:scale-95 z-10"
      >
        Enter Studio
        <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
};

export default FashionToolCard;
