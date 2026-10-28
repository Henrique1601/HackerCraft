import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { message, challengeTitle, challengeCategory, currentCode, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback didático caso ainda não haja chave de API configurada no .env
      return NextResponse.json({
        reply: `[HACKER TUTOR OFFLINE SIMULATOR]\n\nVocê está enfrentando o desafio "${challengeTitle}" (${challengeCategory}).\n\n💡 Dica Heurística: Inspecione as chamadas de sistema ou as queries enviadas. Se estiver lidando com entrada de usuário sem sanitização, procure fechar a string com aspas simples (' ou ") ou verifique os limites de buffer na memória.\n\nPara ativar o tutor com IA real completa, configure GEMINI_API_KEY no arquivo .env.`
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
Você é o "HackerCraft Cyber Tutor", um mentor sênior de Pentest, Engenharia Reversa, Exploit Development e Cibersegurança Ofensiva e Defensiva.
Seu tom é técnico, perspicaz, hacker ético, encorajador e direto ao ponto.

SUAS DIRETRIZES FUNDAMENTAIS:
1. O aluno está aprendendo no laboratório prático "${challengeTitle}" (${challengeCategory}).
2. NUNCA ENTREGUE A FLAG DIRETAMENTE (ex: não diga "A flag é FLAG{...}").
3. Ensine o método científico: como pensar como um invasor (Red Team) e como auditar/corrigir como Blue Team.
4. Se o aluno compartilhar código ou comandos com erro, aponte onde está o gargalo ou a vulnerabilidade lógica e instrua ele a testar.
5. Seja conciso, use formatação markdown elegante com blocos de código quando apropriado.
    `;

    const prompt = `
Contexto do Desafio Atual:
- Título: ${challengeTitle}
- Categoria: ${challengeCategory}
- Código/Terminal Atual do Aluno:
\`\`\`
${currentCode || "Nenhum código submetido ainda"}
\`\`\`

Dúvida/Comando do Aluno:
"${message}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      }
    });

    const reply = response.text || "Sem resposta do tutor no momento. Tente novamente.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Erro na API do Hacker Tutor:", error);
    return NextResponse.json(
      { 
        reply: "⚠️ Erro ao consultar a rede neural do Hacker Tutor. Verifique sua conexão e tente novamente.",
        error: error.message 
      },
      { status: 500 }
    );
  }
}
