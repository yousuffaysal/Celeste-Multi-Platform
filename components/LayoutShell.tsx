"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const hideChrome = pathname === "/assistant" || pathname === "/login" || isDashboard;
  const compact = pathname === "/login";

  if (isDashboard) return <>{children}</>;

  return (
    <>
      <Header compact={compact} />
      <main>{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}
