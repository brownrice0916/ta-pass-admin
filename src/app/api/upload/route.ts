// app/api/upload/route.ts
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const blob = await put(`profile_${Date.now()}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
