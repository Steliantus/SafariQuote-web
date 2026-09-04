import Link from "next/link";
import { getPlan } from "@/lib/plans";

// Shown right after someone submits the /signup form. We're not routing
// payment through PayPal/Wix Pricing Plans checkout right now (PayPal's
// recurring-payments review is stuck, and Wix's "Manual Payments" method is
// already active), so instead this page shows our bank details and asks the
// visitor to pay by transfer. There's no automated confirmation step: once
// John/Dana see the transfer land (matched by the company/contact name
// reference), they create the real tenant by hand via /admin/tenants, which
// sends the invite email. See lib/tenantProvisioning.js for what that does.
//
// This route is listed in lib/supabase/middleware.js's `isPublic` check so
// unauthenticated visitors can reach it.

const CONTACT_EMAIL = "steliantus@gmail.com";
const CONTACT_PHONE = "+264 81 872 6815";

export default async function PaymentDetailsPage({ searchParams }) {
  const params = await searchParams;
  const plan = getPlan(params?.plan);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <h1 className="text-xl font-semibold text-neutral-900">SafariQuote</h1>
        <p className="text-sm text-neutral-500 mt-1 mb-6">
          Thanks &mdash; your details are saved. Here&apos;s how to pay.
        </p>

        {plan && (
          <p className="text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 mb-6 text-neutral-700">
            <span className="font-medium">{plan.label}</span> plan &mdash; {plan.price}{" "}
            {plan.period}
          </p>
        )}

        <div className="border border-neutral-200 rounded-lg p-4 mb-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">
            Bank transfer details
          </h2>
          <dl className="text-sm text-neutral-700 space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Bank</dt>
              <dd className="font-medium text-right">Armstrong Bank</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Account holder</dt>
              <dd className="font-medium text-right">Dana Wheeling</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Account number</dt>
              <dd className="font-medium text-right">2115160</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Routing number (ABA)</dt>
              <dd className="font-medium text-right">103104528</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">SWIFT / BIC</dt>
              <dd className="font-medium text-right">BAOKUS44</dd>
            </div>
          </dl>
          <p className="text-xs text-neutral-400 mt-3">
            Please use your company name and your name as the payment
            reference so we can match your transfer quickly.
          </p>
        </div>

        <p className="text-sm text-neutral-600 mb-6">
          Once we confirm your payment, we&apos;ll set up your account and
          email you a link to set your password and get started.
        </p>

        <div className="border-t border-neutral-200 pt-4">
          <p className="text-sm text-neutral-700">
            Prefer to talk it through first? We&apos;re happy to set up a
            Zoom call.
          </p>
          <p className="text-sm text-neutral-600 mt-1">
            Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-neutral-900 font-medium underline"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            or call {CONTACT_PHONE}.
          </p>
        </div>

        <Link
          href="/"
          className="block text-center text-xs text-neutral-400 mt-6 hover:text-neutral-600"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
