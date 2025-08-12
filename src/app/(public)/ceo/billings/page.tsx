// app/ceo/billing/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UnpaidCheckout from "./components/UnpaidCheckout";
import PaidDashboard from "./components/PaidDashboard";
import PricingTable from "../subscribe/component/pricing-table";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">결제 관리</h2>
        <p className="mt-2">로그인이 필요합니다.</p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { ceoProfile: true },
  });

  const status = user?.ceoProfile?.paymentStatus ?? "unpaid";
  const plan = user?.ceoProfile?.paymentPlan ?? null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">결제 관리</h2>
      {status === "unpaid" ? <UnpaidCheckout /> : <PaidDashboard plan={plan} />}
      <span>결제 테스트 여기서 </span>
      <PricingTable />
    </div>
  );
}
