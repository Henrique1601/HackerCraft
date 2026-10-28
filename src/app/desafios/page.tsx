import { Navbar } from "@/components/Navbar";
import { TRACKS } from "@/data/tracks";
import Link from "next/link";
import { Zap, Play, Award, Filter } from "lucide-react";

export default function DesafiosPage() {
  const allChallenges = TRACKS.flatMap((t) =>
    t.modules.flatMap((m) =>
      m.challenges.map((c) => ({
        ...c,
        trackTitle: t.title,
        trackBadge: t.badge
      }))
    )
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 cyber-grid">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 flex-1">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
            <Zap className="h-4 w-4" />
            Capture The Flag & Missões Avulsas
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            Laboratórios & Desafios CTF
          </h1>
          <p className="mt-2 text-slate-400 text-sm font-sans">
            Escolha qualquer desafio prático para testar seus conhecimentos e capturar a flag no terminal ou sandbox web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allChallenges.map((chal) => (
            <div
              key={chal.id}
              className="p-5 rounded-xl bg-[#0c0f18]/90 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
                    {chal.category}
                  </span>
                  <span className="text-emerald-400 font-bold">+{chal.xp} XP</span>
                </div>

                <h3 className="text-lg font-bold text-slate-100">{chal.title}</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                  {chal.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">{chal.trackBadge}</span>
                <Link
                  href={`/lab/${chal.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                >
                  <Play className="h-3 w-3" />
                  Iniciar Desafio
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
