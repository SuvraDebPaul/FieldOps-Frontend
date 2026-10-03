"use client";

import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "./query.provider";
import StoreHydration from "./store-hydration";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider>
        <StoreHydration />
        {children}
      </TooltipProvider>
    </QueryProvider>
  );
}
