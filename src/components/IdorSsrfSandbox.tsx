"use client";

import { useState } from "react";
import { Globe, Play, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert, FileText, Database } from "lucide-react";

interface IdorSsrfSandboxProps {
  onFlagFound?: (flag: string) => void;
  expectedFlag?: string;
  type?: "idor" | "ssrf";
}

export function IdorSsrfSandbox({
  onFlagFound,
  expectedFlag = "FLAG{idor_privilege_escalation_and_metadata_ssrf_pwned}",
  type = "idor"
}: IdorSsrfSandboxProps) {
  const [activeMode, setActiveMode] = useState<"idor" | "ssrf">(type);
  
  // IDOR State
  const [userIdParam, setUserIdParam] = useState("1042");
  const [idorOutput, setIdorOutput] = useState<any>(null);

  // SSRF State
  const [ssrfUrl, setSsrfUrl] = useState("http://169.254.169.254/latest/meta-data/iam/security-credentials/");
  const [ssrfOutput, setSsrfOutput] = useState<string>("");
  const [isFlagRevealed, setIsFlagRevealed] = useState(false);

  const mockUsers: Record<string, any> = {
    "1042": {
      id: 1042,
      name: "Carlos Developer",
      role: "Junior Dev",
      email: "carlos@corp.local",
      api_token: "tok_user_77a9b0c2",
      access_level: "Read-Only"
    },
    "1041": {
      id: 1041,
      name: "Mariana QA",
      role: "Tester",
      email: "mariana@corp.local",
      api_token: "tok_user_55d11e8f",
      access_level: "Read-Only"
    },
    "1": {
      id: 1,
      name: "Root Administrator",
      role: "CISO / SuperAdmin",
      email: "admin@corp.local",
      api_token: "tok_live_ADMIN_MASTER_KEY_999",
      access_level: "FULL ROOT ACCESS",
      secret_flag: expectedFlag
    }
  };

  const handleFetchUser = (e: React.FormEvent) => {
    e.preventDefault();
    const id = userIdParam.trim();
    if (mockUsers[id]) {
      setIdorOutput(mockUsers[id]);
      if (id === "1") {
        setIsFlagRevealed(true);
        if (onFlagFound) onFlagFound(expectedFlag);
      }
    } else {
      setIdorOutput({ error: 404, message: `Usuário ID ${id} não localizado no banco de dados.` });
    }
  };

  const handleSimulateSsrf = (e: React.FormEvent) => {
    e.preventDefault();
    const url = ssrfUrl.trim();

    if (url.includes("169.254.169.254") || url.includes("metadata.google.internal") || url.includes("localhost:8080") || url.includes("127.0.0.1:8080")) {
      setIsFlagRevealed(true);
      setSsrfOutput(
        `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "Code": "Success",\n  "LastUpdated": "2026-11-09T18:00:00Z",\n  "Type": "AWS-HMAC",\n  "AccessKeyId": "ASIAIOSFODNN7EXAMPLE",\n  "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",\n  "Token": "NRH4cK3rCr4ftM3t4D4t4ExPlo1t...",\n  "AWS_SECRET_FLAG": "${expectedFlag}"\n}`
      );
      if (onFlagFound) onFlagFound(expectedFlag);
    } else if (url.startsWith("http://") || url.startsWith("https://")) {
      setIsFlagRevealed(false);
      setSsrfOutput(`HTTP/1.1 200 OK\n<!DOCTYPE html><html><body><h1>Servidor Externo: ${url}</h1><p>Resposta pública recebida pelo proxy interno da aplicação.</p></body></html>`);
    } else {
      setIsFlagRevealed(false);
      setSsrfOutput(`HTTP/1.1 400 Bad Request\nEsquema de URL inválido. Apenas http:// ou https:// são permitidos.`);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-blue-950/70 bg-[#090b10] overflow-hidden shadow-2xl font-mono text-sm">
      {/* Bar com abas IDOR e SSRF */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#0d121c] border-b border-blue-950/60 gap-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <div className="h-3 w-3 rounded-full bg-cyan-500" />
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="ml-2 text-xs font-bold text-blue-400 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-blue-400" />
            ADVANCED WEB VULNERABILITIES: IDOR & SSRF LAB
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveMode("idor")}
            className={`px-3 py-1 rounded text-xs uppercase font-semibold transition ${
              activeMode === "idor"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            IDOR (Broken Object Level Auth)
          </button>
          <button
            onClick={() => setActiveMode("ssrf")}
            className={`px-3 py-1 rounded text-xs uppercase font-semibold transition ${
              activeMode === "ssrf"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            SSRF (Cloud Metadata Exfiltration)
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeMode === "idor" ? (
          <>
            {/* Lado Esquerdo IDOR */}
            <div className="flex flex-col space-y-4">
              <div className="p-4 rounded-lg bg-[#0e1422] border border-blue-900/40">
                <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-400" />
                  API Endpoint Vulnerável:
                </h4>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-blue-300">
                  GET /api/v1/user/profile?id=<span className="text-amber-400 font-bold">{userIdParam}</span>
                </div>
                <p className="mt-3 text-xs text-slate-400 font-sans leading-relaxed">
                  O endpoint confia cegamente no identificador numérico enviado no parâmetro sem validar se o token de sessão possui autorização para visualizar outros usuários.
                </p>
              </div>

              <form onSubmit={handleFetchUser} className="p-4 rounded-lg bg-[#0e1422] border border-blue-900/40 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Manipular Identificador de Usuário (id):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userIdParam}
                    onChange={(e) => setUserIdParam(e.target.value)}
                    className="flex-1 px-3 py-2 rounded bg-slate-900 border border-blue-950 focus:border-blue-400 text-blue-300 font-mono text-xs outline-none"
                    placeholder="ex: 1, 1041, 1042..."
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                  >
                    Enviar Request
                  </button>
                </div>
              </form>
            </div>

            {/* Lado Direito IDOR */}
            <div className="flex flex-col justify-between p-4 rounded-lg bg-[#07090f] border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 font-mono block mb-2">JSON Response do Servidor:</span>
                <pre className="p-4 rounded bg-slate-950 border border-slate-900 text-xs text-emerald-400 font-mono whitespace-pre-wrap overflow-y-auto max-h-[220px]">
                  {idorOutput ? JSON.stringify(idorOutput, null, 2) : "// Envie a requisição para visualizar o perfil..."}
                </pre>
              </div>

              {isFlagRevealed && (
                <div className="mt-4 p-3 rounded bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-sans">Flag de SuperAdmin Capturada:</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">{expectedFlag}</span>
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
          </>
        ) : (
          /* SSRF Mode */
          <>
            <div className="flex flex-col space-y-4">
              <div className="p-4 rounded-lg bg-[#0e1422] border border-cyan-900/40">
                <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  Webhook / URL Importer Service:
                </h4>
                <p className="text-xs text-slate-400 font-sans leading-relaxed mb-3">
                  A aplicação possui uma funcionalidade que baixa relatórios de URLs externas. Ao injetar o endereço de metadados da nuvem (ex: AWS <code className="text-cyan-300">169.254.169.254</code>), o servidor busca o recurso interno restrito.
                </p>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-xs text-cyan-300">
                  POST /api/fetch-report {"{"} &quot;url&quot;: &quot;...&quot; {"}"}
                </div>
              </div>

              <form onSubmit={handleSimulateSsrf} className="p-4 rounded-lg bg-[#0e1422] border border-cyan-900/40 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  URL para o Servidor Baixar (SSRF Payload):
                </label>
                <input
                  type="text"
                  value={ssrfUrl}
                  onChange={(e) => setSsrfUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-cyan-950 focus:border-cyan-400 text-cyan-300 font-mono text-xs outline-none"
                  placeholder="http://169.254.169.254/..."
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  <Play className="inline h-3.5 w-3.5 mr-1" />
                  Disparar Requisição SSRF pelo Servidor
                </button>
              </form>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-lg bg-[#07090f] border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 font-mono block mb-2">Dados Extraídos da Rede Interna da Nuvem:</span>
                <pre className="p-4 rounded bg-slate-950 border border-slate-900 text-xs text-cyan-300 font-mono whitespace-pre-wrap overflow-y-auto max-h-[220px]">
                  {ssrfOutput || "// Digite o endereço do serviço de metadados e dispare a requisição..."}
                </pre>
              </div>

              {isFlagRevealed && (
                <button
                  type="button"
                  onClick={() => {
                    if (onFlagFound) onFlagFound(expectedFlag);
                  }}
                  className="mt-4 w-full py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono transition shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                >
                  Submeter Flag Extraída
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
