"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  storeData: any;
  router: any;
  loading: boolean;
}

export default function StoreInfoTable({ storeData, router, loading }: Props) {
  const renderRow = (label: string, value?: string | number | null) =>
    value ? (
      <TableRow>
        <TableCell className="font-medium text-muted-foreground">
          {label}
        </TableCell>
        <TableCell>{value}</TableCell>
      </TableRow>
    ) : null;

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">내 매장 정보</h1>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <Table>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="w-24 h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-5" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <>
                {renderRow("상호명", storeData.name)}
                {renderRow(
                  "카테고리",
                  `${storeData.category} > ${storeData.subCategory ?? ""}`
                )}
                {renderRow(
                  "주소",
                  `${storeData.address} ${storeData.addressDetail ?? ""}`
                )}
                {renderRow(
                  "지역",
                  [storeData.region1, storeData.region2, storeData.region3]
                    .filter(Boolean)
                    .join(" > ")
                )}
                {renderRow(
                  "위치",
                  `${storeData.latitude}, ${storeData.longitude}`
                )}
                {renderRow("영업시간", storeData.openingHoursText)}
                {renderRow("언어", storeData.languages?.join(", "))}
                {renderRow("한줄 소개", storeData.description)}
                {renderRow("상세 소개", storeData.about)}
                {renderRow("혜택 요약", storeData.specialOfferText)}
                {renderRow("혜택 상세", storeData.specialOfferTextDetail)}
                {renderRow("혜택 종류", storeData.specialOfferType?.join(", "))}
                {renderRow("태그", storeData.tags?.join(", "))}

                {/* ✅ 이미지 출력 */}
                {storeData.images && storeData.images.length > 0 && (
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">
                      사진
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {storeData.images.map((url: string, idx: number) => (
                          <div
                            key={idx}
                            className="w-24 h-24 relative rounded overflow-hidden border"
                          >
                            <Image
                              src={url}
                              alt={`store image ${idx + 1}`}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* ✅ 소셜 링크 */}
                {storeData.socialLinks && storeData.socialLinks.length > 0 && (
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">
                      소셜 링크
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside space-y-1">
                        {storeData.socialLinks.map(
                          (link: string, idx: number) => (
                            <li key={idx}>
                              <a
                                href={link}
                                className="text-blue-600 underline break-all"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link}
                              </a>
                            </li>
                          )
                        )}
                      </ul>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>

        {!loading && (
          <div className="text-right mt-6">
            <button
              onClick={() => router.push("/ceo/stores/edit")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              수정하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
