import { Spinner } from "@/components/ui/spinner";

export default function AuthLoading({
  label = "Verifying your session",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="size-5" />
      {label}
    </div>
  );
}
