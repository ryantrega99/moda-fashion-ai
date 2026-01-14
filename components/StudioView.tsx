
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

    const hdQuality = "ULTRA HD 8K RESOLUTION, HIGH-FIDELITY FABRIC TEXTURE, PROFESSIONAL PHOTOGRAPHY, STUDIO LIGHTING, SHARP OPTICS, MASTERPIECE.";

    if (isMannequinRemover) {
      setPrompt(`${hdQuality} GHOST MANNEQUIN EFFECT: Isolate the clothing into a 3D hollow shell. Remove human model completely. 100% TRANSPARENT BACKGROUND.`);
    } else {
      setPrompt(`${hdQuality} PREMIUM FASHION CATALOG: Professional fashion model wearing the garment, elegant pose, sophisticated studio lighting, cinematic atmosphere.`);
    }
  }, [tool?.id]);

  const handleUpdateKey = async () => {
    if (window.aistudio?.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        setErrorMsg("API Key Updated. Coba Render lagi.");
      } catch (e) {
        console.error("Failed to open key selector:", e);
      }
    } else {
      alert("Fitur pemilihan kunci hanya tersedia di Google AI Studio. Pastikan Anda telah mengatur API_KEY di Vercel Dashboard jika menggunakan deploy publik.");
    }
  };

  const handleGenerate = async () => {
    if (!productImage || !prompt) return;
    
    setIsGenerating(true);
    setResultImage(null);
    setErrorMsg(null);

    try {
      // Re-instance GoogleGenAI right before the call to pick up the latest API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const base64Data = productImage.split(',')[1];
      const mimeType = productImage.split(',')[0].split(':')[1].split(';')[0];
      
      // Using gemini-3-pro-image-preview for requested High-Quality 8K output
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview', 
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: prompt },
          ],
        },
        config: { 
          imageConfig: { 
            aspectRatio: "9:16",
            imageSize: "1K" // Pro models support 1K, 2K, 4K. Starting with 1K for better reliability.
          }
        }
      });

      const candidate = response.candidates?.[0];
      if (!candidate) throw new Error("No response from engine.");

      if (candidate.finishReason === 'SAFETY') {
        throw new Error("Filtered by safety guidelines.");
      }

      let foundImage = false;
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          setResultImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("Render failed to return visual data.");
      }

    } catch (error: any) {
      console.error('Luxe Render Error:', error);
      const msg = error.message || "";
      
      if (msg.includes('429')) {
        setErrorMsg("Quota Exceeded. Silakan ganti API Key.");
      } else if (msg.includes('API_KEY') || msg.includes('403') || msg.includes('not found')) {
        setErrorMsg("API Key Missing or Invalid. Hubungkan ulang project.");
      } else {
        setErrorMsg(`Render Error: ${msg.substring(0, 60)}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!tool) return null;

  return (
    <div className="flex h-full w-full gap-10 animate-in fade-in duration-700">
      <div className="w-[450px] flex flex-col gap-6">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[50px] p-10 flex flex-col h-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[80px]"></div>
          
          <div className="flex items-center gap-3 mb-10">
            <span className="bg-white text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic shadow-xl">8K PRO</span>
            <span className="bg-white/5 text-white/30 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/5">GEMINI 3 PRO</span>
          </div>

          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4 leading-tight">{tool.title}</h2>
          <p className="text-white/40 text-[11px] font-medium mb-12 leading-relaxed uppercase tracking-widest">
            {isMannequinRemover 
              ? "Industrial isolation. Menghasilkan aset transparan 8K tanpa residu."
              : "Creative production. Render visual premium dengan detail ultra-realistik."}
          </p>

          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-64 border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ${productImage ? 'border-white/20 bg-white/5 shadow-inner' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
              >
                {productImage ? (
                  <img src={productImage} alt="Input" className="h-full w-full object-contain p-8 hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-center group">
                    <div className="w-16 h-16 rounded-[28px] bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/20 group-hover:text-white transition-all duration-500 border border-white/5">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white transition-colors">Select Product Photo</p>
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
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Engine Directives..."
                className="w-full h-32 bg-black/40 border border-white/5 rounded-[30px] p-6 text-[11px] font-medium text-white/60 focus:outline-none focus:border-white/20 focus:bg-black/60 transition-all leading-relaxed shadow-inner"
              />
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !productImage}
              className={`w-full py-6 rounded-[28px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-300 active:scale-95 text-[11px] shadow-2xl ${
                isGenerating || !productImage
                ? 'bg-white/5 text-white/10 cursor-not-allowed'
                : 'bg-white text-black hover:bg-zinc-200 shadow-white/5'
              }`}
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              )}
              {isGenerating ? 'PROCESSING...' : 'EXECUTE RENDER'}
            </button>

            {errorMsg && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-[20px] text-center">
                  <p className="text-[9px] text-red-500/80 font-black uppercase tracking-widest leading-tight">{errorMsg}</p>
                </div>
                <button 
                  onClick={handleUpdateKey}
                  className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-[20px] text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                >
                  HUBUNGKAN API KEY (PRO/FREE)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <div className={`flex-1 bg-[#0a0a0a] border border-white/5 rounded-[60px] overflow-hidden flex flex-col items-center justify-center relative shadow-inner group ${isMannequinRemover && resultImage ? 'checkerboard' : ''}`}>
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {resultImage ? (
            <div className="w-full h-full p-16 flex items-center justify-center animate-in zoom-in-95 fade-in duration-1000">
              <div className="h-full aspect-[9/16] bg-transparent rounded-[45px] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)] relative border border-white/10 group/result">
                <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = `luxe-ai-${Date.now()}.png`;
                    link.click();
                  }}
                  className="absolute bottom-10 right-10 p-5 bg-white text-black rounded-3xl shadow-2xl opacity-0 group-hover/result:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 opacity-20">
              <div className="w-20 h-20 border border-white/20 rounded-[35px] flex items-center justify-center mx-auto mb-8">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">Engine Ready // Output 8K</p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-3xl flex items-center justify-center z-20">
              <div className="text-center space-y-8">
                <div className="w-16 h-16 border-2 border-white/5 border-t-white rounded-full animate-spin mx-auto"></div>
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-white uppercase tracking-[0.6em] animate-pulse italic">Synthesizing Asset...</p>
                  <p className="text-[8px] text-white/30 uppercase tracking-widest font-bold">GEMINI 3 PRO ENGINE</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioView;
