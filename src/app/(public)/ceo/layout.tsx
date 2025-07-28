"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const sidebarItems = [
  { label: "대시보드", href: "/ceo/dashboard" },
  { label: "내 상점 관리", href: "/ceo/stores" },
  { label: "내 정보 관리", href: "/ceo/mypage" },
];

export default function CeoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCeoVerification = async () => {
      if (!session?.user) return;

      try {
        const res = await fetch(`/api/ceo/profile/${session.user.id}`);
        const data = await res.json();
        if (data.verificationStatus === "approved") {
          setIsVerified(true);
        } else {
          // pending 또는 rejected이면 대시보드 진입 차단
          setIsVerified(false);
        }
      } catch (err) {
        console.error("CEO 상태 확인 실패:", err);
        setIsVerified(false);
      }
    };

    if (status === "authenticated") {
      checkCeoVerification();
    }
  }, [session, status]);

  if (status === "loading" || isVerified === null) {
    return <div className="p-6">로딩 중...</div>;
  }

  if (!session?.user) {
    return <div className="p-6">로그인이 필요합니다.</div>;
  }

  if (!isVerified) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-lg font-semibold text-red-500">
          접근이 제한되었습니다.
        </p>
        <p className="text-sm text-gray-600">
          관리자 승인 후 이용하실 수 있습니다.
        </p>
        <Link
          onClick={() => signOut({ callbackUrl: "/" })}
          href="/"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          홈으로
        </Link>
      </div>
    );
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
