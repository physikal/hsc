import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { cancelSlot, getSlot, updateSlot } from "@/lib/db";

export const runtime = "nodejs";

const patchSchema = z.object({
  huntId: z.string().min(1).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  capacity: z.number().int().positive().optional(),
  notes: z.string().optional(),
  status: z.enum(["open", "full", "cancelled"]).optional(),
});

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  // Public slot record (capacity only). No guest or booking fields.
  try {
    const { id } = await ctx.params;
    const slot = await getSlot(id);
    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }
    return NextResponse.json({ slot });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get slot" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await ctx.params;
    const body = patchSchema.parse(await req.json());
    const slot =
      body.status === "cancelled" && Object.keys(body).length === 1
        ? await cancelSlot(id)
        : await updateSlot(id, body);
    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }
    return NextResponse.json({ slot });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await ctx.params;
    const slot = await cancelSlot(id);
    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }
    return NextResponse.json({ slot });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to cancel slot" },
      { status: 500 },
    );
  }
}
