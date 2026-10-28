export interface ForumPost {
  id: string;
  slug: string;
  title: string;
  category: "Exploits" | "Malware Analysis" | "Bypass AV/EDR" | "Writeups CTF" | "Red Team Scripts";
  author: string;
  authorBadge: string;
  authorLevel: number;
  createdAt: string;
  upvotes: number;
  repliesCount: number;
  content: string;
  tags: string[];
  solvedChallengeSlug?: string;
  verifiedByAdmin?: boolean;
}

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "post-1",
    slug: "bypass-edr-unhooking-ntdll",
    title: "[TUTORIAL AVANÇADO] Como contornar Hooks de EDR na memória via Direct Syscalls e Fresh NTDLL",
    category: "Bypass AV/EDR",
    author: "0xGhost",
    authorBadge: "CYBER WARLORD",
    authorLevel: 42,
    createdAt: "Há 2 horas",
    upvotes: 84,
    repliesCount: 19,
    tags: ["Syscalls", "EDR Bypass", "C/C++", "Malware Dev"],
    verifiedByAdmin: true,
    content: `
### Introdução ao problema dos Hooks em Ring 3
A maioria dos antivírus e EDRs modernos (CrowdStrike, Defender ATP, SentinelOne) injetam uma DLL de monitoramento no espaço de endereçamento do processo de usuário. Eles sobrescrevem os primeiros bytes de funções críticas de \`ntdll.dll\` (como \`NtAllocateVirtualMemory\` e \`NtCreateThreadEx\`) com uma instrução \`JMP\` (opcode \`0xE9\`), redirecionando a execução para o scanner comportamental da solução de segurança.

\`\`\`assembly
; Bytes originais da NtAllocateVirtualMemory:
mov r10, rcx
mov eax, 0x18 ; SSN (System Service Number)
syscall
ret

; Bytes hookados pelo EDR:
jmp <offset_para_dll_do_edr>
nop
nop
\`\`\`

### Como contornamos isso?
1. **Direct Syscalls (Hell's Gate / Tartarus Gate):** Lemos o arquivo \`ntdll.dll\` do próprio disco (\`C:\\Windows\\System32\\ntdll.dll\`), onde os bytes originais estão limpos (sem hooks de memória).
2. Extraímos a tabela de exportação e calculamos o número do Syscall (\`SSN\`) dinamicamente.
3. Emitimos a instrução \`syscall\` diretamente a partir do nosso próprio stub em Assembly sem passar pela DLL hookada na RAM!
    `
  },
  {
    id: "post-2",
    slug: "script-python-recon-subdominios",
    title: "[SCRIPT PRONTO] Scanner multithread assíncrono em Python com aiohttp para brute-force de vhosts",
    category: "Red Team Scripts",
    author: "null_byte",
    authorBadge: "EXPLOIT DEV",
    authorLevel: 38,
    createdAt: "Ontem às 19:30",
    upvotes: 56,
    repliesCount: 8,
    tags: ["Python", "AsyncIO", "Recon", "Subdomains"],
    verifiedByAdmin: true,
    content: `
Muitos scripts de enumeração de subdomínios e virtual hosts (vhosts) usam \`requests\` síncrono, levando 15 minutos para testar 5.000 palavras.

Construí esse scanner usando \`asyncio\` + \`aiohttp\` que resolve 10.000 requisições com verificação de status code e tamanho de resposta em menos de 18 segundos.

\`\`\`python
import asyncio
import aiohttp

async def check_vhost(session, target_ip, host):
    headers = {'Host': host}
    try:
        async with session.get(f'http://{target_ip}', headers=headers, timeout=2) as resp:
            content = await resp.read()
            if resp.status not in [404, 502]:
                print(f"[+] Alvo encontrado! Host: {host} (Status: {resp.status}, Bytes: {len(content)})")
    except Exception:
        pass
\`\`\`
    `
  },
  {
    id: "post-3",
    slug: "writeup-ctf-sqli-login-bypass",
    title: "[WRITEUP CTF] Análise detalhada do desafio 'Quebra de Login Administrativo com SQLi'",
    category: "Writeups CTF",
    author: "k4li_l1nux",
    authorBadge: "RECON ELITE",
    authorLevel: 29,
    createdAt: "3 dias atrás",
    upvotes: 41,
    repliesCount: 12,
    tags: ["Web", "OWASP", "SQL Injection", "Writeup"],
    solvedChallengeSlug: "sqli-login-bypass",
    verifiedByAdmin: true,
    content: `
### Resumo da Falha
Neste lab prático do HackerCraft, o formulário de login concatena diretamente os valores recebidos via POST na query do PostgreSQL/MySQL.

Ao enviar o payload:
\`admin' OR '1'='1' --\`

A query resultante no banco se torna:
\`SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = 'xxx'\`

O caractere \`--\` (ou \`#\` no MySQL) transforma o restante da verificação de senha em comentário. Como a cláusula \`admin' OR '1'='1'\` é avaliada como verdadeira, o banco autentica imediatamente o usuário administrador, liberando a flag!
    `
  }
];
