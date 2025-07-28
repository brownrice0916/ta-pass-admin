import { prisma } from "@/lib/prisma";
import { subDays, startOfDay } from "date-fns";
import { NextResponse } from "next/server";

export async function GET() {
  const totalUsers = await prisma.user.count({
    where: { role: "user" }, // 일반 유저
  });
  const totalCeos = await prisma.user.count({
    where: { role: "ceo" }, // CEO 유저
  });
  const totalStores = await prisma.restaurant.count();
  const totalReviews = await prisma.review.count();
  const usedSerials = await prisma.serialNumber.count({
    where: { isUsed: true },
  });

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      ceoProfile: { select: { id: true } }, // CEO 여부 판단용
    },
  });
  const recentStores = await prisma.restaurant.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      address: true,
      owner: {
        select: {
          email: true,
        },
      },
    },
  });

  // 최근 7일 일자별 시리얼넘버 사용 수
  const today = new Date();
  const dailySerialUsage: { date: string; count: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const dayStart = startOfDay(subDays(today, i));
    const dayEnd = startOfDay(subDays(today, i - 1));

    const count = await prisma.serialNumber.count({
      where: {
        isUsed: true,
        usedAt: {
          gte: dayStart,
          lt: dayEnd,
        },
      },
    });

    dailySerialUsage.push({
      date: dayStart.toISOString().slice(0, 10), // yyyy-mm-dd
      count,
    });
  }

  return NextResponse.json({
    totalUsers,
    totalCeos,
    totalStores,
    totalReviews,
    usedSerials,
    recentUsers,
    recentStores,
    dailySerialUsage,
  });
}
