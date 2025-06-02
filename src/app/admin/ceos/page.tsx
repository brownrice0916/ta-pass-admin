// app/admin/dashboard/ceos/page.tsx
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

import Image from "next/image";
import { DataTable } from "@/components/ui/admin/data-table";

interface CEO {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  ceoProfile: {
    businessName: string;
    businessNumber: string;
    registrationImage?: string;
    verificationStatus: "pending" | "approved" | "rejected";
  };
}

export default function CEOListPage() {
  const [ceos, setCeos] = useState<CEO[]>([]);
  const [selectedCeo, setSelectedCeo] = useState<CEO | null>(null);

  useEffect(() => {
    const fetchCeos = async () => {
      const res = await fetch("/api/admin/ceos");
      const data = await res.json();
      setCeos(data);
    };
    fetchCeos();
  }, []);

  const handleApprove = async (id: number) => {
    await fetch(`/api/admin/ceos/${id}/verify`, {
      method: "POST",
      body: JSON.stringify({ verificationStatus: "approved" }),
    });
    setCeos((prev) =>
      prev.map((ceo) =>
        ceo.id === id
          ? {
              ...ceo,
              ceoProfile: {
                ...ceo.ceoProfile,
                verificationStatus: "approved",
              },
            }
          : ceo
      )
    );
    setSelectedCeo(null);
  };

  const handleReject = async (id: number) => {
    await fetch(`/api/admin/ceos/${id}/verify`, {
      method: "POST",
      body: JSON.stringify({ verificationStatus: "rejected" }),
    });
    setCeos((prev) =>
      prev.map((ceo) =>
        ceo.id === id
          ? {
              ...ceo,
              ceoProfile: {
                ...ceo.ceoProfile,
                verificationStatus: "rejected",
              },
            }
          : ceo
      )
    );
    setSelectedCeo(null);
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "이름", accessor: "name" },
    { header: "이메일", accessor: "email" },
    {
      header: "상호명",
      accessor: "businessName",
      render: (row: any) => row?.ceoProfile?.businessName || "정보 없음", // Fallback text if not available
    },
    {
      header: "사업자번호",
      accessor: "businessNumber",
      render: (row: any) => row?.ceoProfile?.businessNumber || "정보 없음",
    },
    {
      header: "승인 상태",
      accessor: "verificationStatus",
      render: (row: any) => {
        const status = row?.ceoProfile?.verificationStatus;
        return status === "approved"
          ? "승인됨"
          : status === "rejected"
          ? "거절됨"
          : "대기중";
      },
    },
    {
      header: "",
      accessor: "action",
      render: (row: CEO) => (
        <Button size="sm" onClick={() => setSelectedCeo(row)}>
          상세
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">CEO 관리</h2>
      <DataTable columns={columns} data={ceos} />

      <Dialog open={!!selectedCeo} onOpenChange={() => setSelectedCeo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CEO 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedCeo && (
            <div className="space-y-2 text-sm">
              <div>
                <strong>이름:</strong> {selectedCeo.name}
              </div>
              <div>
                <strong>이메일:</strong> {selectedCeo.email}
              </div>
              <div>
                <strong>상호명:</strong> {selectedCeo.ceoProfile.businessName}
              </div>
              <div>
                <strong>사업자번호:</strong>{" "}
                {selectedCeo.ceoProfile.businessNumber}
              </div>
              <div>
                <strong>가입일:</strong>{" "}
                {new Date(selectedCeo.createdAt).toLocaleDateString()}
              </div>
              <div>
                <strong>사업자 등록증:</strong>
                {selectedCeo.ceoProfile.registrationImage ? (
                  <Image
                    src={selectedCeo.ceoProfile.registrationImage}
                    alt="등록증 이미지"
                    width={400}
                    height={300}
                    className="rounded border"
                  />
                ) : (
                  <p>이미지 없음</p>
                )}
              </div>
              <div className="flex gap-4 pt-2">
                <Button onClick={() => handleApprove(selectedCeo.id)}>
                  승인하기
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedCeo.id)}
                >
                  거절하기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
