import type { InvoiceBase } from "@/types";
import { formatCurrency } from "@/utils";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{formatCurrency(value)}</dd>
    </div>
  );
}

export default function InvoiceBreakdown({
  invoice,
}: {
  invoice: InvoiceBase;
}) {
  return (
    <dl className="space-y-2 text-sm">
      <Row
        label={`Labour (${Number(invoice.labourHours)} h)`}
        value={invoice.labourAmount}
      />
      <Row label="Parts" value={invoice.partsAmount} />
      <Row label="VAT (15%)" value={invoice.vatAmount} />
      <div className="flex justify-between gap-4 border-t pt-2 text-base font-semibold">
        <dt>Total</dt>
        <dd>{formatCurrency(invoice.totalAmount)}</dd>
      </div>
    </dl>
  );
}
