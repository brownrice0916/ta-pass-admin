// src/app/api/stores/my/route.ts 또는 src/app/api/restaurants/my/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log(session);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 사용자의 레스토랑 찾기
    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: user.id },
    });

    console.log(restaurant);

    return NextResponse.json({
      restaurant,
      store: restaurant, // 호환성을 위해 store 키도 제공
    });
  } catch (error) {
    console.error("Get restaurant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
