"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type PaymentRequestStatus = {
  id: string;
  external_order_reference: string;
  status: string;
  fulfillment_status: "not_required" | "pending" | "fulfilled";
  latest_attempt: { status: string; paid_at: string | null } | null;
};

type PaymentReturnHandoff = { return_url: string; expires_at: string };
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
  const [handoffLoading, setHandoffLoading] = useState(false);
  const [handoffError, setHandoffError] = useState("");

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
      if (result.data.status === "paid" && result.data.fulfillment_status === "fulfilled") {
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
  const displayState: ViewState = paymentRequestId ? viewState : "error";
  const displayMessage = paymentRequestId
    ? message
    : "This return link is missing its payment reference. Do not submit another payment; contact BINZEO support for help checking the transaction.";

  async function openOrderConfirmation() {
    if (!paymentRequestId || handoffLoading) return;
    setHandoffLoading(true);
    setHandoffError("");
    const result = await apiFetch<PaymentReturnHandoff>(
      `/api/payments/requests/${encodeURIComponent(paymentRequestId)}/return-handoff`,
      { method: "POST", body: JSON.stringify({}) },
    );
    setHandoffLoading(false);
    if (!result.success) {
      setHandoffError(result.error.message || "Could not create a secure order return link. Please try again.");
      return;
    }

    try {
      const target = new URL(result.data.return_url);
      const handoff = new URLSearchParams(target.hash.slice(1)).get("payment_handoff");
      if (target.protocol !== "https:" || !handoff || target.username || target.password) {
        throw new Error("INVALID_HANDOFF_URL");
      }
      window.location.assign(target.toString());
    } catch {
      setHandoffError("The secure order return link is invalid. Please try again or contact BINZEO support.");
    }
  }

  const statusStyle = displayState === "paid"
    ? "border-green-200 bg-green-50 text-green-900"
    : displayState === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : "border-blue-200 bg-blue-50 text-blue-900";

  const statusText = displayState === "paid"
    ? "Payment verified and the JABIYEN order is confirmed."
    : displayState === "pending"
      ? "Stripe has not yet completed the signed payment and order confirmation. Please do not submit another payment."
      : displayState === "error"
        ? "We could not verify the payment yet."
        : "Checking the central payment record. The order-return button will appear only after the signed webhook confirms payment and updates JABIYEN.";

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border px-4 py-3 text-sm leading-6 ${statusStyle}`} role="status" aria-live="polite">
        <p>{statusText}</p>
        {orderNumber && <p className="mt-1 font-medium">JABIYEN order {orderNumber}</p>}
        {displayMessage && <p className="mt-2" role="alert">{displayMessage}</p>}
      </div>

      {displayState === "paid" && orderNumber ? (
        <button
          type="button"
          onClick={() => void openOrderConfirmation()}
          disabled={handoffLoading}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60"
        >
          {handoffLoading ? "Creating secure return link…" : "Go to JABIYEN order confirmation"}
        </button>
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
      {handoffError && <p className="text-sm text-red-700" role="alert">{handoffError}</p>}
    </div>
  );
}
