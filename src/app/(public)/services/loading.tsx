import { CardGridSkeleton } from "@/components/shared/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-10 px-4 py-12 md:py-16">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <CardGridSkeleton />
    </section>
  );
}
