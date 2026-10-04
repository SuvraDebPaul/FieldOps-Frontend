"use client";

import EmptyState from "@/components/shared/empty-state";
import SearchInput from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParams } from "@/hooks";
import type { ServiceCategory, Skill } from "@/types";
import ServiceGrid from "./service-grid";

interface ServiceCatalogProps {
  categories: ServiceCategory[];
  skills: Skill[];
}

export default function ServiceCatalog({
  categories,
  skills,
}: ServiceCatalogProps) {
  const { get, setParams } = useQueryParams();
  const q = get("q");
  const skill = get("skill");

  const term = q.toLowerCase();
  const filtered = categories.filter(
    (c) =>
      (!skill || c.requiredSkillId === skill) &&
      (!term ||
        `${c.name} ${c.description ?? ""}`.toLowerCase().includes(term)),
  );

  const hasFilters = Boolean(q || skill);
  const clearFilters = () => setParams({ q: null, skill: null });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={q}
          onSearch={(value) => setParams({ q: value })}
          placeholder="Search services…"
          className="sm:max-w-sm sm:flex-1"
        />
        <Select
          value={skill || "all"}
          onValueChange={(value) =>
            setParams({ skill: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="sm:w-56" aria-label="Filter by skill">
            <SelectValue placeholder="All skills" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skills</SelectItem>
            {skills.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
        <p className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} of {categories.length} services
        </p>
      </div>

      {filtered.length > 0 ? (
        <ServiceGrid categories={filtered} />
      ) : (
        <EmptyState
          title="No services match your filters"
          description="Try a different keyword or choose another skill."
          action={
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}
