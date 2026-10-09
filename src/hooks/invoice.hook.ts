import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query";
import { getInvoice, getInvoices } from "@/api";
import type { InvoiceParams } from "@/types";

export const INVOICE_KEYS = {
  all: ["invoices"] as const,
  list: (params: InvoiceParams) => ["invoices", "list", params] as const,
  detail: (id: string) => ["invoices", "detail", id] as const,
};

export function useInvoices(params: InvoiceParams) {
  return useQuery({
    queryKey: INVOICE_KEYS.list(params),
    queryFn: () => getInvoices(params),
    placeholderData: keepPreviousData,
    meta: { errorMessage: "Couldn't load invoices" },
  });
}

export function useInvoice(invoiceId: string | null) {
  return useQuery({
    queryKey: INVOICE_KEYS.detail(invoiceId ?? ""),
    queryFn: invoiceId ? () => getInvoice(invoiceId) : skipToken,
    select: (res) => res.data,
    meta: { errorMessage: "Couldn't load this invoice" },
  });
}
