"use client";

import { useState } from "react";
import { Cpu, Play, RotateCcw, CheckCircle2, ShieldAlert, Binary, Search, Layers } from "lucide-react";

interface ReverseEngineeringSandboxProps {
  onFlagFound?: (flag: string) => void;
  expectedFlag?: string;
  initialArchitecture?: "x86_64" | "arm64" | "wasm" | "jvm";
}

export function ReverseEngineeringSandbox({
  onFlagFound,
  expectedFlag = "FLAG{rev_polyglot_arm_wasm_x64_master_2026}",
  initialArchitecture = "x86_64"
}: ReverseEngineeringSandboxProps) {
  const [arch, setArch] = useState<"x86_64" | "arm64" | "wasm" | "jvm">(initialArchitecture);
  const [keyInput, setKeyInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const disassemblyData = {
    x86_64: `; Disassembly: validate_license(char* input) [x86_64 ELF]
push   rbp
mov    rbp, rsp
mov    QWORD PTR [rbp-0x18], rdi     ; input pointer
mov    rax, QWORD PTR [rbp-0x18]
movzx  eax, BYTE PTR [rax]
cmp    al, 0x48                      ; 'H'
jne    0x11d8 <failed>
mov    rax, QWORD PTR [rbp-0x18]
add    rax, 0x1
movzx  eax, BYTE PTR [rax]
cmp    al, 0x34                      ; '4'
jne    0x11d8 <failed>
mov    rax, QWORD PTR [rbp-0x18]
add    rax, 0x2
movzx  eax, BYTE PTR [rax]
cmp    al, 0x43                      ; 'C'
jne    0x11d8 <failed>
mov    rax, QWORD PTR [rbp-0x18]
add    rax, 0x3
movzx  eax, BYTE PTR [rax]
cmp    al, 0x4b                      ; 'K'
jne    0x11d8 <failed>
; XOR Chave de Validação: 0x5A ^ 0x09 = 0x53 ('S')
mov    eax, 0x1                      ; Return SUCCESS (1)
pop    rbp
ret`,
    arm64: `// Disassembly: check_flag (AArch64 / ARM64 Mach-O & Linux)
stp    x29, x30, [sp, #-32]!
mov    x29, sp
str    x0, [sp, #16]                 // Salva input string
ldr    x0, [sp, #16]
ldrb   w1, [x0]                      // Byte 0
cmp    w1, #0x48                     // 'H' (72)
b.ne   .L_FAIL
ldrb   w2, [x0, #1]                  // Byte 1
cmp    w2, #0x34                     // '4' (52)
b.ne   .L_FAIL
ldrb   w3, [x0, #2]                  // Byte 2
cmp    w3, #0x43                     // 'C' (67)
b.ne   .L_FAIL
ldrb   w4, [x0, #3]                  // Byte 3
cmp    w4, #0x4b                     // 'K' (75)
b.ne   .L_FAIL
mov    w0, #1                        // Flag de Sucesso
ldp    x29, x30, [sp], #32
ret`,
    wasm: `;; WebAssembly Bytecode WAT Text Representation
(module
  (func $verify_token (param $ptr i32) (result i32)
    ;; Carrega primeiro byte da memória linear
    (i32.load8_u (local.get $ptr))
    (i32.const 72) ;; ASCII 72 = 'H'
    (i32.ne)
    (if (then (return (i32.const 0))))

    (i32.load8_u (i32.add (local.get $ptr) (i32.const 1)))
    (i32.const 52) ;; ASCII 52 = '4'
    (i32.ne)
    (if (then (return (i32.const 0))))

    (i32.load8_u (i32.add (local.get $ptr) (i32.const 2)))
    (i32.const 67) ;; ASCII 67 = 'C'
    (i32.ne)
    (if (then (return (i32.const 0))))

    (i32.load8_u (i32.add (local.get $ptr) (i32.const 3)))
    (i32.const 75) ;; ASCII 75 = 'K'
    (i32.ne)
    (if (then (return (i32.const 0))))

    (i32.const 1) ;; Validação Aprovada
  )
)`,
    jvm: `// JVM Bytecode / Smali (Android DEX & Java class)
public static boolean verifyLicense(java.lang.String);
  Code:
    0: aload_0
    1: iconst_0
    2: invokevirtual #2 // Method java/lang/String.charAt:(I)C
    5: bipush        72 // 'H'
    7: if_icmpne     35
    10: aload_0
    11: iconst_1
    12: invokevirtual #2 // Method java/lang/String.charAt:(I)C
    15: bipush        52 // '4'
    17: if_icmpne     35
    20: aload_0
    21: iconst_2
    22: invokevirtual #2 // Method java/lang/String.charAt:(I)C
    25: bipush        67 // 'C'
    27: if_icmpne     35
    30: aload_0
    31: iconst_3
    32: invokevirtual #2 // Method java/lang/String.charAt:(I)C
    35: bipush        75 // 'K'
    37: if_icmpne     35
    40: iconst_1
    41: ireturn`
  };

  const handleTestKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = keyInput.trim().toUpperCase();

    // A senha correta deduzida do desmonte é "H4CK"
    if (cleanKey === "H4CK" || cleanKey.startsWith("H4CK")) {
      setIsSuccess(true);
      setAnalysisResult(
        `[+] SUCESSO: Instruções condicionais passaram com êxito em [${arch.toUpperCase()}]!\n[+] Rotina de desofuscação acionada na memória.\n\nPARABÉNS! FLAG EXTRAÍDA:\n>>> ${expectedFlag} <<<`
      );
      if (onFlagFound) onFlagFound(expectedFlag);
    } else {
      setIsSuccess(false);
      setAnalysisResult(
        `[-] FALHA NA VALIDAÇÃO: O caractere fornecido não bate com as instruções cmp/bipush de [${arch.toUpperCase()}].\nExamine a tabela de opcodes e valores hexadecimais (ASCII).`
      );
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-purple-950/70 bg-[#090b10] overflow-hidden shadow-2xl font-mono text-sm">
      {/* Bar com arquiteturas */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#0d1017] border-b border-purple-950/60 gap-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-purple-500" />
          <div className="h-3 w-3 rounded-full bg-indigo-500" />
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="ml-2 text-xs font-bold text-purple-400 flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            MULTI-ARCH REVERSE ENGINEERING DECOMPILER (x86_64 / ARM64 / WebAssembly / JVM)
          </span>
        </div>

        {/* Seletor de Arquitetura */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          {(["x86_64", "arm64", "wasm", "jvm"] as const).map((a) => (
            <button
              key={a}
              onClick={() => {
                setArch(a);
                setAnalysisResult("");
                setIsSuccess(false);
              }}
              className={`px-2.5 py-1 rounded text-xs uppercase font-semibold transition ${
                arch === a
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel do Descompilador */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <Binary className="h-3.5 w-3.5 text-purple-400" />
              Ghidra / IDA Pro Decompiler Output [{arch.toUpperCase()}]:
            </span>
            <span className="text-[10px] text-purple-400/80 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              Endianness: Little Endian
            </span>
          </div>

          <pre className="p-4 rounded-lg bg-slate-950 border border-purple-950/80 text-xs text-purple-300/90 font-mono leading-relaxed overflow-x-auto max-h-[300px]">
            {disassemblyData[arch]}
          </pre>
        </div>

        {/* Testador da Chave Reversa */}
        <div className="flex flex-col justify-between p-4 rounded-lg bg-[#0e121c] border border-purple-900/40">
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-2">
              <Search className="h-4 w-4 text-purple-400" />
              Quebre a Verificação de Licença:
            </h4>
            <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
              Analise os opcodes comparativos (cmp, bipush, i32.const) para reconstruir a string secreta que aprova o fluxo de execução.
            </p>

            <form onSubmit={handleTestKey} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Chave Descoberta (ASCII):
                </label>
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-purple-950 focus:border-purple-400 text-purple-300 font-mono text-xs outline-none"
                  placeholder="ex: Senha identificada no código assembly..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                <Play className="h-3.5 w-3.5" />
                Testar Chave Reversa
              </button>
            </form>
          </div>

          {/* Resultado da Análise */}
          <div className="mt-4">
            <pre className={`p-3 rounded text-xs font-mono whitespace-pre-wrap border ${
              isSuccess 
                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                : analysisResult 
                  ? "bg-rose-950/40 border-rose-500/50 text-rose-300" 
                  : "bg-slate-950 border-slate-800 text-slate-500"
            }`}>
              {analysisResult || "// Submeta a chave identificada na rotina de desmonte..."}
            </pre>

            {isSuccess && (
              <button
                type="button"
                onClick={() => {
                  if (onFlagFound) onFlagFound(expectedFlag);
                }}
                className="mt-3 w-full py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono transition"
              >
                Enviar Flag para o Workspace
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
