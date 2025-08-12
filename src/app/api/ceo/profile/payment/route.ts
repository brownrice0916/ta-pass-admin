// app/api/ceo/profile/payment/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ⚠️ 주의: 이 라우트는 임시 "수동 상태 전환" 용도로만 사용하세요.
// 실제 결제 확정/상태 반영은 반드시 /api/payment/confirm 에서 처리해야 합니다.

type PaymentStatus = "paid" | "unpaid";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const paymentStatus: PaymentStatus = body?.paymentStatus;

  // 유효성 (허용 값만)
  if (paymentStatus !== "paid" && paymentStatus !== "unpaid") {
    return NextResponse.json(
      { error: "Invalid paymentStatus" },
      { status: 400 }
    );
  }

  try {
    // 유저 조회
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, paymentStatus: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 트랜잭션: CEOProfile + User 동기화
    const result = await prisma.$transaction(async (tx) => {
      // CEOProfile가 없으면 생성해서라도 일관성 유지
      const ceo = await tx.cEOProfile.upsert({
        where: { userId: user.id }, // userId는 @unique
        create: {
          userId: user.id,
          paymentStatus,
          // 결제 상태에 따라 setupStatus 기본값도 자연스럽게
          setupStatus: paymentStatus === "paid" ? "paid_only" : "not_started",
        },
        update: {
          paymentStatus,
          // paid로 바꾸면 최소 paid_only까지는 올려둠
          ...(paymentStatus === "paid" ? { setupStatus: "paid_only" } : {}),
        },
      });

      // User.paymentStatus도 함께 맞춰줌(화면이 User쪽을 보는 경우 대비)
      await tx.user.update({
        where: { id: user.id },
        data: { paymentStatus },
      });

      return { ceo };
    });

    return NextResponse.json(result.ceo);
  } catch (err) {
    console.error("ceo/payment PUT error:", (err as any)?.message || err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 선택: 실수 방지용으로 GET만 허용하고 싶다면 아래처럼 막을 수도 있음
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const ceo = await prisma.cEOProfile.findUnique({
    where: { userId: user.id },
  });
  if (!ceo) return NextResponse.json({ paymentStatus: "unpaid" });

  return NextResponse.json({
    paymentStatus: ceo.paymentStatus,
    setupStatus: ceo.setupStatus,
    paymentPlan: ceo.paymentPlan,
  });
}
