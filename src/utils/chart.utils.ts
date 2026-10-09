import { format, startOfMonth, subMonths } from "date-fns";

export interface MonthlyPoint {
  key: string;
  label: string;
  value: number;
}

export function groupByMonth<T>(
  items: T[],
  getDate: (item: T) => string,
  getValue: (item: T) => number,
  months = 6,
): MonthlyPoint[] {
  const buckets = new Map<string, MonthlyPoint>();
  for (let i = months - 1; i >= 0; i--) {
    const month = startOfMonth(subMonths(new Date(), i));
    const key = format(month, "yyyy-MM");
    buckets.set(key, { key, label: format(month, "MMM"), value: 0 });
  }

  for (const item of items) {
    const bucket = buckets.get(format(new Date(getDate(item)), "yyyy-MM"));
    if (bucket) bucket.value += getValue(item);
  }

  return [...buckets.values()];
}
