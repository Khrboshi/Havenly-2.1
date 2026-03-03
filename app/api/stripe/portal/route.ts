// app/api/stripe/portal/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // do NOT set apiVersion here

function absUrl(input: string) {
  // Allows relative paths like "/settings/billing"
  if (input.startsWith("http://") || input.startsWith("https://")) return input;
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL?.startsWith("http")
      ? process.env.VERCEL_URL
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  return new URL(input, base).toString();
}

// GET /api/stripe/portal?returnUrl=/settings/billing
export async function GET(req: Request) {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1) Read existing stripe_customer_id from profiles (if present)
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profErr) {
      console.error("[portal] profiles read error:", profErr);
      return NextResponse.json({ error: "Portal error" }, { status: 500 });
    }

    let customerId = profile?.stripe_customer_id ?? null;

    // 2) If missing, create Stripe customer and store it on profiles
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_uid: user.id },
      });

      customerId = customer.id;

      // Upsert profile row (requires RLS policy allowing insert/update for own row)
      const { error: upsertErr } = await supabase
        .from("profiles")
        .upsert(
          { id: user.id, stripe_customer_id: customerId },
          { onConflict: "id" }
        );

      if (upsertErr) {
        console.error("[portal] profiles upsert error:", upsertErr);
        return NextResponse.json(
          { error: "Could not save Stripe customer id." },
          { status: 500 }
        );
      }
    }

    // 3) Create billing portal session
    const urlObj = new URL(req.url);
    const returnUrlParam = urlObj.searchParams.get("returnUrl");
    const return_url = absUrl(
      returnUrlParam ||
        process.env.STRIPE_PORTAL_RETURN_URL ||
        "/settings/billing"
    );

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url,
    });

    // Redirect straight to Stripe portal
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (e: any) {
    console.error("[portal] error:", e?.message || e);
    return NextResponse.json({ error: "Portal error" }, { status: 500 });
  }
}

// Optional: if your UI calls POST instead of GET, keep this too.
export async function POST(req: Request) {
  const url = new URL(req.url);
  // Reuse GET behavior (same auth + redirect)
  return GET(new Request(url.toString(), { method: "GET", headers: req.headers }));
}
