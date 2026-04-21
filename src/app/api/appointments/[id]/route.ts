import { db } from "@/lib/db";
import { isValidStatus, type AppointmentStatus } from "@/lib/appointment-status";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const appointment = await db.appointment.findUnique({
      where: { id },
      include: { service: true, barber: true },
    });
    if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(appointment);
  } catch {
    return NextResponse.json({ error: "Error fetching appointment" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    const now = new Date();

    if (body.status !== undefined) {
      if (!isValidStatus(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      const status = body.status as AppointmentStatus;
      data.status = status;
      if (status === "confirmed") data.confirmedAt = now;
      if (status === "cancelled") data.cancelledAt = now;
      if (status === "completed") data.completedAt = now;
    }

    if (body.date !== undefined) data.date = body.date;
    if (body.time !== undefined) data.time = body.time;
    if (body.internalNotes !== undefined) data.internalNotes = body.internalNotes;
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.clientName !== undefined) data.clientName = body.clientName;
    if (body.clientPhone !== undefined) data.clientPhone = body.clientPhone;
    if (body.clientEmail !== undefined) data.clientEmail = body.clientEmail;

    // Reschedule shortcut: passing date+time auto-sets status=rescheduled unless explicit
    if ((body.date !== undefined || body.time !== undefined) && body.status === undefined) {
      data.status = "rescheduled";
    }

    if (body.date !== undefined || body.time !== undefined) {
      const current = await db.appointment.findUnique({
        where: { id },
        select: { date: true, time: true, barberId: true },
      });
      if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const newDate = body.date ?? current.date;
      const newTime = body.time ?? current.time;
      const conflict = await db.appointment.findFirst({
        where: {
          id: { not: id },
          barberId: current.barberId,
          date: newDate,
          time: newTime,
          status: { in: ["pending", "confirmed", "rescheduled"] },
        },
        select: { id: true },
      });
      if (conflict) {
        return NextResponse.json(
          { error: "Ese horario ya está ocupado por otra cita." },
          { status: 409 }
        );
      }
    }

    const updated = await db.appointment.update({
      where: { id },
      data,
      include: { service: true, barber: true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error updating appointment" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await db.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting appointment" }, { status: 500 });
  }
}
