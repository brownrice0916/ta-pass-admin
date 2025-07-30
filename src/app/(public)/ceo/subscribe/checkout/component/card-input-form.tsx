"use client";

import { useState, useRef } from "react";

interface CardInputFormProps {
  onSubmit: (data: {
    name: string;
    cardNumber: string;
    expiry: string;
  }) => void;
  loading: boolean;
  error: string;
}

export default function CardInputForm({
  onSubmit,
  loading,
  error,
}: CardInputFormProps) {
  const [name, setName] = useState("");
  const [cardParts, setCardParts] = useState(["", "", "", ""]);
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");

  const cardRefs = [
    useRef<HTMLInputElement>(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const expiryMonthRef = useRef<HTMLInputElement>(null);
  const expiryYearRef = useRef<HTMLInputElement>(null);

  const handleCardInputChange = (index: number, value: string) => {
    if (!/^\d{0,4}$/.test(value)) return;

    const newParts = [...cardParts];
    newParts[index] = value;
    setCardParts(newParts);

    if (value.length === 4 && index < 3) {
      cardRefs[index + 1]?.current?.focus();
    }
  };

  const handleExpiryChange = (type: "month" | "year", value: string) => {
    const regex = /^\d{0,2}$/;
    if (!regex.test(value)) return;

    if (type === "month") {
      setExpiryMonth(value);
      if (value.length === 2) expiryYearRef.current?.focus();
    } else {
      setExpiryYear(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cardNumberOnly = cardParts.join("");
    const isValidCardNumber = /^\d{16}$/.test(cardNumberOnly);
    const expiry = `${expiryMonth}/${expiryYear}`;
    const isValidExpiry = /^\d{2}\/\d{2}$/.test(expiry);

    if (!name.trim()) return alert("카드 소유자 이름을 입력해주세요.");
    if (!isValidCardNumber)
      return alert("카드 번호를 16자리 숫자로 입력해주세요.");
    if (!isValidExpiry) return alert("유효기간은 MM/YY 형식으로 입력해주세요.");

    onSubmit({ name, cardNumber: cardNumberOnly, expiry });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded shadow max-w-md mx-auto"
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

      {/* 카드 번호 4칸 */}
      <div className="flex gap-2">
        {cardParts.map((part, i) => (
          <input
            key={i}
            ref={cardRefs[i]}
            className="w-1/4 border rounded p-2 text-center"
            maxLength={4}
            inputMode="numeric"
            placeholder="0000"
            value={part}
            onChange={(e) => handleCardInputChange(i, e.target.value)}
          />
        ))}
      </div>

      {/* 유효기간 MM / YY */}
      <div className="flex gap-2 items-center">
        <input
          ref={expiryMonthRef}
          className="w-1/2 border rounded p-2 text-center"
          maxLength={2}
          inputMode="numeric"
          placeholder="MM"
          value={expiryMonth}
          onChange={(e) => handleExpiryChange("month", e.target.value)}
        />
        <span className="text-gray-500">/</span>
        <input
          ref={expiryYearRef}
          className="w-1/2 border rounded p-2 text-center"
          maxLength={2}
          inputMode="numeric"
          placeholder="YY"
          value={expiryYear}
          onChange={(e) => handleExpiryChange("year", e.target.value)}
        />
      </div>

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
