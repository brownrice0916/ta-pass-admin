// /app/api/admin/serials/delete/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const ids: string[] = body.ids || [];

  if (ids.length === 0) {
    return new NextResponse("삭제할 id가 없습니다", { status: 400 });
  }

  await prisma.serialNumber.deleteMany({
    where: { id: { in: ids } },
  });

  return NextResponse.json({ success: true });
}
