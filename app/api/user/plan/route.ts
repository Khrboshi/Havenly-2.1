export async function GET() {
  return Response.json({
    plan: "free",
    premium: false,
    stripeConnected: false,
    message:
      "Stripe integration not yet enabled. You are on the free plan for now.",
  });
}
