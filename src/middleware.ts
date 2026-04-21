import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Basic Auth guard for the admin surface + write endpoints.
 *
 * Protects:
 *   - /admin/*          (UI)
 *   - /api/*            (non-GET methods) EXCEPT `POST /api/appointments`, which is
 *                        the public booking endpoint the landing uses.
 *
 * Credentials come from env:
 *   DEMO_USER
 *   DEMO_PASS
 *
 * Behaviour if not configured:
 *   - In development → pass-through (so local iteration isn't blocked).
 *   - In production  → hard 500 with clear message (fail-closed, avoids leaking).
 */

const REALM = 'BarberRoyal Admin';

function unauthorized() {
  return new NextResponse('Autenticación requerida.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
    },
  });
}

function checkAuth(req: NextRequest): NextResponse | null {
  const user = process.env.DEMO_USER;
  const pass = process.env.DEMO_PASS;

  if (!user || !pass) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse(
        'Admin credentials not configured. Set DEMO_USER and DEMO_PASS.',
        { status: 500 }
      );
    }
    return null; // dev pass-through
  }

  const header = req.headers.get('authorization') ?? '';
  if (!header.startsWith('Basic ')) return unauthorized();

  let decoded = '';
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorized();
  }

  const idx = decoded.indexOf(':');
  if (idx < 0) return unauthorized();
  const gotUser = decoded.slice(0, idx);
  const gotPass = decoded.slice(idx + 1);

  if (gotUser !== user || gotPass !== pass) return unauthorized();
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // /admin/* → always gated.
  if (pathname.startsWith('/admin')) {
    const denied = checkAuth(req);
    if (denied) return denied;
    return NextResponse.next();
  }

  // /api/* → gate all mutations EXCEPT POST /api/appointments (public booking).
  if (pathname.startsWith('/api') && method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    const isPublicBooking = method === 'POST' && pathname === '/api/appointments';
    if (isPublicBooking) return NextResponse.next();
    const denied = checkAuth(req);
    if (denied) return denied;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
