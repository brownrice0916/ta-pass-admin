// app/admin/dashboard/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/admin/data-table";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  country: string;
  gender: string;
  birthYear: string;
  membershipType: string;
  birthMonth?: string;
  birthDay?: string;
  image?: string;
  createdAt?: string;
}

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "이름", accessor: "name" },
    { header: "이메일", accessor: "email" },
    { header: "국가", accessor: "country" },
    { header: "성별", accessor: "gender" },
    { header: "생년", accessor: "birthYear" },
    { header: "멤버십", accessor: "membershipType" },
    {
      header: "",
      accessor: "action",
      render: (user: User) => (
        <Button size="sm" onClick={() => setSelectedUser(user)}>
          상세
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">일반 유저 목록</h2>
      <DataTable columns={columns} data={users} />

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>유저 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2 text-sm">
              <div>
                <strong>이름:</strong> {selectedUser.name}
              </div>
              <div>
                <strong>이메일:</strong> {selectedUser.email}
              </div>
              <div>
                <strong>국가:</strong> {selectedUser.country}
              </div>
              <div>
                <strong>성별:</strong> {selectedUser.gender}
              </div>
              <div>
                <strong>생년월일:</strong> {selectedUser.birthYear}-
                {selectedUser.birthMonth}-{selectedUser.birthDay}
              </div>
              <div>
                <strong>멤버십:</strong> {selectedUser.membershipType}
              </div>
              <div>
                <strong>가입일:</strong>{" "}
                {new Date(selectedUser.createdAt || "").toLocaleDateString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
