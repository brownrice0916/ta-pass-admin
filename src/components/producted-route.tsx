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
      if (
        pathname.startsWith("/admin") &&
        !pathname.startsWith("/admin/login")
      ) {
        router.replace("/admin/login");
        return;
      }
      if (pathname.startsWith("/ceo") && !pathname.startsWith("/ceo/login")) {
        router.replace("/ceo/login");
        return;
      }
      return;
    }

    // 로그인은 했는데 role 체크
    const userRole = session.user?.role;

    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      if (userRole !== "admin") {
        router.replace("/admin/login");
        return;
      }
    }

    if (pathname.startsWith("/ceo") && !pathname.startsWith("/ceo/login")) {
      if (userRole !== "ceo") {
        router.replace("/ceo/login");
        return;
      }
    }
  }, [status, session, pathname, router]);

  if (status === "loading" || (!session && !pathname.includes("login"))) {
    return null;
  }

  return <>{children}</>;
}
