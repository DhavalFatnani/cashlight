import {
  addToWaitlist,
  isPricingTierId,
  recordPricingIntent,
} from "@cashlight/db";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const email =
    typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const tier = typeof raw.tier === "string" ? raw.tier : "";
  const amountInr =
    typeof raw.amountInr === "number" && Number.isFinite(raw.amountInr)
      ? Math.max(0, Math.round(raw.amountInr))
      : null;
  const billingPeriod =
    typeof raw.billingPeriod === "string" ? raw.billingPeriod.trim() : "";
  const ctaLabel =
    typeof raw.ctaLabel === "string" ? raw.ctaLabel.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!isPricingTierId(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }
  if (amountInr === null) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }
  if (!billingPeriod) {
    return NextResponse.json({ error: "Invalid billing period" }, { status: 400 });
  }
  if (!ctaLabel) {
    return NextResponse.json({ error: "Invalid CTA" }, { status: 400 });
  }

  try {
    await recordPricingIntent({
      email,
      tier,
      amountInr,
      billingPeriod,
      ctaLabel,
    });
    const waitlist = await addToWaitlist(email, `pricing:${tier}`);
    return NextResponse.json({
      success: true,
      position: waitlist.position,
      isNew: waitlist.isNew,
      surveyCompleted: waitlist.surveyCompleted,
    });
  } catch (error) {
    const supabaseErr =
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
        ? (error as { code?: string; message: string; details?: string })
        : null;
    console.error(
      "[pricing-intent]",
      supabaseErr?.message ?? (error instanceof Error ? error.message : error),
      supabaseErr?.code ? { code: supabaseErr.code, details: supabaseErr.details } : "",
    );
    return NextResponse.json(
      { error: "Unable to save your interest" },
      { status: 500 },
    );
  }
}
