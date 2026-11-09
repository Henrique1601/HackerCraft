# 🏛️ Histórico de Decisões Arquiteturais (ADRs) — HackerCraft

## ADR-001: Next.js 16 + React 19 App Router
- **Status:** Ativo
- **Contexto:** Plataforma interativa rica em SSR, páginas dinâmicas e rotas de API para streaming e IA.
- **Decisão:** Manter Next.js 16 com App Router. Ter cuidado especial com APIs assíncronas do Next.js 15+ (`params`, `searchParams` via Promise) e compatibilidade de pacotes com React 19.

## ADR-002: Gamificação e Sandbox Interativo sem Execução Insegura no Servidor
- **Status:** Ativo
- **Contexto:** Práticas de hacking ético (SQL Injection, XSS, Command Injection) precisam ser simuladas sem expor a infraestrutura do servidor a riscos.
- **Decisão:** Labs utilizam sandboxes reativas simuladas no front-end (`WebVulnerabilitySandbox`, `InteractiveTerminal`) com mock de comandos e injeções pedagógicas controladas.

## ADR-003: Integração com Tutor de IA com TypeSafe AI
- **Status:** Ativo
- **Contexto:** Assistência e dicas contextuais de hacking guiado via Gemini.
- **Decisão:** Rotas de API estruturadas via `@google/genai` com respostas estritas e tratamento de fallback para evitar alucinações técnicas.
