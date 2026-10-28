import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { TRACKS, Challenge } from "@/data/tracks";
import { notFound } from "next/navigation";
import { LabWorkspace } from "@/components/LabWorkspace";

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const t of TRACKS) {
    for (const m of t.modules) {
      for (const c of m.challenges) {
        params.push({ slug: c.slug });
      }
    }
  }
  return params;
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function LabContent({ params }: Props) {
  const { slug } = await params;

  let currentChallenge: Challenge | null = null;
  let currentTrackTitle = "";

  for (const t of TRACKS) {
    for (const m of t.modules) {
      const found = m.challenges.find((c) => c.slug === slug);
      if (found) {
        currentChallenge = found;
        currentTrackTitle = t.title;
        break;
      }
    }
    if (currentChallenge) break;
  }

  if (!currentChallenge) {
    notFound();
  }

  return (
    <LabWorkspace
      challenge={currentChallenge}
      trackTitle={currentTrackTitle}
    />
  );
}

export default function LabPage({ params }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 cyber-grid">
      <Navbar />

      <main className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col">
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center p-12 text-emerald-400 font-mono text-sm animate-pulse">
              Carregando laboratório interativo...
            </div>
          }
        >
          <LabContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}
