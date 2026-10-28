import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { MOCK_FORUM_POSTS } from "@/data/forum";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, MessageSquare, ShieldCheck, Tag, Terminal, Play } from "lucide-react";

export function generateStaticParams() {
  return MOCK_FORUM_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function ForumContent({ params }: Props) {
  const { slug } = await params;
  const post = MOCK_FORUM_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Link
        href="/forum"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-emerald-400 transition mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Voltar ao Fórum</span>
      </Link>

      <article className="p-8 rounded-2xl bg-[#0c0f18]/90 border border-slate-800 space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold">
              {post.category}
            </span>
            {post.verifiedByAdmin && (
              <span className="inline-flex items-center gap-1 text-cyan-400 font-mono">
                <ShieldCheck className="h-3.5 w-3.5" />
                PoC Verificada pela Comunidade
              </span>
            )}
            <span className="text-slate-500">• Por <strong className="text-slate-200">{post.author}</strong> ({post.authorBadge})</span>
            <span className="text-slate-500">• {post.createdAt}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-snug">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {post.tags.map((t) => (
              <span key={t} className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {post.solvedChallengeSlug && (
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-between gap-4 font-mono text-xs">
            <div className="space-y-1">
              <span className="text-cyan-400 font-bold">Este tópico é um writeup do laboratório oficial:</span>
              <p className="text-slate-300 font-sans">Abra o laboratório agora para replicar os passos explicados pelo autor.</p>
            </div>
            <Link
              href={`/lab/${post.solvedChallengeSlug}`}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              <Play className="h-3.5 w-3.5" />
              ABRIR LAB
            </Link>
          </div>
        )}

        {/* Content body */}
        <div className="pt-4 border-t border-slate-800 font-sans text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Voting & Actions */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60 transition">
            <ThumbsUp className="h-4 w-4" />
            <span>Útil (+{post.upvotes})</span>
          </button>

          <span className="text-slate-500">
            {post.repliesCount} comentários registrados
          </span>
        </div>
      </article>
    </>
  );
}

export default function ForumPostPage({ params }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 cyber-grid">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        <Suspense
          fallback={
            <div className="p-12 text-emerald-400 font-mono text-sm animate-pulse">
              Carregando post do fórum...
            </div>
          }
        >
          <ForumContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}
