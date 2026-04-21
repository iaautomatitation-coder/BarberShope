'use client';

import { useEffect, useMemo, useState } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';

type ClientListItem = {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  _count: { appointments: number };
};

type ClientAppointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  totalPrice: number;
  service: { name: string; price: number };
  barber: { name: string };
};

type ClientDetail = ClientListItem & {
  appointments: ClientAppointment[];
};

const MXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/clients');
    setClients(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    );
  }, [clients, query]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Clientes</h1>
          <p className="text-gray-400 text-sm mt-1">Directorio de personas que han reservado</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-2 min-w-[260px]">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, teléfono o correo…"
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-500 hover:text-white text-xs">×</button>
          )}
        </div>
      </header>

      <div className="rounded-2xl border border-gray-800 bg-gray-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900/80 border-b border-gray-800">
              <tr className="text-left text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Correo</th>
                <th className="px-4 py-3 font-medium text-right">Citas</th>
                <th className="px-4 py-3 font-medium">Última actualización</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-16 text-center text-gray-500">Cargando…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-16 text-center text-gray-500">
                  {clients.length === 0 ? 'Aún no hay clientes' : 'Sin resultados para esa búsqueda'}
                </td></tr>
              ) : filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setDetailId(c.id)}
                  className="hover:bg-gray-900/60 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-300">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-400 truncate max-w-[220px]">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                      {c._count.appointments}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{formatDate(c.updatedAt)}</td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {c.phone && (
                      <a
                        href={`https://wa.me/${c.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        WhatsApp
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detailId && (
        <ClientDrawer
          clientId={detailId}
          onClose={() => setDetailId(null)}
          onSaved={() => { load(); }}
          onDeleted={() => { setDetailId(null); load(); }}
        />
      )}
    </div>
  );
}

function ClientDrawer({
  clientId,
  onClose,
  onSaved,
  onDeleted,
}: {
  clientId: string;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/clients/${clientId}`)
      .then((r) => r.json())
      .then((data: ClientDetail) => {
        if (cancelled) return;
        setClient(data);
        setName(data.name || '');
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setNotes(data.notes || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [clientId]);

  const dirty = client && (
    name !== client.name ||
    phone !== client.phone ||
    email !== (client.email || '') ||
    notes !== (client.notes || '')
  );

  const save = async () => {
    setSaving(true);
    setErr('');
    const res = await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, notes }),
    });
    if (res.ok) {
      const next = await res.json();
      setClient((c) => c ? { ...c, ...next } : c);
      onSaved();
    } else {
      const data = await res.json().catch(() => ({}));
      setErr(data.error || 'Error al guardar');
    }
    setSaving(false);
  };

  const del = async () => {
    if (!confirm('¿Eliminar este cliente? Solo se puede si no tiene citas asociadas.')) return;
    setSaving(true);
    setErr('');
    const res = await fetch(`/api/clients?id=${clientId}`, { method: 'DELETE' });
    setSaving(false);
    if (res.ok) {
      onDeleted();
    } else {
      const data = await res.json().catch(() => ({}));
      setErr(data.error || 'No se pudo eliminar');
    }
  };

  const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

  const stats = useMemo(() => {
    if (!client) return { total: 0, completed: 0, cancelled: 0, revenue: 0 };
    const appts = client.appointments;
    return {
      total: appts.length,
      completed: appts.filter((a) => a.status === 'completed').length,
      cancelled: appts.filter((a) => a.status === 'cancelled' || a.status === 'no_show').length,
      revenue: appts
        .filter((a) => a.status === 'completed')
        .reduce((sum, a) => sum + (a.totalPrice || a.service.price), 0),
    };
  }, [client]);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto h-full w-full max-w-md bg-gray-950 border-l border-gray-800 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-6 py-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-amber-500/80 font-medium">Ficha del cliente</div>
            <h3 className="text-white font-bold text-lg mt-1 truncate">{loading ? 'Cargando…' : client?.name}</h3>
            {client && (
              <div className="text-gray-400 text-xs mt-0.5">
                Alta: {formatDate(client.createdAt.split('T')[0])}
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {loading ? (
            <div className="text-gray-500 text-sm text-center py-10">Cargando ficha…</div>
          ) : !client ? (
            <div className="text-gray-500 text-sm text-center py-10">No se encontró el cliente.</div>
          ) : (
            <>
              <section className="grid grid-cols-3 gap-2">
                <StatMini label="Citas" value={stats.total} tone="amber" />
                <StatMini label="Completadas" value={stats.completed} tone="emerald" />
                <StatMini label="Gasto total" value={MXN.format(stats.revenue)} tone="white" />
              </section>

              <section className="space-y-3">
                <h4 className="text-white font-semibold text-sm">Datos de contacto</h4>
                <Field label="Nombre" value={name} onChange={setName} />
                <Field label="Teléfono" value={phone} onChange={setPhone} />
                <Field label="Correo" value={email} onChange={setEmail} type="email" placeholder="opcional" />
                {phone && (
                  <a
                    href={`https://wa.me/${phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.695.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp
                  </a>
                )}
              </section>

              <section className="space-y-2">
                <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                  Notas internas
                  <span className="text-[10px] uppercase tracking-widest text-amber-500/80 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">solo staff</span>
                </h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Preferencias, alergias, historial relevante…"
                  className="w-full bg-gray-900 border border-gray-800 text-gray-100 rounded-xl px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none placeholder-gray-600 resize-none"
                />
              </section>

              {err && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm px-3 py-2">
                  {err}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={save}
                  disabled={!dirty || saving}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-gray-800 disabled:text-gray-500 text-white text-sm font-semibold transition-colors"
                >
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
                <button
                  onClick={del}
                  disabled={saving || client.appointments.length > 0}
                  title={client.appointments.length > 0 ? 'No se puede eliminar: tiene citas asociadas' : 'Eliminar cliente'}
                  className="py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-300 text-sm font-medium hover:bg-rose-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Eliminar
                </button>
              </div>

              <section className="space-y-3 pt-2 border-t border-gray-800">
                <h4 className="text-white font-semibold text-sm">Historial de citas</h4>
                {client.appointments.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-6 border border-dashed border-gray-800 rounded-xl">
                    Sin citas registradas.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-800 rounded-xl border border-gray-800 overflow-hidden">
                    {client.appointments.map((a) => (
                      <li key={a.id} className="px-4 py-3 flex items-center justify-between gap-3 bg-gray-900/40">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{formatDate(a.date)}</span>
                            <span className="text-amber-400 font-mono font-semibold">{a.time}</span>
                          </div>
                          <div className="text-white text-sm font-medium truncate">{a.service.name}</div>
                          <div className="text-gray-500 text-xs truncate">con {a.barber.name}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <StatusBadge status={a.status} />
                          <span className="text-gray-400 text-xs font-semibold">{MXN.format(a.totalPrice || a.service.price)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatMini({ label, value, tone }: { label: string; value: string | number; tone: 'amber' | 'emerald' | 'white' }) {
  const map = {
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
    white: 'text-white',
  } as const;
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
      <div className={`text-lg font-bold mt-0.5 ${map[tone]}`}>{value}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-gray-900 border border-gray-800 text-gray-100 rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none placeholder-gray-600"
      />
    </label>
  );
}
