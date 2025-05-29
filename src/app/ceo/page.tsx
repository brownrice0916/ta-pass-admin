// ✅ 서버용 비동기 컴포넌트가 아니라 클라이언트 전용이므로 비동기 함수 제거
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CeoDashboardPageWrapper() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.replace("/ceo/login");
      return;
    } else {
      router.replace("/ceo/dashboard");
    }
  }, [session]);

  return <div>Go to Somewhere</div>;
}
