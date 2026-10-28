"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check, ShieldAlert } from "lucide-react";

interface InteractiveTerminalProps {
  initialPrompt?: string;
  onFlagFound?: (flag: string) => void;
  expectedFlag?: string;
  targetService?: string;
}

export function InteractiveTerminal({
  initialPrompt = "hacker@kali:~$ ",
  onFlagFound,
  expectedFlag,
  targetService = "10.10.13.37"
}: InteractiveTerminalProps) {
  const [history, setHistory] = useState<Array<{ type: "input" | "output" | "error" | "success"; text: string }>>([
    { type: "output", text: "=== HACKERCRAFT ISOLATED LINUX ENVIRONMENT (KALI LINUX 2026.4) ===" },
    { type: "output", text: "Alvo ativo na rede interna: " + targetService },
    { type: "output", text: "Digite 'help' para listar as ferramentas instaladas no sandbox.\n" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim();
    if (!cleanCmd) return;

    const newHistory = [...history, { type: "input" as const, text: `hacker@kali:~$ ${cleanCmd}` }];

    const parts = cleanCmd.split(" ");
    const command = parts[0].toLowerCase();

    switch (command) {
      case "help":
        newHistory.push({
          type: "output",
          text: `Comandos Disponíveis:\n  nmap, scan       - Escanear portas e serviços do alvo\n  nc, netcat       - Conectar a uma porta de rede\n  curl             - Requisições HTTP ao alvo\n  ls, cat, whoami  - Comandos básicos do shell\n  clear            - Limpar a tela do terminal\n  submit <flag>    - Submeter flag encontrada`
        });
        break;

      case "clear":
        setHistory([]);
        return;

      case "whoami":
        newHistory.push({ type: "output", text: "neo_operator (uid=1000, gid=1000)" });
        break;

      case "ls":
        newHistory.push({ type: "output", text: "exploit.py  wordlist.txt  notes.txt  vuln_scanner.sh" });
        break;

      case "cat":
        if (parts[1] === "notes.txt") {
          newHistory.push({
            type: "output",
            text: "Anotação do pentester: O serviço legado na porta 8888 requer handshake especial ou simplesmente um netcat com requisição GET."
          });
        } else if (parts[1] === "wordlist.txt") {
          newHistory.push({ type: "output", text: "admin\nroot\npassword123\n123456\nletmein\nsecret\nhackme" });
        } else {
          newHistory.push({ type: "error", text: `cat: ${parts[1] || ""}: Arquivo não especificado ou não encontrado.` });
        }
        break;

      case "scan":
      case "nmap":
        newHistory.push({
          type: "output",
          text: `Starting Nmap 7.95 ( https://nmap.org ) at 2026-10-28 14:00 UTC\nNmap scan report for ${targetService}\nHost is up (0.0012s latency).\n\nPORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 9.6p1\n80/tcp   open  http    Apache httpd 2.4.58\n8888/tcp open  custom  HackerCraft Internal Daemon v1.2\n\nNmap done: 1 IP address (1 host up) scanned in 1.45 seconds.`
        });
        break;

      case "nc":
      case "netcat":
        if (parts[2] === "8888" || parts[1] === "8888") {
          const found = expectedFlag || "FLAG{nmap_stealth_recon_mastered_2026}";
          newHistory.push({
            type: "success",
            text: `[+] Conectado com sucesso em ${targetService}:8888!\n[+] Banner: HackerCraft Auth Daemon v1.2\n[+] Verificação de Integridade Concluída!\n\nPARABÉNS! FLAG CAPTURADA:\n>>> ${found} <<<\nUse 'submit ${found}' para validar sua pontuação.`
          });
          if (onFlagFound) onFlagFound(found);
        } else if (parts[2] === "80" || parts[1] === "80") {
          newHistory.push({
            type: "output",
            text: `HTTP/1.1 200 OK\nServer: Apache\nContent-Type: text/html\n\n<h1>HackerCraft Test Server</h1>`
          });
        } else {
          newHistory.push({
            type: "error",
            text: `nc: falha ao conectar a ${parts[1] || targetService} na porta ${parts[2] || "desconhecida"}. Porta fechada.`
          });
        }
        break;

      case "submit":
        const flagSubmitted = parts[1];
        if (flagSubmitted === expectedFlag || (expectedFlag && flagSubmitted?.includes("FLAG{"))) {
          newHistory.push({
            type: "success",
            text: `🎯 FLAG CORRETA! +150 XP adicionados ao seu perfil de Hacker. Desafio superado!`
          });
          if (onFlagFound) onFlagFound(flagSubmitted);
        } else {
          newHistory.push({
            type: "error",
            text: `❌ Flag incorreta. Continue explorando o alvo!`
          });
        }
        break;

      default:
        newHistory.push({
          type: "error",
          text: `bash: ${command}: comando não encontrado. Digite 'help' para comandos suportados.`
        });
        break;
    }

    setHistory(newHistory);
    setInputVal("");
  };

  const copyLog = () => {
    const text = history.map(h => h.text).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-emerald-950/80 bg-[#090b10] overflow-hidden shadow-2xl font-mono text-sm">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e121a] border-b border-emerald-950/60">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <div className="flex items-center gap-1.5 ml-2 text-xs text-slate-400 font-semibold">
            <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span>bash — kali@hackercraft-box</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyLog}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
            title="Copiar histórico"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar"}</span>
          </button>
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
            title="Limpar terminal"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Limpar</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1.5 min-h-[320px] max-h-[500px]">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap leading-relaxed ${
              item.type === "input"
                ? "text-emerald-400 font-semibold"
                : item.type === "error"
                ? "text-rose-400"
                : item.type === "success"
                ? "text-emerald-300 font-bold bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/40"
                : "text-slate-300"
            }`}
          >
            {item.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Prompt Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand(inputVal);
        }}
        className="flex items-center gap-2 px-4 py-3 bg-[#0c0f16] border-t border-emerald-950/60"
      >
        <span className="text-emerald-400 font-semibold select-none">hacker@kali:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="digite um comando (ex: nmap 10.10.13.37, nc 10.10.13.37 8888, help)..."
          className="flex-1 bg-transparent text-slate-100 outline-none text-sm placeholder:text-slate-600 font-mono"
          autoFocus
        />
        <button
          type="submit"
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-semibold"
        >
          <Play className="h-3 w-3" />
          Executar
        </button>
      </form>
    </div>
  );
}
