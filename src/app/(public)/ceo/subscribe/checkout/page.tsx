"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cardNumberOnly = cardNumber.replace(/\s/g, "");
    const isValidCardNumber = /^\d{16}$/.test(cardNumberOnly);
    const isValidExpiry = /^\d{2}\/\d{2}$/.test(expiry);

    if (!name.trim()) return setError("카드 소유자 이름을 입력해주세요.");
    if (!isValidCardNumber)
      return setError("카드 번호를 16자리 숫자로 입력해주세요.");
    if (!isValidExpiry)
      return setError("유효기간은 MM/YY 형식으로 입력해주세요.");

    setError("");
    setLoading(true);

    try {
      // 👉 서버에 결제 완료 상태 업데이트 요청
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

      // ✅ 성공 시 매장 등록 페이지로 이동
      router.push("/ceo/stores");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "결제 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4"
    >
      <h2 className="text-xl font-bold">카드 정보 입력</h2>

      {error && (
        <div className="text-red-500 text-sm border border-red-300 rounded p-2 bg-red-50">
          {error}
        </div>
      )}

      <input
        className="w-full border rounded p-2"
        placeholder="카드 소유자 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border rounded p-2"
        placeholder="카드 번호 (16자리)"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />

      <input
        className="w-full border rounded p-2"
        placeholder="유효기간 (MM/YY)"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
      >
        {loading ? "처리 중..." : "결제 정보 입력"}
      </button>
    </form>
  );
}
