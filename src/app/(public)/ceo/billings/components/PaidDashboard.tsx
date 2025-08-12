"use client";

import { useEffect, useState } from "react";

type Props = { plan: "single" | "multi" | "special" | null };

type PaymentRow = {
  id: string;
  orderName: string;
  amount: number;
  status: string;
  approvedAt: string | null;
  receiptUrl?: string | null;
  paymentKey: string;
};

export default function PaidDashboard({ plan }: Props) {
  const [items, setItems] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/payments?limit=10");
      if (r.ok) {
        const d = await r.json();
        setItems(d.items);
      }
      setLoading(false);
    })();
  }, []);

  const handleCancel = async (paymentKey: string) => {
    if (!confirm("해당 결제를 취소할까요?")) return;
    const r = await fetch("/api/payments/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, cancelReason: "사용자 요청" }),
    });
    if (r.ok) {
      alert("취소되었습니다.");
      location.reload();
    } else {
      const d = await r.json().catch(() => ({}));
      alert(`취소 실패: ${d?.message || "오류"}`);
    }
  };

  return (
    <div className="space-y-6">
      <section className="border rounded p-4">
        <h3 className="font-semibold">현재 요금제</h3>
        <div className="mt-2 text-sm text-gray-700">
          {plan ? `요금제: ${plan}` : "요금제 정보가 없습니다."}
        </div>
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-2 rounded bg-blue-600 text-white">
            결제수단 변경
          </button>
          <button className="px-3 py-2 rounded bg-gray-200">영수증 설정</button>
        </div>
      </section>

      <section className="border rounded p-4">
        <h3 className="font-semibold">결제 이력</h3>
        {loading ? (
          <div className="mt-3 text-sm text-gray-600">불러오는 중...</div>
        ) : items.length === 0 ? (
          <div className="mt-3 text-sm text-gray-600">이력이 없습니다.</div>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-600">
                <tr>
                  <th className="py-2">일시</th>
                  <th className="py-2">항목</th>
                  <th className="py-2">금액</th>
                  <th className="py-2">상태</th>
                  <th className="py-2">영수증</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2">
                      {p.approvedAt
                        ? new Date(p.approvedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="py-2">{p.orderName}</td>
                    <td className="py-2">{p.amount.toLocaleString()}원</td>
                    <td className="py-2">{p.status}</td>
                    <td className="py-2">
                      {p.receiptUrl ? (
                        <a
                          href={p.receiptUrl}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          보기
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                        onClick={() => handleCancel(p.paymentKey)}
                      >
                        취소
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
