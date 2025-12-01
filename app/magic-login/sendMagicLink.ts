import { NextResponse } from "next/server";
import sendMagicLink from "@/app/magic-login/sendMagicLink";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await sendMagicLink(email);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Magic link failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
