// src/app/api/restaurants/route.ts  (또는 stores/route.ts)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // 필수 필드 검증
    const requiredFields = ["name", "category", "address", "languages"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // CEO 권한 확인
    if (user.role !== "ceo") {
      return NextResponse.json({ error: "CEO role required" }, { status: 403 });
    }

    // ✅ 트랜잭션: (1) 현재 보유 매장 수 확인 -> (2) 매장 생성 -> (3) 최초면 setupStatus=submitted
    const result = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.restaurant.count({
        where: { ownerId: user.id },
      });

      const restaurant = await tx.restaurant.create({
        data: {
          id: `restaurant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: body.name,
          category: body.category || null, // ⚠️ 관계형이면 connect로 바꿔야 함
          subCategory: body.subCategory || null, // ⚠️ 관계형이면 connect로 바꿔야 함
          description: body.description || "",
          address: body.address,
          addressDetail: body.addressDetail || "",
          latitude: parseFloat(body.latitude) || 0,
          longitude: parseFloat(body.longitude) || 0,
          languages: Array.isArray(body.languages) ? body.languages : [],
          tags: Array.isArray(body.tags) ? body.tags : [],
          socialLinks: body.socialLinks || null,
          about: body.about || "",
          specialOfferType: Array.isArray(body.specialOfferType)
            ? body.specialOfferType
            : [],
          specialOfferText: body.specialOfferText || "",
          specialOfferTextDetail: body.specialOfferTextDetail || "",
          region1: body.region1 || "",
          region2: body.region2 || "",
          region3: body.region3 || "",
          region4: body.region4 || null,
          images: Array.isArray(body.images) ? body.images : [],
          ownerId: user.id,
          updatedAt: new Date(),
        },
      });

      // ✅ 최초 등록일 때만 setupStatus → submitted 로 승격
      if (existingCount === 0) {
        await tx.cEOProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            setupStatus: "submitted",
          },
          update: {
            setupStatus: "submitted",
          },
        });
      }

      return { restaurant, firstTime: existingCount === 0 };
    });

    return NextResponse.json(
      {
        restaurant: result.restaurant,
        store: result.restaurant,
        firstTime: result.firstTime,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Restaurant creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 사용자의 레스토랑 찾기
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: { ownerId: user.id },
    });
    if (!existingRestaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const restaurant = await prisma.restaurant.update({
      where: { id: existingRestaurant.id },
      data: {
        name: body.name,
        category: body.category || null, // ⚠️ 관계형이면 connect로 바꿔야 함
        subCategory: body.subCategory || null, // ⚠️ 관계형이면 connect로 바꿔야 함
        description: body.description || "",
        address: body.address,
        addressDetail: body.addressDetail || "",
        latitude: parseFloat(body.latitude) || 0,
        longitude: parseFloat(body.longitude) || 0,
        languages: Array.isArray(body.languages) ? body.languages : [],
        tags: Array.isArray(body.tags) ? body.tags : [],
        socialLinks: body.socialLinks || null,
        about: body.about || "",
        specialOfferType: Array.isArray(body.specialOfferType)
          ? body.specialOfferType
          : [],
        specialOfferText: body.specialOfferText || "",
        specialOfferTextDetail: body.specialOfferTextDetail || "",
        region1: body.region1 || "",
        region2: body.region2 || "",
        region3: body.region3 || "",
        region4: body.region4 || null,
        images: Array.isArray(body.images) ? body.images : [],
        updatedAt: new Date(),
      },
    });

    // 🔎 업데이트 시에는 별도 승격 없이 그대로 두었음.
    // 원하면 여기서 'paid_only' -> 'info_filled' 같은 단계 승격을 넣을 수 있어요.

    return NextResponse.json({ restaurant, store: restaurant });
  } catch (error) {
    console.error("Restaurant update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
