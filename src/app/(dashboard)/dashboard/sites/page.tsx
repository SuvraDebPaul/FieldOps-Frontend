import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import SiteFormDialog from "@/components/modules/sites/site-form-dialog";
import SiteList from "@/components/modules/sites/site-list";
import PageHeader from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Sites" };

export default function SitesPage() {
  return (
    <>
      <PageHeader
        title="Sites"
        description="The locations where technicians carry out your jobs."
        actions={
          <SiteFormDialog
            trigger={
              <Button>
                <Plus /> Add site
              </Button>
            }
          />
        }
      />
      <Suspense fallback={<TableSkeleton columns={4} />}>
        <SiteList />
      </Suspense>
    </>
  );
}
