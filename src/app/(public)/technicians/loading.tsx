import { CardGridSkeleton } from "@/components/shared/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function TechniciansLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-10 px-4 py-12 md:py-16">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-72" />
      </div>
      <CardGridSkeleton count={9} />
    </section>
  );
}
