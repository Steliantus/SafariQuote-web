// Shared plan definitions for the public signup flow (app/signup and
// app/signup/payment-details). Keep this in sync with the plan cards on the
// Wix "Plans & Pricing" page -- the "Become a Member" buttons there link to
// /signup?plan=<key>, and these are the only keys that flow recognizes.
export const PLANS = {
  standard: {
    key: "standard",
    label: "Standard",
    price: "N$1,850",
    period: "per month",
    blurb: "The standard rate effective for clients signing up after September 29, 2026.",
  },
  beta: {
    key: "beta",
    label: "Beta",
    price: "N$950",
    period: "per month",
    blurb: "The beta tester rate for everyone signing up before September 29, 2026.",
  },
};

export function getPlan(key) {
  if (!key) return null;
  return PLANS[key] || null;
}
