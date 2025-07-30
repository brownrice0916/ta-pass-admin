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
      router.push("/ceo");
    } else {
      alert("로그인 실패");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* 로고 */}
      <div className="mb-12">
        <div className="flex items-center">
          <span className="text-4xl font-bold">
            <span className="text-blue-500">ta</span>
            <span className="text-green-400">:</span>
            <span className="text-blue-600">pass</span>
          </span>
          <span className="ml-2 text-gray-600 text-lg">Business center</span>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-xl text-gray-800 mb-2">
            티에이패스 비즈니스 센터에 오신 것을 환영합니다.
          </h1>
          <p className="text-gray-600">매장 관리를 위해 로그인해주세요.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-base border-gray-300 rounded-md"
            required
          />

          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 text-base border-gray-300 rounded-md"
            required
          />

          <Button
            type="submit"
            className="w-full h-12 bg-black text-white rounded-md hover:bg-gray-800 text-base font-medium"
          >
            로그인
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            className="text-gray-500 text-sm hover:text-gray-700"
            onClick={() => {
              // 아이디/비밀번호 찾기 로직
              console.log("아이디/비밀번호 찾기");
            }}
          >
            아이디/비밀번호 찾기 {">"}
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-2">
            <span className="font-medium">처음이신가요?</span> 회원가입 후
            매장을 등록해주세요.
          </p>
          <p className="text-blue-500 text-sm mb-6">
            오픈 이벤트! 9월 30일까지 매장등록 완료 시 3개월 무료 이용
          </p>
          <Button
            type="button"
            onClick={() => router.push("/ceo/signup")}
            className="w-full h-12 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-base font-medium"
          >
            회원가입
          </Button>
        </div>
      </div>
    </div>
  );
}
