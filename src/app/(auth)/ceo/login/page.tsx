"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/ceo/dashboard");
    } else {
      alert("로그인 실패");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <form onSubmit={handleLogin} className="space-y-4">
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
        <div className="space-y-2">
          <Button type="submit" className="w-full">
            로그인
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/ceo/signup")}
          >
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
}
