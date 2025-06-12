"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AdminSignupPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    if (res.ok) {
      alert("관리자 계정이 생성되었습니다.");
      router.push("/admin/login");
    } else {
      alert(result.error || "에러 발생");
    }
  };
  const fields = [
    { label: "이메일", name: "email", type: "text" },
    { label: "비밀번호", name: "password", type: "password" },
    { label: "이름", name: "name", type: "text" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle>👤 관리자 회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <Label className="mb-1" htmlFor={field.name}>
                  {field.label}
                </Label>
                <Input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={(form as any)[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <Button type="submit" className="w-full">
              관리자 가입
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
