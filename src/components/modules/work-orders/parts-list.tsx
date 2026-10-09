import type { PartUsage } from "@/types";
import { formatCurrency } from "@/utils";

export default function PartsList({ parts }: { parts: PartUsage[] }) {
  if (parts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No parts were logged on this job.
      </p>
    );
  }

  const total = parts.reduce(
    (sum, part) => sum + Number(part.unitPrice) * part.quantity,
    0,
  );

  return (
    <ul className="divide-y rounded-lg border text-sm">
      {parts.map((part) => (
        <li key={part.id} className="flex justify-between gap-4 px-3 py-2">
          <span>
            {part.name}{" "}
            <span className="text-muted-foreground">
              × {part.quantity} @ {formatCurrency(part.unitPrice)}
            </span>
          </span>
          <span>{formatCurrency(Number(part.unitPrice) * part.quantity)}</span>
        </li>
      ))}
      <li className="flex justify-between px-3 py-2 font-medium">
        <span>Parts total</span>
        <span>{formatCurrency(total)}</span>
      </li>
    </ul>
  );
}
