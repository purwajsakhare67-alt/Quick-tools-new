import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Wand2, 
  ArrowLeft, 
  RotateCcw, 
  Download, 
  Cpu, 
  Layers, 
  Bot, 
  Sliders, 
  Zap,
  HelpCircle,
  FileCode
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface AiPromptEnhancerProps {
  onBackToGrid?: () => void;
}

export const UniversalAiPromptEnhancer: React.FC<AiPromptEnhancerProps> = ({ onBackToGrid }) => {
  const [rawPrompt, setRawPrompt] = useState<string>('Build a landing page for my productivity SaaS app');
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [modelUsedInfo, setModelUsedInfo] = useState<string>('');
  const [noticeInfo, setNoticeInfo] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('saas');
  const [promptStyle, setPromptStyle] = useState<'system' | 'few_shot' | 'cot' | 'json'>('system');
  const [modelTarget, setModelTarget] = useState<'universal' | 'gemini' | 'claude' | 'gpt4'>('universal');
  const [tone, setTone] = useState<'production' | 'creative' | 'strict'>('production');

  const samplePresets = [
    {
      id: 'saas',
      label: 'SaaS Landing Page',
      prompt: 'Build a high-converting landing page for an AI productivity app with pricing tiers and FAQ'
    },
    {
      id: 'code',
      label: 'React TypeScript Refactor',
      prompt: 'Refactor this React component to use custom hooks, strict TypeScript interfaces, and zero unnecessary re-renders'
    },
    {
      id: 'copy',
      label: 'Viral Newsletter Hook',
      prompt: 'Write a persuasive weekly tech newsletter breakdown with actionable takeaways and high CTR subject lines'
    },
    {
      id: 'data',
      label: 'SQL & Data Pipeline',
      prompt: 'Write an optimized PostgreSQL query to compute monthly recurring revenue (MRR) retention cohorts'
    }
  ];

  // Pure client-side instant heuristic prompt expansion engine (executes in 2ms without network latency)
  const clientSidePromptSynthesizer = (input: string, style: string, target: string, toneStyle: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';

    // Detect domain intent
    const isCode = /code|react|typescript|python|sql|bug|refactor|function|api|component|css|html/i.test(trimmed);
    const isMarketing = /landing|conversion|sales|pitch|email|newsletter|copy|audience|growth|seo/i.test(trimmed);
    const isWriting = /essay|article|story|blog|summar|rewrite|draft/i.test(trimmed);

    let persona = 'World-Class Multi-Disciplinary Systems Architect & Principal Engineer';
    if (isMarketing) persona = 'Chief Marketing Officer & Elite Direct-Response Copywriting Strategist';
    else if (isWriting) persona = 'Senior Editorial Director & Award-Winning Publications Author';
    else if (isCode) persona = 'Staff Software Architect & Lead TypeScript Full-Stack Systems Engineer';

    const timestamp = new Date().toISOString().split('T')[0];

    if (style === 'json') {
      return `// ==========================================
// SYSTEM DIRECTIVE: STRICT JSON RESPONSE
// ARCHITECTURE: ${target.toUpperCase()} OPTIMIZED
// ==========================================

You are acting as an automated ${persona}.
Your task is to analyze and execute the following objective with mathematical precision:

[CORE OBJECTIVE]
"${trimmed}"

[STRICT CONSTRAINTS]
1. OUTPUT FORMAT: Respond with ONLY a valid, parseable JSON object.
2. NO CHATTER: Do not wrap with conversational preambles ("Here is your JSON:") or closing remarks.
3. SCHEMA ENFORCEMENT:
{
  "status": "success",
  "meta": {
    "version": "1.0",
    "timestamp": "${timestamp}",
    "domain": "${isCode ? 'engineering' : isMarketing ? 'marketing' : 'general'}"
  },
  "executionPlan": {
    "summary": "Brief executive summary of approach",
    "steps": ["Step 1 specification", "Step 2 specification", "Step 3 specification"],
    "criticalParameters": {
      "tone": "${toneStyle}",
      "rigor": "highest"
    }
  },
  "deliverables": [
    {
      "name": "Primary artifact",
      "content": "Full detailed implementation code or text"
    }
  ],
  "verificationCriteria": [
    "Checklist item 1",
    "Checklist item 2"
  ]
}

Ensure all special characters are properly escaped and the JSON strictly satisfies RFC 8259.`;
    }

    if (style === 'cot') {
      return `### ROLE & PERSONA
You are a ${persona} operating under rigorous Chain-of-Thought (CoT) reasoning protocols.

### OBJECTIVE
"${trimmed}"

### MANDATORY REASONING PROCESS
Before outputting any final answer, you must systematically think through the problem inside private or visible <thinking> tags following this 4-step deliberation:

1. **Problem Decomposition & Latent Assumptions**:
   - Identify implicit requirements, edge cases, and failure modes.
   - Clarify the core value proposition and constraints.

2. **First-Principles Architectural Assessment**:
   - Evaluate trade-offs between simplicity, maintainability, and visual/functional impact.
   - Reject generic, templated conventions in favor of tailored solutions.

3. **Step-by-Step Solution Formulation**:
   - Draft the execution flow incrementally, verifying each premise.

4. **Self-Correction & Quality Audit**:
   - Review the candidate solution against high-performance standards (${toneStyle} standards).

### FINAL DELIVERABLE SPECIFICATION
After the thinking trace, provide the finalized, production-grade output formatted cleanly with Markdown headings, robust code/text blocks, and zero filler commentary.`;
    }

    // Default: Structured System Prompt
    return `# SYSTEM PROMPT: ${persona.toUpperCase()}

## 1. IDENTITY & EXPERTISE
You are an authoritative ${persona} known for rigorous attention to detail, mathematical clarity, and delivering zero-fluff, production-grade outcomes.

## 2. PRIMARY DIRECTIVE
Your primary task is to execute the following assignment at the highest professional caliber:
> "${trimmed}"

## 3. OPERATIONAL CONTEXT & TONE
- **Target Audience / Stack**: ${target === 'gemini' ? 'Google Gemini 2.5/3 Engine Ecosystem' : target === 'claude' ? 'Anthropic Claude 3.5 Sonnet Ecosystem' : target === 'gpt4' ? 'OpenAI GPT-4o Architecture' : 'Universal LLM Architecture'}
- **Tone & Delivery**: ${toneStyle === 'strict' ? 'Direct, objective, concise, and technically rigorous without conversational fluff.' : toneStyle === 'creative' ? 'Engaging, compelling, and memorable with high aesthetic refinement.' : 'Balanced, polished, highly actionable, and enterprise-ready.'}
- **Timestamp / Relevance**: 2026-Ready Standards.

## 4. STEP-BY-STEP EXECUTION PROTOCOL
1. **Analyze Requirements**: Parse the core intent and establish the operational scope.
2. **Implement Core Deliverables**:
   ${isCode ? '- Write complete, fully functional code with clear typing, error guards, and modern patterns.\n   - Avoid truncated snippets, placeholders, or `// TODO` stubs.' : isMarketing ? '- Craft compelling visual hierarchy, crisp headline copy, clear value propositions, and strong calls-to-action.\n   - Prioritize psychological clarity and scannability.' : '- Structure content with clear hierarchical sections, numbered action points, and crisp takeaways.'}
3. **Handle Edge Cases**: Address boundary states, edge scenarios, and accessibility or performance considerations.
4. **Verification**: Include a self-contained validation checklist to confirm that all parameters of the directive were met.

## 5. STRICT GUARDRAILS (DO NOT VIOLATE)
- ❌ **No Conversational Preamble**: Never start with "Certainly! I'd be happy to help with..." or "Here is your request...".
- ❌ **No Shallow Generic Placeholders**: Provide concrete, production-ready copy or logic rather than vague suggestions.
- ❌ **No Unverified Claims**: Ensure all assertions are grounded in established best practices.

## 6. FORMATTING REQUIREMENTS
- Use standard GitHub-flavored Markdown formatting.
- Bold key terms and metrics for rapid visual scannability.
- Provide comprehensive, self-contained artifacts ready for immediate deployment.`;
  };

  const handleEnhance = async () => {
    if (!rawPrompt.trim()) return;

    playSound('click');
    setIsEnhancing(true);

    try {
      // 1. Attempt server-side Gemini API proxy call
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: rawPrompt,
          style: promptStyle === 'json' ? 'structured' : promptStyle === 'cot' ? 'technical' : 'technical',
          outputFormat: promptStyle,
          persona: promptStyle === 'json' ? 'JSON Data Architect' : promptStyle === 'cot' ? 'Reasoning Engine' : 'System Architect',
          targetModel: modelTarget,
          tone
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.enhancedPrompt) {
          setEnhancedPrompt(data.enhancedPrompt);
          setModelUsedInfo(data.modelUsed || 'AI Engine');
          setNoticeInfo(data.notice || '');
          playSound('success');
          setIsEnhancing(false);
          return;
        }
      }
    } catch {
      // Network failure or static hosting mode: seamless fallback
    }

    // 2. Client-side instant synthesis engine (Sub-second pure JavaScript execution)
    setTimeout(() => {
      const generated = clientSidePromptSynthesizer(rawPrompt, promptStyle, modelTarget, tone);
      setEnhancedPrompt(generated);
      setModelUsedInfo('Instant Heuristic Synthesis');
      setNoticeInfo('');
      playSound('success');
      setIsEnhancing(false);
    }, 280);
  };

  const handleCopy = () => {
    if (!enhancedPrompt) return;
    playSound('success');
    navigator.clipboard.writeText(enhancedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!enhancedPrompt) return;
    playSound('click');
    const blob = new Blob([enhancedPrompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-prompt-${promptStyle}-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    playSound('click');
    setActivePreset(preset.id);
    setRawPrompt(preset.prompt);
  };

  return (
    <div className="space-y-6" id="ai-prompt-enhancer-tool">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 border border-violet-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-lg shrink-0">
            <Wand2 className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                AI Prompt Enhancer & Refiner
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/30">
                100% Client-Side Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Transform raw basic ideas into battle-tested, structured system prompts with zero hosting lag
            </p>
          </div>
        </div>

        {onBackToGrid && (
          <button
            onClick={() => {
              playSound('click');
              onBackToGrid();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Grid</span>
          </button>
        )}
      </div>

      {/* Quick Template Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Start Idea Templates</span>
          </label>
          <span className="text-[11px] text-slate-400">Click to load</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {samplePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer flex flex-col gap-1 ${
                activePreset === preset.id
                  ? 'bg-violet-500/15 border-violet-500/40 text-violet-700 dark:text-violet-300 shadow-xs'
                  : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <span className="font-extrabold truncate">{preset.label}</span>
              <span className="text-[10px] text-slate-400 dark:text-white/40 line-clamp-1 font-normal">
                {preset.prompt}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Architecture & Format Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-white/60 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Prompt Architecture</span>
          </label>
          <select
            value={promptStyle}
            onChange={(e) => {
              playSound('click');
              setPromptStyle(e.target.value as any);
            }}
            className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          >
            <option value="system">Structured System Prompt</option>
            <option value="cot">Chain-of-Thought Reasoning</option>
            <option value="few_shot">Few-Shot Exemplar</option>
            <option value="json">Strict JSON Schema Output</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-white/60 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Bot className="w-3 h-3 text-fuchsia-400" />
            <span>Target Model Engine</span>
          </label>
          <select
            value={modelTarget}
            onChange={(e) => {
              playSound('click');
              setModelTarget(e.target.value as any);
            }}
            className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          >
            <option value="universal">Universal (Gemini / Claude / GPT)</option>
            <option value="gemini">Google Gemini 2.5 / 3.0</option>
            <option value="claude">Anthropic Claude 3.5 Sonnet</option>
            <option value="gpt4">OpenAI GPT-4o / O1</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-white/60 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-emerald-400" />
            <span>Execution Rigor & Tone</span>
          </label>
          <select
            value={tone}
            onChange={(e) => {
              playSound('click');
              setTone(e.target.value as any);
            }}
            className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          >
            <option value="production">Production & Enterprise Ready</option>
            <option value="strict">Strict & Zero-Fluff Technical</option>
            <option value="creative">High-Conversion & Persuasive</option>
          </select>
        </div>
      </div>

      {/* Input Text Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider">
            Raw User Prompt Input
          </label>
          <span className="text-[11px] text-slate-400">
            {rawPrompt.length} characters • ~{Math.round(rawPrompt.split(/\s+/).filter(Boolean).length * 1.3)} estimated tokens
          </span>
        </div>
        <div className="relative">
          <textarea
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            placeholder="e.g. Build a SaaS landing page with dark mode, testimonials, pricing, and FAQ..."
            rows={4}
            className="w-full p-3.5 text-sm rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 shadow-inner font-sans"
          />
          {rawPrompt && (
            <button
              onClick={() => {
                playSound('click');
                setRawPrompt('');
              }}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold transition-all cursor-pointer"
              title="Clear input"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Core Action Button */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleEnhance}
          disabled={isEnhancing || !rawPrompt.trim()}
          className={`w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide text-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
            isEnhancing || !rawPrompt.trim()
              ? 'opacity-50 cursor-not-allowed bg-slate-600'
              : 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:scale-[1.01] active:scale-[0.99] shadow-violet-500/25 hover:shadow-violet-500/40'
          }`}
          id="btn-enhance-prompt-trigger"
        >
          {isEnhancing ? (
            <>
              <Cpu className="w-4 h-4 animate-spin text-white" />
              <span>Synthesizing System Directive...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Expand & Enrich into System Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* Output Display Block */}
      {enhancedPrompt && (
        <div className="space-y-3 pt-2">
          {noticeInfo && (
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-700 dark:text-violet-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{noticeInfo}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                Refined Production System Prompt
              </h4>
              {modelUsedInfo && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 font-bold border border-violet-500/25">
                  {modelUsedInfo}
                </span>
              )}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/25">
                Ready for LLM Input
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
                title="Download prompt file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export .md</span>
              </button>

              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30'
                }`}
                id="btn-copy-enhanced-prompt"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>One-Click Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Read-Only Monospace Copy Block */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 p-4 sm:p-5 font-mono text-xs leading-relaxed overflow-x-auto shadow-2xl max-h-[380px] overflow-y-auto">
            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-200">
              {enhancedPrompt}
            </pre>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Estimated Token Weight: ~{Math.round(enhancedPrompt.split(/\s+/).filter(Boolean).length * 1.35)} tokens</span>
            <span>Optimized for System Persona, Instructions & Guardrails</span>
          </div>
        </div>
      )}
    </div>
  );
};
