// /app/api/ceo/profile/payment/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { paymentStatus } = data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { ceoProfile: true },
    });

    if (!user?.ceoProfile) {
      return NextResponse.json(
        { error: "No CEO profile found" },
        { status: 404 }
      );
    }

    const updated = await prisma.cEOProfile.update({
      where: { id: user.ceoProfile.id },
      data: {
        paymentStatus,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
