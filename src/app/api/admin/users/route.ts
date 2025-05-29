// app/api/admin/users/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    where: { role: "user" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      country: true,
      gender: true,
      birthYear: true,
      birthMonth: true,
      birthDay: true,
      membershipType: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}
