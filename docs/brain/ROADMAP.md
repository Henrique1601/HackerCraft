# 🗺️ Roadmap & Backlog — HackerCraft

## Versão Atual: v1.2.0 (Novembro 2026)

### ✅ Entregas Concluídas (Sprint Labs & Desafios)
1. **Interactive Terminal v2:**
   - Adicionado buffer e navegação de histórico de comandos (`↑` / `↓`).
   - Adicionado autocompletar inteligente via tecla `Tab`.
   - Adicionadas ferramentas simuladas: `gobuster`, `curl`, `hashcat`/`john`, `msfconsole`, `whoami`, `id`, `uname -a`.
2. **Command Injection Multi-Stack Sandbox:**
   - Suporte simultâneo a 4 tecnologias de backend com código vulnerável exposto: **PHP** (`shell_exec`), **Node.js** (`child_process.exec`), **Python Flask** (`subprocess.check_output`) e **Bash CGI** (`eval`).
   - Terminal interativo de execução remota com bypass via `;`, `&&`, `||`, pipes e captura da flag em `/secret_flag.txt`.
3. **Engenharia Reversa Multi-Arquitetura (Polyglot Decompiler):**
   - Descompilador estilo Ghidra/IDA Pro cobrindo **x86_64** (Intel/AMD), **AArch64** (ARM64), **WebAssembly (WASM)** e **JVM / Smali Bytecode**.
   - Rotina interativa de quebra de licença com análise de opcodes ASCII comparativos.
4. **Criptoanálise & Quebra de Chaves (RSA Weak Keys & XOR):**
   - Laboratório interativo de fatoração RSA com parâmetros vulneráveis ($n = 3233, e = 17, p = 61, q = 53$).
   - Módulo auxiliar para quebra de cifra XOR byte a byte em hexadecimal.
5. **IDOR & SSRF em Nuvem:**
   - Injeção e manipulação de parâmetros em endpoints REST para escalação horizontal de privilégios (`id=1` SuperAdmin).
   - Simulação de exfiltração de metadados em nuvem AWS (`169.254.169.254`).
6. **Persistência Global de Progresso do Aluno (`ProgressProvider`):**
   - LocalStorage persistente gravando flags resolvidas, XP acumulado, subida dinâmica de nível e cálculo em tempo real na barra de navegação superior.
