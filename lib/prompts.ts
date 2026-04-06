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
 * 從資料庫取得四字箴言和語氣，生成 Prompt
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

  // ✅ 使用 Promise.all 並行執行兩個獨立的查詢
  // 這避免了瀑布效應，提升性能
  const [wisdoms, tone] = await Promise.all([
    prisma.wisdom.findMany({
      where: {
        id: {
          in: wisdomIds,
        },
        isActive: true,
      },
    }),
    prisma.tone.findUnique({
      where: { id: toneId },
    }),
  ]);

  if (wisdoms.length === 0) {
    throw new Error("Selected wisdoms not found or are inactive");
  }

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
 * ✅ 改進：不再依賴脆弱的字符串搜尋，而是驗證實際的內容變數
 * @param prompt - 生成的 Prompt
 * @param studentName - 學生姓名（應該已插入到 Prompt 中）
 * @param wisdomTexts - 四字箴言文字（應該已插入到 Prompt 中）
 * @returns 是否有效
 */
export function validatePrompt(
  prompt: string,
  studentName?: string,
  wisdomTexts?: string
): boolean {
  // 基本檢查
  if (!prompt || prompt.length < 50) {
    return false;
  }

  // 如果提供了具體值，驗證這些值是否已成功插入
  if (studentName && !prompt.includes(studentName)) {
    return false;
  }
  if (wisdomTexts && !prompt.includes(wisdomTexts)) {
    return false;
  }

  // 確保 Prompt 包含基本的結構（模板標籤）
  return prompt.includes("【學生姓名】") && prompt.includes("【評語重點");
}