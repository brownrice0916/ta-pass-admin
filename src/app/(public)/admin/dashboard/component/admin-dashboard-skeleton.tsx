// components/admin-dashboard-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">관리자 대시보드</h1>

      {/* 요약 카드 Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>

      {/* 그래프 Skeleton */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Activation Code 활성화 횟수
        </h2>
        <Skeleton className="w-full h-64 rounded" />
      </div>

      {/* 최근 가입 유저 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">최근 가입 유저</h2>
        <Skeleton className="w-full h-32 rounded" />
      </div>

      {/* 최근 등록 가맹점 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">최근 등록 가맹점</h2>
        <Skeleton className="w-full h-32 rounded" />
      </div>
    </div>
  );
}
