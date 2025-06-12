"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 6 }: Props) {
  return (
    <div className="border rounded-md overflow-hidden w-full">
      <div className="bg-gray-100 grid grid-cols-12 p-3">
        {Array.from({ length: columns }).map((_, idx) => (
          <Skeleton key={idx} className="h-4 col-span-2" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid grid-cols-12 border-t p-3 items-center"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-4 col-span-2" />
          ))}
        </div>
      ))}
    </div>
  );
}
