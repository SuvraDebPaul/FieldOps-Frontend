"use client";

import { ServerCrash, Users } from "lucide-react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterSelect from "@/components/shared/filter-select";
import SearchInput from "@/components/shared/search-input";
import { TableSkeleton } from "@/components/shared/skeletons";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import UserAvatar from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { ROLE_LABEL } from "@/constants/auth.constants";
import { USER_STATUS_META } from "@/constants/status.constants";
import { useGetMe, useQueryParams, useUsers } from "@/hooks";
import { ROLES, USER_STATUSES, type UserWithProfile } from "@/types";
import { formatDate, isOneOf } from "@/utils";
import UserRoleSelect from "./user-role-select";
import UserStatusButton from "./user-status-button";

const PAGE_SIZE = 10;
const ROLE_OPTIONS = ROLES.map((r) => ({ value: r, label: ROLE_LABEL[r] }));
const STATUS_OPTIONS = USER_STATUSES.map((s) => ({
  value: s,
  label: USER_STATUS_META[s].label,
}));

export default function UserList() {
  const { data: me } = useGetMe();
  const { get, setParams } = useQueryParams();
  const searchTerm = get("q");
  const role = get("role");
  const status = get("status");
  const page = Math.max(Number(get("page")) || 1, 1);

  const { data, isPending, isPlaceholderData, refetch } = useUsers({
    page,
    limit: PAGE_SIZE,
    searchTerm: searchTerm || undefined,
    role: isOneOf(ROLES, role) ? role : undefined,
    status: isOneOf(USER_STATUSES, status) ? status : undefined,
  });

  const hasFilters = Boolean(searchTerm || role || status);
  const clearFilters = () =>
    setParams({ q: null, role: null, status: null, page: null });

  const columns: DataTableColumn<UserWithProfile>[] = [
    {
      id: "user",
      header: "User",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={u.name} src={u.avatarUrl} size={32} />
          <div className="min-w-0">
            <p className="truncate font-medium">{u.name}</p>
            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (u) => <UserRoleSelect user={u} disabled={u.id === me?.data.id} />,
    },
    {
      id: "status",
      header: "Status",
      cell: (u) => <StatusBadge {...USER_STATUS_META[u.status]} />,
    },
    {
      id: "profile",
      header: "Profile",
      cell: (u) => (
        <span className="text-muted-foreground">
          {u.customer?.companyName ??
            (u.technician
              ? `${u.technician.employeeCode} · ${u.technician.baseCity}`
              : "—")}
        </span>
      ),
    },
    {
      id: "joined",
      header: "Joined",
      cell: (u) => (
        <span className="text-muted-foreground">{formatDate(u.createdAt)}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      className: "text-right",
      cell: (u) =>
        u.id === me?.data.id ? (
          <span className="text-xs text-muted-foreground">You</span>
        ) : (
          <UserStatusButton user={u} />
        ),
    },
  ];

  const renderResults = () => {
    if (isPending) return <TableSkeleton columns={6} />;
    if (!data) {
      return (
        <EmptyState
          icon={ServerCrash}
          title="Couldn't load users"
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      );
    }
    if (data.data.length === 0) {
      return (
        <EmptyState
          icon={Users}
          title="No users match these filters"
          action={
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      );
    }
    return (
      <div className="space-y-4">
        <DataTable
          columns={columns}
          rows={data.data}
          getRowKey={(u) => u.id}
          isUpdating={isPlaceholderData}
        />
        <TablePagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={(next) => setParams({ page: next === 1 ? null : next })}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <SearchInput
          value={searchTerm}
          onSearch={(value) => setParams({ q: value, page: null })}
          placeholder="Search name, email or phone…"
          className="md:max-w-sm md:flex-1"
        />
        <FilterSelect
          label="Filter by role"
          allLabel="All roles"
          value={role}
          options={ROLE_OPTIONS}
          onValueChange={(value) => setParams({ role: value, page: null })}
        />
        <FilterSelect
          label="Filter by status"
          allLabel="All statuses"
          value={status}
          options={STATUS_OPTIONS}
          onValueChange={(value) => setParams({ status: value, page: null })}
        />
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
