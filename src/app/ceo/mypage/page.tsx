"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyPage() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    image: "",
    gender: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      setUserInfo((prev) => ({ ...prev, image: data.url }));
    } else {
      alert("이미지 업로드 실패");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });

    if (res.ok) {
      alert("내 정보가 수정되었습니다!");
    } else {
      alert("오류가 발생했습니다.");
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/ceo" });
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold">내 정보</h2>

      {loading ? (
        <div className="space-y-6">
          {/* 프로필 사진 Skeleton */}
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="w-24 h-24 rounded-full" />
          </div>

          {/* 이름 필드 Skeleton */}
          <div>
            <Skeleton className="w-20 h-4 mb-2" />
            <Skeleton className="w-full h-10 rounded" />
          </div>

          {/* 성별 필드 Skeleton */}
          <div>
            <Skeleton className="w-20 h-4 mb-2" />
            <Skeleton className="w-full h-10 rounded" />
          </div>

          {/* 저장 버튼 Skeleton */}
          <Skeleton className="w-full h-10 rounded" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 프사 이미지 */}
          <div className="flex flex-col items-center space-y-2">
            <div
              onClick={triggerFileUpload}
              className="cursor-pointer relative w-24 h-24 rounded-full overflow-hidden border"
            >
              {userInfo.image ? (
                <img
                  src={userInfo.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center text-sm text-gray-700">
                  업로드 중...
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">이름</label>
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">성별</label>
            <select
              name="gender"
              value={userInfo.gender}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">선택 안함</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            저장
          </button>
        </form>
      )}

      <div className="pt-4 border-t mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
