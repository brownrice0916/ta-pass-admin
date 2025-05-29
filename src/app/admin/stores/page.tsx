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
import Image from "next/image";

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
      <h2 className="text-xl font-bold mb-4">스토어 목록</h2>
      <DataTable columns={columns} data={stores} />

      <Dialog
        open={!!selectedStore}
        onOpenChange={() => setSelectedStore(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>스토어 상세</DialogTitle>
          </DialogHeader>
          {selectedStore && (
            <div className="space-y-2 text-sm">
              <div>
                <strong>상호명:</strong> {selectedStore.name}
              </div>
              <div>
                <strong>카테고리:</strong> {selectedStore.category} /{" "}
                {selectedStore.subCategory}
              </div>
              <div>
                <strong>주소:</strong> {selectedStore.address}
              </div>
              <div>
                <strong>평점:</strong> {selectedStore.rating ?? "없음"}
              </div>
              <div>
                <strong>등록일:</strong>{" "}
                {new Date(selectedStore.createdAt).toLocaleDateString()}
              </div>
              <div>
                <strong>CEO ID:</strong>{" "}
                {selectedStore.owner
                  ? `${selectedStore.owner.name} (${selectedStore.owner.email})`
                  : "없음"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
