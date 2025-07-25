"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface StatData {
  week: string;
  views: number;
  bookmarks: number;
}

interface Review {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  userName: string;
}

export default function DashBoard() {
  const [activeTab, setActiveTab] = useState<"views" | "bookmarks">("views");

  const [stats, setStats] = useState<StatData[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ceo/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.weeklyStats);
        setReviews(data.latestReviews);
        setTotalViews(data.totalViewsLastMonth);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/ceo/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.weeklyStats);
        setReviews(data.latestReviews);
        setTotalViews(data.totalViewsLastMonth);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* 상단 월간 요약 */}
      <div className="text-xl font-semibold">
        {loading ? (
          <Skeleton className="w-64 h-6" />
        ) : (
          <>
            지난 한달 조회수는{" "}
            <span className="text-primary font-bold">{totalViews || 0}회</span>{" "}
            입니다.
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 조회수 / 북마크 그래프 */}
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">주간 변화 추이</h2>
              <Tabs
                defaultValue="views"
                onValueChange={(v) => setActiveTab(v as "views" | "bookmarks")}
              >
                <TabsList>
                  <TabsTrigger value="views">조회수</TabsTrigger>
                  <TabsTrigger value="bookmarks">북마크</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {loading ? (
              <Skeleton className="w-full h-[300px] rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={activeTab}
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* 최신 리뷰 */}
        <Card className="w-full">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-4">최신 리뷰</h2>
            {loading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2 border-b pb-3">
                    <Skeleton className="w-1/3 h-4" />
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                ))
              : reviews?.map((review) => (
                  <div key={review.id} className="border-b pb-3">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{review.userName}</span>
                      <span>{review.createdAt}</span>
                    </div>
                    <div className="mt-1 text-base">{review.content}</div>
                    <div className="text-yellow-500">
                      ⭐ {review.rating.toFixed(1)}
                    </div>
                  </div>
                )) || <p>리뷰가 없습니다</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
