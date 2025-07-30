import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/signup?email=example@email.com
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { success: false, error: "이메일이 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return NextResponse.json({
      success: true,
      exists: !!user,
    });
  } catch (err) {
    console.error("이메일 중복 확인 에러:", err);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
