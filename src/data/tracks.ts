export interface Track {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  color: string;
  totalModules: number;
  totalXp: number;
  difficulty: "Iniciante" | "Intermediário" | "Avançado" | "Expert";
  icon: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  xp: number;
  description: string;
  challenges: Challenge[];
}

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  difficulty: "Fácil" | "Médio" | "Difícil" | "Insano";
  category: "Web" | "Scripting" | "Malware" | "Reversing" | "Network" | "Blue Team";
  xp: number;
  description: string;
  objective: string;
  terminalInitialText?: string;
  initialCode?: string;
  language?: "python" | "bash" | "c" | "sql";
  hints: string[];
  flag: string;
  interactiveType: "terminal" | "code_editor" | "web_vulnerability";
}

export const TRACKS: Track[] = [
  {
    id: "fundamentos-redes",
    slug: "fundamentos-redes",
    title: "01. Redes Ofensivas & Reconhecimento",
    subtitle: "Mapeamento e análise furtiva de alvos",
    description: "Domine a base da internet como um invasor. Aprenda arquitetura TCP/IP, varredura com Nmap, análise de pacotes com Scapy e identificação de superfícies de ataque.",
    badge: "RECON SPECIALIST",
    color: "from-emerald-500 to-cyan-500",
    totalModules: 4,
    totalXp: 1200,
    difficulty: "Iniciante",
    icon: "Network",
    modules: [
      {
        id: "mod-nmap",
        title: "Varredura e Mapeamento de Portas com Nmap",
        duration: "45 min",
        xp: 300,
        description: "Aprenda a detectar portas abertas, versões de serviços e firewalls usando varreduras SYN furtivas.",
        challenges: [
          {
            id: "chal-nmap-recon",
            slug: "nmap-stealth-scan",
            title: "Descoberta de Serviços Ocultos (Port Scan)",
            difficulty: "Fácil",
            category: "Network",
            xp: 150,
            description: "Um servidor interno está rodando um serviço de controle de acesso não documentado em uma porta alta.",
            objective: "Execute um port scan no alvo '10.10.13.37' para descobrir a porta vulnerável e ler a flag do banner do serviço.",
            terminalInitialText: "hacker@kali:~$ # Digite 'help' para ver os comandos disponíveis\nhacker@kali:~$ ",
            interactiveType: "terminal",
            hints: [
              "Tente usar 'nmap -sS -p- 10.10.13.37' ou use 'scan 10.10.13.37'.",
              "Após encontrar a porta aberta (ex: 8888), use 'nc 10.10.13.37 <porta>' para ler o banner."
            ],
            flag: "FLAG{nmap_stealth_recon_mastered_2026}"
          }
        ]
      }
    ]
  },
  {
    id: "web-pentest",
    slug: "web-pentest",
    title: "02. Web Pentesting & OWASP Top 10",
    subtitle: "Infiltração em aplicações modernas",
    description: "Explore as maiores falhas da web na prática: SQL Injection, Cross-Site Scripting (XSS), Quebra de Autenticação, SSRF e execução remota de código.",
    badge: "WEB BREAKER",
    color: "from-cyan-500 to-blue-500",
    totalModules: 6,
    totalXp: 2400,
    difficulty: "Intermediário",
    icon: "Globe",
    modules: [
      {
        id: "mod-sqli",
        title: "Bypass de Autenticação via SQL Injection",
        duration: "60 min",
        xp: 400,
        description: "Compreenda como consultas dinâmicas não sanitizadas permitem que invasores façam bypass de login sem senha.",
        challenges: [
          {
            id: "chal-sqli-bypass",
            slug: "sqli-login-bypass",
            title: "Quebra de Login Administrativo com SQLi",
            difficulty: "Médio",
            category: "Web",
            xp: 200,
            description: "O portal de login vulnerável utiliza concatenação direta de strings na query SQL.",
            objective: "Injete um payload clássico de SQL injection no formulário para autenticar como admin e extrair a flag.",
            interactiveType: "web_vulnerability",
            hints: [
              "O código no backend executa: SELECT * FROM users WHERE username = 'USER' AND password = 'PASS'",
              "Se o username fechar a aspa e adicionar uma condição sempre verdadeira com comentário (ex: admin' OR '1'='1' --), a senha será ignorada!"
            ],
            flag: "FLAG{sqli_auth_bypass_admin_pwned}"
          }
        ]
      }
    ]
  },
  {
    id: "scripting-ofensivo",
    slug: "scripting-ofensivo",
    title: "03. Automação Ofensiva em Python",
    subtitle: "Crie suas próprias armas digitais",
    description: "Pare de ser apenas um 'script kiddie'. Crie seus próprios scanners multithread, ferramentas de brute-force de credenciais, spiders e listeners de shell.",
    badge: "EXPLOIT DEV",
    color: "from-amber-500 to-orange-500",
    totalModules: 5,
    totalXp: 2100,
    difficulty: "Intermediário",
    icon: "Terminal",
    modules: [
      {
        id: "mod-py-brute",
        title: "Brute-Forcer Multithread de SSH & FTP",
        duration: "50 min",
        xp: 350,
        description: "Construa um script rápido de quebra de senhas utilizando a biblioteca paramiko/socket do Python.",
        challenges: [
          {
            id: "chal-py-brute",
            slug: "python-brute-forcer",
            title: "Desenvolva um Script de Password Cracking",
            difficulty: "Médio",
            category: "Scripting",
            xp: 250,
            language: "python",
            initialCode: `# HackerCraft Python Exploit Sandbox
import socket

def test_password(target_ip, port, username, password):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(2)
    try:
        s.connect((target_ip, port))
        # Complete a lógica para enviar as credenciais e validar se login teve sucesso
        # Dica: leia a resposta do servidor com s.recv(1024)
        return False
    except Exception as e:
        return False
    finally:
        s.close()
`,
            description: "Um alvo possui autenticação básica em texto claro. Crie o loop de verificação para encontrar a senha correta.",
            objective: "Complete o script para iterar na wordlist e capturar a flag de acesso.",
            interactiveType: "code_editor",
            hints: [
              "Envie o comando no formato 'USER nome\\r\\nPASS senha\\r\\n'.",
              "Verifique se o retorno contém '230 Login successful' ou similar."
            ],
            flag: "FLAG{python_custom_socket_bruter_crafted}"
          }
        ]
      }
    ]
  },
  {
    id: "malware-dev",
    slug: "malware-dev",
    title: "04. Malware Dev & AV Evasion (Ético)",
    subtitle: "Engenharia de ameaças e evasão defensiva",
    description: "Estude o funcionamento interno de malwares: injeção de processos (Process Hollowing, DLL Injection), criptografia de payloads, ofuscação de strings e técnicas de bypass de EDR.",
    badge: "MALWARE ARCHITECT",
    color: "from-rose-500 to-red-600",
    totalModules: 5,
    totalXp: 3000,
    difficulty: "Avançado",
    icon: "ShieldAlert",
    modules: [
      {
        id: "mod-process-injection",
        title: "Injeção de Shellcode em Processos Remotos",
        duration: "75 min",
        xp: 500,
        description: "Aprenda como payloads são alocados diretamente na memória de processos legítimos (como svchost ou explorer) sem tocar o disco.",
        challenges: [
          {
            id: "chal-shellcode-loader",
            slug: "in-memory-payload-loader",
            title: "Loader em C: Alocação de Memória Virtual",
            difficulty: "Difícil",
            category: "Malware",
            xp: 350,
            language: "c",
            initialCode: `// HackerCraft Memory Payload Injection Lab
#include <windows.h>
#include <stdio.h>

unsigned char payload[] = "\\x90\\x90\\xcc"; // NOP NOP INT3 (PoC)

int main() {
    // 1. Alocar memória executável usando VirtualAlloc
    // LPVOID mem = VirtualAlloc(NULL, sizeof(payload), MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);
    // 2. Copiar payload com RtlMoveMemory
    // 3. Executar criando Thread ou ponteiro de função
    return 0;
}
`,
            description: "Analise a técnica de carregamento em memória para entender como malwares evitam assinaturas estáticas de antivírus baseados em hash de arquivo.",
            objective: "Identifique a API do Windows necessária para alterar a proteção de memória para PAGE_EXECUTE_READ e executar o payload.",
            interactiveType: "code_editor",
            hints: [
              "A API clássica para alocar é VirtualAlloc.",
              "Para alterar a proteção após a escrita utilize VirtualProtect para evitar chamar atenção com PAGE_EXECUTE_READWRITE direto."
            ],
            flag: "FLAG{in_memory_evasion_virtual_protect_bypass}"
          }
        ]
      }
    ]
  },
  {
    id: "reversing-binarios",
    slug: "reversing-binarios",
    title: "05. Engenharia Reversa & Binários (Pwn)",
    subtitle: "Dissecando arquivos binários e exploração de memória",
    description: "Compreenda código em Assembly x86/x64, use descompiladores como Ghidra, explore Buffer Overflows e entenda proteções como NX/DEP, ASLR e Canary.",
    badge: "BINARY REVERSER",
    color: "from-purple-500 to-indigo-600",
    totalModules: 5,
    totalXp: 3200,
    difficulty: "Expert",
    icon: "Cpu",
    modules: [
      {
        id: "mod-buffer-overflow",
        title: "Exploração de Stack Overflow Clássico",
        duration: "90 min",
        xp: 600,
        description: "Subscreva o ponteiro de retorno (EIP/RIP) na pilha de execução para redirecionar o fluxo do programa para uma função oculta.",
        challenges: [
          {
            id: "chal-bof-pwn",
            slug: "stack-buffer-overflow",
            title: "Sobrescrevendo o Instruction Pointer (RIP)",
            difficulty: "Difícil",
            category: "Reversing",
            xp: 400,
            description: "Um binário compila uma função vulnerável 'gets()' sem checagem de tamanho no buffer de 64 bytes.",
            objective: "Calcule o offset exato de preenchimento até o registro RIP para pular direto para a função secret_admin().",
            terminalInitialText: "hacker@kali:~$ ./vuln_server\n[+] Buffer alocado em: 0x7fffffffe000 (Tamanho: 64 bytes)\n[?] Digite seu payload:\n",
            interactiveType: "terminal",
            hints: [
              "Gere um padrão cíclico com 'msf-pattern_create -l 100'.",
              "Descubra em qual caractere o RIP foi sobrescrito (normalmente 72 bytes em arquiteturas 64-bit com RBP alinhado)."
            ],
            flag: "FLAG{rip_overwritten_jump_to_secret_admin_pwned}"
          }
        ]
      }
    ]
  },
  {
    id: "blue-team-forense",
    slug: "blue-team-forense",
    title: "06. Blue Team, SOC & Análise Forense",
    subtitle: "Caça a ameaças, regras YARA e remoção de vírus",
    description: "O verdadeiro hacker também sabe defender e caçar invasores. Aprenda a escrever regras YARA para detectar vírus, analisar dumps de memória e erradicar persistências.",
    badge: "SOC HUNTER",
    color: "from-blue-600 to-teal-500",
    totalModules: 4,
    totalXp: 2000,
    difficulty: "Intermediário",
    icon: "Search",
    modules: [
      {
        id: "mod-yara",
        title: "Detecção de Ameaças com Regras YARA",
        duration: "45 min",
        xp: 350,
        description: "Construa assinaturas baseadas em padrões de strings, hashes e sequências de bytes hexadecimais para classificar malwares.",
        challenges: [
          {
            id: "chal-yara-rule",
            slug: "crafting-yara-rule",
            title: "Crie uma Regra YARA contra Trojan de Acesso Remoto",
            difficulty: "Médio",
            category: "Blue Team",
            xp: 250,
            language: "bash",
            initialCode: `rule Detect_Rat_Sample {
    meta:
        author = "HackerCraft Blue Team"
        description = "Detecta payload ofuscado de RAT"
    strings:
        // Identifique as strings características do malware
        $str1 = "evil_c2_server"
        $str2 = "powershell -enc"
    condition:
        // Complete a condição para disparar alerta
        any of them
}
`,
            description: "Analise as amostras de binários infectados e termine de parametrizar a regra YARA para isolar a ameaça.",
            objective: "Escreva a regra e execute a validação no diretório /malware_samples.",
            interactiveType: "code_editor",
            hints: [
              "Verifique se as strings contêm modificadores como 'ascii' ou 'wide'.",
              "Use 'uint16(0) == 0x5A4D' para garantir que se trata de um executável PE do Windows."
            ],
            flag: "FLAG{yara_threat_hunter_rule_deployed}"
          }
        ]
      }
    ]
  }
];
