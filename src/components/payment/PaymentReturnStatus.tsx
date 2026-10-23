"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type PaymentRequestStatus = {
  id: string;
  external_order_reference: string;
  status: string;
  latest_attempt: { status: string; paid_at: string | null } | null;
};

type ViewState = "checking" | "pending" | "paid" | "error";

const POLL_INTERVAL_MS = 3_000;
const MAX_AUTOMATIC_CHECKS = 20;

export default function PaymentReturnStatus({
  paymentRequestId,
  expectedOrderNumber,
}: {
  paymentRequestId: string;
  expectedOrderNumber: string;
}) {
  const [viewState, setViewState] = useState<ViewState>("checking");
  const [payment, setPayment] = useState<PaymentRequestStatus | null>(null);
  const [message, setMessage] = useState("");
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let checks = 0;

    if (!paymentRequestId) return;

    async function checkStatus() {
      const result = await apiFetch<PaymentRequestStatus>(
        `/api/payments/requests/${encodeURIComponent(paymentRequestId)}`,
      );
      if (!active) return;

      if (!result.success) {
        setViewState("error");
        setMessage(result.error.message);
        return;
      }

      if (
        expectedOrderNumber &&
        result.data.external_order_reference !== expectedOrderNumber
      ) {
        setViewState("error");
        setMessage("The payment reference does not match this order. Please contact BINZEO support before trying again.");
        return;
      }

      setPayment(result.data);
      if (result.data.status === "paid" || result.data.latest_attempt?.status === "paid") {
        setViewState("paid");
        setMessage("");
        return;
      }

      if (checks >= MAX_AUTOMATIC_CHECKS) {
        setViewState("pending");
        return;
      }

      checks += 1;
      setViewState("checking");
      timer = setTimeout(checkStatus, POLL_INTERVAL_MS);
    }

    void checkStatus();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [paymentRequestId, expectedOrderNumber, retryVersion]);

  const orderNumber = payment?.external_order_reference;
  const orderConfirmationUrl = orderNumber
    ? `https://www.jayenware.shop/order-confirmation?order=${encodeURIComponent(orderNumber)}`
    : null;
  const displayState: ViewState = paymentRequestId ? viewState : "error";
  const displayMessage = paymentRequestId
    ? message
    : "This return link is missing its payment reference. Do not submit another payment; contact BINZEO support for help checking the transaction.";

  const statusStyle = displayState === "paid"
    ? "border-green-200 bg-green-50 text-green-900"
    : displayState === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : "border-blue-200 bg-blue-50 text-blue-900";

  const statusText = displayState === "paid"
    ? "Payment confirmed by BINZEO Central."
    : displayState === "pending"
      ? "Stripe returned you to BINZEO Central, but the signed confirmation is still pending. Please do not submit another payment."
      : displayState === "error"
        ? "We could not verify the payment yet."
        : "Checking the central payment record. The order-confirmation button will appear after Stripe's signed webhook confirms payment.";

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border px-4 py-3 text-sm leading-6 ${statusStyle}`} role="status" aria-live="polite">
        <p>{statusText}</p>
        {orderNumber && <p className="mt-1 font-medium">JABIYEN order {orderNumber}</p>}
        {displayMessage && <p className="mt-2" role="alert">{displayMessage}</p>}
      </div>

      {displayState === "paid" && orderConfirmationUrl ? (
        <a
          href={orderConfirmationUrl}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Go to JABIYEN order confirmation
        </a>
      ) : paymentRequestId ? (
        <button
          type="button"
          onClick={() => {
            setViewState("checking");
            setMessage("");
            setRetryVersion((version) => version + 1);
          }}
          className="flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
        >
          Check payment status again
        </button>
      ) : null}
    </div>
  );
}
