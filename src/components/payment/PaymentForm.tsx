"use client";

import { useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api/client";

type CheckoutSession = {
  payment_request_id: string;
  checkout_session_id: string | null;
  checkout_url: string;
  status: string;
  order_number: string;
  amount_minor: number;
  currency: string;
};

export default function PaymentForm({
  initialOrderNumber,
}: {
  initialOrderNumber: string;
}) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = orderNumber.trim();
    if (!value || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    const result = await apiFetch<CheckoutSession>("/api/payments/jabiyen/checkout-sessions", {
      method: "POST",
      body: JSON.stringify({ order_number: value }),
    });

    if (!result.success) {
      setError(result.error.message);
      setIsSubmitting(false);
      return;
    }

    let checkoutUrl: URL;
    try {
      checkoutUrl = new URL(result.data.checkout_url);
    } catch {
      setError("The central service returned an invalid checkout link. Please contact support.");
      setIsSubmitting(false);
      return;
    }

    if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.stripe.com") {
      setError("The central service returned an untrusted checkout link. Please contact support.");
      setIsSubmitting(false);
      return;
    }

    window.location.assign(checkoutUrl.toString());
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="jabiyen-order-number" className="mb-2 block text-sm font-medium text-gray-800">
        JABIYEN order number
      </label>
      <input
        id="jabiyen-order-number"
        name="order_number"
        autoComplete="off"
        required
        maxLength={80}
        value={orderNumber}
        onChange={(event) => setOrderNumber(event.target.value)}
        placeholder="For example, the number shown on your order confirmation"
        className="mb-4 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
      />

      <p className="mb-4 rounded-xl bg-gray-50 px-4 py-3 text-sm leading-5 text-gray-600">
        The customer account must match the verified email used for the order. Amount, delivery status, and currency conversion are checked by BINZEO Central—not by this page.
      </p>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!orderNumber.trim() || isSubmitting}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isSubmitting ? "Connecting to Stripe…" : "Pay securely with Stripe"}
      </button>
    </form>
  );
}
