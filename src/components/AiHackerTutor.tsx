"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, Loader2, Lightbulb, Terminal, AlertCircle } from "lucide-react";

interface AiHackerTutorProps {
  challengeTitle?: string;
  challengeCategory?: string;
  currentCode?: string;
}

export function AiHackerTutor({
  challengeTitle = "Exploração Prática",
  challengeCategory = "Cybersegurança",
  currentCode = ""
}: AiHackerTutorProps) {
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user"; text: string }>>([
    {
      role: "assistant",
      text: `Olá, operador! Sou o HackerCraft AI Tutor. Estou aqui para guiar sua análise de vulnerabilidades, scripts ofensivos e engenharia reversa sem estragar a diversão de descobrir a flag por conta própria.\n\nQual é a sua dúvida ou hipótese atual no desafio?`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          challengeTitle,
          challengeCategory,
          currentCode,
        })
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "Nenhuma resposta obtida." }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Erro ao comunicar com a rede neural do tutor. Verifique sua conexão." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const askQuickHint = () => {
    setInput("Pode me dar uma pista metodológica de como investigar esse vetor de ataque sem entregar a resposta?");
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-purple-950/80 bg-[#0a0812] overflow-hidden shadow-2xl font-mono text-xs">
      {/* Tutor Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#120e20] border-b border-purple-950/60">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-950 border border-purple-500/50 text-purple-400">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-200">AI HACKER TUTOR</span>
            <span className="text-[10px] text-purple-400 font-sans">Powered by Google Gemini</span>
          </div>
        </div>

        <button
          onClick={askQuickHint}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-950/60 border border-purple-500/40 text-[11px] text-purple-300 hover:bg-purple-900/40 transition"
        >
          <Lightbulb className="h-3 w-3 text-amber-400" />
          <span>Pedir Pista Rápida</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[300px] max-h-[460px]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-lg leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-purple-950/70 border border-purple-500/50 text-purple-100"
                  : "bg-[#141026] border border-slate-800 text-slate-300 font-sans"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-purple-400 p-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">O Tutor está analisando os vetores de ataque...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 p-3 bg-[#0d0a17] border-t border-purple-950/60"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre a vulnerabilidade, script ou erro..."
          className="flex-1 bg-slate-950 border border-purple-950 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-600 outline-none focus:border-purple-500 text-xs font-sans"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition shadow-[0_0_12px_rgba(168,85,247,0.4)]"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
