"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check, ShieldAlert, Sparkles } from "lucide-react";

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
    { type: "output", text: "=== HACKERCRAFT ISOLATED LINUX ENVIRONMENT (KALI LINUX 2026.4 LTS) ===" },
    { type: "output", text: "Alvo ativo na rede interna: " + targetService },
    { type: "output", text: "Recursos ativados: Histórico (↑ / ↓), Autocompletar (Tab) e Ferramentas Ofensivas." },
    { type: "output", text: "Digite 'help' para listar as ferramentas instaladas no sandbox.\n" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const availableCommands = [
    "help", "clear", "ls", "cat", "whoami", "id", "uname", "pwd",
    "nmap", "scan", "nc", "netcat", "curl", "gobuster", "hashcat",
    "john", "python3", "msfconsole", "submit"
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Autocompletar com Tab
    if (e.key === "Tab") {
      e.preventDefault();
      const current = inputVal.trim();
      if (!current) return;
      const match = availableCommands.find((c) => c.startsWith(current));
      if (match) {
        setInputVal(match + " ");
      }
      return;
    }

    // Navegação no histórico com Seta para Cima (↑)
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx < commandHistory.length) {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      }
      return;
    }

    // Navegação no histórico com Seta para Baixo (↓)
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
      return;
    }
  };

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim();
    if (!cleanCmd) return;

    // Registra no histórico de comandos
    setCommandHistory((prev) => [...prev, cleanCmd]);
    setHistoryIndex(-1);

    const newHistory = [...history, { type: "input" as const, text: `hacker@kali:~$ ${cleanCmd}` }];

    const parts = cleanCmd.split(" ");
    const command = parts[0].toLowerCase();

    switch (command) {
      case "help":
        newHistory.push({
          type: "output",
          text: `Comandos e Ferramentas Disponíveis:
  nmap, scan       - Escanear portas, banners e serviços do alvo
  nc, netcat       - Conectar a portas TCP brutas e interagir com daemons
  curl             - Requisições HTTP/REST customizadas ao alvo
  gobuster         - Força bruta de diretórios e endpoints web
  hashcat, john    - Quebra de hashes MD5 / SHA-256
  msfconsole       - Interface do framework Metasploit
  python3          - Interpretador Python e scripts ofensivos
  ls, cat, whoami  - Comandos nativos de navegação do shell Linux
  id, uname, pwd   - Informações do sistema e diretório
  clear            - Limpar a tela do terminal
  submit <flag>    - Submeter flag encontrada diretamente`
        });
        break;

      case "clear":
        setHistory([]);
        return;

      case "pwd":
        newHistory.push({ type: "output", text: "/home/hacker" });
        break;

      case "uname":
      case "uname -a":
        newHistory.push({
          type: "output",
          text: "Linux kali-hackercraft 6.12.0-kali1-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.12.9-1kali1 x86_64 GNU/Linux"
        });
        break;

      case "whoami":
        newHistory.push({ type: "output", text: "hacker (uid=1000, gid=1000, groups=1000(hacker),27(sudo))" });
        break;

      case "id":
        newHistory.push({ type: "output", text: "uid=1000(hacker) gid=1000(hacker) groups=1000(hacker),4(adm),24(cdrom),27(sudo)" });
        break;

      case "ls":
        newHistory.push({ type: "output", text: "exploit.py  wordlist.txt  notes.txt  recon_output.xml  shadow_dump.txt" });
        break;

      case "cat":
        if (parts[1] === "notes.txt") {
          newHistory.push({
            type: "output",
            text: "Anotação do pentester: O serviço legado na porta 8888 requer handshake especial ou simplesmente um netcat com requisição GET."
          });
        } else if (parts[1] === "wordlist.txt") {
          newHistory.push({ type: "output", text: "admin\nroot\npassword123\n123456\nletmein\nsecret\nhackme\nrockyou_sample" });
        } else if (parts[1] === "shadow_dump.txt") {
          newHistory.push({ type: "output", text: "admin:$1$hackercraft$4r8u12h4u918h24... (Hash MD5 Unix)" });
        } else {
          newHistory.push({ type: "error", text: `cat: ${parts[1] || ""}: Arquivo não especificado ou não encontrado.` });
        }
        break;

      case "scan":
      case "nmap":
        newHistory.push({
          type: "output",
          text: `Starting Nmap 7.95 ( https://nmap.org ) at 2026-11-09 18:30 UTC
Nmap scan report for ${targetService}
Host is up (0.0012s latency).
Not shown: 997 closed tcp ports (reset)

PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.6p1 Debian 4
80/tcp   open  http    Apache httpd 2.4.58 ((Debian))
8888/tcp open  custom  HackerCraft Auth Daemon v1.2

Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
Nmap done: 1 IP address (1 host up) scanned in 1.45 seconds.`
        });
        break;

      case "gobuster":
        newHistory.push({
          type: "output",
          text: `===============================================================
Gobuster v3.6 - Directory & File Brute Forcer
===============================================================
[+] Url:                     http://${targetService}
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
===============================================================
/admin                (Status: 301) [Size: 312]
/api                  (Status: 200) [Size: 1450]
/backup.zip           (Status: 200) [Size: 524180]
/robots.txt           (Status: 200) [Size: 45]
/server-status        (Status: 403) [Size: 278]
===============================================================`
        });
        break;

      case "curl":
        if (cleanCmd.includes(targetService)) {
          newHistory.push({
            type: "output",
            text: `HTTP/1.1 200 OK\nServer: HackerCraft-Internal-Server/2.4\nContent-Type: text/html\n\n<!DOCTYPE html><html><body><h1>Internal Portal</h1><p>Restricted area.</p></body></html>`
          });
        } else {
          newHistory.push({
            type: "output",
            text: `curl: specify target URL (ex: curl http://${targetService}/api)`
          });
        }
        break;

      case "nc":
      case "netcat":
        if (parts[2] === "8888" || parts[1] === "8888" || cleanCmd.includes("8888")) {
          const found = expectedFlag || "FLAG{nmap_stealth_recon_mastered_2026}";
          newHistory.push({
            type: "success",
            text: `[+] Conectado com sucesso em ${targetService}:8888!
[+] Banner: HackerCraft Auth Daemon v1.2
[+] Verificação de Integridade Concluída!

PARABÉNS! FLAG CAPTURADA:
>>> ${found} <<<
Use 'submit ${found}' para validar sua pontuação.`
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
            text: `nc: falha ao conectar a ${parts[1] || targetService} na porta ${parts[2] || "desconhecida"}. Porta fechada ou timeout.`
          });
        }
        break;

      case "hashcat":
      case "john":
        newHistory.push({
          type: "output",
          text: `Loaded 1 password hash (md5crypt [MD5 32/64 XOP])\nWill run 8 OpenMP threads\nProceeding with wordlist attack...\n\nadmin:letmein\n\n1 password hash cracked, 0 left!`
        });
        break;

      case "msfconsole":
        newHistory.push({
          type: "output",
          text: `      .:okOOOkdc'           'cdkOOOko:.
    .xOOOOOOOOOOOOc       cOOOOOOOOOOOOx.
   :OOOOOOOOOOOOOOOk:   :kOOOOOOOOOOOOOOO:
  'OOOOOOOOOOOOOOOOOO: :OOOOOOOOOOOOOOOOOO'
  [Metasploit v6.4.15-dev]
  + -- --=[ 2420 exploits - 1245 auxiliary - 428 post ]
  + -- --=[ 1465 payloads - 47 encoders - 11 nops ]
msf6 > `
        });
        break;

      case "submit":
        if (parts[1]) {
          const submitted = parts[1];
          if (submitted === expectedFlag) {
            newHistory.push({
              type: "success",
              text: `[+] FLAG CORRETA! Desafio resolvido com sucesso: ${submitted}`
            });
            if (onFlagFound) onFlagFound(submitted);
          } else {
            newHistory.push({
              type: "error",
              text: `[-] Flag incorreta. Verifique o valor fornecido e tente novamente.`
            });
          }
        } else {
          newHistory.push({ type: "error", text: "Uso: submit <FLAG{...}>" });
        }
        break;

      default:
        newHistory.push({
          type: "error",
          text: `bash: ${command}: comando não reconhecido. Digite 'help' para comandos suportados.`
        });
    }

    setHistory(newHistory);
  };

  const handleCopyAll = () => {
    const textToCopy = history.map((h) => h.text).join("\n");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col rounded-xl border border-emerald-950/80 bg-[#06080d] overflow-hidden shadow-2xl font-mono text-xs sm:text-sm">
      {/* Barra Superior do Terminal */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b0f17] border-b border-emerald-950/70">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />
            kali@hackercraft-lab:~
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition"
            title="Copiar log"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-rose-400 transition"
            title="Limpar tela"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        </div>
      </div>

      {/* Janela de Saída do Console */}
      <div className="p-4 space-y-2 h-[340px] sm:h-[400px] overflow-y-auto leading-relaxed select-text">
        {history.map((h, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {h.type === "input" ? (
              <span className="text-emerald-400 font-semibold">{h.text}</span>
            ) : h.type === "error" ? (
              <span className="text-rose-400">{h.text}</span>
            ) : h.type === "success" ? (
              <span className="text-cyan-300 font-bold bg-cyan-950/40 p-2 rounded block border border-cyan-500/30">
                {h.text}
              </span>
            ) : (
              <span className="text-slate-300">{h.text}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Linha de Prompt Ativa */}
      <div className="flex items-center px-4 py-2.5 bg-[#090d14] border-t border-emerald-950/60">
        <span className="text-emerald-500 font-bold select-none mr-2 whitespace-nowrap">
          hacker@kali:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            handleKeyDown(e);
            if (e.key === "Enter") {
              handleCommand(inputVal);
              setInputVal("");
            }
          }}
          className="flex-1 bg-transparent text-emerald-300 outline-none font-mono text-xs sm:text-sm placeholder-slate-600"
          placeholder="digite um comando (ex: nmap 10.10.13.37, help, ls)..."
          autoFocus
          spellCheck={false}
        />
        <button
          onClick={() => {
            handleCommand(inputVal);
            setInputVal("");
          }}
          className="ml-2 p-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 transition border border-emerald-500/40"
          title="Executar comando"
        >
          <Play className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
