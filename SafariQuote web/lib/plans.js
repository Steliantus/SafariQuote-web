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

// Every signup before this date gets the Beta plan, no matter which pricing
// button they clicked (or whether the link carried a plan at all) -- decided
// 2026-09 after a Wix pricing-button link pointed the Beta card at the
// Standard plan; forcing this in the app itself fixes it regardless of what
// the Wix buttons actually link to, and matches the blurb text above.
export const BETA_CUTOFF = new Date("2026-09-29T00:00:00Z");

export function isBetaCutoffActive(now = new Date()) {
  return now < BETA_CUTOFF;
}

// The plan actually shown to the visitor and stored on their signup: before
// the cutoff this is always Beta; after it, the plan they actually asked for
// (or null if the link didn't specify a recognized one).
export function resolveSignupPlan(key, now = new Date()) {
  if (isBetaCutoffActive(now)) return PLANS.beta;
  return getPlan(key);
}
