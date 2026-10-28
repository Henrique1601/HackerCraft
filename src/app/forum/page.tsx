import { Navbar } from "@/components/Navbar";
import { MOCK_FORUM_POSTS } from "@/data/forum";
import Link from "next/link";
import { 
  Users, MessageSquare, ThumbsUp, ShieldCheck, Tag, 
  Terminal, Search, PlusCircle, Flame, ChevronRight, Lock 
} from "lucide-react";

export default function ForumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 cyber-grid">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 flex-1">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">
              <Users className="h-4 w-4" />
              Underground Knowledge Base
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Fórum & Comunidade HackerCraft
            </h1>
            <p className="mt-2 text-slate-400 text-sm max-w-2xl font-sans">
              Compartilhe PoCs de vulnerabilidades, scripts ofensivos, writeups de desafios CTF e discussões sobre análise de malwares reais.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <PlusCircle className="h-4 w-4" />
              NOVO TÓPICO / SCRIPT
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
            Todos os Tópicos (24)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 cursor-pointer">
            Bypass AV/EDR (8)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 cursor-pointer">
            Red Team Scripts (11)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 cursor-pointer">
            Writeups CTF (5)
          </span>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {MOCK_FORUM_POSTS.map((post) => (
            <Link
              key={post.id}
              href={`/forum/${post.slug}`}
              className="group block p-6 rounded-2xl bg-[#0c0f18]/90 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                      {post.category}
                    </span>
                    {post.verifiedByAdmin && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        PoC Verificada
                      </span>
                    )}
                    <span className="text-slate-500">• Postado por <strong className="text-slate-300">{post.author}</strong> ({post.authorBadge})</span>
                    <span className="text-slate-500">• {post.createdAt}</span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors leading-snug">
                    {post.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {post.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Engagement stats */}
                <div className="shrink-0 flex items-center md:flex-col justify-end gap-3 text-xs font-mono text-slate-400 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-emerald-500/30">
                    <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="font-bold text-slate-200">{post.upvotes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{post.repliesCount} respostas</span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}
