"use client";

import { isPast } from "date-fns";
import { Eye, Receipt, ServerCrash } from "lucide-react";
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
import { INVOICE_STATUS_META } from "@/constants/status.constants";
import { useInvoices, useQueryParams } from "@/hooks";
import { cn } from "@/lib/utils";
import { INVOICE_STATUSES, type Invoice } from "@/types";
import { formatCurrency, formatDate, isOneOf } from "@/utils";
import InvoiceDetailSheet from "./invoice-detail-sheet";
import PayInvoiceButton from "./pay-invoice-button";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = INVOICE_STATUSES.map((s) => ({
  value: s,
  label: INVOICE_STATUS_META[s].label,
}));

export default function InvoiceList({
  variant,
}: {
  variant: "customer" | "admin";
}) {
  const isAdmin = variant === "admin";
  const { get, setParams } = useQueryParams();
  const searchTerm = get("q");
  const status = get("status");
  const page = Math.max(Number(get("page")) || 1, 1);

  const { data, isPending, isPlaceholderData, refetch } = useInvoices({
    page,
    limit: PAGE_SIZE,
    searchTerm: searchTerm || undefined,
    status: isOneOf(INVOICE_STATUSES, status) ? status : undefined,
  });

  const columns: DataTableColumn<Invoice>[] = [
    {
      id: "invoice",
      header: "Invoice",
      cell: (inv) => (
        <div>
          <p className="font-mono text-sm font-medium">{inv.invoiceNo}</p>
          <p className="text-xs text-muted-foreground">
            Issued {formatDate(inv.issuedAt)}
          </p>
        </div>
      ),
    },
    ...(isAdmin
      ? [
          {
            id: "customer",
            header: "Customer",
            cell: (inv: Invoice) => inv.workOrder.request.customer.companyName,
          },
        ]
      : []),
    {
      id: "job",
      header: "Job",
      cell: (inv) => (
        <div>
          <p>{inv.workOrder.request.category.name}</p>
          <p className="text-xs text-muted-foreground">{inv.workOrder.code}</p>
        </div>
      ),
    },
    {
      id: "due",
      header: "Due",
      cell: (inv) => {
        const overdue = inv.status === "DUE" && isPast(new Date(inv.dueDate));
        return (
          <span
            className={cn(
              overdue
                ? "font-medium text-destructive"
                : "text-muted-foreground",
            )}
          >
            {formatDate(inv.dueDate)}
            {overdue && " · overdue"}
          </span>
        );
      },
    },
    {
      id: "total",
      header: "Total",
      className: "text-right",
      cell: (inv) => (
        <span className="font-medium">{formatCurrency(inv.totalAmount)}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (inv) => <StatusBadge {...INVOICE_STATUS_META[inv.status]} />,
    },
    {
      id: "actions",
      header: "",
      className: "text-right",
      cell: (inv) => (
        <div className="flex justify-end gap-2">
          {!isAdmin && inv.status === "DUE" && (
            <PayInvoiceButton
              invoiceId={inv.id}
              amount={inv.totalAmount}
              size="sm"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setParams({ view: inv.id })}
          >
            <Eye /> View
          </Button>
        </div>
      ),
    },
  ];

  const renderResults = () => {
    if (isPending) return <TableSkeleton columns={6} />;
    if (!data) {
      return (
        <EmptyState
          icon={ServerCrash}
          title="Couldn't load your invoices"
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
          icon={Receipt}
          title={
            searchTerm || status
              ? "No invoices match these filters"
              : "No invoices yet"
          }
          description="An invoice is issued once a technician completes a job."
        />
      );
    }
    return (
      <div className="space-y-4">
        <DataTable
          columns={columns}
          rows={data.data}
          getRowKey={(inv) => inv.id}
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
          placeholder="Search invoice or work order number…"
          className="md:max-w-sm md:flex-1"
        />
        <FilterSelect
          label="Filter by status"
          allLabel="All invoices"
          value={status}
          options={STATUS_OPTIONS}
          onValueChange={(value) => setParams({ status: value, page: null })}
        />
      </div>
      {renderResults()}
      <InvoiceDetailSheet canPay={!isAdmin} />
    </div>
  );
}
