"use client";

import { Eye, ServerCrash, Wrench } from "lucide-react";
import WorkOrderDetailSheet from "@/components/modules/work-orders/work-order-detail-sheet";
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
import { WORK_ORDER_STATUS_META } from "@/constants/status.constants";
import { useQueryParams, useTechnicians, useWorkOrders } from "@/hooks";
import { WORK_ORDER_STATUSES, type WorkOrder } from "@/types";
import { formatCurrency, formatDateTime, isOneOf } from "@/utils";
import AdminWorkOrderActions from "./admin-work-order-actions";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = WORK_ORDER_STATUSES.map((s) => ({
  value: s,
  label: WORK_ORDER_STATUS_META[s].label,
}));

export default function AdminWorkOrderList() {
  const { get, setParams } = useQueryParams();
  const searchTerm = get("q");
  const status = get("status");
  const technicianId = get("technician");
  const page = Math.max(Number(get("page")) || 1, 1);

  const { data, isPending, isPlaceholderData, refetch } = useWorkOrders({
    page,
    limit: PAGE_SIZE,
    searchTerm: searchTerm || undefined,
    status: isOneOf(WORK_ORDER_STATUSES, status) ? status : undefined,
    technicianId: technicianId || undefined,
  });

  const { data: technicians } = useTechnicians({ limit: 100 });
  const technicianOptions = (technicians?.data ?? []).map((t) => ({
    value: t.id,
    label: t.user.name,
  }));

  const hasFilters = Boolean(searchTerm || status || technicianId);
  const clearFilters = () =>
    setParams({ q: null, status: null, technician: null, page: null });

  const columns: DataTableColumn<WorkOrder>[] = [
    {
      id: "job",
      header: "Job",
      cell: (wo) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{wo.request.title}</p>
          <p className="font-mono text-xs text-muted-foreground">{wo.code}</p>
        </div>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: (wo) => (
        <div>
          <p>{wo.request.customer.companyName}</p>
          <p className="text-xs text-muted-foreground">
            {wo.request.site.city}
          </p>
        </div>
      ),
    },
    {
      id: "technician",
      header: "Technician",
      cell: (wo) => wo.technician.user.name,
    },
    {
      id: "scheduled",
      header: "Scheduled",
      cell: (wo) => (
        <span className="text-muted-foreground">
          {formatDateTime(wo.scheduledStart)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (wo) => <StatusBadge {...WORK_ORDER_STATUS_META[wo.status]} />,
    },
    {
      id: "invoice",
      header: "Invoice",
      className: "text-right",
      cell: (wo) => (wo.invoice ? formatCurrency(wo.invoice.totalAmount) : "—"),
    },
    {
      id: "actions",
      header: "",
      className: "text-right",
      cell: (wo) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setParams({ view: wo.id })}
        >
          <Eye /> Manage
        </Button>
      ),
    },
  ];

  const renderResults = () => {
    if (isPending) return <TableSkeleton columns={7} />;
    if (!data) {
      return (
        <EmptyState
          icon={ServerCrash}
          title="Couldn't load work orders"
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      );
    }
    if (data.data.length === 0) {
      return (
        <EmptyState
          icon={Wrench}
          title={
            hasFilters
              ? "No work orders match these filters"
              : "No work orders yet"
          }
          description="Work orders are created when you approve a service request."
          action={
            hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
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
          getRowKey={(wo) => wo.id}
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
          onSearch={(value) => setParams({ q: value, page: null })}
          placeholder="Search job code or title…"
          className="md:max-w-sm md:flex-1"
        />
        <FilterSelect
          label="Filter by status"
          allLabel="All statuses"
          value={status}
          options={STATUS_OPTIONS}
          onValueChange={(value) => setParams({ status: value, page: null })}
        />
        <FilterSelect
          label="Filter by technician"
          allLabel="All technicians"
          value={technicianId}
          options={technicianOptions}
          onValueChange={(value) =>
            setParams({ technician: value, page: null })
          }
        />
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>
      {renderResults()}
      <WorkOrderDetailSheet
        renderPanel={(wo) => <AdminWorkOrderActions workOrder={wo} />}
      />
    </div>
  );
}
