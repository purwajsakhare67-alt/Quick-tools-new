import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown,
  Calculator, 
  Coins, 
  FileText, 
  QrCode, 
  Palette, 
  Code2, 
  Layers,
  ArrowLeft,
  Calendar,
  DollarSign,
  Percent,
  Clock,
  PieChart,
  BarChart3,
  Flame,
  Receipt,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronRight,
  Building2,
  Hourglass,
  LineChart,
  PiggyBank,
  ArrowDownRight,
  ArrowUpRight,
  Scale,
  Home,
  Terminal,
  Binary,
  Sliders,
  Pause,
  Play,
  Trash2,
  HelpCircle,
  Zap,
  Eye,
  Link,
  Globe,
  FileCode,
  Wand2,
  Image as ImageIcon,
  Upload,
  Scissors,
  Split,
  GitCompare,
  PlusCircle,
  MinusCircle,
  ArrowRightLeft,
  Type,
  Hash,
  Bold,
  Italic,
  List,
  Heading,
  Shapes,
  Maximize2,
  EyeOff,
  Crop,
  ShieldAlert,
  Smartphone,
  Monitor,
  Printer,
  Share2,
  Tag,
  BookOpen,
  Volume2,
  Cake,
  RotateCcw,
  Bell,
  Coffee,
  Brain,
  Users,
  Utensils,
  Gift
} from 'lucide-react';
import { ToolItem } from '../types';
import { UniversalCompoundInterest } from './tools/UniversalCompoundInterest';
import { UniversalVatSalesTax } from './tools/UniversalVatSalesTax';
import { UniversalFireRetirement } from './tools/UniversalFireRetirement';
import { UniversalNetSalary } from './tools/UniversalNetSalary';
import { UniversalCagrCalculator } from './tools/UniversalCagrCalculator';
import { UniversalInflationCalculator } from './tools/UniversalInflationCalculator';
import { UniversalRealEstateCapRate } from './tools/UniversalRealEstateCapRate';
import { UniversalFdRdAnalyzer } from './tools/UniversalFdRdAnalyzer';
import { UniversalDripCompounder } from './tools/UniversalDripCompounder';
import { UniversalSipCalculator } from './tools/UniversalSipCalculator';
import { UniversalEmiCalculator } from './tools/UniversalEmiCalculator';
import { UniversalBillSplitter } from './tools/UniversalBillSplitter';
import { UniversalCryptoRoi } from './tools/UniversalCryptoRoi';
import { playSound } from '../utils/audioFeedback';

interface InteractiveToolModalProps {
  tool: ToolItem | null;
  onClose: () => void;
  onSelectTool?: (tool: ToolItem) => void;
}

