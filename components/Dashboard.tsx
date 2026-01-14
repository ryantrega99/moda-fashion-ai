
import React from 'react';
import { FashionTool, Category } from '../types';
import FashionToolCard from './FashionToolCard';

interface DashboardProps {
  onLaunchTool: (tool: FashionTool) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLaunchTool }) => {
  const tools: FashionTool[] = [
    {
      id: 'koko-ai',
      title: 'Baju Koko Studio',
      description: 'Render katalog Baju Koko dengan model manusia asli. Tekstur tajam & kualitas foto studio.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      category: Category.STYLING,
      badge: 'REAL PHOTO'
    },
    {
      id: 'gamis-ai',
      title: 'Gamis Luxury',
      description: 'Spesialis Gamis & Abaya. Simulasi bahan premium pada model manusia asli, bukan kartun.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      category: Category.STYLING,
      badge: 'BOUTIQUE'
    },
    {
      id: 'cewek-ai',
      title: 'Baju Cewek Designer',
      description: 'Ubah atasan & blouse menjadi visual katalog OOTD yang sangat realistis & profesional.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      category: Category.STYLING,
      badge: 'TRENDING'
    },
    {
      id: 'pants-men',
      title: 'Celana Pria Editor',
      description: 'Detailing khusus celana dengan fokus pada fit dan tekstur bahan katun/denim asli.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 11-4.243-4.243 3 3 0 014.243 4.243z" />
        </svg>
      ),
      category: Category.STYLING
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="mb-16 text-center py-28 px-10 rounded-[64px] bg-slate-900/50 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-600/10 blur-[180px] -z-10 rounded-full"></div>
        
        <span className="text-[10px] font-black tracking-[0.6em] text-indigo-400 uppercase mb-8 block">Pro Fashion Photography Suite</span>
        <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.9] text-white italic uppercase">
          Real Human <br/> <span className="text-indigo-500">Anti-AI Visuals</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-xl mb-14 font-medium leading-relaxed opacity-80">
          Ubah katalog fashion Anda menjadi foto model manusia asli 9:16. <br/> <span className="text-white font-bold">No Cartoons. No Animation. Pure Realistic Quality.</span>
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex -space-x-4 overflow-hidden">
            {[10, 20, 30, 40, 50].map(i => (
              <img key={i} className="inline-block h-12 w-12 rounded-full ring-4 ring-slate-950 object-cover grayscale hover:grayscale-0 transition-all cursor-pointer" src={`https://picsum.photos/128/128?random=${i}`} alt="" />
            ))}
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]"><span className="text-indigo-400">Trusted By 200+</span> Luxury Fashion Brands</p>
        </div>
      </section>

      {/* Grid Section */}
      <div className="space-y-20">
        <div>
          <div className="flex items-center gap-5 mb-12 px-2">
            <div className="h-10 w-2 bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)]"></div>
            <h3 className="text-3xl font-black tracking-tighter text-white italic uppercase">Realistic Render Studios</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {tools.map(tool => (
              <FashionToolCard key={tool.id} tool={tool} onLaunch={() => onLaunchTool(tool)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
