/**
 * POST /api/auth/logout
 * 後端登出端點：清除 HttpOnly Cookie
 */

import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 建立回應
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 }
    );

    // 清除認證 Cookie
    response.cookies.delete("academic_eval_auth");

    return response;
  } catch (error) {
    console.error("Error during logout:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
