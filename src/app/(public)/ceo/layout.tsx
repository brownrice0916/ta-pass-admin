"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // 세션 가져오기

const sidebarItems = [
  { label: "대쉬보드", href: "/ceo/dashboard" },
  { label: "내 상점 관리", href: "/ceo/stores" },
  { label: "내 정보 관리", href: "/ceo/mypage" },
];

export default function CeoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // 세션 로딩 중일 때 로딩 상태 반환 (선택사항)
  if (status === "loading") {
    return <div className="p-6">로딩 중...</div>;
  }

  // 로그인 안되어있을 때 -> 메뉴 숨기기
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6 border-r space-y-4">
        <h2 className="text-xl font-bold mb-4">관리자 메뉴</h2>
        {isLoggedIn ? (
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-4 py-2 rounded hover:bg-gray-200",
                  pathname.startsWith(item.href) && "bg-gray-300 font-semibold"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : (
          <p className="text-sm text-gray-500">로그인이 필요합니다.</p>
        )}
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
