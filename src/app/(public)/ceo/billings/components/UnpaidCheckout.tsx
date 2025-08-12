"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CardInputForm from "../../subscribe/checkout/component/card-input-form";

export default function UnpaidCheckout() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePaymentSubmit = async (data: {
    name: string;
    cardNumber: string;
    expiry: string;
  }) => {
    setError("");
    setLoading(true);
    try {
      // 현재는 임시로 결제상태만 갱신
      const res = await fetch("/api/ceo/profile/payment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "paid" }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "결제 상태 업데이트 실패");
      }
      router.refresh(); // 상태 반영
    } catch (e: any) {
      setError(e.message || "결제 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 space-y-3">
      <h3 className="font-semibold">결제 필요</h3>
      <p className="text-sm text-gray-600">
        결제를 완료하면 매장 등록 등 다음 단계로 진행할 수 있어요.
      </p>
      <CardInputForm
        onSubmit={handlePaymentSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
}
