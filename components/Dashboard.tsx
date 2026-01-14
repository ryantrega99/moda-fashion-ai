
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
      title: 'ISOLASI PNG',
      description: 'Ekstraksi Ghost Mannequin bedah dengan transparansi alfa 100%. Cocok untuk katalog e-commerce.',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>,
      category: 'SURGICAL',
      badge: 'SURGICAL'
    },
    {
      id: 'koko-ai',
      title: 'BAJU KOKO STUDIO',
      description: 'Rendering katalog fashion pria ultra-realistik. Tekstur tekstil fidelitas tinggi dan pencahayaan studio mewah.',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      category: 'PRIA',
      badge: 'HD RENDER'
    },
    {
      id: 'cewek-ai',
      title: 'BAJU CEWEK DESIGNER',
      description: 'Render model manusia asli dengan tekstur kain yang sangat nyata dan pose high-fashion profesional.',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      category: 'WANITA',
      badge: 'NEW ARRIVAL'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-24">
      <section className="relative pt-32 pb-40 text-center rounded-[80px] bg-[#0a0a0a] border border-white/5 overflow-hidden emerald-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_60%)]"></div>
        <div className="relative z-10 px-8">
          <span className="text-[11px] font-black tracking-[1em] text-emerald-500 uppercase mb-8 block opacity-80 italic">Precision Fashion Intelligence</span>
          <h1 className="text-[80px] md:text-[120px] font-black mb-10 tracking-[-0.05em] leading-[0.8] text-white italic uppercase">
            ULTRA<br/><span className="text-emerald-500">FIDELITY</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl mb-14 font-medium leading-relaxed opacity-70">
            Professional AI suite for high-end fashion houses. <br/> 
            <span className="text-white font-black italic uppercase tracking-widest text-sm bg-white/5 px-4 py-1 rounded-full border border-white/10">Commercial Grade Production.</span>
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
        {tools.map(tool => (
          <FashionToolCard key={tool.id} tool={tool} onLaunch={() => onLaunchTool(tool)} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
