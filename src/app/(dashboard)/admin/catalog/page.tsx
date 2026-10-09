import type { Metadata } from "next";
import CatalogManager from "@/components/modules/admin/catalog-manager";
import PageHeader from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Service catalog" };

export default function AdminCatalogPage() {
  return (
    <>
      <PageHeader
        title="Service catalog"
        description="The services customers can request and the skills they require."
      />
      <CatalogManager />
    </>
  );
}
