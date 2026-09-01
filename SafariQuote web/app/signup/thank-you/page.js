// Shown after a visitor pays on Wix Pricing Plans (Standard or Beta) and is
// sent back to our site -- this is the "Include a link in the order
// confirmation page" target configured on both plans in Wix. It's just a
// friendly landing spot: the real tenant provisioning happens asynchronously
// via the Wix Automation calling app/api/signup/webhook/route.js once Wix
// confirms payment, so this page doesn't (and can't) confirm that the
// account is ready yet -- that's what the invite email is for.

export default function SignupThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
        <h1 className="text-xl font-semibold text-neutral-900">SafariQuote</h1>
        <p className="text-sm text-neutral-600 mt-4">
          Thank you very much for signing on to SafariQuote. Please check
          your email to start saving time on your quotes!
        </p>
      </div>
    </div>
  );
}
