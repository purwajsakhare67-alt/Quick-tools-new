import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  QrCode, 
  Upload, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Volume2, 
  History, 
  SwitchCamera,
  EyeOff
} from 'lucide-react';
import jsQR from 'jsqr';
import { playSound } from '../../utils/audioFeedback';

interface UniversalQrCodeScannerProps {
  onBackToGrid?: () => void;
}

interface ScanResult {
  data: string;
  timestamp: string;
  isUrl: boolean;
}

export const UniversalQrCodeScanner: React.FC<UniversalQrCodeScannerProps> = ({
  onBackToGrid
}) => {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string>('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastScannedDataRef = useRef<string>('');

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError('');
    setCameraActive(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Web camera API is not supported in this browser. Please use image upload mode.');
        setMode('upload');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setCameraActive(true);
        setIsScanning(true);
        playSound('tap');
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser or switch to image upload.'
          : 'Unable to connect to camera device. Please use manual image upload mode.'
      );
      setCameraActive(false);
    }
  }, [cameraFacing]);

  // Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsScanning(false);
  }, []);

  // Continuous Camera Frame QR Code Analysis
  useEffect(() => {
    if (!cameraActive || mode !== 'camera') {
      return;
    }

    const scanFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // jsQR Vector Matrix Recognition
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data && code.data !== lastScannedDataRef.current) {
            lastScannedDataRef.current = code.data;
            handleSuccessfulDecode(code.data);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraActive, mode]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleSuccessfulDecode = (payload: string) => {
    playSound('bell');
    const isUrl = /^https?:\/\//i.test(payload.trim());
    const result: ScanResult = {
      data: payload,
      timestamp: new Date().toLocaleTimeString(),
      isUrl
    };
    setScanResult(result);
    setScanHistory((prev) => [result, ...prev.filter((item) => item.data !== payload)].slice(0, 5));
  };

  // Switch between front and back camera
  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
    playSound('tap');
  };

  // Image Upload Parser Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedImage(file);
    }
  };

  const processUploadedImage = (file: File) => {
    playSound('tap');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth'
          });

          if (code && code.data) {
            handleSuccessfulDecode(code.data);
          } else {
            alert('No valid QR code detected in this image. Try another photo with clearer lighting.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyPayload = (text: string) => {
    playSound('bell');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const launchUrlSafely = (url: string) => {
    playSound('tap');
    if (/^https?:\/\//i.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Quick Sample QR Code test generator
  const loadSampleQrCode = () => {
    // We can draw a simple sample or parse a direct url
    handleSuccessfulDecode('https://quickfree.tools?source=qr-canvas-scanner-verified');
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
            <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <QrCode className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Client-Side Web QR Code Scanner
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              Device Camera
            </span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-xs font-bold">
          <button
            onClick={() => {
              setMode('camera');
              playSound('tap');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'camera'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Webcam Stream</span>
          </button>
          <button
            onClick={() => {
              stopCamera();
              setMode('upload');
              playSound('tap');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'upload'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Viewport Box (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {mode === 'camera' ? (
            <div className="relative w-full aspect-4/3 rounded-3xl bg-slate-950 overflow-hidden border border-emerald-500/20 shadow-xl flex items-center justify-center">
              {/* Live Video Feed */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Target Graphic Overlay */}
              {cameraActive && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                  {/* Bounding Corner Target */}
                  <div className="w-56 h-56 relative border-2 border-emerald-400/40 rounded-3xl">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl -mt-1 -ml-1" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl -mt-1 -mr-1" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl -mb-1 -ml-1" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl -mb-1 -mr-1" />

                    {/* Animated Scanning Laser Line */}
                    <div className="absolute top-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-[0_0_12px_#34d399]" />
                  </div>

                  <p className="mt-4 text-xs font-bold text-white/80 bg-slate-950/70 px-3 py-1 rounded-full backdrop-blur-xs border border-white/10">
                    Align QR Code in viewfinder
                  </p>
                </div>
              )}

              {/* Initial Start Prompt / Error View */}
              {!cameraActive && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Enable Camera Access</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      QuickFree scans QR codes 100% locally in your browser. Video feeds are never transmitted or stored.
                    </p>
                  </div>

                  {cameraError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs max-w-xs text-left flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{cameraError}</span>
                    </div>
                  )}

                  <button
                    onClick={startCamera}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    Start Camera Viewfinder
                  </button>
                </div>
              )}

              {/* In-Camera Floating Controls */}
              {cameraActive && (
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                  <button
                    onClick={toggleCameraFacing}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5"
                    title="Flip Camera"
                  >
                    <SwitchCamera className="w-4 h-4" />
                    <span className="text-[10px] hidden sm:inline">Flip Lens</span>
                  </button>

                  <button
                    onClick={stopCamera}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-900/80 text-white text-xs font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5"
                  >
                    <EyeOff className="w-4 h-4" />
                    <span className="text-[10px]">Pause Stream</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Upload Fallback Mode */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-4/3 rounded-3xl bg-slate-100 dark:bg-white/[0.03] border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 flex flex-col items-center justify-center p-6 text-center cursor-pointer group transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white">
                Upload QR Code Image
              </h4>
              <p className="text-xs text-slate-400 dark:text-white/40 mt-1 max-w-xs">
                Drag and drop a PNG, JPG, or screenshot containing a QR code to decode instantly.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  loadSampleQrCode();
                }}
                className="mt-4 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
              >
                Test Sample QR Code
              </button>
            </div>
          )}
        </div>

        {/* Decoded Output Payload Window (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Decoded Payload
              </span>
              {scanResult && (
                <span className="text-[10px] text-slate-400">
                  {scanResult.timestamp}
                </span>
              )}
            </div>

            {scanResult ? (
              <div className="space-y-3">
                {/* Type Badge */}
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    scanResult.isUrl 
                      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {scanResult.isUrl ? 'Web Link URL' : 'Plain Text / String'}
                  </span>
                </div>

                {/* Raw Output Block */}
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-900 dark:text-emerald-300 break-all select-all max-h-40 overflow-y-auto">
                  {scanResult.data}
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => copyPayload(scanResult.data)}
                    className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Payload</span>
                      </>
                    )}
                  </button>

                  {scanResult.isUrl && (
                    <button
                      onClick={() => launchUrlSafely(scanResult.data)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Launch URL</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 dark:text-white/30 space-y-2 text-xs">
                <QrCode className="w-8 h-8 mx-auto opacity-40" />
                <p>Waiting for QR code frame...</p>
                <p className="text-[11px] text-slate-400">Position a QR code in front of the lens.</p>
              </div>
            )}
          </div>

          {/* Scan History Module */}
          {scanHistory.length > 0 && (
            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-white/80 flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-emerald-500" />
                Recent Scans
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {scanHistory.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setScanResult(item);
                      playSound('tap');
                    }}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors"
                  >
                    <span className="font-mono text-[11px] text-slate-800 dark:text-white truncate">
                      {item.data}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
