#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

function buildPrisma() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (url) {
    console.log(`→ Conectado a Turso (${url})`);
    return new PrismaClient({ adapter: new PrismaLibSql({ url, authToken }) });
  }
  console.log('→ Conectado a SQLite local');
  return new PrismaClient();
}

const db = buildPrisma();
async function main() {
  console.log('Limpiando datos de demo…');
  const [apptsBefore, clientsBefore] = await Promise.all([db.appointment.count(), db.client.count()]);
  console.log(`Antes: ${apptsBefore} citas, ${clientsBefore} clientes`);
  await db.appointment.deleteMany();
  await db.client.deleteMany();
  const [apptsAfter, clientsAfter] = await Promise.all([db.appointment.count(), db.client.count()]);
  console.log(`Después: ${apptsAfter} citas, ${clientsAfter} clientes`);
  console.log('✓ Reset completo. Servicios, barberos y configuración intactos.');
}
main().catch((e) => { console.error('✗ Error:', e.message); process.exit(1); }).finally(() => db.$disconnect());
