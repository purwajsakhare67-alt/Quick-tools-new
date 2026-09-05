import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  Code, 
  List, 
  Sliders, 
  Sparkles,
  BookOpen,
  Coffee,
  Cpu,
  Layers
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalLoremIpsumGeneratorProps {
  onBackToGrid?: () => void;
}

type UnitType = 'paragraphs' | 'words' | 'sentences' | 'lists';
type FlavorType = 'classic' | 'startup' | 'hipster' | 'design';

const DICTIONARIES: Record<FlavorType, { words: string[]; starter: string }> = {
  classic: {
    starter: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    words: [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
      'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
      'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut',
      'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
      'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
      'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim',
      'id', 'est', 'laborum', 'at', 'vero', 'eos', 'accusamus', 'iusto', 'odio', 'dignissimos',
      'ducimus', 'blanditiis', 'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos',
      'dolores', 'quas', 'molestias', 'excepturi', 'sint', 'obcaecati', 'cupiditate', 'provident'
    ]
  },
  startup: {
    starter: 'Accelerate synergy across scalable cloud-native microservices while leveraging bleeding-edge AI models to disrupt legacy paradigms.',
    words: [
      'synergy', 'scalable', 'cloud-native', 'microservices', 'bleeding-edge', 'disrupt', 'paradigm', 'agile',
      'pivot', 'mvp', 'bootstrapped', 'venture-backed', 'bandwidth', 'flywheel', 'traction', 'growth-hack',
      'frictionless', 'omnichannel', 'low-hanging-fruit', 'actionable', 'retention', 'churn', 'cac', 'ltv',
      'runway', 'series-a', 'deliverable', 'deep-dive', 'gamification', 'touchpoint', 'stakeholder', 'monetize',
      'hyper-growth', 'first-mover', 'network-effect', 'roadmap', 'sprint', 'scrum', 'iterate', 'ai-driven'
    ]
  },
  hipster: {
    starter: 'Artisanal craft cold-brew pour-over heirloom tofu mustache vinyl sustainable organic microdosing ethical raw denim.',
    words: [
      'artisanal', 'pour-over', 'cold-brew', 'heirloom', 'mustache', 'vinyl', 'sustainable', 'organic',
      'raw-denim', 'kombucha', 'bespoke', 'distillery', 'farm-to-table', 'crucifix', 'normcore', 'portland',
      'brooklyn', 'tote-bag', 'sriracha', 'helvetica', 'fixie-bike', 'chambray', 'single-origin', 'typewriter',
      'subway-tile', 'irony', 'polaroid', 'aesthetic', 'succulent', 'lo-fi', 'biodynamic', 'neutral-palette'
    ]
  },
  design: {
    starter: 'Golden ratio responsive baseline typography paired with generous optical margins, refined leading, and harmonious visual hierarchy.',
    words: [
      'typography', 'kerning', 'leading', 'tracking', 'baseline', 'grid-system', 'whitespace', 'optical-size',
      'ligature', 'serif', 'sans-serif', 'modular-scale', 'hierarchy', 'contrast', 'gestalt', 'alignment',
      'wireframe', 'prototype', 'figma', 'vector', 'bezier-curve', 'hsl-palette', 'drop-shadow', 'elevation',
      'skeuomorphism', 'flat-design', 'micro-interaction', 'focal-point', 'golden-ratio', 'swiss-style'
    ]
  }
};

