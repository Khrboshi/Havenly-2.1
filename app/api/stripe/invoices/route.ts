import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profErr) {
      console.error("[invoices] profiles read error:", profErr);
      return NextResponse.json({ error: "Invoices error" }, { status: 500 });
    }

    const customerId = profile?.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json(
        { error: "Missing stripe_customer_id" },
        { status: 400 }
      );
    }

    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 20,
    });

    return NextResponse.json({
      items: invoices.data.map((inv) => ({
        id: inv.id,
        number: inv.number,
        status: inv.status,
        amount_paid: inv.amount_paid,
        amount_due: inv.amount_due,
        currency: inv.currency,
        created: inv.created,
        hosted_invoice_url: inv.hosted_invoice_url,
        invoice_pdf: inv.invoice_pdf,
      })),
    });
  } catch (e: any) {
    console.error("[invoices] error:", e?.message || e);
    return NextResponse.json({ error: "Invoices error" }, { status: 500 });
  }
}
