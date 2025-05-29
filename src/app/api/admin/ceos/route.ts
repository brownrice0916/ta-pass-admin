// app/api/admin/ceos/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const ceos = await prisma.user.findMany({
    where: { role: "ceo" },
    include: {
      ceoProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(ceos);
}
