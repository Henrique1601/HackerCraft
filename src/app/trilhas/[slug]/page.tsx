import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { TRACKS } from "@/data/tracks";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Award, Clock, Terminal } from "lucide-react";

export function generateStaticParams() {
  return TRACKS.map((track) => ({
    slug: track.slug,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function TrilhaContent({ params }: Props) {
  const { slug } = await params;
  const track = TRACKS.find((t) => t.slug === slug);

  if (!track) {
    notFound();
  }

  return (
    <>
      {/* Back Link */}
      <Link
        href="/trilhas"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-emerald-400 transition mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Voltar para todas as trilhas</span>
      </Link>

      {/* Track Header Card */}
      <div className="p-8 rounded-2xl bg-[#0c0f18]/90 border border-slate-800 space-y-4 mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            {track.badge}
          </span>
          <span className="text-xs font-mono text-slate-400">
            Dificuldade: <span className="text-slate-200">{track.difficulty}</span>
          </span>
          <span className="text-xs font-mono text-slate-400">
            Recompensa: <span className="text-emerald-400 font-bold">{track.totalXp} XP</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          {track.title}
        </h1>
        <p className="text-base text-slate-400 font-sans leading-relaxed max-w-3xl">
          {track.description}
        </p>
      </div>

      {/* Modules & Challenges Accordion/List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-mono text-slate-200 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-emerald-400" />
          Módulos Práticos & Desafios de Exploração
        </h2>

        <div className="space-y-4">
          {track.modules.map((mod, idx) => (
            <div key={mod.id} className="p-6 rounded-xl bg-[#0c0f18] border border-slate-800/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">MÓDULO 0{idx + 1}</span>
                  <h3 className="text-lg font-bold text-slate-100">{mod.title}</h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {mod.duration}</span>
                  <span className="flex items-center gap-1 text-emerald-400"><Award className="h-3.5 w-3.5" /> {mod.xp} XP</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {mod.description}
              </p>

              {/* Challenges within module */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono text-slate-300 font-semibold">Laboratórios Interativos:</div>
                {mod.challenges.map((chal) => (
                  <div
                    key={chal.id}
                    className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                          {chal.category}
                        </span>
                        <span className="text-sm font-bold text-slate-200">{chal.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans">{chal.description}</p>
                    </div>

                    <Link
                      href={`/lab/${chal.slug}`}
                      className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    >
                      <Play className="h-3.5 w-3.5" />
                      ABRIR LABORATÓRIO (+{chal.xp} XP)
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function TrilhaDetailPage({ params }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 cyber-grid">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        <Suspense
          fallback={
            <div className="p-12 text-emerald-400 font-mono text-sm animate-pulse">
              Carregando dados da trilha...
            </div>
          }
        >
          <TrilhaContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}
