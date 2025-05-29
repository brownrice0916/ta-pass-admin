"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function CEORegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    businessName: "",
    businessNumber: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const router = useRouter(); // ✨ 추가

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 이미지 업로드
    let imageUrl = "";
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      imageUrl = data.url;
    }

    // 회원가입
    const res = await fetch("/api/auth/register-ceo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, registrationImage: imageUrl }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("회원가입 성공!");
      router.push("/ceo"); // ✅ 여기서 메인으로 이동
    } else {
      alert(result.error || "에러 발생!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle>📋 CEO 회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              "email",
              "password",
              "name",
              "businessName",
              "businessNumber",
            ].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{field}</Label>
                <Input
                  type={field === "password" ? "password" : "text"}
                  id={field}
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div>
              <Label htmlFor="registrationImage">사업자등록증 이미지</Label>
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <Button type="submit" className="w-full">
              회원가입
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
