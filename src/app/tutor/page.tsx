import { Navbar } from "@/components/Navbar";
import { AiHackerTutor } from "@/components/AiHackerTutor";
import { Bot, Sparkles, Shield, Terminal, Zap } from "lucide-react";

export default function TutorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 cyber-grid">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex-1 flex flex-col">
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
            <Bot className="h-4 w-4" />
            Cyber Threat Intelligence & Mentoria
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">
            AI Hacker Tutor (Terminal Copilot)
          </h1>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Converse diretamente com o agente de inteligência artificial especializado em Pentest, técnicas de fóruns underground éticos, análise de binários e segurança defensiva.
          </p>
        </div>

        <div className="flex-1 min-h-[550px]">
          <AiHackerTutor
            challengeTitle="Consultoria Geral de Pentest & Malware Dev"
            challengeCategory="Hacking Ético"
          />
        </div>
      </main>
    </div>
  );
}
