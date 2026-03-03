// app/api/stripe/portal/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Do NOT manually set apiVersion (avoids TS type issues)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return process.env.VERCEL_URL.startsWith("http")
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function toAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(path, getBaseUrl()).toString();
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

    // Read stripe_customer_id
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

    // Create Stripe customer if missing
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_uid: user.id },
      });

      customerId = customer.id;

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

    // Create billing portal session
    const urlObj = new URL(req.url);
    const returnParam = urlObj.searchParams.get("returnUrl");

    const return_url = toAbsoluteUrl(
      returnParam ||
        process.env.STRIPE_PORTAL_RETURN_URL ||
        "/settings/billing"
    );

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url,
    });

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (err: any) {
    console.error("[portal] error:", err?.message || err);
    return NextResponse.json({ error: "Portal error" }, { status: 500 });
  }
}

// Allow POST to behave the same as GET
export async function POST(req: Request) {
  return GET(req);
}
