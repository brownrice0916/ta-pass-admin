"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertTriangle } from "lucide-react";
import PricingTable from './component/pricing-table';

export default function StoreRegistrationFlow() {
  const [showPricingPlans, setShowPricingPlans] = useState(false);

 

  const handleConfirm = () => {
    setShowPricingPlans(true);
  };



  if (!showPricingPlans) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">매장 등록</h1>
            
            <div className="space-y-4 text-left">
              <p className="text-gray-700">
                매장 등록 전에 꼭 확인해주세요!
              </p>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">요금 안내 및 혜택</h3>
                <p className="text-sm text-gray-600">
                  TA PASS는 매월 30,000원(부가세 포함)이 자동 결제되는 유료 서비스입니다.<br/>
                  한 계 아래의 같은 무료 이용 혜택이 제공되고 있어요.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>2025년 9월 30일까지 등록 완료 시 → <strong>3개월 무료</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>2025년 10월 1일 이후 등록 완료 시 → <strong>1개월 무료</strong></span>
                  </div>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-red-700 font-medium">등록 완료일을 기준으로</p>
                      <p className="text-red-600">
                        무료 이용 기간이 종료되면 별도 안내 없이,<br/>
                        등록하신 결제 수단으로 매월 30,000원(부가세 포함)이 자동 결제됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">등록 절차</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>1. 결제 정보 입력</p>
                  <p>2. 사업자등록증 제출</p>
                  <p>3. 매장 정보 입력</p>
                  <p>4. 등록 완료</p>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">주의사항</p>
                  <ul className="text-sm text-red-600 mt-1 space-y-1">
                    <li>• 신청 접수 전까지 모든 단계를 완료해 주세요.</li>
                    <li>• 등록이 완료되지 않으면, 언제라도 모든 기관에서 다시 처음부터 진행하셔야 합니다.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">필요서류 안내 : 사업자등록증</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>TA PASS 입점을 위해 <strong>사업자등록증 제출은 필수</strong>입니다.</p>
                  <p>결제 정보 등록 후 바로 업로드하시거나,</p>
                  <p><strong>나중에 등록하실 수도 있어요.</strong></p>
                  <p>사업자등록증이 제출되지 않으면 승인 절차가 진행되지 않습니다.</p>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">업로드 시 유의사항</p>
                  <ul className="text-sm text-red-600 mt-1 space-y-1">
                    <li>• 스캔본 또는 사진 파일(jpg, png, pdf / 10MB 이하)</li>
                    <li>• <strong>주민등록번호 뒷자리는 꼭 가려주세요.</strong> 마커나 싸인펜 등으로 가린 후 수정하실 수 있습니다.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">참고 사항</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 등록하신 사업자 및 매장 정보는 운영팀의 내부 검토를 거쳐 승인됩니다.</li>
                  <li>• 검토가 발요한 경우, 결과는 <strong>영업일 기준 최대 5일 이내에</strong> 등록하신 이메일로 안내드려요.</li>
                  <li>• <strong>등록 완료일을 기준으로</strong> 무료 이용 기간의 혜택드리며 별도 안내 없이, 등록하신 결제 수단으로 매월 30,000원(부가세 포함)이 자동 결제됩니다.</li>
                </ul>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-4">
                위 내용을 모두 확인하셨다면, 아래 버튼을 눌러 다음 단계로 이동해주세요.
              </p>
              <Button 
                onClick={handleConfirm}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
              >
                확인했어요
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-2xl font-bold text-gray-900">요금제 및 가격</h1>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">TA PASS 요금제</h2>
            <p className="text-gray-600">매장 수와 운영 형태에 따라 선택하세요!</p>
            <p className="text-sm text-gray-500">2025년 9월 30일까지 매장 등록을 완료하시면 3개월 동안 무료로 이용하실 수 있어요.</p>
          </div>
        </div>

        {/* Pricing Table */}
        <PricingTable/>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
          <p>* 위 상품의 최대 이용기간은 1개월입니다.</p>
          <button className="text-blue-500 hover:underline">질문 고객 센터 ></button>
        </div>
      </div>
    </div>
  );
}





