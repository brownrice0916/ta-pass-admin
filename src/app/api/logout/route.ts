// /app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // 로그아웃 시 처리할 로직 (예: 로그 저장)
  console.log("User logged out");

  return NextResponse.json({ message: "Logged out" });
}
