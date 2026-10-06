import type { Metadata } from "next";
import CustomerOverview from "@/components/modules/overview/customer-overview";

export const metadata: Metadata = { title: "Overview" };

export default function CustomerOverviewPage() {
  return <CustomerOverview />;
}
