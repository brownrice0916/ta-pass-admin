"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (paymentKey && orderId && amount) {
      fetch("/api/payment/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ 결제 성공 처리 완료:", data);
          // ✅ 결제 성공 시 이동
          router.push("/ceo/profile/business");
        })
        .catch((err) => {
          console.error("❌ 결제 검증 실패:", err);
        });
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold text-green-600">✅ 결제 성공!</h1>
    </div>
  );
}
