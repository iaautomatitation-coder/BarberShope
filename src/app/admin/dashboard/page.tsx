'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';

type Appointment = {
  id: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  status: string;
  totalPrice: number;
  service: { name: string; price: number };
  barber: { name: string };
};

type Stats = {
  todayCount: number;
  pendingCount: number;
  activeBarbersCount: number;
  activeServicesCount: number;
  revenueToday: number;
  completedToday: number;
  todayAppointments: Appointment[];
  upcoming: Appointment[];
};

const MXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => {
        setStats(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Resumen operativo de tu barbería</p>
        </div>
        <Link
          href="/admin/appointments"
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-amber-900/20"
        >
          Ver agenda completa
        </Link>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Citas hoy"
              value={stats?.todayCount ?? 0}
              accent="amber"
              hint={stats && stats.completedToday > 0 ? `${stats.completedToday} completada${stats.completedToday === 1 ? '' : 's'}` : undefined}
            />
            <StatCard
              label="Pendientes de confirmar"
              value={stats?.pendingCount ?? 0}
              accent="rose"
              hint={stats?.pendingCount ? 'Requieren atención' : 'Todo al día'}
            />
            <StatCard
              label="Barberos activos"
              value={stats?.activeBarbersCount ?? 0}
              accent="blue"
              hint={stats?.activeServicesCount ? `${stats.activeServicesCount} servicios` : undefined}
            />
            <StatCard
              label="Ingresos estimados hoy"
              value={stats ? MXN.format(stats.revenueToday) : '—'}
              accent="green"
              hint={stats && stats.todayCount > 0 ? `${MXN.format(stats.revenueToday / Math.max(stats.todayCount, 1))} promedio` : undefined}
            />
          </>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel
          title="Agenda de hoy"
          count={stats?.todayAppointments.length}
          loading={loading}
          empty={!loading && (!stats || stats.todayAppointments.length === 0)}
          emptyLabel="Sin citas para hoy"
        >
          {stats?.todayAppointments.map((a) => (
            <Row key={a.id} appt={a} showDate={false} />
          ))}
        </Panel>

        <Panel
          title="Próximas citas"
          count={stats?.upcoming.length}
          loading={loading}
          empty={!loading && (!stats || stats.upcoming.length === 0)}
          emptyLabel="Sin próximas citas"
        >
          {stats?.upcoming.map((a) => (
            <Row key={a.id} appt={a} showDate formatDate={formatDate} />
          ))}
        </Panel>
      </section>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 animate-pulse">
      <div className="h-3 w-20 bg-gray-800 rounded" />
      <div className="mt-3 h-8 w-24 bg-gray-800 rounded" />
      <div className="mt-2 h-3 w-16 bg-gray-800/60 rounded" />
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="px-5 py-4 flex items-center gap-4 animate-pulse">
      <div className="w-14 h-8 bg-gray-800 rounded" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 bg-gray-800 rounded" />
        <div className="h-2.5 w-48 bg-gray-800/60 rounded" />
      </div>
      <div className="h-5 w-16 bg-gray-800 rounded-full" />
    </div>
  );
}

function Panel({
  title,
  children,
  empty,
  emptyLabel,
  loading,
  count,
}: {
  title: string;
  children: React.ReactNode;
  empty: boolean;
  emptyLabel: string;
  loading?: boolean;
  count?: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm tracking-wide">{title}</h3>
        {!loading && typeof count === 'number' && count > 0 && (
          <span className="text-[10px] uppercase tracking-widest text-amber-500/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="divide-y divide-gray-800">
        {loading ? (
          <>
            <RowSkeleton /><RowSkeleton /><RowSkeleton />
          </>
        ) : empty ? (
          <div className="px-5 py-12 text-center">
            <div className="text-gray-500 text-sm">{emptyLabel}</div>
            <Link href="/admin/appointments" className="inline-block mt-3 text-amber-400 hover:text-amber-300 text-xs font-medium">
              Ver toda la agenda →
            </Link>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function Row({ appt, showDate, formatDate }: { appt: Appointment; showDate: boolean; formatDate?: (d: string) => string }) {
  return (
    <div className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-900 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-14 text-center shrink-0">
          {showDate ? (
            <>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">{formatDate ? formatDate(appt.date) : appt.date}</div>
              <div className="text-amber-400 font-mono font-semibold text-sm">{appt.time}</div>
            </>
          ) : (
            <div className="text-amber-400 font-mono font-semibold">{appt.time}</div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-white font-medium text-sm truncate">{appt.clientName}</div>
          <div className="text-gray-400 text-xs truncate">{appt.service.name} · {appt.barber.name}</div>
        </div>
      </div>
      <StatusBadge status={appt.status} />
    </div>
  );
}
