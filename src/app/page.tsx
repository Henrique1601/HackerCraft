import { Navbar } from "@/components/Navbar";
import { TRACKS } from "@/data/tracks";
import Link from "next/link";
import { 
  Terminal, Shield, Zap, Flame, Award, Skull, Crosshair, 
  ChevronRight, ArrowRight, BookOpen, Bug, Binary, Radio 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 cyber-grid">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Glow blur background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[130px] -z-10 rounded-full" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-cyan-500/10 blur-[110px] -z-10 rounded-full" />

        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>PLATAFORMA PRÁTICA DE CYBERSEGURANÇA & PENTEST 100% NO BROWSER</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1]">
          Aprenda <span className="text-emerald-400 terminal-glow-green">Pentest</span>, Crie Scripts Ofensivos & Dissecte <span className="text-rose-500">Malwares</span> na Prática.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl leading-relaxed font-sans">
          Chega de teoria monótona. No <strong>HackerCraft</strong>, você aprende técnicas reais de invasão, exploração de vulnerabilidades (OWASP), desenvolvimento de exploits e engenharia reversa com <strong>laboratórios interativos, terminal Linux e IA Hacker Tutor</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 font-mono text-sm">
          <Link
            href="/trilhas"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold tracking-wide transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)]"
          >
            <Terminal className="h-4 w-4" />
            INICIAR AGORA DE GRAÇA
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/desafios"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 font-semibold transition"
          >
            <Zap className="h-4 w-4 text-cyan-400" />
            Explorar CTF & Desafios
          </Link>
        </div>

        {/* Quick Highlights Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl text-left font-mono">
          <div className="p-4 rounded-xl bg-[#0c0f17]/80 border border-emerald-950/60">
            <div className="text-2xl font-bold text-emerald-400">06</div>
            <div className="text-xs text-slate-400 mt-1 font-sans">Trilhas de Especialização</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0c0f17]/80 border border-cyan-950/60">
            <div className="text-2xl font-bold text-cyan-400">100%</div>
            <div className="text-xs text-slate-400 mt-1 font-sans">Prático no Browser</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0c0f17]/80 border border-amber-950/60">
            <div className="text-2xl font-bold text-amber-400">AI</div>
            <div className="text-xs text-slate-400 mt-1 font-sans">Copilot Hacker Tutor</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0c0f17]/80 border border-purple-950/60">
            <div className="text-2xl font-bold text-purple-400">CTF</div>
            <div className="text-xs text-slate-400 mt-1 font-sans">Ranking & Flags Globais</div>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">
              <Crosshair className="h-4 w-4" />
              Roadmap Ofensivo e Defensivo
            </div>
            <h2 className="text-3xl font-extrabold text-slate-100">
              Escolha sua Trilha de Combate
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-slate-400 text-sm max-w-md font-sans">
            Cada trilha possui laboratórios isolados que reproduzem vetores reais de ataques e defesas de empresas e fóruns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRACKS.map((track) => (
            <Link
              key={track.id}
              href={`/trilhas/${track.slug}`}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0c0f18]/90 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                    {track.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {track.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    {track.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
                  {track.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="text-slate-400">
                  <span className="text-emerald-400 font-semibold">{track.totalXp} XP</span> • {track.totalModules} módulos
                </div>
                <div className="flex items-center gap-1 text-slate-300 group-hover:text-emerald-400 transition-colors font-semibold">
                  <span>Acessar</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Underground Knowledge & Responsible Disclosure Notice */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0e1320] to-cyan-950/30 border border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Radio className="h-4 w-4" />
              <span>CONHECIMENTO ÉTICO ORIUNDO DE PESQUISAS E FÓRUNS REAIS</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100">
              Aprenda como os invasores realmente operam para construir defesas invencíveis
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Dissecamos técnicas documentadas em fontes conceituadas de segurança ofensiva (Exploit-DB, 0x00sec, advisories de CVEs recentes e relatórios de inteligência de ameaças) para que você domine engenharia de software seguro e pentest de alto nível.
            </p>
          </div>

          <Link
            href="/trilhas"
            className="shrink-0 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            VER CATÁLOGO COMPLETO DE LABS
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/60 bg-[#06070a] py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">HACKERCRAFT</span>
            <span>— Practical Cyber Defense & Offensive Engineering</span>
          </div>
          <div>
            100% Para fins didáticos e formação de profissionais de segurança da informação.
          </div>
        </div>
      </footer>
    </div>
  );
}
