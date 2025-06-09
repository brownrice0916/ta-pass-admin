"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const sidebarItems = [
  { label: "대쉬보드", href: "/admin/dashboard" },
  { label: "유저 관리", href: "/admin/users" },
  { label: "CEO 관리", href: "/admin/ceos" },
  { label: "상점 관리", href: "/admin/stores" },
  { label: "시리얼 넘버 관리", href: "/admin/serial" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // 로그인 상태 확인
  useEffect(() => {
    if (status !== "loading" && !session?.user) {
      router.replace("/admin/login");
    }
  }, [session, status]);

  if (status === "loading" || !session?.user) {
    return null; // 혹은 Skeleton UI
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6 border-r space-y-4">
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
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
