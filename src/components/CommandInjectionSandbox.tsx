"use client";

import { useState } from "react";
import { Terminal as TerminalIcon, Play, RotateCcw, AlertTriangle, CheckCircle2, ShieldCheck, Code2, Server } from "lucide-react";

interface CommandInjectionSandboxProps {
  onFlagFound?: (flag: string) => void;
  expectedFlag?: string;
  technology?: "nodejs" | "php" | "python" | "bash";
}

export function CommandInjectionSandbox({
  onFlagFound,
  expectedFlag = "FLAG{rce_polyglot_command_injection_pwned_2026}",
  technology: initialTech = "php"
}: CommandInjectionSandboxProps) {
  const [tech, setTech] = useState<"nodejs" | "php" | "python" | "bash">(initialTech);
  const [targetInput, setTargetInput] = useState("8.8.8.8; cat /etc/passwd");
  const [outputTerminal, setOutputTerminal] = useState<string>("");
  const [isExploited, setIsExploited] = useState(false);
  const [backendCodeSnippet, setBackendCodeSnippet] = useState("");

  const techSnippets = {
    php: `// PHP Backend (Legacy Ping Utility)
$ip = $_POST['ip'];
$output = shell_exec("ping -c 2 " . $ip);
echo "<pre>$output</pre>";`,
    nodejs: `// Node.js Backend (Child Process Exec)
const { exec } = require('child_process');
const targetHost = req.body.host;
exec(\`ping -c 2 \${targetHost}\`, (err, stdout, stderr) => {
  res.send(stdout || stderr);
});`,
    python: `# Python Flask Backend (os.system / subprocess shell=True)
import subprocess
host = request.form.get("host")
# Vulnerabilidade crítica: shell=True sem sanitização
cmd = f"ping -c 2 {host}"
result = subprocess.check_output(cmd, shell=True, text=True)`,
    bash: `#!/bin/bash
# CGI Bash Script
TARGET_IP="$QUERY_STRING"
eval "ping -c 2 $TARGET_IP"`
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const input = targetInput.trim();

    // Verificação de delimitadores de comando injection: ;, &&, ||, |, `...`, $(...)
    const hasDelimiters =
      input.includes(";") ||
      input.includes("&&") ||
      input.includes("||") ||
      input.includes("|") ||
      input.includes("`") ||
      input.includes("$(");

    const hasMaliciousCommands =
      input.toLowerCase().includes("cat") ||
      input.toLowerCase().includes("ls") ||
      input.toLowerCase().includes("id") ||
      input.toLowerCase().includes("whoami") ||
      input.toLowerCase().includes("flag") ||
      input.toLowerCase().includes("passwd");

    if (hasDelimiters && hasMaliciousCommands) {
      setIsExploited(true);
      let simulatedResponse = `PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=14.2 ms\n\n--- INJEÇÃO EXECUTADA VIA [${tech.toUpperCase()}] ---\n`;

      if (input.toLowerCase().includes("passwd")) {
        simulatedResponse += `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/bin/bash\noperator:x:1000:1000:Operator,,,:/home/operator:/bin/bash\n\n[+] ARQUIVO /secret_flag.txt ENCONTRADO:\n>>> ${expectedFlag} <<<`;
      } else if (input.toLowerCase().includes("whoami") || input.toLowerCase().includes("id")) {
        simulatedResponse += `uid=33(www-data) gid=33(www-data) groups=33(www-data)\n[+] Privilégios confirmados. Execute 'cat /secret_flag.txt' para extrair a flag!`;
      } else if (input.toLowerCase().includes("ls")) {
        simulatedResponse += `index.${tech === "nodejs" ? "js" : tech === "python" ? "py" : tech}  ping_service.sh  config.env  secret_flag.txt`;
      } else {
        simulatedResponse += `[+] Comando executado no container remoto com sucesso!\n>>> FLAG: ${expectedFlag} <<<`;
      }

      setOutputTerminal(simulatedResponse);
      if (onFlagFound) onFlagFound(expectedFlag);
    } else if (input.startsWith("8.8.8.8") || input.startsWith("127.0.0.1") || input.startsWith("1.1.1.1")) {
      setIsExploited(false);
      setOutputTerminal(
        `PING ${input} (${input}) 56(84) bytes of data.\n64 bytes from ${input}: icmp_seq=1 ttl=118 time=15.1 ms\n64 bytes from ${input}: icmp_seq=2 ttl=118 time=14.8 ms\n\n--- ${input} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`
      );
    } else {
      setIsExploited(false);
      setOutputTerminal(`ping: ${input}: Name or service not known\nComando rejeitado ou host inacessível.`);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-rose-950/70 bg-[#090b10] overflow-hidden shadow-2xl font-mono text-sm">
      {/* Header com seletor de tecnologias */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-rose-950/60 gap-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500" />
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="ml-2 text-xs font-bold text-rose-400 flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 text-rose-400" />
            MULTI-TECH RCE SANDBOX (COMMAND INJECTION)
          </span>
        </div>

        {/* Abas de Tecnologias */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          {(["php", "nodejs", "python", "bash"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTech(t);
                setOutputTerminal("");
                setIsExploited(false);
              }}
              className={`px-2.5 py-1 rounded text-xs uppercase font-semibold transition ${
                tech === t
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lado Esquerdo: Formulário Vulnerável & Explicação da Stack */}
        <div className="flex flex-col space-y-4">
          <div className="p-4 rounded-lg bg-[#0e131f] border border-rose-900/40">
            <h4 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-rose-400" />
              Código Vulnerável no Backend ({tech.toUpperCase()}):
            </h4>
            <pre className="p-3 mt-2 rounded bg-slate-950 border border-slate-800 text-xs text-rose-300/90 overflow-x-auto">
              {techSnippets[tech]}
            </pre>
          </div>

          <form onSubmit={handleSimulate} className="p-4 rounded-lg bg-[#0e131f] border border-rose-900/40 space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Campo Alvo (Host / IP) — Injeção de Comandos:
            </label>
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-full px-3 py-2 rounded bg-slate-900 border border-rose-950 focus:border-rose-400 text-rose-300 font-mono text-xs outline-none"
              placeholder="ex: 127.0.0.1; whoami ou 8.8.8.8 && ls -la"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-[0_0_15px_rgba(225,29,72,0.3)]"
              >
                <Play className="h-3.5 w-3.5" />
                Disparar Injeção de Comando
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetInput("8.8.8.8; cat /etc/passwd");
                  setOutputTerminal("");
                  setIsExploited(false);
                }}
                className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                title="Resetar payload"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Lado Direito: Saída do Terminal com Flag */}
        <div className="flex flex-col rounded-lg bg-[#07090e] border border-slate-800 p-4">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <TerminalIcon className="h-4 w-4 text-emerald-400" />
              Remote Server Output (stdout)
            </span>
            {isExploited && (
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[10px] flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Vulnerabilidade RCE Confirmada!
              </span>
            )}
          </div>

          <pre className="flex-1 p-3 rounded bg-black/70 border border-slate-900 text-xs text-emerald-400 font-mono whitespace-pre-wrap overflow-y-auto min-h-[180px]">
            {outputTerminal || "# Aguardando submissão do payload de injeção..."}
          </pre>

          {isExploited && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-sans">Flag Capturada no Servidor:</span>
                <span className="font-mono text-xs font-bold text-emerald-400 select-all">{expectedFlag}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onFlagFound) onFlagFound(expectedFlag);
                }}
                className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono transition"
              >
                Validar Flag
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
