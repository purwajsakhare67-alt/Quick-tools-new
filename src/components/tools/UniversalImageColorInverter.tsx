import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  Check, 
  Contrast,
  Eye
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalImageColorInverterProps {
  onBackToGrid?: () => void;
}

export const UniversalImageColorInverter: React.FC<UniversalImageColorInverterProps> = ({ onBackToGrid }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [invertR, setInvertR] = useState<boolean>(true);
  const [invertG, setInvertG] = useState<boolean>(true);
  const [invertB, setInvertB] = useState<boolean>(true);
  const [grayscaleFirst, setGrayscaleFirst] = useState<boolean>(false);
  const [preserveAlpha, setPreserveAlpha] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; size: string; name: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Generate a sample synthetic graphic so user can test immediately without uploading
  useEffect(() => {
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 400;
    sampleCanvas.height = 300;
    const ctx = sampleCanvas.getContext('2d');
    if (ctx) {
      // Draw gradient and geometric art
      const grad = ctx.createLinearGradient(0, 0, 400, 300);
      grad.addColorStop(0, '#3b82f6');
      grad.addColorStop(0.5, '#ec4899');
      grad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 300);

      // Circles
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(200, 150, 60, 0, Math.PI * 2);
      ctx.fill();

      // Text
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INVERT ME', 200, 158);

      const sampleUrl = sampleCanvas.toDataURL('image/png');
      setImageSrc(sampleUrl);
      setImageMeta({
        width: 400,
        height: 300,
        size: '~18 KB',
        name: 'sample_gradient_canvas.png'
      });
    }
  }, []);

  // Process image pixels when parameters or imageSrc change
  useEffect(() => {
    if (!imageSrc) return;

    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImageRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw original
      ctx.drawImage(img, 0, 0);

      // Read raw pixel buffer
      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imgData.data;

      // Iterate through 32-bit RGBA pixel clusters
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        if (grayscaleFirst) {
          // Standard luminous grayscale
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          r = gray;
          g = gray;
          b = gray;
        }

        if (invertR) data[i] = 255 - r;
        else data[i] = r;

        if (invertG) data[i + 1] = 255 - g;
        else data[i + 1] = g;

        if (invertB) data[i + 2] = 255 - b;
        else data[i + 2] = b;

        // Alpha preservation
        if (!preserveAlpha) {
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setIsProcessing(false);
    };
    img.src = imageSrc;
  }, [imageSrc, invertR, invertG, invertB, grayscaleFirst, preserveAlpha]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageSrc(event.target.result);
        setImageMeta({
          width: 0,
          height: 0,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          name: file.name
        });
        playSound('success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `inverted_${imageMeta?.name || 'graphic.png'}`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    playSound('success');
  };

  return (
    <div id="image-color-inverter-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-orange-500/10 border border-pink-500/20 dark:border-pink-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
            <Contrast className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              In-Memory Image Color Inverter &amp; Canvas Matrix
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-400 border border-pink-300 dark:border-pink-800">
                HTML5 Canvas Matrix
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Read pixel coordinate arrays in-memory to compute RGB (255 - value) with instant client-side download
            </p>
          </div>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
          >
            Back to Grid
          </button>
        )}
      </div>

      {/* Upload Zone & Channel Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upload Zone */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-center items-center text-center space-y-3 relative group">
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />
          <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-white">
              Upload Graphic Image
            </div>
            <p className="text-[11px] text-slate-400">PNG, JPG, WebP, SVG • Processed 100% in RAM</p>
          </div>
        </div>

        {/* Channel Inversion Matrix Controls */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-pink-500" />
              Channel Inversion Matrix
            </span>
            <span className="text-[11px] text-slate-400">
              {imageMeta ? `${imageMeta.name} (${imageMeta.size})` : 'Sample Preset'}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            <label className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              invertR ? 'bg-red-500/10 border-red-500 text-red-600' : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={invertR}
                onChange={(e) => setInvertR(e.target.checked)}
                className="sr-only"
              />
              <span>Invert R</span>
              <span className="text-[9px] font-mono opacity-70">255 - Red</span>
            </label>

            <label className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              invertG ? 'bg-green-500/10 border-green-500 text-green-600' : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={invertG}
                onChange={(e) => setInvertG(e.target.checked)}
                className="sr-only"
              />
              <span>Invert G</span>
              <span className="text-[9px] font-mono opacity-70">255 - Green</span>
            </label>

            <label className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              invertB ? 'bg-blue-500/10 border-blue-500 text-blue-600' : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={invertB}
                onChange={(e) => setInvertB(e.target.checked)}
                className="sr-only"
              />
              <span>Invert B</span>
              <span className="text-[9px] font-mono opacity-70">255 - Blue</span>
            </label>

            <label className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              grayscaleFirst ? 'bg-purple-500/10 border-purple-500 text-purple-600' : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={grayscaleFirst}
                onChange={(e) => setGrayscaleFirst(e.target.checked)}
                className="sr-only"
              />
              <span>Grayscale</span>
              <span className="text-[9px] font-mono opacity-70">Mono First</span>
            </label>

            <label className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              preserveAlpha ? 'bg-pink-500/10 border-pink-500 text-pink-600' : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={preserveAlpha}
                onChange={(e) => setPreserveAlpha(e.target.checked)}
                className="sr-only"
              />
              <span>Alpha Lock</span>
              <span className="text-[9px] font-mono opacity-70">Keep Opacity</span>
            </label>
          </div>
        </div>
      </div>

      {/* Visual Live Comparison Preview Area */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-white">
              Live Inverted Canvas Display
            </span>
          </div>
          <button
            onClick={handleDownload}
            disabled={!imageSrc || isProcessing}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white flex items-center gap-1.5 shadow-md shadow-pink-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Inverted Graphic
          </button>
        </div>

        <div className="w-full min-h-[300px] flex items-center justify-center p-4 rounded-xl bg-slate-950/5 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 overflow-auto">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[460px] object-contain rounded-lg shadow-lg border border-slate-200 dark:border-white/10"
          />
        </div>
      </div>
    </div>
  );
};
