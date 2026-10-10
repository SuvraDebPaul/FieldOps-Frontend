import { format, addMinutes } from "date-fns";

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
  return format(new Date(iso), "d MMM yyyy");
}

export function formatDateTime(iso: string) {
  return format(new Date(iso), "d MMM yyyy, h:mm a");
}

export function formatTime(iso: string) {
  return format(new Date(iso), "h:mm a");
}

export function toDateTimeLocal(iso: string | null) {
  return iso ? format(new Date(iso), "yyyy-MM-dd'T'HH:mm") : "";
}

export function fromDateTimeLocal(value: string) {
  return value ? new Date(value).toISOString() : undefined;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function addMinutesToLocal(local: string, minutes: number) {
  return local
    ? toDateTimeLocal(addMinutes(new Date(local), minutes).toISOString())
    : "";
}
