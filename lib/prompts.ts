// lib/prompts.ts
import prisma from "./prisma";

export interface PromptTemplateParams {
  studentName: string;
  wisdomIds: string[];
  toneId: string;
}

export interface PromptTemplateResult {
  prompt: string;
  metadata: {
    studentName: string;
    wisdoms: string[];
    toneName: string;
  };
}

/**
 * 從數據庫獲取四字箴言和語氣，生成 Prompt
 */
export async function generatePromptTemplate(
  params: PromptTemplateParams
): Promise<PromptTemplateResult> {
  const { studentName, wisdomIds, toneId } = params;

  // 驗證輸入
  if (!studentName || studentName.trim().length === 0) {
    throw new Error("Student name is required");
  }

  if (!wisdomIds || wisdomIds.length === 0) {
    throw new Error("At least one wisdom must be selected");
  }

  if (!toneId) {
    throw new Error("Tone is required");
  }

  // 從數據庫獲取選中的箴言
  const wisdoms = await prisma.wisdom.findMany({
    where: {
      id: {
        in: wisdomIds,
      },
      isActive: true,
    },
  });

  if (wisdoms.length === 0) {
    throw new Error("Selected wisdoms not found or are inactive");
  }

  // 從數據庫獲取語氣
  const tone = await prisma.tone.findUnique({
    where: { id: toneId },
  });

  if (!tone || !tone.isActive) {
    throw new Error("Selected tone not found or is inactive");
  }

  // 構建 Prompt
  const wisdomTexts = wisdoms.map((w) => w.content).join("、");

  const prompt = buildEvaluationPrompt({
    studentName,
    wisdoms: wisdomTexts,
    tone: tone.name,
    toneDescription: tone.description ?? undefined,
  });

  return {
    prompt,
    metadata: {
      studentName,
      wisdoms: wisdoms.map((w) => w.content),
      toneName: tone.name,
    },
  };
}

/**
 * 構建評語 Prompt 的模板
 */
function buildEvaluationPrompt(params: {
  studentName: string;
  wisdoms: string;
  tone: string;
  toneDescription?: string;
}): string {
  const { studentName, wisdoms, tone, toneDescription } = params;

  return `你是一位經驗豐富的教師，請根據以下要求為學生撰寫期末評語。

【學生姓名】
${studentName}

【評語重點（四字箴言）】
${wisdoms}

【評語語氣和風格】
${tone}
${toneDescription ? `具體要求：${toneDescription}` : ""}

【評語要求】
1. 評語長度：200-300 字
2. 結構清晰：
   - 首段：總體評價
   - 中段：具體例子和亮點分析（針對上述四字箴言）
   - 末段：鼓勵和期許
3. 語調：${tone}
4. 避免：
   - 重複使用相同短語
   - 過度修飾
   - 有歧義的表述
5. 包含：
   - 對學生優點的具體認可
   - 針對四字箴言的實例說明
   - 對未來的建議和期許

請生成評語（直接輸出評語文本，無需額外說明）：`;
}

/**
 * 驗證 Prompt 格式是否正確
 */
export function validatePrompt(prompt: string): boolean {
  return !!(
    prompt &&
    prompt.length > 50 && // 最少字數
    prompt.includes("學生姓名") &&
    prompt.includes("四字箴言")
  );
}

export default {
  generatePromptTemplate,
  buildEvaluationPrompt,
  validatePrompt,
};