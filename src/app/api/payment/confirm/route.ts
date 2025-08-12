// app/api/payment/confirm/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const TOSS_SECRET_KEY =
  process.env.TOSS_SECRET_KEY || process.env.SECRET_KEY || "";

const isValidSecretKey = (k: string) => /^(test|live)_sk_/.test(k);

const PLAN_PRICES = { single: 30000, multi: 59000, special: 99000 } as const;
type PlanKey = keyof typeof PLAN_PRICES;

function extractPlanKeyFromOrderId(orderId: string): PlanKey {
  if (orderId.includes("single")) return "single";
  if (orderId.includes("multi")) return "multi";
  if (orderId.includes("special")) return "special";
  return "single";
}

export async function POST(req: Request) {
  // 0) 시크릿키 점검
  if (!isValidSecretKey(TOSS_SECRET_KEY)) {
    return NextResponse.json(
      {
        message:
          "Server misconfigured: TOSS_SECRET_KEY (test_sk_... / live_sk_...) missing or invalid",
      },
      { status: 500 }
    );
  }

  // 1) 세션 확인
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2) 바디 파싱 + 금액 숫자 변환
  const body = await req.json().catch(() => ({}));
  const paymentKey = body?.paymentKey as string | undefined;
  const orderId = body?.orderId as string | undefined;
  const amountRaw = body?.amount as number | string | undefined;
  const amount = typeof amountRaw === "string" ? Number(amountRaw) : amountRaw;

  if (!paymentKey || !orderId || !Number.isFinite(amount)) {
    return NextResponse.json(
      {
        message: "Invalid payload",
        got: { paymentKey, orderId, amount: amountRaw },
      },
      { status: 400 }
    );
  }

  // 3) 유저 id 확보
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  // 4) 서버 금액 검증
  const planKey = extractPlanKeyFromOrderId(orderId);
  const expectedAmount = PLAN_PRICES[planKey];
  if (expectedAmount !== amount) {
    return NextResponse.json(
      { message: "금액 검증 실패", expectedAmount, got: amount },
      { status: 400 }
    );
  }

  try {
    // 5) 토스 결제 승인
    const r = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount: expectedAmount }),
    });

    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json(
        {
          message: "토스 confirm 실패",
          tossError: data,
          sent: { paymentKey, orderId, amount: expectedAmount },
        },
        { status: 400 }
      );
    }

    // 6) 트랜잭션: 결제 upsert + CEOProfile/User 상태 동기화
    const result = await prisma.$transaction(async (tx) => {
      // 멱등 기준: paymentKey(@unique)
      const payment = await tx.payment.upsert({
        where: { paymentKey: data.paymentKey },
        create: {
          // ✅ FK는 직접 userId 대신 connect로!
          user: { connect: { id: user.id } },
          paymentKey: data.paymentKey,
          orderId: data.orderId,
          amount: data.totalAmount,
          orderName: data.orderName,
          customerName: data.customerName ?? null,
          status: data.status,
          method: data.method ?? null,
          approvedAt: data.approvedAt ? new Date(data.approvedAt) : null,
          receiptUrl: data.receipt?.url ?? null,
        },
        update: {
          status: data.status,
          method: data.method ?? null,
          approvedAt: data.approvedAt ? new Date(data.approvedAt) : null,
          receiptUrl: data.receipt?.url ?? null,
          orderId: data.orderId, // 동기화
        },
      });

      // CEOProfile upsert (userId 고유)
      await tx.cEOProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          paymentStatus: "paid",
          setupStatus: "paid_only",
          paymentPlan: planKey,
        },
        update: {
          paymentStatus: "paid",
          setupStatus: "paid_only",
          paymentPlan: planKey,
        },
      });

      // User.paymentStatus 동기화 (UI가 이 값 볼 수도 있음)
      await tx.user.update({
        where: { id: user.id },
        data: { paymentStatus: "paid" },
      });

      return { payment };
    });

    return NextResponse.json({ message: "결제 성공", ...result });
  } catch (e: any) {
    return NextResponse.json(
      { message: "서버 처리 중 예외", error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
