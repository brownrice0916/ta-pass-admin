"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPageWrapper() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session?.user);

  useEffect(() => {
    // 로딩 중일 때는 아무것도 하지 않음
    if (status === "loading") return;

    if (!session?.user) {
      router.replace("/admin/login");
    } else {
      router.replace("/admin/dashboard");
    }
  }, [session, status, router]);

  // 로딩 중일 때 표시할 UI
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  // 리다이렉트 중일 때 표시할 UI (빈 화면 방지)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">리다이렉트 중...</div>
    </div>
  );
}
