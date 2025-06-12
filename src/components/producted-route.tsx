"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      // 로그인 안했으면
      if (pathname.startsWith("/admin")) {
        router.replace("/admin/login");
      } else if (pathname.startsWith("/ceo")) {
        router.replace("/ceo/login");
      } else {
        router.replace("/login");
      }
      return;
    }

    // 로그인은 했는데 role 체크
    const userRole = session.user?.role;

    if (pathname.startsWith("/admin") && userRole !== "admin") {
      router.replace("/admin/login"); // ❌ 권한 없음
    }
    if (pathname.startsWith("/ceo") && userRole !== "ceo") {
      router.replace("/ceo/login"); // ❌ 권한 없음
    }
  }, [status, session, pathname, router]);

  if (status === "loading" || !session) {
    return null; // 세션 확인될 때까지 화면 안 보여줌
  }

  return <>{children}</>;
}
