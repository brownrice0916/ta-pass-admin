// ✅ 서버용 비동기 컴포넌트가 아니라 클라이언트 전용이므로 비동기 함수 제거
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { categoryMap, subCategoryMap } from "@/types/category";
import { FormValues } from "../components/store-form";

export default function Stores() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [storeData, setStoreData] = useState<FormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [RestaurantForm, setRestaurantForm] = useState<any>(null);

  useEffect(() => {
    if (!session?.user) {
      router.replace("/ceo/login");
      return;
    }

    const fetchStore = async () => {
      const res = await fetch("/api/stores/my");
      const json = await res.json();
      console.log("📦 store fetch result:", json); // 👉 요거 추가

      if (json?.store) {
        setStoreData(json.store);
      }
      setLoading(false);
    };

    fetchStore();

    import("../components/store-form").then((mod) =>
      setRestaurantForm(() => mod.default)
    );
  }, [session]);

  if (status === "loading" || loading || !RestaurantForm) {
    return <p>로딩 중...</p>;
  }

  if (!storeData) {
    return (
      <RestaurantForm initialData={undefined} submitButtonText="등록하기" />
    );
  }

  const mainCategoryLabel = Object.entries(categoryMap).find(
    ([, val]) => val === storeData.category
  )?.[0];
  const subCategoryLabel = storeData.subCategory
    ? Object.entries(subCategoryMap[storeData.category] || {}).find(
        ([, val]) => val === storeData.subCategory
      )?.[0]
    : undefined;

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">내 매장 정보</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-2">
        <p>
          <strong>상호명:</strong> {storeData.name}
        </p>
        <p>
          <strong>카테고리:</strong> {mainCategoryLabel}{" "}
          {subCategoryLabel && `> ${subCategoryLabel}`}
        </p>
        <p>
          <strong>주소:</strong> {storeData.address}
        </p>
        <p>
          <strong>영업시간:</strong> {storeData.openingHoursText}
        </p>
        <p>
          <strong>언어:</strong> {storeData.languages?.join(", ")}
        </p>
        <p>
          <strong>소개:</strong> {storeData.description}
        </p>
        <button
          onClick={() => router.push("/ceo/edit")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          수정하기
        </button>
      </div>
    </div>
  );
}
