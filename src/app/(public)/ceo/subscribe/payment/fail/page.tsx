"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">❌ 결제 실패</h1>
      <p className="text-sm text-gray-700 mb-2">
        결제가 정상적으로 처리되지 않았어요.
      </p>

      {code && (
        <div className="text-xs text-gray-500 mt-2">
          <p>에러 코드: {code}</p>
          <p>사유: {message}</p>
        </div>
      )}

      <button
        className="mt-6 px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        onClick={() => (window.location.href = "/")}
      >
        홈으로 이동
      </button>
    </div>
  );
}
