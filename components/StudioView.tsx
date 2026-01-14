
import React, { useState, useRef, useEffect } from 'react';
import { FashionTool } from '../types';
import { GoogleGenAI } from "@google/genai";

interface StudioViewProps {
  tool: FashionTool | null;
  onBack: () => void;
}

const StudioView: React.FC<StudioViewProps> = ({ tool, onBack }) => {
  const isMannequinRemover = tool?.id === 'mannequin-remover';
  
  const [productImage, setProductImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [resultImages, setResultImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [comparisonMode, setComparisonMode] = useState<'single' | 'split'>('single');
  const [isPreviewingOriginal, setIsPreviewingOriginal] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResultImages([]);
    setProductImage(null);
    setGenerationProgress(0);
    setComparisonMode('single');
    setErrorMsg(null);

    const antiAiInstructions = " STRICTLY PHOTOREALISTIC. REAL HUMAN MODEL ONLY. NO CARTOON. NO ANIMATION. NO 3D RENDER. NO AI ART FILTERS. Professional studio lighting, sharp fabric textures, natural skin pores. NO SMOOTHED AI LOOK.";

    if (isMannequinRemover) {
      setPrompt('PIXEL-LOCK GHOST MANNEQUIN: Non-destructive isolation. MANDATORY: Keep 100% of the original dress silhouette, collar shape, buttons, and pleats. DO NOT change the design. ERASE ONLY skin, hands, and head. Replace skin with transparency. Fill internal voids with original dress texture. BACKGROUND: 100% TRANSPARENT.');
    } else if (tool?.id === 'koko-ai') {
      setPrompt('Premium Baju Koko on a real human male model. Vertical Portrait catalog.' + antiAiInstructions);
    } else if (tool?.id === 'gamis-ai') {
      setPrompt('Luxury Gamis on a real human female model. Elegant fabric drape. Vertical Portrait.' + antiAiInstructions);
    } else if (tool?.id === 'pants-men') {
      setPrompt('Premium trousers on a real human male model. Focus on realistic fabric fit. Vertical Portrait.' + antiAiInstructions);
    } else if (tool?.id === 'cewek-ai') {
      setPrompt('Modern female fashion outfit on a real human model. Professional editorial photography. Vertical Portrait.' + antiAiInstructions);
    } else {
      setPrompt('Professional fashion photography on a real human model. Vertical Portrait.' + antiAiInstructions);
    }
  }, [tool?.id]);

  const downloadImage = async (base64Data: string, filename: string) => {
    if (!base64Data) return;
    try {
      const parts = base64Data.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const uInt8Array = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; ++i) uInt8Array[i] = raw.charCodeAt(i);
      const blob = new Blob([uInt8Array], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => { document.body.removeChild(link); window.URL.revokeObjectURL(url); }, 100);
    } catch (e) {
      const link = document.createElement('a');
      link.href = base64Data;
      link.download = filename;
      link.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
        setResultImages([]);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current || comparisonMode !== 'split') return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  // Fix: Use GoogleGenAI type for the ai parameter
  const generateOutput = async (ai: GoogleGenAI, base64Data: string, mimeType: string) => {
    try {
      let finalPrompt = prompt;

      if (isMannequinRemover) {
        finalPrompt = `ACT AS A SURGICAL FASHION RETOUCHER. GHOST MANNEQUIN ISOLATION. 100% ORIGINAL GARMENT PRESERVATION. ERASE ONLY HUMAN PARTS. TRANSPARENT BACKGROUND.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: finalPrompt },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16",
            imageSize: "1K"
          }
        }
      });

      if (!response.candidates?.[0]?.content?.parts) throw new Error("Empty response from AI engine.");

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
      return null;
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("API key")) {
        if (window.aistudio) {
          await window.aistudio.openSelectKey();
        }
      }
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!productImage || !prompt) return;
    setIsGenerating(true);
    setResultImages([]);
    setErrorMsg(null);
    setGenerationProgress(10);

    try {
      // Inisialisasi GoogleGenAI tepat saat dibutuhkan untuk mendapatkan API_KEY terbaru
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = productImage.split(',')[1];
      const mimeType = productImage.split(',')[0].split(':')[1].split(';')[0];

      setGenerationProgress(40);
      const res = await generateOutput(ai, base64Data, mimeType);
      
      if (res) {
        setResultImages([res]);
        setGenerationProgress(100);
      } else {
        setErrorMsg("Gagal melakukan isolasi presisi. Coba gunakan foto yang lebih stabil.");
      }
    } catch (error: any) {
      console.error('Process failed:', error);
      setErrorMsg("Error: " + (error.message || "Gagal memproses detail pakaian."));
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  if (!tool) return null;

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest group">
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-indigo-500 transition-colors shadow-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </div>
        Kembali ke Beranda
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-4 space-y-6">
          <div className="p-8 bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-[32px] shadow-2xl relative overflow-hidden">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-black ${isMannequinRemover ? 'bg-indigo-500 shadow-indigo-500/30' : 'bg-slate-800'} text-white px-2.5 py-1 rounded-md uppercase tracking-widest`}>
                  {isMannequinRemover ? 'SURGICAL MODE' : 'PRO RENDER'}
                </span>
                <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md uppercase tracking-widest italic">MODA 3.2</span>
              </div>
              <h1 className="text-3xl font-black text-white mb-2 leading-tight tracking-tighter italic uppercase">{tool.title}</h1>
              <p className="text-slate-400 text-sm font-medium opacity-80 leading-relaxed">
                {isMannequinRemover ? 'Menghapus total anatomi dengan presisi piksel tinggi.' : 'Render model manusia asli dengan tekstur kain yang sangat nyata.'}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Upload Asset Fashion</label>
              <div onClick={() => fileInputRef.current?.click()} className={`relative h-64 border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center cursor-pointer transition-all ${productImage ? 'border-indigo-500/50 bg-slate-950 shadow-inner' : 'border-slate-800 hover:border-indigo-500/30 bg-slate-950/30'} group/upload overflow-hidden`}>
                {productImage ? <img src={productImage} alt="Input" className="w-full h-full object-contain p-4 transition-transform group-hover/upload:scale-105 duration-700" /> : (
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-indigo-500 transition-all duration-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <p className="text-slate-300 font-bold text-sm tracking-tight uppercase">Upload Foto Baju</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>
            </div>

            <button onClick={handleGenerate} disabled={isGenerating || !productImage} className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 disabled:cursor-not-allowed text-white font-black tracking-widest transition-all shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group/btn">
              <span className="flex items-center gap-3">
                {isGenerating ? <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                {isGenerating ? 'LOCKING PIXELS...' : (isMannequinRemover ? 'HAPUS BADAN (ULTRA-PRO)' : 'RENDER FOTO NYATA')}
              </span>
              {isGenerating && <div className="absolute bottom-0 left-0 h-1 bg-white/40 transition-all duration-300" style={{ width: `${generationProgress}%` }}></div>}
            </button>
            
            {errorMsg && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px] font-bold uppercase italic animate-in slide-in-from-top-2">
                {errorMsg}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-8 flex flex-col">
          <div className="flex items-center justify-between mb-8 px-4">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase flex items-center gap-3">
                {isMannequinRemover ? 'Precise Ghost Studio' : 'Render Result'}
                <span className="text-[10px] not-italic bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-400 border border-indigo-500/30 tracking-widest font-black uppercase">ULTRA HD</span>
              </h3>
            </div>
          </div>
          
          <div className={`flex-1 border border-slate-800/50 rounded-[48px] p-8 min-h-[640px] overflow-hidden flex flex-col items-center justify-center relative shadow-inner ${isMannequinRemover && resultImages.length > 0 ? 'bg-transparent' : 'bg-slate-900/40'}`}>
             {isMannequinRemover && (
               <div className="absolute inset-0 z-0 opacity-[0.35] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)', backgroundSize: '24px 24px' }}></div>
             )}

            {isGenerating && resultImages.length === 0 ? (
              <div className="text-center animate-in zoom-in duration-300 z-10">
                <div className="w-24 h-24 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin mb-8 mx-auto shadow-xl"></div>
                <h4 className="text-2xl font-black text-white mb-2 tracking-tighter italic uppercase">Processing Pixels...</h4>
              </div>
            ) : resultImages.length > 0 ? (
              <div className="w-full h-full z-10 grid grid-cols-1 animate-in zoom-in duration-1000">
                <div className="max-w-[440px] mx-auto w-full group relative aspect-[9/16] rounded-[40px] overflow-hidden border-4 border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.7)]">
                  <img src={resultImages[0]} alt="Result" className="w-full h-full object-contain p-6 z-10" />
                  <div className="absolute inset-0 z-20 bg-slate-950/95 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-8 backdrop-blur-xl p-12 pointer-events-none group-hover:pointer-events-auto">
                    <button onClick={() => downloadImage(resultImages[0], `modafx-ultra-hd-${Date.now()}.png`)} className="w-full py-5 bg-white text-slate-950 rounded-[24px] font-black text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-4 shadow-2xl pointer-events-auto uppercase tracking-widest">
                      Unduh PNG HD
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-30 z-10">
                <div className="w-40 h-40 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mb-10 mx-auto">
                   <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-slate-600 font-black uppercase tracking-[0.8em] text-[11px]">Ready for High-Fidelity Isolation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioView;
