"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  totalUsers: number;
  totalStores: number;
  totalReviews: number;
  usedSerials: number;
  recentUsers: { id: number; name: string; email: string }[];
  recentStores: { id: string; name: string; address: string }[];
  dailySerialUsage: { date: string; count: number }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      setData(json);
    };
    fetchDashboard();
  }, []);

  if (!data) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">관리자 대시보드</h1>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="전체 유저" value={data.totalUsers} />
        <SummaryCard label="가맹점 수" value={data.totalStores} />
        <SummaryCard label="리뷰 수" value={data.totalReviews} />
        <SummaryCard label="시리얼 사용" value={data.usedSerials} />
      </div>

      {/* 시리얼 사용량 그래프 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">최근 7일 시리얼 사용량</h2>
        <div className="w-full h-64 bg-white border rounded p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailySerialUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 최근 가입 유저 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">최근 가입 유저</h2>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">이름</th>
              <th className="p-2 border">이메일</th>
            </tr>
          </thead>
          <tbody>
            {data.recentUsers.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 최근 등록 가맹점 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">최근 등록 가맹점</h2>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">상호명</th>
              <th className="p-2 border">주소</th>
            </tr>
          </thead>
          <tbody>
            {data.recentStores.map((store) => (
              <tr key={store.id}>
                <td className="p-2 border">{store.name}</td>
                <td className="p-2 border">{store.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg p-4 shadow text-center">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-2xl font-bold mt-1">{value.toLocaleString()}</div>
    </div>
  );
}
