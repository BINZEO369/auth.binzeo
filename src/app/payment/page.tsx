import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PaymentForm from "@/components/payment/PaymentForm";
import PaymentReturnStatus from "@/components/payment/PaymentReturnStatus";
import { getCentralSession } from "@/lib/central-session";

export const metadata: Metadata = {
  title: "Secure payment",
  description: "Continue to secure hosted checkout for your JABIYEN order.",
};

type PaymentSearchParams = Promise<{
  order_number?: string | string[];
  payment?: string | string[];
  request_id?: string | string[];
}>;

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: PaymentSearchParams;
}) {
  const [query, user] = await Promise.all([searchParams, getCentralSession()]);
  const orderNumber = firstValue(query.order_number).trim().slice(0, 80);
  const paymentState = firstValue(query.payment);
  const rawRequestId = firstValue(query.request_id).trim();
  const requestId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawRequestId)
    ? rawRequestId
    : "";
  const nextParams = new URLSearchParams();
  if (orderNumber) nextParams.set("order_number", orderNumber);
  if (paymentState === "success" || paymentState === "cancelled") nextParams.set("payment", paymentState);
  if (requestId) nextParams.set("request_id", requestId);
  const nextPath = nextParams.size ? `/payment?${nextParams.toString()}` : "/payment";

  if (!user) {
    redirect(`/signin?next=${encodeURIComponent(nextPath)}`);
  }

  const isCancelled = paymentState === "cancelled";
  const isReturned = paymentState === "success";

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12 sm:px-6">
      <section className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-950 text-sm font-bold tracking-wide text-white">
            B
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-950">BINZEO Central</p>
            <p className="text-xs text-gray-500">Secure payment</p>
          </div>
        </div>

        {isCancelled && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
            Checkout was cancelled. Your order has not been marked paid. You may try again below.
          </div>
        )}

        {isReturned && (
          <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900" role="status">
            Stripe returned you to BINZEO Central. The central payment record must confirm the transaction before you continue to JABIYEN.
          </div>
        )}

        <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
          {isReturned ? "Payment confirmation" : "Continue to payment"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          {isReturned
            ? "We verify payment with the central Stripe webhook. Once confirmed, use the button below to return to your JABIYEN order confirmation."
            : "Enter the order number from JABIYEN or use the order link. BINZEO Central checks the saved order and amount, then sends you to Stripe’s hosted checkout."}
        </p>

        <div className="mt-7">
          {isReturned ? (
            <PaymentReturnStatus
              paymentRequestId={requestId}
              expectedOrderNumber={orderNumber}
            />
          ) : (
            <PaymentForm initialOrderNumber={orderNumber} />
          )}
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          BINZEO does not collect or store your card number or security code.
        </p>
      </section>
    </main>
  );
}
