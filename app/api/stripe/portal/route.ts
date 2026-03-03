import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get stripe_customer_id from profiles
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profErr || !profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer found for this user." },
        { status: 400 }
      );
    }

    const return_url =
      process.env.STRIPE_PORTAL_RETURN_URL ||
      "https://havenly-2-1.vercel.app/settings/billing";

    const session = await stripe.billingPortal.sessions.create({
      customer: String(profile.stripe_customer_id),
      return_url,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("[portal] error:", e?.message || e);
    return NextResponse.json({ error: "Portal error" }, { status: 500 });
  }
}
