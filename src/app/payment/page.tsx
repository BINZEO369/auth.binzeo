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
    <main className="min-h-screen bg-white text-black">
      {/* Custom keyframes for fadeUp animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes paymentFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .payment-fade-up {
          animation: paymentFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .payment-fade-up-delay {
          animation: paymentFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .payment-fade-up, .payment-fade-up-delay { animation: none !important; }
        }
      `}} />

      {/* Full-width edge-to-edge banner — same as checkout/payment pages */}
      <div className="w-full h-[140px] md:h-[320px] overflow-hidden bg-gray-100">
        <img
          src="https://raw.githubusercontent.com/BINZEO369/auth.binzeo/main/public/images/connected-accounts-checkout.jpg"
          alt="Secure Payment"
          className="w-full h-full object-cover block"
        />
      </div>

      {/* Centered content shell — same max-width as checkout/payment */}
      <div className="w-full max-w-[600px] md:max-w-[800px] mx-auto px-5 md:px-10 pt-8 md:pt-12 pb-16 md:pb-20">

        {/* Page Title — centered, uppercase, letter-spaced */}
        <h1 className="text-center text-[28px] md:text-[42px] font-light tracking-[2px] uppercase m-0 mb-10 md:mb-14 payment-fade-up">
          {isReturned ? "Payment Confirmation" : "Payment"}
        </h1>

        {/* Cancelled status — sharp bordered box */}
        {isCancelled && (
          <div
            className="payment-fade-up mb-6 md:mb-8 px-4 md:px-5 py-3 md:py-4 border border-black bg-gray-50 text-xs md:text-sm leading-relaxed text-black"
            role="status"
          >
            Checkout was cancelled. Your order has not been marked paid. You may try again below.
          </div>
        )}

        {/* Returned status — sharp bordered box */}
        {isReturned && (
          <div
            className="payment-fade-up mb-6 md:mb-8 px-4 md:px-5 py-3 md:py-4 border border-black bg-gray-50 text-xs md:text-sm leading-relaxed text-black"
            role="status"
          >
            Stripe returned you to BINZEO Central. The central payment record must confirm the transaction before you continue to JABIYEN.
          </div>
        )}

        {/* Description paragraph */}
        <p className="payment-fade-up text-sm md:text-base text-gray-600 leading-relaxed mb-8 md:mb-10 text-center max-w-2xl mx-auto">
          {isReturned
            ? "We verify payment with the central Stripe webhook. Once confirmed, use the button below to return to your JABIYEN order confirmation."
            : "Enter the order number from JABIYEN or use the order link. BINZEO Central checks the saved order and amount, then sends you to Stripe's hosted checkout."}
        </p>

        {/* Form / Return Status */}
        <div className="payment-fade-up-delay">
          {isReturned ? (
            <PaymentReturnStatus
              paymentRequestId={requestId}
              expectedOrderNumber={orderNumber}
            />
          ) : (
            <PaymentForm initialOrderNumber={orderNumber} />
          )}
        </div>

        {/* Footer privacy note */}
        <p className="mt-8 md:mt-10 text-center text-[11px] md:text-xs leading-5 text-gray-500 tracking-wide">
          BINZEO does not collect or store your card number or security code.
        </p>
      </div>
    </main>
  );
}
