import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

async function getOrCreateCustomerId(params: {
  userId: string;
  email?: string | null;
}) {
  const supabase = createServerSupabase();

  // Ensure profile exists
  const { data: existingProfile, error: selectErr } = await supabase
    .from("profiles")
    .select("id, stripe_customer_id, email")
    .eq("id", params.userId)
    .maybeSingle();

  if (selectErr) {
    throw new Error(selectErr.message);
  }

  // If no profile row, create one
  if (!existingProfile) {
    const { error: upsertErr } = await supabase.from("profiles").upsert(
      {
        id: params.userId,
        email: params.email ?? null,
        stripe_customer_id: null,
      },
      { onConflict: "id" }
    );
    if (upsertErr) throw new Error(upsertErr.message);
  }

  // Re-read to get current customer id
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email")
    .eq("id", params.userId)
    .single();

  if (profileErr) throw new Error(profileErr.message);

  // If already has Stripe customer, return it
  if (profile?.stripe_customer_id) {
    return String(profile.stripe_customer_id);
  }

  // Create Stripe customer
  const customer = await stripe.customers.create({
    email: params.email ?? profile?.email ?? undefined,
    metadata: {
      supabase_user_id: params.userId,
    },
  });

  // Persist it
  const { error: updateErr } = await supabase
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", params.userId);

  if (updateErr) throw new Error(updateErr.message);

  return customer.id;
}

async function createPortalUrl(req: NextRequest) {
  const supabase = createServerSupabase();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return { status: 401 as const, body: { error: "Unauthorized" } };
  }

  const returnUrlFromQuery = req.nextUrl.searchParams.get("returnUrl");
  const return_url =
    returnUrlFromQuery ||
    process.env.STRIPE_PORTAL_RETURN_URL ||
    `${req.nextUrl.origin}/settings/billing`;

  const customerId = await getOrCreateCustomerId({
    userId: user.id,
    email: user.email,
  });

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url,
  });

  return { status: 200 as const, body: { url: session.url } };
}

// For browser navigation: /api/stripe/portal?returnUrl=...
export async function GET(req: NextRequest) {
  try {
    const result = await createPortalUrl(req);
    if (result.status !== 200) {
      return NextResponse.json(result.body, { status: result.status });
    }
    return NextResponse.redirect(result.body.url, 302);
  } catch (e: any) {
    console.error("[portal][GET] error:", e?.message || e);
    return NextResponse.json({ error: "Portal error" }, { status: 500 });
  }
}

// For fetch() calls: POST /api/stripe/portal
export async function POST(req: NextRequest) {
  try {
    const result = await createPortalUrl(req);
    return NextResponse.json(result.body, { status: result.status });
  } catch (e: any) {
    console.error("[portal][POST] error:", e?.message || e);
    return NextResponse.json({ error: "Portal error" }, { status: 500 });
  }
}
