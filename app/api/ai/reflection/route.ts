  /**
   * 🧠 AI GENERATION (only reached if credit allowed)
   */
  try {
    // Determine plan (FREE vs PREMIUM)
    const { data: planData } = await supabase
      .from("user_plans")
      .select("plan_type")
      .eq("user_id", userId)
      .maybeSingle();

    const plan =
      planData?.plan_type === "PREMIUM" ? "PREMIUM" : "FREE";

    const reflection = await generateReflectionFromEntry({
      content: body.content,
      title: body.title,
      plan,
    });

    return NextResponse.json({
      reflection,
      remainingCredits: creditResult.remaining,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }
