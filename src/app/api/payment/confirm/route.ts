import { NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SECRET_KEY = "test_sk_AQ92ymxN34RZjybgEgXOrajRKXvd";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { paymentKey, orderId, amount } = await req.json();

  try {
    const response = await axios.post(
      "https://api.tosspayments.com/v1/payments/confirm",
      { paymentKey, orderId, amount },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${SECRET_KEY}:`).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    const savedPayment = await prisma.payment.create({
      data: {
        paymentKey: data.paymentKey,
        orderId: data.orderId,
        amount: data.totalAmount,
        orderName: data.orderName,
        customerName: data.customerName ?? null,
        status: data.status,
        method: data.method,
        approvedAt: new Date(data.approvedAt),
      },
    });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { ceoProfile: true },
    });

    if (!user?.ceoProfile) {
      return NextResponse.json({ message: "CEO 프로필 없음" }, { status: 404 });
    }

    const planKey = extractPlanKeyFromOrderId(orderId);

    await prisma.cEOProfile.update({
      where: { id: user.ceoProfile.id },
      data: {
        paymentStatus: "paid",
        setupStatus: "paid_only",
        paymentPlan: planKey,
      },
    });

    return NextResponse.json({
      message: "결제 성공",
      payment: savedPayment,
    });
  } catch (error: any) {
    console.error("❌ 결제 검증 실패:", error.response?.data || error.message);
    return NextResponse.json(
      {
        message: "결제 검증 실패",
        error: error.response?.data || error.message,
      },
      { status: 400 }
    );
  }
}

function extractPlanKeyFromOrderId(
  orderId: string
): "single" | "multi" | "special" {
  if (orderId.includes("single")) return "single";
  if (orderId.includes("multi")) return "multi";
  if (orderId.includes("special")) return "special";
  return "single"; // fallback
}
