import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Music, 
  Play, 
  Square, 
  Copy, 
  Check, 
  RefreshCw, 
  Radio, 
  Sparkles, 
  Clock, 
  Sliders, 
  ArrowRight, 
  Zap, 
  Activity,
  Volume2,
  VolumeX,
  Layers
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface BpmDelayCalculatorProps {
  onBackToGrid?: () => void;
}

type NoteType = '1/1' | '1/2' | '1/4' | '1/8' | '1/16' | '1/32' | '1/64';
type NoteModifier = 'normal' | 'dotted' | 'triplet';

interface NoteDefinition {
  id: NoteType;
  label: string;
  fractionOfBeat: number; // 4/4 time: quarter note (1/4) = 1 beat
}

const NOTE_DEFINITIONS: NoteDefinition[] = [
  { id: '1/1', label: 'Whole Note (1/1)', fractionOfBeat: 4.0 },
  { id: '1/2', label: 'Half Note (1/2)', fractionOfBeat: 2.0 },
  { id: '1/4', label: 'Quarter Note (1/4)', fractionOfBeat: 1.0 },
  { id: '1/8', label: 'Eighth Note (1/8)', fractionOfBeat: 0.5 },
  { id: '1/16', label: 'Sixteenth (1/16)', fractionOfBeat: 0.25 },
  { id: '1/32', label: '32nd Note (1/32)', fractionOfBeat: 0.125 },
  { id: '1/64', label: '64th Note (1/64)', fractionOfBeat: 0.0625 }
];

const GENRE_PRESETS = [
  { name: 'Lo-Fi Chill', bpm: 75 },
  { name: 'Boom Bap', bpm: 90 },
  { name: 'Reggaeton', bpm: 96 },
  { name: 'Pop Ballad', bpm: 105 },
  { name: 'Deep House', bpm: 122 },
  { name: 'Progressive', bpm: 128 },
  { name: 'Peak Techno', bpm: 132 },
  { name: 'Modern Trap', bpm: 140 },
  { name: 'Drum & Bass', bpm: 174 }
];

