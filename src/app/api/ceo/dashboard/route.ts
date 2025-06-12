// src/app/api/ceo/dashboard/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfWeek, subWeeks, format } from "date-fns";

// BigInt JSON 대응
function replacer(key: string, value: any) {
  return typeof value === "bigint" ? Number(value) : value;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ceo = await prisma.user.findUnique({
      where: { email: user.email },
      include: { stores: true },
    });

    if (!ceo || ceo.role !== "ceo" || ceo.stores.length === 0) {
      return NextResponse.json({ error: "No store found" }, { status: 404 });
    }

    const store = ceo.stores[0];
    const now = new Date();

    // 1. 한달간 조회수
    const totalViews = await prisma.restaurant.findUnique({
      where: { id: store.id },
      select: { viewCount: true },
    });

    const weeklyStats = await Promise.all(
      Array.from({ length: 4 }, (_, i) => {
        const weekStart = startOfWeek(subWeeks(now, 3 - i), {
          weekStartsOn: 1,
        });
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const formattedWeek = `${format(weekStart, "yyyy-MM-dd")} ~ ${format(
          weekEnd,
          "yyyy-MM-dd"
        )}`;

        const startDate = weekStart;
        const endDate = new Date(weekEnd.getTime() + 86400000); // 다음날 0시

        // 두 카운트 동시 수행
        return Promise.all([
          prisma.restaurantViewLog.count({
            where: {
              restaurantId: store.id,
              viewedAt: {
                gte: startDate,
                lt: endDate,
              },
            },
          }),
          prisma.bookmark.count({
            where: {
              restaurantId: store.id,
              createdAt: {
                gte: startDate,
                lt: endDate,
              },
            },
          }),
        ]).then(([viewCount, bookmarkCount]) => ({
          week: formattedWeek,
          views: viewCount,
          bookmarks: bookmarkCount,
        }));
      })
    );

    // 3. 최신 리뷰 3개
    const latestReviews = await prisma.review.findMany({
      where: { restaurantId: store.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { user: true },
    });

    return new NextResponse(
      JSON.stringify(
        {
          totalViewsLastMonth: totalViews?.viewCount ?? 0,
          weeklyStats,
          latestReviews: latestReviews.map((r) => ({
            id: r.id,
            content: r.content,
            rating: r.rating,
            createdAt: r.createdAt.toISOString().split("T")[0],
            userName: r.user?.name || "익명",
          })),
        },
        replacer
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Dashboard Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
