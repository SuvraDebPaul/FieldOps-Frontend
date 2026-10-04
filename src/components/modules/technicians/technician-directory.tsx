"use client";

import { ServerCrash, UserX } from "lucide-react";
import EmptyState from "@/components/shared/empty-state";
import SearchInput from "@/components/shared/search-input";
import { CardGridSkeleton } from "@/components/shared/skeletons";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParams, useSkills, useTechnicians } from "@/hooks";
import { cn } from "@/lib/utils";
import type { TechnicianParams } from "@/types";
import TechnicianCard from "./technician-card";

const PAGE_SIZE = 9;

export default function TechnicianDirectory() {
  const { get, setParams } = useQueryParams();

  // 1. URL → filter values
  const searchTerm = get("q");
  const skill = get("skill");
  const available = get("available");
  const page = Math.max(Number(get("page")) || 1, 1);

  // 2. Filter values → API params (undefined keys are left out of the request)
  const params: TechnicianParams = {
    page,
    limit: PAGE_SIZE,
    searchTerm: searchTerm || undefined,
    skill: skill || undefined,
    available:
      available === "true" || available === "false" ? available : undefined,
  };

  const { data, isPending, isPlaceholderData, refetch } =
    useTechnicians(params);
  const { data: skills = [] } = useSkills();

  // Any filter change sends the user back to page 1
  const updateFilters = (updates: Record<string, string | null>) =>
    setParams({ ...updates, page: null });

  const hasFilters = Boolean(searchTerm || skill || available);
  const clearFilters = () =>
    setParams({ q: null, skill: null, available: null, page: null });

  const renderResults = () => {
    if (isPending) return <CardGridSkeleton count={PAGE_SIZE} />;

    if (!data) {
      return (
        <EmptyState
          icon={ServerCrash}
          title="Couldn't load technicians"
          description="Check your connection and try again."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      );
    }

    const { data: technicians, meta } = data;

    if (technicians.length === 0) {
      return (
        <EmptyState
          icon={UserX}
          title="No technicians found"
          description="Try another name, city or skill."
          action={
            hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            )
          }
        />
      );
    }

    const from = (meta.page - 1) * meta.limit + 1;
    const to = from + technicians.length - 1;

    return (
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Showing {from}–{to} of {meta.total} technicians
        </p>
        <div
          aria-busy={isPlaceholderData}
          className={cn(
            "grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3",
            isPlaceholderData && "opacity-60",
          )}
        >
          {technicians.map((technician) => (
            <TechnicianCard key={technician.id} technician={technician} />
          ))}
        </div>
        <TablePagination
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={(next) => setParams({ page: next === 1 ? null : next })}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <SearchInput
          value={searchTerm}
          onSearch={(value) => updateFilters({ q: value })}
          placeholder="Search name, city or employee code…"
          className="md:max-w-sm md:flex-1"
        />

        <Select
          value={skill || "all"}
          onValueChange={(value) =>
            updateFilters({ skill: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="md:w-52" aria-label="Filter by skill">
            <SelectValue placeholder="All skills" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skills</SelectItem>
            {skills.map((s) => (
              <SelectItem key={s.id} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={available || "all"}
          onValueChange={(value) =>
            updateFilters({ available: value === "all" ? null : value })
          }
        >
          <SelectTrigger
            className="md:w-44"
            aria-label="Filter by availability"
          >
            <SelectValue placeholder="Any availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any availability</SelectItem>
            <SelectItem value="true">Available now</SelectItem>
            <SelectItem value="false">Unavailable</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {renderResults()}
    </div>
  );
}
