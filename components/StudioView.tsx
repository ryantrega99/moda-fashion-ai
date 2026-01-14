
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResultImage(null);
    setProductImage(null);
    setErrorMsg(null);

    // HD & Ultra Detail Foundation
    const hdCore = "ULTRA-HD 8K RESOLUTION, HYPER-REALISTIC, MACRO FABRIC TEXTURE, PROFESSIONAL STUDIO LIGHTING, NO NOISE, SHARP EDGES.";

    if (isMannequinRemover) {
      // Prompt yang lebih profesional dan "aman" untuk filter AI namun tetap efektif
      setPrompt(`PROFESSIONAL GHOST MANNEQUIN ISOLATION: ${hdCore}
OBJECTIVE: Create a high-fidelity PNG of the garment with 100% TRANSPARENT BACKGROUND (Alpha Channel).
INSTRUCTIONS: Cleanly isolate the clothing from the human model. Remove all visible skin, including head, neck, hands, arms, legs, and feet. 
GHOST EFFECT: Render the interior back-neck and sleeve openings to make the garment look 3D and hollow. 
CRITICAL: Absolutely no white background. The output must be a transparent PNG. No human parts remaining.`);
    } else {
      setPrompt(`EDITORIAL FASHION PHOTOGRAPHY: ${hdCore}
SUBJECT: A high-end real human model wearing the garment. Perfect drape, natural posing, realistic skin pores, cinematic fashion studio lighting, 9:16 aspect ratio.`);
    }
  }, [tool?.id]);

  const handleGenerate = async () => {
    if (!productImage || !prompt) return;
    setIsGenerating(true);
    setResultImage(null);
    setErrorMsg(null);

    try {
      // Selalu inisialisasi instance baru untuk memastikan key terbaru digunakan
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

      // Validasi kandidat respon
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error("Engine tidak memberikan respon. Coba gunakan foto dengan pencahayaan yang lebih baik.");
      }

      const candidate = response.candidates[0];

      // Cek apakah terblokir oleh safety filter
      if (candidate.finishReason === 'SAFETY') {
        throw new Error("KEAMANAN: Konten atau instruksi dianggap sensitif oleh AI. Coba ubah foto atau instruksi.");
      }

      // Cari bagian gambar (inlineData)
      const imagePart = candidate.content.parts.find(p => p.inlineData);
      const textPart = candidate.content.parts.find(p => p.text);

      if (imagePart?.inlineData) {
        setResultImage(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
      } else if (textPart?.text) {
        // Jika AI malah membalas dengan teks (misal: "Saya tidak bisa...")
        console.warn("AI Response Text:", textPart.text);
        throw new Error(`AI Respon: "${textPart.text.substring(0, 100)}..."`);
      } else {
        throw new Error("Gagal menghasilkan gambar. Pastikan API Key valid dan saldo kuota tersedia.");
      }
    } catch (error: any) {
      console.error('Render error:', error);
      
      if (error.message?.includes('403') || error.message?.includes('PERMISSION_DENIED')) {
        setErrorMsg("AKSES DITOLAK: Periksa apakah API Key sudah benar dan memiliki akses ke model Gemini 2.5 Flash Image.");
      } else if (error.message?.includes('429')) {
        setErrorMsg("TERLALU BANYAK PERMINTAAN: Tunggu sebentar lalu coba lagi (Rate Limit).");
      } else {
        setErrorMsg("GAGAL RENDER: " + (error.message || "Pastikan koneksi internet stabil."));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!tool) return null;

  return (
    <div className="flex h-full w-full gap-8 animate-in fade-in duration-500">
      {/* Left Panel: Control Panel */}
      <div className="w-[450px] flex flex-col gap-6">
        <div className="bg-[#0c0f16] border border-white/5 rounded-[32px] p-8 flex flex-col h-full shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-white/5 text-slate-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Ultra HD Engine</span>
            <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">9:16 HD PNG</span>
          </div>

          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">{tool.title}</h2>
          <p className="text-slate-500 text-xs font-medium mb-10 leading-relaxed">
            {isMannequinRemover 
              ? "Isolasi Ghost Mannequin HD otomatis. Menghapus tubuh manusia dan menyisakan pakaian dengan transparansi murni."
              : "Render HD ultra-realistik dengan detail kain tingkat mikroskopis."}
          </p>

          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Upload Asset Fashion</p>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${productImage ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/5 hover:border-emerald-500/20'}`}
              >
                {productImage ? (
                  <img src={productImage} alt="Input" className="h-full w-full object-contain p-4" />
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Foto Baju</p>
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
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">HD Instruction Mode</p>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-6 text-[11px] font-medium text-slate-400 focus:outline-none focus:border-emerald-500/30 leading-relaxed"
                placeholder="Sesuaikan instruksi isolasi..."
              />
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !productImage}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 mt-8 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            )}
            {isMannequinRemover ? 'RENDER HD ISOLASI' : 'RENDER HD PHOTO'}
          </button>
          
          {errorMsg && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-bounce">
              <p className="text-[10px] text-red-400 font-black uppercase text-center leading-tight">{errorMsg}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Result Panel */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">HD Result</h3>
            <span className="bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">8K / ALPHA</span>
          </div>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Commercial Output</p>
        </div>

        <div className={`flex-1 bg-[#0c0f16] border border-white/5 rounded-[48px] overflow-hidden flex flex-col items-center justify-center relative group ${isMannequinRemover && resultImage ? 'checkerboard' : ''}`}>
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          {resultImage ? (
            <div className="w-full h-full p-12 flex items-center justify-center">
              <div className="h-full aspect-[9/16] bg-transparent rounded-3xl overflow-hidden shadow-2xl relative">
                <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = `vogue-hd-render-${Date.now()}.png`;
                    link.click();
                  }}
                  className="absolute bottom-6 right-6 p-4 bg-emerald-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform active:scale-90"
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
              <p className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Ready for 8K Visual Processing</p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-[#080a0f]/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] animate-pulse">Engaging HD Rendering Engine...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioView;
