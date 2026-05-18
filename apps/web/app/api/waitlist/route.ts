import { addToWaitlist } from "@cashlight/db";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("email" in body) ||
    typeof (body as { email: unknown }).email !== "string"
  ) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const email = (body as { email: string }).email.trim().toLowerCase();
  const source =
    "source" in body && typeof (body as { source: unknown }).source === "string"
      ? (body as { source: string }).source
      : "landing";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    const result = await addToWaitlist(email, source);
    return NextResponse.json({
      success: true,
      position: result.position,
      isNew: result.isNew,
      surveyCompleted: result.surveyCompleted,
    });
  } catch (error) {
    console.error("[waitlist]", error);
    return NextResponse.json(
      { error: "Unable to join waitlist" },
      { status: 500 },
    );
  }
}
