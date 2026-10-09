"use client";

import { useForm } from "@tanstack/react-form";
import StarRatingField from "@/components/form/fields/star-rating-field";
import TextareaField from "@/components/form/fields/textarea-field";
import RatingStars from "@/components/shared/rating-stars";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useSubmitFeedback, useWorkOrderFeedback } from "@/hooks";
import { formatDate } from "@/utils";
import { type FeedbackFormValues, feedbackSchema } from "@/validation";

export default function FeedbackSection({
  workOrderId,
}: {
  workOrderId: string;
}) {
  const { data: feedback, isPending } = useWorkOrderFeedback(workOrderId);

  if (isPending) return <Skeleton className="h-36 w-full rounded-lg" />;

  return (
    <section className="space-y-3 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">
        {feedback ? "Your rating" : "Rate this job"}
      </h3>
      {feedback ? (
        <div className="space-y-2">
          <RatingStars rating={feedback.rating} />
          {feedback.comment && (
            <p className="text-sm text-muted-foreground">{feedback.comment}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Submitted {formatDate(feedback.createdAt)}
          </p>
        </div>
      ) : (
        <FeedbackForm workOrderId={workOrderId} />
      )}
    </section>
  );
}

function FeedbackForm({ workOrderId }: { workOrderId: string }) {
  const submitFeedback = useSubmitFeedback();

  const defaultValues: FeedbackFormValues = { rating: 0, comment: "" };

  const form = useForm({
    defaultValues,
    validators: { onChange: feedbackSchema },
    onSubmit: ({ value }) =>
      submitFeedback.mutate({
        workOrderId,
        rating: value.rating,
        comment: value.comment.trim() || undefined,
      }),
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="rating">
          {(field) => (
            <StarRatingField field={field} label="How did the technician do?" />
          )}
        </form.Field>
        <form.Field name="comment">
          {(field) => (
            <TextareaField
              field={field}
              label="Comment (optional)"
              rows={3}
              maxLength={1000}
            />
          )}
        </form.Field>
        <Button
          type="submit"
          disabled={submitFeedback.isPending}
          className="w-fit"
        >
          {submitFeedback.isPending && <Spinner />} Submit rating
        </Button>
      </FieldGroup>
    </form>
  );
}
