
import React from 'react';
import { FashionTool } from '../types';
import FashionToolCard from './FashionToolCard';

interface DashboardProps {
  onLaunchTool: (tool: FashionTool) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLaunchTool }) => {
  const tools: FashionTool[] = [
    {
      id: 'mannequin-remover',
      title: 'ASSET ISOLATION',
      description: 'Surgical extraction of garments with perfect 8K Alpha transparency. Zero artifacts.',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>,
      category: 'SURGICAL',
      badge: '8K ULTIMATE'
    },
    {
      id: 'koko-ai',
      title: 'STREETWEAR FX',
      description: 'High-fidelity urban fashion rendering. Studio luxury lighting and macro fabric precision.',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      category: 'PRIA',
      badge: 'PREMIUM'
    },
    {
      id: 'gamis-ai',
      title: 'AVANT-GARDE',
      description: 'Vogue-grade couture production. Realistic draping and professional designer poses.',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      category: 'WANITA',
      badge: 'LUXURY'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-24">
      <section className="relative pt-32 pb-40 text-center rounded-[80px] bg-[#050505] border border-cyan-500/10 overflow-hidden cyan-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,245,255,0.05),transparent_60%)]"></div>
        <div className="relative z-10 px-8">
          <span className="text-[10px] font-black tracking-[1.5em] text-cyan-500 uppercase mb-8 block opacity-80 italic">Cyber-Fashion Visual Standard</span>
          <h1 className="text-[80px] md:text-[110px] font-black mb-10 tracking-[-0.05em] leading-[0.8] text-white uppercase italic">
            MODA<span className="cyan-text">FX</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg mb-14 font-medium leading-relaxed opacity-80">
            Automated production workspace for high-definition fashion catalogs. <br/> 
            <span className="text-cyan-400 font-black italic uppercase tracking-widest text-[10px] bg-cyan-500/5 px-6 py-2 rounded-full border border-cyan-500/20">Authorized Production Engine // Nano Banana 2.5</span>
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 pb-20">
        {tools.map(tool => (
          <FashionToolCard key={tool.id} tool={tool} onLaunch={() => onLaunchTool(tool)} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
