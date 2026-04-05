// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);
const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.0-flash";

export const geminiModel = genAI.getGenerativeModel({
  model: modelName,
});

/**
 * 呼叫 Gemini API 生成評語
 * @param prompt - 發送給 Gemini 的 prompt
 * @returns 生成的評語內容
 */
export async function generateEvaluation(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate evaluation: ${error.message}`);
    }
    throw error;
  }
}

/**
 * 流式生成評語（用於前端實時展示）
 * @param prompt - 發送給 Gemini 的 prompt
 */
export async function* streamGenerateEvaluation(
  prompt: string
): AsyncGenerator<string> {
  try {
    const result = await geminiModel.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    throw error;
  }
}

export default geminiModel;