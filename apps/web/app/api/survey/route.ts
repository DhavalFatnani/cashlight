import { submitSurvey } from "@cashlight/db";
import { NextResponse } from "next/server";

import { validateSurveyPayload } from "./validate";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = validateSurveyPayload(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await submitSurvey(result.value);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[survey]", error);
    return NextResponse.json(
      { error: "Unable to save response" },
      { status: 500 },
    );
  }
}
