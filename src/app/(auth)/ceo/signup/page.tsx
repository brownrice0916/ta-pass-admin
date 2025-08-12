"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Check, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    verificationCode: "",
    password: "",
    passwordConfirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [agreements, setAgreements] = useState({
    all: false,
    age14: false,
    privacy: false,
    personalInfo: false,
    thirdParty: false,
  });
  const router = useRouter();

  // 타이머 효과
  useEffect(() => {
    let timer: any;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 시간 포맷팅 함수
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSendVerification = async () => {
    if (!form.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!form.email.includes("@")) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsVerifying(true);

    try {
      // 먼저 이메일 중복 체크
      const checkResponse = await fetch(
        `/api/signup?email=${encodeURIComponent(form.email)}`
      );
      const checkData = await checkResponse.json();

      if (checkData.exists) {
        alert("이미 사용 중인 이메일입니다.");
        setIsVerifying(false);
        return;
      }

      // 인증 코드 전송
      const response = await fetch("/api/email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json();

      if (data.success) {
        setVerificationSent(true);
        setTimeLeft(600); // 10분 = 600초
        alert("인증번호가 이메일로 전송되었습니다.");
      } else {
        alert(data.error || "인증번호 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("인증번호 전송 오류:", error);
      alert("인증번호 전송 중 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!form.verificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    if (form.verificationCode.length !== 6) {
      alert("인증번호는 6자리 숫자입니다.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/email-verification", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          code: form.verificationCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailVerified(true);
        setTimeLeft(0);
        alert("이메일 인증이 완료되었습니다.");
      } else {
        alert(data.error || "인증번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("인증 확인 오류:", error);
      alert("인증 확인 중 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAgreementChange = (key: keyof typeof agreements) => {
    if (key === "all") {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        age14: newValue,
        privacy: newValue,
        personalInfo: newValue,
        thirdParty: newValue,
      });
    } else {
      const newAgreements = { ...agreements, [key]: !agreements[key] };
      const allChecked =
        newAgreements.age14 &&
        newAgreements.privacy &&
        newAgreements.personalInfo &&
        newAgreements.thirdParty;
      setAgreements({ ...newAgreements, all: allChecked });
    }
  };

  const isFormValid = () => {
    return (
      form.name &&
      form.email &&
      emailVerified &&
      form.password &&
      form.passwordConfirm &&
      form.password === form.passwordConfirm &&
      agreements.age14 &&
      agreements.privacy &&
      agreements.personalInfo
    );
  };

  // 회원가입 로직 추가
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (!isFormValid()) {
      alert("모든 필수 항목을 입력하고 약관에 동의해주세요.");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      alert("입력한 비밀번호와 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register-ceo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          agreements: {
            age14: agreements.age14,
            privacy: agreements.privacy,
            personalInfo: agreements.personalInfo,
            thirdParty: agreements.thirdParty,
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("회원가입이 완료되었습니다.");
        router.push("/ceo/subscribe");
      } else {
        alert(data.error || "회원가입 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* 기본 정보 카드 */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">
              기본 정보<span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 이름 */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                이름<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="이름을 입력해주세요."
                value={form.name}
                onChange={handleChange}
                className="h-12"
              />
            </div>

            {/* 이메일 */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                이메일<span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal ml-1">
                  로그인 아이디로 사용됩니다.
                </span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="메일 주소를 입력해주세요."
                  value={form.email}
                  onChange={handleChange}
                  className="h-12 flex-1"
                  disabled={emailVerified}
                />
                <Button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={emailVerified || isVerifying}
                  className="h-12 px-4 bg-blue-500 hover:bg-blue-600 whitespace-nowrap"
                >
                  {isVerifying
                    ? "전송 중..."
                    : emailVerified
                      ? "인증 완료"
                      : "인증번호 전송"}
                </Button>
              </div>

              {verificationSent && (
                <div className="space-y-2 mt-2">
                  <div className="flex gap-2">
                    <Input
                      name="verificationCode"
                      placeholder={
                        timeLeft > 0 ? formatTime(timeLeft) : "인증번호 6자리"
                      }
                      value={form.verificationCode}
                      onChange={handleChange}
                      className="h-12 flex-1"
                      disabled={emailVerified}
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={
                        emailVerified ||
                        isVerifying ||
                        form.verificationCode.length !== 6 ||
                        timeLeft === 0
                      }
                      className={`h-12 px-4 ${emailVerified ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                      {isVerifying
                        ? "확인 중..."
                        : emailVerified
                          ? "인증 완료"
                          : "인증 확인"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium mb-2 block"
              >
                비밀번호<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요."
                  value={form.password}
                  onChange={handleChange}
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <p>비밀번호는 다음 조건을 모두 만족해야 합니다.</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>8자 이상</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>영문자와 숫자를 모두 포함</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>특수문자(!@#$%^&*) 포함 시 보안성 ↑ (선택)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <Label
                htmlFor="passwordConfirm"
                className="text-sm font-medium mb-2 block"
              >
                비밀번호 확인<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="비밀번호를 확인해주세요."
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPasswordConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {form.passwordConfirm &&
                form.password !== form.passwordConfirm && (
                  <p className="text-red-500 text-sm mt-1">
                    입력한 비밀번호와 일치하지 않습니다.
                  </p>
                )}
            </div>
          </CardContent>
        </Card>

        {/* 약관 동의 카드 */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">
              약관 동의<span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 전체 동의 */}
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

            {/* 개별 약관 */}
            <div className="space-y-3">
              {[
                {
                  key: "age14",
                  text: "(필수) 만 14세 이상입니다",
                  required: true,
                },
                {
                  key: "privacy",
                  text: "(필수) 이용약관 동의",
                  required: true,
                },
                {
                  key: "personalInfo",
                  text: "(필수) 개인정보 수집 및 이용 동의",
                  required: true,
                },
                {
                  key: "thirdParty",
                  text: "(필수) 제3자 제공 동의 (PG사 결제 처리 목적)",
                  required: false,
                },
              ].map((item) => {
                const key = item.key as keyof typeof agreements;

                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleAgreementChange(key)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          agreements[key]
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {agreements[key] && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <span
                        className={
                          item.required ? "text-red-500" : "text-gray-700"
                        }
                      >
                        {item.text}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-gray-500 space-y-1 mt-4">
              <p>
                ※ 모든 항목은 서비스 제공 및 결제를 위한 필수 동의 항목입니다.
              </p>
              <p>※ 동의하지 않으신 경우 회원가입이 제한됩니다.</p>
              <p>
                ※ 이용자는 개인정보 수집·이용 및 제3자 제공에 대한 동의를 거부할
                권리가 있으며,
              </p>
              <p className="ml-3">거부 시 서비스 이용이 제한될 수 있습니다.</p>
            </div>
          </CardContent>
        </Card>

        {/* 동의하고 가입하기 버튼 */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className="w-full h-12 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-medium"
        >
          동의하고 가입하기
        </Button>
      </div>
    </div>
  );
}
