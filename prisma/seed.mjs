import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

function buildPrisma() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (url) {
    console.log(`→ Seeding Turso (${url})`);
    return new PrismaClient({ adapter: new PrismaLibSql({ url, authToken }) });
  }
  console.log('→ Seeding local SQLite');
  return new PrismaClient();
}

const db = buildPrisma();
const weekday = { open: true, start: '10:00', end: '20:00' };
const sunday = { open: false, start: '10:00', end: '20:00' };
const schedule = {
  lunes: weekday, martes: weekday, miercoles: weekday, jueves: weekday,
  viernes: weekday, sabado: { open: true, start: '09:00', end: '21:00' }, domingo: sunday,
};

async function main() {
  const existing = await db.barbershop.findFirst();
  if (!existing) {
    await db.barbershop.create({
      data: {
        name: 'Barber Rollar MX',
        phone: '+52 55 1234 5678', whatsapp: '525512345678',
        email: 'contacto@barberrollarmx.com', address: 'CDMX, México',
        facebook: '', instagram: '', tiktok: '',
        scheduleJson: JSON.stringify(schedule),
      },
    });
    console.log('  ✓ barbershop created');
  } else console.log('  · barbershop already present');

  if ((await db.service.count()) === 0) {
    await db.service.createMany({
      data: [
        { name: 'Corte Clásico', description: 'Corte tradicional a tijera y máquina.', price: 180, duration: 30, order: 1 },
        { name: 'Corte + Barba', description: 'Corte completo con perfilado y diseño de barba.', price: 280, duration: 45, order: 2 },
        { name: 'Afeitado Premium', description: 'Afeitado con toalla caliente y aceites.', price: 220, duration: 30, order: 3 },
      ],
    });
    console.log('  ✓ 3 services created');
  } else console.log('  · services already present');

  if ((await db.barber.count()) === 0) {
    await db.barber.createMany({
      data: [
        { name: 'Carlos Ramírez', specialty: 'Cortes clásicos y fades',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop', order: 1 },
        { name: 'Luis Hernández', specialty: 'Diseño de barba y afeitado',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80&auto=format&fit=crop', order: 2 },
        { name: 'Diego Ortega', specialty: 'Diseños artísticos y texturas',
          photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80&auto=format&fit=crop', order: 3 },
      ],
    });
    console.log('  ✓ 3 barbers created');
  } else console.log('  · barbers already present');

  if ((await db.testimonial.count()) === 0) {
    await db.testimonial.createMany({
      data: [
        { name: 'Jorge A.', text: 'Mejor corte que me he hecho en años.', rating: 5, order: 1 },
        { name: 'Miguel P.', text: 'Ambiente increíble y atención de lujo.', rating: 5, order: 2 },
      ],
    });
    console.log('  ✓ 2 testimonials created');
  } else console.log('  · testimonials already present');

  console.log('✓ seed complete');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
