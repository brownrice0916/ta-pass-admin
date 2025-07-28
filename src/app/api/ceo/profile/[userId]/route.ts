import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  }

  const userId = parseInt(context.params.userId); // ✅ 여기서 context 사용
  if (session.user.id !== userId) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const ceoProfile = await prisma.cEOProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      businessName: true,
      businessNumber: true,
      verificationStatus: true,
      registrationImage: true,
    },
  });

  if (!ceoProfile) {
    return NextResponse.json({ error: "프로필 없음" }, { status: 404 });
  }

  return NextResponse.json(ceoProfile);
}
