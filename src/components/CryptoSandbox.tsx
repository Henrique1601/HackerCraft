"use client";

import { useState } from "react";
import { KeyRound, Lock, Unlock, Play, RotateCcw, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

interface CryptoSandboxProps {
  onFlagFound?: (flag: string) => void;
  expectedFlag?: string;
}

export function CryptoSandbox({
  onFlagFound,
  expectedFlag = "FLAG{rsa_wiener_attack_small_private_exponent_cracked}"
}: CryptoSandboxProps) {
  // Parâmetros RSA vulneráveis com d pequeno (Wiener Attack) ou p/q próximos (Fermat)
  const rsaParams = {
    n: "3233", // 61 * 53
    e: "17",
    p: "61",
    q: "53",
    phi: "3120", // (61-1)*(53-1)
    d: "2753",   // 17 * 2753 ≡ 1 (mod 3120)
    ciphertext: "2790"
  };

  const [inputP, setInputP] = useState("");
  const [inputQ, setInputQ] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [isCracked, setIsCracked] = useState(false);
  const [activeTab, setActiveTab] = useState<"rsa" | "xor" | "caesar">("rsa");

  // Parâmetro XOR
  const [xorInput, setXorInput] = useState("414243");
  const [xorKey, setXorKey] = useState("5A");
  const [xorOutput, setXorOutput] = useState("");

  const handleCrackRSA = (e: React.FormEvent) => {
    e.preventDefault();
    const pVal = parseInt(inputP.trim(), 10);
    const qVal = parseInt(inputQ.trim(), 10);

    if ((pVal === 61 && qVal === 53) || (pVal === 53 && qVal === 61)) {
      setIsCracked(true);
      setDecryptedText(
        `[+] SUCESSO: Fatoração concluída! n = 3233 decomposto em 61 * 53.\n[+] Totiente de Euler: phi(n) = (61-1)*(53-1) = 3120.\n[+] Expoente privado d = e^(-1) mod phi(n) = 2753.\n[+] Mensagem descriptografada: m = c^d mod n = 65 ('A')\n\nPARABÉNS! FLAG CAPTURADA:\n>>> ${expectedFlag} <<<`
      );
      if (onFlagFound) onFlagFound(expectedFlag);
    } else {
      setIsCracked(false);
      setDecryptedText(`[-] FALHA: p * q = ${(pVal || 0) * (qVal || 0)} (diferente do módulo n = ${rsaParams.n}).`);
    }
  };

  const handleXorDecrypt = () => {
    const key = parseInt(xorKey, 16) || 0;
    try {
      let result = "";
      for (let i = 0; i < xorInput.length; i += 2) {
        const byte = parseInt(xorInput.substr(i, 2), 16);
        result += String.fromCharCode(byte ^ key);
      }
      setXorOutput(`Texto Descriptografado: "${result}" (Hex: ${xorInput})`);
    } catch (e) {
      setXorOutput("Erro ao processar hex.");
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-amber-950/70 bg-[#090b10] overflow-hidden shadow-2xl font-mono text-sm">
      {/* Bar com modos de criptografia */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#0f1118] border-b border-amber-950/60 gap-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <div className="h-3 w-3 rounded-full bg-orange-500" />
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="ml-2 text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-amber-400" />
            CRYPTOGRAPHIC ATTACK LAB (RSA WEAK KEYS & XOR CIPHER)
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          {(["rsa", "xor"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveTab(mode)}
              className={`px-3 py-1 rounded text-xs uppercase font-semibold transition ${
                activeTab === mode
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {mode} Attack
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === "rsa" ? (
          <>
            {/* Lado Esquerdo: Parâmetros RSA Públicos */}
            <div className="flex flex-col space-y-4">
              <div className="p-4 rounded-lg bg-[#0e131f] border border-amber-900/40">
                <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-400" />
                  Chave Pública Interceptada:
                </h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <p><span className="text-amber-400 font-bold">Módulo Público n:</span> 3233</p>
                  <p><span className="text-amber-400 font-bold">Expoente Público e:</span> 17</p>
                  <p><span className="text-amber-400 font-bold">Cifrado (Ciphertext c):</span> 2790</p>
                </div>
                <p className="mt-3 text-[11px] text-slate-400 font-sans leading-relaxed">
                  O módulo <code className="text-amber-300">n</code> é pequeno e vulnerável à fatoração direta em números primos <code className="text-amber-300">p</code> e <code className="text-amber-300">q</code>. Encontre os fatores para calcular <code className="text-amber-300">d</code>!
                </p>
              </div>

              <form onSubmit={handleCrackRSA} className="p-4 rounded-lg bg-[#0e131f] border border-amber-900/40 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Fator Primo (p):</label>
                    <input
                      type="number"
                      value={inputP}
                      onChange={(e) => setInputP(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-amber-950 focus:border-amber-400 text-amber-300 font-mono text-xs outline-none"
                      placeholder="ex: 61"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Fator Primo (q):</label>
                    <input
                      type="number"
                      value={inputQ}
                      onChange={(e) => setInputQ(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-amber-950 focus:border-amber-400 text-amber-300 font-mono text-xs outline-none"
                      placeholder="ex: 53"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  Calcular Chave Privada d e Descriptografar
                </button>
              </form>
            </div>

            {/* Lado Direito: Terminal Criptográfico */}
            <div className="flex flex-col justify-between p-4 rounded-lg bg-[#07090e] border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 font-mono block mb-2">Crypto Attack Output (stdout):</span>
                <pre className={`p-4 rounded text-xs font-mono whitespace-pre-wrap min-h-[180px] border ${
                  isCracked
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                    : decryptedText
                      ? "bg-rose-950/40 border-rose-500/50 text-rose-300"
                      : "bg-slate-950 border-slate-900 text-slate-500"
                }`}>
                  {decryptedText || "// Insira os fatores primos p e q para quebrar a criptografia RSA..."}
                </pre>
              </div>

              {isCracked && (
                <button
                  type="button"
                  onClick={() => {
                    if (onFlagFound) onFlagFound(expectedFlag);
                  }}
                  className="mt-4 w-full py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Validar Flag no Lab
                </button>
              )}
            </div>
          </>
        ) : (
          /* Aba XOR */
          <div className="col-span-full p-4 rounded-lg bg-[#0e131f] border border-amber-900/40 space-y-4">
            <h4 className="text-sm font-bold text-slate-200">Ataque de Chave Repetida em Cifra XOR</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ciphertext (Hex):</label>
                <input
                  type="text"
                  value={xorInput}
                  onChange={(e) => setXorInput(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Chave XOR (1 Byte Hex):</label>
                <input
                  type="text"
                  value={xorKey}
                  onChange={(e) => setXorKey(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs"
                />
              </div>
            </div>
            <button
              onClick={handleXorDecrypt}
              className="py-2 px-4 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Executar XOR Byte a Byte
            </button>
            {xorOutput && (
              <pre className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-amber-300 font-mono">
                {xorOutput}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
