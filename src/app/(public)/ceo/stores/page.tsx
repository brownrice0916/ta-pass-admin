"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormValues } from "../components/store-form";
import StoreInfoTable from "./component/store-info-table"; // 스켈레톤 포함 Table
import { Skeleton } from "@/components/ui/skeleton";

export default function Stores() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [storeData, setStoreData] = useState<FormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [RestaurantForm, setRestaurantForm] = useState<any>(null);

  // 로그인 체크 및 데이터 패칭
  useEffect(() => {
    if (!session?.user) {
      router.replace("/ceo/login");
      return;
    }

    const fetchStore = async () => {
      try {
        const res = await fetch("/api/stores/my");
        const json = await res.json();

        if (json?.store) {
          setStoreData(json.store);
        }
      } catch (err) {
        console.error("매장 조회 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();

    import("../components/store-form").then((mod) =>
      setRestaurantForm(() => mod.default)
    );
  }, [session]);

  // ✅ 스켈레톤 UI 렌더
  if (status === "loading" || !RestaurantForm) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-4">
        <Skeleton className="w-40 h-6" />
        <Skeleton className="w-full h-[400px] rounded-md" />
      </div>
    );
  }

  if (!loading && !storeData) {
    return (
      <RestaurantForm initialData={undefined} submitButtonText="등록하기" />
    );
  }

  return (
    <StoreInfoTable storeData={storeData} router={router} loading={loading} />
  );
}
