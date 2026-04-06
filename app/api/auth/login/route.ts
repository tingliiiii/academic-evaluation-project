import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const correctPassword = process.env.ADMIN_PASSWORD || '0000';

    console.log("Received login attempt with password:", password);
    console.log("Correct password:", correctPassword);
    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}