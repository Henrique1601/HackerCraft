# ⚠️ Gotchas & Armadilhas Conhecidas — HackerCraft

## 1. PowerShell Script Execution & Antivírus (Windows)
- **Problema:** Comandos de PowerShell que combinam pipelines com determinadas keywords de varredura ou nomes como "hacker" podem ser interceptados pelo Windows Defender/AMSI (`ScriptContainedMaliciousContent`).
- **Solução:** Em comandos locais de listagem ou execução de utilitários no Windows, usar `cmd.exe /c "..."` ou scripts Node/npm dedicados quando o PowerShell bloquear.

## 2. Next.js 16 Breaking Changes (`params` assíncronos)
- **Problema:** Em rotas dinâmicas (`[slug]/page.tsx`), o objeto `params` no Next.js 15+ é uma `Promise`. Acesso síncrono dispara runtime error / deprecation warning.
- **Solução:** Tratar sempre com `await params` ou `use(params)` em componentes assíncronos.

## 3. Tailwind CSS v4 & Turbopack
- **Problema:** Tailwind v4 usa `@theme` e diretivas CSS modernas sem necessidade de `tailwind.config.js` tradicional. Modificações globais de estilo devem ser feitas em [globals.css](file:///c:/Users/henri/Programacao/Projetos/HackerCraft/src/app/globals.css).
