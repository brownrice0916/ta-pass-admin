import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 새 시리얼 생성기
function generateSerial() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segment = () =>
    Array.from({ length: 4 }, () =>
      charset.charAt(Math.floor(Math.random() * charset.length))
    ).join("");

  return `${segment()}-${segment()}-${segment()}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const count = Number(body.count || 10);
  if (!count || count < 1 || count > 1000) {
    return NextResponse.json(
      { error: "1~1000개 사이로 입력해주세요." },
      { status: 400 }
    );
  }

  const serials = Array.from({ length: count }).map(() => ({
    code: generateSerial(),
  }));

  await prisma.serialNumber.createMany({ data: serials });

  const savedSerials = await prisma.serialNumber.findMany({
    orderBy: { createdAt: "desc" },
    take: count,
  });

  return NextResponse.json({ serials: savedSerials });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const serials = await prisma.serialNumber.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(serials);
}
