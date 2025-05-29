import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    email,
    password,
    name,
    businessName,
    businessNumber,
    registrationImage,
  } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "이미 가입된 이메일입니다." },
      { status: 400 }
    );
  }

  const hashed = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      role: "ceo", // ✅ 여기만 바뀐 부분
      ceoProfile: {
        create: {
          businessName,
          businessNumber,
          registrationImage, // 혹시 이미지도 등록하면 포함
        },
      },
    },
  });

  return NextResponse.json({ success: true, userId: user.id });
}
