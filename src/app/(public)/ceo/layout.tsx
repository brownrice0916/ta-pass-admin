"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

const sidebarItems = [
  { label: "대시보드", href: "/ceo/dashboard" },
  { label: "내 상점 관리", href: "/ceo/stores" },
  { label: "내 정보 관리", href: "/ceo/mypage" },
  { label:'결제 관라',href:"/ceo/billings"}
];

export default function CeoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [paymentStatus, setPaymentStatus] = useState<"paid" | "unpaid" | null>(
    null
  );
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/ceo/profile`);
        const data = await res.json();

        // setPaymentStatus(data.paymentStatus); // "paid" | "unpaid"
        setIsVerified(data.verificationStatus === "approved");
      } catch (err) {
        console.error("CEO 상태 확인 실패:", err);
        //setPaymentStatus(null);
        setIsVerified(null);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [session, status]);

  // 미결제 → 구독페이지로 이동
  // useEffect(() => {
  //   if (paymentStatus === "unpaid" && !pathname.startsWith("/ceo/subscribe")) {
  //     router.replace("/ceo/subscribe");
  //   }
  // }, [paymentStatus, pathname, router]);

  // 승인 안됐는데, 현재 경로가 unverified나 구독이 아니면 → 접근 제한 페이지로
  // useEffect(() => {
  //   if (
  //     isVerified === false &&
  //     !pathname.startsWith("/ceo/unverified") &&
  //     !pathname.startsWith("/ceo/subscribe")
  //   ) {
  //     router.replace("/ceo/unverified");
  //   }
  // }, [isVerified, pathname, router]);

  // if (status === "loading" || paymentStatus === null || isVerified === null) {
  //   return <div className="p-6">로딩 중...</div>;
  // }

  // if (!session?.user) {
  //   return <div className="p-6">로그인이 필요합니다.</div>;
  // }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isVerified && (
        <aside className="w-64 bg-white p-6 border-r space-y-6 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">CEO 대시보드</div>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-4 py-2 rounded transition-colors duration-200",
                  pathname.startsWith(item.href)
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
      )}

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
