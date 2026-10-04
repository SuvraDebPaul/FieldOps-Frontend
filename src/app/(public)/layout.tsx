import type { ReactNode } from "react";
import Footer from "@/components/layout/public/footer";
import Header from "@/components/layout/public/header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
