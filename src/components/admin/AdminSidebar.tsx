'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10' },
  { href: '/admin/appointments', label: 'Citas', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/admin/clients', label: 'Clientes', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 014-4h1m8-6a4 4 0 11-8 0 4 4 0 018 0zm2-5a3 3 0 110 6 3 3 0 010-6z' },
  { href: '/admin/barbers', label: 'Barberos', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { href: '/admin/services', label: 'Servicios', icon: 'M3 6l9 6 9-6M3 6v12l9 6 9-6V6' },
  { href: '/admin/settings', label: 'Configuración', icon: 'M10.325 4.317a1 1 0 011.35 0l.708.708a1 1 0 00.707.293h1a1 1 0 011 1v1a1 1 0 00.293.707l.708.708a1 1 0 010 1.35l-.708.708a1 1 0 00-.293.707v1a1 1 0 01-1 1h-1a1 1 0 00-.707.293l-.708.708a1 1 0 01-1.35 0l-.708-.708a1 1 0 00-.707-.293h-1a1 1 0 01-1-1v-1a1 1 0 00-.293-.707l-.708-.708a1 1 0 010-1.35l.708-.708a1 1 0 00.293-.707v-1a1 1 0 011-1h1a1 1 0 00.707-.293l.708-.708zM12 15a3 3 0 100-6 3 3 0 000 6z' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 bg-gray-950 border-r border-gray-800 flex flex-col">
      <div className="px-6 py-6 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30">
            <svg className="w-5 h-5 text-gray-950" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h4l2 4H5L3 3zm8 0h10v4H13l-2-4zM3 10h18v11H3V10zm5 3v5h8v-5H8z"/></svg>
          </div>
          <div>
            <div className="text-white font-semibold tracking-tight text-sm">Barber Rollar MX</div>
            <div className="text-amber-500/80 text-[10px] uppercase tracking-widest">Admin</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'
              }`}
            >
              <svg className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-800">
        <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-amber-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ver sitio público
        </Link>
      </div>
    </aside>
  );
}
