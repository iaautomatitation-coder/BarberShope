import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [todayAppointments, pending, activeBarbers, activeServices, upcoming, completedToday] = await Promise.all([
      db.appointment.findMany({
        where: { date: today, status: { in: ["pending", "confirmed", "completed", "rescheduled"] } },
        include: { service: true, barber: true },
        orderBy: { time: "asc" },
      }),
      db.appointment.count({ where: { status: "pending" } }),
      db.barber.count({ where: { active: true } }),
      db.service.count({ where: { active: true } }),
      db.appointment.findMany({
        where: { date: { gt: today }, status: { in: ["pending", "confirmed", "rescheduled"] } },
        include: { service: true, barber: true },
        orderBy: [{ date: "asc" }, { time: "asc" }],
        take: 8,
      }),
      db.appointment.count({ where: { date: today, status: "completed" } }),
    ]);

    const revenueToday = todayAppointments
      .filter((a) => a.status !== "cancelled" && a.status !== "no_show")
      .reduce((sum, a) => sum + (a.totalPrice || a.service.price), 0);

    return NextResponse.json({
      todayCount: todayAppointments.length,
      pendingCount: pending,
      activeBarbersCount: activeBarbers,
      activeServicesCount: activeServices,
      revenueToday,
      completedToday,
      todayAppointments,
      upcoming,
    });
  } catch {
    return NextResponse.json({ error: "Error fetching stats" }, { status: 500 });
  }
}
