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

        const { paymentStatus, verificationStatus, setupStatus } = data;
        console.log("data", data);

        console.log(setupStatus);
        if (paymentStatus === "unpaid") {
          router.replace("/ceo/subscribe");
        } else if (setupStatus === "paid_only") {
          router.replace("/ceo/profile/business");
        } else if (setupStatus === "info_filled") {
          router.replace("/ceo/stores"); // ⬅️ 입점신청 버튼 있는 페이지
        } else if (
          setupStatus === "submitted" &&
          verificationStatus === "pending"
        ) {
          router.replace("/ceo/unverified");
        } else if (verificationStatus === "approved") {
          router.replace("/ceo/dashboard");
          setLoading(false); // ✅ 정상 통과
        } else {
          console.warn("Unexpected ceoProfile state", data);
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
