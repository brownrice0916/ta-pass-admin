"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CeoRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch("/api/ceo/profile");
        const data = await res.json();

        if (data.paymentStatus === "unpaid") {
          router.replace("/ceo/subscribe");
        } else if (data.verificationStatus !== "approved") {
          router.replace("/ceo/unverified");
        } else {
          setLoading(false); // ✅ 통과
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return <div className="p-6">로딩 중...</div>;
  }

  return <>{children}</>;
}
