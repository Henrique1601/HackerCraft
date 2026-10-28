import { Navbar } from "@/components/Navbar";
import { TRACKS } from "@/data/tracks";
import Link from "next/link";
import { Shield, ChevronRight, CheckCircle2, Lock } from "lucide-react";

export default function TrilhasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 cyber-grid">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 flex-1">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">
            <Shield className="h-4 w-4" />
            Trilhas Profissionais de Cibersegurança
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Laboratórios de Pentest & Engenharia Ofensiva
          </h1>
          <p className="mt-3 text-slate-400 text-sm max-w-3xl font-sans">
            Selecione uma especialização abaixo para acessar as aulas e ambientes interativos. Você ganha XP e sobe no ranking global a cada flag ou vulnerabilidade explorada.
          </p>
        </div>

        <div className="space-y-6">
          {TRACKS.map((track, idx) => (
            <div
              key={track.id}
              className="p-6 rounded-2xl bg-[#0c0f18]/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-bold">
                    {track.badge}
                  </span>
                  <span className="text-slate-400">• Dificuldade: {track.difficulty}</span>
                  <span className="text-slate-400">• Total de XP: <strong className="text-emerald-400">{track.totalXp} XP</strong></span>
                </div>

                <h2 className="text-2xl font-bold text-slate-100">
                  {track.title}
                </h2>
                
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {track.description}
                </p>

                {/* Sub-modules list */}
                <div className="pt-2">
                  <div className="text-xs font-mono text-slate-300 font-semibold mb-2">Módulos Práticos Disponíveis:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-slate-400">
                    {track.modules.map((m) => (
                      <div key={m.id} className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href={`/trilhas/${track.slug}`}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <span>ENTRAR NA TRILHA</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
