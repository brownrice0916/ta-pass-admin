"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPageWrapper() {
  const { data: session } = useSession({ required: true });
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.replace("/admin/login");
      return;
    } else {
      router.replace("/admin/dashboard");
    }
  }, [session]);

  return;
}
