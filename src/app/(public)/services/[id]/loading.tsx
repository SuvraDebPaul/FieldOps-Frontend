import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 md:py-14">
      <Skeleton className="h-8 w-32" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>
  );
}
