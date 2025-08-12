// prisma/seed.categories.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ===== 네가 준 매핑 그대로 넣음 =====
const categoryMap: Record<string, string> = {
  맛집: "food",
  쇼핑: "shopping",
  관광명소: "attraction",
  체험: "experience",
  웰니스: "wellness",
  나이트라이프: "nightlife",
};

const subCategoryMap: Record<string, Record<string, string>> = {
  맛집: {
    전체: "all",
    한식: "korean",
    분식: "snack",
    "카페/디저트": "cafe",
    고기구이: "bbq",
    해산물: "seafood",
    "채식/비건": "vegan",
    "바/펍": "bar",
    "다국적/퓨전": "fusion",
    패스트푸드: "fastfood",
  },
  쇼핑: {
    전체: "all",
    "패션/의류": "fashion",
    "화장품/뷰티": "beauty",
    "기념품/특산품": "souvenir",
    "백화점/쇼핑몰": "department",
  },
  체험: {
    전체: "all",
    한복체험: "hanbok",
    클래스: "class",
    공예체험: "craft",
    "콘서트 & 공연": "concert",
    "야외 액티비티": "outdoor",
    케이팝: "kpop",
  },
  웰니스: {
    전체: "all",
    "스파/마사지": "spa",
    "요가/명상": "yoga",
    뷰티케어: "beautycare",
  },
  나이트라이프: {
    전체: "all",
    클럽: "club",
    루프탑바: "rooftop",
    "재즈바/공연바": "jazzbar",
    "포장마차/포차": "pocha",
  },
};

async function main() {
  // 1) 카테고리 먼저 upsert(키 기준)
  const createdCategories = [];
  for (const [name, key] of Object.entries(categoryMap)) {
    const cat = await prisma.category.upsert({
      where: { key }, // key가 @unique
      create: { name, key },
      update: { name }, // 이름 수정 필요 없으면 생략 가능
      select: { id: true, key: true, name: true },
    });
    createdCategories.push(cat);
  }

  // 2) 서브카테고리 벌크 insert 준비
  const subRows: { name: string; key: string; categoryId: string }[] = [];

  for (const [catName, subs] of Object.entries(subCategoryMap)) {
    const key = categoryMap[catName];
    const cat = createdCategories.find((c) => c.key === key);
    if (!cat) {
      console.warn(`⚠️ 카테고리(${catName})를 찾을 수 없어 서브카테고리 스킵`);
      continue;
    }
    for (const [subName, subKey] of Object.entries(subs)) {
      subRows.push({
        name: subName,
        key: subKey,
        categoryId: cat.id,
      });
    }
  }

  // 3) createMany (중복 무시) — @@unique([categoryId, name]) 기준으로 스킵됨
  if (subRows.length) {
    await prisma.subCategory.createMany({
      data: subRows,
      skipDuplicates: true,
    });
  }

  console.log("✅ 카테고리/서브카테고리 시드 완료");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
