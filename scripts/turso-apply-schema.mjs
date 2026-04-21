#!/usr/bin/env node
/**
 * Applies the Prisma-generated SQL schema to Turso via libsql-client.
 * Safe to re-run — uses CREATE TABLE (will fail if tables exist, see --force).
 *
 * Usage:
 *   node scripts/turso-apply-schema.mjs [path/to/schema.sql] [--force]
 *
 * --force drops existing tables first (destructive, use for clean demo reset).
 */

import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const force = args.includes('--force');
const sqlPath = args.find((a) => !a.startsWith('--')) || '/tmp/turso-init.sql';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) {
  console.error('Missing TURSO_DATABASE_URL in env');
  process.exit(1);
}

const client = createClient({ url, authToken });

function splitStatements(sql) {
  // Strip comment-only lines first, then split on `;\n`.
  const stripped = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');
  return stripped
    .split(/;\s*\n/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function dropAllIfForce() {
  if (!force) return;
  console.log('→ --force: dropping existing tables…');
  const tables = ['Appointment', 'Client', 'Testimonial', 'Gallery', 'Barber', 'Service', 'Barbershop'];
  for (const t of tables) {
    try {
      await client.execute(`DROP TABLE IF EXISTS "${t}"`);
      console.log(`  dropped ${t}`);
    } catch (e) {
      console.warn(`  skip ${t}: ${e.message}`);
    }
  }
}

async function main() {
  const sql = readFileSync(resolve(sqlPath), 'utf8');
  const statements = splitStatements(sql);
  console.log(`→ Target: ${url}`);
  console.log(`→ Statements: ${statements.length}`);

  await dropAllIfForce();

  let ok = 0;
  let fail = 0;
  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      ok += 1;
    } catch (e) {
      fail += 1;
      console.error(`  ✗ ${stmt.slice(0, 80)}… → ${e.message}`);
    }
  }
  console.log(`✓ ${ok} ok, ${fail} errors`);
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
