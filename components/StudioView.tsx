
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

    const hdQuality = "ULTRA HD 8K RESOLUTION, CYBERPUNK HIGH-FASHION AESTHETIC, SHARP TEXTURES, STUDIO LIGHTING, PROFESSIONAL PHOTOGRAPHY.";

    if (isMannequinRemover) {
      setPrompt(`${hdQuality} GHOST MANNEQUIN: Create a 3D clothing hollow shell. Remove human model. 100% TRANSPARENT BACKGROUND.`);
    } else {
      setPrompt(`${hdQuality} LUXURY FASHION RENDER: High-end model, editorial pose, cinematic cyan lighting, ultra-realistic.`);
    }
  }, [tool?.id]);

  const handleUpdateKey = async () => {
    if (window.aistudio?.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        setErrorMsg("API Key terdeteksi. Silakan Render ulang.");
      } catch (e) {
        console.error("Selector failed:", e);
      }
    } else {
      setErrorMsg("Kunci API tidak ditemukan. Jika di Vercel, tambahkan 'API_KEY' di Dashboard Project Anda.");
    }
  };

  const handleGenerate = async () => {
    if (!productImage || !prompt) return;
    
    setIsGenerating(true);
    setResultImage(null);
    setErrorMsg(null);

    try {
      // Per rule: Instantiate right before call
      // Assume API_KEY is available as per instructions
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
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
          imageConfig: { aspectRatio: "9:16" }
        }
      });

      const candidate = response.candidates?.[0];
      if (!candidate) throw new Error("Engine tidak memberikan respon.");

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

      if (!foundImage) throw new Error("Render gagal memproses gambar.");

    } catch (error: any) {
      console.error('MODAFX Error:', error);
      const msg = error.message || "";
      
      if (msg.includes('403') || msg.includes('API_KEY') || msg.includes('not found') || !process.env.API_KEY) {
        setErrorMsg("API KEY INVALID / MISSING");
      } else if (msg.includes('429')) {
        setErrorMsg("QUOTA EXCEEDED");
      } else {
        setErrorMsg(`ERROR: ${msg.substring(0, 50).toUpperCase()}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!tool) return null;

  return (
    <div className="flex h-full w-full gap-10 animate-in fade-in duration-700">
      <div className="w-[450px] flex flex-col gap-6">
        <div className="bg-[#050505] border border-cyan-500/10 rounded-[50px] p-10 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[80px]"></div>
          
          <div className="flex items-center gap-3 mb-10">
            <span className="bg-cyan-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic">NANO-FX</span>
            <span className="text-cyan-500/40 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-cyan-500/10 italic">PRO ENGINE</span>
          </div>

          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4 leading-tight">{tool.title}</h2>
          <p className="text-slate-500 text-[11px] font-medium mb-12 leading-relaxed uppercase tracking-widest">
            Automated production. Render visual fashion dengan detail nano-realistik.
          </p>

          <div className="flex-1 space-y-10">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`h-64 border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ${productImage ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/5'}`}
            >
              {productImage ? (
                <img src={productImage} alt="Input" className="h-full w-full object-contain p-8 hover:scale-105 transition-all duration-500" />
              ) : (
                <div className="text-center opacity-40">
                  <div className="w-16 h-16 rounded-[28px] bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Select Source</p>
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

            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-black border border-white/5 rounded-[30px] p-6 text-[11px] font-medium text-slate-400 focus:outline-none focus:border-cyan-500/30 transition-all leading-relaxed"
            />
          </div>

          <div className="mt-10 space-y-4">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !productImage}
              className={`w-full py-6 rounded-[28px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-300 active:scale-95 text-[11px] ${
                isGenerating || !productImage
                ? 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
                : 'bg-cyan-500 text-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]'
              }`}
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : 'EXECUTE RENDER'}
            </button>

            {errorMsg && (
              <div className="space-y-4">
                <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-[20px] text-center">
                  <p className="text-[9px] text-red-500 font-black uppercase tracking-widest">{errorMsg}</p>
                </div>
                <button 
                  onClick={handleUpdateKey}
                  className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-[20px] text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                >
                  SET ENGINE KEY
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <div className={`flex-1 bg-black border border-white/5 rounded-[60px] overflow-hidden flex flex-col items-center justify-center relative group ${isMannequinRemover && resultImage ? 'checkerboard' : ''}`}>
          {resultImage ? (
            <div className="w-full h-full p-16 flex items-center justify-center animate-in zoom-in-95 fade-in duration-1000">
              <div className="h-full aspect-[9/16] bg-transparent rounded-[45px] overflow-hidden relative border border-cyan-500/10 group/result shadow-[0_0_80px_rgba(0,245,255,0.05)]">
                <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = `modafx-${Date.now()}.png`;
                    link.click();
                  }}
                  className="absolute bottom-10 right-10 p-5 bg-cyan-500 text-black rounded-3xl shadow-2xl opacity-0 group-hover/result:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-10">
              <p className="text-[10px] font-black text-white uppercase tracking-[1em] italic">Engine Ready // 8K Output</p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-20">
              <div className="text-center space-y-8">
                <div className="w-16 h-16 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.6em] animate-pulse italic">Synthesizing FX...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioView;
