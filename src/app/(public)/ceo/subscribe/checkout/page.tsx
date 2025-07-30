"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CardInputForm from "./component/card-input-form";

export default function CheckoutPage() {
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
      const res = await fetch("/api/ceo/profile/payment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: "paid" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "결제 상태 업데이트 실패");
      }

      router.push("/ceo/stores");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "결제 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardInputForm
      onSubmit={handlePaymentSubmit}
      loading={loading}
      error={error}
    />
  );
}
