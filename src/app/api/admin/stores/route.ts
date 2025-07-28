// app/api/admin/stores/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stores = await prisma.restaurant.findMany({
      include: {
        owner: true,
        category: true, // ✅ 카테고리 전체 정보 포함
        subCategory: true, // ✅ 서브카테고리 전체 정보 포함
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(stores);
  } catch (error) {
    console.error("[ADMIN_GET_STORES_ERROR]", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
