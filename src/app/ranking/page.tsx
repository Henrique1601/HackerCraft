import { Navbar } from "@/components/Navbar";
import { MOCK_LEADERBOARD, INITIAL_PROFILE } from "@/data/user";
import { Trophy, Award, Medal, Flame, Shield, Globe } from "lucide-react";

export default function RankingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 cyber-grid">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 flex-1">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">
            <Trophy className="h-4 w-4" />
            Hall da Fama dos Hackers
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            Leaderboard Global & Ranking CTF
          </h1>
          <p className="mt-3 text-slate-400 text-sm font-sans">
            Pontuações atualizadas em tempo real com base nas flags capturadas, complexidade dos exploits criados e tempo de resolução dos desafios.
          </p>
        </div>

        {/* Podium Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {MOCK_LEADERBOARD.slice(0, 3).map((user, idx) => (
            <div
              key={user.handle}
              className={`p-6 rounded-2xl bg-[#0c0f18]/90 border relative flex flex-col items-center text-center ${
                idx === 0
                  ? "border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.15)] order-1 md:order-2"
                  : idx === 1
                  ? "border-slate-400/40 order-2 md:order-1"
                  : "border-amber-700/40 order-3"
              }`}
            >
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg mb-3 ${
                  idx === 0
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                    : idx === 1
                    ? "bg-slate-300/20 text-slate-200 border border-slate-400/50"
                    : "bg-amber-800/20 text-amber-600 border border-amber-700/50"
                }`}
              >
                #{user.rank}
              </div>

              <div className="text-xs font-mono font-bold text-slate-400 mb-1">{user.country} • LVL {user.level}</div>
              <h3 className="text-xl font-extrabold text-slate-100 mb-2">{user.handle}</h3>
              
              <div className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 mb-4">
                {user.badge}
              </div>

              <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{user.solved} Flags</span>
                <span className="text-emerald-400 font-bold">{user.xp} XP</span>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-2xl bg-[#0c0f18]/90 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-4 bg-[#0e121a] border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 font-semibold">
            <span>POSIÇÃO & HACKER</span>
            <div className="flex items-center gap-8">
              <span className="hidden sm:inline">FLAGS RESOLVIDAS</span>
              <span>XP TOTAL</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 font-mono text-xs">
            {MOCK_LEADERBOARD.map((user) => (
              <div
                key={user.handle}
                className={`p-4 flex items-center justify-between transition ${
                  user.handle === "neo_operator"
                    ? "bg-emerald-950/30 border-l-2 border-emerald-500"
                    : "hover:bg-slate-900/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 text-slate-500 font-bold">#{user.rank}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{user.handle}</span>
                      {user.handle === "neo_operator" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-extrabold">VOCÊ</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-sans">{user.badge}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <span className="hidden sm:inline text-slate-400">{user.solved} flags</span>
                  <span className="font-bold text-emerald-400">{user.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
