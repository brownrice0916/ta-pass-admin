"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FormValues } from "../../components/store-form";
import StoreFormSkeleton from "../component/store-form-skeleton";

export default function CeoEditPage() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [RestaurantForm, setRestaurantForm] = useState<any>(null);
  const [storeData, setStoreData] = useState<FormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      router.replace("/ceo/login");
      return;
    }

    const fetchStore = async () => {
      const res = await fetch("/api/stores/my");
      if (res.ok) {
        const json = await res.json();
        if (json?.store) {
          setStoreData(json.store);
        }
      }
      setLoading(false);
    };

    fetchStore();
    import("../../components/store-form").then((mod) =>
      setRestaurantForm(() => mod.default)
    );
  }, [session]);

  if (status === "loading" || loading || !RestaurantForm) {
    return <StoreFormSkeleton />;
  }

  return (
    <RestaurantForm
      initialData={storeData || undefined}
      submitButtonText="수정 완료"
    />
  );
}
