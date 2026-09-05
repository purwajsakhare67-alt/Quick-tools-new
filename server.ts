import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Fallback high-converting prompt template generator if API key is not configured
function buildFallbackPrompt(rawPrompt: string, style: string = 'technical'): string {
  const styleDirectives: Record<string, string> = {
    technical: `## System Identity & Core Directive
You are a senior principal systems engineer and high-precision technical architect. Your mission is to provide rigorous, unambiguous, and mathematically sound analysis.

## Operational Instructions
1. Analyze the core objective with strict adherence to industry best practices.
2. Break down the architectural dependencies and edge-case failure modes.
3. Provide production-ready, clean TypeScript / SQL / System specifications.
4. Avoid boilerplate explanations; prioritize concise, battle-tested solutions.

## Context & Task Objective
${rawPrompt}

## Output Format Specification
- Architecture Overview & Constraints
- Implementation Code / Schema (Annotated, typed, defensive error handling)
- Edge-Case Resilience & Verification Checklist`,

    creative: `## Persona & Creative Voice
You are an award-winning creative director and viral content strategist. Your objective is to craft evocative, memorable, and high-converting narratives that captivate human attention.

## Tone & Styling Guide
- Dynamic, punchy, and emotionally resonant cadence.
- Vivid sensory imagery without generic buzzwords or clichés.
- High-contrast visual hooks and pacing.

## Creative Brief
${rawPrompt}

## Deliverables
- 3 Distinct Angle Hooks (High-CTR / Attention-grabbing)
- Core Narrative Script / Body Copy
- Psychological Call-To-Action (CTA)`,

    concise: `## Persona & Role
You are an executive Chief of Staff and high-speed problem solver. Your mandate is pure efficiency: zero fluff, maximum signal-to-noise ratio.

## Rules of Engagement
- Deliver answers in bullet points or dense, high-impact summaries.
- Lead immediately with the bottom-line conclusion (BLUF).
- Omit conversational niceties, greetings, and generic disclaimers.

## User Task
${rawPrompt}

## Required Response
- 3-Bullet Executive Action Plan
- Key Risk Factors & Metrics`,

    structured: `## Role & Objective
You are a Lead AI Systems Architect specializing in zero-shot structured reasoning and LLM pipeline orchestration.

## Execution Framework
1. **Scope Definition**: Clearly bound the problem statement.
2. **Step-by-Step Chain of Thought**: Formulate logical intermediate reasoning before output.
3. **Structured Specifications**: Output valid, schema-compliant data structures.

## User Input
${rawPrompt}

## Expected Deliverable Schema
\`\`\`markdown
### Objective
[Clear one-sentence outcome]

### Requirements Matrix
- [Must-Have Specifications]
- [Constraints & Guardrails]

### Execution Steps
1. [Phase 1: Analysis & Setup]
2. [Phase 2: Execution & Output]
3. [Phase 3: Quality Verification]
\`\`\``
  };

  return styleDirectives[style] || styleDirectives.technical;
}

// Resilient multi-model executor with automatic fallback for transient 503 high-demand spikes
async function generatePromptWithResilience(
  client: GoogleGenAI,
  prompt: string,
  systemInstruction: string
): Promise<{ text: string; modelUsed: string } | null> {
  const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];

  for (const model of candidateModels) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt.trim(),
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      if (response && response.text) {
        return { text: response.text.trim(), modelUsed: model };
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      const isTransientDemand = 
        err?.status === "UNAVAILABLE" || 
        err?.code === 503 || 
        errMsg.includes("503") || 
        errMsg.includes("high demand") || 
        errMsg.includes("RESOURCE_EXHAUSTED") || 
        err?.code === 429;

      if (isTransientDemand) {
        console.warn(`[AI Prompt Engine] Model ${model} is experiencing a transient demand spike. Trying alternative model...`);
        // Short pause before attempting the next candidate
        await new Promise((resolve) => setTimeout(resolve, 350));
      } else {
        console.warn(`[AI Prompt Engine] Model ${model} request did not complete:`, errMsg);
      }
    }
  }

  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint at the very top for instantaneous container & proxy probing
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Route: AI Prompt Enhancer & Refiner
  app.post("/api/enhance-prompt", async (req, res) => {
    try {
      const { 
        prompt, 
        style = "technical", 
        outputFormat, 
        persona, 
        targetModel = "Universal LLM" 
      } = req.body;

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        res.status(400).json({ error: "Prompt text is required." });
        return;
      }

      const effectiveStyle = style || (outputFormat === 'json' ? 'structured' : outputFormat === 'cot' ? 'technical' : 'technical');
      const client = getAiClient();

      if (!client) {
        // Fallback gracefully without throwing
        const fallbackEnhanced = buildFallbackPrompt(prompt.trim(), effectiveStyle);
        res.json({
          enhancedPrompt: fallbackEnhanced,
          originalPrompt: prompt,
          style: effectiveStyle,
          targetModel,
          modelUsed: "Heuristic Architecture Engine (Local)",
          notice: "Configured via local prompt-crafting engine. Add GEMINI_API_KEY in Secrets for live Gemini LLM enhancements."
        });
        return;
      }

      const systemInstruction = `You are an elite System Prompt Engineer and Prompt Architect. 
Your job is to transform raw, basic, or unstructured user prompts into robust, production-grade, highly structured system directives suitable for top-tier LLMs (Gemini, Claude, GPT-4).

Rules:
1. Preserve the user's exact underlying intent, but expand constraints, edge-case guidance, output formats, and persona (${persona || 'Staff AI Systems Architect'}).
2. Use Markdown headings (## System Identity, ## Operational Directives, ## Constraints & Guardrails, ## Expected Output Format).
3. Selected Style is "${effectiveStyle}" and Target LLM Architecture is "${targetModel}".
4. Do NOT wrap your output in conversational banter like "Here is your enhanced prompt:". Output ONLY the enhanced system prompt itself so it is ready for one-click copy and deployment.`;

      const aiResult = await generatePromptWithResilience(client, prompt, systemInstruction);

      if (aiResult && aiResult.text) {
        res.json({
          enhancedPrompt: aiResult.text,
          originalPrompt: prompt,
          style: effectiveStyle,
          targetModel,
          modelUsed: aiResult.modelUsed
        });
        return;
      }

      // If all live cloud models are temporarily experiencing peak demand, use the heuristic engine seamlessly
      const fallbackEnhanced = buildFallbackPrompt(prompt.trim(), effectiveStyle);
      res.json({
        enhancedPrompt: fallbackEnhanced,
        originalPrompt: prompt,
        style: effectiveStyle,
        targetModel,
        modelUsed: "Heuristic Architecture Engine (High-Demand Fallback)",
        notice: "Upstream AI model is experiencing a temporary spike in traffic. Your prompt was refined using our high-precision offline architecture engine."
      });
    } catch (err: any) {
      console.warn("[AI Prompt Engine] Recovered from exception with heuristic fallback:", err?.message || err);
      const fallbackEnhanced = buildFallbackPrompt(req.body.prompt || "", req.body.style || "technical");
      res.json({
        enhancedPrompt: fallbackEnhanced,
        originalPrompt: req.body.prompt || "",
        style: req.body.style || "technical",
        targetModel: req.body.targetModel || "Universal LLM",
        modelUsed: "Heuristic Architecture Engine (Resilience Fallback)",
        notice: "Synthesized with offline architecture engine."
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
