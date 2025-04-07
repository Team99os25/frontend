"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen transition-colors duration-300">
      {isHomePage && <Header />}
      {children}
      <Footer />
    </div>
  );
} 