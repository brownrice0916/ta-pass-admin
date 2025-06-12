// app/admin/mypage/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminUser {
  name: string;
  email: string;
  role: string;
  country?: string;
  gender?: string;
}

export default function AdminMyPage() {
  const router = useRouter();
  useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/admin/login");
    },
  });
  const [adminInfo, setAdminInfo] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "" });

  useEffect(() => {
    const fetchAdminInfo = async () => {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setAdminInfo(data);
        setForm({
          name: data.name || "",
        });
      }
      setLoading(false);
    };
    fetchAdminInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const updated = await res.json();
      setAdminInfo((prev) => ({ ...prev!, ...updated }));
      setEditing(false);
    } else {
      alert("수정 실패");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">내 정보</h1>
      <Card className="p-6 space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/4" />
          </>
        ) : adminInfo ? (
          editing ? (
            <>
              <div>
                <strong>이름:</strong>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit}>저장</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  취소
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <strong>이름:</strong> {adminInfo.name}
              </div>
              <div>
                <strong>이메일:</strong> {adminInfo.email}
              </div>
              <div>
                <strong>역할:</strong> {adminInfo.role}
              </div>

              <Button onClick={() => setEditing(true)}>수정</Button>
            </>
          )
        ) : (
          <p>정보를 불러올 수 없습니다.</p>
        )}
      </Card>
    </div>
  );
}
