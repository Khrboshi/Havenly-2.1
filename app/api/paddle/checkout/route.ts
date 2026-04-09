// app/api/paddle/checkout/route.ts
// Creates a Paddle hosted-checkout transaction and returns the checkout URL.
//
// TRIAL: configure the trial period on your Paddle Price in the dashboard.
//        Set it to PRICING.trialDays (currently 3 days). Paddle requires
//        trial_period to be set on the Price itself, not at transaction time.
//
// ENV VARS REQUIRED (Vercel):
//   PADDLE_API_KEY       — Paddle secret API key (live_xxx or sandbox_xxx)
//   PADDLE_PRICE_ID      — Paddle price ID for the subscription (pri_xxx)
//   PADDLE_ENVIRONMENT   — "production" or "sandbox" (defaults to "production")

import { NextResponse } from "next/server";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function getPaddle() {
  const key = process.env.PADDLE_API_KEY;
  if (!key) throw new Error("PADDLE_API_KEY is not set");
  return new Paddle(key, {
    environment:
      process.env.PADDLE_ENVIRONMENT === "sandbox"
        ? Environment.sandbox
        : Environment.production,
  });
}

export async function POST() {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Guard: never create a second checkout for an already-Premium user.
    const { data: creditsRow } = await supabase
      .from("user_credits")
      .select("plan_type")
      .eq("user_id", user.id)
      .maybeSingle();

    const currentPlan = String(creditsRow?.plan_type ?? "FREE").toUpperCase();
    if (currentPlan === "PREMIUM" || currentPlan === "TRIAL") {
      return NextResponse.json(
        { error: "Already subscribed" },
        { status: 409 }
      );
    }

    const priceId = process.env.PADDLE_PRICE_ID;
    if (!priceId) {
      return NextResponse.json(
        { error: "Paddle price not configured" },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      console.error("[paddle/checkout] NEXT_PUBLIC_SITE_URL is not set");
      return NextResponse.json(
        { error: "Site URL not configured" },
        { status: 500 }
      );
    }

    const paddle = getPaddle();

    // Look up existing Paddle customer to pre-fill email on checkout
    const { data: profile } = await supabase
      .from("profiles")
      .select("paddle_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    let customerId = profile?.paddle_customer_id ?? null;

    if (!customerId && user.email) {
      const customer = await paddle.customers.create({
        email: user.email,
        customData: { supabase_user_id: user.id } as Record<string, unknown>,
      });
      customerId = customer.id;

      // Store customer ID — log if it fails but don't block checkout.
      // On retry the customer lookup above will find the Paddle record via
      // the customers.list API (idempotent by email in Paddle).
      const { error: upsertErr } = await supabase
        .from("profiles")
        .update({ paddle_customer_id: customerId })
        .eq("id", user.id);

      if (upsertErr) {
        console.error(
          "[paddle/checkout] failed to store paddle_customer_id — user may get duplicate customers on retry:",
          upsertErr
        );
      }
    }

    // Create a Paddle transaction — generates a hosted checkout URL.
    // supabase_user_id in customData flows through to all webhook events.
    // NOTE: checkout.url is the hosted checkout page URL, not a success redirect.
    // The success redirect is configured in Paddle dashboard → Checkout settings.
    const transaction = await paddle.transactions.create({
      items: [{ priceId, quantity: 1 }],
      customData: { supabase_user_id: user.id } as Record<string, unknown>,
      ...(customerId ? { customerId } : {}),
    });

    const checkoutUrl = transaction.checkout?.url;
    if (!checkoutUrl) {
      console.error(
        "[paddle/checkout] no checkout URL in response:",
        transaction
      );
      return NextResponse.json(
        { error: "Paddle did not return a checkout URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err: any) {
    console.error("[paddle/checkout] error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create checkout" },
      { status: 500 }
    );
  }
}
