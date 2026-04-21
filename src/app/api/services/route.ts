import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const services = await db.service.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: "Error fetching services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const service = await db.service.create({ data: body });
    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const service = await db.service.update({
      where: { id },
      data,
    });
    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: "Error updating service" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    await db.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting service" }, { status: 500 });
  }
}
