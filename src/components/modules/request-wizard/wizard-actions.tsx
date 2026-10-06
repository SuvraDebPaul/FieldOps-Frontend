import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface WizardActionsProps {
  onBack?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export default function WizardActions({
  onBack,
  submitLabel = "Continue",
  isSubmitting,
}: WizardActionsProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t pt-6">
      {onBack ? (
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
      ) : (
        <span />
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Spinner /> : null}
        {submitLabel}
        {!isSubmitting && <ArrowRight />}
      </Button>
    </div>
  );
}
