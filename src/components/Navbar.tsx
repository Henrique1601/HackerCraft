"use client";

import Link from "next/link";
import { Terminal, Shield, Award, Users, Bot, Zap, MessageSquare } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [userXp] = useState(750);
  const [level] = useState(3);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-950/60 bg-[#090a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all">
            <Terminal className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-bold tracking-wider text-slate-100">
              <span className="text-emerald-400 text-lg">HACKER</span>
              <span className="text-slate-100 text-lg">CRAFT</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono">v1.1</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono tracking-tight">PRACTICAL CYBERSECURITY LABS</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link href="/trilhas" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors">
            <Shield className="h-4 w-4 text-emerald-400" />
            Trilhas & Labs
          </Link>
          <Link href="/desafios" className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors">
            <Zap className="h-4 w-4 text-cyan-400" />
            CTF & Desafios
          </Link>
          <Link href="/forum" className="flex items-center gap-2 text-slate-300 hover:text-emerald-300 transition-colors">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            Fórum Underground
          </Link>
          <Link href="/ranking" className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors">
            <Award className="h-4 w-4 text-amber-400" />
            Leaderboard
          </Link>
          <Link href="/tutor" className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors">
            <Bot className="h-4 w-4 text-purple-400" />
            AI Hacker Tutor
          </Link>
        </nav>

        {/* User Stats / Hacker Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-400">LVL {level}</span>
              <span className="font-semibold text-emerald-400">neo_operator</span>
            </div>
            <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 border border-slate-700/50">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                style={{ width: `${(userXp / 1500) * 100}%` }}
              />
            </div>
          </div>

          <Link
            href="/trilhas"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:shadow-[0_0_18px_rgba(16,185,129,0.5)]"
          >
            <Terminal className="h-3.5 w-3.5" />
            ACESSAR LAB
          </Link>
        </div>

      </div>
    </header>
  );
}
