"use client";

import { useForm } from "@tanstack/react-form";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import TextField from "@/components/form/fields/text-field";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  useCategories,
  useCreateSkill,
  useDeleteCategory,
  useSkills,
} from "@/hooks";
import type { ServiceCategory } from "@/types";
import { formatCurrency, formatDuration } from "@/utils";
import { skillSchema } from "@/validation";
import CategoryFormDialog from "./category-form-dialog";

function RemoveCategoryButton({ category }: { category: ServiceCategory }) {
  const deleteCategory = useDeleteCategory();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 /> Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove &quot;{category.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Customers can no longer request it. Existing requests and work
            orders keep their history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => deleteCategory.mutate(category.id)}
          >
            Remove service
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AddSkillForm() {
  const createSkill = useCreateSkill();
  const form = useForm({
    defaultValues: { name: "" },
    validators: { onChange: skillSchema },
    onSubmit: ({ value, formApi }) =>
      createSkill.mutate(
        { name: value.name.trim() },
        {
          onSuccess: () => {
            toast.success(`Skill "${value.name.trim()}" added`);
            formApi.reset();
          },
        },
      ),
  });

  return (
    <form
      noValidate
      className="flex items-start gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="flex-1">
        <form.Field name="name">
          {(field) => (
            <TextField
              field={field}
              label="New skill"
              placeholder="e.g. Boiler Systems"
            />
          )}
        </form.Field>
      </div>
      <Button type="submit" className="mt-6" disabled={createSkill.isPending}>
        {createSkill.isPending ? <Spinner /> : <Plus />} Add
      </Button>
    </form>
  );
}

const columns: DataTableColumn<ServiceCategory>[] = [
  {
    id: "service",
    header: "Service",
    cell: (c) => (
      <div className="max-w-xs">
        <p className="font-medium">{c.name}</p>
        {c.description && (
          <p className="truncate text-xs text-muted-foreground">
            {c.description}
          </p>
        )}
      </div>
    ),
  },
  {
    id: "skill",
    header: "Required skill",
    cell: (c) => <Badge variant="secondary">{c.requiredSkill.name}</Badge>,
  },
  {
    id: "charge",
    header: "Base charge",
    className: "text-right",
    cell: (c) => formatCurrency(c.baseCharge),
  },
  {
    id: "duration",
    header: "Est. duration",
    cell: (c) => formatDuration(c.estimatedMins),
  },
  {
    id: "actions",
    header: "",
    className: "text-right",
    cell: (c) => (
      <div className="flex justify-end gap-1">
        <CategoryFormDialog
          category={c}
          trigger={
            <Button variant="ghost" size="sm">
              <Pencil /> Edit
            </Button>
          }
        />
        <RemoveCategoryButton category={c} />
      </div>
    ),
  },
];

export default function CatalogManager() {
  const { data, isPending } = useCategories({ limit: 100 });
  const { data: skills = [] } = useSkills();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Services</CardTitle>
            <CardDescription>
              {data?.meta.total ?? 0} active services customers can request.
            </CardDescription>
          </div>
          <CategoryFormDialog
            trigger={
              <Button size="sm">
                <Plus /> New service
              </Button>
            }
          />
        </CardHeader>
        <CardContent>
          {isPending ? (
            <TableSkeleton columns={5} />
          ) : data && data.data.length > 0 ? (
            <DataTable
              columns={columns}
              rows={data.data}
              getRowKey={(c) => c.id}
            />
          ) : (
            <EmptyState
              icon={Layers}
              title="No services yet"
              description="Add the first service customers can request."
            />
          )}
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Each service requires one skill; technicians hold several.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="divide-y rounded-lg border text-sm">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="flex items-center justify-between gap-2 px-3 py-2"
              >
                <span className="font-medium">{skill.name}</span>
                <span className="text-xs text-muted-foreground">
                  {skill._count?.technicians ?? 0} tech ·{" "}
                  {skill._count?.categories ?? 0} services
                </span>
              </li>
            ))}
          </ul>
          <AddSkillForm />
        </CardContent>
      </Card>
    </div>
  );
}
