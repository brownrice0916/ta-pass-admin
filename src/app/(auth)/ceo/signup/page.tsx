"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FileText, Image, X } from "lucide-react";

export default function CEORegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    businessName: "",
    businessNumber: "",
  });
  const [registrationFile, setRegistrationFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("파일 크기는 10MB를 초과할 수 없습니다.");
        return;
      }

      // 허용된 파일 타입 검사
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(
          "이미지 파일(JPG, PNG, GIF, WEBP) 또는 PDF 파일만 업로드 가능합니다."
        );
        return;
      }

      setRegistrationFile(file);

      // 이미지 파일인 경우 미리보기 생성
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // PDF인 경우 미리보기 없음
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setRegistrationFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <Image className="w-8 h-8 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let fileUrl = "";
    if (registrationFile) {
      const formData = new FormData();
      formData.append("file", registrationFile);

      try {
        const res = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("파일 업로드에 실패했습니다.");
        }

        const data = await res.json();
        fileUrl = data.url;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert("파일 업로드 중 오류가 발생했습니다.");
        return;
      }
    }

    try {
      const res = await fetch("/api/auth/register-ceo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          registrationImage: fileUrl,
          registrationFileType: registrationFile?.type || null,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("회원가입 성공!");
        router.push("/ceo");
      } else {
        alert(result.error || "에러 발생!");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  const fields = [
    { label: "이메일", name: "email", type: "email" },
    { label: "비밀번호", name: "password", type: "password" },
    { label: "대표자 성명", name: "name", type: "text" },
    { label: "상호(법인명)", name: "businessName", type: "text" },
    { label: "사업자등록번호", name: "businessNumber", type: "text" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle>📋 CEO 회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <Label className="mb-1" htmlFor={field.name}>
                  {field.label}
                </Label>
                <Input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={(form as any)[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <div>
              <Label className="mb-2 block" htmlFor="registrationFile">
                사업자등록증 (이미지 또는 PDF)
              </Label>

              {!registrationFile ? (
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    ref={fileInputRef}
                    id="registrationFile"
                    onChange={handleFileChange}
                  />
                  <p className="text-sm text-gray-500">
                    이미지 파일(JPG, PNG, GIF, WEBP) 또는 PDF 파일 (최대 10MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 파일 정보 표시 */}
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(registrationFile)}
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">
                          {registrationFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(registrationFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* 이미지 미리보기 */}
                  {filePreview && (
                    <div className="border rounded-lg p-2">
                      <img
                        src={filePreview}
                        alt="미리보기"
                        className="w-full h-32 object-contain rounded"
                      />
                    </div>
                  )}

                  {/* 파일 변경 버튼 */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    파일 변경
                  </Button>

                  {/* 숨겨진 파일 인풋 */}
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full">
              회원가입
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
