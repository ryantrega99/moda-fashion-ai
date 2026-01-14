
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
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResultImage(null);
    setProductImage(null);
    setErrorMsg(null);

    const hdQuality = "8K ULTIMATE RESOLUTION, HYPER-REALISTIC, MACRO FABRIC DETAIL, PROFESSIONAL STUDIO LIGHTING, NO COMPRESSION.";

    if (isMannequinRemover) {
      setPrompt(`${hdQuality} GHOST MANNEQUIN: Extract clothing. Remove 100% of human model. Create a hollow 3D effect for the garment. 100% TRANSPARENT BACKGROUND.`);
    } else {
      setPrompt(`${hdQuality} PREMIUM FASHION RENDER: High-end model wearing the garment, sophisticated pose, elegant studio background, soft cinematic lighting.`);
    }
  }, [tool?.id]);

  const handleUpdateKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setErrorMsg("Kunci telah diperbarui. Silakan coba render kembali.");
    }
  };

  const handleGenerate = async () => {
    if (!productImage || !prompt) return;
    setIsGenerating(true);
    setResultImage(null);
    setErrorMsg(null);

    try {
      // Per aturan: Instance harus dibuat tepat sebelum pemanggilan API
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const base64Data = productImage.split(',')[1];
      const mimeType = productImage.split(',')[0].split(':')[1].split(';')[0];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', // Nano Banana
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: prompt },
          ],
        },
        config: { 
          imageConfig: { 
            aspectRatio: "9:16"
          }
        }
      });

      if (!response || !response.candidates || response.candidates.length === 0) {
        throw new Error("Engine tidak memberikan respon visual.");
      }

      const candidate = response.candidates[0];
      
      if (candidate.finishReason === 'SAFETY') {
        throw new Error("SAFETY BLOCK: Gambar ini dibatasi oleh aturan keamanan AI.");
      }

      // Robust extraction: Mencari inlineData di semua part yang ada
      let foundImage = false;
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            setResultImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        const textFallback = candidate.content.parts.find(p => p.text);
        if (textFallback?.text) {
          throw new Error(`AI Respon: "${textFallback.text.substring(0, 100)}..."`);
        }
        throw new Error("Render Gagal: Output gambar tidak ditemukan dalam respon.");
      }

    } catch (error: any) {
      console.error('Luxe Studio Error:', error);
      
      const errorStr = error.message || "";
      if (errorStr.includes('429')) {
        setErrorMsg("LIMIT TERCAPAI: Kuota API Key ini telah habis.");
      } else if (errorStr.includes('API Key') || errorStr.includes('403')) {
        setErrorMsg("KUNCI TIDAK VALID: Silakan pilih API Key yang aktif.");
      } else {
        setErrorMsg("ERROR ENGINE: " + (errorStr || "Gagal memproses data visual."));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!tool) return null;

  return (
    <div className="flex h-full w-full gap-8 animate-in fade-in duration-500">
      <div className="w-[450px] flex flex-col gap-6">
        <div className="bg-[#080808] border border-white/5 rounded-[32px] p-8 flex flex-col h-full shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic">8K Nano Pro</span>
            <span className="bg-white/5 text-slate-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Master Studio</span>
          </div>

          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">{tool.title}</h2>
          <p className="text-slate-500 text-[11px] font-medium mb-10 leading-relaxed">
            {isMannequinRemover 
              ? "Surgical isolation engine. Menghasilkan aset pakaian tanpa model manusia dengan presisi pixel sempurna."
              : "Studio rendering engine. Menciptakan visual model profesional dengan detail kain makro."}
          </p>

          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Source Material</p>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${productImage ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/5 hover:border-amber-500/20'}`}
              >
                {productImage ? (
                  <img src={productImage} alt="Input" className="h-full w-full object-contain p-4" />
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-amber-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Product Photo</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setProductImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} className="hidden" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Neural Directives</p>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-6 text-[11px] font-medium text-slate-400 focus:outline-none focus:border-amber-500/30 leading-relaxed"
              />
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !productImage}
              className="w-full py-5 bg-[#d4af37] hover:bg-[#c49b2d] disabled:opacity-20 text-black rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              )}
              {isMannequinRemover ? 'EXECUTE ISOLATION' : 'EXECUTE RENDER'}
            </button>

            {errorMsg && (
              <div className="space-y-3">
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-center">
                  <p className="text-[10px] text-red-400 font-black uppercase">{errorMsg}</p>
                </div>
                {(errorMsg.includes('LIMIT') || errorMsg.includes('KUNCI')) && (
                  <button 
                    onClick={handleUpdateKey}
                    className="w-full py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    Change API Key (Unlimited)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Production Output</h3>
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">8K LUXE / CERTIFIED</span>
          </div>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Master Render</p>
        </div>

        <div className={`flex-1 bg-[#080808] border border-white/5 rounded-[48px] overflow-hidden flex flex-col items-center justify-center relative group ${isMannequinRemover && resultImage ? 'checkerboard' : ''}`}>
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {resultImage ? (
            <div className="w-full h-full p-12 flex items-center justify-center animate-in zoom-in-95 duration-500">
              <div className="h-full aspect-[9/16] bg-transparent rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.15)] relative">
                <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = `luxe-ai-8k-${Date.now()}.png`;
                    link.click();
                  }}
                  className="absolute bottom-6 right-6 p-4 bg-[#d4af37] text-black rounded-2xl shadow-xl hover:scale-110 transition-transform active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="w-20 h-20 border-2 border-dashed border-white/40 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Waiting for Engine Execution</p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md flex items-center justify-center z-20">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] animate-pulse italic">Synthesizing High-Definition Assets...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioView;
