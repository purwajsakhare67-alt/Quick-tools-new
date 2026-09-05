import React, { useState, useRef, useEffect } from 'react';
import { 
  FileCode, 
  Upload, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  RefreshCw, 
  ArrowLeft, 
  Image as ImageIcon,
  Sparkles,
  Code2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalBase64ImageProcessorProps {
  onBackToGrid?: () => void;
}

export const UniversalBase64ImageProcessor: React.FC<UniversalBase64ImageProcessorProps> = ({ 
  onBackToGrid 
}) => {
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  
  // Encode State (Image -> Base64)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [imageMeta, setImageMeta] = useState<{
    width: number;
    height: number;
    sizeBytes: number;
    type: string;
    name: string;
  } | null>(null);
  const [encodeFormat, setEncodeFormat] = useState<'dataUri' | 'raw' | 'html' | 'css'>('dataUri');
  const [copiedEncode, setCopiedEncode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Decode State (Base64 -> Image)
  const [decodeInput, setDecodeInput] = useState<string>('');
  const [decodedImageUrl, setDecodedImageUrl] = useState<string>('');
  const [decodeError, setDecodeError] = useState<string>('');
  const [decodedMeta, setDecodedMeta] = useState<{ width: number; height: number } | null>(null);
  const [copiedDecode, setCopiedDecode] = useState(false);

  // Initialize with a default colorful sample image for Encode
  useEffect(() => {
    loadSampleImage();
  }, []);

  const loadSampleImage = () => {
    // Generate a sleek sample badge in memory using HTML5 canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 400, 300);
      grad.addColorStop(0, '#06b6d4');
      grad.addColorStop(0.5, '#6366f1');
      grad.addColorStop(1, '#ec4899');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(10, 10, 380, 280, 32);
      ctx.fill();

      // Inner card
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(25, 25, 350, 250, 24);
      ctx.fill();

      // Star shape
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(200, 120, 45, 0, Math.PI * 2);
      ctx.fill();

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('QuickFree Base64', 200, 200);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('400 × 300 Sample Asset', 200, 230);

      const dataUrl = canvas.toDataURL('image/png');
      setImageDataUrl(dataUrl);
      setImageMeta({
        width: 400,
        height: 300,
        sizeBytes: Math.round((dataUrl.length * 3) / 4),
        type: 'image/png',
        name: 'sample-quickfree-badge.png'
      });
    }
  };

  // Handle File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPEG, WebP, SVG, GIF, etc.)');
      return;
    }
    playSound('tap');
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageDataUrl(dataUrl);

      // Measure dimensions
      const img = new Image();
      img.onload = () => {
        setImageMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeBytes: file.size,
          type: file.type,
          name: file.name
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Format encoded string based on selection
  const getEncodedString = () => {
    if (!imageDataUrl) return '';
    const rawBase64 = imageDataUrl.split(',')[1] || '';
    switch (encodeFormat) {
      case 'raw':
        return rawBase64;
      case 'html':
        return `<img src="${imageDataUrl}" alt="${imageMeta?.name || 'Base64 Image'}" width="${imageMeta?.width || 'auto'}" height="${imageMeta?.height || 'auto'}" />`;
      case 'css':
        return `background-image: url("${imageDataUrl}");`;
      case 'dataUri':
      default:
        return imageDataUrl;
    }
  };

  const copyEncoded = () => {
    const str = getEncodedString();
    if (!str) return;
    navigator.clipboard.writeText(str);
    playSound('bell');
    setCopiedEncode(true);
    setTimeout(() => setCopiedEncode(false), 2200);
  };

  // Decode parsing
  useEffect(() => {
    if (!decodeInput.trim()) {
      setDecodedImageUrl('');
      setDecodeError('');
      setDecodedMeta(null);
      return;
    }

    let urlToLoad = decodeInput.trim();
    // Check if it's already a data URI
    if (!urlToLoad.startsWith('data:image/')) {
      // If it looks like raw base64, prepend PNG MIME prefix
      if (/^[A-Za-z0-9+/=]+$/.test(urlToLoad.replace(/\s+/g, ''))) {
        urlToLoad = `data:image/png;base64,${urlToLoad.replace(/\s+/g, '')}`;
      } else {
        setDecodeError('Invalid image data format. Ensure the string contains valid Base64 characters.');
        setDecodedImageUrl('');
        setDecodedMeta(null);
        return;
      }
    }

    const testImg = new Image();
    testImg.onload = () => {
      setDecodedImageUrl(urlToLoad);
      setDecodeError('');
      setDecodedMeta({
        width: testImg.naturalWidth,
        height: testImg.naturalHeight
      });
    };
    testImg.onerror = () => {
      setDecodeError('Failed to parse Base64 string into a readable image.');
      setDecodedImageUrl('');
      setDecodedMeta(null);
    };
    testImg.src = urlToLoad;
  }, [decodeInput]);

  const downloadDecodedImage = () => {
    if (!decodedImageUrl) return;
    playSound('tap');
    const a = document.createElement('a');
    a.href = decodedImageUrl;
    a.download = `decoded-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/60 transition-colors"
              title="Back to tools"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <FileCode className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Base64 Image Encoder & Decoder
            </h3>
          </div>
        </div>

        {/* Dual Mode Tab Selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('encode');
              playSound('tap');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'encode'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Image → Base64
          </button>
          <button
            onClick={() => {
              setActiveTab('decode');
              playSound('tap');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'decode'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Base64 → Image
          </button>
        </div>
      </div>

      {/* MODE 1: ENCODE IMAGE TO BASE64 */}
      {activeTab === 'encode' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upload / Drag-and-Drop & Asset Preview */}
          <div className="lg:col-span-5 space-y-4">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative p-6 border-2 border-dashed border-cyan-500/30 dark:border-cyan-500/20 hover:border-cyan-500 rounded-3xl bg-cyan-500/[0.02] dark:bg-cyan-500/[0.03] transition-all duration-200 text-center cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white mb-1">
                Drop image here or <span className="text-cyan-600 dark:text-cyan-400 underline">browse</span>
              </p>
              <p className="text-[11px] text-slate-400 dark:text-white/40">
                Supports PNG, JPG, WebP, SVG, GIF (100% In-Browser FileReader)
              </p>
            </div>

            {/* Visual Image Asset Generation Panel */}
            {imageDataUrl && (
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />
                    Asset Preview
                  </span>
                  <button
                    onClick={loadSampleImage}
                    className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset Sample
                  </button>
                </div>

                {/* Checkerboard preview container for alpha transparency */}
                <div className="w-full h-44 rounded-2xl bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[size:12px_12px] bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-white/10 flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={imageDataUrl}
                    alt="Preview asset"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                  />
                </div>

                {/* File Metadata Badges */}
                {imageMeta && (
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 dark:text-white/40 block">Resolution</span>
                      <strong className="text-slate-800 dark:text-white text-xs">{imageMeta.width} × {imageMeta.height}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 dark:text-white/40 block">Original Size</span>
                      <strong className="text-slate-800 dark:text-white text-xs">{(imageMeta.sizeBytes / 1024).toFixed(1)} KB</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 dark:text-white/40 block">Base64 Size</span>
                      <strong className="text-cyan-600 dark:text-cyan-400 text-xs">{(imageDataUrl.length / 1024).toFixed(1)} KB</strong>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Code Generator Strings & Copy Modules */}
          <div className="lg:col-span-7 space-y-4">
            {/* Format Selector Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 dark:bg-white/5 border border-slate-300/60 dark:border-white/10 text-xs">
                <button
                  onClick={() => setEncodeFormat('dataUri')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    encodeFormat === 'dataUri'
                      ? 'bg-cyan-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Data-URI
                </button>
                <button
                  onClick={() => setEncodeFormat('raw')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    encodeFormat === 'raw'
                      ? 'bg-cyan-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Raw Base64
                </button>
                <button
                  onClick={() => setEncodeFormat('html')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    encodeFormat === 'html'
                      ? 'bg-cyan-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  &lt;img&gt; Tag
                </button>
                <button
                  onClick={() => setEncodeFormat('css')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    encodeFormat === 'css'
                      ? 'bg-cyan-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  CSS URL
                </button>
              </div>

              {/* Instant Copy Button */}
              <button
                onClick={copyEncoded}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md hover:shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
              >
                {copiedEncode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white" />
                    <span>Copy String</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Output Textarea */}
            <div className="relative">
              <textarea
                readOnly
                value={getEncodedString()}
                rows={11}
                className="w-full p-4 rounded-2xl bg-slate-900 text-cyan-300 font-mono text-xs border border-cyan-500/30 focus:outline-hidden resize-none selection:bg-cyan-500/40"
                placeholder="Drop or select an image to generate Base64 code strings..."
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded-md border border-white/10">
                {getEncodedString().length.toLocaleString()} characters
              </div>
            </div>

            {/* Quick Helper Tips */}
            <div className="p-3 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-600 dark:text-white/70 space-y-1">
              <span className="font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Developer Optimization Tip:
              </span>
              <p className="text-[11px] leading-relaxed">
                Embedding images as Data-URIs removes secondary HTTP network requests, ideal for tiny UI sprites, SVG logos, and inline email signatures.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DECODE BASE64 TO IMAGE */}
      {activeTab === 'decode' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Base64 Input Window */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-cyan-500" />
                Paste Raw Base64 or Data-URI:
              </label>
              <button
                onClick={() => {
                  setDecodeInput('');
                  playSound('tap');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Clear Input
              </button>
            </div>

            <textarea
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              rows={9}
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-cyan-300 font-mono text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden transition-all"
              placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA... or raw Base64 string"
            />

            {/* Error Message */}
            {decodeError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{decodeError}</span>
              </div>
            )}

            {/* Quick Test Sample Triggers */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 dark:text-white/40">Load sample:</span>
              <button
                onClick={() => {
                  setDecodeInput('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%2306b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>');
                  playSound('tap');
                }}
                className="px-2 py-1 rounded-md bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-cyan-500/20 text-[11px] font-medium"
              >
                SVG Checkmark
              </button>
              <button
                onClick={() => {
                  // Small red dot 1x1 png
                  setDecodeInput('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==');
                  playSound('tap');
                }}
                className="px-2 py-1 rounded-md bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-cyan-500/20 text-[11px] font-medium"
              >
                1x1 PNG Dot
              </button>
            </div>
          </div>

          {/* Right Column: Visual Decoded Asset Preview & Download */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-500" />
                  Decoded Image Asset
                </span>
                {decodedMeta && (
                  <span className="text-[10px] text-slate-400">
                    {decodedMeta.width} × {decodedMeta.height} px
                  </span>
                )}
              </div>

              {/* Checkerboard Viewport */}
              <div className="w-full h-48 rounded-2xl bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[size:12px_12px] bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-white/10 flex items-center justify-center p-3 overflow-hidden">
                {decodedImageUrl ? (
                  <img
                    src={decodedImageUrl}
                    alt="Decoded asset"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <div className="text-center text-slate-400 dark:text-white/30 text-xs">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>Paste Base64 on the left to render</span>
                  </div>
                )}
              </div>

              {/* Download Image Button */}
              {decodedImageUrl && (
                <button
                  onClick={downloadDecodedImage}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-md hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Decoded Image File</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
