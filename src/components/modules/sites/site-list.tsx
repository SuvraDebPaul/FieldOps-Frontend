"use client";

import { MapPin, Pencil, Plus, ServerCrash } from "lucide-react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import SearchInput from "@/components/shared/search-input";
import { TableSkeleton } from "@/components/shared/skeletons";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { useQueryParams, useSites } from "@/hooks";
import type { Site } from "@/types";
import { formatDate } from "@/utils";
import SiteFormDialog from "./site-form-dialog";

const PAGE_SIZE = 10;

const columns: DataTableColumn<Site>[] = [
  {
    id: "label",
    header: "Site",
    cell: (site) => (
      <div>
        <p className="font-medium">{site.label}</p>
        <p className="text-xs text-muted-foreground">
          Added {formatDate(site.createdAt)}
        </p>
      </div>
    ),
  },
  {
    id: "address",
    header: "Address",
    cell: (site) => (
      <span className="text-muted-foreground">
        {site.address}, {site.city}
      </span>
    ),
  },
  {
    id: "contact",
    header: "On-site contact",
    cell: (site) => (
      <div>
        <p>{site.contactName}</p>
        <a
          href={`tel:${site.contactPhone}`}
          className="text-xs text-muted-foreground hover:underline"
        >
          {site.contactPhone}
        </a>
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    className: "text-right",
    cell: (site) => (
      <SiteFormDialog
        site={site}
        trigger={
          <Button variant="ghost" size="sm">
            <Pencil /> Edit
          </Button>
        }
      />
    ),
  },
];

export default function SiteList() {
  const { get, setParams } = useQueryParams();
  const searchTerm = get("q");
  const page = Math.max(Number(get("page")) || 1, 1);

  const { data, isPending, isPlaceholderData, refetch } = useSites({
    page,
    limit: PAGE_SIZE,
    searchTerm: searchTerm || undefined,
  });

  const renderResults = () => {
    if (isPending) return <TableSkeleton columns={4} />;

    if (!data) {
      return (
        <EmptyState
          icon={ServerCrash}
          title="Couldn't load your sites"
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      );
    }

    if (data.data.length === 0) {
      return searchTerm ? (
        <EmptyState
          title="No sites match your search"
          action={
            <Button
              variant="outline"
              onClick={() => setParams({ q: null, page: null })}
            >
              Clear search
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={MapPin}
          title="No sites yet"
          description="Add the locations where you need on-site service. You'll pick one for every request."
          action={
            <SiteFormDialog
              trigger={
                <Button>
                  <Plus /> Add your first site
                </Button>
              }
            />
          }
        />
      );
    }

    return (
      <div className="space-y-4">
        <DataTable
          columns={columns}
          rows={data.data}
          getRowKey={(site) => site.id}
          isUpdating={isPlaceholderData}
        />
        <TablePagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={(next) => setParams({ page: next === 1 ? null : next })}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <SearchInput
        value={searchTerm}
        onSearch={(value) => setParams({ q: value, page: null })}
        placeholder="Search by name, address or city…"
        className="max-w-sm"
      />
      {renderResults()}
    </div>
  );
}
