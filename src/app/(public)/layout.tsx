import ProtectedRoute from "@/components/producted-route";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
