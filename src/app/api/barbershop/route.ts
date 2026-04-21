import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const shop = await db.barbershop.findFirst();
    if (!shop) {
      return NextResponse.json({
        id: "default",
        name: "Barber Rollar MX",
        phone: "",
        whatsapp: "",
        email: "",
        address: "",
        facebook: "",
        instagram: "",
        tiktok: "",
        scheduleJson: "{}",
      });
    }
    return NextResponse.json(shop);
  } catch {
    return NextResponse.json({ error: "Error fetching barbershop" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const existing = await db.barbershop.findFirst();

    if (existing) {
      const updated = await db.barbershop.update({
        where: { id: existing.id },
        data: {
          name: body.name ?? existing.name,
          phone: body.phone ?? existing.phone,
          whatsapp: body.whatsapp ?? existing.whatsapp,
          email: body.email ?? existing.email,
          address: body.address ?? existing.address,
          facebook: body.facebook ?? existing.facebook,
          instagram: body.instagram ?? existing.instagram,
          tiktok: body.tiktok ?? existing.tiktok,
          scheduleJson: body.scheduleJson ?? existing.scheduleJson,
        },
      });
      return NextResponse.json(updated);
    } else {
      const created = await db.barbershop.create({ data: body });
      return NextResponse.json(created);
    }
  } catch {
    return NextResponse.json({ error: "Error updating barbershop" }, { status: 500 });
  }
}
