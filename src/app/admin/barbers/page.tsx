'use client';

import { useEffect, useState } from 'react';

type Barber = {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  active: boolean;
  order: number;
};

const EMPTY: Omit<Barber, 'id'> & { id?: string } = { name: '', specialty: '', photo: '', active: true, order: 0 };

export default function BarbersPage() {
  const [items, setItems] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof EMPTY | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/barbers');
    setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (item: typeof EMPTY) => {
    const method = item.id ? 'PUT' : 'POST';
    const res = await fetch('/api/barbers', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (res.ok) { setEditing(null); load(); }
  };

  const toggle = async (b: Barber) => {
    await fetch('/api/barbers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...b, active: !b.active }),
    });
    load();
  };

  const del = async (id: string) => {
    if (!confirm('¿Eliminar este barbero? Las citas asociadas no serán eliminadas.')) return;
    await fetch(`/api/barbers?id=${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Barberos</h1>
          <p className="text-gray-400 text-sm mt-1">Administra tu equipo</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-amber-900/20">
          + Nuevo barbero
        </button>
      </header>

      <div className="rounded-2xl border border-gray-800 bg-gray-900/30 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500 text-sm">Cargando…</div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-gray-500 text-sm">Aún no hay barberos registrados</div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {items.map((b) => (
              <li key={b.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-900/60 transition-colors">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white font-semibold shrink-0 overflow-hidden">
                  {b.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                  ) : b.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium">{b.name}</div>
                  <div className="text-gray-400 text-sm truncate">{b.specialty || 'Sin especialidad'}</div>
                </div>
                <div className="text-xs text-gray-500 w-16 text-center">Orden {b.order}</div>
                <button onClick={() => toggle(b)} className={`px-2.5 py-1 rounded-full border text-xs font-medium ${b.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                  {b.active ? 'Activo' : 'Inactivo'}
                </button>
                <button onClick={() => setEditing({ ...b })} className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium border border-gray-700">
                  Editar
                </button>
                <button onClick={() => del(b.id)} className="px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs">
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <BarberForm initial={editing} onCancel={() => setEditing(null)} onSave={save} />
      )}
    </div>
  );
}

function BarberForm({ initial, onCancel, onSave }: { initial: typeof EMPTY; onCancel: () => void; onSave: (item: typeof EMPTY) => void }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 className="text-white font-bold text-lg">{form.id ? 'Editar barbero' : 'Nuevo barbero'}</h3>
        <div className="mt-5 space-y-3">
          <Field label="Nombre" value={form.name} onChange={(v) => update('name', v)} />
          <Field label="Especialidad" value={form.specialty} onChange={(v) => update('specialty', v)} />
          <Field label="URL de foto (opcional)" value={form.photo} onChange={(v) => update('photo', v)} placeholder="https://…" />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Orden</label>
              <input type="number" value={form.order} onChange={(e) => update('order', parseInt(e.target.value, 10) || 0)} className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Estado</label>
              <button onClick={() => update('active', !form.active)} className={`mt-1 w-full px-3 py-2 rounded-lg border text-sm font-medium ${form.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                {form.active ? 'Activo' : 'Inactivo'}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800">Cancelar</button>
          <button onClick={submit} disabled={saving || !form.name} className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-white text-sm font-semibold">
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none placeholder-gray-600"
      />
    </div>
  );
}
