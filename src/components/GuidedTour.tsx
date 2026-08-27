import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2, 
  Sliders, 
  BarChart3, 
  Copy, 
  ShieldCheck, 
  HelpCircle,
  Lightbulb,
  Zap
} from 'lucide-react';
import { ToolItem } from '../types';

export interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  targetSelector?: string;
  badge?: string;
  tip?: string;
}

interface GuidedTourProps {
  tool: ToolItem;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  tool,
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Generate contextual steps based on tool category and properties
  const getTourSteps = useCallback((): TourStep[] => {
    const isFinancial = tool.category === 'financial';
    const isTech = tool.category === 'tech';

    if (isFinancial) {
      return [
        {
          title: `Welcome to ${tool.name}`,
          description: `This interactive financial engine helps you calculate and project ${tool.tagline.toLowerCase()} with mathematical precision.`,
          icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
          badge: 'Step 1: Introduction',
          tip: 'Calculations adapt instantly as you manipulate values.'
        },
        {
          title: 'Interactive Sliders & Numeric Inputs',
          description: 'Adjust your principal amounts, expected annual returns, tenure, and contribution frequencies with responsive drag sliders or direct number inputs.',
          icon: <Sliders className="w-5 h-5 text-purple-400" />,
          targetSelector: '[data-tour="inputs"], input[type="range"], input[type="number"]',
          badge: 'Step 2: Controls',
          tip: 'You can tap on numeric inputs or drag sliders for quick changes.'
        },
        {
          title: 'Real-time Visual Analytics & Charts',
          description: 'Watch the dynamic breakdown graphs and metrics recalculate instantly on every keystroke, showing total interest, maturity sums, and distribution.',
          icon: <BarChart3 className="w-5 h-5 text-pink-400" />,
          targetSelector: '[data-tour="results"], canvas, .chartjs-render-monitor',
          badge: 'Step 3: Analytics',
          tip: 'Hover over chart points to see year-by-year milestones.'
        },
        {
          title: '100% Client-Side Privacy Guarantee',
          description: 'Your financial computations execute purely inside your browser memory. No salaries, loan values, or investment numbers are ever uploaded to any server.',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          targetSelector: '[data-tour="privacy"]',
          badge: 'Step 4: Privacy',
          tip: 'Completely private and offline-compatible.'
        }
      ];
    } else if (isTech) {
      return [
        {
          title: `Exploring ${tool.name}`,
          description: `A powerful browser utility designed for ${tool.tagline.toLowerCase()} without complex dependencies or remote APIs.`,
          icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
          badge: 'Step 1: Introduction',
          tip: 'Built for developers, designers, and web creators.'
        },
        {
          title: 'Input & Configuration Workspace',
          description: 'Paste your raw text, source code, regular expression, or upload your media file directly into the input workspace.',
          icon: <Sliders className="w-5 h-5 text-purple-400" />,
          targetSelector: '[data-tour="inputs"], textarea, input[type="text"]',
          badge: 'Step 2: Input',
          tip: 'Drag-and-drop file upload is supported where applicable.'
        },
        {
          title: 'Instant Live Engine & Visual Preview',
          description: 'Outputs, syntax analysis, formatted previews, and clean conversions render continuously in real time.',
          icon: <Zap className="w-5 h-5 text-amber-400" />,
          targetSelector: '[data-tour="results"], pre, code',
          badge: 'Step 3: Execution',
          tip: 'Zero build step or wait time required.'
        },
        {
          title: 'One-Click Copy & Asset Export',
          description: 'Copy compiled outputs directly to your clipboard or download optimized production files ready for deployment.',
          icon: <Copy className="w-5 h-5 text-cyan-400" />,
          targetSelector: '[data-tour="actions"], button',
          badge: 'Step 4: Output',
          tip: 'Click copy or export to take your results anywhere.'
        }
      ];
    } else {
      return [
        {
          title: `Welcome to ${tool.name}`,
          description: `Your dedicated micro-tool for ${tool.tagline.toLowerCase()}. Enjoy seamless performance without signups or paywalls.`,
          icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
          badge: 'Step 1: Introduction',
          tip: 'Instant utility at your fingertips.'
        },
        {
          title: 'Customize Your Parameters',
          description: 'Configure targets, values, dates, or options using the intuitive controls designed for fast daily workflows.',
          icon: <Sliders className="w-5 h-5 text-purple-400" />,
          targetSelector: '[data-tour="inputs"], input, select',
          badge: 'Step 2: Configure',
          tip: 'Everything updates dynamically.'
        },
        {
          title: 'Live Real-Time Feedback',
          description: 'Get immediate computed statistics, timers, formatted outputs, and visual badges as you interact.',
          icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
          targetSelector: '[data-tour="results"]',
          badge: 'Step 3: Live Output',
          tip: 'Instant results calculated in milliseconds.'
        },
        {
          title: 'Zero Logins & Safe Local Storage',
          description: 'All your activities remain secure on your device. You can access this tool anytime from mobile, tablet, or desktop.',
          icon: <ShieldCheck className="w-5 h-5 text-pink-400" />,
          badge: 'Step 4: Security',
          tip: 'Bookmark or export for offline use.'
        }
      ];
    }
  }, [tool]);

