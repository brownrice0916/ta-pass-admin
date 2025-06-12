import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, context: any) {
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

  await prisma.cEOProfile.update({
    where: { userId: id },
    data: { verificationStatus },
  });

  return NextResponse.json({ success: true });
}
