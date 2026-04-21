'use client';

import { useEffect, useMemo, useState } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';
import { APPOINTMENT_STATUSES, STATUS_LABELS, type AppointmentStatus } from '@/lib/appointment-status';

type Appointment = {
  id: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  status: string;
  totalPrice: number;
  notes: string;
  internalNotes?: string | null;
  source?: string | null;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  completedAt?: string | null;
  service: { id: string; name: string; price: number; duration: number };
  barber: { id: string; name: string };
};

const MXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export default function AppointmentsPage() {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);
  const [detail, setDetail] = useState<Appointment | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/appointments');
    setAppts(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return appts.filter((a) => {
      if (filter !== 'all' && a.status !== filter) return false;
      if (dateFilter && a.date !== dateFilter) return false;
      return true;
    });
  }, [appts, filter, dateFilter]);

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  };

  const formatDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Citas</h1>
        <p className="text-gray-400 text-sm mt-1">Gestiona el flujo completo de reservas</p>
      </header>

      <div className="flex flex-wrap items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-2xl px-4 py-3">
        <div className="flex gap-1.5 flex-wrap">
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>Todas</FilterChip>
          {APPOINTMENT_STATUSES.map((s) => (
            <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>{STATUS_LABELS[s]}</FilterChip>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
          />
          {dateFilter && (
            <button onClick={() => setDateFilter('')} className="text-gray-400 hover:text-white text-xs">Limpiar</button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900/80 border-b border-gray-800">
              <tr className="text-left text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Hora</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Barbero</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-16 text-center text-gray-500">Cargando…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-16 text-center text-gray-500">Sin citas para estos filtros</td></tr>
              ) : filtered.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setDetail(a)}
                  className="hover:bg-gray-900/60 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{formatDate(a.date)}</td>
                  <td className="px-4 py-3 text-amber-400 font-mono font-semibold">{a.time}</td>
                  <td className="px-4 py-3 text-white font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      {a.clientName}
                      {a.internalNotes && <span title="Tiene nota interna" className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{a.clientPhone}</td>
                  <td className="px-4 py-3 text-gray-300">{a.service.name}</td>
                  <td className="px-4 py-3 text-gray-300">{a.barber.name}</td>
                  <td className="px-4 py-3 text-right text-white font-semibold">{MXN.format(a.totalPrice || a.service.price)}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      appt={a}
                      onStatus={(s) => updateStatus(a.id, s)}
                      onReschedule={() => setRescheduling(a)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {rescheduling && (
        <RescheduleDialog
          appt={rescheduling}
          onClose={() => setRescheduling(null)}
          onDone={() => { setRescheduling(null); load(); }}
        />
      )}

      {detail && (
        <AppointmentDrawer
          appt={detail}
          onClose={() => setDetail(null)}
          onSaved={(next) => {
            setDetail(next);
            load();
          }}
          onStatus={async (s) => {
            await updateStatus(detail.id, s);
            setDetail(null);
          }}
          onReschedule={() => {
            setRescheduling(detail);
            setDetail(null);
          }}
        />
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
        active ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'text-gray-400 hover:text-white border-gray-800 hover:border-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

function ActionMenu({ appt, onStatus, onReschedule }: { appt: Appointment; onStatus: (s: AppointmentStatus) => void; onReschedule: () => void }) {
  const [open, setOpen] = useState(false);
  const actions: { label: string; status?: AppointmentStatus; onClick?: () => void; tone?: string }[] = [
    { label: 'Confirmar', status: 'confirmed' },
    { label: 'Reagendar', onClick: onReschedule },
    { label: 'Marcar completada', status: 'completed', tone: 'text-emerald-400' },
    { label: 'No asistió', status: 'no_show', tone: 'text-gray-400' },
    { label: 'Cancelar', status: 'cancelled', tone: 'text-rose-400' },
  ];
  return (
    <div className="relative flex justify-end">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium border border-gray-700"
      >
        Acciones ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  setOpen(false);
                  if (a.status) onStatus(a.status);
                  else a.onClick?.();
                }}
                disabled={a.status === appt.status}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed ${a.tone || 'text-gray-200'}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AppointmentDrawer({
  appt,
  onClose,
  onSaved,
  onStatus,
  onReschedule,
}: {
  appt: Appointment;
  onClose: () => void;
  onSaved: (next: Appointment) => void;
  onStatus: (s: AppointmentStatus) => Promise<void> | void;
  onReschedule: () => void;
}) {
  const [notes, setNotes] = useState(appt.notes || '');
  const [internalNotes, setInternalNotes] = useState(appt.internalNotes || '');
  const [clientName, setClientName] = useState(appt.clientName);
  const [clientPhone, setClientPhone] = useState(appt.clientPhone);
  const [clientEmail, setClientEmail] = useState(appt.clientEmail || '');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const dirty =
    notes !== (appt.notes || '') ||
    internalNotes !== (appt.internalNotes || '') ||
    clientName !== appt.clientName ||
    clientPhone !== appt.clientPhone ||
    clientEmail !== (appt.clientEmail || '');

  const save = async () => {
    setSaving(true);
    setErr('');
    const res = await fetch(`/api/appointments/${appt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, internalNotes, clientName, clientPhone, clientEmail }),
    });
    if (res.ok) {
      const next = await res.json();
      onSaved(next);
    } else {
      const data = await res.json().catch(() => ({}));
      setErr(data.error || 'Error al guardar');
    }
    setSaving(false);
  };

  const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTs = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) : null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto h-full w-full max-w-md bg-gray-950 border-l border-gray-800 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-6 py-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-amber-500/80 font-medium">Detalle de cita</div>
            <h3 className="text-white font-bold text-lg mt-1 truncate">{appt.clientName}</h3>
            <div className="text-gray-400 text-xs mt-0.5">
              {formatDate(appt.date)} · <span className="text-amber-400 font-mono">{appt.time}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="flex items-center justify-between">
            <StatusBadge status={appt.status} />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-gray-500">Total</div>
              <div className="text-white font-bold">{MXN.format(appt.totalPrice || appt.service.price)}</div>
            </div>
          </div>

          <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-4 space-y-2 text-sm">
            <Info label="Servicio" value={`${appt.service.name} · ${appt.service.duration} min`} />
            <Info label="Barbero" value={appt.barber.name} />
            <Info label="Origen" value={appt.source || 'web'} />
            {formatTs(appt.confirmedAt) && <Info label="Confirmada" value={formatTs(appt.confirmedAt)!} />}
            {formatTs(appt.cancelledAt) && <Info label="Cancelada" value={formatTs(appt.cancelledAt)!} />}
            {formatTs(appt.completedAt) && <Info label="Completada" value={formatTs(appt.completedAt)!} />}
          </section>

          <section className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Cliente</h4>
            <Field label="Nombre" value={clientName} onChange={setClientName} />
            <Field label="Teléfono" value={clientPhone} onChange={setClientPhone} />
            <Field label="Correo" value={clientEmail} onChange={setClientEmail} type="email" placeholder="opcional" />
            {clientPhone && (
              <a
                href={`https://wa.me/${clientPhone.replace(/\D/g, '')}`}
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
            <h4 className="text-white font-semibold text-sm">Notas del cliente</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Lo que pidió el cliente al reservar…"
              className="w-full bg-gray-900 border border-gray-800 text-gray-100 rounded-xl px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none placeholder-gray-600 resize-none"
            />
          </section>

          <section className="space-y-2">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
              Notas internas
              <span className="text-[10px] uppercase tracking-widest text-amber-500/80 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">solo staff</span>
            </h4>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
              placeholder="Observaciones operativas, historial, preferencias…"
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
              onClick={onReschedule}
              className="py-2.5 px-4 rounded-xl border border-gray-700 text-gray-200 text-sm font-medium hover:bg-gray-900"
            >
              Reagendar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
            {appt.status !== 'confirmed' && (
              <QuickAction label="Confirmar" tone="amber" onClick={() => onStatus('confirmed')} />
            )}
            {appt.status !== 'completed' && (
              <QuickAction label="Completada" tone="emerald" onClick={() => onStatus('completed')} />
            )}
            {appt.status !== 'no_show' && (
              <QuickAction label="No asistió" tone="gray" onClick={() => onStatus('no_show')} />
            )}
            {appt.status !== 'cancelled' && (
              <QuickAction label="Cancelar" tone="rose" onClick={() => onStatus('cancelled')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500 text-xs uppercase tracking-wider">{label}</span>
      <span className="text-gray-100 text-sm text-right truncate">{value}</span>
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

function QuickAction({ label, tone, onClick }: { label: string; tone: 'amber' | 'emerald' | 'rose' | 'gray'; onClick: () => void }) {
  const map = {
    amber: 'border-amber-500/30 text-amber-300 hover:bg-amber-500/10',
    emerald: 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10',
    rose: 'border-rose-500/30 text-rose-300 hover:bg-rose-500/10',
    gray: 'border-gray-700 text-gray-300 hover:bg-gray-800',
  } as const;
  return (
    <button onClick={onClick} className={`py-2 rounded-lg border text-xs font-medium transition-colors ${map[tone]}`}>
      {label}
    </button>
  );
}

function RescheduleDialog({ appt, onClose, onDone }: { appt: Appointment; onClose: () => void; onDone: () => void }) {
  const [date, setDate] = useState(appt.date);
  const [time, setTime] = useState(appt.time);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const save = async () => {
    setSaving(true);
    setErr('');
    const res = await fetch(`/api/appointments/${appt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time, status: 'rescheduled' }),
    });
    setSaving(false);
    if (res.ok) {
      onDone();
    } else {
      const data = await res.json().catch(() => ({}));
      setErr(data.error || 'No se pudo reagendar');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <h3 className="text-white font-bold text-lg">Reagendar cita</h3>
        <p className="text-gray-400 text-sm mt-1">{appt.clientName} · {appt.service.name}</p>
        <div className="mt-5 space-y-3">
          <div>
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nueva fecha</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nueva hora</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none" />
          </div>
          {err && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs px-3 py-2">
              {err}
            </div>
          )}
        </div>
        <div className="mt-6 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800">Cancelar</button>
          <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-white text-sm font-semibold">
            {saving ? 'Guardando…' : 'Reagendar'}
          </button>
        </div>
      </div>
    </div>
  );
}
