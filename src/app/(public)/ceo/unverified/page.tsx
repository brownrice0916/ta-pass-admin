"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

type VerificationStatus = "pending" | "approved" | "rejected";

export default function UnverifiedPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/ceo/profile/${session.user.id}`);
        const data = await res.json();
        setStatus(data.verificationStatus);
      } catch (error) {
        console.error("승인 상태 불러오기 실패:", error);
      }
    };

    fetchStatus();
  }, [session?.user?.id]);

  if (status === null) {
    return <div className="p-6 text-center">로딩 중...</div>;
  }

  return (
    <div className="p-6 text-center space-y-4">
      <p className="text-lg font-semibold text-red-500">
        {status === "rejected"
          ? "승인 거부되었습니다."
          : "접근이 제한되었습니다."}
      </p>
      <p className="text-sm text-gray-600">
        {status === "rejected"
          ? "제출한 정보가 승인되지 않았습니다. 다시 제출해주세요."
          : "관리자 승인 후 이용하실 수 있습니다."}
      </p>

      {status === "rejected" && (
        <Link
          href="/ceo/resubmit"
          className="inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          다시 제출하기
        </Link>
      )}

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
