'use client';

import { useState, useEffect } from 'react';
import { buildWhatsAppLink, formatBookingConfirmation } from '@/lib/whatsapp';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Barber {
  id: string;
  name: string;
}

interface BarbershopInfo {
  whatsapp: string;
}

const MXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export default function BookingDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [shop, setShop] = useState<BarbershopInfo>({ whatsapp: '' });
  const [slots, setSlots] = useState<string[]>([]);
  const [dayClosed, setDayClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  useEffect(() => {
    if (!open) return;
    fetch('/api/services?active=true').then(r => r.json()).then(d => setServices(Array.isArray(d) ? d : [])).catch(() => {});
    fetch('/api/barbers?active=true').then(r => r.json()).then(d => setBarbers(Array.isArray(d) ? d : [])).catch(() => {});
    fetch('/api/barbershop').then(r => r.json()).then(d => setShop(d)).catch(() => {});
  }, [open]);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSuccess(false);
      setSelectedService('');
      setSelectedBarber('');
      setSelectedDate('');
      setSelectedTime('');
      setSlots([]);
      setClientName('');
      setClientPhone('');
      setClientNotes('');
      setSubmitError('');
    }
  }, [open]);

  const fetchAvailability = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setSlots([]);
    if (!date) return;

    const svc = services.find(s => s.id === selectedService);
    const duration = svc?.duration || 30;

    setLoading(true);
    try {
      const params = new URLSearchParams({ date, duration: String(duration) });
      if (selectedBarber) params.set('barberId', selectedBarber);
      const res = await fetch(`/api/availability?${params}`);
      const data = await res.json();
      setSlots(data.slots || []);
      setDayClosed(data.dayClosed || false);
    } catch {
      setSlots([]);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!clientName || !clientPhone || !selectedService || !selectedBarber || !selectedDate || !selectedTime) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientPhone,
          clientEmail: '',
          serviceId: selectedService,
          barberId: selectedBarber,
          date: selectedDate,
          time: selectedTime,
          notes: clientNotes,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        if (shop.whatsapp) {
          const svc = services.find(s => s.id === selectedService);
          const brb = barbers.find(b => b.id === selectedBarber);
          const msg = formatBookingConfirmation({
            clientName,
            serviceName: svc?.name || '',
            barberName: brb?.name || '',
            date: selectedDate,
            time: selectedTime,
          });
          const link = buildWhatsAppLink(shop.whatsapp, msg);
          window.open(link, '_blank');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          setSubmitError(data.error || 'Ese horario ya no está disponible.');
          fetchAvailability(selectedDate);
          setSelectedTime('');
          setStep(2);
        } else {
          setSubmitError(data.error || 'No se pudo crear la cita. Intenta de nuevo.');
        }
      }
    } catch {
      setSubmitError('Error de red. Intenta de nuevo.');
    }
    setSubmitting(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const today = new Date().toISOString().split('T')[0];
  const selectedSvc = services.find(s => s.id === selectedService);
  const selectedBrb = barbers.find(b => b.id === selectedBarber);

  if (!open) return null;

  return (
    <div data-dialog="booking" className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Dialog — sharp-corner editorial sheet */}
      <div
        className="relative w-full max-w-xl max-h-full sm:max-h-[90vh] overflow-y-auto border border-brand-border"
        style={{
          backgroundColor: 'var(--brand-bg-elevated)',
          borderRadius: 'var(--brand-radius-lg)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-5 border-b border-brand-border"
          style={{ backgroundColor: 'var(--brand-bg-elevated)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-6 bg-brand-accent" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-brand-accent font-medium">
                  Reserva · Paso {step} de 3
                </span>
              </div>
              <h3
                className="font-brand-serif uppercase text-brand-text text-2xl sm:text-3xl leading-none"
                style={{ letterSpacing: 'var(--brand-display-tracking)' }}
              >
                {success ? 'Cita confirmada' : step === 1 ? 'Elige tu silla' : step === 2 ? 'Elige el momento' : 'Tus datos'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 text-brand-text-muted hover:text-brand-text p-1.5 border border-brand-border hover:border-brand-border-hover transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress — 3 thin segments */}
          <div className="flex gap-1 mt-4">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className="h-0.5 flex-1 transition-colors"
                style={{ backgroundColor: (success || s <= step) ? 'var(--brand-accent)' : 'var(--brand-border)' }}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            /* Success */
            <div className="text-center py-10">
              <div
                className="w-16 h-16 flex items-center justify-center mx-auto mb-6 border border-brand-border"
                style={{ backgroundColor: 'color-mix(in srgb, var(--brand-accent) 10%, transparent)' }}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="var(--brand-accent)" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-brand-accent mb-3">
                Confirmada
              </div>
              <h4
                className="font-brand-serif uppercase text-brand-text text-3xl mb-4"
                style={{ letterSpacing: 'var(--brand-display-tracking)' }}
              >
                Nos vemos pronto.
              </h4>
              <p className="text-brand-text-muted text-sm mb-8 max-w-xs mx-auto">
                Te esperamos {selectedDate && formatDate(selectedDate)} a las <span className="text-brand-text font-medium">{selectedTime}</span>.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 font-semibold text-xs uppercase tracking-[0.3em] transition-transform hover:-translate-y-0.5"
                style={{
                  background: 'var(--brand-primary)',
                  color: 'var(--brand-primary-foreground)',
                  borderRadius: 'var(--brand-radius-pill)',
                }}
              >
                Cerrar
              </button>
            </div>
          ) : step === 1 ? (
            /* Step 1 — Service + Barber */
            <div className="space-y-8">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle mb-3 font-mono">
                  01 · Servicio
                </div>
                <ul className="divide-y divide-brand-border border-y border-brand-border">
                  {services.map((s) => {
                    const active = selectedService === s.id;
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => setSelectedService(s.id)}
                          className={`w-full flex items-center justify-between gap-4 py-4 px-1 text-left transition-colors ${
                            active ? 'text-brand-accent' : 'text-brand-text hover:text-brand-accent'
                          }`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <span
                              className="w-5 h-5 border flex items-center justify-center shrink-0"
                              style={{
                                borderColor: active ? 'var(--brand-accent)' : 'var(--brand-border)',
                                backgroundColor: active ? 'var(--brand-accent)' : 'transparent',
                              }}
                            >
                              {active && (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="var(--brand-primary-foreground)" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            <div className="min-w-0">
                              <div
                                className="font-brand-serif uppercase text-lg sm:text-xl leading-none"
                                style={{ letterSpacing: 'var(--brand-display-tracking)' }}
                              >
                                {s.name}
                              </div>
                              <div className="text-[10px] uppercase tracking-[0.25em] text-brand-text-subtle mt-1">
                                {s.duration} min
                              </div>
                            </div>
                          </div>
                          <span className="font-brand-serif text-xl sm:text-2xl leading-none shrink-0">
                            {MXN.format(s.price).replace('MX$', '$')}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle mb-3 font-mono">
                  02 · Barbero
                </div>
                <div className="grid grid-cols-1 gap-0 divide-y divide-brand-border border-y border-brand-border">
                  {barbers.map((b) => {
                    const active = selectedBarber === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBarber(b.id)}
                        className={`flex items-center gap-4 py-4 px-1 text-left transition-colors ${
                          active ? 'text-brand-accent' : 'text-brand-text hover:text-brand-accent'
                        }`}
                      >
                        <span
                          className="w-5 h-5 border flex items-center justify-center shrink-0"
                          style={{
                            borderColor: active ? 'var(--brand-accent)' : 'var(--brand-border)',
                            backgroundColor: active ? 'var(--brand-accent)' : 'transparent',
                          }}
                        >
                          {active && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="var(--brand-primary-foreground)" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span
                          className="font-brand-serif uppercase text-lg sm:text-xl leading-none"
                          style={{ letterSpacing: 'var(--brand-display-tracking)' }}
                        >
                          {b.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => { if (selectedService && selectedBarber) setStep(2); }}
                disabled={!selectedService || !selectedBarber}
                className="w-full py-4 font-semibold text-xs uppercase tracking-[0.3em] transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  background: 'var(--brand-primary)',
                  color: 'var(--brand-primary-foreground)',
                  borderRadius: 'var(--brand-radius-pill)',
                }}
              >
                Continuar →
              </button>
            </div>
          ) : step === 2 ? (
            /* Step 2 — Date + Time */
            <div className="space-y-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle mb-3 font-mono">
                  03 · Fecha
                </div>
                <input
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={(e) => fetchAvailability(e.target.value)}
                  className="w-full bg-transparent border border-brand-border text-brand-text px-4 py-3 focus:border-brand-border-hover focus:outline-none transition-colors text-sm"
                />
              </div>

              {selectedDate && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle mb-3 font-mono">
                    04 · Horario · <span className="text-brand-accent">{formatDate(selectedDate)}</span>
                  </div>
                  {loading ? (
                    <div className="flex items-center justify-center py-10">
                      <div
                        className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: 'var(--brand-accent)', borderTopColor: 'transparent' }}
                      />
                    </div>
                  ) : dayClosed ? (
                    <div className="py-10 text-center text-brand-text-subtle text-xs uppercase tracking-[0.3em]">
                      Cerrado este día
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="py-10 text-center text-brand-text-subtle text-xs uppercase tracking-[0.3em]">
                      Sin horarios disponibles
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-1 max-h-64 overflow-y-auto">
                      {slots.map(slot => {
                        const active = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className="py-3 text-sm font-mono tabular-nums transition-colors border"
                            style={{
                              borderColor: active ? 'var(--brand-accent)' : 'var(--brand-border)',
                              backgroundColor: active ? 'var(--brand-accent)' : 'transparent',
                              color: active ? 'var(--brand-primary-foreground)' : 'var(--brand-text-muted)',
                            }}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-brand-border hover:border-brand-border-hover text-brand-text-muted hover:text-brand-text text-xs uppercase tracking-[0.3em] font-medium transition-colors"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => { if (selectedTime) setStep(3); }}
                  disabled={!selectedTime}
                  className="flex-1 py-4 font-semibold text-xs uppercase tracking-[0.3em] transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background: 'var(--brand-primary)',
                    color: 'var(--brand-primary-foreground)',
                    borderRadius: 'var(--brand-radius-pill)',
                  }}
                >
                  Continuar →
                </button>
              </div>
            </div>
          ) : (
            /* Step 3 — Client Info */
            <div className="space-y-6">
              {/* Summary */}
              <div className="border border-brand-border p-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-4 font-mono">
                  Resumen
                </div>
                <dl className="space-y-2.5 text-sm">
                  <SummaryRow label="Servicio" value={selectedSvc?.name || ''} />
                  <SummaryRow label="Barbero" value={selectedBrb?.name || ''} />
                  <SummaryRow label="Fecha" value={selectedDate ? formatDate(selectedDate) : ''} />
                  <SummaryRow label="Hora" value={selectedTime} mono />
                  <div className="pt-3 mt-3 border-t border-brand-border flex items-baseline justify-between">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle">Total</span>
                    <span
                      className="font-brand-serif text-3xl leading-none"
                      style={{
                        color: 'var(--brand-accent)',
                        letterSpacing: 'var(--brand-display-tracking)',
                      }}
                    >
                      {selectedSvc ? MXN.format(selectedSvc.price).replace('MX$', '$') : '—'}
                    </span>
                  </div>
                </dl>
              </div>

              {/* Client form */}
              <Field label="Nombre completo *" value={clientName} onChange={setClientName} placeholder="Tu nombre" />
              <Field label="Teléfono *" value={clientPhone} onChange={setClientPhone} type="tel" placeholder="55 1234 5678" />
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle mb-2 font-mono">
                  Notas · Opcional
                </label>
                <textarea
                  value={clientNotes}
                  onChange={e => setClientNotes(e.target.value)}
                  placeholder="Preferencias o detalles"
                  rows={2}
                  className="w-full bg-transparent border border-brand-border text-brand-text px-4 py-3 focus:border-brand-border-hover focus:outline-none transition-colors text-sm placeholder-brand-text-subtle resize-none"
                />
              </div>

              {submitError && (
                <div
                  className="border px-4 py-3 text-sm"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--brand-danger) 40%, transparent)',
                    color: 'var(--brand-danger)',
                    backgroundColor: 'color-mix(in srgb, var(--brand-danger) 10%, transparent)',
                  }}
                >
                  {submitError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 border border-brand-border hover:border-brand-border-hover text-brand-text-muted hover:text-brand-text text-xs uppercase tracking-[0.3em] font-medium transition-colors"
                >
                  ← Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!clientName || !clientPhone || submitting}
                  className="flex-1 py-4 font-semibold text-xs uppercase tracking-[0.3em] transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-3"
                  style={{
                    background: 'var(--brand-primary)',
                    color: 'var(--brand-primary-foreground)',
                    borderRadius: 'var(--brand-radius-pill)',
                    boxShadow: 'var(--brand-shadow-cta)',
                  }}
                >
                  {submitting ? (
                    <span
                      className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: 'var(--brand-primary-foreground)', borderTopColor: 'transparent' }}
                    />
                  ) : (
                    <>
                      Confirmar reserva
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle shrink-0">{label}</dt>
      <dd className={`text-brand-text text-sm text-right truncate ${mono ? 'font-mono tabular-nums' : ''}`}>{value || '—'}</dd>
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
    <div>
      <label className="block text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle mb-2 font-mono">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border border-brand-border text-brand-text px-4 py-3 focus:border-brand-border-hover focus:outline-none transition-colors text-sm placeholder-brand-text-subtle"
      />
    </div>
  );
}
