import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const plan = formData.get("plan")?.toString() ?? "monthly";

    const supabase = createServerSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.redirect("/magic-login");
    }

    const user = session.user;

    const priceId =
      plan === "yearly"
        ? process.env.STRIPE_YEARLY_PRICE_ID
        : process.env.STRIPE_MONTHLY_PRICE_ID;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email ?? undefined,
      line_items: [{ price: priceId!, quantity: 1 }],
      success_url: `${siteUrl}/premium?status=success`,
      cancel_url: `${siteUrl}/premium?status=cancel`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.redirect(checkout.url!, 303);
  } catch (err) {
    console.error("Checkout error:", err);
    return new NextResponse("Unable to create checkout session.", {
      status: 500,
    });
  }
}
