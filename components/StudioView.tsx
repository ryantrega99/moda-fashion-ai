
import React, { useState, useRef, useEffect } from 'react';
import { FashionTool } from '../types';
import { GoogleGenAI } from "@google/genai";

interface StudioViewProps {
  tool: FashionTool | null;
  onBack: () => void;
  apiKey: string;
}

const StudioView: React.FC<StudioViewProps> = ({ tool, onBack, apiKey }) => {
  const isMannequinRemover = tool?.id === 'mannequin-remover';
  
  const [productImage, setProductImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [retryStatus, setRetryStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSwitchKey, setShowSwitchKey] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResultImage(null);
    setProductImage(null);
    setErrorMsg(null);
    setRetryStatus(null);
    setShowSwitchKey(false);

    const hdQuality = "8K ULTRA-HD RESOLUTION, HIGH-FIDELITY, HYPER-REALISTIC PHOTOGRAMMETRY, MASTER-GRADE LIGHTING, 16-BIT DEPTH.";

    if (isMannequinRemover) {
      setPrompt(`${hdQuality} GHOST MANNEQUIN ISOLATION: Isolate the clothing into a 3D hollow shell. MANDATORY: Remove 100% of human parts (head, neck, hands, arms, feet, legs). 100% TRANSPARENT ALPHA BACKGROUND. Razor-sharp edges.`);
    } else {
      setPrompt(`${hdQuality} PREMIUM FASHION PHOTOGRAPHY: Real human model, professional luxury garment, elite posing, detailed fabric textures, cinematic studio background.`);
    }
  }, [tool?.id]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSwitchKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success as per race condition rules
      window.location.reload();
    } else {
      alert("Fitur pemilihan kunci hanya tersedia di lingkungan AI Studio.");
    }
  };

  const handleGenerate = async () => {
    if (!productImage || !prompt) return;
    setIsGenerating(true);
    setResultImage(null);
    setErrorMsg(null);
    setRetryStatus(null);
    setShowSwitchKey(false);

    const maxRetries = 3;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const base64Data = productImage.split(',')[1];
        const mimeType = productImage.split(',')[0].split(':')[1].split(';')[0];
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
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

        if (!response.candidates?.[0]) {
          throw new Error("Engine tidak memberikan respon visual.");
        }

        const candidate = response.candidates[0];
        if (candidate.finishReason === 'SAFETY') {
          throw new Error("Pencitraan diblokir oleh filter keamanan AI.");
        }

        const imagePart = candidate.content.parts.find(p => p.inlineData);
        if (imagePart?.inlineData) {
          setResultImage(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
          setIsGenerating(false);
          return;
        } else {
          throw new Error("Engine tidak mengembalikan data gambar.");
        }

      } catch (error: any) {
        console.error(`Attempt ${attempt + 1}:`, error);
        
        const isRateLimit = error.message?.includes('429') || error.status === 429;
        
        if (isRateLimit && attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 4000; // Increased base delay for Vercel stability
          setRetryStatus(`RATE LIMIT: Mengulang otomatis dalam ${waitTime/1000} detik... (${attempt + 1}/${maxRetries})`);
          await delay(waitTime);
          attempt++;
          continue;
        }

        if (isRateLimit) {
          setErrorMsg("KUOTA API GRATIS HABIS: Batas penggunaan harian terlampaui.");
          setShowSwitchKey(true);
        } else if (error.message?.includes('403')) {
          setErrorMsg("AKSES DITOLAK: Periksa izin API Key Anda.");
        } else {
          setErrorMsg("ERROR ENGINE: " + (error.message || "Gagal menghubungi AI Server."));
        }
        break;
      }
    }
    setIsGenerating(false);
    setRetryStatus(null);
  };

  if (!tool) return null;

  return (
    <div className="flex h-full w-full gap-8 animate-in fade-in duration-500">
      <div className="w-[450px] flex flex-col gap-6">
        <div className="bg-[#080808] border border-white/5 rounded-[32px] p-8 flex flex-col h-full shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-white/5 text-slate-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Lux Engine 8K</span>
            <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic">Commercial HD</span>
          </div>

          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">{tool.title}</h2>
          <p className="text-slate-500 text-[11px] font-medium mb-10 leading-relaxed">
            {isMannequinRemover 
              ? "Automated 8K isolation. Menghapus 100% elemen manusia untuk output katalog transparan kelas dunia."
              : "Render ultra-hd dengan simulasi pencahayaan studio mewah dan tekstur makro."}
          </p>

          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Asset Management</p>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${productImage ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/5 hover:border-amber-500/20'}`}
              >
                {productImage ? (
                  <img src={productImage} alt="Input" className="h-full w-full object-contain p-4" />
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Master Photo</p>
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
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Precision 8K Instruction</p>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-6 text-[11px] font-medium text-slate-400 focus:outline-none focus:border-amber-500/30 leading-relaxed"
              />
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !productImage}
              className="w-full py-5 bg-[#d4af37] hover:bg-[#c49b2d] disabled:opacity-20 text-black rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              )}
              {isMannequinRemover ? 'EXECUTE 8K ISOLATION' : 'EXECUTE 8K RENDER'}
            </button>

            {showSwitchKey && (
              <button 
                onClick={handleSwitchKey}
                className="w-full py-4 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
              >
                Gunakan Jalur Paid Key (Batas Lebih Tinggi)
              </button>
            )}
          </div>
          
          {retryStatus && (
            <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl animate-pulse text-center">
              <p className="text-[9px] text-amber-500 font-black uppercase italic">{retryStatus}</p>
            </div>
          )}
          
          {errorMsg && (
            <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-center">
              <p className="text-[9px] text-red-400 font-black uppercase leading-tight">{errorMsg}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Production Output</h3>
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">8K HD / MASTER</span>
          </div>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">LUXE.AI Certified</p>
        </div>

        <div className={`flex-1 bg-[#080808] border border-white/5 rounded-[48px] overflow-hidden flex flex-col items-center justify-center relative group ${isMannequinRemover && resultImage ? 'checkerboard' : ''}`}>
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {resultImage ? (
            <div className="w-full h-full p-12 flex items-center justify-center">
              <div className="h-full aspect-[9/16] bg-transparent rounded-3xl overflow-hidden shadow-2xl relative">
                <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = `luxe-8k-output-${Date.now()}.png`;
                    link.click();
                  }}
                  className="absolute bottom-6 right-6 p-4 bg-[#d4af37] text-black rounded-2xl shadow-xl hover:scale-110 transition-transform"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 opacity-10">
              <div className="w-20 h-20 border-2 border-dashed border-white/40 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">System Ready for 8K Extraction</p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md flex items-center justify-center z-20">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] animate-pulse">Rendering Luxury Assets...</p>
                {retryStatus && <p className="text-[8px] text-white/40 uppercase tracking-widest">{retryStatus}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioView;
