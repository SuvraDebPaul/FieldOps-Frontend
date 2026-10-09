"use client";

import { ClipboardList, Eye, Plus, ServerCrash } from "lucide-react";
import Link from "next/link";
import AdminRequestActions from "@/components/modules/admin/admin-request-actions";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterSelect from "@/components/shared/filter-select";
import SearchInput from "@/components/shared/search-input";
import { TableSkeleton } from "@/components/shared/skeletons";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import {
  PRIORITY_META,
  REQUEST_STATUS_META,
} from "@/constants/status.constants";
import { useQueryParams, useRequests } from "@/hooks";
import { PRIORITIES, REQUEST_STATUSES, type ServiceRequest } from "@/types";
import { formatDate, isOneOf } from "@/utils";
import CustomerRequestActions from "./customer-request-actions";
import RequestDetailSheet from "./request-detail-sheet";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = REQUEST_STATUSES.map((s) => ({
  value: s,
  label: REQUEST_STATUS_META[s].label,
}));
const PRIORITY_OPTIONS = PRIORITIES.map((p) => ({
  value: p,
  label: PRIORITY_META[p].label,
}));

export default function RequestList({
  variant,
}: {
  variant: "customer" | "admin";
}) {
  const isAdmin = variant === "admin";
  const { get, setParams } = useQueryParams();
  const searchTerm = get("q");
  const status = get("status");
  const priority = get("priority");
  const page = Math.max(Number(get("page")) || 1, 1);

  const { data, isPending, isPlaceholderData, refetch } = useRequests({
    page,
    limit: PAGE_SIZE,
    searchTerm: searchTerm || undefined,
    status: isOneOf(REQUEST_STATUSES, status) ? status : undefined,
    priority: isOneOf(PRIORITIES, priority) ? priority : undefined,
  });

  const hasFilters = Boolean(searchTerm || status || priority);
  const clearFilters = () =>
    setParams({ q: null, status: null, priority: null, page: null });
  const updateFilter = (key: string, value: string | null) =>
    setParams({ [key]: value, page: null });

  const columns: DataTableColumn<ServiceRequest>[] = [
    {
      id: "request",
      header: "Request",
      cell: (r) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{r.title}</p>
          <p className="font-mono text-xs text-muted-foreground">{r.code}</p>
        </div>
      ),
    },
    // Only admins need to know WHICH customer
    ...(isAdmin
      ? [
          {
            id: "customer",
            header: "Customer",
            cell: (r: ServiceRequest) => (
              <div>
                <p>{r.customer.companyName}</p>
                <p className="text-xs text-muted-foreground">
                  {r.customer.user.name}
                </p>
              </div>
            ),
          },
        ]
      : []),
    {
      id: "service",
      header: "Service & site",
      cell: (r) => (
        <div>
          <p>{r.category.name}</p>
          <p className="text-xs text-muted-foreground">{r.site.label}</p>
        </div>
      ),
    },
    {
      id: "priority",
      header: "Priority",
      cell: (r) => <StatusBadge {...PRIORITY_META[r.priority]} />,
    },
    {
      id: "status",
      header: "Status",
      cell: (r) => <StatusBadge {...REQUEST_STATUS_META[r.status]} />,
    },
    {
      id: "created",
      header: "Submitted",
      cell: (r) => (
        <span className="text-muted-foreground">{formatDate(r.createdAt)}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      className: "text-right",
      cell: (r) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setParams({ view: r.id })}
        >
          <Eye /> {isAdmin && r.status === "PENDING" ? "Review" : "View"}
        </Button>
      ),
    },
  ];

  const renderResults = () => {
    if (isPending) return <TableSkeleton columns={isAdmin ? 7 : 6} />;
    if (!data) {
      return (
        <EmptyState
          icon={ServerCrash}
          title="Couldn't load requests"
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      );
    }
    if (data.data.length === 0) {
      if (hasFilters) {
        return (
          <EmptyState
            title="No requests match these filters"
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        );
      }
      return (
        <EmptyState
          icon={ClipboardList}
          title="No requests yet"
          description={
            isAdmin
              ? "New customer requests will appear here for review."
              : "Raise your first service request in four quick steps."
          }
          action={
            !isAdmin && (
              <Button asChild>
                <Link href="/dashboard/requests/new">
                  <Plus /> New request
                </Link>
              </Button>
            )
          }
        />
      );
    }
    return (
      <div className="space-y-4">
        <DataTable
          columns={columns}
          rows={data.data}
          getRowKey={(r) => r.id}
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
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <SearchInput
          value={searchTerm}
          onSearch={(value) => updateFilter("q", value)}
          placeholder="Search code, title or description…"
          className="md:max-w-sm md:flex-1"
        />
        <FilterSelect
          label="Filter by status"
          allLabel="All statuses"
          value={status}
          options={STATUS_OPTIONS}
          onValueChange={(value) => updateFilter("status", value)}
        />
        <FilterSelect
          label="Filter by priority"
          allLabel="All priorities"
          value={priority}
          options={PRIORITY_OPTIONS}
          onValueChange={(value) => updateFilter("priority", value)}
        />
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {renderResults()}

      <RequestDetailSheet
        renderActions={(request) =>
          isAdmin ? (
            <AdminRequestActions request={request} />
          ) : (
            <CustomerRequestActions request={request} />
          )
        }
      />
    </div>
  );
}
