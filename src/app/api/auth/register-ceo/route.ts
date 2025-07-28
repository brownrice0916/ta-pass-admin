import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      email,
      password,
      name,
      businessName,
      businessNumber,
      registrationImage,
    } = await req.json();

    // 입력값 검증
    if (!email || !password || !name || !businessName || !businessNumber) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다." },
        { status: 400 }
      );
    }

    // 트랜잭션으로 중복 검사와 생성을 동시에 처리
    const result = await prisma.$transaction(async (tx) => {
      // 이메일 중복 검사
      const existingUser = await tx.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existingUser) {
        throw new Error("이미 가입된 이메일입니다.");
      }

      // 사업자번호 중복 검사
      const existingBusiness = await tx.cEOProfile.findUnique({
        where: { businessNumber },
      });

      if (existingBusiness) {
        throw new Error("이미 등록된 사업자번호입니다.");
      }

      // 비밀번호 해싱
      const hashed = await hash(password, 10);

      // 사용자 생성
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashed,
          name: name.trim(),
          role: "ceo",
          ceoProfile: {
            create: {
              businessName: businessName.trim(),
              businessNumber: businessNumber.trim(),
              registrationImage,
              // registrationFileType 필드가 스키마에 있다면 추가
              // registrationFileType,
            },
          },
        },
        include: {
          ceoProfile: true,
        },
      });

      return user;
    });

    // 성공 응답 (비밀번호 제외)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = result;

    return NextResponse.json({
      success: true,
      userId: result.id,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("CEO 회원가입 에러:", error);

    // 알려진 에러 처리
    if (error.message === "이미 가입된 이메일입니다.") {
      return NextResponse.json(
        { error: "이미 가입된 이메일입니다." },
        { status: 400 }
      );
    }

    if (error.message === "이미 등록된 사업자번호입니다.") {
      return NextResponse.json(
        { error: "이미 등록된 사업자번호입니다." },
        { status: 400 }
      );
    }

    // Prisma 에러 처리
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      if (field === "email") {
        return NextResponse.json(
          { error: "이미 가입된 이메일입니다." },
          { status: 400 }
        );
      }
      if (field === "businessNumber") {
        return NextResponse.json(
          { error: "이미 등록된 사업자번호입니다." },
          { status: 400 }
        );
      }
    }

    // 기타 에러
    return NextResponse.json(
      { error: "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
