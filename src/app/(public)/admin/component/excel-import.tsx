"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as XLSX from "xlsx";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";

export default function ExcelImport() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const processExcelData = async (file: File) => {
    setImporting(true);
    setError(null);
    setProgress(0);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const processedRows = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        processedRows.push(await processExcelRow(row));
        setProgress(Math.floor(((i + 1) / rows.length) * 100));
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(processedRows));

      const response = await fetch("/api/restaurants/bulk", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버로 데이터를 전송하는 데 실패했습니다.");
      }

      setSuccess(true); // ✅ 성공 상태
    } catch (err) {
      console.error("Error processing file:", err);
      setError("파일 처리 중 오류가 발생했습니다.");
    } finally {
      setImporting(false);
    }
  };

  const processExcelRow = async (row: any) => {
    const languages = row.languages?.split(",").map((lang: string) => {
      const langMap: { [key: string]: string } = {
        한국어: "ko",
        영어: "en",
        중국어: "zh",
        일본어: "ja",
      };
      return langMap[lang.trim()] || lang.trim();
    }) || ["ko"];

    const socialLinks = processSocialLinks(row.socialLinks);
    const { lat, lng } = await getGeocode(row.address || "");

    const images = row.images
      ? row.images
          .split(",")
          .map((url: string) => url.trim())
          .filter(Boolean)
      : [];

    return {
      name: row.name?.trim(),
      category: row.category?.trim() || "food",
      subCategory: row.subCategory?.trim() || "",
      description: row.description?.trim() || "",
      about: row.about?.trim() || "",
      languages,
      tags:
        row.tags
          ?.split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean) || [],
      socialLinks,
      images,
      region1: row.region1?.trim() || "",
      region2: row.region2?.trim() || "",
      region3: row.region3?.trim() || "",
      region4: row.region4?.trim() || "",
      address: row.address?.trim() || "",
      addressDetail: row.addressDetail?.trim() || "",
      latitude: lat,
      longitude: lng,
      specialOfferType:
        row.specialOfferType
          ?.split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean) || [],
      specialOfferText: row.specialOfferText?.trim() || "",
      specialOfferTextDetail: row.specialOfferTextDetail?.trim() || "",
    };
  };

  const processSocialLinks = (socialLinksStr: string) => {
    if (!socialLinksStr) return [];

    try {
      const formattedStr = `[${socialLinksStr}]`;
      const parsedArray = JSON.parse(formattedStr);
      return parsedArray.map((link: Record<string, string>) => {
        const [platform, url] = Object.entries(link)[0];
        return {
          platform: platform.toLowerCase().trim(),
          url: url.trim(),
        };
      });
    } catch (error) {
      console.error("Error processing social links:", error);
      return [];
    }
  };

  const getGeocode = async (address: string) => {
    const geocoder = new google.maps.Geocoder();
    try {
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            resolve({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            });
          } else {
            reject(new Error("Geocoding failed"));
          }
        });
      });
      return result as { lat: number; lng: number };
    } catch {
      return { lat: 37.5665, lng: 126.978 };
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        window.location.reload();
      }, 1500); // ✅ 1.5초 후 자동 새로고침
    }
  }, [success]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          className="bg-green-600"
          onClick={() => document.getElementById("excelFile")?.click()}
          disabled={importing}
        >
          <Upload className="mr-2 h-4 w-4" />
          엑셀 파일 선택
        </Button>
        <input
          id="excelFile"
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              processExcelData(file);
            }
          }}
        />
      </div>

      {importing && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500">처리 중... ({progress}% 완료)</p>
        </div>
      )}

      {success && (
        <Alert variant="default">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <AlertDescription>
            ✅ 엑셀 데이터가 성공적으로 등록되었습니다!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
