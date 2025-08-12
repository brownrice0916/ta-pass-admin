import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SECRET_KEY = process.env.TOSS_SECRET_KEY!;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { paymentKey, cancelReason } = await req.json();

  // 결제가 현재 로그인 사용자 소유인지 확인
  const payment = await prisma.payment.findFirst({
    where: { paymentKey, user: { email: session.user.email } },
  });
  if (!payment) {
    return NextResponse.json(
      { message: "결제를 찾을 수 없습니다." },
      { status: 404 }
    );
  }
  if (payment.status === "CANCELED") {
    return NextResponse.json(
      { message: "이미 취소된 결제입니다." },
      { status: 400 }
    );
  }

  try {
    const r = await fetch(
      `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${SECRET_KEY}:`).toString("base64"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cancelReason: cancelReason || "사용자 요청" }),
      }
    );

    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json(
        { message: "취소 실패", error: data },
        { status: 400 }
      );
    }

    // DB 동기화
    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: data.status, // 보통 CANCELED
        canceledAt: data.canceledAt ? new Date(data.canceledAt) : new Date(),
        cancelReason: cancelReason || "사용자 요청",
      },
    });

    return NextResponse.json({ message: "취소 완료", payment: updated });
  } catch (e: any) {
    return NextResponse.json(
      { message: "취소 중 오류", error: e?.message },
      { status: 500 }
    );
  }
}
