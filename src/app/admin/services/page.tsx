'use client';

import { useEffect, useState } from 'react';

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  active: boolean;
  order: number;
};

const EMPTY: Omit<Service, 'id'> & { id?: string } = {
  name: '', description: '', price: 0, duration: 30, active: true, order: 0,
};

const MXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof EMPTY | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/services');
    setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (item: typeof EMPTY) => {
    const method = item.id ? 'PUT' : 'POST';
    const res = await fetch('/api/services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (res.ok) { setEditing(null); load(); }
  };

  const toggle = async (s: Service) => {
    await fetch('/api/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, active: !s.active }),
    });
    load();
  };

  const del = async (id: string) => {
    if (!confirm('¿Eliminar este servicio? Las citas asociadas no serán eliminadas.')) return;
    await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Servicios</h1>
          <p className="text-gray-400 text-sm mt-1">Catálogo de lo que ofreces</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-amber-900/20">
          + Nuevo servicio
        </button>
      </header>

      <div className="rounded-2xl border border-gray-800 bg-gray-900/30 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500 text-sm">Cargando…</div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-gray-500 text-sm">Aún no hay servicios registrados</div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {items.map((s) => (
              <li key={s.id} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-900/60 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium">{s.name}</div>
                  {s.description && <div className="text-gray-400 text-sm truncate mt-0.5">{s.description}</div>}
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-amber-400 font-semibold">{MXN.format(s.price)}</span>
                    <span className="text-gray-500">{s.duration} min</span>
                    <span className="text-gray-500">Orden {s.order}</span>
                  </div>
                </div>
                <button onClick={() => toggle(s)} className={`px-2.5 py-1 rounded-full border text-xs font-medium ${s.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                  {s.active ? 'Activo' : 'Inactivo'}
                </button>
                <button onClick={() => setEditing({ ...s })} className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium border border-gray-700">
                  Editar
                </button>
                <button onClick={() => del(s.id)} className="px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs">
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <ServiceForm initial={editing} onCancel={() => setEditing(null)} onSave={save} />
      )}
    </div>
  );
}

function ServiceForm({ initial, onCancel, onSave }: { initial: typeof EMPTY; onCancel: () => void; onSave: (item: typeof EMPTY) => void }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || form.price <= 0) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 className="text-white font-bold text-lg">{form.id ? 'Editar servicio' : 'Nuevo servicio'}</h3>
        <div className="mt-5 space-y-3">
          <div>
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nombre</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Descripción</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={2} className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Precio (MXN)</label>
              <input type="number" min={0} value={form.price} onChange={(e) => update('price', parseFloat(e.target.value) || 0)} className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Duración (min)</label>
              <input type="number" min={5} step={5} value={form.duration} onChange={(e) => update('duration', parseInt(e.target.value, 10) || 30)} className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Orden</label>
              <input type="number" value={form.order} onChange={(e) => update('order', parseInt(e.target.value, 10) || 0)} className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Estado</label>
              <button onClick={() => update('active', !form.active)} className={`mt-1 w-full px-3 py-2 rounded-lg border text-sm font-medium ${form.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                {form.active ? 'Activo' : 'Inactivo'}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800">Cancelar</button>
          <button onClick={submit} disabled={saving || !form.name || form.price <= 0} className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-white text-sm font-semibold">
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