export const UniversalBpmDelayCalculator: React.FC<BpmDelayCalculatorProps> = ({ onBackToGrid }) => {
  const [bpm, setBpm] = useState<number>(128);
  const [selectedNote, setSelectedNote] = useState<NoteType>('1/4');
  const [selectedModifier, setSelectedModifier] = useState<NoteModifier>('normal');
  const [copiedCell, setCopiedCell] = useState<string | null>(null);
  const [isAuditioning, setIsAuditioning] = useState<boolean>(false);

  // Tap tempo tracking
  const tapTimesRef = useRef<number[]>([]);
  const lastTapRef = useRef<number>(0);
  const [tapActive, setTapActive] = useState<boolean>(false);

  // Audio Context for beat pulse audition
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalIdRef = useRef<number | null>(null);

  // Calculate milliseconds and Hertz
  const calculateDelay = (fractionOfBeat: number, modifier: NoteModifier, targetBpm: number) => {
    if (targetBpm <= 0) return { ms: 0, hz: 0 };
    const beatMs = 60000 / targetBpm;
    let multiplier = 1.0;
    if (modifier === 'dotted') multiplier = 1.5;
    if (modifier === 'triplet') multiplier = 2 / 3;

    const ms = beatMs * fractionOfBeat * multiplier;
    const hz = ms > 0 ? 1000 / ms : 0;
    return { ms, hz };
  };

  // Selected note calculations
  const selectedNoteDef = useMemo(() => {
    return NOTE_DEFINITIONS.find(n => n.id === selectedNote) || NOTE_DEFINITIONS[2];
  }, [selectedNote]);

  const primaryResult = useMemo(() => {
    return calculateDelay(selectedNoteDef.fractionOfBeat, selectedModifier, bpm);
  }, [selectedNoteDef, selectedModifier, bpm]);

  // Audio sample rates calculations
  const samples441 = Math.round((primaryResult.ms / 1000) * 44100);
  const samples48 = Math.round((primaryResult.ms / 1000) * 48000);
  const samples96 = Math.round((primaryResult.ms / 1000) * 96000);

  // Full Matrix for all note types
  const matrixData = useMemo(() => {
    return NOTE_DEFINITIONS.map(note => {
      const normal = calculateDelay(note.fractionOfBeat, 'normal', bpm);
      const dotted = calculateDelay(note.fractionOfBeat, 'dotted', bpm);
      const triplet = calculateDelay(note.fractionOfBeat, 'triplet', bpm);
      return {
        note,
        normal,
        dotted,
        triplet
      };
    });
  }, [bpm]);

  // Tap Tempo Handler
  const handleTapTempo = () => {
    playSound('click');
    setTapActive(true);
    setTimeout(() => setTapActive(false), 180);

    const now = performance.now();
    if (now - lastTapRef.current > 2500) {
      // Reset if user paused for more than 2.5s
      tapTimesRef.current = [now];
    } else {
      tapTimesRef.current.push(now);
      if (tapTimesRef.current.length > 5) {
        tapTimesRef.current.shift();
      }

      if (tapTimesRef.current.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < tapTimesRef.current.length; i++) {
          intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        if (avgInterval > 0) {
          const calculatedBpm = Math.round(60000 / avgInterval);
          const clampedBpm = Math.min(320, Math.max(30, calculatedBpm));
          setBpm(clampedBpm);
        }
      }
    }
    lastTapRef.current = now;
  };

  // Copy helper
  const handleCopyValue = (text: string, cellId: string) => {
    playSound('calcChime');
    navigator.clipboard.writeText(text);
    setCopiedCell(cellId);
    setTimeout(() => setCopiedCell(null), 1800);
  };

  // Metronome Audition Sound
  const toggleAudition = () => {
    playSound('toggle');
    if (isAuditioning) {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      setIsAuditioning(false);
    } else {
      try {
        if (!audioContextRef.current) {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioContextRef.current = new AudioCtx();
        }
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }

        const playTick = () => {
          if (!audioContextRef.current) return;
          const osc = audioContextRef.current.createOscillator();
          const gain = audioContextRef.current.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, audioContextRef.current.currentTime);
          gain.gain.setValueAtTime(0.08, audioContextRef.current.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(audioContextRef.current.destination);
          osc.start();
          osc.stop(audioContextRef.current.currentTime + 0.045);
        };

        playTick();
        const interval = Math.max(25, primaryResult.ms);
        intervalIdRef.current = window.setInterval(playTick, interval);
        setIsAuditioning(true);
      } catch {
        setIsAuditioning(false);
      }
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  // Update audition interval if timing changes while playing
  useEffect(() => {
    if (isAuditioning) {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      const interval = Math.max(25, primaryResult.ms);
      intervalIdRef.current = window.setInterval(() => {
        if (!audioContextRef.current) return;
        const osc = audioContextRef.current.createOscillator();
        const gain = audioContextRef.current.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, audioContextRef.current.currentTime);
        gain.gain.setValueAtTime(0.08, audioContextRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioContextRef.current.destination);
        osc.start();
        osc.stop(audioContextRef.current.currentTime + 0.045);
      }, interval);
    }
  }, [primaryResult.ms, isAuditioning]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="bpm-delay-calculator-root">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                BPM to Millisecond Delay & Frequency Calculator
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                Audio Precision Math
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Calculate exact echo delay times, LFO cycle frequencies, and sample-accurate buffer lengths for DSP engineers.
            </p>
          </div>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-all border border-slate-300 dark:border-white/10"
          >
            ← Back to Tools
          </button>
        )}
      </div>

      {/* Main Interactive Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: BPM & Note Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* BPM Input Box & Tap Tempo */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="bpm-number-input" className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                <span>Tempo (Beats Per Minute)</span>
              </label>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                {bpm} BPM
              </span>
            </div>

            {/* Numeric Input & Quick Steps */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { playSound('sliderTick'); setBpm(Math.max(20, bpm - 1)); }}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 font-black text-sm text-slate-700 dark:text-white transition-all border border-slate-200 dark:border-white/10 flex items-center justify-center cursor-pointer"
                title="-1 BPM"
                id="bpm-dec-btn"
              >
                -1
              </button>

              <input
                id="bpm-number-input"
                type="number"
                min="20"
                max="320"
                value={bpm}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) setBpm(Math.min(320, Math.max(10, val)));
                }}
                className="flex-1 text-center font-mono text-xl sm:text-2xl font-black py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />

              <button
                onClick={() => { playSound('sliderTick'); setBpm(Math.min(320, bpm + 1)); }}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 font-black text-sm text-slate-700 dark:text-white transition-all border border-slate-200 dark:border-white/10 flex items-center justify-center cursor-pointer"
                title="+1 BPM"
                id="bpm-inc-btn"
              >
                +1
              </button>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="40"
              max="240"
              value={bpm}
              onChange={(e) => {
                setBpm(parseInt(e.target.value, 10));
              }}
              className="w-full accent-amber-500 cursor-pointer"
              id="bpm-range-slider"
            />

            {/* Tap Tempo & Audition Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleTapTempo}
                className={`py-3 px-3 rounded-xl font-black text-xs transition-all border flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-xs ${
                  tapActive
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
                }`}
                id="tap-tempo-button"
              >
                <Zap className={`w-3.5 h-3.5 ${tapActive ? 'animate-bounce' : ''}`} />
                <span>TAP TEMPO</span>
              </button>

              <button
                onClick={toggleAudition}
                className={`py-3 px-3 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  isAuditioning
                    ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                    : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white border-slate-200 dark:border-white/10'
                }`}
                id="audition-audio-pulse-btn"
              >
                {isAuditioning ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-500" />}
                <span>{isAuditioning ? 'Stop Pulse' : 'Audition Pulse'}</span>
              </button>
            </div>

            {/* Genre Presets */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                Genre Tempo Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {GENRE_PRESETS.map((genre) => (
                  <button
                    key={genre.name}
                    onClick={() => {
                      playSound('click');
                      setBpm(genre.bpm);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer border ${
                      bpm === genre.bpm
                        ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/70 border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {genre.name} ({genre.bpm})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Note Value & Modifier Selectors */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                Note Division (4/4 Meter)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {NOTE_DEFINITIONS.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      playSound('click');
                      setSelectedNote(note.id);
                    }}
                    className={`py-2 px-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                      selectedNote === note.id
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/80 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {note.id}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                Note Modifier / Rhythmic Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { playSound('click'); setSelectedModifier('normal'); }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                    selectedModifier === 'normal'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/80 border-slate-200 dark:border-white/10'
                  }`}
                >
                  Straight (1.0x)
                </button>
                <button
                  onClick={() => { playSound('click'); setSelectedModifier('dotted'); }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                    selectedModifier === 'dotted'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/80 border-slate-200 dark:border-white/10'
                  }`}
                >
                  Dotted (1.5x)
                </button>
                <button
                  onClick={() => { playSound('click'); setSelectedModifier('triplet'); }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                    selectedModifier === 'triplet'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/80 border-slate-200 dark:border-white/10'
                  }`}
                >
                  Triplet (0.667x)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Display & Studio Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Primary Result Hero Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/10 border border-amber-500/30 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Selected Note Echo Delay</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black border border-amber-500/30">
                {selectedNoteDef.label} • {selectedModifier.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 my-3">
              <div className="text-4xl sm:text-5xl font-mono font-black text-slate-900 dark:text-white tracking-tight">
                {primaryResult.ms.toFixed(2)}
                <span className="text-xl sm:text-2xl text-amber-600 dark:text-amber-400 ml-1.5">ms</span>
              </div>
              <div className="text-lg sm:text-xl font-mono text-slate-500 dark:text-white/60">
                / {primaryResult.hz.toFixed(3)} Hz
              </div>
            </div>

            {/* Quick-Copy Trigger Bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-amber-500/20 flex-wrap">
              <button
                onClick={() => handleCopyValue(primaryResult.ms.toFixed(2), 'hero-ms')}
                className="px-4 py-2 rounded-xl text-xs font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                id="copy-hero-ms-btn"
              >
                {copiedCell === 'hero-ms' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCell === 'hero-ms' ? 'Copied Delay Time!' : 'Copy Delay (ms)'}</span>
              </button>

              <button
                onClick={() => handleCopyValue(primaryResult.hz.toFixed(3), 'hero-hz')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-slate-800 dark:text-white transition-all border border-slate-200 dark:border-white/15 flex items-center gap-1.5 cursor-pointer"
                id="copy-hero-hz-btn"
              >
                {copiedCell === 'hero-hz' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Hz</span>
              </button>

              {/* Sample-rate metrics */}
              <div className="text-[11px] font-mono text-slate-600 dark:text-white/60 ml-auto flex items-center gap-3">
                <span>44.1k: <strong className="text-slate-900 dark:text-white">{samples441.toLocaleString()}</strong></span>
                <span>48k: <strong className="text-slate-900 dark:text-white">{samples48.toLocaleString()}</strong></span>
                <span>96k: <strong className="text-slate-900 dark:text-white">{samples96.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          {/* Complete Audio Engineering Matrix */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>Echo Delay & Reverb Timing Matrix @ {bpm} BPM</span>
              </h4>
              <span className="text-[10px] text-slate-400">Click any cell to copy</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 px-3">Note</th>
                    <th className="py-2.5 px-3">Straight (1.0x)</th>
                    <th className="py-2.5 px-3">Dotted (1.5x)</th>
                    <th className="py-2.5 px-3">Triplet (0.667x)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                  {matrixData.map(({ note, normal, dotted, triplet }) => {
                    const isSelected = selectedNote === note.id;
                    return (
                      <tr 
                        key={note.id}
                        className={`transition-colors ${
                          isSelected 
                            ? 'bg-amber-500/10 dark:bg-amber-500/15' 
                            : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="py-2 px-3 font-bold text-slate-800 dark:text-white whitespace-nowrap">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 mr-1.5 text-[11px]">
                            {note.id}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-white/50 hidden sm:inline">
                            {note.label.split(' ')[0]}
                          </span>
                        </td>

                        {/* Normal Cell */}
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handleCopyValue(normal.ms.toFixed(2), `${note.id}-normal`)}
                            className="group w-full text-left flex items-center justify-between gap-1 p-1 rounded hover:bg-amber-500/15 transition-all cursor-pointer"
                          >
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {normal.ms.toFixed(1)} <span className="text-[10px] text-slate-400">ms</span>
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 text-[10px] text-amber-600 dark:text-amber-400 transition-opacity">
                              {copiedCell === `${note.id}-normal` ? '✓' : 'Copy'}
                            </span>
                          </button>
                        </td>

                        {/* Dotted Cell */}
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handleCopyValue(dotted.ms.toFixed(2), `${note.id}-dotted`)}
                            className="group w-full text-left flex items-center justify-between gap-1 p-1 rounded hover:bg-amber-500/15 transition-all cursor-pointer"
                          >
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {dotted.ms.toFixed(1)} <span className="text-[10px] text-slate-400">ms</span>
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 text-[10px] text-amber-600 dark:text-amber-400 transition-opacity">
                              {copiedCell === `${note.id}-dotted` ? '✓' : 'Copy'}
                            </span>
                          </button>
                        </td>

                        {/* Triplet Cell */}
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handleCopyValue(triplet.ms.toFixed(2), `${note.id}-triplet`)}
                            className="group w-full text-left flex items-center justify-between gap-1 p-1 rounded hover:bg-amber-500/15 transition-all cursor-pointer"
                          >
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {triplet.ms.toFixed(1)} <span className="text-[10px] text-slate-400">ms</span>
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 text-[10px] text-amber-600 dark:text-amber-400 transition-opacity">
                              {copiedCell === `${note.id}-triplet` ? '✓' : 'Copy'}
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Practical Audio Production Tips */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 text-[11px] text-slate-500 dark:text-white/50 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>
                <strong>Reverb Pre-Delay Tip:</strong> Set your reverb pre-delay to 1/64 ({matrixData[6].normal.ms.toFixed(1)}ms) or 1/32 ({matrixData[5].normal.ms.toFixed(1)}ms) to keep vocals upfront while creating spatial depth.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
