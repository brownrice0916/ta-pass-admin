// app/admin/dashboard/serials/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SerialNumber {
  id: string;
  code: string;
  isUsed: boolean;
  expiresAt: string | null;
  createdAt: string;
  usedAt?: string;
  type?: string;
  metadata?: any;
  userId?: number;
  activatedUntil?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function SerialNumberPage() {
  const [count, setCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [generatedSerials, setGeneratedSerials] = useState<string[]>([]);
  const [serials, setSerials] = useState<SerialNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSerials();
  }, []);

  const fetchSerials = async () => {
    const res = await fetch("/api/admin/serials");
    const data = await res.json();
    setSerials(data);
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!count || count <= 0) {
      toast.error("1개 이상 입력해주세요.");
      return;
    }

    setGenerating(true);
    const res = await fetch("/api/admin/serials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ count }),
    });

    const data = await res.json();
    setGeneratedSerials(data.serials || []);
    setGenerating(false);
    toast.success("시리얼 넘버가 생성되었습니다.");
    fetchSerials();
  };

  const renderTable = (list: SerialNumber[]) => (
    <table className="w-full text-sm border mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">코드</th>
          <th className="p-2 border">생성일</th>
          <th className="p-2 border">만료일</th>
          <th className="p-2 border">상태</th>
          <th className="p-2 border">유형</th>
          <th className="p-2 border">사용자</th>
        </tr>
      </thead>
      <tbody>
        {list.map((s) => (
          <tr key={s.id}>
            <td className="p-2 border font-mono">{s.code}</td>
            <td className="p-2 border">
              {new Date(s.createdAt).toLocaleDateString()}
            </td>
            <td className="p-2 border">
              {s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : "-"}
            </td>
            <td className="p-2 border">
              {s.isUsed
                ? "사용됨"
                : s.expiresAt && new Date(s.expiresAt) < new Date()
                ? "만료됨"
                : "미사용"}
            </td>
            <td className="p-2 border">{s.type || "-"}</td>
            <td className="p-2 border">
              {s.user ? `${s.user.name} (${s.user.email})` : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold">시리얼 넘버 생성</h2>
      <div className="flex items-center gap-4">
        <Input
          type="number"
          min={1}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-32"
        />
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? "생성 중..." : "시리얼 생성"}
        </Button>
      </div>
      {generatedSerials.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mb-2">생성된 시리얼</h3>
          <ul className="text-sm bg-gray-50 p-4 rounded border max-h-80 overflow-auto">
            {generatedSerials.map((serial, idx) => (
              <li key={idx} className="font-mono">
                {serial}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-4 border-t">
        <h2 className="text-lg font-semibold mb-2">시리얼 목록</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="unused">미사용</TabsTrigger>
            <TabsTrigger value="used">사용됨</TabsTrigger>
            <TabsTrigger value="expired">만료됨</TabsTrigger>
          </TabsList>
          <TabsContent value="all">{renderTable(serials)}</TabsContent>
          <TabsContent value="unused">
            {renderTable(
              serials.filter(
                (s) =>
                  !s.isUsed &&
                  (!s.expiresAt || new Date(s.expiresAt) >= new Date())
              )
            )}
          </TabsContent>
          <TabsContent value="used">
            {renderTable(serials.filter((s) => s.isUsed))}
          </TabsContent>
          <TabsContent value="expired">
            {renderTable(
              serials.filter(
                (s) => s.expiresAt && new Date(s.expiresAt) < new Date()
              )
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
