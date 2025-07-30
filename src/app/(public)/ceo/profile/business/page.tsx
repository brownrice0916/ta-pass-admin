// src/app/(public)/ceo/profile/business/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddressInput from "@/components/ui/ceo/address-input";
import { Input } from "@/components/ui/input";
import { Check, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BusinessInfoPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    businessNumber: "",
    businessName: "",
    ceoName: "",
    address: "",
    addressDetail: "",
    startDate: "",
  });

  const [agreements, setAgreements] = useState({
    all: false,
    age14: false,
    terms: false,
    privacy: false,
    thirdParty: false,
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAgreementChange = (key: keyof typeof agreements) => {
    if (key === "all") {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        age14: newValue,
        terms: newValue,
        privacy: newValue,
        thirdParty: newValue,
      });
    } else {
      const updated = { ...agreements, [key]: !agreements[key] };
      const allChecked =
        updated.age14 && updated.terms && updated.privacy && updated.thirdParty;
      setAgreements({ ...updated, all: allChecked });
    }
  };

  const handleSubmit = async () => {
    const {
      businessNumber,
      businessName,
      ceoName,
      address,
      addressDetail,
      startDate,
    } = form;

    if (
      !businessNumber ||
      !businessName ||
      !ceoName ||
      !address ||
      !startDate
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (
      !agreements.age14 ||
      !agreements.terms ||
      !agreements.privacy ||
      !agreements.thirdParty
    ) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    const res = await fetch("/api/ceo/profile/business", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });

    if (res.ok) {
      router.push("/ceo/stores");
    } else {
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">사업자 정보 등록</h2>

      <div className="space-y-2">
        <Input
          placeholder="사업자등록번호"
          value={form.businessNumber}
          onChange={(e) => handleChange("businessNumber", e.target.value)}
          className="w-full border rounded p-2 bg-white"
        />
        <Input
          placeholder="상호(법인명)"
          value={form.businessName}
          onChange={(e) => handleChange("businessName", e.target.value)}
          className="w-full border rounded p-2 bg-white"
        />
        <Input
          placeholder="성명(대표자)"
          value={form.ceoName}
          onChange={(e) => handleChange("ceoName", e.target.value)}
          className="w-full border rounded p-2 bg-white"
        />

        <div className="space-y-1 mt-1 mb-2">
          <h3 className=" mb-2 font-medium text-gray-700">
            사업장 소재지 입력
          </h3>
          <AddressInput
            value={{
              address: form.address,
              addressDetail: form.addressDetail,
            }}
            onChange={(val) => {
              setForm((prev) => ({
                ...prev,
                address: val.address,
                addressDetail: val.addressDetail,
              }));
            }}
          />
        </div>
        <div className="mt-4">
          <label>개업연원일</label>
          <Input
            type="date"
            placeholder="개업연월일"
            value={form.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full border rounded p-2 bg-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">약관 동의</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAgreementChange("all")}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    agreements.all
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {agreements.all && <Check className="w-4 h-4 text-white" />}
                </button>
                <span className="font-medium">약관에 전체동의</span>
              </div>
            </div>

            {["age14", "privacy", "terms", "thirdParty"].map((key) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleAgreementChange(key as keyof typeof agreements)
                    }
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      agreements[key as keyof typeof agreements]
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {agreements[key as keyof typeof agreements] && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <span>
                    {
                      {
                        age14: "(필수) 만 14세 이상입니다",
                        privacy: "(필수) 이용약관 동의",
                        terms: "(필수) 개인정보 수집 및 이용 동의",
                        thirdParty: "(선택) 제3자 제공 동의",
                      }[key]
                    }
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </CardContent>
        </Card>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
