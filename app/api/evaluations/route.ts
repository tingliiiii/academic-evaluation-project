// app/api/evaluations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateEvaluation } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { Prisma } from '@prisma/client';

// ============================================================================
// POST: 新增評語 (原 app/api/evaluation/generate/route.ts)
// ============================================================================

const postRequestSchema = z.object({
  prompt: z.string().min(50, "Prompt is too short"),
  studentName: z.string().min(1, "Student name is required"),
  wisdomIds: z.array(z.string()),
  toneId: z.string().min(1, "Tone is required"),
});

async function handlePost(request: NextRequest) {
  try {
    const body = await request.json();

    // 驗證請求
    const validation = postRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { prompt, studentName, wisdomIds, toneId } = validation.data;

    // 1. 呼叫 Gemini API
    const content = await generateEvaluation(prompt);

    // 2. 儲存到資料庫
    // 2.1 找或建立學生
    let student = await prisma.student.findFirst({
      where: { name: studentName },
    });

    if (!student) {
      student = await prisma.student.create({
        data: { name: studentName },
      });
    }

    // 2.2 建立評語記錄
    const evaluation = await prisma.evaluation.create({
      data: {
        studentId: student.id,
        toneId,
        content,
        prompt,
        wisdoms: {
          createMany: {
            data: wisdomIds.map((wisdomId) => ({
              wisdomId,
            })),
          },
        },
      },
      include: {
        student: true,
        tone: true,
        wisdoms: {
          include: {
            wisdom: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: evaluation.id,
          studentName: evaluation.student.name,
          content: evaluation.content,
          createdAt: evaluation.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating evaluation:", error);

    const message =
      error instanceof Error ? error.message : "Failed to generate evaluation";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET: 取得評語列表 (原 app/api/evaluation/generate/list/route.ts)
// ============================================================================

const getQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  studentName: z.string().optional(),
});

async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams);

    // 驗證查詢參數
    const validation = getQuerySchema.safeParse(queryData);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { page, pageSize, studentName } = validation.data;
    const skip = (page - 1) * pageSize;

    // 構建查詢條件
    const where: Prisma.EvaluationWhereInput = {};
    if (studentName) {
      where.student = {
        name: {
          contains: studentName,
          mode: "insensitive",
        },
      };
    }

    // 取得總數
    const total = await prisma.evaluation.count({ where });

    // 取得分頁的評語列表
    const evaluations = await prisma.evaluation.findMany({
      where,
      include: {
        student: true,
        tone: true,
        wisdoms: {
          include: {
            wisdom: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          items: evaluations.map((e) => ({
            id: e.id,
            studentName: e.student.name,
            toneName: e.tone.name,
            wisdoms: e.wisdoms.map((w) => w.wisdom.content),
            createdAt: e.createdAt.toISOString(),
          })),
          pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching evaluations:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch evaluations",
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// 路由處理
// ============================================================================

export async function GET(request: NextRequest) {
  return handleGet(request);
}

export async function POST(request: NextRequest) {
  return handlePost(request);
}