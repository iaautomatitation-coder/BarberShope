import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const barbers = await db.barber.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(barbers);
  } catch {
    return NextResponse.json({ error: "Error fetching barbers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const barber = await db.barber.create({ data: body });
    return NextResponse.json(barber, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating barber" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const barber = await db.barber.update({
      where: { id },
      data,
    });
    return NextResponse.json(barber);
  } catch {
    return NextResponse.json({ error: "Error updating barber" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    await db.barber.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting barber" }, { status: 500 });
  }
}
