"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CeoRouteGuard from "./components/ceo-route-guard";

interface CEOProfile {
  id: string;
  businessName: string;
  businessNumber: string;
  verificationStatus: "pending" | "approved" | "rejected";
  registrationImage?: string;
}

export default function CeoDashboardPageWrapper() {
  const router = useRouter();
  // useEffect(() => {
  //   router.push("/ceo/dashboard");
  // }, []);
  return (
    <CeoRouteGuard>
      <div>main</div>
    </CeoRouteGuard>
  );
}
