import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  }

  const url = new URL(req.url);
  const userIdParam = url.pathname.split("/").pop(); // <- 여기로 해결

  if (!userIdParam) {
    return NextResponse.json(
      { error: "userId가 필요합니다." },
      { status: 400 }
    );
  }

  const userId = parseInt(userIdParam);
  if (session.user.id !== userId) {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }

  const ceoProfile = await prisma.cEOProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      businessName: true,
      businessNumber: true,
      verificationStatus: true,
      registrationImage: true,
      createdAt: true,
    },
  });

  if (!ceoProfile) {
    return NextResponse.json({ error: "프로필 없음" }, { status: 404 });
  }

  return NextResponse.json(ceoProfile);
}
