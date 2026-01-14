
import React from 'react';
import { FashionTool } from '../types';

interface FashionToolCardProps {
  tool: FashionTool;
  onLaunch: () => void;
}

const FashionToolCard: React.FC<FashionToolCardProps> = ({ tool, onLaunch }) => {
  return (
    <div className="group bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
      {/* Badge */}
      {tool.badge && (
        <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg shadow-indigo-500/20 uppercase">
          {tool.badge}
        </div>
      )}

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
        {tool.icon}
      </div>

      <div className="flex-1">
        <h4 className="text-lg font-bold mb-3 group-hover:text-indigo-400 transition-colors">{tool.title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">{tool.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onLaunch}
          className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 group/btn"
        >
          Launch Studio
          <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
        <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FashionToolCard;
