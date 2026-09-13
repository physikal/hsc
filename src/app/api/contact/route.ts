import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { notifyContactSubmission } from "@/lib/agentmail";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = contactSchema.parse(await req.json());
    const result = await notifyContactSubmission(body);
    if (!result.ok) {
      return NextResponse.json(
        {
          error:
            "We could not deliver your message right now. Please email or call the lodge, or try again shortly.",
          detail: result.error,
        },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
