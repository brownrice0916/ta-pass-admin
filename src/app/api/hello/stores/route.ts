// app/api/stores/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const newStore = await prisma.store.create({
    data: {
      name: data.name,
      description: data.description,
      address: data.address,
    },
  });

  return NextResponse.json(newStore);
}
