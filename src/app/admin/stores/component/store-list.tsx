// app/admin/dashboard/stores/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/admin/data-table";

import RestaurantForm, { FormValues } from "@/app/ceo/components/store-form";
import ExcelImport from "../../component/excel-import";

interface Store {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  address: string;
  rating?: number;
  createdAt: string;
  owner?: {
    id: number;
    name: string;
    email: string;
  };
  // 추가 필드
  description?: string;
  about?: string;
  specialOfferText?: string;
  specialOfferTextDetail?: string;
  specialOfferType?: string[];
  tags?: string[];
  addressDetail?: string;
  latitude?: number;
  longitude?: number;
  region1?: string;
  region2?: string;
  region3?: string;
  region4?: string;
  openingHoursText?: string;
  images?: string[];
  languages?: string[];
  socialLinks?: Array<{ platform: string; url: string }>;
}

export default function StoreListPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      const res = await fetch("/api/admin/stores");
      const data = await res.json();
      setStores(data);
    };
    fetchStores();
  }, []);

  const handleUpdate = async (updated: FormValues) => {
    const res = await fetch(`/api/admin/stores/${selectedStore?.id}`, {
      method: "PUT",
      body: JSON.stringify(updated),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const updatedStore = await res.json();
      setStores((prev) =>
        prev.map((store) =>
          store.id === updatedStore.id ? updatedStore : store
        )
      );
      setSelectedStore(null);
    } else {
      alert("업데이트 실패");
    }
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "상호명", accessor: "name" },
    { header: "카테고리", accessor: "category" },
    { header: "세부카테고리", accessor: "subCategory" },
    { header: "주소", accessor: "address" },
    {
      header: "CEO ID",
      accessor: "owner",
      render: (row: Store) =>
        row.owner ? `${row.owner.name} (${row.owner.email})` : "없음",
    },
    {
      header: "",
      accessor: "action",
      render: (row: Store) => (
        <Button size="sm" onClick={() => setSelectedStore(row)}>
          상세
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">스토어 목록</h2>
        <ExcelImport /> {/* ✅ 엑셀 업로드 버튼 */}
      </div>
      <DataTable columns={columns} data={stores} />

      <Dialog
        open={!!selectedStore}
        onOpenChange={() => setSelectedStore(null)}
      >
        <DialogContent className="max-w-4xl max-h-screen overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>스토어 상세 및 수정</DialogTitle>
          </DialogHeader>
          {selectedStore && (
            <RestaurantForm
              initialData={selectedStore as any}
              submitButtonText="수정 완료"
              // @ts-ignore
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
