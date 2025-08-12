"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const search = useSearchParams();
  const router = useRouter();
  const calledRef = useRef(false);

  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false); // ✅ 성공 시 모달 열기
  const [loading, setLoading] = useState(true); // 로딩 스피너

  useEffect(() => {
    const paymentKey = search.get("paymentKey");
    const orderId = search.get("orderId");
    const amountParam = search.get("amount");

    if (calledRef.current) return;
    if (!paymentKey || !orderId || !amountParam) {
      setError("필수 파라미터가 없습니다.");
      setLoading(false);
      return;
    }

    calledRef.current = true;

    (async () => {
      try {
        const amount = Number(amountParam);
        if (!Number.isFinite(amount))
          throw new Error("금액 파라미터가 유효하지 않습니다.");

        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "결제 승인 실패");

        // ✅ 승인 성공 → 모달 오픈, 배경은 계속 '승인 중' 화면 유지
        setModalOpen(true);
      } catch (e: any) {
        setError(e.message || "결제 승인 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [search]);

  const goNext = () => {
    setModalOpen(false);
    router.replace("/ceo/profile/business"); // 필요 시 다른 경로로 교체
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">결제 승인 실패</h1>
          <p className="mt-2 text-gray-700">{error}</p>
        </div>
      ) : (
        <div className="text-center">
          {/* ✅ 메인 화면은 항상 '승인 중'으로 유지 */}
          <h1 className="text-2xl font-bold text-gray-800">결제 승인 중</h1>
          <div className="mt-3 flex items-center justify-center gap-2 text-gray-700">
            {loading && (
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"
                aria-hidden
              />
            )}
            <span>결제 승인 처리를 진행하고 있습니다…</span>
          </div>
        </div>
      )}

      {/* ✅ 승인 완료 모달 */}
      {modalOpen && !error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg text-center">
            <h2 className="text-lg font-bold text-gray-900">
              결제가 완료되었습니다
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              확인을 누르면 다음 단계로 이동합니다.
            </p>
            <button
              onClick={goNext}
              className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
