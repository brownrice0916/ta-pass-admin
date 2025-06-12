"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50">
      <main className="flex flex-col gap-[48px] row-start-2 items-center sm:items-center">
        <h1 className="text-3xl sm:text-3xl font-bold text-gray-800 text-center">
          TA PASS 관리자 페이지입니다
        </h1>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/ceo"
            className="px-10 py-6 bg-blue-500 text-white rounded-xl text-xl font-semibold shadow-md hover:bg-blue-600 transition"
          >
            사장님용
          </Link>

          <Link
            href="/admin"
            className="px-10 py-6 bg-green-500 text-white rounded-xl text-xl font-semibold shadow-md hover:bg-green-600 transition"
          >
            관리자용
          </Link>
        </div>
      </main>
    </div>
  );
}
