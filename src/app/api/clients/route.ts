import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const where = q
      ? {
          OR: [
            { name: { contains: q } },
            { phone: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : {};

    const clients = await db.client.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: limit,
      include: { _count: { select: { appointments: true } } },
    });

    return NextResponse.json(clients);
  } catch {
    return NextResponse.json({ error: "Error fetching clients" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const client = await db.client.update({ where: { id }, data });
    return NextResponse.json(client);
  } catch {
    return NextResponse.json({ error: "Error updating client" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const count = await db.appointment.count({ where: { clientId: id } });
    if (count > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar: el cliente tiene ${count} cita${count === 1 ? '' : 's'} asociada${count === 1 ? '' : 's'}.` },
        { status: 409 }
      );
    }

    await db.client.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting client" }, { status: 500 });
  }
}
