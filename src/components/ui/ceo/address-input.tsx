"use client";

import { useState, useRef } from "react";
import { Input } from "../input";
import { MapPin, X } from "lucide-react";
import { Button } from "../button";
import DaumPostcode from "react-daum-postcode";

interface AddressInputProps {
  value: {
    address: string;
    addressDetail: string;
  };
  onChange: (data: { address: string; addressDetail: string }) => void;
}

export default function AddressInput({ value, onChange }: AddressInputProps) {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      {/* 주소 */}
      <div>
        <label className="block mb-1 font-medium">
          {/* 주소 <span className="text-red-500">*</span> */}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            ref={addressInputRef}
            className="pl-10 bg-white"
            placeholder="주소를 검색하세요"
            value={value.address}
            onClick={() => setIsAddressModalOpen(true)}
            readOnly
          />
        </div>
      </div>

      {/* 상세 주소 */}
      <div>
        {/* <label className="block mb-1 font-medium">상세 주소</label> */}
        <Input
          placeholder="상세 주소"
          value={value.addressDetail}
          className="bg-white"
          onChange={(e) =>
            onChange({ ...value, addressDetail: e.target.value })
          }
        />
      </div>

      {/* 주소 검색 모달 */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">주소 검색</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsAddressModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DaumPostcode
              onComplete={(data) => {
                onChange({ ...value, address: data.address });
                setIsAddressModalOpen(false);
              }}
              onClose={(state) => {
                if (state === "FORCE_CLOSE") {
                  setIsAddressModalOpen(false);
                }
              }}
              style={{ width: "100%", height: "400px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
