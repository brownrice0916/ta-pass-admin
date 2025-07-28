import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, context: { params: any }) {
  const id = parseInt(context.params.id);
  const { verificationStatus } = await req.json();

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  if (!["pending", "approved", "rejected"].includes(verificationStatus)) {
    return NextResponse.json(
      { error: "Invalid verification status" },
      { status: 400 }
    );
  }

  const existingProfile = await prisma.cEOProfile.findUnique({
    where: { userId: id },
  });

  if (!existingProfile) {
    return NextResponse.json(
      { error: "해당 유저의 프로필이 없습니다." },
      { status: 404 }
    );
  }

  await prisma.cEOProfile.update({
    where: { userId: id },
    data: { verificationStatus },
  });

  return NextResponse.json({ success: true });
}
