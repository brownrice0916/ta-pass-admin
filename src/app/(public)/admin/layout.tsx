"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const sidebarItems = [
  { label: "대쉬보드", href: "/admin/dashboard" },
  { label: "유저 관리", href: "/admin/users" },
  { label: "CEO 관리", href: "/admin/ceos" },
  { label: "상점 관리", href: "/admin/stores" },
  { label: "시리얼 넘버 관리", href: "/admin/serial" },
  { label: "내 정보 관리", href: "/admin/mypage" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6 border-r flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">관리자 메뉴</h2>
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
        </div>

        {/* 로그아웃 버튼 */}
        <Button onClick={handleLogout} className="w-full mt-6">
          로그아웃
        </Button>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
