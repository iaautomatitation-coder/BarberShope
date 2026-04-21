import { db } from "@/lib/db";
import { isValidStatus } from "@/lib/appointment-status";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");
    const barberId = searchParams.get("barberId");
    const limit = parseInt(searchParams.get("limit") || "200", 10);

    const where: Record<string, unknown> = {};
    if (status && isValidStatus(status)) where.status = status;
    if (date) where.date = date;
    if (barberId) where.barberId = barberId;

    const appointments = await db.appointment.findMany({
      where,
      orderBy: [{ date: "desc" }, { time: "desc" }],
      include: { service: true, barber: true },
      take: limit,
    });
    return NextResponse.json(appointments);
  } catch {
    return NextResponse.json({ error: "Error fetching appointments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.clientName || !body.clientPhone || !body.serviceId || !body.barberId || !body.date || !body.time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const service = await db.service.findUnique({ where: { id: body.serviceId } });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    const barber = await db.barber.findUnique({ where: { id: body.barberId } });
    if (!barber) return NextResponse.json({ error: "Barber not found" }, { status: 404 });

    const conflict = await db.appointment.findFirst({
      where: {
        barberId: body.barberId,
        date: body.date,
        time: body.time,
        status: { in: ["pending", "confirmed", "rescheduled"] },
      },
      select: { id: true },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Ese horario ya no está disponible. Elige otro." },
        { status: 409 }
      );
    }

    const client = await db.client.upsert({
      where: { phone: body.clientPhone },
      update: { name: body.clientName, email: body.clientEmail || undefined },
      create: {
        name: body.clientName,
        phone: body.clientPhone,
        email: body.clientEmail || "",
      },
    });

    const appointment = await db.appointment.create({
      data: {
        clientId: client.id,
        clientName: body.clientName,
        clientPhone: body.clientPhone,
        clientEmail: body.clientEmail || "",
        serviceId: body.serviceId,
        barberId: body.barberId,
        date: body.date,
        time: body.time,
        notes: body.notes || "",
        source: body.source || "web",
        totalPrice: service.price,
        status: "confirmed",
        confirmedAt: new Date(),
      },
      include: { service: true, barber: true },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating appointment" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting appointment" }, { status: 500 });
  }
}
