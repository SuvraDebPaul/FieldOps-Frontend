import type { Metadata } from "next";

import PageHeader from "@/components/shared/page-header";
import EarningsOverview from "@/components/modules/technicians/earnings-overview";

export const metadata: Metadata = { title: "Earnings & reviews" };

export default function EarningsPage() {
  return (
    <>
      <PageHeader
        title="Earnings & reviews"
        description="Labour you've billed and what customers say."
      />
      <EarningsOverview />
    </>
  );
}
