import { format } from "date-fns";

const currencyFormatter = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(value: string | number) {
  return currencyFormatter.format(Number(value));
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins} min`;
  return mins ? `${hours} h ${mins} min` : `${hours} h`;
}

export function formatDate(iso: string) {
  return format(new Date(iso), "d MM yyyy");
}

export function formatDateTime(iso: string) {
  return format(new Date(iso), "d MM yyyy, h:mm a");
}
