"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // 이미 로그인된 경우 대시보드로 강제 이동
    if (status === "authenticated") {
      router.replace("/admin/dashboard");
    }
  }, [status, session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/admin/dashboard");
    } else {
      alert("로그인 실패");
    }
  };

  // 세션 로딩 중이면 렌더링 보류
  if (status === "loading" || status === "authenticated") {
    return null;
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-20 space-y-4">
      <Input
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" className="w-full">
        로그인
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => router.push("/admin/signup")}
      >
        회원가입
      </Button>
    </form>
  );
}