  const steps = getTourSteps();
  const currentStep = steps[currentStepIndex];

  // Update target element bounding rect if available
  useEffect(() => {
    if (!isOpen || !currentStep.targetSelector) {
      setTargetRect(null);
      return;
    }

    const timer = setTimeout(() => {
      try {
        const el = document.querySelector(currentStep.targetSelector!);
        if (el) {
          const rect = el.getBoundingClientRect();
          setTargetRect(rect);
          // Scroll element into view gently if outside visible area
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          setTargetRect(null);
        }
      } catch (e) {
        setTargetRect(null);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, currentStepIndex, currentStep.targetSelector]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStepIndex > 0) {
          setCurrentStepIndex(prev => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, steps.length, onClose, onComplete]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-60 pointer-events-auto flex items-end sm:items-center justify-center p-3 sm:p-6"
        id="interactive-guided-tour-overlay"
      >
        {/* Dimming Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Highlight Spotlight if target rect exists */}
        {targetRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed z-60 pointer-events-none rounded-2xl border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] bg-cyan-400/5 ring-4 ring-purple-500/30"
          />
        )}

        {/* Guided Tour Tooltip Card */}
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          className="relative z-70 w-full max-w-lg rounded-3xl bg-white/95 dark:bg-[#0d1024]/95 border border-slate-300 dark:border-white/20 shadow-2xl backdrop-blur-2xl p-5 sm:p-7 text-slate-900 dark:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header & Step progress */}
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-0.5 flex items-center justify-center text-white shadow-md">
                <div className="w-full h-full bg-slate-950/20 rounded-[10px] flex items-center justify-center">
                  {currentStep.icon}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                  {currentStep.badge || `Step ${currentStepIndex + 1} of ${steps.length}`}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-white/50">
                  Interactive Quick Tour
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Skip Tour (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Step Body */}
          <div className="mb-6">
            <h4 className="text-lg sm:text-xl font-black tracking-tight mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
              {currentStep.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed">
              {currentStep.description}
            </p>

            {/* Helpful Quick Tip Box */}
            {currentStep.tip && (
              <div className="mt-3.5 flex items-start gap-2.5 p-3 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/10 border border-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-xs">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-cyan-500" />
                <span className="leading-snug font-medium">{currentStep.tip}</span>
              </div>
            )}
          </div>

          {/* Step Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 mb-5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentStepIndex 
                    ? 'w-7 bg-gradient-to-r from-cyan-400 to-purple-500' 
                    : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer px-2 py-1"
            >
              Skip Tour
            </button>

            <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-cyan-500/30 transition-all cursor-pointer"
              >
                <span>{currentStepIndex === steps.length - 1 ? 'Got it, Let\'s Start! 🚀' : 'Next Step'}</span>
                {currentStepIndex === steps.length - 1 ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
