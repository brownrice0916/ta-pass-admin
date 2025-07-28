"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Mail,
  Phone,
} from "lucide-react";

interface CEOProfile {
  id: string;
  businessName: string;
  businessNumber: string;
  verificationStatus: "pending" | "approved" | "rejected";
  registrationImage?: string;
}

export default function CeoDashboardPageWrapper() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ceoProfile, setCeoProfile] = useState<CEOProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  console.log(session?.user);

  // CEO 프로필 정보 가져오기
  useEffect(() => {
    const fetchCeoProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/ceo/profile/${session.user.id}`);
          if (response.ok) {
            const profile = await response.json();
            setCeoProfile(profile);
          }
        } catch (error) {
          console.error("CEO 프로필 로딩 실패:", error);
        } finally {
          setProfileLoading(false);
        }
      }
    };

    if (session?.user) {
      fetchCeoProfile();
    }
  }, [session?.user]);

  useEffect(() => {
    // 로딩 중일 때는 아무것도 하지 않음
    if (status === "loading" || profileLoading) return;

    if (!session?.user) {
      router.replace("/ceo/login");
    }
  }, [session, status, router, profileLoading]);

  // 로딩 중일 때 표시할 UI
  if (status === "loading" || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 승인 대기 중 화면
  if (ceoProfile?.verificationStatus === "pending") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Clock className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              승인 대기 중
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                <strong>{ceoProfile.businessName}</strong>의 사업자 등록이 검토
                중입니다.
              </p>
              <p className="text-sm">사업자번호: {ceoProfile.businessNumber}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">검토 진행 중</p>
                  <p>
                    제출해주신 사업자등록증을 검토하고 있습니다. 승인까지 1-2
                    영업일이 소요될 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">
                승인 완료 후 가능한 서비스:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>매장 정보 등록 및 관리</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>메뉴 및 가격 정보 업데이트</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>고객 리뷰 및 평점 관리</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>프로모션 및 이벤트 등록</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-gray-500 text-center">
                <p className="flex items-center justify-center space-x-1 mb-1">
                  <Mail className="h-4 w-4" />
                  <span>문의: support@example.com</span>
                </p>
                <p className="flex items-center justify-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>고객센터: 1588-0000</span>
                </p>
              </div>
            </div>

            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              상태 새로고침
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 승인 거부 화면
  if (ceoProfile?.verificationStatus === "rejected") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              승인 거부
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                <strong>{ceoProfile.businessName}</strong>의 사업자 등록이
                거부되었습니다.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">승인 거부 사유</p>
                  <p>
                    제출해주신 사업자등록증에 문제가 있거나 추가 확인이
                    필요합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => router.push("/ceo/resubmit")}
                className="w-full"
              >
                다시 제출하기
              </Button>
              <Button
                onClick={() => router.push("/ceo/contact")}
                variant="outline"
                className="w-full"
              >
                고객센터 문의
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 승인 완료된 경우 대시보드로 이동
  if (ceoProfile?.verificationStatus === "approved") {
    router.replace("/ceo/dashboard");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">대시보드로 이동 중...</div>
      </div>
    );
  }

  // 기본 리다이렉트 화면
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">리다이렉트 중...</div>
    </div>
  );
}
