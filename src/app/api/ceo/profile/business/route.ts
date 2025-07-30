// src/app/api/ceo/profile/business/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.cEOProfile.update({
    where: { userId: user.id },
    data: {
      businessNumber: body.businessNumber,
      businessName: body.businessName,
      ceoName: body.ceoName,
      address: body.address,
      addressDetail: body.addressDetail,
      startDate: new Date(body.startDate),
      setupStatus: "info_filled",
    },
  });

  return NextResponse.json({ message: "CEO 정보 업데이트 완료" });
}
