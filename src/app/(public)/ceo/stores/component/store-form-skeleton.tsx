// components/store-form-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function StoreFormSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <Skeleton className="w-40 h-6" /> {/* 제목 */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="w-32 h-4 mb-2" />
            <Skeleton className="w-full h-10" />
          </div>
        ))}
        <Skeleton className="w-24 h-10 mt-6" /> {/* 버튼 */}
      </div>
    </div>
  );
}
