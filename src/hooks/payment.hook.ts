import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPayment, initiatePayment } from "@/api";

export function useInitiatePayment() {
  return useMutation({
    mutationFn: initiatePayment,
    onSuccess: ({ data }) => {
      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
      } else {
        toast.error("Stripe didn't return a checkout page. Please try again.");
      }
    },
    meta: { errorMessage: "Couldn't start the payment" },
  });
}

export function usePaymentStatus(
  transactionId: string | null,
  { poll }: { poll: boolean },
) {
  return useQuery({
    queryKey: ["payments", transactionId ?? ""],
    queryFn: transactionId ? () => getPayment(transactionId) : skipToken,
    select: (res) => res.data,
    refetchInterval: (query) =>
      poll && query.state.data?.data.status === "INITIATED" ? 2000 : false,
    meta: { errorMessage: "Couldn't check the payment status" },
  });
}
