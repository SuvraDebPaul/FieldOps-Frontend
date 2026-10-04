import type { ServiceCategory } from "@/types";
import ServiceCard from "./service-card";

export default function ServiceGrid({
  categories,
}: {
  categories: ServiceCategory[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <ServiceCard key={category.id} category={category} />
      ))}
    </div>
  );
}