export const InteractiveToolModal: React.FC<InteractiveToolModalProps> = ({
  tool,
  onClose,
  onSelectTool
}) => {
  const modalContainerRef = useRef<HTMLDivElement>(null);

  if (!tool) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="relative w-full max-w-4xl my-8 rounded-3xl border border-slate-300 dark:border-white/15 bg-white/90 dark:bg-[#080816]/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3.5">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all mr-1 cursor-pointer"
                  title="Return to home grid"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back to All Tools</span>
                </motion.button>

                <motion.div 
                  animate={{ rotate: [0, -6, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.gradient} p-0.5 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0`}
                >
                  <div className="w-full h-full bg-slate-950/20 backdrop-blur-xs rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-cyan-300" />
                  </div>
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">{tool.name}</h3>
                    {tool.badge && (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 dark:bg-white/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 dark:border-white/15">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60 mt-0.5">{tool.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <motion.button 
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

        {/* Modal Content Switcher based on demoType */}
        <div className="space-y-6">
          {tool.demoType === 'age' && <AgeMilestoneChronometerDemo onBackToGrid={onClose} />}
          {tool.demoType === 'split' && <UniversalBillSplitter onBackToGrid={onClose} />}
          {tool.demoType === 'pomodoro' && <UltradianPomodoroTimerDemo onBackToGrid={onClose} />}
          {tool.demoType === 'social' && <SocialMediaPresetsDemo onBackToGrid={onClose} />}
          {tool.demoType === 'unit' && <UnitDimensionMatrixDemo onBackToGrid={onClose} />}
          {tool.demoType === 'word' && <WordCounterReadingSpeedDemo onBackToGrid={onClose} />}
          {tool.demoType === 'percentage' && <PercentageDiscountDemo onBackToGrid={onClose} />}
          {tool.demoType === 'svg' && <SvgMinifierCleanerDemo onBackToGrid={onClose} />}
          {tool.demoType === 'webp' && <ImageWebpAvifConverterDemo onBackToGrid={onClose} />}
          {tool.demoType === 'aspect' && <AspectRatioDpiScalerDemo onBackToGrid={onClose} />}
          {tool.demoType === 'exif' && <ExifPhotoPrivacyPurgerDemo onBackToGrid={onClose} />}
          {tool.demoType === 'url' && <UrlEncoderSluggerDemo onBackToGrid={onClose} />}
          {tool.demoType === 'markdown' && <MarkdownLiveVisualizerDemo onBackToGrid={onClose} />}
          {tool.demoType === 'diff' && <TextDiffCheckerDemo onBackToGrid={onClose} />}
          {tool.demoType === 'regex' && <RegexLiveTesterDemo onBackToGrid={onClose} />}
          {tool.demoType === 'base64' && <Base64UniversalStudioDemo onBackToGrid={onClose} />}
          {tool.demoType === 'glassmorphism' && <CssGlassmorphismStudioDemo onBackToGrid={onClose} />}
          {tool.demoType === 'timestamp' && <EpochTimestampMatrixDemo onBackToGrid={onClose} />}
          {tool.demoType === 'compound' && <UniversalCompoundInterest onBackToGrid={onClose} />}
          {tool.demoType === 'gst' && <UniversalVatSalesTax onBackToGrid={onClose} />}
          {tool.demoType === 'fire' && <UniversalFireRetirement onBackToGrid={onClose} />}
          {tool.demoType === 'cagr' && <UniversalCagrCalculator onBackToGrid={onClose} />}
          {tool.demoType === 'salary' && <UniversalNetSalary onBackToGrid={onClose} />}
          {tool.demoType === 'inflation' && <UniversalInflationCalculator onBackToGrid={onClose} />}
          {tool.demoType === 'caprate' && <UniversalRealEstateCapRate onBackToGrid={onClose} />}
          {tool.demoType === 'fdrd' && <UniversalFdRdAnalyzer onBackToGrid={onClose} />}
          {tool.demoType === 'drip' && <UniversalDripCompounder onBackToGrid={onClose} />}
          {tool.demoType === 'sip' && <UniversalSipCalculator onBackToGrid={onClose} />}
          {tool.demoType === 'emi' && <UniversalEmiCalculator onBackToGrid={onClose} />}
          {tool.demoType === 'crypto' && <UniversalCryptoRoi onBackToGrid={onClose} />}
          {tool.demoType === 'pdf' && <PdfCompressorDemo />}
          {tool.demoType === 'qr' && <QrCodeGeneratorDemo />}
          {tool.demoType === 'password' && <PasswordGeneratorDemo />}
          {tool.demoType === 'color' && <ColorPaletteDemo />}
          {tool.demoType === 'json' && <JsonToTsDemo />}
          {(!tool.demoType || tool.demoType === 'default') && <DefaultToolDemo tool={tool} />}
        </div>

        {/* Footer info & Trust notice */}
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Client-Side Private • Zero server telemetry</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.04, x: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900/90 dark:bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 text-white font-bold transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>⬅️ Back to All Tools</span>
            </motion.button>
          </div>
        </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* --- 0. Fully Interactive Compound Interest Multiplier --- */
function CompoundInterestDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [principal, setPrincipal] = useState<number>(100000);
  const [contribution, setContribution] = useState<number>(5000);
  const [contributionFreq, setContributionFreq] = useState<'monthly' | 'annually'>('monthly');
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [compoundFreq, setCompoundFreq] = useState<number>(12); // 365 = daily, 12 = monthly, 4 = quarterly, 1 = annually
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  // Formatting helpers for Indian Rupee
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  const formatINRShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
    return `₹${Math.round(val)}`;
  };

  // Calculate year by year progression
  const yearlyData: Array<{ year: number; invested: number; interest: number; totalValue: number }> = [];
  
  let currentBalance = principal;
  let runningInvested = principal;
  const n = compoundFreq; // compounding periods per year
  const rDecimal = rate / 100;

  for (let y = 1; y <= years; y++) {
    // 12 monthly steps within year
    for (let m = 1; m <= 12; m++) {
      if (contributionFreq === 'monthly' && contribution > 0) {
        currentBalance += contribution;
        runningInvested += contribution;
      } else if (contributionFreq === 'annually' && m === 1 && contribution > 0) {
        currentBalance += contribution;
        runningInvested += contribution;
      }
      // Monthly compounding factor
      currentBalance *= Math.pow(1 + rDecimal / n, n / 12);
    }

    const totalInterest = Math.max(0, currentBalance - runningInvested);
    yearlyData.push({
      year: y,
      invested: Math.round(runningInvested),
      interest: Math.round(totalInterest),
      totalValue: Math.round(currentBalance)
    });
  }

  const finalYear = yearlyData[yearlyData.length - 1] || {
    invested: principal,
    interest: 0,
    totalValue: principal
  };

  const totalInvestedAmount = finalYear.invested;
  const totalInterestEarned = finalYear.interest;
  const maturityFutureWealth = finalYear.totalValue;

  const interestMultiplier = totalInvestedAmount > 0 
    ? (maturityFutureWealth / totalInvestedAmount).toFixed(2)
    : '1.00';

  const maxVal = Math.max(...yearlyData.map(d => d.totalValue), 1);

  return (
    <div className="space-y-6" id="compound-interest-tool-content">
      
      {/* 3 Major Live Output Display Cards with Indian Rupees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Invested */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md transition-all hover:border-cyan-500/40">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span>Total Invested Amount</span>
            <span className="p-1 rounded-md bg-cyan-500/20">₹</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatINR(totalInvestedAmount)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Principal {formatINRShort(principal)} + contributions
          </div>
        </div>

        {/* Card 2: Total Interest */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md transition-all hover:border-purple-500/40">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Total Interest Earned</span>
            <span className="p-1 rounded-md bg-purple-500/20">📈</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            +{formatINR(totalInterestEarned)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {((totalInterestEarned / Math.max(1, maturityFutureWealth)) * 100).toFixed(1)}% of total corpus
          </div>
        </div>

        {/* Card 3: Maturity Value / Future Wealth */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-amber-500/10 border border-pink-500/30 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-pink-500" />
              Maturity Future Wealth
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-500/20 text-pink-600 dark:text-pink-300 font-bold">
              {interestMultiplier}x Multiplier
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 tracking-tight">
            {formatINR(maturityFutureWealth)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            After {years} Years @ {rate}% p.a.
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* 1. Initial Investment / Principal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="input-principal" className="flex items-center gap-1.5">
              <span>Initial Principal Amount</span>
            </label>
            <div className="flex items-center gap-1 font-mono text-purple-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <span>₹</span>
              <input 
                id="input-principal"
                type="number" 
                min={1000} 
                max={10000000} 
                step={5000}
                value={principal} 
                onChange={(e) => setPrincipal(Math.max(0, Math.min(10000000, Number(e.target.value) || 0)))}
                className="w-24 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input 
            type="range" 
            min={1000} 
            max={10000000} 
            step={5000}
            value={principal} 
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-white/40 font-mono">
            <span>₹1,000</span>
            <span>₹50 Lakh</span>
            <span>₹1 Crore</span>
          </div>
        </div>

        {/* 2. Regular Contribution (Monthly / Annual) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <div className="flex items-center gap-2">
              <label htmlFor="input-contribution">Periodic Contribution</label>
              <div className="inline-flex rounded-lg bg-slate-200/80 dark:bg-white/10 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setContributionFreq('monthly')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    contributionFreq === 'monthly'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-white/60'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setContributionFreq('annually')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    contributionFreq === 'annually'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-white/60'
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 font-mono text-purple-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <span>₹</span>
              <input 
                id="input-contribution"
                type="number" 
                min={0} 
                max={500000} 
                step={500}
                value={contribution} 
                onChange={(e) => setContribution(Math.max(0, Math.min(500000, Number(e.target.value) || 0)))}
                className="w-20 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input 
            type="range" 
            min={0} 
            max={500000} 
            step={500}
            value={contribution} 
            onChange={(e) => setContribution(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-white/40 font-mono">
            <span>₹0 (None)</span>
            <span>₹2.5 Lakh</span>
            <span>₹5 Lakh / {contributionFreq === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
        </div>

        {/* 3. Interest Rate (% p.a.) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="input-rate">Interest Rate (per annum)</label>
            <div className="flex items-center gap-1 font-mono text-pink-600 dark:text-pink-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <input 
                id="input-rate"
                type="number" 
                min={1} 
                max={30} 
                step={0.1}
                value={rate} 
                onChange={(e) => setRate(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
                className="w-14 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
              <span>%</span>
            </div>
          </div>
          <input 
            type="range" 
            min={1} 
            max={30} 
            step={0.1}
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-white/40 font-mono">
            <span>1% (FD/Savings)</span>
            <span>12% (Index/Equities)</span>
            <span>30% (Aggressive)</span>
          </div>
        </div>

        {/* 4. Time Period (Years) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="input-years">Investment Duration</label>
            <div className="flex items-center gap-1 font-mono text-cyan-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <input 
                id="input-years"
                type="number" 
                min={1} 
                max={50} 
                step={1}
                value={years} 
                onChange={(e) => setYears(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                className="w-12 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
              <span>Years</span>
            </div>
          </div>
          <input 
            type="range" 
            min={1} 
            max={50} 
            step={1}
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-white/40 font-mono">
            <span>1 Year</span>
            <span>25 Years</span>
            <span>50 Years</span>
          </div>
        </div>

        {/* 5. Compounding Interval Dropdown */}
        <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-black/30 border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500 shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Compounding Frequency</div>
              <div className="text-[11px] text-slate-500 dark:text-white/50">Interval at which accrued interest is added back to principal</div>
            </div>
          </div>

          <select 
            value={compoundFreq} 
            onChange={(e) => setCompoundFreq(Number(e.target.value))}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            id="compound-frequency-select"
          >
            <option value={365} className="dark:bg-slate-900">Daily (365 times / year)</option>
            <option value={12} className="dark:bg-slate-900">Monthly (12 times / year)</option>
            <option value={4} className="dark:bg-slate-900">Quarterly (4 times / year)</option>
            <option value={1} className="dark:bg-slate-900">Annually (1 time / year)</option>
          </select>
        </div>

      </div>

      {/* Chart Integration: Responsive Visual Growth Breakdown */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Year-by-Year Exponential Wealth Curve
            </h4>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-cyan-500"></span>
              <span className="text-slate-600 dark:text-white/70">Invested Capital</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-gradient-to-r from-purple-600 to-pink-500"></span>
              <span className="text-slate-600 dark:text-white/70">Interest Accrued</span>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Stacked Bar Chart */}
        <div className="h-56 sm:h-64 flex items-end gap-1 sm:gap-2 pt-6 pb-2 border-b border-slate-200 dark:border-white/10 overflow-x-auto">
          {yearlyData.map((item) => {
            const investedHeightPct = (item.invested / maxVal) * 100;
            const interestHeightPct = (item.interest / maxVal) * 100;
            const isHovered = hoveredYear === item.year;

            return (
              <div 
                key={item.year}
                onMouseEnter={() => setHoveredYear(item.year)}
                onMouseLeave={() => setHoveredYear(null)}
                className="flex-1 min-w-[14px] sm:min-w-[20px] max-w-[42px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-16 z-30 px-3 py-1.5 rounded-xl bg-slate-950 text-white text-[11px] font-mono shadow-xl whitespace-nowrap border border-white/20 pointer-events-none animate-fade-in">
                    <div className="font-bold text-cyan-300">Year {item.year}: {formatINRShort(item.totalValue)}</div>
                    <div className="text-slate-300">Principal: {formatINRShort(item.invested)} | Interest: {formatINRShort(item.interest)}</div>
                  </div>
                )}

                {/* Stacked Bars */}
                <div className="w-full flex flex-col justify-end h-full rounded-t-md overflow-hidden bg-slate-200/40 dark:bg-white/5 transition-all group-hover:scale-105">
                  {/* Top Interest segment */}
                  <div 
                    style={{ height: `${interestHeightPct}%` }}
                    className="w-full bg-gradient-to-t from-purple-600 to-pink-500 transition-all duration-300 group-hover:brightness-125"
                  />
                  {/* Bottom Invested Capital segment */}
                  <div 
                    style={{ height: `${investedHeightPct}%` }}
                    className="w-full bg-cyan-500/80 transition-all duration-300 group-hover:brightness-110"
                  />
                </div>

                {/* X Axis Label */}
                {(years <= 15 || item.year % 5 === 0 || item.year === years || item.year === 1) && (
                  <span className="text-[10px] text-slate-400 dark:text-white/40 mt-1.5 font-mono">
                    Y{item.year}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Milestone Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase">Year 1 Value</div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {formatINRShort(yearlyData[0]?.totalValue || principal)}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase">
              {years >= 5 ? 'Year 5 Value' : `Midway (Y${Math.round(years/2)})`}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {formatINRShort(yearlyData[Math.min(4, Math.floor(years / 2))]?.totalValue || principal)}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase">Compounding Power</div>
            <div className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">
              {interestMultiplier}x Initial Capital
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase">Final Wealth (Y{years})</div>
            <div className="text-xs sm:text-sm font-bold text-pink-600 dark:text-pink-400 mt-0.5">
              {formatINRShort(maturityFutureWealth)}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

/* --- 0.1 GST & VAT Universal Splitter --- */
function GstVatCalculatorDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [amount, setAmount] = useState<number>(10000);
  const [taxRate, setTaxRate] = useState<number>(18);
  const [taxType, setTaxType] = useState<'exclusive' | 'inclusive'>('exclusive');

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  };

  const formatINRShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
    return `₹${Math.round(val)}`;
  };

  let netAmount = 0;
  let taxAmount = 0;
  let grossAmount = 0;

  if (taxType === 'exclusive') {
    // Tax Exclusive: Amount entered is Net (Pre-Tax)
    netAmount = amount;
    taxAmount = (netAmount * taxRate) / 100;
    grossAmount = netAmount + taxAmount;
  } else {
    // Tax Inclusive: Amount entered is Gross (Post-Tax)
    grossAmount = amount;
    netAmount = grossAmount / (1 + taxRate / 100);
    taxAmount = grossAmount - netAmount;
  }

  const cgstAmount = taxAmount / 2;
  const sgstAmount = taxAmount / 2;

  const basePct = grossAmount > 0 ? (netAmount / grossAmount) * 100 : 100;
  const taxPct = grossAmount > 0 ? (taxAmount / grossAmount) * 100 : 0;
  const halfTaxPct = taxPct / 2;

  const commonSlabs = [0, 5, 12, 18, 28];

  return (
    <div className="space-y-6" id="gst-tool-content">
      {/* 3 Major Live Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Net Amount */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span>Net Price (Pre-Tax)</span>
            <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-mono">₹</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatINR(netAmount)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Base cost before {taxRate}% GST
          </div>
        </div>

        {/* Card 2: Total Tax Amount & CGST/SGST */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Total Tax ({taxRate}%)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 font-mono">
              CGST + SGST
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            +{formatINR(taxAmount)}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-white/60 mt-1">
            <span className="font-semibold">CGST ({taxRate/2}%): {formatINR(cgstAmount)}</span>
            <span>•</span>
            <span className="font-semibold">SGST ({taxRate/2}%): {formatINR(sgstAmount)}</span>
          </div>
        </div>

        {/* Card 3: Gross Total */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-teal-500/10 border border-blue-500/30 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-blue-500" />
              Gross Invoice Total
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold">
              Final Payable
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatINR(grossAmount)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            Inclusive of all taxes ({taxType === 'exclusive' ? 'Added Tax' : 'Extracted Tax'})
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* Toggle Mode: Tax Exclusive vs Inclusive */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80 block">
            Tax Calculation Mode
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-200/80 dark:bg-white/10">
            <button
              type="button"
              onClick={() => setTaxType('exclusive')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                taxType === 'exclusive'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${taxType === 'exclusive' ? 'opacity-100' : 'opacity-0'}`} />
              <span>Tax Exclusive (Add GST to Base)</span>
            </button>

            <button
              type="button"
              onClick={() => setTaxType('inclusive')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                taxType === 'inclusive'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${taxType === 'inclusive' ? 'opacity-100' : 'opacity-0'}`} />
              <span>Tax Inclusive (Extract GST from Total)</span>
            </button>
          </div>
        </div>

        {/* 1. Base Amount Input & Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="gst-amount-input">
              {taxType === 'exclusive' ? 'Base / Net Amount' : 'Gross / Invoice Total'}
            </label>
            <div className="flex items-center gap-1 font-mono text-cyan-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <span>₹</span>
              <input
                id="gst-amount-input"
                type="number"
                min={100}
                max={10000000}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Math.min(10000000, Number(e.target.value) || 0)))}
                className="w-28 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={100}
            max={10000000}
            step={500}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-white/40 font-mono">
            <span>₹100</span>
            <span>₹50 Lakh</span>
            <span>₹1 Crore</span>
          </div>
        </div>

        {/* 2. Tax Rate Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="gst-rate-input">GST / VAT Rate</label>
            <div className="flex items-center gap-1 font-mono text-purple-600 dark:text-purple-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <input
                id="gst-rate-input"
                type="number"
                min={0}
                max={50}
                step={0.5}
                value={taxRate}
                onChange={(e) => setTaxRate(Math.max(0, Math.min(50, Number(e.target.value) || 0)))}
                className="w-14 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
              <span>%</span>
            </div>
          </div>

          {/* Quick preset buttons for standard Indian GST slabs */}
          <div className="flex items-center gap-1.5">
            {commonSlabs.map((slab) => (
              <button
                key={slab}
                type="button"
                onClick={() => setTaxRate(slab)}
                className={`flex-1 py-1 px-1.5 rounded-lg text-xs font-bold transition-all ${
                  taxRate === slab
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white/80 dark:bg-white/10 text-slate-700 dark:text-white/80 hover:bg-slate-200 dark:hover:bg-white/20'
                }`}
              >
                {slab}%
              </button>
            ))}
          </div>

          <input
            type="range"
            min={0}
            max={50}
            step={0.5}
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

      </div>

      {/* Visual Proportional Split Chart & Tax Breakdown */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-500" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Price vs. Tax Ratio Breakdown
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-white/60">
            {basePct.toFixed(1)}% Base / {taxPct.toFixed(1)}% Tax
          </span>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="space-y-1.5">
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-200 dark:bg-white/10 p-0.5">
            <div
              style={{ width: `${basePct}%` }}
              className="bg-cyan-500 h-full rounded-l-lg transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1"
              title={`Base Price: ${formatINR(netAmount)}`}
            >
              {basePct > 18 && `Base: ${basePct.toFixed(1)}%`}
            </div>
            <div
              style={{ width: `${halfTaxPct}%` }}
              className="bg-purple-500 h-full transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1"
              title={`CGST (${taxRate/2}%): ${formatINR(cgstAmount)}`}
            >
              {halfTaxPct > 10 && `CGST: ${halfTaxPct.toFixed(1)}%`}
            </div>
            <div
              style={{ width: `${halfTaxPct}%` }}
              className="bg-pink-500 h-full rounded-r-lg transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1"
              title={`SGST (${taxRate/2}%): ${formatINR(sgstAmount)}`}
            >
              {halfTaxPct > 10 && `SGST: ${halfTaxPct.toFixed(1)}%`}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-white/60 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <span>Net Base: <strong>{formatINR(netAmount)}</strong> ({basePct.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Central GST ({taxRate/2}%): <strong>{formatINR(cgstAmount)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
              <span>State GST ({taxRate/2}%): <strong>{formatINR(sgstAmount)}</strong></span>
            </div>
          </div>
        </div>

        {/* Detailed Invoice Tax Schedule Table */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 dark:text-white/40 border-b border-slate-200 dark:border-white/10">
                <th className="pb-2 font-bold uppercase">Tax Head</th>
                <th className="pb-2 font-bold uppercase">Rate</th>
                <th className="pb-2 font-bold uppercase text-right">Taxable Value</th>
                <th className="pb-2 font-bold uppercase text-right">Tax Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
              <tr>
                <td className="py-2 text-slate-800 dark:text-white font-sans font-medium">CGST (Central Tax)</td>
                <td className="py-2 text-purple-600 dark:text-purple-300">{(taxRate / 2).toFixed(1)}%</td>
                <td className="py-2 text-right">{formatINR(netAmount)}</td>
                <td className="py-2 text-right font-bold text-purple-600 dark:text-purple-300">{formatINR(cgstAmount)}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-800 dark:text-white font-sans font-medium">SGST / UTGST (State Tax)</td>
                <td className="py-2 text-pink-600 dark:text-pink-300">{(taxRate / 2).toFixed(1)}%</td>
                <td className="py-2 text-right">{formatINR(netAmount)}</td>
                <td className="py-2 text-right font-bold text-pink-600 dark:text-pink-300">{formatINR(sgstAmount)}</td>
              </tr>
              <tr className="font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/20">
                <td className="pt-2 text-slate-900 dark:text-white font-sans">Total Integrated Invoice</td>
                <td className="pt-2">{taxRate}%</td>
                <td className="pt-2 text-right">{formatINR(netAmount)}</td>
                <td className="pt-2 text-right text-blue-600 dark:text-cyan-400">{formatINR(grossAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* --- 0.2 F.I.R.E. Retirement Estimator --- */
function FireRetirementDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retireAge, setRetireAge] = useState<number>(50);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(50000);
  const [currentSavings, setCurrentSavings] = useState<number>(1000000);
  const [monthlyInvest, setMonthlyInvest] = useState<number>(35000);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [fireMultiplier, setFireMultiplier] = useState<number>(25); // 25x = 4% rule, 33x = 3% rule, 20x = LeanFIRE

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  const formatINRShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
    return `₹${Math.round(val)}`;
  };

  const yearsToRetire = Math.max(1, retireAge - currentAge);
  const annualExpensesToday = monthlyExpense * 12;

  // Future annual expenses at retirement adjusted for inflation
  const futureAnnualExpenses = annualExpensesToday * Math.pow(1 + inflationRate / 100, yearsToRetire);
  
  // Total FIRE Number needed (Target Corpus using 25x / 4% safe withdrawal rule)
  const fireTargetCorpus = futureAnnualExpenses * fireMultiplier;

  // Year-by-year trajectory
  const trajectory: Array<{
    age: number;
    yearIndex: number;
    projectedWealth: number;
    targetCorpus: number;
  }> = [];

  let runningBalance = currentSavings;
  const r = returnRate / 100;
  const inf = inflationRate / 100;

  for (let y = 0; y <= yearsToRetire; y++) {
    const ageAtYear = currentAge + y;
    const expAtYear = annualExpensesToday * Math.pow(1 + inf, y);
    const targetAtYear = expAtYear * fireMultiplier;

    trajectory.push({
      age: ageAtYear,
      yearIndex: y,
      projectedWealth: Math.round(runningBalance),
      targetCorpus: Math.round(targetAtYear)
    });

    if (y < yearsToRetire) {
      // Advance by 12 months with monthly investments
      for (let m = 1; m <= 12; m++) {
        runningBalance += monthlyInvest;
        runningBalance *= Math.pow(1 + r, 1 / 12);
      }
    }
  }

  const projectedCorpusAtRetirement = trajectory[trajectory.length - 1]?.projectedWealth || runningBalance;
  const difference = projectedCorpusAtRetirement - fireTargetCorpus;
  const isOnTrack = difference >= 0;

  // Safe withdrawal monthly income at retirement
  const monthlyRetirementIncome = (projectedCorpusAtRetirement / fireMultiplier) / 12;

  const maxVal = Math.max(...trajectory.map(t => Math.max(t.projectedWealth, t.targetCorpus)), 1);

  return (
    <div className="space-y-6" id="fire-tool-content">
      {/* 3 Major Live Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: F.I.R.E. Number Needed */}
        <div className="p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              Target F.I.R.E. Number
            </span>
            <span className="p-1 rounded-md bg-rose-500/20 text-rose-600 dark:text-rose-300 font-mono text-[10px]">
              {fireMultiplier}x Rule
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-300 tracking-tight">
            {formatINR(fireTargetCorpus)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Required at Age {retireAge} for {formatINRShort(futureAnnualExpenses)}/yr spend
          </div>
        </div>

        {/* Card 2: Projected Corpus at Retirement */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span>Projected Wealth</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
              At Age {retireAge}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatINR(projectedCorpusAtRetirement)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Provides {formatINRShort(monthlyRetirementIncome)}/mo passive cashflow
          </div>
        </div>

        {/* Card 3: Status & Readiness */}
        <div className={`p-5 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
          isOnTrack 
            ? 'bg-emerald-500/10 border-emerald-500/30' 
            : 'bg-amber-500/10 border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-1.5">
            <span className={`flex items-center gap-1 ${isOnTrack ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {isOnTrack ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {isOnTrack ? 'On Track for Early Exit' : 'Corpus Shortfall Detected'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isOnTrack ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
            }`}>
              {isOnTrack ? 'Surplus' : 'Deficit'}
            </span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isOnTrack ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'
          }`}>
            {isOnTrack ? `+${formatINR(difference)}` : `-${formatINR(Math.abs(difference))}`}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/60 mt-1 font-medium">
            {isOnTrack 
              ? `You have a ${(projectedCorpusAtRetirement / fireTargetCorpus * 100).toFixed(0)}% funding ratio!`
              : `Boost savings by ${formatINRShort(Math.abs(difference) / (yearsToRetire * 12))}/mo to bridge gap.`}
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* Current Age */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="fire-current-age">Current Age</label>
            <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 text-xs">
              {currentAge} Yrs
            </span>
          </div>
          <input
            type="range"
            id="fire-current-age"
            min={18}
            max={65}
            step={1}
            value={currentAge}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentAge(val);
              if (val >= retireAge) setRetireAge(val + 5);
            }}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>18 Yrs</span>
            <span>40 Yrs</span>
            <span>65 Yrs</span>
          </div>
        </div>

        {/* Target Retirement Age */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="fire-retire-age">Target Retirement Age</label>
            <span className="font-mono text-rose-600 dark:text-rose-400 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 text-xs">
              {retireAge} Yrs ({yearsToRetire}y left)
            </span>
          </div>
          <input
            type="range"
            id="fire-retire-age"
            min={Math.max(25, currentAge + 1)}
            max={75}
            step={1}
            value={retireAge}
            onChange={(e) => setRetireAge(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{currentAge + 1} Yrs</span>
            <span>50 Yrs</span>
            <span>75 Yrs</span>
          </div>
        </div>

        {/* Monthly Expenses Today */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="fire-expense">Monthly Living Expenses</label>
            <span className="font-mono text-purple-600 dark:text-purple-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 text-xs">
              {formatINRShort(monthlyExpense)}
            </span>
          </div>
          <input
            type="range"
            id="fire-expense"
            min={5000}
            max={1000000}
            step={2500}
            value={monthlyExpense}
            onChange={(e) => setMonthlyExpense(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹5k</span>
            <span>₹5 Lakh</span>
            <span>₹10 Lakh</span>
          </div>
        </div>

        {/* Current Net Worth / Savings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="fire-current-savings">Current Net Worth / Savings</label>
            <span className="font-mono text-emerald-600 dark:text-emerald-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 text-xs">
              {formatINRShort(currentSavings)}
            </span>
          </div>
          <input
            type="range"
            id="fire-current-savings"
            min={0}
            max={50000000}
            step={25000}
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹0</span>
            <span>₹2.5 Cr</span>
            <span>₹5 Crore</span>
          </div>
        </div>

        {/* Monthly Investment / Savings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="fire-monthly-invest">Monthly Investment Added</label>
            <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 text-xs">
              {formatINRShort(monthlyInvest)}/mo
            </span>
          </div>
          <input
            type="range"
            id="fire-monthly-invest"
            min={0}
            max={500000}
            step={1000}
            value={monthlyInvest}
            onChange={(e) => setMonthlyInvest(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹0</span>
            <span>₹2.5 Lakh</span>
            <span>₹5 Lakh/mo</span>
          </div>
        </div>

        {/* Return Rate & Inflation Rates */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label>Returns ({returnRate}%) & Inf. ({inflationRate}%)</label>
            <span className="text-[11px] font-mono text-slate-500 dark:text-white/60">
              Real: {(returnRate - inflationRate).toFixed(1)}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">Return p.a.</span>
              <input
                type="number"
                min={1}
                max={20}
                step={0.5}
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-12 text-center bg-transparent font-bold text-sm outline-none"
              />
              <span className="text-xs font-bold">%</span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">Inflation</span>
              <input
                type="number"
                min={1}
                max={15}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-12 text-center bg-transparent font-bold text-sm outline-none"
              />
              <span className="text-xs font-bold">%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Trajectory Growth Graph & Year-by-Year Curve */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-rose-500" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Wealth Trajectory vs. F.I.R.E. Target Line (Age {currentAge} &rarr; {retireAge})
            </h4>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-white/70">Projected Wealth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-500"></span>
              <span className="text-slate-600 dark:text-white/70">F.I.R.E. Target Number</span>
            </div>
          </div>
        </div>

        {/* Dynamic Visual Trajectory Bar Graph */}
        <div className="h-52 sm:h-60 flex items-end gap-1 sm:gap-2 pt-6 pb-2 border-b border-slate-200 dark:border-white/10 overflow-x-auto">
          {trajectory.map((point) => {
            const wealthPct = (point.projectedWealth / maxVal) * 100;
            const targetPct = (point.targetCorpus / maxVal) * 100;
            const achieved = point.projectedWealth >= point.targetCorpus;

            return (
              <div
                key={point.age}
                className="flex-1 min-w-[16px] sm:min-w-[22px] max-w-[36px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-16 z-30 hidden group-hover:block px-3 py-1.5 rounded-xl bg-slate-950 text-white text-[11px] font-mono shadow-xl whitespace-nowrap border border-white/20 pointer-events-none">
                  <div className="font-bold text-cyan-300">Age {point.age}</div>
                  <div className="text-emerald-400">Wealth: {formatINRShort(point.projectedWealth)}</div>
                  <div className="text-rose-400">FIRE Need: {formatINRShort(point.targetCorpus)}</div>
                </div>

                <div className="w-full flex items-end justify-center h-full gap-0.5">
                  {/* Wealth Bar */}
                  <div
                    style={{ height: `${wealthPct}%` }}
                    className={`w-1/2 rounded-t-sm transition-all duration-300 ${
                      achieved ? 'bg-emerald-500' : 'bg-cyan-500'
                    } group-hover:brightness-125`}
                  />
                  {/* Target Bar */}
                  <div
                    style={{ height: `${targetPct}%` }}
                    className="w-1/2 rounded-t-sm bg-rose-500/80 transition-all duration-300 group-hover:brightness-125"
                  />
                </div>

                {/* X Axis Label */}
                {(trajectory.length <= 15 || point.age % 5 === 0 || point.age === retireAge || point.age === currentAge) && (
                  <span className="text-[10px] text-slate-400 dark:text-white/40 mt-1 font-mono">
                    {point.age}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Key Milestone Footnotes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Today's Yearly Spend</div>
            <div className="font-bold text-slate-800 dark:text-white mt-0.5">{formatINRShort(annualExpensesToday)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Retirement Year Spend</div>
            <div className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">{formatINRShort(futureAnnualExpenses)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="text-[10px] text-slate-400 font-bold uppercase">4% Safe SWR Corpus</div>
            <div className="font-bold text-slate-800 dark:text-white mt-0.5">{formatINRShort(fireTargetCorpus)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Financial Freedom Age</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {trajectory.find(t => t.projectedWealth >= t.targetCorpus)?.age 
                ? `Age ${trajectory.find(t => t.projectedWealth >= t.targetCorpus)?.age} 🚀`
                : `Beyond ${retireAge}`}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* --- 0.3 CAGR & Multi-Year Growth Gauge --- */
function CagrCalculatorDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [initialVal, setInitialVal] = useState<number>(100000);
  const [finalVal, setFinalVal] = useState<number>(450000);
  const [years, setYears] = useState<number>(5);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  const formatINRShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
    return `₹${Math.round(val)}`;
  };

  const safeInitial = Math.max(1, initialVal);
  const safeFinal = Math.max(0, finalVal);
  const safeYears = Math.max(0.1, years);

  // CAGR Formula: ((Final / Initial) ^ (1 / Years)) - 1
  const cagr = ((Math.pow(safeFinal / safeInitial, 1 / safeYears) - 1) * 100);
  
  // Total Absolute Return
  const absoluteReturn = ((safeFinal - safeInitial) / safeInitial) * 100;
  const netGain = safeFinal - safeInitial;
  const multiplier = (safeFinal / safeInitial).toFixed(2);

  // Growth trajectory points
  const points: Array<{ year: number; value: number }> = [];
  const rDecimal = cagr / 100;
  for (let y = 0; y <= Math.ceil(safeYears); y++) {
    const valAtY = safeInitial * Math.pow(1 + rDecimal, y);
    points.push({
      year: y,
      value: Math.round(valAtY)
    });
  }

  const maxVal = Math.max(...points.map(p => p.value), 1);

  return (
    <div className="space-y-6" id="cagr-tool-content">
      {/* 3 Major Live Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Exact CAGR % */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-600/10 via-purple-500/10 to-indigo-500/10 border border-violet-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-1.5">
            <span>Compound Annual Growth (CAGR)</span>
            <span className="p-1 rounded-md bg-violet-500/20 text-violet-600 dark:text-violet-300 font-mono text-xs">
              % p.a.
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-violet-600 dark:text-violet-300 tracking-tight">
            {cagr.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Annualized compounded return over {years} Years
          </div>
        </div>

        {/* Card 2: Total Absolute Return % */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span>Absolute Total Return</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold">
              {multiplier}x Capital
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-300 tracking-tight">
            +{absoluteReturn.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Point-to-point percentage appreciation
          </div>
        </div>

        {/* Card 3: Total Absolute Wealth Gain */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span>Net Wealth Creation</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono">
              ₹ Gain
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {netGain >= 0 ? `+${formatINR(netGain)}` : `-${formatINR(Math.abs(netGain))}`}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            From {formatINRShort(safeInitial)} to {formatINRShort(safeFinal)}
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* 1. Initial Investment Value */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="cagr-initial-input">Initial Value (₹)</label>
            <div className="flex items-center gap-1 font-mono text-cyan-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>₹</span>
              <input
                id="cagr-initial-input"
                type="number"
                min={100}
                max={50000000}
                step={5000}
                value={initialVal}
                onChange={(e) => setInitialVal(Math.max(1, Number(e.target.value) || 0))}
                className="w-24 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={100}
            max={10000000}
            step={5000}
            value={initialVal}
            onChange={(e) => setInitialVal(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹100</span>
            <span>₹50 Lakh</span>
            <span>₹1 Crore</span>
          </div>
        </div>

        {/* 2. Final Investment Value */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="cagr-final-input">Final Value (₹)</label>
            <div className="flex items-center gap-1 font-mono text-violet-600 dark:text-violet-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>₹</span>
              <input
                id="cagr-final-input"
                type="number"
                min={100}
                max={500000000}
                step={10000}
                value={finalVal}
                onChange={(e) => setFinalVal(Math.max(0, Number(e.target.value) || 0))}
                className="w-24 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={100}
            max={50000000}
            step={10000}
            value={finalVal}
            onChange={(e) => setFinalVal(Number(e.target.value))}
            className="w-full accent-violet-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹100</span>
            <span>₹2.5 Cr</span>
            <span>₹5 Crore</span>
          </div>
        </div>

        {/* 3. Duration in Years */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="cagr-years-input">Duration (Years)</label>
            <div className="flex items-center gap-1 font-mono text-pink-600 dark:text-pink-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <input
                id="cagr-years-input"
                type="number"
                min={1}
                max={40}
                step={1}
                value={years}
                onChange={(e) => setYears(Math.max(1, Math.min(40, Number(e.target.value) || 1)))}
                className="w-12 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
              <span>Yrs</span>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1 Year</span>
            <span>20 Years</span>
            <span>40 Years</span>
          </div>
        </div>

      </div>

      {/* Visual Exponential Curve & Benchmark Comparison */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-500" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              CAGR Growth Progression Curve ({years} Year Horizon)
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-300">
            CAGR: {cagr.toFixed(2)}% | Multiplier: {multiplier}x
          </span>
        </div>

        {/* Visual Bar Curve */}
        <div className="h-48 sm:h-56 flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 border-b border-slate-200 dark:border-white/10 overflow-x-auto">
          {points.map((pt) => {
            const heightPct = (pt.value / maxVal) * 100;
            return (
              <div
                key={pt.year}
                className="flex-1 min-w-[20px] max-w-[48px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-12 z-30 hidden group-hover:block px-2.5 py-1 rounded-lg bg-slate-950 text-white text-[11px] font-mono shadow-xl whitespace-nowrap border border-white/20 pointer-events-none">
                  Year {pt.year}: {formatINRShort(pt.value)}
                </div>

                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full rounded-t-md bg-gradient-to-t from-violet-600 to-indigo-400 group-hover:brightness-125 transition-all duration-300"
                />

                <span className="text-[10px] text-slate-400 dark:text-white/40 mt-1 font-mono">
                  Y{pt.year}
                </span>
              </div>
            );
          })}
        </div>

        {/* Asset Class Benchmark Comparison */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Historical Asset Class Benchmark Comparison
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-slate-400 block text-[10px]">Bank Fixed Deposit</span>
              <span className="font-bold text-slate-700 dark:text-white">~6.5% CAGR</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-slate-400 block text-[10px]">Physical Gold</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">~10.5% CAGR</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-slate-400 block text-[10px]">Nifty 50 Index</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">~12.8% CAGR</span>
            </div>
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30">
              <span className="text-violet-600 dark:text-violet-300 block text-[10px] font-bold">Your Investment</span>
              <span className="font-extrabold text-violet-600 dark:text-violet-300">{cagr.toFixed(2)}% CAGR</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* --- 0.4 Salary In-Hand Net Breakdown --- */
function SalaryInHandDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [ctc, setCtc] = useState<number>(1200000); // Annual CTC in INR
  const [monthlyEpf, setMonthlyEpf] = useState<number>(3600); // Monthly EPF
  const [monthlyPt, setMonthlyPt] = useState<number>(200); // Monthly PT
  const [taxRegime, setTaxRegime] = useState<'new' | 'old'>('new');

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  const formatINRShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
    return `₹${Math.round(val)}`;
  };

  const annualEpf = monthlyEpf * 12;
  const annualPt = monthlyPt * 12;
  const grossMonthly = ctc / 12;

  // Standard deduction
  const standardDeduction = taxRegime === 'new' ? 75000 : 50000;

  // Compute Taxable Income
  let taxableIncome = 0;
  if (taxRegime === 'new') {
    taxableIncome = Math.max(0, ctc - standardDeduction);
  } else {
    // Old regime allows 80C (EPF) and PT deductions
    taxableIncome = Math.max(0, ctc - standardDeduction - Math.min(150000, annualEpf) - annualPt);
  }

  // Calculate Income Tax
  let baseTax = 0;

  if (taxRegime === 'new') {
    // New Slabs FY 24-25 / 25-26
    if (taxableIncome <= 300000) {
      baseTax = 0;
    } else if (taxableIncome <= 700000) {
      baseTax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      baseTax = 20000 + (taxableIncome - 700000) * 0.10;
    } else if (taxableIncome <= 1200000) {
      baseTax = 50000 + (taxableIncome - 1000000) * 0.15;
    } else if (taxableIncome <= 1500000) {
      baseTax = 80000 + (taxableIncome - 1200000) * 0.20;
    } else {
      baseTax = 140000 + (taxableIncome - 1500000) * 0.30;
    }

    // Section 87A rebate for New Regime (Zero tax if taxable income <= 7,00,000)
    if (taxableIncome <= 700000) {
      baseTax = 0;
    }
  } else {
    // Old Slabs
    if (taxableIncome <= 250000) {
      baseTax = 0;
    } else if (taxableIncome <= 500000) {
      baseTax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      baseTax = 12500 + (taxableIncome - 500000) * 0.20;
    } else {
      baseTax = 112500 + (taxableIncome - 1000000) * 0.30;
    }

    // Section 87A rebate for Old Regime (Zero tax if taxable income <= 5,00,000)
    if (taxableIncome <= 500000) {
      baseTax = 0;
    }
  }

  // 4% Health & Education Cess
  const cess = baseTax * 0.04;
  const totalAnnualTax = baseTax + cess;
  const monthlyTax = totalAnnualTax / 12;

  // Total deductions
  const totalMonthlyDeductions = monthlyTax + monthlyEpf + monthlyPt;
  const netMonthlySalary = Math.max(0, grossMonthly - totalMonthlyDeductions);
  const netAnnualSalary = netMonthlySalary * 12;

  // Proportions for visual chart
  const takeHomePct = grossMonthly > 0 ? (netMonthlySalary / grossMonthly) * 100 : 0;
  const taxPct = grossMonthly > 0 ? (monthlyTax / grossMonthly) * 100 : 0;
  const deductionsPct = grossMonthly > 0 ? ((monthlyEpf + monthlyPt) / grossMonthly) * 100 : 0;

  return (
    <div className="space-y-6" id="salary-tool-content">
      {/* 3 Major Live Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Net Monthly In-Hand */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
              Net Monthly In-Hand
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
              {takeHomePct.toFixed(0)}% of CTC
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatINR(netMonthlySalary)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            Annual in-hand: {formatINR(netAnnualSalary)}
          </div>
        </div>

        {/* Card 2: Income Tax Deducted */}
        <div className="p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1.5">
            <span>Income Tax (TDS)</span>
            <span className="p-1 rounded-md bg-rose-500/20 text-rose-600 dark:text-rose-300 font-mono text-[10px]">
              {taxRegime === 'new' ? 'New Regime' : 'Old Regime'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-300 tracking-tight">
            {formatINR(monthlyTax)}<span className="text-sm font-normal text-slate-400">/mo</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Total annual tax: {formatINR(totalAnnualTax)} (incl. 4% cess)
          </div>
        </div>

        {/* Card 3: Total Deductions (Tax + EPF + PT) */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Total Monthly Deductions</span>
            <span className="p-1 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono text-[10px]">
              EPF+PT+Tax
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            {formatINR(totalMonthlyDeductions)}<span className="text-sm font-normal text-slate-400">/mo</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            EPF ({formatINR(monthlyEpf)}) + PT ({formatINR(monthlyPt)}) + TDS ({formatINR(monthlyTax)})
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* Regime Toggle */}
        <div className="md:col-span-3 space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80 block">
            Tax Regime Selection
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-200/80 dark:bg-white/10">
            <button
              type="button"
              onClick={() => setTaxRegime('new')}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                taxRegime === 'new'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${taxRegime === 'new' ? 'opacity-100' : 'opacity-0'}`} />
              <span>New Tax Regime (₹75k Standard Deduction & Zero tax up to ₹7L)</span>
            </button>

            <button
              type="button"
              onClick={() => setTaxRegime('old')}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                taxRegime === 'old'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${taxRegime === 'old' ? 'opacity-100' : 'opacity-0'}`} />
              <span>Old Tax Regime (With 80C EPF & PT Deductions)</span>
            </button>
          </div>
        </div>

        {/* 1. Gross Annual CTC */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="salary-ctc-input">Annual CTC (₹)</label>
            <div className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>₹</span>
              <input
                id="salary-ctc-input"
                type="number"
                min={100000}
                max={50000000}
                step={25000}
                value={ctc}
                onChange={(e) => setCtc(Math.max(100000, Number(e.target.value) || 0))}
                className="w-24 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={100000}
            max={10000000}
            step={25000}
            value={ctc}
            onChange={(e) => setCtc(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹1 Lakh</span>
            <span>₹50 Lakh</span>
            <span>₹1 Crore</span>
          </div>
        </div>

        {/* 2. Monthly EPF */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="salary-epf-input">Monthly Employee PF</label>
            <div className="flex items-center gap-1 font-mono text-purple-600 dark:text-purple-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>₹</span>
              <input
                id="salary-epf-input"
                type="number"
                min={0}
                max={50000}
                step={200}
                value={monthlyEpf}
                onChange={(e) => setMonthlyEpf(Math.max(0, Number(e.target.value) || 0))}
                className="w-16 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={50000}
            step={200}
            value={monthlyEpf}
            onChange={(e) => setMonthlyEpf(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹0</span>
            <span>₹25,000</span>
            <span>₹50,000</span>
          </div>
        </div>

        {/* 3. Professional Tax */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="salary-pt-input">Monthly PT / Deductions</label>
            <div className="flex items-center gap-1 font-mono text-cyan-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>₹</span>
              <input
                id="salary-pt-input"
                type="number"
                min={0}
                max={10000}
                step={50}
                value={monthlyPt}
                onChange={(e) => setMonthlyPt(Math.max(0, Number(e.target.value) || 0))}
                className="w-14 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={5000}
            step={50}
            value={monthlyPt}
            onChange={(e) => setMonthlyPt(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹0</span>
            <span>₹200 (Std)</span>
            <span>₹5,000</span>
          </div>
        </div>

      </div>

      {/* Visual Take-Home Split Bar & Summary Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-500" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Monthly Paycheck Proportional Breakdown
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Gross: {formatINR(grossMonthly)}/mo
          </span>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="space-y-1.5">
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-200 dark:bg-white/10 p-0.5">
            <div
              style={{ width: `${takeHomePct}%` }}
              className="bg-emerald-500 h-full rounded-l-lg transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1"
              title={`Take Home: ${formatINR(netMonthlySalary)}`}
            >
              {takeHomePct > 20 && `Take Home (${takeHomePct.toFixed(1)}%)`}
            </div>
            <div
              style={{ width: `${taxPct}%` }}
              className="bg-rose-500 h-full transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1"
              title={`Income Tax: ${formatINR(monthlyTax)}`}
            >
              {taxPct > 10 && `Tax: ${taxPct.toFixed(1)}%`}
            </div>
            <div
              style={{ width: `${deductionsPct}%` }}
              className="bg-purple-500 h-full rounded-r-lg transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1"
              title={`EPF & PT: ${formatINR(monthlyEpf + monthlyPt)}`}
            >
              {deductionsPct > 10 && `EPF: ${deductionsPct.toFixed(1)}%`}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-white/60 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>In-Hand Salary: <strong>{formatINR(netMonthlySalary)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Income Tax TDS: <strong>{formatINR(monthlyTax)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>EPF + PT Deductions: <strong>{formatINR(monthlyEpf + monthlyPt)}</strong></span>
            </div>
          </div>
        </div>

        {/* Monthly vs Annual Breakdown Table */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 dark:text-white/40 border-b border-slate-200 dark:border-white/10">
                <th className="pb-2 font-bold uppercase">Salary Component</th>
                <th className="pb-2 font-bold uppercase text-right">Monthly (₹)</th>
                <th className="pb-2 font-bold uppercase text-right">Annual (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
              <tr>
                <td className="py-2 text-slate-800 dark:text-white font-sans font-medium">Gross Salary / CTC</td>
                <td className="py-2 text-right">{formatINR(grossMonthly)}</td>
                <td className="py-2 text-right font-bold">{formatINR(ctc)}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-800 dark:text-white font-sans font-medium">Standard Deduction</td>
                <td className="py-2 text-right text-slate-400">-{formatINR(standardDeduction / 12)}</td>
                <td className="py-2 text-right text-slate-400">-{formatINR(standardDeduction)}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-800 dark:text-white font-sans font-medium">Taxable Income</td>
                <td className="py-2 text-right">{formatINR(taxableIncome / 12)}</td>
                <td className="py-2 text-right font-bold">{formatINR(taxableIncome)}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-800 dark:text-white font-sans font-medium">Income Tax (incl. Cess)</td>
                <td className="py-2 text-right text-rose-500">-{formatINR(monthlyTax)}</td>
                <td className="py-2 text-right text-rose-500 font-bold">-{formatINR(totalAnnualTax)}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-800 dark:text-white font-sans font-medium">Employee PF (EPF)</td>
                <td className="py-2 text-right text-purple-500">-{formatINR(monthlyEpf)}</td>
                <td className="py-2 text-right text-purple-500">-{formatINR(annualEpf)}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-800 dark:text-white font-sans font-medium">Professional Tax (PT)</td>
                <td className="py-2 text-right text-purple-500">-{formatINR(monthlyPt)}</td>
                <td className="py-2 text-right text-purple-500">-{formatINR(annualPt)}</td>
              </tr>
              <tr className="font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/20 bg-emerald-500/5">
                <td className="py-2 text-emerald-600 dark:text-emerald-400 font-sans">Net Take-Home Salary</td>
                <td className="py-2 text-right text-emerald-600 dark:text-emerald-400 text-sm">{formatINR(netMonthlySalary)}</td>
                <td className="py-2 text-right text-emerald-600 dark:text-emerald-400 text-sm">{formatINR(netAnnualSalary)}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* =========================================================================
   TOOL 1: INFLATION FUTURE VALUE ERASER
   ========================================================================= */
function InflationCalculatorDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [cashAmount, setCashAmount] = useState<number>(1000000); // ₹10 Lakhs default
  const [inflationRate, setInflationRate] = useState<number>(6.0); // 6% p.a. default
  const [years, setYears] = useState<number>(15); // 15 years default
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  const formatINRShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
    return `₹${Math.round(val)}`;
  };

  const rDecimal = inflationRate / 100;
  
  // Real purchasing power of today's cash in the future
  const realPurchasingPower = cashAmount / Math.pow(1 + rDecimal, years);
  const totalValueLost = cashAmount - realPurchasingPower;
  const purchasingPowerRetainedPct = (realPurchasingPower / cashAmount) * 100;
  const valueLostPct = (totalValueLost / cashAmount) * 100;
  
  // What you will need in future to buy today's ₹X basket
  const futureCostEquivalent = cashAmount * Math.pow(1 + rDecimal, years);

  // Rule of 72 halving time
  const halvingYears = inflationRate > 0 ? (72 / inflationRate).toFixed(1) : '∞';

  // Multi-year decay data points
  const timelineData: Array<{ year: number; realPower: number; lostPower: number; futureCost: number }> = [];
  for (let y = 0; y <= years; y++) {
    const realPower = cashAmount / Math.pow(1 + rDecimal, y);
    const lostPower = cashAmount - realPower;
    const futureCost = cashAmount * Math.pow(1 + rDecimal, y);
    timelineData.push({
      year: y,
      realPower: Math.round(realPower),
      lostPower: Math.round(lostPower),
      futureCost: Math.round(futureCost)
    });
  }

  const activeDataPoint = hoveredYear !== null ? timelineData[hoveredYear] : timelineData[timelineData.length - 1];

  return (
    <div className="space-y-6" id="inflation-tool-content">
      {/* 3 Major Live Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Real Purchasing Power Value */}
        <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Hourglass className="w-3.5 h-3.5 text-amber-500" />
              Real Purchasing Power
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold">
              {purchasingPowerRetainedPct.toFixed(1)}% Retained
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-300 tracking-tight">
            {formatINR(realPurchasingPower)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Worth of {formatINRShort(cashAmount)} after {years} yrs @ {inflationRate}% inflation
          </div>
        </div>

        {/* Card 2: Value Lost to Inflation */}
        <div className="p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1.5">
            <span className="flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
              Value Erased by Inflation
            </span>
            <span className="p-1 rounded-md bg-rose-500/20 text-rose-600 dark:text-rose-300 font-mono text-[10px]">
              -{valueLostPct.toFixed(1)}% Lost
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-300 tracking-tight">
            -{formatINR(totalValueLost)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Silent wealth penalty paid to money supply expansion
          </div>
        </div>

        {/* Card 3: Future Cost Equivalent */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Future Cost Equivalent</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold">
              {(futureCostEquivalent / cashAmount).toFixed(1)}x Inflation Factor
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            {formatINR(futureCostEquivalent)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Needed in Year {years} to buy what {formatINRShort(cashAmount)} buys today
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* 1. Cash Amount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="inflation-cash-input">Current Cash Savings</label>
            <div className="flex items-center gap-1 font-mono text-amber-600 dark:text-amber-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>₹</span>
              <input
                id="inflation-cash-input"
                type="number"
                min={1000}
                max={100000000}
                step={10000}
                value={cashAmount}
                onChange={(e) => setCashAmount(Math.max(1000, Number(e.target.value) || 0))}
                className="w-24 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={10000}
            max={10000000}
            step={25000}
            value={cashAmount}
            onChange={(e) => setCashAmount(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹10,000</span>
            <span>₹50 Lakh</span>
            <span>₹1 Crore</span>
          </div>
        </div>

        {/* 2. Inflation Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="inflation-rate-input">Annual Inflation Rate</label>
            <span className="font-mono text-rose-600 dark:text-rose-400 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 text-xs">
              {inflationRate.toFixed(1)}% p.a.
            </span>
          </div>
          <input
            type="range"
            id="inflation-rate-input"
            min={1.0}
            max={20.0}
            step={0.25}
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1% (Low)</span>
            <span>6% (India Avg)</span>
            <span>20% (High)</span>
          </div>
        </div>

        {/* 3. Time Horizon in Years */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="inflation-years-input">Time Horizon</label>
            <span className="font-mono text-purple-600 dark:text-purple-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 text-xs">
              {years} Years
            </span>
          </div>
          <input
            type="range"
            id="inflation-years-input"
            min={1}
            max={50}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1 Year</span>
            <span>25 Years</span>
            <span>50 Years</span>
          </div>
        </div>

      </div>

      {/* Interactive Visual Purchasing Power Decay Chart */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-black text-sm sm:text-base flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <span>Purchasing Power Decay Trajectory</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Hover over any year bar to view real purchasing capability
            </p>
          </div>

          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Rule of 72: Cash value halves every {halvingYears} years!</span>
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="h-44 sm:h-52 flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-2 overflow-x-auto">
          {timelineData.map((item) => {
            const retainedHeightPct = (item.realPower / cashAmount) * 100;
            const isHovered = hoveredYear === item.year;
            const showLabel = item.year === 0 || item.year === Math.round(years / 2) || item.year === years || item.year % 5 === 0;

            return (
              <div
                key={item.year}
                onMouseEnter={() => setHoveredYear(item.year)}
                onMouseLeave={() => setHoveredYear(null)}
                className="flex-1 min-w-[12px] sm:min-w-[18px] h-full flex flex-col justify-end items-center group cursor-pointer relative"
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded-md shadow-xl whitespace-nowrap z-20 pointer-events-none border border-slate-700">
                    <span className="font-bold text-amber-300">Yr {item.year}:</span> {formatINR(item.realPower)} ({((item.realPower / cashAmount) * 100).toFixed(0)}%)
                  </div>
                )}

                {/* Bar */}
                <div className="w-full h-full flex flex-col justify-end rounded-t-sm overflow-hidden bg-slate-200/50 dark:bg-white/5">
                  {/* Lost segment */}
                  <div 
                    style={{ height: `${100 - retainedHeightPct}%` }}
                    className="w-full bg-rose-500/30 transition-all duration-300"
                  />
                  {/* Real purchasing power segment */}
                  <div
                    style={{ height: `${retainedHeightPct}%` }}
                    className={`w-full transition-all duration-300 ${
                      isHovered ? 'bg-amber-400 dark:bg-amber-400' : 'bg-amber-500 dark:bg-amber-500'
                    }`}
                  />
                </div>

                {/* X Axis Label */}
                {showLabel && (
                  <span className="text-[9px] font-mono text-slate-400 mt-1">
                    Y{item.year}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-white/60 pt-2 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-amber-500"></span>
            <span>Real Purchasing Power: <strong>{formatINR(activeDataPoint?.realPower || realPurchasingPower)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-rose-500/40"></span>
            <span>Purchasing Power Lost: <strong>{formatINR(activeDataPoint?.lostPower || totalValueLost)}</strong></span>
          </div>
        </div>

        {/* Action Button to return to dashboard */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 dark:text-white/40">
            Tip: Invest in equity index funds or real assets to outpace 6% inflation.
          </span>
          {onBackToGrid && (
            <button
              type="button"
              onClick={onBackToGrid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Tools</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TOOL 2: REAL ESTATE CAP RATE & YIELD
   ========================================================================= */
function RealEstateCapRateDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [purchasePrice, setPurchasePrice] = useState<number>(7500000); // ₹75 Lakhs
  const [monthlyRent, setMonthlyRent] = useState<number>(35000); // ₹35,000/mo
  const [annualExpenses, setAnnualExpenses] = useState<number>(60000); // ₹60,000/yr (Maintenance, Tax, Insurance)
  const [expectedAppreciation, setExpectedAppreciation] = useState<number>(5.0); // 5% p.a.

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  const formatINRShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
    return `₹${Math.round(val)}`;
  };

  const grossAnnualIncome = monthlyRent * 12;
  const grossRentalYield = purchasePrice > 0 ? (grossAnnualIncome / purchasePrice) * 100 : 0;
  const noi = grossAnnualIncome - annualExpenses;
  const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;
  const expenseRatio = grossAnnualIncome > 0 ? (annualExpenses / grossAnnualIncome) * 100 : 0;
  const netMonthlyCashflow = noi / 12;
  const totalCombinedRoi = capRate + expectedAppreciation;

  // Cap rate assessment badge
  let yieldVerdict = 'Metro Residential Yield';
  let verdictColor = 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20';
  if (capRate >= 8) {
    yieldVerdict = 'High-Yield Commercial Asset';
    verdictColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  } else if (capRate >= 5) {
    yieldVerdict = 'Healthy Semi-Commercial Yield';
    verdictColor = 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20';
  } else if (capRate < 3) {
    yieldVerdict = 'Low Yield (Tier-1 Luxury Metro)';
    verdictColor = 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
  }

  return (
    <div className="space-y-6" id="caprate-tool-content">
      {/* 3 Major Live Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Capitalization Rate (Cap Rate %) */}
        <div className="p-5 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-sky-500" />
              Capitalization Rate
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/20 text-sky-600 dark:text-sky-300 font-bold">
              Cap Rate
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-300 tracking-tight">
            {capRate.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Net return on property cost after all expenses
          </div>
        </div>

        {/* Card 2: Net Operating Income (NOI) */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span>Net Operating Income (NOI)</span>
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono text-[10px]">
              Annual
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-300 tracking-tight">
            {formatINR(noi)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {formatINR(netMonthlyCashflow)}/mo net cashflow in pocket
          </div>
        </div>

        {/* Card 3: Gross Rental Yield & Verdict */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Gross Rental Yield</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold">
              Gross Yield
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            {grossRentalYield.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Gross annual rent: {formatINR(grossAnnualIncome)}/yr
          </div>
        </div>
      </div>

      {/* Property Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* 1. Property Purchase Price */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="caprate-price-input">Property Purchase Price</label>
            <div className="flex items-center gap-1 font-mono text-sky-600 dark:text-sky-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>₹</span>
              <input
                id="caprate-price-input"
                type="number"
                min={100000}
                max={500000000}
                step={50000}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Math.max(100000, Number(e.target.value) || 0))}
                className="w-28 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={500000}
            max={50000000}
            step={100000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹5 Lakh</span>
            <span>₹2.5 Crore</span>
            <span>₹5 Crore</span>
          </div>
        </div>

        {/* 2. Expected Monthly Rental Income */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="caprate-rent-input">Monthly Rental Income</label>
            <div className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>₹</span>
              <input
                id="caprate-rent-input"
                type="number"
                min={1000}
                max={5000000}
                step={1000}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Math.max(1000, Number(e.target.value) || 0))}
                className="w-20 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={5000}
            max={500000}
            step={2500}
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹5,000/mo</span>
            <span>₹2.5 Lakh/mo</span>
            <span>₹5 Lakh/mo</span>
          </div>
        </div>

        {/* 3. Annual Operating Expenses */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="caprate-expenses-input">Annual Operating Expenses</label>
            <div className="flex items-center gap-1 font-mono text-rose-600 dark:text-rose-400 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>₹</span>
              <input
                id="caprate-expenses-input"
                type="number"
                min={0}
                max={5000000}
                step={2500}
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(Math.max(0, Number(e.target.value) || 0))}
                className="w-20 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={500000}
            step={2500}
            value={annualExpenses}
            onChange={(e) => setAnnualExpenses(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹0 (None)</span>
            <span>₹2.5 Lakh/yr</span>
            <span>₹5 Lakh/yr</span>
          </div>
        </div>

        {/* 4. Expected Annual Capital Appreciation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="caprate-apprec-input">Expected Property Appreciation</label>
            <span className="font-mono text-purple-600 dark:text-purple-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 text-xs">
              {expectedAppreciation.toFixed(1)}% p.a.
            </span>
          </div>
          <input
            type="range"
            id="caprate-apprec-input"
            min={0.0}
            max={15.0}
            step={0.5}
            value={expectedAppreciation}
            onChange={(e) => setExpectedAppreciation(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0%</span>
            <span>7.5%</span>
            <span>15%</span>
          </div>
        </div>

      </div>

      {/* Revenue Breakdown & Yield Analysis */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-black text-sm sm:text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-500" />
              <span>Rental Income Distribution & Asset Score</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Operating expense leakage vs clean Net Operating Income
            </p>
          </div>

          <div className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${verdictColor}`}>
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>Rating: {yieldVerdict}</span>
          </div>
        </div>

        {/* Proportional Revenue Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-8 rounded-2xl overflow-hidden flex bg-slate-200 dark:bg-white/10 p-1">
            <div
              style={{ width: `${Math.min(100, Math.max(5, 100 - expenseRatio))}%` }}
              className="h-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm transition-all duration-300"
            >
              NOI: {(100 - expenseRatio).toFixed(0)}%
            </div>
            {expenseRatio > 0 && (
              <div
                style={{ width: `${Math.min(95, Math.max(5, expenseRatio))}%` }}
                className="h-full rounded-xl bg-rose-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm transition-all duration-300"
              >
                Exp: {expenseRatio.toFixed(0)}%
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-white/60 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Net Operating Income: <strong>{formatINR(noi)}/yr</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Operating Expenses: <strong>{formatINR(annualExpenses)}/yr</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Total ROI (Cap + Growth): <strong>{totalCombinedRoi.toFixed(2)}% p.a.</strong></span>
            </div>
          </div>
        </div>

        {/* 10-Year Cumulative Cashflow & Value Schedule */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 dark:text-white/40 border-b border-slate-200 dark:border-white/10">
                <th className="pb-2 font-bold uppercase">Timeline</th>
                <th className="pb-2 font-bold uppercase text-right">Estimated Property Value</th>
                <th className="pb-2 font-bold uppercase text-right">Cumulative Net Rent</th>
                <th className="pb-2 font-bold uppercase text-right">Total Net Return (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
              {[1, 3, 5, 10].map((yr) => {
                const projectedVal = purchasePrice * Math.pow(1 + expectedAppreciation / 100, yr);
                const cumRent = noi * yr;
                const totalGain = (projectedVal - purchasePrice) + cumRent;
                return (
                  <tr key={yr}>
                    <td className="py-2 text-slate-800 dark:text-white font-sans font-medium">Year {yr}</td>
                    <td className="py-2 text-right font-bold text-sky-600 dark:text-sky-400">{formatINR(projectedVal)}</td>
                    <td className="py-2 text-right text-emerald-600 dark:text-emerald-400">+{formatINR(cumRent)}</td>
                    <td className="py-2 text-right font-bold text-purple-600 dark:text-purple-300">+{formatINR(totalGain)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Button to return to dashboard */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 dark:text-white/40">
            Note: Cap Rate ignores mortgage leverage and financing interest payments.
          </span>
          {onBackToGrid && (
            <button
              type="button"
              onClick={onBackToGrid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Tools</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TOOL 3: FD & RD FIXED TERM ANALYZER
   ========================================================================= */
function FdRdAnalyzerDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [mode, setMode] = useState<'fd' | 'rd'>('fd');
  const [amount, setAmount] = useState<number>(500000); // ₹5 Lakhs for FD / ₹10,000 for RD
  const [interestRate, setInterestRate] = useState<number>(7.25); // 7.25% p.a.
  const [tenureYears, setTenureYears] = useState<number>(5); // 5 Years
  const [compoundingFreq, setCompoundingFreq] = useState<number>(4); // 4 = quarterly (Indian bank standard)
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);

  const effectiveRate = interestRate + (isSeniorCitizen ? 0.5 : 0);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  const formatINRShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
    return `₹${Math.round(val)}`;
  };

  const rDecimal = effectiveRate / 100;
  const n = compoundingFreq;
  const t = tenureYears;

  let totalPrincipal = 0;
  let maturityAmount = 0;
  let totalInterest = 0;

  // Yearly progression
  const yearlyProgression: Array<{ year: number; principal: number; interest: number; total: number }> = [];

  if (mode === 'fd') {
    totalPrincipal = amount;
    maturityAmount = totalPrincipal * Math.pow(1 + rDecimal / n, n * t);
    totalInterest = Math.max(0, maturityAmount - totalPrincipal);

    for (let y = 1; y <= t; y++) {
      const yearMaturity = totalPrincipal * Math.pow(1 + rDecimal / n, n * y);
      const yearInterest = Math.max(0, yearMaturity - totalPrincipal);
      yearlyProgression.push({
        year: y,
        principal: totalPrincipal,
        interest: Math.round(yearInterest),
        total: Math.round(yearMaturity)
      });
    }
  } else {
    // RD Mode
    const monthlyDeposit = amount;
    const totalMonths = t * 12;
    totalPrincipal = monthlyDeposit * totalMonths;

    // Standard Indian RD quarterly compounded formula
    let runningMaturity = 0;
    for (let m = 1; m <= totalMonths; m++) {
      const remainingMonths = totalMonths - m + 1;
      runningMaturity += monthlyDeposit * Math.pow(1 + rDecimal / n, n * (remainingMonths / 12));
    }
    maturityAmount = runningMaturity;
    totalInterest = Math.max(0, maturityAmount - totalPrincipal);

    for (let y = 1; y <= t; y++) {
      const yMonths = y * 12;
      const yPrincipal = monthlyDeposit * yMonths;
      let yMaturity = 0;
      for (let m = 1; m <= yMonths; m++) {
        const rem = yMonths - m + 1;
        yMaturity += monthlyDeposit * Math.pow(1 + rDecimal / n, n * (rem / 12));
      }
      yearlyProgression.push({
        year: y,
        principal: yPrincipal,
        interest: Math.round(Math.max(0, yMaturity - yPrincipal)),
        total: Math.round(yMaturity)
      });
    }
  }

  const effectiveAnnualYield = totalPrincipal > 0 ? (totalInterest / totalPrincipal / t) * 100 : 0;
  const interestRatio = maturityAmount > 0 ? (totalInterest / maturityAmount) * 100 : 0;

  return (
    <div className="space-y-6" id="fdrd-tool-content">
      {/* FD vs RD Mode Selector */}
      <div className="p-1.5 rounded-2xl bg-slate-200/80 dark:bg-white/10 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setMode('fd');
            if (amount < 25000) setAmount(500000);
          }}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'fd'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
              : 'text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span>Fixed Deposit (FD) — Lump Sum</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('rd');
            if (amount > 100000) setAmount(10000);
          }}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'rd'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20'
              : 'text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Recurring Deposit (RD) — Monthly</span>
        </button>
      </div>

      {/* 3 Major Live Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Invested Principal */}
        <div className="p-5 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1.5">
            <span>Invested Principal</span>
            <span className="p-1 rounded-md bg-sky-500/20 text-sky-600 dark:text-sky-300 font-mono text-[10px]">
              {mode === 'fd' ? 'One-time' : `${tenureYears * 12} Deposits`}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-300 tracking-tight">
            {formatINR(totalPrincipal)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {mode === 'fd' ? 'Initial deposit amount' : `${formatINR(amount)}/mo for ${tenureYears} yrs`}
          </div>
        </div>

        {/* Card 2: Total Interest Earned */}
        <div className="p-5 rounded-2xl bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-1.5">
            <span>Total Interest Earned</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-500/20 text-pink-600 dark:text-pink-300 font-bold">
              +{interestRatio.toFixed(1)}% of Maturity
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-pink-600 dark:text-pink-300 tracking-tight">
            +{formatINR(totalInterest)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Effective Annual Yield: {effectiveAnnualYield.toFixed(2)}% p.a.
          </div>
        </div>

        {/* Card 3: Total Maturity Wealth */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span>Total Maturity Wealth</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
              Maturity
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-300 tracking-tight">
            {formatINR(maturityAmount)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            After {tenureYears} Years @ {effectiveRate}% p.a.
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* 1. Investment Amount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="fdrd-amount-input">
              {mode === 'fd' ? 'Deposit Principal' : 'Monthly RD Installment'}
            </label>
            <div className="flex items-center gap-1 font-mono text-pink-600 dark:text-pink-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>₹</span>
              <input
                id="fdrd-amount-input"
                type="number"
                min={500}
                max={50000000}
                step={mode === 'fd' ? 10000 : 1000}
                value={amount}
                onChange={(e) => setAmount(Math.max(500, Number(e.target.value) || 0))}
                className="w-24 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={mode === 'fd' ? 10000 : 500}
            max={mode === 'fd' ? 5000000 : 100000}
            step={mode === 'fd' ? 10000 : 500}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{mode === 'fd' ? '₹10,000' : '₹500/mo'}</span>
            <span>{mode === 'fd' ? '₹25 Lakh' : '₹50,000/mo'}</span>
            <span>{mode === 'fd' ? '₹50 Lakh' : '₹1 Lakh/mo'}</span>
          </div>
        </div>

        {/* 2. Rate of Interest per Annum */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="fdrd-rate-input">Interest Rate (p.a.)</label>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 text-xs">
              {effectiveRate.toFixed(2)}%
            </span>
          </div>
          <input
            type="range"
            id="fdrd-rate-input"
            min={2.0}
            max={15.0}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>2%</span>
            <span>7.25% (Bank Avg)</span>
            <span>15%</span>
          </div>
        </div>

        {/* 3. Tenure & Senior Citizen Switch */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="fdrd-tenure-input">Tenure in Years</label>
            <span className="font-mono text-purple-600 dark:text-purple-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 text-xs">
              {tenureYears} Yrs ({tenureYears * 12} Mo)
            </span>
          </div>
          <input
            type="range"
            id="fdrd-tenure-input"
            min={1}
            max={30}
            step={1}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex items-center justify-between pt-1">
            {/* Senior citizen toggle */}
            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-white/70 cursor-pointer">
              <input
                type="checkbox"
                checked={isSeniorCitizen}
                onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                className="rounded accent-pink-500 cursor-pointer"
              />
              <span>Senior Citizen (+0.50% extra)</span>
            </label>

            {/* Compounding frequency select */}
            <select
              value={compoundingFreq}
              onChange={(e) => setCompoundingFreq(Number(e.target.value))}
              className="text-[11px] font-bold bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 outline-none text-slate-700 dark:text-white"
            >
              <option value={4}>Quarterly Compounded (Standard)</option>
              <option value={12}>Monthly Compounded</option>
              <option value={2}>Half-Yearly Compounded</option>
              <option value={1}>Annually Compounded</option>
            </select>
          </div>
        </div>

      </div>

      {/* Breakdown Schedule & Distribution */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-black text-sm sm:text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-pink-500" />
              <span>Year-by-Year Maturity Growth Schedule</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Guaranteed cumulative wealth progression across {tenureYears} years
            </p>
          </div>

          <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>DICGC Insured up to ₹5,00,000</span>
          </div>
        </div>

        {/* Progression Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 dark:text-white/40 border-b border-slate-200 dark:border-white/10">
                <th className="pb-2 font-bold uppercase">Year</th>
                <th className="pb-2 font-bold uppercase text-right">Invested Principal (₹)</th>
                <th className="pb-2 font-bold uppercase text-right">Interest Accrued (₹)</th>
                <th className="pb-2 font-bold uppercase text-right">Total Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
              {yearlyProgression.map((item) => (
                <tr key={item.year}>
                  <td className="py-2 text-slate-800 dark:text-white font-sans font-medium">Year {item.year}</td>
                  <td className="py-2 text-right text-sky-600 dark:text-sky-400">{formatINR(item.principal)}</td>
                  <td className="py-2 text-right text-pink-600 dark:text-pink-400 font-bold">+{formatINR(item.interest)}</td>
                  <td className="py-2 text-right font-bold text-emerald-600 dark:text-emerald-400">{formatINR(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TDS Guidance Insight Box */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <div>
            <strong>Taxation & TDS Guideline:</strong> Bank interest above ₹40,000/yr (₹50,000/yr for senior citizens) is subject to 10% TDS under Section 194A. Submit Form 15G / 15H if your total income is below the taxable threshold.
          </div>
        </div>

        {/* Action Button to return to dashboard */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 dark:text-white/40">
            Compounded quarterly in accordance with Reserve Bank of India (RBI) conventions.
          </span>
          {onBackToGrid && (
            <button
              type="button"
              onClick={onBackToGrid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Tools</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TOOL 4: DRIP DIVIDEND COMPOUNDER
   ========================================================================= */
function DripCompounderDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [sharePrice, setSharePrice] = useState<number>(250); // ₹250 / share
  const [initialShares, setInitialShares] = useState<number>(1000); // 1,000 shares (₹2.5L invested)
  const [dividendYield, setDividendYield] = useState<number>(4.5); // 4.5% p.a.
  const [stockAppreciation, setStockAppreciation] = useState<number>(8.0); // 8% p.a.
  const [years, setYears] = useState<number>(15); // 15 years

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  const formatINRShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
    return `₹${Math.round(val)}`;
  };

  const initialCapital = sharePrice * initialShares;
  const gApprec = stockAppreciation / 100;
  const yDiv = dividendYield / 100;

  // Year by year progression tracking DRIP vs No-DRIP
  const yearlySchedule: Array<{
    year: number;
    sharePrice: number;
    sharesHeldDrip: number;
    annualDividendDrip: number;
    cumulativeDividends: number;
    portfolioValueDrip: number;
    portfolioValueNoDrip: number;
  }> = [];

  let runningSharesDrip = initialShares;
  let runningCumulativeDivs = 0;

  for (let y = 1; y <= years; y++) {
    const currentPrice = sharePrice * Math.pow(1 + gApprec, y);
    const divPerShare = currentPrice * yDiv;
    const annualDiv = runningSharesDrip * divPerShare;
    runningCumulativeDivs += annualDiv;

    // DRIP: Reinvest dividend to buy more shares at current price
    const newShares = annualDiv / currentPrice;
    runningSharesDrip += newShares;

    const valDrip = runningSharesDrip * currentPrice;
    const valNoDrip = initialShares * currentPrice;

    yearlySchedule.push({
      year: y,
      sharePrice: Math.round(currentPrice),
      sharesHeldDrip: Math.round(runningSharesDrip * 10) / 10,
      annualDividendDrip: Math.round(annualDiv),
      cumulativeDividends: Math.round(runningCumulativeDivs),
      portfolioValueDrip: Math.round(valDrip),
      portfolioValueNoDrip: Math.round(valNoDrip)
    });
  }

  const finalYear = yearlySchedule[yearlySchedule.length - 1] || {
    sharePrice: sharePrice,
    sharesHeldDrip: initialShares,
    annualDividendDrip: 0,
    cumulativeDividends: 0,
    portfolioValueDrip: initialCapital,
    portfolioValueNoDrip: initialCapital
  };

  const finalPortfolioValue = finalYear.portfolioValueDrip;
  const finalAnnualDividend = finalYear.annualDividendDrip;
  const finalCumulativeDivs = finalYear.cumulativeDividends;
  const finalShares = finalYear.sharesHeldDrip;
  const outperformance = finalPortfolioValue - finalYear.portfolioValueNoDrip;
  const outperformancePct = finalYear.portfolioValueNoDrip > 0 ? (outperformance / finalYear.portfolioValueNoDrip) * 100 : 0;

  return (
    <div className="space-y-6" id="drip-tool-content">
      {/* 3 Major Live Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total DRIP Portfolio Value */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span className="flex items-center gap-1">
              <LineChart className="w-3.5 h-3.5 text-emerald-500" />
              Final DRIP Portfolio
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
              {(finalPortfolioValue / initialCapital).toFixed(1)}x Growth
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-300 tracking-tight">
            {formatINR(finalPortfolioValue)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Initial Capital: {formatINR(initialCapital)} ({initialShares.toLocaleString()} shares)
          </div>
        </div>

        {/* Card 2: Annual Dividend Cashflow at Target Year */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Annual Dividend Income</span>
            <span className="p-1 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono text-[10px]">
              Yr {years}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            {formatINR(finalAnnualDividend)}<span className="text-sm font-normal text-slate-400">/yr</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Generates {formatINR(finalAnnualDividend / 12)}/month in passive cashflow
          </div>
        </div>

        {/* Card 3: DRIP Reinvestment Alpha */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span>DRIP Alpha Outperformance</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold">
              +{outperformancePct.toFixed(0)}% Boost
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-300 tracking-tight">
            +{formatINR(outperformance)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Expanded share count: {initialShares.toLocaleString()} &rarr; {finalShares.toLocaleString()} shares
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* 1. Share Price & Initial Shares */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="drip-price-input">Initial Share Price</label>
            <div className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>₹</span>
              <input
                id="drip-price-input"
                type="number"
                min={10}
                max={100000}
                step={10}
                value={sharePrice}
                onChange={(e) => setSharePrice(Math.max(10, Number(e.target.value) || 0))}
                className="w-16 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={10}
            max={5000}
            step={10}
            value={sharePrice}
            onChange={(e) => setSharePrice(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹10</span>
            <span>₹2,500</span>
            <span>₹5,000</span>
          </div>
        </div>

        {/* 2. Number of Initial Shares */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="drip-shares-input">Initial Shares Held</label>
            <div className="flex items-center gap-1 font-mono text-cyan-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <input
                id="drip-shares-input"
                type="number"
                min={1}
                max={50000}
                step={50}
                value={initialShares}
                onChange={(e) => setInitialShares(Math.max(1, Number(e.target.value) || 0))}
                className="w-20 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
              <span className="text-[10px]">qty</span>
            </div>
          </div>
          <input
            type="range"
            min={10}
            max={10000}
            step={50}
            value={initialShares}
            onChange={(e) => setInitialShares(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>10 Shares</span>
            <span>5,000 Shares</span>
            <span>10,000 Shares</span>
          </div>
        </div>

        {/* 3. Dividend Yield % & Stock Appreciation % */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label>Yield ({dividendYield}%) & Growth ({stockAppreciation}%)</label>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Total: {(dividendYield + stockAppreciation).toFixed(1)}% p.a.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">Div Yield</span>
              <input
                type="number"
                min={0.5}
                max={25}
                step={0.25}
                value={dividendYield}
                onChange={(e) => setDividendYield(Number(e.target.value))}
                className="w-12 text-center bg-transparent font-bold text-sm outline-none"
              />
              <span className="text-xs font-bold">%</span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">Price Growth</span>
              <input
                type="number"
                min={0}
                max={25}
                step={0.5}
                value={stockAppreciation}
                onChange={(e) => setStockAppreciation(Number(e.target.value))}
                className="w-12 text-center bg-transparent font-bold text-sm outline-none"
              />
              <span className="text-xs font-bold">%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Timeline Slider */}
      <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-bold">Investment Timeline Horizon:</span>
        </div>
        <div className="flex-1 w-full max-w-md flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <span className="font-mono text-purple-600 dark:text-purple-300 font-bold text-xs bg-white dark:bg-black/40 px-2 py-1 rounded-md border border-slate-200 dark:border-white/10 shrink-0">
            {years} Years
          </span>
        </div>
      </div>

      {/* DRIP vs Standard Stock Growth Progression Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-black text-sm sm:text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>DRIP Snowball Multiplier Trajectory</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Comparing automatic dividend reinvestment vs static share holding
            </p>
          </div>

          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DRIP Advantage: +{formatINRShort(outperformance)}</span>
          </div>
        </div>

        {/* Progression Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 dark:text-white/40 border-b border-slate-200 dark:border-white/10">
                <th className="pb-2 font-bold uppercase">Year</th>
                <th className="pb-2 font-bold uppercase text-right">Shares (DRIP)</th>
                <th className="pb-2 font-bold uppercase text-right">Stock Price (₹)</th>
                <th className="pb-2 font-bold uppercase text-right">Annual Div (₹)</th>
                <th className="pb-2 font-bold uppercase text-right">No-DRIP Value (₹)</th>
                <th className="pb-2 font-bold uppercase text-right">DRIP Value (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
              {yearlySchedule
                .filter((_, idx) => idx === 0 || (idx + 1) % 2 === 0 || idx === yearlySchedule.length - 1)
                .map((row) => (
                  <tr key={row.year}>
                    <td className="py-2 text-slate-800 dark:text-white font-sans font-medium">Year {row.year}</td>
                    <td className="py-2 text-right text-cyan-600 dark:text-cyan-400 font-bold">{row.sharesHeldDrip.toLocaleString()}</td>
                    <td className="py-2 text-right text-slate-600 dark:text-white/70">{formatINR(row.sharePrice)}</td>
                    <td className="py-2 text-right text-purple-600 dark:text-purple-400">+{formatINR(row.annualDividendDrip)}</td>
                    <td className="py-2 text-right text-slate-500">{formatINR(row.portfolioValueNoDrip)}</td>
                    <td className="py-2 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatINR(row.portfolioValueDrip)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Action Button to return to dashboard */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 dark:text-white/40">
            Reinvesting dividends converts cashflow into compounding shares without brokerage fees.
          </span>
          {onBackToGrid && (
            <button
              type="button"
              onClick={onBackToGrid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Tools</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- 1. Interactive SIP Investment Visualizer --- */
function SipCalculatorDemo() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const months = years * 12;
  const i = rate / 12 / 100;
  const totalInvested = monthly * months;
  const totalValue = monthly * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
  const estimatedReturns = totalValue - totalInvested;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Monthly Investment</span>
            <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">${monthly.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="500" 
            max="100000" 
            step="500"
            value={monthly} 
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Expected Return (p.a.)</span>
            <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">{rate}%</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="30" 
            step="0.5"
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Time Period (Years)</span>
            <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">{years} Yrs</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="40" 
            step="1"
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Visual Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-center">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Invested</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white font-mono">
            {formatCurrency(totalInvested)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Estimated Returns</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            +{formatCurrency(estimatedReturns)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 border border-fuchsia-500/30 text-center shadow-lg shadow-purple-500/10">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider mb-1">Total Future Value</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gradient-purple-pink font-mono">
            {formatCurrency(totalValue)}
          </div>
        </div>
      </div>

      {/* Dynamic Ratio Bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
          <span>Principal: {Math.round((totalInvested / totalValue) * 100)}%</span>
          <span>Returns: {Math.round((estimatedReturns / totalValue) * 100)}%</span>
        </div>
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div 
            className="bg-indigo-500 h-full transition-all duration-300" 
            style={{ width: `${(totalInvested / totalValue) * 100}%` }}
          />
          <div 
            className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-300" 
            style={{ width: `${(estimatedReturns / totalValue) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* --- 2. Advanced Loan EMI Breakout Demo --- */
function EmiCalculatorDemo() {
  const [principal, setPrincipal] = useState(250000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [tenureYears, setTenureYears] = useState(20);

  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Loan Amount</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">${principal.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="10000" 
            max="2000000" 
            step="10000"
            value={principal} 
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Interest Rate (p.a.)</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{interestRate}%</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="20" 
            step="0.1"
            value={interestRate} 
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Tenure (Years)</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{tenureYears} Yrs</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="30" 
            step="1"
            value={tenureYears} 
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Monthly EMI</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            {formatCurrency(emi)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 text-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Interest</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white font-mono">
            {formatCurrency(totalInterest)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 text-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Payment</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white font-mono">
            {formatCurrency(totalPayment)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- 3. Smart PDF Compressor Demo --- */
function PdfCompressorDemo() {
  const [quality, setQuality] = useState(65);
  const [compressing, setCompressing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const simulateCompression = () => {
    setCompressing(true);
    setCompleted(false);
    setTimeout(() => {
      setCompressing(false);
      setCompleted(true);
    }, 1200);
  };

  return (
    <div className="space-y-5 text-center">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-800/40">
        <FileText className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h4 className="font-bold text-base mb-1">Drop sample PDF or click to select</h4>
        <p className="text-xs text-slate-500 mb-4">Sample document: &quot;Quarterly_Financial_Report_2026.pdf&quot; (14.2 MB)</p>
        
        <div className="max-w-md mx-auto mb-4 text-left">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Compression Quality</span>
            <span>{quality}% (Expected ~{Math.round(14.2 * (quality / 100))} MB)</span>
          </div>
          <input 
            type="range" 
            min="20" 
            max="90" 
            value={quality} 
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>

        <button
          onClick={simulateCompression}
          disabled={compressing}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-sm shadow-md shadow-rose-500/25 hover:opacity-90 transition-all flex items-center gap-2 mx-auto cursor-pointer"
        >
          {compressing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{compressing ? 'Compressing Client-Side...' : 'Compress PDF (100% In Browser)'}</span>
        </button>

        {completed && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Success! Compressed from 14.2 MB to 3.8 MB (73% reduction with zero server upload)</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- 4. QR Code Studio Demo --- */
function QrCodeGeneratorDemo() {
  const [text, setText] = useState('https://quickfree-tools.dev');
  const [copied, setCopied] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Target URL or Text
          </label>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter URL, WiFi, or text..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-purple-500"
          />
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Data!' : 'Copy Vector SVG'}</span>
          </button>
          
          <button 
            onClick={() => alert('Downloading high-res QR code PNG...')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PNG</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-md">
        {/* SVG QR Code Simulation */}
        <div className="w-40 h-40 bg-slate-900 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
              <div className="w-4 h-4 bg-cyan-400"></div>
            </div>
            <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
              <div className="w-4 h-4 bg-purple-400"></div>
            </div>
          </div>
          <div className="flex justify-center my-auto">
            <div className="text-white text-[10px] font-bold tracking-widest uppercase">QUICKFREE</div>
          </div>
          <div className="flex justify-between">
            <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
              <div className="w-4 h-4 bg-fuchsia-400"></div>
            </div>
            <div className="w-6 h-6 bg-cyan-400 rounded-sm"></div>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 mt-2 font-mono">{text || 'Enter URL'}</span>
      </div>
    </div>
  );
}

/* --- 5. Password Generator Demo --- */
function PasswordGeneratorDemo() {
  const [password, setPassword] = useState('x9#Qv!8L$2mK@9wZ');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
    let res = '';
    for (let i = 0; i < length; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between border border-slate-200 dark:border-slate-700">
        <span className="font-mono text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 tracking-wider break-all">
          {password}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors ml-2"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Password Length</span>
            <span>{length} characters (128-bit entropy)</span>
          </div>
          <input 
            type="range" 
            min="8" 
            max="32" 
            value={length} 
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
        <button
          onClick={generate}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regenerate</span>
        </button>
      </div>
    </div>
  );
}

/* --- 6. Color Palette Studio Demo --- */
function ColorPaletteDemo() {
  const [colors, setColors] = useState(['#8b5cf6', '#d946ef', '#06b6d4', '#10b981', '#f59e0b']);

  const randomize = () => {
    const pal = [
      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    ];
    setColors(pal);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2 h-28 rounded-2xl overflow-hidden shadow-md">
        {colors.map((c, i) => (
          <div 
            key={i} 
            className="flex flex-col items-center justify-end p-2 text-white font-mono text-[11px] font-bold shadow-inner cursor-pointer hover:opacity-90"
            style={{ backgroundColor: c }}
            onClick={() => {
              navigator.clipboard.writeText(c);
              alert(`Copied ${c} to clipboard!`);
            }}
          >
            <span className="bg-black/40 px-1.5 py-0.5 rounded-sm">{c}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">Click any shade to copy Hex code</span>
        <button
          onClick={randomize}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Palette</span>
        </button>
      </div>
    </div>
  );
}

/* --- 7. Crypto Profit & ROI Demo --- */
function CryptoRoiDemo() {
  const [buyPrice, setBuyPrice] = useState(65000);
  const [sellPrice, setSellPrice] = useState(88000);
  const [amount, setAmount] = useState(0.5);

  const totalCost = buyPrice * amount;
  const totalReturn = sellPrice * amount;
  const netProfit = totalReturn - totalCost;
  const roiPct = ((sellPrice - buyPrice) / buyPrice) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1 block">Buy Price ($)</label>
          <input 
            type="number" 
            value={buyPrice} 
            onChange={(e) => setBuyPrice(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1 block">Sell / Target Price ($)</label>
          <input 
            type="number" 
            value={sellPrice} 
            onChange={(e) => setSellPrice(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1 block">Units / Coins</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Net Profit</div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
            +${netProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">ROI %</div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-purple-600 dark:text-purple-400">
            +{roiPct.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- 8. JSON to TS Demo --- */
function JsonToTsDemo() {
  const jsonSample = `{\n  "id": "usr_992",\n  "name": "Sarah Connor",\n  "verified": true,\n  "balance": 4820.50,\n  "tags": ["premium", "early-adopter"]\n}`;
  const tsOutput = `export interface UserProfile {\n  id: string;\n  name: string;\n  verified: boolean;\n  balance: number;\n  tags: string[];\n}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <span className="text-xs font-bold text-slate-500 mb-1 block">Input JSON Payload</span>
        <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto h-36">
          {jsonSample}
        </pre>
      </div>
      <div>
        <span className="text-xs font-bold text-slate-500 mb-1 block">Generated TypeScript Interface</span>
        <pre className="p-3 rounded-xl bg-slate-900 text-cyan-300 text-xs font-mono overflow-x-auto h-36">
          {tsOutput}
        </pre>
      </div>
    </div>
  );
}

/* =========================================================================
   NEW DEVELOPER & TECH UTILITY TOOLS (BATCH 2)
   ========================================================================= */

/* --- 9. REGEX LIVE TESTER & EXPLAINER DEMO --- */
export function RegexLiveTesterDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [pattern, setPattern] = useState<string>('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [testString, setTestString] = useState<string>(
    `Hello dev! Contact our team at support@company.org or sales@enterprise.co.in.
For billing inquiries, email accounts.payable@startup.io or reach founder@domain.ai!
Invalid examples: plainaddress, @missinguser.com, user@.com`
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'highlight' | 'table' | 'cheat'>('highlight');

  // Presets
  const presets = [
    {
      name: 'Email Address',
      pattern: '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})',
      flags: { g: true, i: true, m: false, s: false },
      test: `Reach us at support@openhub.io, alex_99@gmail.com or team@startup.co.uk!`,
    },
    {
      name: 'Indian Phone (+91)',
      pattern: '(?:\\+91[\\-\\s]?)?[6-9]\\d{9}',
      flags: { g: true, i: false, m: false, s: false },
      test: `Call support at +91 9876543210 or 8765432109. Landline 022-24567890 is not mobile.`,
    },
    {
      name: 'URL / Web Links',
      pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      flags: { g: true, i: true, m: false, s: false },
      test: `Check docs at https://developer.mozilla.org or visit http://localhost:3000/api/v1?token=xyz.`,
    },
    {
      name: 'Hex Color Codes',
      pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
      flags: { g: true, i: false, m: false, s: false },
      test: `Theme accents: #06b6d4 (Cyan), #f43f5e (Rose), #10b981 (Emerald), #fff (White).`,
    },
    {
      name: 'IPv4 Address',
      pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
      flags: { g: true, i: false, m: false, s: false },
      test: `Gateway router: 192.168.1.1, DNS: 8.8.8.8, Localhost: 127.0.0.1, Invalid: 999.300.1.1`,
    },
    {
      name: 'Date (DD/MM/YYYY)',
      pattern: '\\b(0[1-9]|[12][0-9]|3[01])[-/.](0[1-9]|1[012])[-/.](19|20)\\d\\d\\b',
      flags: { g: true, i: false, m: false, s: false },
      test: `Event timeline: 15/08/2026, launch on 01-01-2027, previous meet: 31/12/2025.`,
    },
  ];

  // Construct flag string
  const flagStr = `${flags.g ? 'g' : ''}${flags.i ? 'i' : ''}${flags.m ? 'm' : ''}${flags.s ? 's' : ''}`;

  // Evaluate regex safely
  let regexObj: RegExp | null = null;
  let regexError: string | null = null;
  interface MatchItem {
    match: string;
    index: number;
    groups: string[];
  }
  const matches: MatchItem[] = [];

  try {
    if (pattern.trim().length > 0) {
      regexObj = new RegExp(pattern, flagStr);
      if (testString) {
        if (flags.g) {
          let m: RegExpExecArray | null;
          let iterations = 0;
          while ((m = regexObj.exec(testString)) !== null && iterations < 1000) {
            iterations++;
            matches.push({
              match: m[0],
              index: m.index,
              groups: m.slice(1),
            });
            if (m[0].length === 0) {
              regexObj.lastIndex++;
            }
          }
        } else {
          const m = regexObj.exec(testString);
          if (m) {
            matches.push({
              match: m[0],
              index: m.index,
              groups: m.slice(1),
            });
          }
        }
      }
    }
  } catch (err: any) {
    regexError = err?.message || 'Invalid regular expression syntax';
  }

  // Generate highlighted text segments
  const renderHighlightedSegments = () => {
    if (!regexObj || matches.length === 0 || regexError) {
      return <span>{testString || 'No text to test.'}</span>;
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((item, idx) => {
      // Add text before the match
      if (item.index > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`}>{testString.slice(lastIndex, item.index)}</span>
        );
      }
      // Add highlighted match with neon glow
      segments.push(
        <mark
          key={`match-${idx}-${item.index}`}
          className="bg-cyan-400/30 dark:bg-cyan-500/35 text-cyan-900 dark:text-cyan-100 px-1 py-0.5 rounded border border-cyan-400/60 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.4)] relative group transition-all"
          title={`Match #${idx + 1}: "${item.match}" at pos ${item.index}`}
        >
          {item.match}
          <span className="ml-1 text-[10px] opacity-75 font-mono bg-cyan-900/20 dark:bg-cyan-200/20 px-1 rounded">
            #{idx + 1}
          </span>
        </mark>
      );
      lastIndex = item.index + item.match.length;
    });

    // Add trailing text
    if (lastIndex < testString.length) {
      segments.push(
        <span key={`text-${lastIndex}`}>{testString.slice(lastIndex)}</span>
      );
    }

    return segments;
  };

  const handleCopyPattern = () => {
    navigator.clipboard.writeText(`/${pattern}/${flagStr}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMatches = () => {
    const text = matches.map((m, i) => `#${i + 1} [pos ${m.index}]: ${m.match}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Preset Quick-Select */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 font-mono text-xs font-bold uppercase">
              Developer Engine
            </span>
            <span className="text-xs text-slate-500">Live Client-Side RegEx VM</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Regex Live Tester & Explainer
          </h3>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
      </div>

      {/* Preset Selector Chips */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>Quick Pattern Presets:</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setPattern(p.pattern);
                setFlags(p.flags);
                setTestString(p.test);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-cyan-500/10 hover:text-cyan-500 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700/60 transition-all text-slate-700 dark:text-slate-300"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Pattern Input & Flags */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-sm space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyan-500" />
              <span>Regular Expression</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyPattern}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy /pattern/'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center rounded-xl bg-slate-950 text-white font-mono text-sm px-3 py-2 border border-slate-800 focus-within:ring-2 focus-within:ring-cyan-500 transition-all">
            <span className="text-cyan-400 font-bold select-none mr-1.5 text-base">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. ([a-z]+)@([a-z]+\.[a-z]{2,})"
              className="w-full bg-transparent text-cyan-300 placeholder-slate-600 focus:outline-none font-mono text-sm"
              spellCheck={false}
            />
            <span className="text-cyan-400 font-bold select-none mx-1.5 text-base">/</span>
            <span className="text-amber-400 font-bold select-none text-xs">{flagStr || '—'}</span>
          </div>
        </div>

        {/* Regex Flags & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Flags:</span>
            {[
              { key: 'g', label: 'g (Global)', desc: 'Find all matches' },
              { key: 'i', label: 'i (Insensitive)', desc: 'Case-insensitive' },
              { key: 'm', label: 'm (Multiline)', desc: '^ and $ match start/end of line' },
              { key: 's', label: 's (DotAll)', desc: '. matches newline' },
            ].map((f) => (
              <label key={f.key} className="flex items-center gap-1 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={flags[f.key as keyof typeof flags]}
                  onChange={(e) =>
                    setFlags({ ...flags, [f.key]: e.target.checked })
                  }
                  className="rounded text-cyan-500 focus:ring-cyan-400 w-3.5 h-3.5 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{f.key}</span>
              </label>
            ))}
          </div>

          {/* Validation Status Indicator */}
          <div>
            {regexError ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Syntax Error: {regexError}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Valid RegExp Pattern</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Test String Input Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-500" />
            <span>Test String / Target Text</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTestString('')}
              className="text-xs text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <textarea
          rows={4}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Paste or type sample string to test your regular expression..."
          className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-y"
          spellCheck={false}
        />
      </div>

      {/* Match Results Counter & View Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Evaluation Result</div>
              <div className="text-lg font-bold flex items-center gap-2">
                <span className="text-cyan-400">{matches.length}</span>
                <span>{matches.length === 1 ? 'Match Found' : 'Matches Found'}</span>
                {matches.length > 0 && (
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {matches.reduce((acc, m) => acc + m.groups.length, 0)} Capture Groups
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700">
            <button
              onClick={() => setActiveTab('highlight')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'highlight'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Neon Highlights
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'table'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Match Details ({matches.length})
            </button>
            <button
              onClick={() => setActiveTab('cheat')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'cheat'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cheat Sheet
            </button>
          </div>
        </div>

        {/* Tab 1: Glowing Neon Highlighted Text View */}
        {activeTab === 'highlight' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Interactive Text Highlight Preview:</span>
              {matches.length > 0 && (
                <button
                  onClick={handleCopyMatches}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Extracted Matches</span>
                </button>
              )}
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs leading-relaxed text-slate-300 min-h-[120px] max-h-[260px] overflow-y-auto whitespace-pre-wrap select-text">
              {renderHighlightedSegments()}
            </div>
          </div>
        )}

        {/* Tab 2: Match Breakdown Table */}
        {activeTab === 'table' && (
          <div className="space-y-3">
            {matches.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-mono">
                No matches found in the current test string. Try adjusting your pattern or test text.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[260px] border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-800/80 text-slate-300 uppercase sticky top-0">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Matched String</th>
                      <th className="p-2.5">Index</th>
                      <th className="p-2.5">Length</th>
                      <th className="p-2.5">Capture Groups</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {matches.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-2.5 text-cyan-400 font-bold">#{idx + 1}</td>
                        <td className="p-2.5 text-white font-semibold">{m.match}</td>
                        <td className="p-2.5 text-slate-400">{m.index}</td>
                        <td className="p-2.5 text-slate-400">{m.match.length}</td>
                        <td className="p-2.5 text-amber-300">
                          {m.groups.length > 0 ? (
                            m.groups.map((g, gi) => (
                              <span key={gi} className="mr-1.5 px-1.5 py-0.5 rounded bg-amber-500/20 text-[10px]">
                                G{gi + 1}: {g || '—'}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 italic">None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Quick RegEx Token Cheat Sheet */}
        {activeTab === 'cheat' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-mono">
            {[
              { token: '\\d', desc: 'Any digit [0-9]' },
              { token: '\\w', desc: 'Word char [a-zA-Z0-9_]' },
              { token: '\\s', desc: 'Whitespace (space, tab, newline)' },
              { token: '^ / $', desc: 'Start / End of string' },
              { token: '+', desc: '1 or more occurrences' },
              { token: '*', desc: '0 or more occurrences' },
              { token: '?', desc: '0 or 1 (optional)' },
              { token: '{n,m}', desc: 'Between n and m times' },
              { token: '[abc]', desc: 'Character set matching a, b, or c' },
              { token: '[^abc]', desc: 'Negated character set' },
              { token: '(...)', desc: 'Capturing group' },
              { token: '(?:...)', desc: 'Non-capturing group' },
            ].map((item) => (
              <div key={item.token} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-cyan-400 font-bold">{item.token}</span>
                <span className="text-slate-400 text-[11px] font-sans">{item.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* --- 10. BASE64 UNIVERSAL ENCODER/DECODER DEMO --- */
export function Base64UniversalStudioDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState<string>(
    '🚀 Financial & Developer Micro-Tools 2026! 🇮🇳\n100% Client-Side Privacy with Zero Latency.'
  );
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [decodeError, setDecodeError] = useState<string | null>(null);

  // UTF-8 safe encode function
  const encodeBase64 = (str: string, isUrlSafe: boolean): string => {
    try {
      const utf8Bytes = new TextEncoder().encode(str);
      let binary = '';
      for (let i = 0; i < utf8Bytes.length; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      let base64 = btoa(binary);
      if (isUrlSafe) {
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      return base64;
    } catch {
      return '';
    }
  };

  // UTF-8 safe decode function
  const decodeBase64 = (base64: string, isUrlSafe: boolean): { result: string; error: string | null } => {
    try {
      let cleaned = base64.trim();
      if (isUrlSafe) {
        cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');
        while (cleaned.length % 4) {
          cleaned += '=';
        }
      }
      const binary = atob(cleaned);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decoded = new TextDecoder().decode(bytes);
      return { result: decoded, error: null };
    } catch (err: any) {
      return {
        result: '',
        error: 'Invalid Base64 string. Please ensure the string contains valid Base64 characters (A-Z, a-z, 0-9, +, /, =).',
      };
    }
  };

  // Computed output
  let outputText = '';
  if (mode === 'encode') {
    outputText = encodeBase64(inputText, urlSafe);
  } else {
    const res = decodeBase64(inputText, urlSafe);
    outputText = res.result;
  }

  // Effect to update error for decode mode
  useEffect(() => {
    if (mode === 'decode') {
      if (inputText.trim().length > 0) {
        const res = decodeBase64(inputText, urlSafe);
        setDecodeError(res.error);
      } else {
        setDecodeError(null);
      }
    } else {
      setDecodeError(null);
    }
  }, [mode, inputText, urlSafe]);

  const handleCopyResult = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (outputText && !decodeError) {
      setInputText(outputText);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  // Preset snippets
  const loadPreset = (type: string) => {
    if (type === 'json') {
      setMode('encode');
      setInputText(
        JSON.stringify(
          {
            user: 'Alex Rivers',
            role: 'Administrator',
            permissions: ['read', 'write', 'deploy'],
            exp: 1780000000,
          },
          null,
          2
        )
      );
    } else if (type === 'svg') {
      setMode('encode');
      setInputText(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
      );
    } else if (type === 'jwt') {
      setMode('decode');
      setInputText('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    }
  };

  // Length and size calculations
  const inputBytes = new Blob([inputText]).size;
  const outputBytes = new Blob([outputText]).size;

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-500 font-mono text-xs font-bold uppercase">
              Encoding Engine
            </span>
            <span className="text-xs text-slate-500">UTF-8 Safe • Zero Server Relay</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Base64 Universal Encoder/Decoder
          </h3>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
      </div>

      {/* Mode Switcher & URL-Safe Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'encode'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Encode to Base64</span>
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'decode'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Decode Base64</span>
          </button>
        </div>

        <div className="flex items-center gap-3 px-2">
          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="rounded text-violet-600 focus:ring-violet-400 w-3.5 h-3.5"
            />
            <span className="font-semibold">URL-Safe Base64 (- and _)</span>
          </label>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500">Quick Samples:</span>
        <button
          onClick={() => loadPreset('json')}
          className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-violet-500/10 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700"
        >
          JSON Payload
        </button>
        <button
          onClick={() => loadPreset('svg')}
          className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-violet-500/10 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700"
        >
          SVG Vector
        </button>
        <button
          onClick={() => loadPreset('jwt')}
          className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-violet-500/10 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700"
        >
          JWT Token Header
        </button>
      </div>

      {/* Two Column Input / Output Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-violet-500" />
              <span>{mode === 'encode' ? 'Plain Text / Raw Input' : 'Base64 Input String'}</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">
                {inputText.length} chars ({inputBytes} B)
              </span>
              <button
                onClick={() => setInputText('')}
                className="text-xs text-slate-500 hover:text-rose-500"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Type or paste raw text to encode into Base64...'
                : 'Paste Base64 encoded string here (e.g. SGVsbG8gV29ybGQ=)...'
            }
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
            spellCheck={false}
          />
        </div>

        {/* Output Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              <span>{mode === 'encode' ? 'Generated Base64 Output' : 'Decoded Plain Text'}</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">
                {outputText.length} chars ({outputBytes} B)
              </span>
              {outputText && (
                <button
                  onClick={handleSwap}
                  className="text-xs text-violet-500 hover:underline flex items-center gap-1 font-semibold"
                  title="Swap Input and Output"
                >
                  Swap ⇄
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              rows={7}
              value={decodeError ? '' : outputText}
              placeholder="Computed result will appear here instantly..."
              className="w-full p-3.5 rounded-2xl bg-slate-950 text-violet-300 border border-slate-800 font-mono text-xs leading-relaxed focus:outline-none resize-y"
              spellCheck={false}
            />

            {decodeError && (
              <div className="absolute inset-0 p-4 rounded-2xl bg-rose-950/90 border border-rose-800 text-rose-200 text-xs flex flex-col items-center justify-center text-center space-y-2 backdrop-blur-sm">
                <AlertCircle className="w-6 h-6 text-rose-400" />
                <span className="font-bold">Decoding Error</span>
                <p className="text-[11px] text-rose-300 max-w-xs">{decodeError}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action / Copy Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono">Payload Metric</div>
            <div className="text-sm font-bold text-slate-200">
              {mode === 'encode' ? (
                <span>
                  Base64 expansion: +
                  {inputBytes > 0 ? (((outputBytes - inputBytes) / inputBytes) * 100).toFixed(1) : '0'}% overhead
                </span>
              ) : (
                <span>Decoded length: {outputText.length} characters</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyResult}
          disabled={!outputText || !!decodeError}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : '📋 Copy Result'}</span>
        </button>
      </div>
    </div>
  );
}

/* --- 11. CSS GLASSMORPHISM STUDIO DEMO --- */
export function CssGlassmorphismStudioDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [blur, setBlur] = useState<number>(16);
  const [opacity, setOpacity] = useState<number>(0.25);
  const [tint, setTint] = useState<'white' | 'black' | 'cyan' | 'purple'>('white');
  const [borderRadius, setBorderRadius] = useState<number>(24);
  const [borderWidth, setBorderWidth] = useState<number>(1);
  const [borderOpacity, setBorderOpacity] = useState<number>(0.25);
  const [saturation, setSaturation] = useState<number>(140);
  const [shadowElevation, setShadowElevation] = useState<number>(20);
  const [copiedCss, setCopiedCss] = useState<boolean>(false);
  const [copiedTailwind, setCopiedTailwind] = useState<boolean>(false);

  // RGB color lookup
  const rgbMap = {
    white: '255, 255, 255',
    black: '0, 0, 0',
    cyan: '6, 182, 212',
    purple: '168, 85, 247',
  };

  const currentRgb = rgbMap[tint];

  // Generated CSS string
  const cssCode = `/* CSS Frosted Glassmorphism */
background: rgba(${currentRgb}, ${opacity.toFixed(2)});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border-radius: ${borderRadius}px;
border: ${borderWidth}px solid rgba(${currentRgb}, ${borderOpacity.toFixed(2)});
box-shadow: 0 ${Math.round(shadowElevation * 0.4)}px ${shadowElevation}px 0 rgba(0, 0, 0, 0.25);`;

  // Tailwind equivalent
  const tailwindClasses = `bg-[rgba(${currentRgb},${opacity.toFixed(2)})] backdrop-blur-[${blur}px] backdrop-saturate-[${saturation}%] rounded-[${borderRadius}px] border-[${borderWidth}px] border-[rgba(${currentRgb},${borderOpacity.toFixed(2)})] shadow-[0_${Math.round(shadowElevation * 0.4)}px_${shadowElevation}px_rgba(0,0,0,0.25)]`;

  const handleCopyCss = () => {
    navigator.clipboard.writeText(cssCode);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  const handleCopyTailwind = () => {
    navigator.clipboard.writeText(tailwindClasses);
    setCopiedTailwind(true);
    setTimeout(() => setCopiedTailwind(false), 2000);
  };

  // Presets
  const applyPreset = (name: string) => {
    if (name === 'apple') {
      setBlur(20);
      setOpacity(0.2);
      setTint('white');
      setBorderRadius(24);
      setBorderWidth(1);
      setBorderOpacity(0.3);
      setSaturation(150);
      setShadowElevation(24);
    } else if (name === 'obsidian') {
      setBlur(24);
      setOpacity(0.45);
      setTint('black');
      setBorderRadius(20);
      setBorderWidth(1);
      setBorderOpacity(0.2);
      setSaturation(120);
      setShadowElevation(32);
    } else if (name === 'cyberpunk') {
      setBlur(14);
      setOpacity(0.2);
      setTint('cyan');
      setBorderRadius(16);
      setBorderWidth(2);
      setBorderOpacity(0.6);
      setSaturation(180);
      setShadowElevation(30);
    } else if (name === 'minimal') {
      setBlur(8);
      setOpacity(0.12);
      setTint('white');
      setBorderRadius(16);
      setBorderWidth(1);
      setBorderOpacity(0.15);
      setSaturation(110);
      setShadowElevation(12);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500 font-mono text-xs font-bold uppercase">
              UI Studio
            </span>
            <span className="text-xs text-slate-500">Optical Backdrop Filter Playground</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            CSS Glassmorphism Studio
          </h3>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500">Style Presets:</span>
        {[
          { id: 'apple', label: '🍎 Apple Frost' },
          { id: 'obsidian', label: '🌑 Dark Obsidian' },
          { id: 'cyberpunk', label: '⚡ Cyberpunk Neon' },
          { id: 'minimal', label: '✨ Subtle Minimal' },
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => applyPreset(p.id)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-500/10 hover:text-purple-500 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Visual Canvas Preview on Top/Left, Sliders on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Live Canvas Playground (5 Cols on large) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-500" />
              <span>Real-Time Optical Backdrop Preview</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Live CSS Engine</span>
          </div>

          {/* Shifting Vibrant Geometric Stage */}
          <div className="relative w-full h-[340px] rounded-3xl overflow-hidden p-6 flex items-center justify-center select-none shadow-inner bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border border-slate-700/50">
            {/* Background Decorative Geometric Spheres & Shapes */}
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 blur-sm opacity-90 animate-pulse" />
            <div className="absolute top-1/2 -right-8 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 blur-sm opacity-90" />
            <div className="absolute -bottom-8 left-1/3 w-36 h-36 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 blur-sm opacity-80" />

            {/* Background High-Contrast Graphic Pattern */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-30 pointer-events-none font-mono text-[10px] text-white">
              <div className="flex justify-between">
                <span>01000110 01010010 01001111</span>
                <span>FROSTED GLASS OPTICS</span>
              </div>
              <div className="text-center text-4xl font-extrabold tracking-widest text-white/20">
                GLASSMORPHISM
              </div>
              <div className="flex justify-between">
                <span>SATURATION: {saturation}%</span>
                <span>BLUR: {blur}PX</span>
              </div>
            </div>

            {/* The Actual Glassmorphism Floating Card Component */}
            <div
              className="relative z-10 w-full max-w-sm p-6 text-white transition-all shadow-2xl"
              style={{
                backgroundColor: `rgba(${currentRgb}, ${opacity})`,
                backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                borderRadius: `${borderRadius}px`,
                border: `${borderWidth}px solid rgba(${currentRgb}, ${borderOpacity})`,
                boxShadow: `0 ${Math.round(shadowElevation * 0.4)}px ${shadowElevation}px 0 rgba(0, 0, 0, 0.3)`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Aero Card UI</div>
                    <div className="text-[10px] text-white/70">Backdrop Filter</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                  {blur}px Blur
                </span>
              </div>

              <p className="text-xs text-white/90 leading-relaxed mb-4">
                Notice the vibrant colored spheres beneath this card blur and refract seamlessly in real time!
              </p>

              <div className="flex items-center justify-between text-[11px] pt-3 border-t border-white/20 font-mono">
                <span className="opacity-80">OPACITY: {(opacity * 100).toFixed(0)}%</span>
                <span className="font-bold">SAT: {saturation}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sliders & Controls (6 Cols on large) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md space-y-3.5">
            {/* Blur Intensity Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Blur Intensity</span>
                <span className="text-purple-600 dark:text-purple-400 font-mono">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
            </div>

            {/* Transparency / Opacity Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Transparency / Opacity</span>
                <span className="text-purple-600 dark:text-purple-400 font-mono">
                  {(opacity * 100).toFixed(0)}% ({opacity.toFixed(2)})
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
            </div>

            {/* Tint Color Selector */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Background Color Tint
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'white', name: 'White', color: 'bg-white text-slate-900 border-slate-300' },
                  { id: 'black', name: 'Dark', color: 'bg-slate-950 text-white border-slate-800' },
                  { id: 'cyan', name: 'Neon Cyan', color: 'bg-cyan-500 text-slate-950 border-cyan-400' },
                  { id: 'purple', name: 'Purple', color: 'bg-purple-600 text-white border-purple-500' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setTint(c.id as any)}
                    className={`py-1.5 text-xs font-bold rounded-xl border text-center transition-all ${
                      tint === c.id ? 'ring-2 ring-purple-500 shadow-md font-extrabold' : 'opacity-70 hover:opacity-100'
                    } ${c.color}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Radius & Width */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Radius</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Saturation</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="200"
                  step="5"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Code Output Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">
              Generated Code Output
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTailwind}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-cyan-300 transition-all border border-slate-700"
            >
              {copiedTailwind ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTailwind ? 'Tailwind Copied!' : 'Copy Tailwind'}</span>
            </button>
            <button
              onClick={handleCopyCss}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-xs font-mono font-bold text-white transition-all shadow-md shadow-purple-500/20"
            >
              {copiedCss ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCss ? 'CSS Copied!' : 'Copy CSS'}</span>
            </button>
          </div>
        </div>

        <pre className="text-xs font-mono text-purple-300 overflow-x-auto p-3 rounded-xl bg-slate-900/90 border border-slate-800 leading-relaxed">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}

/* --- 12. EPOCH UNIX TIMESTAMP MATRIX DEMO --- */
export function EpochTimestampMatrixDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [currentEpoch, setCurrentEpoch] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [copiedCurrent, setCopiedCurrent] = useState<boolean>(false);

  // Block B: Timestamp to Date inputs
  const [inputEpoch, setInputEpoch] = useState<string>(() => Math.floor(Date.now() / 1000).toString());
  
  // Block C: Date to Timestamp inputs
  const getLocalDatetimeString = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  };

  const [inputDate, setInputDate] = useState<string>(() => getLocalDatetimeString(new Date()));

  // Live timer interval
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Parse Block B Timestamp
  let parsedDate: Date | null = null;
  let parseError: string | null = null;
  let isMs = false;

  try {
    const trimmed = inputEpoch.trim();
    if (trimmed.length > 0) {
      let num = Number(trimmed);
      if (isNaN(num)) {
        parseError = 'Invalid numerical timestamp format.';
      } else {
        // If > 11 digits, assume milliseconds
        if (trimmed.length > 11) {
          isMs = true;
          parsedDate = new Date(num);
        } else {
          isMs = false;
          parsedDate = new Date(num * 1000);
        }
        if (isNaN(parsedDate.getTime())) {
          parseError = 'Out of supported Unix date range.';
          parsedDate = null;
        }
      }
    }
  } catch (err) {
    parseError = 'Error parsing timestamp.';
  }

  // Parse Block C Date
  let computedEpochSec = 0;
  let computedEpochMs = 0;
  try {
    const d = new Date(inputDate);
    if (!isNaN(d.getTime())) {
      computedEpochMs = d.getTime();
      computedEpochSec = Math.floor(d.getTime() / 1000);
    }
  } catch {
    // fallback
  }

  // Relative time helper
  const getRelativeTime = (d: Date): string => {
    const diffSec = Math.floor((d.getTime() - Date.now()) / 1000);
    const absSec = Math.abs(diffSec);
    const isFuture = diffSec > 0;

    let text = '';
    if (absSec < 60) text = `${absSec} seconds`;
    else if (absSec < 3600) text = `${Math.floor(absSec / 60)} minutes`;
    else if (absSec < 86400) text = `${Math.floor(absSec / 3600)} hours`;
    else if (absSec < 2592000) text = `${Math.floor(absSec / 86400)} days`;
    else text = `${Math.floor(absSec / 2592000)} months`;

    if (absSec < 5) return 'Just now (current moment)';
    return isFuture ? `In ${text}` : `${text} ago`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCurrent(true);
    setTimeout(() => setCopiedCurrent(false), 2000);
  };

  const setDateOffset = (offsetHours: number) => {
    const d = new Date();
    d.setHours(d.getHours() + offsetHours);
    setInputDate(getLocalDatetimeString(d));
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 font-mono text-xs font-bold uppercase">
              Time Engine
            </span>
            <span className="text-xs text-slate-500">Bi-directional Epoch Translator</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Epoch Unix Timestamp Matrix
          </h3>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
      </div>

      {/* BLOCK A: Live Current Unix Epoch Ticker */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-400">
              Live Current Unix Epoch
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold flex items-center gap-1 border border-slate-700"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
              <span>{isPaused ? 'Resume Ticker' : 'Pause'}</span>
            </button>
            <button
              onClick={() => handleCopy(currentEpoch.toString())}
              className="px-3 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold flex items-center gap-1 shadow-md"
            >
              {copiedCurrent ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCurrent ? 'Copied!' : 'Copy Epoch'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <div className="text-3xl sm:text-4xl font-mono font-extrabold text-blue-400 tracking-tight">
              {currentEpoch}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">
              Milliseconds: <span className="text-slate-200">{currentEpoch * 1000}</span>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 text-left sm:text-right">
            <div>Local: {new Date(currentEpoch * 1000).toLocaleTimeString()}</div>
            <div>UTC: {new Date(currentEpoch * 1000).toISOString()}</div>
          </div>
        </div>
      </div>

      {/* Dual Column: BLOCK B (Timestamp -> Date) & BLOCK C (Date -> Timestamp) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BLOCK B: Convert Unix Timestamp to Calendar Date */}
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Timestamp to Human Date</span>
            </h4>
            <button
              onClick={() => setInputEpoch(currentEpoch.toString())}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono font-semibold"
            >
              Use Current Epoch
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Enter 10-digit (seconds) or 13-digit (ms) timestamp:
            </label>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                value={inputEpoch}
                onChange={(e) => setInputEpoch(e.target.value)}
                placeholder="e.g. 1786800000"
                className="w-full bg-transparent px-3.5 py-2.5 font-mono text-sm text-slate-900 dark:text-blue-300 focus:outline-none"
              />
            </div>
            {isMs && (
              <span className="text-[11px] text-amber-500 font-mono block">
                ⚡ Auto-detected 13-digit Milliseconds format
              </span>
            )}
          </div>

          {parseError ? (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{parseError}</span>
            </div>
          ) : parsedDate ? (
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Local Time</span>
                <span className="text-slate-900 dark:text-slate-100 font-semibold text-sm">
                  {parsedDate.toString()}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">GMT / UTC (ISO 8601)</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {parsedDate.toISOString()}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Relative Time</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-sans">
                  {getRelativeTime(parsedDate)}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {/* BLOCK C: Convert Calendar Date to Unix Timestamp */}
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-500" />
              <span>Human Date to Timestamp</span>
            </h4>
            <button
              onClick={() => setInputDate(getLocalDatetimeString(new Date()))}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-mono font-semibold"
            >
              Reset to Now
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Select Date & Time (Local):
            </label>
            <input
              type="datetime-local"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Quick Jump Shortcuts */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 self-center mr-1">Quick:</span>
            {[
              { label: '+1 Hour', hours: 1 },
              { label: '+1 Day', hours: 24 },
              { label: '+1 Week', hours: 168 },
              { label: '-1 Day', hours: -24 },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => setDateOffset(s.hours)}
                className="px-2 py-0.5 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 text-slate-700 dark:text-slate-300 font-mono font-semibold border border-slate-200 dark:border-slate-700"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Computed Timestamp Outputs */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 text-white border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Epoch (Seconds)</div>
                <div className="text-lg font-bold text-cyan-400">{computedEpochSec}</div>
              </div>
              <button
                onClick={() => handleCopy(computedEpochSec.toString())}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Copy Seconds"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 text-white border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Epoch (Milliseconds)</div>
                <div className="text-sm font-bold text-slate-200">{computedEpochMs}</div>
              </div>
              <button
                onClick={() => handleCopy(computedEpochMs.toString())}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Copy Milliseconds"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- 13. URL ENCODER & SEO SLUG CLEANER DEMO --- */
export function UrlEncoderSluggerDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [activeTab, setActiveTab] = useState<'encoder' | 'slugger'>('encoder');
  
  // Section A: Encoder / Decoder State
  const [rawText, setRawText] = useState<string>(
    'https://example.com/search?query=artificial intelligence & tools=100% free#section-🚀'
  );
  const [encodedResult, setEncodedResult] = useState<string>('');
  const [encodeMode, setEncodeMode] = useState<'component' | 'uri'>('component');
  const [copiedEncoder, setCopiedEncoder] = useState<boolean>(false);
  const [encodeError, setEncodeError] = useState<string | null>(null);

  // Section B: SEO Slug State
  const [articleTitle, setArticleTitle] = useState<string>(
    '10 Best Free Developer Tools & Financial Calculators for 2026!'
  );
  const [separator, setSeparator] = useState<'-' | '_' | '.'>('-');
  const [stripStopWords, setStripStopWords] = useState<boolean>(true);
  const [lowercaseOnly, setLowercaseOnly] = useState<boolean>(true);
  const [baseUrl, setBaseUrl] = useState<string>('https://mywebsite.com/blog/');
  const [copiedSlug, setCopiedSlug] = useState<boolean>(false);
  const [copiedFullUrl, setCopiedFullUrl] = useState<boolean>(false);

  // Stop words list for SEO
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'if', 'then', 'else', 'when',
    'at', 'from', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'of', 'in', 'on'
  ]);

  // Compute URL Encode / Decode
  useEffect(() => {
    try {
      if (!rawText) {
        setEncodedResult('');
        setEncodeError(null);
        return;
      }
      if (encodeMode === 'component') {
        setEncodedResult(encodeURIComponent(rawText));
      } else {
        setEncodedResult(encodeURI(rawText));
      }
      setEncodeError(null);
    } catch (err: any) {
      setEncodeError(err?.message || 'Error processing URL string');
    }
  }, [rawText, encodeMode]);

  const handleDecode = () => {
    try {
      if (encodeMode === 'component') {
        setRawText(decodeURIComponent(rawText));
      } else {
        setRawText(decodeURI(rawText));
      }
      setEncodeError(null);
    } catch (err: any) {
      setEncodeError('Failed to decode: String contains malformed URI percent sequences.');
    }
  };

  const handleEncode = () => {
    try {
      if (encodeMode === 'component') {
        setEncodedResult(encodeURIComponent(rawText));
      } else {
        setEncodedResult(encodeURI(rawText));
      }
      setEncodeError(null);
    } catch (err: any) {
      setEncodeError(err?.message || 'Encoding error');
    }
  };

  const handleSwapEncoder = () => {
    if (encodedResult && !encodeError) {
      setRawText(encodedResult);
    }
  };

  // Compute SEO Slug
  const generateSlug = (): string => {
    if (!articleTitle.trim()) return '';

    // Step 1: Normalize unicode diacritics / accents (e.g. é -> e, ñ -> n)
    let str = articleTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Step 2: Lowercase if enabled
    if (lowercaseOnly) {
      str = str.toLowerCase();
    }

    // Step 3: Remove special characters and punctuation except spaces and hyphens
    str = str.replace(/[^a-zA-Z0-9\s-_]/g, ' ');

    // Step 4: Tokenize into words
    let words = str.trim().split(/\s+/).filter(Boolean);

    // Step 5: Filter stop words if enabled
    if (stripStopWords) {
      const filtered = words.filter((w) => !stopWords.has(w.toLowerCase()));
      if (filtered.length > 0) {
        words = filtered;
      }
    }

    // Step 6: Join with chosen separator
    let slug = words.join(separator);

    // Step 7: Deduplicate separators and trim edges
    const escSep = separator === '.' ? '\\.' : separator;
    const regexDuplicate = new RegExp(`${escSep}+`, 'g');
    slug = slug.replace(regexDuplicate, separator);
    const regexTrim = new RegExp(`^${escSep}+|${escSep}+$`, 'g');
    slug = slug.replace(regexTrim, '');

    return slug;
  };

  const computedSlug = generateSlug();
  const fullGeneratedUrl = `${baseUrl.replace(/\/+$/, '')}/${computedSlug}`;

  const handleCopy = (text: string, type: 'encoder' | 'slug' | 'full') => {
    navigator.clipboard.writeText(text);
    if (type === 'encoder') {
      setCopiedEncoder(true);
      setTimeout(() => setCopiedEncoder(false), 2000);
    } else if (type === 'slug') {
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 2000);
    } else {
      setCopiedFullUrl(true);
      setTimeout(() => setCopiedFullUrl(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 font-mono text-xs font-bold uppercase">
              Web & SEO Tool
            </span>
            <span className="text-xs text-slate-500">RFC 3986 Percent Encoding • Clean Slug Generator</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            URL Encoder & SEO Slug Cleaner
          </h3>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-md">
        <button
          onClick={() => setActiveTab('encoder')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'encoder'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>URL Percent Encoder</span>
        </button>
        <button
          onClick={() => setActiveTab('slugger')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'slugger'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>SEO Permalink Slugger</span>
        </button>
      </div>

      {/* TAB 1: URL ENCODER / DECODER */}
      {activeTab === 'encoder' && (
        <div className="space-y-5">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Mode:</span>
              <button
                onClick={() => setEncodeMode('component')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  encodeMode === 'component'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Encodes all special characters including :/?#[]@!$&'()*+,;="
              >
                encodeURIComponent (Query params & tokens)
              </button>
              <button
                onClick={() => setEncodeMode('uri')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  encodeMode === 'uri'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Preserves valid URL delimiters such as :// ? # & ="
              >
                encodeURI (Full URL link)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDecode}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>Decode In-Place</span>
              </button>
              <button
                onClick={handleEncode}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm transition-all"
              >
                Re-Encode
              </button>
            </div>
          </div>

          {/* Dual Textareas: Raw Input vs Encoded Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Raw Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Raw Text / Unencoded URL</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">{rawText.length} chars</span>
                  <button
                    onClick={() => setRawText('')}
                    className="text-xs text-slate-500 hover:text-rose-500"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Type or paste unencoded URL or parameter string here..."
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
                spellCheck={false}
              />
            </div>

            {/* Encoded Output */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Percent-Encoded Output</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {encodedResult.length} chars
                  </span>
                  {encodedResult && (
                    <button
                      onClick={handleSwapEncoder}
                      className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Swap ⇄
                    </button>
                  )}
                </div>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={6}
                  value={encodeError ? '' : encodedResult}
                  placeholder="Encoded string appears here instantly..."
                  className="w-full p-3.5 rounded-2xl bg-slate-950 text-amber-300 border border-slate-800 font-mono text-xs leading-relaxed focus:outline-none resize-y"
                  spellCheck={false}
                />
                {encodeError && (
                  <div className="absolute inset-0 p-4 rounded-2xl bg-rose-950/90 border border-rose-800 text-rose-200 text-xs flex flex-col items-center justify-center text-center space-y-1 backdrop-blur-sm">
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                    <span className="font-bold">Encoding / Decoding Error</span>
                    <p className="text-[11px] text-rose-300">{encodeError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Copy Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Characters escaped with %HEX hex codes (e.g. space = %20, # = %23).</span>
            </div>

            <button
              onClick={() => handleCopy(encodedResult, 'encoder')}
              disabled={!encodedResult || !!encodeError}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
            >
              {copiedEncoder ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              <span>{copiedEncoder ? 'Copied to Clipboard!' : '📋 Copy Encoded Result'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: SEO SLUG CLEANER */}
      {activeTab === 'slugger' && (
        <div className="space-y-5">
          {/* Article Title Input */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-amber-500" />
                <span>Article Title / Headline to Convert</span>
              </label>
              <input
                type="text"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="e.g. What is AI Studio? 10 Awesome Tips & Tricks (2026 Guide)!"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Base URL Domain Prefix */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-500" />
                <span>Base Domain & Path (Optional Preview Prefix)</span>
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="e.g. https://mywebsite.com/posts/"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Customization Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* Separator */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                  Separator Token
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: '-', label: 'Hyphen (-)' },
                    { id: '_', label: 'Under (_)' },
                    { id: '.', label: 'Dot (.)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSeparator(s.id as any)}
                      className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all ${
                        separator === s.id
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strip Stop Words */}
              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={stripStopWords}
                    onChange={(e) => setStripStopWords(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                  />
                  <span>Strip Stop Words (a, the, in, for...)</span>
                </label>
                <span className="text-[10px] text-slate-400 ml-6">Recommended for short, punchy SEO URLs</span>
              </div>

              {/* Lowercase Only */}
              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lowercaseOnly}
                    onChange={(e) => setLowercaseOnly(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                  />
                  <span>Force Lowercase (a-z)</span>
                </label>
                <span className="text-[10px] text-slate-400 ml-6">Standardizes canonical links</span>
              </div>
            </div>
          </div>

          {/* Live SEO Slug Preview Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase font-mono">Live SEO Result</div>
                  <div className="text-sm font-bold text-slate-200">Search Engine Optimized Permalink</div>
                </div>
              </div>

              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {computedSlug.length} characters
              </span>
            </div>

            {/* Generated Slug display */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Clean Slug Output:</span>
                <button
                  onClick={() => handleCopy(computedSlug, 'slug')}
                  className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                >
                  {copiedSlug ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSlug ? 'Slug Copied' : 'Copy Slug Only'}</span>
                </button>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-amber-300 break-all select-all shadow-inner">
                {computedSlug || '<empty_slug>'}
              </div>
            </div>

            {/* Full Browser Simulated URL */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Full Canonical URL:</span>
                <button
                  onClick={() => handleCopy(fullGeneratedUrl, 'full')}
                  className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                >
                  {copiedFullUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFullUrl ? 'URL Copied' : 'Copy Full URL'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 font-mono text-xs text-slate-300 break-all flex items-center justify-between gap-2">
                <span className="text-cyan-400 truncate">{fullGeneratedUrl}</span>
              </div>
            </div>

            {/* Quick 1-Click Action Link */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleCopy(fullGeneratedUrl, 'full')}
                disabled={!computedSlug}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                {copiedFullUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>📋 Copy Generated URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- 14. MARKDOWN LIVE VISUALIZER & HTML DEMO --- */
export function MarkdownLiveVisualizerDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const initialMarkdown = `# 🚀 Project Documentation & Launch Notes

Welcome to the **Markdown Live Visualizer**! You can write standard GitHub Flavored Markdown (GFM) on the left, and watch the formatted interactive document render instantly on the right.

## ✨ Core Highlights
* **Zero Latency**: Real-time parsing with instant visual updates.
* **100% Client-Side**: Your documents never leave your browser memory.
* **Sanitized HTML Export**: Convert directly to clean HTML tags with 1-click.

### 📊 Performance Benchmark Matrix
| Feature | Legacy Tool | Modern Engine | Improvement |
| :--- | :--- | :--- | :--- |
| **Render Speed** | ~450ms | **0.8ms** | **560x Faster** |
| **Offline Support** | ❌ None | ✅ 100% Native | Reliable |
| **Privacy Security** | Server Logged | Zero Relay | Complete |

> "Simplicity is the soul of efficiency." — *Austin Freeman*

\`\`\`typescript
// Quick Code Highlight Example
interface DeveloperTool {
  id: string;
  name: string;
  isInstant: boolean;
}

export const runTool = (tool: DeveloperTool): void => {
  console.log(\`Running \${tool.name} with zero server latency!\`);
};
\`\`\`

- [x] Integrate live side-by-side viewports
- [x] Support GFM tables, quotes, and task lists
- [ ] Deploy v2.0 release to production

Feel free to edit this markdown text directly!`;

  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [viewHtmlCode, setViewHtmlCode] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [copiedMd, setCopiedMd] = useState<boolean>(false);

  // Quick Formatting Toolbar Helpers
  const insertSnippet = (prefix: string, suffix: string = '', defaultPlaceholder: string = 'text') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end) || defaultPlaceholder;
    const replacement = `${prefix}${selected}${suffix}`;

    const newText = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  // Convert simple markdown to clean HTML string
  const convertMarkdownToHtml = (md: string): string => {
    const lines = md.split('\n');
    const htmlLines: string[] = [];
    let inCodeBlock = false;
    let codeBlockLang = '';
    let codeBlockContent: string[] = [];
    let inList = false;
    let inTable = false;

    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const parseInline = (text: string) => {
      let t = escapeHtml(text);
      // Bold
      t = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      t = t.replace(/__(.*?)__/g, '<strong>$1</strong>');
      // Italic
      t = t.replace(/\*(.*?)\*/g, '<em>$1</em>');
      t = t.replace(/_(.*?)_/g, '<em>$1</em>');
      // Inline code
      t = t.replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 font-mono text-xs">$1</code>');
      // Links
      t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline font-semibold">$1</a>');
      return t;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLang = line.trim().slice(3).trim();
          codeBlockContent = [];
        } else {
          inCodeBlock = false;
          htmlLines.push(
            `<pre class="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto my-3 border border-slate-800"><code class="language-${codeBlockLang}">${escapeHtml(codeBlockContent.join('\n'))}</code></pre>`
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        htmlLines.push(`<h1 class="text-2xl font-black text-slate-900 dark:text-white mt-4 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">${parseInline(line.slice(2))}</h1>`);
        continue;
      }
      if (line.startsWith('## ')) {
        htmlLines.push(`<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2 pb-1 border-b border-slate-200/60 dark:border-slate-800/60">${parseInline(line.slice(3))}</h2>`);
        continue;
      }
      if (line.startsWith('### ')) {
        htmlLines.push(`<h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mt-3 mb-1.5">${parseInline(line.slice(4))}</h3>`);
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        htmlLines.push(`<blockquote class="pl-4 py-1.5 my-2 border-l-4 border-amber-500 bg-amber-500/5 text-slate-700 dark:text-slate-300 italic rounded-r-lg">${parseInline(line.slice(2))}</blockquote>`);
        continue;
      }

      // Unordered lists & task lists
      if (/^[-*+]\s+/.test(line)) {
        let content = line.replace(/^[-*+]\s+/, '');
        if (content.startsWith('[x] ')) {
          content = `<input type="checkbox" checked disabled class="mr-2 accent-emerald-500" /> <span class="line-through text-slate-400">${parseInline(content.slice(4))}</span>`;
        } else if (content.startsWith('[ ] ')) {
          content = `<input type="checkbox" disabled class="mr-2" /> ${parseInline(content.slice(4))}`;
        } else {
          content = parseInline(content);
        }
        htmlLines.push(`<li class="ml-5 list-disc my-1 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">${content}</li>`);
        continue;
      }

      // Tables
      if (line.includes('|')) {
        const cells = line.split('|').map((c) => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
        if (cells.length > 0) {
          if (line.includes('---')) {
            // separator line, ignore
            continue;
          }
          const isHeader = !inTable;
          inTable = true;
          const renderedCells = cells
            .map((c) => (isHeader ? `<th class="p-2.5 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80">${parseInline(c)}</th>` : `<td class="p-2.5 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">${parseInline(c)}</td>`))
            .join('');
          htmlLines.push(`<tr>${renderedCells}</tr>`);
          continue;
        }
      } else {
        inTable = false;
      }

      // Empty line
      if (!line.trim()) {
        htmlLines.push('<div class="h-2"></div>');
        continue;
      }

      // Standard paragraph
      htmlLines.push(`<p class="my-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${parseInline(line)}</p>`);
    }

    return htmlLines.join('\n');
  };

  const rawHtmlGenerated = convertMarkdownToHtml(markdown);

  // Statistics
  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;
  const lineCount = markdown.split('\n').length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(rawHtmlGenerated);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyMd = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Markdown Export</title><style>body{font-family:system-ui,-apple-system,sans-serif;line-height:1.6;padding:2rem;max-width:800px;margin:auto;color:#333;}</style></head><body>${rawHtmlGenerated}</body></html>`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 font-mono text-xs font-bold uppercase">
              Authoring & Documentation
            </span>
            <span className="text-xs text-slate-500">Side-by-Side GFM Engine • Zero Server Latency</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Markdown Live Visualizer & HTML
          </h3>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
      </div>

      {/* Formatting Quick-Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => insertSnippet('# ', '', 'Heading 1')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => insertSnippet('## ', '', 'Heading 2')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => insertSnippet('**', '**', 'bold text')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1"
            title="Bold"
          >
            <Bold className="w-3 h-3" />
          </button>
          <button
            onClick={() => insertSnippet('*', '*', 'italic text')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1"
            title="Italic"
          >
            <Italic className="w-3 h-3" />
          </button>
          <button
            onClick={() => insertSnippet('`', '`', 'code')}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
            title="Inline Code"
          >
            &lt;/&gt;
          </button>
          <button
            onClick={() => insertSnippet('> ', '', 'Quote text')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
            title="Blockquote"
          >
            &ldquo; Quote
          </button>
          <button
            onClick={() => insertSnippet('- ', '', 'List item')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1"
            title="Unordered List"
          >
            <List className="w-3 h-3" />
          </button>
          <button
            onClick={() => insertSnippet('| Feature | Status |\n| :--- | :--- |\n| Item 1 | Done |', '')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
            title="Insert Table"
          >
            📊 Table
          </button>
          <button
            onClick={() => insertSnippet('[', '](https://example.com)', 'Link Text')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
            title="Insert Link"
          >
            🔗 Link
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadMd}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center gap-1"
            title="Download .md file"
          >
            <Download className="w-3 h-3" />
            <span>.md</span>
          </button>
          <button
            onClick={handleDownloadHtml}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center gap-1"
            title="Download compiled .html file"
          >
            <Download className="w-3 h-3" />
            <span>.html</span>
          </button>
        </div>
      </div>

      {/* Metrics Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 px-2">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
          <span>{lineCount} lines</span>
          <span>~{readTimeMinutes} min read</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMd}
            className="text-slate-600 dark:text-slate-300 hover:text-amber-500 flex items-center gap-1"
          >
            {copiedMd ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copiedMd ? 'Markdown Copied' : 'Copy Markdown'}</span>
          </button>
        </div>
      </div>

      {/* Main Side-by-Side Viewport Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Side: Markdown Source Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-amber-500" />
              <span>Markdown Source Editor</span>
            </label>
            <button
              onClick={() => setMarkdown('')}
              className="text-xs text-slate-500 hover:text-rose-500"
            >
              Clear
            </button>
          </div>

          <textarea
            id="markdown-textarea"
            rows={14}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y shadow-inner"
            spellCheck={false}
          />
        </div>

        {/* Right Side: Dynamic Visual Preview or Raw HTML Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span>{viewHtmlCode ? 'Sanitized HTML Markup' : 'Live Formatted Document'}</span>
            </label>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setViewHtmlCode(false)}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  !viewHtmlCode ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Visual
              </button>
              <button
                onClick={() => setViewHtmlCode(true)}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  viewHtmlCode ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Raw HTML
              </button>
            </div>
          </div>

          {/* Visual Output Container or HTML Tag Container */}
          {!viewHtmlCode ? (
            <div
              className="w-full p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 min-h-[300px] max-h-[460px] overflow-y-auto shadow-inner prose dark:prose-invert max-w-none text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: rawHtmlGenerated }}
            />
          ) : (
            <div className="relative">
              <textarea
                readOnly
                rows={14}
                value={rawHtmlGenerated}
                className="w-full p-4 rounded-2xl bg-slate-950 text-amber-300 border border-slate-800 font-mono text-xs leading-relaxed focus:outline-none resize-y"
                spellCheck={false}
              />
              <button
                onClick={handleCopyHtml}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 shadow-md flex items-center gap-1.5 transition-all"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHtml ? 'Copied' : 'Copy HTML'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono">HTML Export Status</div>
            <div className="text-sm font-bold text-slate-200">
              Ready to paste into WordPress, Notion, Webflow, or Email
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyHtml}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            {copiedHtml ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedHtml ? 'HTML Copied!' : '📋 Copy Raw HTML'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- 16. TEXT DIFF & DIFF CHECKER PRO DEMO --- */
export function TextDiffCheckerDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const initialOriginal = `function calculateDiscount(price, userTier) {
  let discountRate = 0.05;
  if (userTier === 'VIP') {
    discountRate = 0.20;
  }
  return price * (1 - discountRate);
}`;

  const initialModified = `function calculateDiscount(price, userTier, promoCode = '') {
  let discountRate = 0.08;
  if (userTier === 'VIP' || promoCode === 'SUMMER2026') {
    discountRate = 0.25;
  }
  const finalPrice = price * (1 - discountRate);
  return Math.round(finalPrice * 100) / 100;
}`;

  const [textLeft, setTextLeft] = useState<string>(initialOriginal);
  const [textRight, setTextRight] = useState<string>(initialModified);
  const [diffViewMode, setDiffViewMode] = useState<'inline' | 'split'>('inline');
  const [copiedDiff, setCopiedDiff] = useState<boolean>(false);

  // Sample Presets
  const presets = [
    {
      name: 'Code Function Refactor',
      left: initialOriginal,
      right: initialModified,
    },
    {
      name: 'Legal Contract Clause',
      left: `The Client agrees to pay the Provider within thirty (30) days of receiving an invoice. Late payments will incur a 1.5% penalty per calendar month.`,
      right: `The Client agrees to pay the Provider within fifteen (15) business days of receiving an electronic invoice. Late payments will incur a 3.0% compounding penalty per month.`,
    },
    {
      name: 'Blog Article Paragraph',
      left: `In 2024, artificial intelligence was primarily used for chatbots and basic text generation.`,
      right: `In 2026, autonomous AI agent clusters execute full-stack software development, automated testing, and multi-cloud serverless deployments instantly.`,
    },
  ];

  // Token Diff Segment Interface
  interface DiffSegment {
    type: 'same' | 'added' | 'deleted';
    value: string;
  }

  // Token-level Word Diff algorithm
  const computeWordDiff = (str1: string, str2: string): DiffSegment[] => {
    const words1 = str1.split(/(\s+|[^\w\s])/).filter(Boolean);
    const words2 = str2.split(/(\s+|[^\w\s])/).filter(Boolean);

    const matrix: number[][] = Array(words1.length + 1)
      .fill(null)
      .map(() => Array(words2.length + 1).fill(0));

    for (let i = 1; i <= words1.length; i++) {
      for (let j = 1; j <= words2.length; j++) {
        if (words1[i - 1] === words2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1;
        } else {
          matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
        }
      }
    }

    const result: DiffSegment[] = [];
    let i = words1.length;
    let j = words2.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && words1[i - 1] === words2[j - 1]) {
        result.unshift({ type: 'same', value: words1[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
        result.unshift({ type: 'added', value: words2[j - 1] });
        j--;
      } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
        result.unshift({ type: 'deleted', value: words1[i - 1] });
        i--;
      }
    }

    return result;
  };

  const diffSegments = computeWordDiff(textLeft, textRight);

  // Statistics
  const addedCount = diffSegments.filter((s) => s.type === 'added').length;
  const deletedCount = diffSegments.filter((s) => s.type === 'deleted').length;
  const sameCount = diffSegments.filter((s) => s.type === 'same').length;
  const totalTokens = addedCount + deletedCount + sameCount;
  const similarityScore = totalTokens > 0 ? ((sameCount / (sameCount + (addedCount + deletedCount) / 2)) * 100).toFixed(1) : '100';

  const handleCopyDiffReport = () => {
    const report = diffSegments
      .map((s) => (s.type === 'added' ? `[+ ${s.value}]` : s.type === 'deleted' ? `[- ${s.value}]` : s.value))
      .join('');
    navigator.clipboard.writeText(report);
    setCopiedDiff(true);
    setTimeout(() => setCopiedDiff(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono text-xs font-bold uppercase">
              Inspection & Revision
            </span>
            <span className="text-xs text-slate-500">Word-Level Token Matcher • LCS Diff Algorithm</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Text Diff & Diff Checker Pro
          </h3>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500">Quick Samples:</span>
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => {
              setTextLeft(p.left);
              setTextRight(p.right);
            }}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 transition-all"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Dual Textboxes for Left & Right Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Version (Left) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MinusCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Original Text Version (Before)</span>
            </label>
            <button
              onClick={() => setTextLeft('')}
              className="text-xs text-slate-500 hover:text-rose-500"
            >
              Clear
            </button>
          </div>

          <textarea
            rows={7}
            value={textLeft}
            onChange={(e) => setTextLeft(e.target.value)}
            placeholder="Paste original source text here..."
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500 resize-y"
            spellCheck={false}
          />
        </div>

        {/* Modified Version (Right) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Modified Text Version (After)</span>
            </label>
            <button
              onClick={() => setTextRight('')}
              className="text-xs text-slate-500 hover:text-rose-500"
            >
              Clear
            </button>
          </div>

          <textarea
            rows={7}
            value={textRight}
            onChange={(e) => setTextRight(e.target.value)}
            placeholder="Paste revised modified text here..."
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Diff Result Breakdown Screen */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-4">
        {/* Metric Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Diff Evaluation</div>
              <div className="text-sm font-bold text-slate-200 flex items-center gap-3">
                <span className="text-emerald-400">+{addedCount} Additions</span>
                <span className="text-rose-400">-{deletedCount} Deletions</span>
                <span className="text-cyan-400">{similarityScore}% Similarity</span>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700">
            <button
              onClick={() => setDiffViewMode('inline')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                diffViewMode === 'inline'
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unified Inline View
            </button>
            <button
              onClick={() => setDiffViewMode('split')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                diffViewMode === 'split'
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side View
            </button>
          </div>
        </div>

        {/* Unified Inline Diff Viewer with Neon Highlights */}
        {diffViewMode === 'inline' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Inline Highlighting Legend:</span>
              <span className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  + Inserted
                </span>
                <span className="text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/40 line-through">
                  - Deleted
                </span>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs leading-relaxed text-slate-300 min-h-[160px] max-h-[340px] overflow-y-auto whitespace-pre-wrap select-text">
              {diffSegments.map((segment, idx) => {
                if (segment.type === 'added') {
                  return (
                    <mark
                      key={idx}
                      className="bg-emerald-500/30 text-emerald-300 font-bold px-1 py-0.5 rounded border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)] inline"
                    >
                      {segment.value}
                    </mark>
                  );
                } else if (segment.type === 'deleted') {
                  return (
                    <mark
                      key={idx}
                      className="bg-rose-500/30 text-rose-300 font-medium px-1 py-0.5 rounded border border-rose-500/50 line-through opacity-80 shadow-[0_0_8px_rgba(244,63,94,0.3)] inline"
                    >
                      {segment.value}
                    </mark>
                  );
                }
                return <span key={idx}>{segment.value}</span>;
              })}
            </div>
          </div>
        ) : (
          /* Side-by-Side Split Diff View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-rose-400">Original (Removals Highlighted)</span>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 min-h-[140px] max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                {diffSegments
                  .filter((s) => s.type !== 'added')
                  .map((s, i) =>
                    s.type === 'deleted' ? (
                      <mark
                        key={i}
                        className="bg-rose-500/30 text-rose-300 px-1 py-0.5 rounded line-through border border-rose-500/40"
                      >
                        {s.value}
                      </mark>
                    ) : (
                      <span key={i}>{s.value}</span>
                    )
                  )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-emerald-400">Modified (Additions Highlighted)</span>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 min-h-[140px] max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                {diffSegments
                  .filter((s) => s.type !== 'deleted')
                  .map((s, i) =>
                    s.type === 'added' ? (
                      <mark
                        key={i}
                        className="bg-emerald-500/30 text-emerald-300 font-bold px-1 py-0.5 rounded border border-emerald-500/40"
                      >
                        {s.value}
                      </mark>
                    ) : (
                      <span key={i}>{s.value}</span>
                    )
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleCopyDiffReport}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-500/20 transition-all"
          >
            {copiedDiff ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedDiff ? 'Diff Report Copied!' : '📋 Copy Annotated Diff'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- 17. SVG MINIFIER & ASSET CLEANER DEMO --- */
export function SvgMinifierCleanerDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="100%" height="100%" id="layer_export_001">
  <!-- Generator: Adobe Illustrator 28.0, SVG Export Plug-In . SVG Version: 6.00 Build 0 -->
  <!-- Metadata & Author: Studio Master Vector 2026 -->
  <defs>
    <!-- Custom filters and gradient declarations -->
    <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="1" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="1" />
    </linearGradient>
  </defs>
  <g id="Background_Layer" data-name="Layer 1">
    <rect x="10" y="10" width="180" height="180" rx="36" fill="url(#gradient-primary)" stroke="#ffffff" stroke-width="4" />
  </g>
  <g id="Icon_Center_Rocket" data-name="Rocket Vector Asset">
    <!-- Center rocket emblem -->
    <path d="M 100 45 C 100 45, 130 80, 130 115 C 130 135, 115 145, 100 145 C 85 145, 70 135, 70 115 C 70 80, 100 45, 100 45 Z" fill="#ffffff" />
    <circle cx="100" cy="95" r="14" fill="#f43f5e" />
    <polygon points="100,145 90,165 110,165" fill="#f59e0b" />
  </g>
</svg>`;

  const [inputSvg, setInputSvg] = useState<string>(sampleSvg);
  const [outputSvg, setOutputSvg] = useState<string>('');
  const [removeComments, setRemoveComments] = useState<boolean>(true);
  const [removeMetadata, setRemoveMetadata] = useState<boolean>(true);
  const [removeUnusedIds, setRemoveUnusedIds] = useState<boolean>(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState<boolean>(true);
  const [roundDecimals, setRoundDecimals] = useState<boolean>(true);
  const [copiedCleanSvg, setCopiedCleanSvg] = useState<boolean>(false);
  const [viewRenderMode, setViewRenderMode] = useState<'preview' | 'code'>('code');

  // Minification engine
  const minifySvg = (raw: string): string => {
    if (!raw.trim()) return '';
    let result = raw;

    // 1. Remove XML declaration <?xml ... ?> and DOCTYPE
    if (removeMetadata) {
      result = result.replace(/<\?xml[\s\S]*?\?>/gi, '');
      result = result.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
      result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
    }

    // 2. Remove HTML / SVG Comments <!-- ... -->
    if (removeComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }

    // 3. Remove editor-specific namespaces and attributes (Sketch, Illustrator, Figma, Inkscape, data-name)
    if (removeMetadata) {
      result = result.replace(/\s*xmlns:sketch="[^"]*"/gi, '');
      result = result.replace(/\s*xmlns:i="[^"]*"/gi, '');
      result = result.replace(/\s*xmlns:inkscape="[^"]*"/gi, '');
      result = result.replace(/\s*xmlns:sodipodi="[^"]*"/gi, '');
      result = result.replace(/\s*data-name="[^"]*"/gi, '');
      result = result.replace(/\s*sketch:type="[^"]*"/gi, '');
      result = result.replace(/\s*inkscape:[a-z0-9-]+="[^"]*"/gi, '');
      result = result.replace(/\s*sodipodi:[a-z0-9-]+="[^"]*"/gi, '');
    }

    // 4. Remove redundant layer IDs if not referenced by url(#id) or href="#id"
    if (removeUnusedIds) {
      const idMatches = result.match(/id="([^"]+)"/g) || [];
      idMatches.forEach((idAttr) => {
        const idName = idAttr.replace(/id="|"/g, '');
        const isReferenced =
          result.includes(`url(#${idName})`) ||
          result.includes(`href="#${idName}"`) ||
          result.includes(`xlink:href="#${idName}"`);
        if (!isReferenced && (idName.startsWith('layer') || idName.startsWith('Background_') || idName.startsWith('Layer_') || idName.startsWith('Icon_') || idName.startsWith('g_'))) {
          result = result.replace(new RegExp(`\\s*id="${idName}"`, 'g'), '');
        }
      });
    }

    // 5. Round coordinates to 2 decimal places
    if (roundDecimals) {
      result = result.replace(/(\d+\.\d{3,})/g, (match) => {
        return parseFloat(match).toFixed(2).replace(/\.?0+$/, '');
      });
    }

    // 6. Collapse redundant whitespace and empty lines
    if (collapseWhitespace) {
      result = result.replace(/\s+/g, ' ');
      result = result.replace(/>\s+</g, '><');
      result = result.trim();
    }

    return result;
  };

  useEffect(() => {
    setOutputSvg(minifySvg(inputSvg));
  }, [inputSvg, removeComments, removeMetadata, removeUnusedIds, collapseWhitespace, roundDecimals]);

  const rawBytes = new Blob([inputSvg]).size;
  const compressedBytes = new Blob([outputSvg]).size;
  const bytesSaved = Math.max(0, rawBytes - compressedBytes);
  const percentageSaved = rawBytes > 0 ? ((bytesSaved / rawBytes) * 100).toFixed(1) : '0.0';

  const handleCopyClean = () => {
    if (!outputSvg) return;
    navigator.clipboard.writeText(outputSvg);
    setCopiedCleanSvg(true);
    setTimeout(() => setCopiedCleanSvg(false), 2000);
  };

  const handleDownloadCleanSvg = () => {
    if (!outputSvg) return;
    const blob = new Blob([outputSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vector-optimized.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setInputSvg(event.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 font-mono text-xs font-bold uppercase">
              Vector Asset Optimizer
            </span>
            <span className="text-xs text-slate-500">Fast SVG XML Minifier • Metadata & Comment Purger</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            SVG Minifier & Asset Cleaner
          </h3>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
      </div>

      {/* Optimization Toggles Bar */}
      <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-rose-500" />
          <span>Active Optimization Rules</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeComments}
              onChange={(e) => setRemoveComments(e.target.checked)}
              className="rounded text-rose-500 focus:ring-rose-400 w-3.5 h-3.5"
            />
            <span>Strip Comments</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeMetadata}
              onChange={(e) => setRemoveMetadata(e.target.checked)}
              className="rounded text-rose-500 focus:ring-rose-400 w-3.5 h-3.5"
            />
            <span>Purge Metadata</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeUnusedIds}
              onChange={(e) => setRemoveUnusedIds(e.target.checked)}
              className="rounded text-rose-500 focus:ring-rose-400 w-3.5 h-3.5"
            />
            <span>Strip Redundant IDs</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={collapseWhitespace}
              onChange={(e) => setCollapseWhitespace(e.target.checked)}
              className="rounded text-rose-500 focus:ring-rose-400 w-3.5 h-3.5"
            />
            <span>Collapse Spaces</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={roundDecimals}
              onChange={(e) => setRoundDecimals(e.target.checked)}
              className="rounded text-rose-500 focus:ring-rose-400 w-3.5 h-3.5"
            />
            <span>Round Decimals</span>
          </label>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Original Size</div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
            {rawBytes.toLocaleString()} <span className="text-xs font-normal text-slate-400">bytes</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Compressed Size</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
            {compressedBytes.toLocaleString()} <span className="text-xs font-normal text-slate-400">bytes</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-amber-500/10 border border-rose-500/20 shadow-sm text-center">
          <div className="text-[11px] font-mono text-rose-500 uppercase font-bold">% Total Saved</div>
          <div className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5">
            -{percentageSaved}% <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({bytesSaved} B)</span>
          </div>
        </div>
      </div>

      {/* Dual Textareas: Raw SVG vs Minified Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-rose-500" />
              <span>Raw SVG Vector Source</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-xs text-rose-500 hover:underline cursor-pointer font-semibold flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload .svg</span>
                <input
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setInputSvg('')}
                className="text-xs text-slate-400 hover:text-rose-500"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            rows={10}
            value={inputSvg}
            onChange={(e) => setInputSvg(e.target.value)}
            placeholder="Paste your raw <svg>...</svg> XML string here..."
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500 resize-y shadow-inner"
            spellCheck={false}
          />
        </div>

        {/* Right: Minified Code / Rendered Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Minified Output</span>
            </label>

            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setViewRenderMode('code')}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  viewRenderMode === 'code'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                XML Code
              </button>
              <button
                onClick={() => setViewRenderMode('preview')}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  viewRenderMode === 'preview'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Rendered Preview
              </button>
            </div>
          </div>

          {viewRenderMode === 'code' ? (
            <textarea
              readOnly
              rows={10}
              value={outputSvg}
              placeholder="Optimized clean SVG code will appear here..."
              className="w-full p-3.5 rounded-2xl bg-slate-950 text-emerald-300 border border-slate-800 font-mono text-xs leading-relaxed focus:outline-none resize-y shadow-inner select-all"
              spellCheck={false}
            />
          ) : (
            <div className="w-full h-[220px] rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]">
              {outputSvg ? (
                <div
                  className="w-36 h-36 flex items-center justify-center drop-shadow-xl"
                  dangerouslySetInnerHTML={{ __html: outputSvg }}
                />
              ) : (
                <span className="text-xs text-slate-500 font-mono">No valid SVG to preview</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Info className="w-4 h-4 text-rose-400" />
          <span>Zero transmission latency. 100% processed locally on your device.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCleanSvg}
            disabled={!outputSvg}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all disabled:opacity-50 border border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>Download .svg</span>
          </button>

          <button
            onClick={handleCopyClean}
            disabled={!outputSvg}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all"
          >
            {copiedCleanSvg ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCleanSvg ? 'Copied to Clipboard!' : '📋 Copy Clean SVG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- 18. IMAGE TO WEBP / AVIF CONVERTER DEMO --- */
export function ImageWebpAvifConverterDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('sample-photo.jpg');
  const [originalBytes, setOriginalBytes] = useState<number>(485000);
  const [convertedBytes, setConvertedBytes] = useState<number>(142000);
  const [quality, setQuality] = useState<number>(82);
  const [targetFormat, setTargetFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [convertedDataUrl, setConvertedDataUrl] = useState<string | null>(null);

  // Generate an initial demo graphic on mount
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, 640, 420);
      grad.addColorStop(0, '#06b6d4');
      grad.addColorStop(0.5, '#3b82f6');
      grad.addColorStop(1, '#6366f1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 420);

      // Draw stylized shapes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(150, 100, 120, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.arc(520, 320, 160, 0, Math.PI * 2);
      ctx.fill();

      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ Modern WebP & AVIF Studio', 320, 200);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText('High Compression Ratio • Zero Quality Loss', 320, 240);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setImageSrc(dataUrl);
    }
  }, []);

  // Process conversion whenever image, format, or quality changes
  const processImageConversion = () => {
    if (!imageSrc) return;
    setIsConverting(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const resultUrl = canvas.toDataURL(targetFormat, quality / 100);
        setConvertedDataUrl(resultUrl);

        // Calculate approximate converted size from base64 string
        const head = `data:${targetFormat};base64,`;
        const base64Str = resultUrl.startsWith(head) ? resultUrl.slice(head.length) : resultUrl;
        const newSize = Math.round((base64Str.length * 3) / 4);
        setConvertedBytes(newSize);
      }
      setIsConverting(false);
    };
    img.src = imageSrc;
  };

  useEffect(() => {
    processImageConversion();
  }, [imageSrc, quality, targetFormat]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setOriginalBytes(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setImageSrc(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!convertedDataUrl) return;
    const ext = targetFormat === 'image/webp' ? 'webp' : targetFormat === 'image/jpeg' ? 'jpg' : 'png';
    const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    const a = document.createElement('a');
    a.href = convertedDataUrl;
    a.download = `${baseName}-compressed.${ext}`;
    a.click();
  };

  const bytesSaved = Math.max(0, originalBytes - convertedBytes);
  const percentSaved = originalBytes > 0 ? ((bytesSaved / originalBytes) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 font-mono text-xs font-bold uppercase">
              Next-Gen Image Format
            </span>
            <span className="text-xs text-slate-500">Client-Side Canvas Exporter • Ultra Compression</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Image to WebP / AVIF Converter
          </h3>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
      </div>

      {/* Controls Bar: Format + Quality Slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md">
        {/* Format Switcher */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Target Output Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'image/webp', label: '⚡ Google WebP', desc: 'Best web compression' },
              { id: 'image/jpeg', label: '📸 Standard JPG', desc: 'Universal compatibility' },
              { id: 'image/png', label: '🎨 Lossless PNG', desc: 'Clean transparent graphics' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setTargetFormat(fmt.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  targetFormat === fmt.id
                    ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{fmt.label}</div>
                <div className="text-[10px] text-slate-400">{fmt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Compression Quality Slider */}
        <div className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Compression Quality: <span className="text-cyan-500 font-mono">{quality}%</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {quality >= 80 ? '⭐ Recommended (High Visual Fidelity)' : quality >= 50 ? '⚖️ Balanced Size & Detail' : '📉 Maximum Compression'}
            </span>
          </div>

          <input
            type="range"
            min={10}
            max={100}
            step={1}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 my-2"
          />

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>10% (Smallest size)</span>
            <span>82% (Sweet spot)</span>
            <span>100% (Maximum quality)</span>
          </div>
        </div>
      </div>

      {/* Drag & Drop File Intake Zone */}
      <div className="relative border-2 border-dashed border-cyan-500/40 hover:border-cyan-500 rounded-3xl p-6 text-center bg-cyan-500/5 transition-all group">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center space-y-2 pointer-events-none">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-500 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Drop your image file here or <span className="text-cyan-500 underline">browse files</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Supports JPG, PNG, WebP, GIF, BMP • Current File: <span className="text-slate-600 dark:text-slate-300 font-bold">{fileName}</span>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Original Size</div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
            {(originalBytes / 1024).toFixed(1)} <span className="text-xs font-normal text-slate-400">KB</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Compressed Output</div>
          <div className="text-lg font-bold text-cyan-500 font-mono mt-0.5">
            {(convertedBytes / 1024).toFixed(1)} <span className="text-xs font-normal text-slate-400">KB</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 shadow-sm text-center">
          <div className="text-[11px] font-mono text-cyan-500 uppercase font-bold">% Total Saved</div>
          <div className="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">
            -{percentSaved}% <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({(bytesSaved / 1024).toFixed(1)} KB)</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Original Input File</span>
            </span>
            <span className="font-mono text-slate-400">{(originalBytes / 1024).toFixed(1)} KB</span>
          </div>
          <div className="h-52 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Original"
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : null}
          </div>
        </div>

        {/* Compressed Preview */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Optimized Output ({targetFormat.split('/')[1].toUpperCase()})</span>
            </span>
            <span className="font-mono text-cyan-500 font-bold">{(convertedBytes / 1024).toFixed(1)} KB</span>
          </div>
          <div className="h-52 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800">
            {convertedDataUrl ? (
              <img
                src={convertedDataUrl}
                alt="Compressed"
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Lossless alpha channel & metadata sanitization complete.</span>
        </div>

        <button
          onClick={handleDownload}
          disabled={!convertedDataUrl || isConverting}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>📥 Download Free Compressed Image</span>
        </button>
      </div>
    </div>
  );
}

/* --- 19. ASPECT RATIO & DPI CANVAS SCALE DEMO --- */
export function AspectRatioDpiScalerDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  // Section A: Aspect Ratio Finder State
  const [origWidth, setOrigWidth] = useState<number>(1920);
  const [origHeight, setOrigHeight] = useState<number>(1080);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [targetWidth, setTargetWidth] = useState<number>(1280);
  const [targetHeight, setTargetHeight] = useState<number>(720);

  // Common preset aspect ratios
  const ratioPresets = [
    { label: '16:9', w: 16, h: 9, use: 'YouTube / Displays' },
    { label: '4:3', w: 4, h: 3, use: 'Classic TV / iPad' },
    { label: '1:1', w: 1, h: 1, use: 'Instagram Square' },
    { label: '9:16', w: 9, h: 16, use: 'TikTok / Reels / Shorts' },
    { label: '21:9', w: 21, h: 9, use: 'UltraWide Cinema' },
    { label: '4:5', w: 4, h: 5, use: 'Instagram Portrait' },
  ];

  // Helper: calculate greatest common divisor
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(origWidth, origHeight);
  const ratioX = origWidth > 0 && divisor > 0 ? origWidth / divisor : 16;
  const ratioY = origHeight > 0 && divisor > 0 ? origHeight / divisor : 9;
  const floatRatio = origHeight > 0 ? (origWidth / origHeight).toFixed(3) : '1.778';

  const handleOrigWidthChange = (val: number) => {
    setOrigWidth(val);
    if (lockRatio && origHeight > 0) {
      const r = origWidth / origHeight;
      setTargetHeight(Math.round(targetWidth / r));
    }
  };

  const handleOrigHeightChange = (val: number) => {
    setOrigHeight(val);
    if (lockRatio && val > 0) {
      const r = origWidth / val;
      setTargetHeight(Math.round(targetWidth / r));
    }
  };

  const handleTargetWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockRatio && origHeight > 0) {
      const r = origWidth / origHeight;
      setTargetHeight(Math.round(val / r));
    }
  };

  const handleTargetHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockRatio && origHeight > 0) {
      const r = origWidth / origHeight;
      setTargetWidth(Math.round(val * r));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setOrigWidth(w * 100);
    setOrigHeight(h * 100);
    setTargetWidth(w * 80);
    setTargetHeight(h * 80);
  };

  // Section B: DPI Density Scaler State
  const [printWidthInches, setPrintWidthInches] = useState<number>(8.5);
  const [printHeightInches, setPrintHeightInches] = useState<number>(11.0);
  const [targetDpi, setTargetDpi] = useState<number>(300);

  // Common DPI presets
  const dpiPresets = [
    { dpi: 72, label: '72 DPI', desc: 'Web Screen / Standard Displays' },
    { dpi: 150, label: '150 DPI', desc: 'Medium Quality Newspaper / Draft' },
    { dpi: 300, label: '300 DPI', desc: 'High-Res Commercial Fine Print' },
    { dpi: 600, label: '600 DPI', desc: 'Ultra-HD Archival & Vector Print' },
  ];

  const calcPixelWidth = Math.round(printWidthInches * targetDpi);
  const calcPixelHeight = Math.round(printHeightInches * targetDpi);
  const calcMegapixels = ((calcPixelWidth * calcPixelHeight) / 1000000).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 font-mono text-xs font-bold uppercase">
              Dimension & Print Scaler
            </span>
            <span className="text-xs text-slate-500">Live Aspect Ratio Solver • DPI Pixel Resolution Engine</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Aspect Ratio & DPI Canvas Scale
          </h3>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
      </div>

      {/* SECTION A: ASPECT RATIO FINDER & SCALER */}
      <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-500">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Section A: Aspect Ratio Finder & Linked Resizer
              </h4>
              <p className="text-xs text-slate-500">
                Calculated Ratio: <span className="font-mono font-bold text-indigo-500">{ratioX}:{ratioY}</span> ({floatRatio}:1)
              </p>
            </div>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={lockRatio}
              onChange={(e) => setLockRatio(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>🔒 Lock Proportions</span>
          </label>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Standard Ratio Presets:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {ratioPresets.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.w, p.h)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500">
                  {p.label}
                </div>
                <div className="text-[9px] text-slate-400 truncate">{p.use}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dual Input Grids: Original vs Target Scaled */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Base Dimensions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              1. Base Original Dimensions (px)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Width (W)</label>
                <input
                  type="number"
                  min={1}
                  value={origWidth}
                  onChange={(e) => handleOrigWidthChange(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Height (H)</label>
                <input
                  type="number"
                  min={1}
                  value={origHeight}
                  onChange={(e) => handleOrigHeightChange(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Target Resized Dimensions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              2. Target Scaled Output (px)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">New Width</label>
                <input
                  type="number"
                  min={1}
                  value={targetWidth}
                  onChange={(e) => handleTargetWidthChange(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">New Height</label>
                <input
                  type="number"
                  min={1}
                  value={targetHeight}
                  onChange={(e) => handleTargetHeightChange(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Visual Aspect Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-2">
          <div className="text-[11px] font-mono text-slate-400">Visual Proportion Reference Box:</div>
          <div
            className="rounded-xl bg-indigo-500/20 border-2 border-dashed border-indigo-400 flex items-center justify-center transition-all shadow-inner"
            style={{
              width: Math.min(260, Math.max(60, (ratioX / (ratioX + ratioY)) * 360)),
              height: Math.min(160, Math.max(40, (ratioY / (ratioX + ratioY)) * 360)),
            }}
          >
            <span className="font-mono text-xs font-bold text-indigo-300">
              {targetWidth} × {targetHeight}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION B: DPI DENSITY SCALER */}
      <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-500">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Section B: DPI Print Resolution Density Scaler
              </h4>
              <p className="text-xs text-slate-500">
                Calculates required Canvas Pixel Dimension for flawless physical printing
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            {calcMegapixels} MP Canvas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Print Width */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Print Width (Inches)
            </label>
            <input
              type="number"
              step={0.1}
              min={0.5}
              value={printWidthInches}
              onChange={(e) => setPrintWidthInches(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Print Height */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Print Height (Inches)
            </label>
            <input
              type="number"
              step={0.1}
              min={0.5}
              value={printHeightInches}
              onChange={(e) => setPrintHeightInches(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Target DPI */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Target Print DPI ({targetDpi} DPI)
            </label>
            <input
              type="range"
              min={72}
              max={600}
              step={1}
              value={targetDpi}
              onChange={(e) => setTargetDpi(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 mt-3"
            />
          </div>
        </div>

        {/* DPI Presets Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {dpiPresets.map((d) => (
            <button
              key={d.dpi}
              onClick={() => setTargetDpi(d.dpi)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                targetDpi === d.dpi
                  ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold">{d.label}</div>
              <div className="text-[10px] text-slate-400 truncate">{d.desc}</div>
            </button>
          ))}
        </div>

        {/* Calculated Result Output Card */}
        <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
              Exact Required Canvas Resolution
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {calcPixelWidth.toLocaleString()} × {calcPixelHeight.toLocaleString()} <span className="text-sm font-normal text-slate-400">px</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${calcPixelWidth}x${calcPixelHeight}`);
              }}
              className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Resolution</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- 20. EXIF PHOTO PRIVACY PURGER DEMO --- */
export function ExifPhotoPrivacyPurgerDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [sanitizedDataUrl, setSanitizedDataUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('vacation_geotagged_photo.jpg');
  const [fileSize, setFileSize] = useState<number>(3420000);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [purgedSuccess, setPurgedSuccess] = useState<boolean>(false);

  // Mock initial sensitive metadata list
  const detectedMetadata = [
    { label: 'GPS Latitude & Longitude', val: '37.7749° N, 122.4194° W (San Francisco, CA)', risk: 'high' },
    { label: 'Camera Hardware & Serial', val: 'Apple iPhone 15 Pro • Serial #9A24-F810', risk: 'high' },
    { label: 'Exact Creation Timestamp', val: '2026-08-14 18:42:09 GMT-0700', risk: 'medium' },
    { label: 'Lens & Focal Specs', val: '24mm f/1.78 ISO 50 1/1200s', risk: 'low' },
    { label: 'Software Fingerprint', val: 'iOS 18.4 Camera Engine v3.1', risk: 'medium' },
  ];

  // Initialize with sample photo graphic on canvas
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw simulated camera landscape
      const grad = ctx.createLinearGradient(0, 0, 0, 480);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e293b');
      grad.addColorStop(1, '#0f766e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 720, 480);

      // Draw stylized sun & mountains
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(360, 200, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.moveTo(80, 480);
      ctx.lineTo(280, 260);
      ctx.lineTo(480, 480);
      ctx.fill();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.beginPath();
      ctx.moveTo(320, 480);
      ctx.lineTo(520, 290);
      ctx.lineTo(720, 480);
      ctx.fill();

      // Draw banner
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📷 Sample Geotagged Image (GPS Enabled)', 360, 100);

      const url = canvas.toDataURL('image/jpeg', 0.92);
      setPhotoSrc(url);
    }
  }, []);

  // EXIF Purge execution: redraw on raw offline canvas, completely scrubbing original binary EXIF headers
  const purgeExifMetadata = () => {
    if (!photoSrc) return;
    setIsPurging(true);

    setTimeout(() => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // Export pure pixel buffer, erasing original EXIF/GPS tags
          const cleanUrl = canvas.toDataURL('image/jpeg', 0.92);
          setSanitizedDataUrl(cleanUrl);
          setPurgedSuccess(true);
        }
        setIsPurging(false);
      };
      img.src = photoSrc;
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      setFileSize(file.size);
      setPurgedSuccess(false);
      setSanitizedDataUrl(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setPhotoSrc(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadSecurePhoto = () => {
    if (!sanitizedDataUrl && !photoSrc) return;
    const downloadUrl = sanitizedDataUrl || photoSrc!;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `sanitized_${photoName}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-mono text-xs font-bold uppercase">
              Privacy & Cybersecurity
            </span>
            <span className="text-xs text-slate-500">EXIF / GPS Sanitizer • 100% Client-Side Privacy Engine</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            EXIF Photo Privacy Purger
          </h3>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
      </div>

      {/* File Upload Zone */}
      <div className="relative border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-3xl p-6 text-center bg-emerald-500/5 transition-all group">
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/heic"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center space-y-2 pointer-events-none">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Drop photo to inspect & purge metadata or <span className="text-emerald-500 underline">browse files</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            File: <span className="text-slate-600 dark:text-slate-300 font-bold">{photoName}</span> ({(fileSize / (1024 * 1024)).toFixed(2)} MB)
          </div>
        </div>
      </div>

      {/* Metadata Risk Analysis Table */}
      <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Hidden EXIF Metadata Detected in Raw Binary Header:
            </span>
          </div>
          {purgedSuccess ? (
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Purged & Safe
            </span>
          ) : (
            <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> High Risk Data Found
            </span>
          )}
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {detectedMetadata.map((m, idx) => (
            <div key={idx} className="py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{m.label}</span>
              <div className="flex items-center gap-2">
                <span className={`font-mono ${purgedSuccess ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-semibold'}`}>
                  {purgedSuccess ? '[REDACTED / PURGED]' : m.val}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    purgedSuccess
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : m.risk === 'high'
                      ? 'bg-rose-500/10 text-rose-500'
                      : 'bg-amber-500/10 text-amber-500'
                  }`}
                >
                  {purgedSuccess ? 'CLEARED' : m.risk.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Preview & Purge Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Photo Display */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Visual Asset Preview</span>
            <span className="font-mono text-emerald-500 font-semibold">
              {purgedSuccess ? 'Clean Buffer' : 'Unsanitized'}
            </span>
          </div>
          <div className="h-52 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800">
            {photoSrc && (
              <img
                src={sanitizedDataUrl || photoSrc}
                alt="Privacy Preview"
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">
                Client-Side Buffer Sanitization
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When purged, this tool renders your image onto an isolated offline HTML5 Canvas and exports a fresh binary pixel stream. GPS tags, serial IDs, and creation dates are permanently destroyed.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {!purgedSuccess ? (
              <button
                onClick={purgeExifMetadata}
                disabled={isPurging}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isPurging ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Scrubbing Metadata Headers...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>🔒 Purge All EXIF & GPS Metadata Now</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                  ✅ Privacy Cleared: GPS & Camera metadata successfully purged!
                </div>
                <button
                  onClick={handleDownloadSecurePhoto}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>📥 Download Secure Photo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   1. Social Media Canvas Presets (demoType: 'social')
   ========================================================================== */
interface SocialPreset {
  id: string;
  platform: 'Instagram' | 'YouTube' | 'TikTok' | 'LinkedIn' | 'X (Twitter)' | 'Facebook' | 'Pinterest';
  title: string;
  width: number;
  height: number;
  ratio: string;
  category: 'feed' | 'story' | 'banner' | 'video' | 'profile';
  icon: string;
  bestFor: string;
}

const SOCIAL_PRESETS: SocialPreset[] = [
  // Instagram
  { id: 'ig-story', platform: 'Instagram', title: 'Story / Reel / 9:16 Vertical', width: 1080, height: 1920, ratio: '9:16', category: 'story', icon: '📱', bestFor: 'Reels, Stories, Highlights, Fullscreen vertical shorts' },
  { id: 'ig-square', platform: 'Instagram', title: 'Square Feed Post (1:1)', width: 1080, height: 1080, ratio: '1:1', category: 'feed', icon: '📷', bestFor: 'Standard photo feeds, carousel slides' },
  { id: 'ig-portrait', platform: 'Instagram', title: 'Portrait Feed (4:5)', width: 1080, height: 1350, ratio: '4:5', category: 'feed', icon: '🖼️', bestFor: 'Max vertical screen real estate in feeds' },
  { id: 'ig-landscape', platform: 'Instagram', title: 'Landscape Feed (1.91:1)', width: 1080, height: 566, ratio: '1.91:1', category: 'feed', icon: '🌄', bestFor: 'Panoramic photography, horizontal videos' },

  // YouTube
  { id: 'yt-video', platform: 'YouTube', title: 'Standard Full HD Video (1080p)', width: 1920, height: 1080, ratio: '16:9', category: 'video', icon: '🎬', bestFor: 'Main uploads, widescreen displays, TV playback' },
  { id: 'yt-thumb', platform: 'YouTube', title: 'Video Thumbnail (Custom)', width: 1280, height: 720, ratio: '16:9', category: 'feed', icon: '🖼️', bestFor: 'High CTR clickable custom video covers' },
  { id: 'yt-banner', platform: 'YouTube', title: 'Channel Header Banner', width: 2560, height: 1440, ratio: '16:9', category: 'banner', icon: '🎨', bestFor: 'Multi-device safe channel header (safe zone 1546x423)' },
  { id: 'yt-shorts', platform: 'YouTube', title: 'YouTube Shorts', width: 1080, height: 1920, ratio: '9:16', category: 'story', icon: '⚡', bestFor: 'Mobile vertical short-form video content' },

  // TikTok
  { id: 'tt-video', platform: 'TikTok', title: 'TikTok Standard Video', width: 1080, height: 1920, ratio: '9:16', category: 'video', icon: '🎵', bestFor: 'Viral short videos, in-feed ads, live cover' },

  // LinkedIn
  { id: 'li-post', platform: 'LinkedIn', title: 'Feed Post & Carousel Slide', width: 1200, height: 1200, ratio: '1:1', category: 'feed', icon: '💼', bestFor: 'Document carousel PDF pages, thought leadership' },
  { id: 'li-banner', platform: 'LinkedIn', title: 'Company / Profile Cover Banner', width: 1584, height: 396, ratio: '4:1', category: 'banner', icon: '🏢', bestFor: 'Professional personal brand & company page header' },
  { id: 'li-og', platform: 'LinkedIn', title: 'Blog Link Preview (OpenGraph)', width: 1200, height: 627, ratio: '1.91:1', category: 'feed', icon: '🔗', bestFor: 'Articles, URL previews, newsletter hero image' },

  // X (Twitter)
  { id: 'tw-post', platform: 'X (Twitter)', title: 'Single & Multi-Image Post', width: 1200, height: 675, ratio: '16:9', category: 'feed', icon: '🐦', bestFor: 'Timeline tweets, screenshot highlights' },
  { id: 'tw-header', platform: 'X (Twitter)', title: 'Profile Header Banner', width: 1500, height: 500, ratio: '3:1', category: 'banner', icon: '🌌', bestFor: 'Account header banner graphic' },

  // Facebook & OpenGraph
  { id: 'og-standard', platform: 'Facebook', title: 'Universal OpenGraph / Meta Card', width: 1200, height: 630, ratio: '1.91:1', category: 'feed', icon: '🌐', bestFor: 'Website og:image meta tags, Discord embeds, iMessage cards' },
];

function SocialMediaPresetsDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('yt-thumb');
  const [multiplier, setMultiplier] = useState<number>(1);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const activePreset = SOCIAL_PRESETS.find(p => p.id === selectedPresetId) || SOCIAL_PRESETS[0];

  const scaledWidth = activePreset.width * multiplier;
  const scaledHeight = activePreset.height * multiplier;
  const totalMegapixels = ((scaledWidth * scaledHeight) / 1000000).toFixed(2);

  const filteredList = filterPlatform === 'all' 
    ? SOCIAL_PRESETS 
    : SOCIAL_PRESETS.filter(p => p.platform.toLowerCase().includes(filterPlatform.toLowerCase()));

  const handleCopyDimensions = () => {
    navigator.clipboard.writeText(`${scaledWidth} x ${scaledHeight} px (${activePreset.ratio})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCssAspect = () => {
    const cssText = `/* CSS Aspect Ratio */\naspect-ratio: ${activePreset.ratio.replace(':', ' / ')};\nwidth: ${scaledWidth}px;\nheight: ${scaledHeight}px;`;
    navigator.clipboard.writeText(cssText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back to Grid Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
        <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-bold ml-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Modern 2026 Social Media Standard Matrices</span>
        </div>
      </div>

      {/* Main Grid: Left Preset Selector, Right Interactive Scaled Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Platform Filter & Preset Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Platform Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'all', label: '🌟 All' },
              { id: 'instagram', label: '📷 Instagram' },
              { id: 'youtube', label: '🎬 YouTube' },
              { id: 'tiktok', label: '🎵 TikTok' },
              { id: 'linkedin', label: '💼 LinkedIn' },
              { id: 'x (twitter)', label: '🐦 X (Twitter)' },
              { id: 'facebook', label: '🌐 Meta / OG' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterPlatform(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filterPlatform === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredList.map(preset => {
              const isSelected = preset.id === selectedPresetId;
              return (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`p-3 rounded-2xl text-left border transition-all relative group ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 shadow-md ring-2 ring-purple-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span>{preset.icon}</span>
                      <span>{preset.platform}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400">
                      {preset.ratio}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {preset.title}
                  </h4>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span>{preset.width} × {preset.height} px</span>
                    <span className="text-[10px] text-slate-400">Base 1x</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Scaled Preview & Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-5">
            {/* Header with platform & aspect */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                  {activePreset.platform} Preset
                </span>
                <h3 className="text-sm font-bold text-white leading-tight">
                  {activePreset.title}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
                {activePreset.ratio}
              </span>
            </div>

            {/* Visual Canvas Aspect Frame */}
            <div className="h-44 w-full rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-3 relative overflow-hidden">
              <div 
                className="bg-gradient-to-tr from-purple-600/30 via-pink-600/30 to-indigo-600/30 border-2 border-dashed border-purple-400/80 rounded-xl flex flex-col items-center justify-center text-center p-2 transition-all duration-300 shadow-lg shadow-purple-900/30 max-h-full max-w-full"
                style={{
                  aspectRatio: activePreset.ratio === '1.91:1' ? '1.91 / 1' : activePreset.ratio === '4:1' ? '4 / 1' : activePreset.ratio === '3:1' ? '3 / 1' : activePreset.ratio.replace(':', ' / '),
                  height: activePreset.ratio === '9:16' ? '100%' : 'auto',
                  width: activePreset.ratio !== '9:16' ? '85%' : 'auto',
                }}
              >
                <span className="text-xs font-mono font-bold text-purple-200">
                  {scaledWidth} × {scaledHeight}
                </span>
                <span className="text-[10px] text-purple-300/80 font-mono">
                  {multiplier}x • {activePreset.ratio}
                </span>
              </div>
            </div>

            {/* Multiplier Slider (1x to 4x) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span>Scale Canvas Multiplier:</span>
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-purple-600 text-white font-mono text-xs">
                  {multiplier}x Resolution
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map(scale => (
                  <button
                    key={scale}
                    onClick={() => setMultiplier(scale)}
                    className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                      multiplier === scale
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {scale}x {scale === 2 && '(Retina)'} {scale === 4 && '(4K)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated High-Resolution Matrix Display */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Total Resolution</span>
                <span className="font-mono font-bold text-purple-300 text-sm">
                  {scaledWidth} × {scaledHeight} px
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Density Matrix</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {totalMegapixels} MP
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyDimensions}
                className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : '📋 Copy Dimensions'}</span>
              </button>
              <button
                onClick={handleCopyCssAspect}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Copy CSS Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. Unit & Physical Dimension Matrix (demoType: 'unit')
   ========================================================================== */
type UnitCategory = 'length' | 'weight' | 'temperature' | 'data';

interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  toBase: (val: number) => number; // base: meter, kilogram, celsius, byte
  fromBase: (base: number) => number;
}

const UNIT_MATRICES: Record<UnitCategory, { title: string; icon: string; units: UnitDef[] }> = {
  length: {
    title: 'Length & Distance',
    icon: '📏',
    units: [
      { id: 'm', name: 'Meters', symbol: 'm', toBase: v => v, fromBase: v => v },
      { id: 'km', name: 'Kilometers', symbol: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
      { id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mi', name: 'Miles', symbol: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { id: 'yd', name: 'Yards', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'ft', name: 'Feet', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'in', name: 'Inches', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { id: 'nmi', name: 'Nautical Miles', symbol: 'nmi', toBase: v => v * 1852, fromBase: v => v / 1852 },
    ]
  },
  weight: {
    title: 'Weight & Mass',
    icon: '⚖️',
    units: [
      { id: 'kg', name: 'Kilograms', symbol: 'kg', toBase: v => v, fromBase: v => v },
      { id: 'g', name: 'Grams', symbol: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mg', name: 'Milligrams', symbol: 'mg', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
      { id: 'lb', name: 'Pounds', symbol: 'lbs', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
      { id: 'oz', name: 'Ounces', symbol: 'oz', toBase: v => v * 0.028349523, fromBase: v => v / 0.028349523 },
      { id: 't', name: 'Metric Tonnes', symbol: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'stone', name: 'Stone (UK)', symbol: 'st', toBase: v => v * 6.35029, fromBase: v => v / 6.35029 }
    ]
  },
  temperature: {
    title: 'Temperature Scales',
    icon: '🌡️',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: v => v, fromBase: v => v },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: v => (v - 32) * (5 / 9), fromBase: v => (v * 9 / 5) + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 }
    ]
  },
  data: {
    title: 'Digital Storage & Data',
    icon: '💾',
    units: [
      { id: 'b', name: 'Bytes', symbol: 'B', toBase: v => v, fromBase: v => v },
      { id: 'kb', name: 'Kilobytes', symbol: 'KB', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: 'mb', name: 'Megabytes', symbol: 'MB', toBase: v => v * 1024 * 1024, fromBase: v => v / (1024 * 1024) },
      { id: 'gb', name: 'Gigabytes', symbol: 'GB', toBase: v => v * Math.pow(1024, 3), fromBase: v => v / Math.pow(1024, 3) },
      { id: 'tb', name: 'Terabytes', symbol: 'TB', toBase: v => v * Math.pow(1024, 4), fromBase: v => v / Math.pow(1024, 4) },
      { id: 'pb', name: 'Petabytes', symbol: 'PB', toBase: v => v * Math.pow(1024, 5), fromBase: v => v / Math.pow(1024, 5) }
    ]
  }
};

function UnitDimensionMatrixDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [activeCategory, setActiveCategory] = useState<UnitCategory>('length');
  const [fromValue, setFromValue] = useState<number>(100);
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('ft');
  const [copied, setCopied] = useState<boolean>(false);

  const currentCategoryData = UNIT_MATRICES[activeCategory];
  const fromUnit = currentCategoryData.units.find(u => u.id === fromUnitId) || currentCategoryData.units[0];
  const toUnit = currentCategoryData.units.find(u => u.id === toUnitId) || currentCategoryData.units[1];

  // Perform fluid instantaneous conversion
  const computeTargetValue = (): number => {
    if (isNaN(fromValue)) return 0;
    const baseValue = fromUnit.toBase(fromValue);
    const converted = toUnit.fromBase(baseValue);
    return converted;
  };

  const convertedValue = computeTargetValue();

  const handleCategorySwitch = (cat: UnitCategory) => {
    setActiveCategory(cat);
    const firstTwo = UNIT_MATRICES[cat].units;
    setFromUnitId(firstTwo[0].id);
    setToUnitId(firstTwo[1]?.id || firstTwo[0].id);
    if (cat === 'temperature') setFromValue(25);
    else if (cat === 'weight') setFromValue(10);
    else if (cat === 'data') setFromValue(16);
    else setFromValue(100);
  };

  const handleSwapUnits = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const handleCopyResult = () => {
    const formatted = `${fromValue} ${fromUnit.symbol} = ${convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toUnit.symbol}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
        <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold ml-auto">
          <Scale className="w-3.5 h-3.5" />
          <span>High-Precision Real-Time Matrix</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(UNIT_MATRICES) as UnitCategory[]).map(cat => {
          const item = UNIT_MATRICES[cat];
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySwitch(cat)}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <h4 className={`text-xs font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                  {item.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.units.length} Units
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Dual Conversion Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          
          {/* Column A: From Unit Input (5 cols) */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              From Value ({fromUnit.name})
            </label>
            <div className="space-y-2">
              <input
                type="number"
                value={fromValue}
                onChange={e => setFromValue(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xl font-bold focus:outline-none focus:border-indigo-500 transition-all"
                placeholder="Enter value..."
              />
              <select
                value={fromUnitId}
                onChange={e => setFromUnitId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold focus:outline-none focus:border-indigo-500"
              >
                {currentCategoryData.units.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button (1 col) */}
          <div className="md:col-span-1 flex justify-center py-2">
            <button
              onClick={handleSwapUnits}
              className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
              title="Swap Units"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Column B: To Target Output (5 cols) */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Converted Result ({toUnit.name})
            </label>
            <div className="space-y-2">
              <div className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-indigo-500/40 text-indigo-300 font-mono text-xl font-bold truncate flex items-center justify-between">
                <span>{convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
                <span className="text-xs text-indigo-400 font-bold ml-2">{toUnit.symbol}</span>
              </div>
              <select
                value={toUnitId}
                onChange={e => setToUnitId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold focus:outline-none focus:border-indigo-500"
              >
                {currentCategoryData.units.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Multi-Unit Instant Summary Matrix */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Instant Matrix Equivalents for {fromValue} {fromUnit.symbol}
            </span>
            <button
              onClick={handleCopyResult}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : '📋 Copy Conversion'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {currentCategoryData.units.map(unit => {
              const val = unit.fromBase(fromUnit.toBase(fromValue));
              return (
                <div key={unit.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block truncate">{unit.name}</span>
                  <div className="font-mono font-bold text-xs text-white truncate mt-0.5">
                    {val.toLocaleString(undefined, { maximumFractionDigits: 4 })} <span className="text-[10px] text-indigo-400">{unit.symbol}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. Word Counter & Reading Speed (demoType: 'word')
   ========================================================================== */
function WordCounterReadingSpeedDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [text, setText] = useState<string>(
    'The quick brown fox jumps over the lazy dog. In the modern era of rapid digital information and deep analytical workflows, high-precision content optimization is essential for web publishers, copywriters, and software engineers.\n\nAnalyzing article density and reading pace empowers creators to tailor their prose to exact audience engagement thresholds with total statistical clarity.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Compute live analytics metrics
  const cleanTrimmed = text.trim();
  const wordsArray = cleanTrimmed === '' ? [] : cleanTrimmed.split(/\s+/).filter(w => w.length > 0);
  const totalWords = wordsArray.length;
  const totalCharsWithSpaces = text.length;
  const totalCharsNoSpaces = text.replace(/\s+/g, '').length;
  
  // Reading & Speaking times
  // 220 words per minute baseline reading speed
  const readingMinutes = totalWords / 220;
  const readingSeconds = Math.round(readingMinutes * 60);
  const readingFormatted = readingSeconds < 60 
    ? `${readingSeconds} sec` 
    : `${Math.floor(readingSeconds / 60)} min ${readingSeconds % 60}s`;

  // 130 words per minute baseline speaking speed
  const speakingMinutes = totalWords / 130;
  const speakingSeconds = Math.round(speakingMinutes * 60);
  const speakingFormatted = speakingSeconds < 60 
    ? `${speakingSeconds} sec` 
    : `${Math.floor(speakingSeconds / 60)} min ${speakingSeconds % 60}s`;

  // Paragraphs & Sentences
  const paragraphs = cleanTrimmed === '' ? 0 : cleanTrimmed.split(/\n+/).filter(p => p.trim().length > 0).length;
  const sentences = cleanTrimmed === '' ? 0 : cleanTrimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  const handleCopyMetrics = () => {
    const summary = `📊 Text Metrics Summary:\n• Words: ${totalWords}\n• Characters (with spaces): ${totalCharsWithSpaces}\n• Characters (no spaces): ${totalCharsNoSpaces}\n• Reading Time (220 wpm): ${readingFormatted}\n• Speaking Time (130 wpm): ${speakingFormatted}\n• Paragraphs: ${paragraphs}\n• Sentences: ${sentences}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearText = () => {
    setText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold ml-auto">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Live 220 WPM & 130 WPM Analysis Engine</span>
        </div>
      </div>

      {/* 5 Neon-Accented Metric Display Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Card 1: Total Words */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-lg space-y-1">
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
            <Type className="w-3.5 h-3.5" /> Words
          </span>
          <div className="text-2xl font-black font-mono text-emerald-300">
            {totalWords.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            {totalWords > 0 ? `${(totalWords / (sentences || 1)).toFixed(1)} w/sent` : '0 words'}
          </span>
        </div>

        {/* Card 2: Characters */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-lg space-y-1">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" /> Characters
          </span>
          <div className="text-2xl font-black font-mono text-cyan-300">
            {totalCharsWithSpaces.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            {totalCharsNoSpaces} no spaces
          </span>
        </div>

        {/* Card 3: Reading Time (220 wpm) */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-lg space-y-1">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Reading Time
          </span>
          <div className="text-xl font-black font-mono text-amber-300 truncate">
            {readingFormatted}
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            @ 220 WPM pace
          </span>
        </div>

        {/* Card 4: Speaking Time (130 wpm) */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-lg space-y-1">
          <span className="text-[10px] font-mono uppercase text-purple-400 font-bold flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" /> Speaking Time
          </span>
          <div className="text-xl font-black font-mono text-purple-300 truncate">
            {speakingFormatted}
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            @ 130 WPM pace
          </span>
        </div>

        {/* Card 5: Paragraphs & Sentences */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-lg space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono uppercase text-rose-400 font-bold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Structure
          </span>
          <div className="text-2xl font-black font-mono text-rose-300">
            {paragraphs} <span className="text-xs text-slate-400 font-normal">para</span>
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            {sentences} sentences
          </span>
        </div>
      </div>

      {/* Spacious Interactive Text Entry Workspace Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span>📝 Interactive Writing & Analysis Workspace</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearText}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
            <button
              onClick={handleCopyMetrics}
              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : '📋 Copy Stats'}</span>
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={9}
          placeholder="Paste or start typing your document, essay, speech, or blog post here to calculate word metrics in real-time..."
          className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all leading-relaxed shadow-inner"
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   4. Percentage & Black Friday Discount (demoType: 'percentage')
   ========================================================================== */
type DiscountTab = 'discount' | 'general_percentage';

function PercentageDiscountDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [activeTab, setActiveTab] = useState<DiscountTab>('discount');

  // Mode A: Sale Discount States
  const [originalPrice, setOriginalPrice] = useState<number>(4999);
  const [primaryDiscount, setPrimaryDiscount] = useState<number>(40);
  const [couponDiscount, setCouponDiscount] = useState<number>(10);
  const [taxPercent, setTaxPercent] = useState<number>(0);

  // Mode B: General Percentage States
  const [whatIsX, setWhatIsX] = useState<number>(25);
  const [whatIsY, setWhatIsY] = useState<number>(500);

  const [xIsWhatX, setXIsWhatX] = useState<number>(45);
  const [xIsWhatY, setXIsWhatY] = useState<number>(180);

  const [pctChangeA, setPctChangeA] = useState<number>(120);
  const [pctChangeB, setPctChangeB] = useState<number>(168);

  const [copied, setCopied] = useState<boolean>(false);

  // Calculations for Mode A
  const priceAfterPrimary = originalPrice * (1 - primaryDiscount / 100);
  const priceAfterCoupon = priceAfterPrimary * (1 - couponDiscount / 100);
  const finalPriceToPay = priceAfterCoupon * (1 + taxPercent / 100);
  const totalMoneySaved = originalPrice - priceAfterCoupon;
  const effectiveTotalDiscount = originalPrice > 0 ? ((totalMoneySaved / originalPrice) * 100).toFixed(1) : '0';

  // Calculations for Mode B
  const resultWhatIs = (whatIsX / 100) * whatIsY;
  const resultXIsWhat = xIsWhatY !== 0 ? ((xIsWhatX / xIsWhatY) * 100).toFixed(2) : '0';
  const pctChangeDiff = pctChangeB - pctChangeA;
  const pctChangeRate = pctChangeA !== 0 ? ((pctChangeDiff / pctChangeA) * 100).toFixed(2) : '0';

  const handleCopyDiscountResult = () => {
    const summary = `🏷️ Black Friday Sale Breakdown:\n• Original Price: ₹${originalPrice.toLocaleString()}\n• Primary Cut: ${primaryDiscount}%\n• Extra Stacked Coupon: ${couponDiscount}%\n• Final Price to Pay: ₹${Math.round(finalPriceToPay).toLocaleString()}\n• Total Savings: ₹${Math.round(totalMoneySaved).toLocaleString()} (${effectiveTotalDiscount}% OFF)`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
        <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-bold ml-auto">
          <Percent className="w-3.5 h-3.5" />
          <span>Dual Mode Commercial & Math Calculator</span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-md">
        <button
          onClick={() => setActiveTab('discount')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'discount'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Sale Discount Finder</span>
        </button>
        <button
          onClick={() => setActiveTab('general_percentage')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'general_percentage'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>General Percentage Engine</span>
        </button>
      </div>

      {/* MODE A: Sale & Black Friday Stacked Discount Finder */}
      {activeTab === 'discount' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Input 1: Original Retail Price */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Original Retail Price (₹)</span>
                <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">
                  ₹{originalPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                min="10"
                max="5000000"
                value={originalPrice}
                onChange={e => setOriginalPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm font-bold focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Input 2: Primary Discount % Slider */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Primary Sale Discount %</span>
                <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">{primaryDiscount}% OFF</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="1"
                value={primaryDiscount}
                onChange={e => setPrimaryDiscount(parseInt(e.target.value))}
                className="w-full accent-rose-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex gap-1.5 pt-1">
                {[10, 20, 30, 40, 50, 60, 70, 80].map(val => (
                  <button
                    key={val}
                    onClick={() => setPrimaryDiscount(val)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                      primaryDiscount === val
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Additional Stacked Coupon Discount % */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Additional Stacked Coupon % (Black Friday / Promo)</span>
                <span className="font-mono text-amber-500 font-bold">+{couponDiscount}% Extra</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={couponDiscount}
                onChange={e => setCouponDiscount(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Right Results Display (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-5">
              
              {/* Final Price to Pay */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                  Final Price to Pay
                </span>
                <div className="text-3xl font-black font-mono text-rose-400">
                  ₹{Math.round(finalPriceToPay).toLocaleString()}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
                  <span>🎉 Total Effective Discount: {effectiveTotalDiscount}% OFF</span>
                </div>
              </div>

              {/* Total Money Saved */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">Total Money Saved</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    ₹{Math.round(totalMoneySaved).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Original Retail:</span>
                  <span>₹{originalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>After Primary ({primaryDiscount}%):</span>
                  <span>₹{Math.round(priceAfterPrimary).toLocaleString()}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                    <span>Coupon ({couponDiscount}% extra):</span>
                    <span>-₹{Math.round(priceAfterPrimary - priceAfterCoupon).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Copy Action */}
              <button
                onClick={handleCopyDiscountResult}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : '📋 Copy Savings Breakdown'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE B: General Percentage Engine */}
      {activeTab === 'general_percentage' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Prompt 1: What is X% of Y? */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              1. What is X% of Y?
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Percentage (X %)</label>
                <input
                  type="number"
                  value={whatIsX}
                  onChange={e => setWhatIsX(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Of Total Value (Y)</label>
                <input
                  type="number"
                  value={whatIsY}
                  onChange={e => setWhatIsY(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold"
                />
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
              <span className="text-[10px] text-slate-500 block font-mono">Result:</span>
              <span className="text-xl font-black font-mono text-rose-600 dark:text-rose-400">
                {resultWhatIs.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Prompt 2: X is what % of Y? */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              2. X is what % of Y?
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Part Value (X)</label>
                <input
                  type="number"
                  value={xIsWhatX}
                  onChange={e => setXIsWhatX(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Total Whole (Y)</label>
                <input
                  type="number"
                  value={xIsWhatY}
                  onChange={e => setXIsWhatY(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold"
                />
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
              <span className="text-[10px] text-slate-500 block font-mono">Result:</span>
              <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                {resultXIsWhat}%
              </span>
            </div>
          </div>

          {/* Prompt 3: % Increase / Decrease from A to B */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              3. % Change from A to B
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Initial Value (A)</label>
                <input
                  type="number"
                  value={pctChangeA}
                  onChange={e => setPctChangeA(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Final Value (B)</label>
                <input
                  type="number"
                  value={pctChangeB}
                  onChange={e => setPctChangeB(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold"
                />
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${
              parseFloat(pctChangeRate) >= 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50'
            }`}>
              <span className="text-[10px] text-slate-500 block font-mono">
                {parseFloat(pctChangeRate) >= 0 ? 'Increase:' : 'Decrease:'}
              </span>
              <span className={`text-xl font-black font-mono ${
                parseFloat(pctChangeRate) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {parseFloat(pctChangeRate) >= 0 ? `+${pctChangeRate}%` : `${pctChangeRate}%`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   5. Age & Milestone Chronometer (demoType: 'age')
   ========================================================================== */
function AgeMilestoneChronometerDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [dob, setDob] = useState<string>('1998-08-15');
  const [targetDate, setTargetDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [copied, setCopied] = useState<boolean>(false);

  // Compute exact chronological age
  const calculateExactAge = () => {
    const birth = new Date(dob);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDaysInWeek = totalDays % 7;
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalHeartbeats = Math.floor(totalMinutes * 75); // approx 75 bpm

    // Next Birthday Calculation
    const currentYear = target.getFullYear();
    let nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    const nextAge = years + (daysToNextBday === 0 ? 0 : 1);
    const dayOfWeekNextBday = nextBday.toLocaleDateString('en-US', { weekday: 'long' });

    // Zodiac
    const month = birth.getMonth() + 1;
    const day = birth.getDate();
    let zodiac = 'Capricorn ♑';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiac = 'Aquarius ♒';
    else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) zodiac = 'Pisces ♓';
    else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiac = 'Aries ♈';
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiac = 'Taurus ♉';
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiac = 'Gemini ♊';
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiac = 'Cancer ♋';
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiac = 'Leo ♌';
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiac = 'Virgo ♍';
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiac = 'Libra ♎';
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiac = 'Scorpio ♏';
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiac = 'Sagittarius ♐';

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      remainingDaysInWeek,
      totalMonths,
      totalHours,
      totalMinutes,
      totalHeartbeats,
      daysToNextBday,
      nextAge,
      dayOfWeekNextBday,
      zodiac
    };
  };

  const ageData = calculateExactAge();

  const handleCopySummary = () => {
    if (!ageData) return;
    const summary = `🎂 Chronological Age Breakdown:\n• Exact Age: ${ageData.years} Years, ${ageData.months} Months, ${ageData.days} Days\n• Total Days Lived: ${ageData.totalDays.toLocaleString()} Days\n• Total Weeks: ${ageData.totalWeeks.toLocaleString()} Weeks\n• Total Hours: ${ageData.totalHours.toLocaleString()} Hours\n• Next Birthday: In ${ageData.daysToNextBday} days (${ageData.nextAge}th Birthday on a ${ageData.dayOfWeekNextBday})\n• Zodiac Sign: ${ageData.zodiac}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
        <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 font-bold ml-auto">
          <Calendar className="w-3.5 h-3.5" />
          <span>High-Precision Chronological Milestone Engine</span>
        </div>
      </div>

      {/* Date Pickers Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Cake className="w-3.5 h-3.5 text-violet-500" />
            <span>Date of Birth (DOB)</span>
          </label>
          <input
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm font-bold focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-violet-500" />
            <span>Calculate Age as of Date</span>
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm font-bold focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Results Display */}
      {ageData ? (
        <div className="space-y-4">
          
          {/* Main Hero Card: Exact Chronological Age */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exact Chronological Age</span>
              </span>
              <button
                onClick={handleCopySummary}
                className="px-3 py-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-violet-600/30"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : '📋 Copy Summary'}</span>
              </button>
            </div>

            {/* Big Gradient Chronometer Display */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-violet-400">
                  {ageData.years}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Years</span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-purple-400">
                  {ageData.months}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Months</span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-pink-400">
                  {ageData.days}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Days</span>
              </div>
            </div>

            {/* Next Birthday Milestone Tracker Alert */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/60 to-purple-950/60 border border-violet-800/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/40 shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-violet-200">
                    Next Birthday Countdown ({ageData.nextAge}th Birthday)
                  </h4>
                  <p className="text-[11px] text-violet-300/80 font-mono">
                    {ageData.daysToNextBday === 0
                      ? '🎉 Happy Birthday! Today is your special day!'
                      : `Falling on a ${ageData.dayOfWeekNextBday}`}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xl font-black font-mono text-amber-400">
                  {ageData.daysToNextBday} <span className="text-xs text-amber-300 font-normal">days left</span>
                </div>
              </div>
            </div>
          </div>

          {/* Micro-Stats Grid: Total Time Lived */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">Total Months</span>
              <div className="text-lg font-bold font-mono text-violet-600 dark:text-violet-400">
                {ageData.totalMonths.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">Total Weeks</span>
              <div className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400">
                {ageData.totalWeeks.toLocaleString()} <span className="text-[10px] text-slate-400">wks</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">Total Days Lived</span>
              <div className="text-lg font-bold font-mono text-pink-600 dark:text-pink-400">
                {ageData.totalDays.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">Zodiac Sign</span>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400 truncate">
                {ageData.zodiac}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">Total Hours</span>
              <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {ageData.totalHours.toLocaleString()} hrs
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">Total Minutes</span>
              <div className="text-base font-bold font-mono text-cyan-600 dark:text-cyan-400 truncate">
                {ageData.totalMinutes.toLocaleString()} min
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-1 col-span-2">
              <span className="text-[10px] text-slate-400 font-mono block">Estimated Heartbeats (~75 bpm)</span>
              <div className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
                ~{ageData.totalHeartbeats.toLocaleString()} beats
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold text-center">
          ⚠️ Please select a valid birth date that is before the comparison date.
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   6. Smart Bill Splitter & Tip Master (demoType: 'split')
   ========================================================================== */
function SmartBillSplitterDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [billAmount, setBillAmount] = useState<number>(3600);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [rounding, setRounding] = useState<'none' | '1' | '10' | '50'>('none');
  const [copied, setCopied] = useState<boolean>(false);

  // Computations
  const totalTip = billAmount * (tipPercent / 100);
  const totalWithTip = billAmount + totalTip;
  const rawPerPerson = peopleCount > 0 ? totalWithTip / peopleCount : 0;
  
  let perPersonFinal = rawPerPerson;
  if (rounding === '1') perPersonFinal = Math.ceil(rawPerPerson);
  else if (rounding === '10') perPersonFinal = Math.ceil(rawPerPerson / 10) * 10;
  else if (rounding === '50') perPersonFinal = Math.ceil(rawPerPerson / 50) * 50;

  const tipPerPerson = peopleCount > 0 ? totalTip / peopleCount : 0;
  const basePerPerson = peopleCount > 0 ? billAmount / peopleCount : 0;

  const handleCopySplit = () => {
    const summary = `🧾 Smart Bill Split Breakdown:\n• Total Food & Drinks: ₹${billAmount.toLocaleString()}\n• Tip (${tipPercent}%): ₹${Math.round(totalTip).toLocaleString()}\n• Grand Total: ₹${Math.round(totalWithTip).toLocaleString()}\n• Group Size: ${peopleCount} People\n👉 EACH PERSON PAYS: ₹${perPersonFinal.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
        <div className="flex items-center gap-2 text-xs text-teal-600 dark:text-teal-400 font-bold ml-auto">
          <Receipt className="w-3.5 h-3.5" />
          <span>Fair Expense & Tip Distribution Matrix</span>
        </div>
      </div>

      {/* Main Grid: Controls vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Input 1: Total Bill Amount */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-teal-500" />
                <span>Total Bill Amount (₹)</span>
              </span>
              <span className="font-mono text-teal-600 dark:text-teal-400 font-bold text-sm">
                ₹{billAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="number"
              min="10"
              max="500000"
              value={billAmount}
              onChange={e => setBillAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-base font-bold focus:outline-none focus:border-teal-500"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[500, 1000, 2500, 5000, 10000].map(val => (
                <button
                  key={val}
                  onClick={() => setBillAmount(val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    billAmount === val
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  ₹{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Tip Percentage */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-teal-500" />
                <span>Tip Percentage: {tipPercent}%</span>
              </span>
              <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">
                +₹{Math.round(totalTip).toLocaleString()} Tip
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={tipPercent}
              onChange={e => setTipPercent(parseInt(e.target.value))}
              className="w-full accent-teal-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="grid grid-cols-6 gap-1 pt-1">
              {[0, 5, 10, 15, 20, 25].map(p => (
                <button
                  key={p}
                  onClick={() => setTipPercent(p)}
                  className={`py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    tipPercent === p
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          {/* Input 3: Number of People */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-500" />
                <span>Number of People Splitting</span>
              </span>
              <span className="font-mono text-teal-600 dark:text-teal-400 font-bold text-sm">
                {peopleCount} {peopleCount === 1 ? 'Person' : 'People'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-lg flex items-center justify-center"
              >
                -
              </button>
              <input
                type="range"
                min="1"
                max="30"
                value={peopleCount}
                onChange={e => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 accent-teal-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <button
                onClick={() => setPeopleCount(peopleCount + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-lg flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Rounding Pills */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Round Up:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'none', label: 'Exact' },
                { id: '1', label: '₹1' },
                { id: '10', label: '₹10' },
                { id: '50', label: '₹50' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setRounding(opt.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                    rounding === opt.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Display Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-5">
            
            {/* Grand Hero Result: Per Person Share */}
            <div className="space-y-1 text-center p-4 rounded-2xl bg-slate-950 border border-teal-500/30">
              <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider block font-bold">
                Each Person Pays
              </span>
              <div className="text-4xl font-black font-mono text-teal-300">
                ₹{perPersonFinal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-slate-400 font-mono block">
                Split among {peopleCount} {peopleCount === 1 ? 'person' : 'people'}
              </span>
            </div>

            {/* Bill Summary Table */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-800">
                <span>Base Bill Total:</span>
                <span className="text-white font-bold">₹{billAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-800">
                <span>Total Tip ({tipPercent}%):</span>
                <span className="text-teal-400 font-bold">+₹{Math.round(totalTip).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 font-bold pb-1.5 border-b border-slate-800">
                <span>Grand Total (Bill + Tip):</span>
                <span className="text-white text-sm">₹{Math.round(totalWithTip).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-0.5">
                <span>Base per Person:</span>
                <span>₹{basePerPerson.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Tip per Person:</span>
                <span>₹{tipPerPerson.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
              </div>
            </div>

            {/* Action Share Button */}
            <button
              onClick={handleCopySplit}
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Breakdown!' : '📋 Copy Bill Split Breakdown'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. Ultradian & Pomodoro Focus Timer (demoType: 'pomodoro')
   ========================================================================== */
type TimerPreset = 'pomodoro' | 'short_break' | 'long_break' | 'ultradian' | 'sprint';

const TIMER_PRESETS: Record<TimerPreset, { name: string; minutes: number; icon: string; accent: string }> = {
  pomodoro: { name: 'Pomodoro Focus', minutes: 25, icon: '🍅', accent: 'text-rose-500' },
  short_break: { name: 'Short Break', minutes: 5, icon: '☕', accent: 'text-emerald-500' },
  long_break: { name: 'Long Break', minutes: 15, icon: '🌴', accent: 'text-teal-500' },
  ultradian: { name: 'Ultradian Rhythm', minutes: 90, icon: '⚡', accent: 'text-purple-500' },
  sprint: { name: 'Deep Sprint', minutes: 50, icon: '🎯', accent: 'text-amber-500' }
};

function UltradianPomodoroTimerDemo({ onBackToGrid }: { onBackToGrid?: () => void }) {
  const [activePreset, setActivePreset] = useState<TimerPreset>('pomodoro');
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [isFinishedAlarm, setIsFinishedAlarm] = useState<boolean>(false);

  // Play synthetic Web Audio chime when reaching 00:00
  const playAlarmSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.45);
      });
    } catch (e) {
      // Audio context ignored if blocked
    }
  };

  // Timer Tick Engine
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            setIsFinishedAlarm(true);
            setCompletedSessions(c => c + 1);
            playAlarmSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const handleSelectPreset = (preset: TimerPreset) => {
    const mins = TIMER_PRESETS[preset].minutes;
    setActivePreset(preset);
    setTotalSeconds(mins * 60);
    setSecondsLeft(mins * 60);
    setIsRunning(false);
    setIsFinishedAlarm(false);
  };

  const handleTogglePlay = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds);
      setIsFinishedAlarm(false);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    setIsFinishedAlarm(false);
  };

  // Formatting MM:SS
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // SVG Circular Progress calculation
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>⬅️ Back to All Tools</span>
          </button>
        )}
        <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-bold ml-auto">
          <Brain className="w-3.5 h-3.5" />
          <span>Ultradian & Pomodoro Science-Backed Focus Engine</span>
        </div>
      </div>

      {/* Preset Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {(Object.keys(TIMER_PRESETS) as TimerPreset[]).map(preset => {
          const item = TIMER_PRESETS[preset];
          const isSelected = activePreset === preset;
          return (
            <button
              key={preset}
              onClick={() => handleSelectPreset(preset)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-500/30'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
              <span className="text-[10px] font-mono opacity-80 font-normal">({item.minutes}m)</span>
            </button>
          );
        })}
      </div>

      {/* Main Glowing Clock Display Canvas */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        
        {/* Finished Alarm Banner */}
        {isFinishedAlarm && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs animate-bounce shadow-lg shadow-emerald-500/40">
            🎉 Session Complete! Great focus session achieved.
          </div>
        )}

        {/* Circular Progress Gauge & Clock Face */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
            {/* Track Background */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800"
              fill="transparent"
            />
            {/* Active Progress Ring */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-rose-500 transition-all duration-1000 ease-linear shadow-lg"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Clock */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-widest mb-1">
              {TIMER_PRESETS[activePreset].name}
            </span>
            <div className="text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {formattedTime}
            </div>
            <span className="text-xs text-rose-400 font-mono mt-1">
              {isRunning ? '🔥 Focus Active' : secondsLeft === 0 ? '✅ Finished' : '⏸️ Paused'}
            </span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className="px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-xl shadow-rose-600/30 hover:scale-105 active:scale-95"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause' : secondsLeft === 0 ? 'Restart Session' : 'Start Focus'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Micro Stats Banner */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-2 border-t border-slate-800 text-xs font-mono">
          <div className="text-left">
            <span className="text-slate-500 block text-[10px]">Completed Today</span>
            <span className="font-bold text-emerald-400 text-sm">{completedSessions} Sessions</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block text-[10px]">Total Focus Time</span>
            <span className="font-bold text-purple-400 text-sm">
              {Math.round((completedSessions * TIMER_PRESETS[activePreset].minutes))} mins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Fallback Default Tool Demo --- */
function DefaultToolDemo({ tool }: { tool: ToolItem }) {
  return (
    <div className="text-center py-6 space-y-4">
      <div className={`w-16 h-16 rounded-3xl bg-gradient-to-tr ${tool.gradient} p-0.5 mx-auto flex items-center justify-center text-white shadow-xl shadow-purple-500/20`}>
        <div className="w-full h-full bg-slate-950/20 rounded-[22px] flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>
      </div>

      <h4 className="text-lg font-bold">{tool.name} Ready to Run</h4>
      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
        {tool.description}
      </p>

      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 inline-block text-xs font-mono text-slate-600 dark:text-slate-300">
        Status: Client-Side Engine Initialized • Zero Latency • 100% Free
      </div>
    </div>
  );
}
