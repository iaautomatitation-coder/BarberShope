import { db } from "@/lib/db";
import { NextResponse } from "next/server";

function getTimeSlots(startHour: number, endHour: number, serviceDuration: number): string[] {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += serviceDuration) {
      if (h === endHour && m > 0) break;
      const hour = h.toString().padStart(2, "0");
      const min = m.toString().padStart(2, "0");
      slots.push(`${hour}:${min}`);
    }
  }
  return slots;
}

function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr + "T12:00:00");
  return date.getDay();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const barberId = searchParams.get("barberId");
    const serviceDuration = parseInt(searchParams.get("duration") || "30", 10);

    if (!date) {
      return NextResponse.json({ error: "Date required" }, { status: 400 });
    }

    const shop = await db.barbershop.findFirst();
    let schedule: Record<string, { open: boolean; start: string; end: string }> = {};
    try {
      schedule = shop ? JSON.parse(shop.scheduleJson) : {};
    } catch {
      // ignore parse errors
    }

    const dayNames = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const dayOfWeek = getDayOfWeek(date);
    const dayName = dayNames[dayOfWeek];
    const dayConfig = schedule[dayName] || { open: false, start: "09:00", end: "19:00" };

    if (!dayConfig.open) {
      return NextResponse.json({ slots: [], dayClosed: true });
    }

    const [startH, startM] = dayConfig.start.split(":").map(Number);
    const [endH, endM] = dayConfig.end.split(":").map(Number);

    const allSlots = getTimeSlots(startH, endH, serviceDuration);

    // Check today - don't allow past times
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    const booked = await db.appointment.findMany({
      where: {
        date,
        ...(barberId ? { barberId } : {}),
        status: { in: ["confirmed", "pending", "rescheduled"] },
      },
      select: { time: true },
    });

    const bookedTimes = new Set(booked.map((b) => b.time));

    const available = allSlots.filter((slot) => {
      if (bookedTimes.has(slot)) return false;
      if (date === todayStr) {
        const [sh, sm] = slot.split(":").map(Number);
        if (sh < currentHour || (sh === currentHour && sm <= currentMin)) return false;
      }
      return true;
    });

    return NextResponse.json({ slots: available, dayClosed: false });
  } catch {
    return NextResponse.json({ error: "Error fetching availability" }, { status: 500 });
  }
}
