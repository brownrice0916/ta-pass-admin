"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SubscribePage() {
  const router = useRouter();

  const plans = [
    {
      name: "싱글 요금제",
      price: "30,000원/월",
      desc: "1개의 매장을 운영하고 있는 사업자",
      status: "active",
      bgColor: "bg-blue-100",
      badgeColor: "text-blue-500",
      actionText: "선택하기",
    },
    {
      name: "멀티 요금제",
      price: "오픈 예정",
      desc: "2개 이상의 매장을 운영하고 있는 사업자",
      status: "coming",
      bgColor: "bg-yellow-100",
      badgeColor: "text-yellow-500",
      actionText: "선택하기",
    },
    {
      name: "스페셜 요금제",
      price: "오픈 예정",
      desc: "단체/기관 대상 맞춤형 요금제",
      status: "inquiry",
      bgColor: "bg-purple-100",
      badgeColor: "text-purple-500",
      actionText: "문의하기",
    },
  ];

  const handleSelect = (planName: string) => {
    if (planName === "싱글 요금제") {
      router.push("/ceo/subscribe/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-sm text-blue-500 font-medium">이용 요금 안내</h2>
        <h1 className="text-3xl font-bold">TA PASS 요금제</h1>
        <p className="text-gray-500">
          매장 수와 운영 형태에 따라 알맞은 요금제를 선택하세요
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {plans.map((plan, idx) => (
            <Card key={idx} className={`${plan.bgColor} shadow-md`}>
              <CardHeader>
                <CardTitle className={`${plan.badgeColor} text-lg font-bold`}>
                  {plan.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-2xl font-semibold">{plan.price}</p>
                <p className="text-sm text-gray-600">{plan.desc}</p>

                {plan.status === "active" && (
                  <Button
                    onClick={() => handleSelect(plan.name)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {plan.actionText}
                  </Button>
                )}

                {plan.status === "coming" && (
                  <Button disabled className="w-full bg-yellow-400 text-white">
                    오픈 예정
                  </Button>
                )}

                {plan.status === "inquiry" && (
                  <Link href="/contact">
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                      문의하기
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
