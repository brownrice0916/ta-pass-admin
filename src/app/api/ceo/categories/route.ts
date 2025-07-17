import { prisma } from "@/lib/prisma"; // prisma client 경로에 맞게 수정
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: {
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[GET /api/ceo/categories]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
