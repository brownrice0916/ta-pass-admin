// app/admin/dashboard/stores/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/admin/data-table";

import RestaurantForm, { FormValues } from "@/app/ceo/components/store-form";
import ExcelImport from "../../component/excel-import";
import TableSkeleton from "../../component/table-skeleton";
import { DialogTitle } from "@radix-ui/react-dialog";

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
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      const res = await fetch("/api/admin/stores");
      const data = await res.json();
      setStores(data);
      setLoading(false);
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
      // 모달 닫기, 성공 모달 열기는 이제 onSuccess에서 통제
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
      {loading ? (
        <TableSkeleton columns={columns.length} />
      ) : (
        <DataTable columns={columns} data={stores} />
      )}
      <Dialog
        open={!!selectedStore}
        onOpenChange={() => setSelectedStore(null)}
      >
        <DialogTitle className="sr-only"></DialogTitle>
        <DialogContent className="max-w-4xl max-h-screen overflow-y-scroll">
          {selectedStore && (
            <RestaurantForm
              initialData={selectedStore as any}
              submitButtonText="수정 완료"
              redirectPath="/admin/stores"
              onSuccess={() => {
                setSelectedStore(null); // ✅ 모달 닫기
                setShowSuccessModal(true);
              }}
              // @ts-expect-error: 타입이 일시적으로 any라 무시
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md text-center">
          <div>
            <DialogTitle>수정 완료</DialogTitle>
          </div>
          <p className="mb-6">스토어 정보가 성공적으로 수정되었습니다.</p>
          <Button onClick={() => setShowSuccessModal(false)}>확인</Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
