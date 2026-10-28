"use client";

import { useState } from "react";
import { Challenge } from "@/data/tracks";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { WebVulnerabilitySandbox } from "@/components/WebVulnerabilitySandbox";
import { AiHackerTutor } from "@/components/AiHackerTutor";
import confetti from "canvas-confetti";
import { 
  ShieldAlert, Award, Lightbulb, CheckCircle2, ChevronRight, 
  Terminal, Bot, Flag, AlertCircle, Code, Copy, Check 
} from "lucide-react";
import Link from "next/link";

interface LabWorkspaceProps {
  challenge: Challenge;
  trackTitle: string;
}

export function LabWorkspace({ challenge, trackTitle }: LabWorkspaceProps) {
  const [flagInput, setFlagInput] = useState("");
  const [isSolved, setIsSolved] = useState(false);
  const [activeTab, setActiveTab] = useState<"workspace" | "tutor">("workspace");
  const [showHints, setShowHints] = useState(false);
  const [submittedError, setSubmittedError] = useState(false);
  const [codeContent, setCodeContent] = useState(challenge.initialCode || "");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleFlagFound = (foundFlag: string) => {
    setFlagInput(foundFlag);
    validateFlag(foundFlag);
  };

  const validateFlag = (flagToValidate: string) => {
    if (flagToValidate.trim() === challenge.flag) {
      setIsSolved(true);
      setSubmittedError(false);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    } else {
      setSubmittedError(true);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col flex-1 gap-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0c0f18] border border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/trilhas"
            className="text-xs font-mono text-slate-400 hover:text-emerald-400 transition"
          >
            Trilhas
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <span className="text-xs font-mono text-slate-400 truncate max-w-xs">{trackTitle}</span>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <span className="text-xs font-mono text-emerald-400 font-bold">{challenge.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
            <Award className="h-3.5 w-3.5 text-emerald-400" />
            <span>+{challenge.xp} XP</span>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === "workspace" ? "tutor" : "workspace")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-semibold transition ${
              activeTab === "tutor"
                ? "bg-purple-600 text-white"
                : "bg-purple-950/60 border border-purple-500/50 text-purple-300 hover:bg-purple-900/50"
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>AI Hacker Tutor</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Panel (Briefing & Submissão) | Right Panel (Terminal / Sandbox / Tutor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Column: Mission Briefing, Hints & Flag Submission */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Mission Briefing Card */}
          <div className="p-6 rounded-2xl bg-[#0c0f18]/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
                {challenge.category} • {challenge.difficulty}
              </span>
              {isSolved && (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/40">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  CONCLUÍDO
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-100">
              {challenge.title}
            </h1>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-sans text-slate-300 space-y-1">
              <div className="font-bold text-slate-100 font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                🎯 Objetivo da Operação:
              </div>
              <p className="leading-relaxed">{challenge.objective}</p>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {challenge.description}
            </p>

            {/* Hints Accordion */}
            <div className="pt-2">
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-2 text-xs font-mono text-amber-400 hover:text-amber-300 font-semibold"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span>{showHints ? "Ocultar Pistas Heurísticas" : "Precisa de ajuda? Revelar Dicas"}</span>
              </button>

              {showHints && (
                <div className="mt-3 p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-2 text-xs text-amber-200/90 font-sans">
                  {challenge.hints.map((hint, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-mono font-bold">#{i + 1}:</span>
                      <span>{hint}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Flag Submission Card */}
          <div className="p-6 rounded-2xl bg-[#0c0f18]/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold font-mono text-slate-200">
              <Flag className="h-4 w-4 text-emerald-400" />
              <span>Submeter Flag do Laboratório</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                validateFlag(flagInput);
              }}
              className="space-y-3"
            >
              <div className="relative">
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="ex: FLAG{sua_flag_aqui}"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-emerald-400 font-mono text-sm outline-none placeholder:text-slate-600"
                />
              </div>

              {submittedError && (
                <div className="flex items-center gap-2 text-xs text-rose-400 font-sans">
                  <AlertCircle className="h-4 w-4" />
                  <span>Flag incorreta. Revise o payload ou peça auxílio ao AI Hacker Tutor.</span>
                </div>
              )}

              {isSolved ? (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-mono text-xs font-bold">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>DESAFIO PWNED! +{challenge.xp} XP REGISTRADOS!</span>
                  </div>
                  <Link
                    href="/trilhas"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-mono font-bold text-xs"
                  >
                    Próximo Lab →
                  </Link>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  VALIDAR FLAG & REIVINDICAR XP
                </button>
              )}
            </form>
          </div>

        </div>

        {/* Right Column: Interactive Workspace (Terminal / Web Vulnerability / Code Sandbox / AI Tutor) */}
        <div className="lg:col-span-7 flex flex-col min-h-[500px]">
          {activeTab === "tutor" ? (
            <AiHackerTutor
              challengeTitle={challenge.title}
              challengeCategory={challenge.category}
              currentCode={codeContent}
            />
          ) : (
            <div className="flex-1 flex flex-col">
              {challenge.interactiveType === "terminal" && (
                <InteractiveTerminal
                  onFlagFound={handleFlagFound}
                  expectedFlag={challenge.flag}
                />
              )}

              {challenge.interactiveType === "web_vulnerability" && (
                <WebVulnerabilitySandbox
                  onFlagFound={handleFlagFound}
                  expectedFlag={challenge.flag}
                />
              )}

              {challenge.interactiveType === "code_editor" && (
                <div className="flex flex-col h-full rounded-xl border border-slate-800 bg-[#090b10] overflow-hidden shadow-2xl font-mono text-xs">
                  {/* Editor Bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e121a] border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-emerald-400" />
                      <span className="font-semibold text-slate-200">
                        {challenge.language?.toUpperCase() || "SCRIPT"} EXPLOIT RUNNER & SANDBOX
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition"
                      >
                        {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedCode ? "Copiado" : "Copiar"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-4 bg-[#0a0c12]">
                    <textarea
                      value={codeContent}
                      onChange={(e) => setCodeContent(e.target.value)}
                      className="w-full h-full min-h-[380px] bg-transparent text-emerald-400 font-mono text-xs leading-relaxed outline-none resize-none"
                      spellCheck={false}
                    />
                  </div>

                  <div className="p-3 bg-[#0d0f17] border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-sans">
                      Dica: Você pode testar este script ofensivo diretamente no seu ambiente Linux local ou pedir validação da sintaxe ao AI Tutor.
                    </span>
                    <button
                      onClick={() => handleFlagFound(challenge.flag)}
                      className="px-3.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    >
                      Simular Execução PoC
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
