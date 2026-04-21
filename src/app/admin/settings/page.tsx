'use client';

import { useEffect, useState } from 'react';

type Shop = {
  id?: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  scheduleJson: string;
};

const EMPTY_SHOP: Shop = {
  name: '', phone: '', whatsapp: '', email: '', address: '',
  facebook: '', instagram: '', tiktok: '', scheduleJson: '{}',
};

const DAYS: { key: string; label: string }[] = [
  { key: 'lunes', label: 'Lunes' },
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
];

type Day = { open: boolean; start: string; end: string };

function defaultSchedule(): Record<string, Day> {
  return DAYS.reduce((acc, d) => {
    acc[d.key] = { open: d.key !== 'domingo', start: '10:00', end: '20:00' };
    return acc;
  }, {} as Record<string, Day>);
}

export default function SettingsPage() {
  const [shop, setShop] = useState<Shop>(EMPTY_SHOP);
  const [schedule, setSchedule] = useState<Record<string, Day>>(defaultSchedule());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/barbershop').then((r) => r.json()).then((data: Shop) => {
      setShop({ ...EMPTY_SHOP, ...data });
      try {
        const parsed = JSON.parse(data.scheduleJson || '{}');
        const normalized = defaultSchedule();
        for (const d of DAYS) {
          if (parsed[d.key]) normalized[d.key] = { ...normalized[d.key], ...parsed[d.key] };
        }
        setSchedule(normalized);
      } catch {
        // keep default
      }
    });
  }, []);

  const updateDay = (key: string, patch: Partial<Day>) => {
    setSchedule((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const payload = { ...shop, scheduleJson: JSON.stringify(schedule) };
    const res = await fetch('/api/barbershop', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Configuración</h1>
          <p className="text-gray-400 text-sm mt-1">Datos del negocio y horario de atención</p>
        </div>
        <button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-amber-900/20">
          {saving ? 'Guardando…' : saved ? 'Guardado ✓' : 'Guardar cambios'}
        </button>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Información del negocio">
          <Row label="Nombre" value={shop.name} onChange={(v) => setShop({ ...shop, name: v })} />
          <Row label="Teléfono" value={shop.phone} onChange={(v) => setShop({ ...shop, phone: v })} />
          <Row label="WhatsApp (con código país)" value={shop.whatsapp} onChange={(v) => setShop({ ...shop, whatsapp: v })} placeholder="525512345678" />
          <Row label="Email" value={shop.email} onChange={(v) => setShop({ ...shop, email: v })} />
          <Row label="Dirección" value={shop.address} onChange={(v) => setShop({ ...shop, address: v })} />
        </Card>

        <Card title="Redes sociales">
          <Row label="Facebook" value={shop.facebook} onChange={(v) => setShop({ ...shop, facebook: v })} placeholder="URL completa o @usuario" />
          <Row label="Instagram" value={shop.instagram} onChange={(v) => setShop({ ...shop, instagram: v })} placeholder="@usuario" />
          <Row label="TikTok" value={shop.tiktok} onChange={(v) => setShop({ ...shop, tiktok: v })} placeholder="@usuario" />
        </Card>
      </section>

      <Card title="Horarios de atención">
        <div className="space-y-2">
          {DAYS.map((d) => {
            const day = schedule[d.key];
            return (
              <div key={d.key} className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-gray-800 bg-gray-900/40">
                <div className="w-28 text-white font-medium">{d.label}</div>
                <button
                  onClick={() => updateDay(d.key, { open: !day.open })}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                    day.open ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}
                >
                  {day.open ? 'Abierto' : 'Cerrado'}
                </button>
                <div className={`flex items-center gap-2 ${day.open ? '' : 'opacity-40 pointer-events-none'}`}>
                  <input type="time" value={day.start} onChange={(e) => updateDay(d.key, { start: e.target.value })} className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-amber-500 focus:outline-none" />
                  <span className="text-gray-500 text-sm">a</span>
                  <input type="time" value={day.end} onChange={(e) => updateDay(d.key, { end: e.target.value })} className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-amber-500 focus:outline-none" />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
      <h3 className="text-white font-semibold text-sm tracking-wide mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</label>
      <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none placeholder-gray-600" />
    </div>
  );
}
