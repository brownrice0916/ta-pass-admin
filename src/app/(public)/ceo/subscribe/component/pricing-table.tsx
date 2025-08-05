// 완전히 리팩토링된 PricingTable 컴포넌트
"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";

const plans = [
  {
    key: "single",
    name: "싱글 요금제",
    engName: "Single",
    price: "30,000원/매월",
    freeTrial: "무료/3개월",
    desc: "1개의 매장을 운영하고 있는 사업자",
    storeCount: "1개",
    available: true,
    note: null,
    features: {
      "통합 로그인": true,
      "개별 매장 관리자 생성": true,
      "위치 기반 추천": true,
      "카테고리 기반 추천": true,
      "혜택 제공별 추천": true,
      "방문 데이터 조회": true,
      "리뷰 관리": true,
      "월간 업계 소식": true,
      "외국인 관광 데이터 분석": true,
      "테마별 기획전 참여": true,
      "기관별 지역/브랜드 기획전 제안": true,
    },
  },
  {
    key: "multi",
    name: "멀티 요금제",
    engName: "Multi",
    price: "오픈 예정",
    freeTrial: null,
    desc: "2개 이상의 매장을 운영하고 있는 사업자",
    storeCount: "2개 이상",
    available: false,
    note: null,
    features: {
      "통합 로그인": true,
      "개별 매장 관리자 생성": true,
      "위치 기반 추천": true,
      "카테고리 기반 추천": true,
      "혜택 제공별 추천": true,
      "방문 데이터 조회": true,
      "리뷰 관리": true,
      "월간 업계 소식": true,
      "외국인 관광 데이터 분석": true,
      "테마별 기획전 참여": true,
      "기관별 지역/브랜드 기획전 제안": true,
    },
  },
  {
    key: "special",
    name: "스페셜 요금제",
    engName: "Special",
    price: "오픈 예정",
    freeTrial: null,
    desc: "단체/기관",
    storeCount: "10개 이상",
    available: false,
    note: "프랜차이즈 본사를 운영하시거나 다수의 매장을 소유하신 단체, 협회, 조합, 이벤트 등을 운영하신 기관이나 다각 사업 등을 추진하는 사업 기관에서 집단 차원에서 본 서비스 솔루션",
    features: {
      "통합 로그인": true,
      "개별 매장 관리자 생성": true,
      "위치 기반 추천": true,
      "카테고리 기반 추천": true,
      "혜택 제공별 추천": true,
      "방문 데이터 조회": true,
      "리뷰 관리": true,
      "월간 업계 소식": true,
      "외국인 관광 데이터 분석": true,
      "테마별 기획전 참여": true,
      "기관별 지역/브랜드 기획전 제안": true,
    },
  },
];

const handlePay = async (plan: (typeof plans)[number]) => {
  const tossPayments = await loadTossPayments(
    "test_ck_24xLea5zVA95LN9YoNLYVQAMYNwW"
  );

  try {
    await tossPayments.requestPayment("카드", {
      amount: 30000, // 실제 가격
      orderId: `order_${plan.key}_${Date.now()}`,
      orderName: plan.name,
      customerName: "홍길동", // 나중에 로그인된 사용자 정보로 교체 가능
      successUrl: `${window.location.origin}/ceo/subscribe/payment/success`,
      failUrl: `${window.location.origin}/ceo/subscribe/payment/fail`,
    });
  } catch (error) {
    console.error("결제창 오류:", error);
  }
};

const featureGroups = [
  {
    section: "기본 정보",
    features: [
      { label: "추천 대상", key: "desc" },
      { label: "매장 관리 구좌", key: "storeCount" },
    ],
  },
  {
    section: "기능",
    features: [
      "통합 로그인",
      "개별 매장 관리자 생성",
      "위치 기반 추천",
      "카테고리 기반 추천",
      "혜택 제공별 추천",
      "방문 데이터 조회",
      "리뷰 관리",
    ],
  },
  {
    section: "부가 혜택",
    features: [
      "월간 업계 소식",
      "외국인 관광 데이터 분석",
      "테마별 기획전 참여",
      "기관별 지역/브랜드 기획전 제안",
    ],
  },
];

export default function PricingTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-white text-gray-700">
          <tr>
            <th className="bg-white"></th>
            {plans.map((plan) => (
              <th
                key={plan.key}
                className="p-4 border-l text-center align-top w-1/3"
              >
                <div
                  className={`text-xs mb-1 ${plan.available ? "text-blue-500" : "text-gray-400"}`}
                >
                  {plan.available ? "신청 가능" : ""}
                </div>
                <div
                  className={`text-lg font-bold ${plan.available ? "text-blue-600" : "text-gray-400"}`}
                >
                  {plan.engName}
                </div>
                <div
                  className={`text-sm mb-1 ${plan.available ? "text-gray-800" : "text-gray-400"}`}
                >
                  {plan.name}
                </div>
                {plan.freeTrial && (
                  <div className="text-xs text-gray-500">{plan.freeTrial}</div>
                )}
                <div className="text-sm font-semibold mt-1">{plan.price}</div>
                {plan.available && (
                  <Button
                    className="w-full mt-3 text-sm bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => handlePay(plan)}
                  >
                    선택하기
                  </Button>
                )}

                {plan.note && (
                  <div className="mt-4 text-xs text-gray-500 leading-snug whitespace-pre-line">
                    {plan.note}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featureGroups.map((group) => (
            <React.Fragment key={group.section}>
              <tr className="border-t border-gray-200 bg-gray-50">
                <td
                  colSpan={plans.length + 1}
                  className="text-left px-6 py-3 font-bold text-gray-700"
                >
                  {group.section}
                </td>
              </tr>
              {group.features.map((feature) => {
                const isObject = typeof feature === "object";
                const label = isObject ? feature.label : feature;
                const key = isObject ? feature.key : feature;
                return (
                  <tr
                    key={group.section + key}
                    className="border-t border-gray-100"
                  >
                    <td className="px-6 py-3 font-medium text-gray-700 text-left whitespace-nowrap border-r border-gray-200">
                      {label}
                    </td>
                    {plans.map((plan) => {
                      const value =
                        key in plan ? plan[key] : plan.features?.[key];
                      const content =
                        typeof value === "boolean" ? (value ? "●" : "") : value;
                      return (
                        <td
                          key={plan.key + key}
                          className={`text-center px-6 py-3 border-l border-gray-100 ${plan.available ? "text-black" : "text-gray-400"}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