export const UniversalLoremIpsumGenerator: React.FC<UniversalLoremIpsumGeneratorProps> = ({
  onBackToGrid
}) => {
  const [unit, setUnit] = useState<UnitType>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [flavor, setFlavor] = useState<FlavorType>('classic');
  const [includeHtmlTags, setIncludeHtmlTags] = useState<boolean>(false);
  const [startWithClassic, setStartWithClassic] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [salt, setSalt] = useState(0); // Trigger regeneration

  // Text compiler engine
  const generatedText = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _tick = salt;
    const dict = DICTIONARIES[flavor];
    const words = dict.words;

    const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

    const generateSentence = (minWords = 7, maxWords = 16) => {
      const len = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
      const sWords: string[] = [];
      for (let i = 0; i < len; i++) {
        sWords.push(getRandomWord());
      }
      let sentence = sWords.join(' ');
      // Capitalize first letter
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      // Add a comma mid-sentence occasionally if long
      if (len > 10 && Math.random() > 0.4) {
        const commaIdx = Math.floor(len / 2);
        const parts = sentence.split(' ');
        parts[commaIdx] = parts[commaIdx] + ',';
        sentence = parts.join(' ');
      }
      return sentence + '.';
    };

    const generateParagraph = (minSentences = 3, maxSentences = 6) => {
      const numSentences = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
      const sentences: string[] = [];
      for (let s = 0; s < numSentences; s++) {
        sentences.push(generateSentence());
      }
      return sentences.join(' ');
    };

    let result = '';

    if (unit === 'paragraphs') {
      const paragraphs: string[] = [];
      for (let i = 0; i < Math.max(1, Math.min(count, 50)); i++) {
        if (i === 0 && startWithClassic) {
          const starter = dict.starter;
          const filler = generateParagraph(2, 4);
          paragraphs.push(`${starter} ${filler}`);
        } else {
          paragraphs.push(generateParagraph(4, 7));
        }
      }

      if (includeHtmlTags) {
        result = paragraphs.map((p) => `<p>${p}</p>`).join('\n\n');
      } else {
        result = paragraphs.join('\n\n');
      }
    } else if (unit === 'words') {
      const targetWords = Math.max(1, Math.min(count, 2000));
      const wordList: string[] = [];
      if (startWithClassic) {
        const starterWords = dict.starter.replace(/[.,]/g, '').toLowerCase().split(' ');
        for (let i = 0; i < Math.min(targetWords, starterWords.length); i++) {
          wordList.push(starterWords[i]);
        }
      }
      while (wordList.length < targetWords) {
        wordList.push(getRandomWord());
      }
      result = wordList.slice(0, targetWords).join(' ');
    } else if (unit === 'sentences') {
      const targetSentences = Math.max(1, Math.min(count, 100));
      const sentences: string[] = [];
      for (let i = 0; i < targetSentences; i++) {
        if (i === 0 && startWithClassic) {
          sentences.push(dict.starter);
        } else {
          sentences.push(generateSentence(8, 18));
        }
      }
      result = sentences.join(' ');
    } else if (unit === 'lists') {
      const targetItems = Math.max(1, Math.min(count, 50));
      const items: string[] = [];
      for (let i = 0; i < targetItems; i++) {
        const itemText = generateSentence(4, 10).replace('.', '');
        items.push(includeHtmlTags ? `  <li>${itemText}</li>` : `• ${itemText}`);
      }
      if (includeHtmlTags) {
        result = `<ul>\n${items.join('\n')}\n</ul>`;
      } else {
        result = items.join('\n');
      }
    }

    return result;
  }, [unit, count, flavor, includeHtmlTags, startWithClassic, salt]);

  // Statistics
  const metrics = useMemo(() => {
    const text = generatedText;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const paras = unit === 'paragraphs' ? count : (text.split('\n\n').filter(Boolean).length || 1);
    const readingTimeSec = Math.ceil((words / 200) * 60);
    return { words, chars, paras, readingTimeSec };
  }, [generatedText, unit, count]);

  const copyToClipboard = () => {
    if (!generatedText) return;
    playSound('bell');
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTextFile = () => {
    playSound('tap');
    const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lorem-ipsum-${flavor}-${unit}-${count}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const regenerate = () => {
    playSound('tap');
    setSalt((prev) => prev + 1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header bar */}
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
            <span className="p-1.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Advanced Lorem Ipsum & Placeholder Text Generator
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-500/20 text-violet-600 dark:text-violet-400">
              Design Utility
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={regenerate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
            title="Generate new random sequence"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
          <button
            onClick={downloadTextFile}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
            title="Download .txt"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md hover:shadow-violet-500/25 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generator Configuration Ribbon */}
      <div className="p-4 rounded-3xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4">
        {/* Dictionary Theme Selection */}
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-white/40 block mb-2">
            Dictionary Flavor:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'classic', label: 'Classic Latin (Cicero)', icon: BookOpen, desc: 'de Finibus Bonorum' },
              { id: 'startup', label: 'Startup & Tech', icon: Cpu, desc: 'Agile MVP Microservices' },
              { id: 'hipster', label: 'Artisanal Hipster', icon: Coffee, desc: 'Cold brew & pour-over' },
              { id: 'design', label: 'Design & Typography', icon: Layers, desc: 'Kerning & Golden Ratio' }
            ].map((th) => {
              const Icon = th.icon;
              const isSel = flavor === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => {
                    setFlavor(th.id as any);
                    playSound('tap');
                  }}
                  className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSel
                      ? 'bg-white dark:bg-slate-800 border-violet-500 shadow-md ring-1 ring-violet-500'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-white/5 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-violet-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{th.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">{th.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantities and Units Control */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2 border-t border-slate-200 dark:border-white/5">
          {/* Unit Selector */}
          <div className="sm:col-span-5 space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-white/80">Generate Unit:</span>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold">
              {(['paragraphs', 'words', 'sentences', 'lists'] as UnitType[]).map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    setUnit(u);
                    if (u === 'words' && count < 25) setCount(50);
                    playSound('tap');
                  }}
                  className={`py-1.5 rounded-xl capitalize text-center transition-all ${
                    unit === u
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Count Numeric Field */}
          <div className="sm:col-span-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
              <span>Count:</span>
              <div className="flex items-center gap-1">
                {(unit === 'words' ? [25, 50, 100, 250] : [1, 3, 5, 10]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setCount(preset);
                      playSound('tap');
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      count === preset
                        ? 'bg-violet-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-white/60'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              min={1}
              max={unit === 'words' ? 2000 : 50}
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Option Checkboxes */}
          <div className="sm:col-span-3 space-y-2 pt-2 sm:pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-white/80">
              <input
                type="checkbox"
                checked={includeHtmlTags}
                onChange={(e) => {
                  setIncludeHtmlTags(e.target.checked);
                  playSound('tap');
                }}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
              />
              <span>Wrap in HTML tags</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-white/80">
              <input
                type="checkbox"
                checked={startWithClassic}
                onChange={(e) => {
                  setStartWithClassic(e.target.checked);
                  playSound('tap');
                }}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
              />
              <span>Start with "Lorem ipsum"</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Presentation Canvas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-white/60">
          <span className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            Rendered Layout Canvas:
          </span>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span><strong>{metrics.words.toLocaleString()}</strong> words</span>
            <span>•</span>
            <span><strong>{metrics.chars.toLocaleString()}</strong> chars</span>
            <span>•</span>
            <span>~{metrics.readingTimeSec}s read</span>
          </div>
        </div>

        <div className="relative group">
          <textarea
            readOnly
            value={generatedText}
            rows={14}
            className="w-full p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-100 font-sans text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-violet-500 select-all shadow-inner resize-y transition-all selection:bg-violet-500/30"
          />
          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-violet-600/90 hover:bg-violet-600 text-white text-xs font-bold shadow-lg backdrop-blur-xs flex items-center gap-1.5 transition-all opacity-90 group-hover:opacity-100 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
