import { NextResponse } from 'next/server';
import { z } from 'zod';

// 驗證請求 schema
const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 驗證請求數據
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Password is required",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { password } = validation.data;
    const correctPassword = process.env.ADMIN_PASSWORD || '0000';

    console.log("Received login attempt with password:", password);
    console.log("Correct password:", correctPassword);
    
    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      // 密碼錯誤返回 401（認證失敗）
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}