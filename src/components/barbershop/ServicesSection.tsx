'use client';

import { useState, useEffect } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  active: boolean;
}

const MXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export default function ServicesSection({ onBook }: { onBook: () => void }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services?active=true')
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const hasServices = services.length > 0;

  return (
    <section id="servicios" className="relative py-24 sm:py-36 bg-brand-bg border-t border-brand-border">
      <div className="max-w-[110rem] mx-auto px-6 sm:px-10">
        {/* Section header — editorial cross-block */}
        <header className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 mb-16 sm:mb-24">
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6 md:gap-8">
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-accent">§ 01 — Servicios</span>
            <span className="hidden md:block h-px w-16 bg-brand-border" />
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <h2
              className="font-brand-serif uppercase leading-[0.9] text-brand-text text-[12vw] md:text-[6.5vw] lg:text-[7rem]"
              style={{ letterSpacing: 'var(--brand-display-tracking)' }}
            >
              Lo que<br />
              <span style={{ color: 'var(--brand-accent)', fontStyle: 'var(--brand-display-italic)' }}>hacemos.</span>
            </h2>
            <p className="text-brand-text-muted text-base sm:text-lg mt-8 max-w-xl leading-relaxed">
              Nada decorativo. Sólo el oficio — corte, barba, cuidado. Cada servicio es una sesión con cita, un barbero dedicado, tiempo justo.
            </p>
          </div>
        </header>

        {/* Services table — editorial list, not cards */}
        {loading ? (
          <ul className="divide-y divide-brand-border border-y border-brand-border">
            {[1, 2, 3].map((i) => (
              <li key={i} className="py-10 animate-pulse">
                <div className="h-10 w-1/3 bg-brand-surface" />
              </li>
            ))}
          </ul>
        ) : !hasServices ? (
          <div className="py-24 text-center text-brand-text-subtle text-sm uppercase tracking-widest border-y border-brand-border">
            Catálogo de servicios próximamente
          </div>
        ) : (
          <ul className="divide-y divide-brand-border border-y border-brand-border">
            {services.map((service, index) => (
              <li key={service.id} className="group relative">
                <button
                  onClick={onBook}
                  className="w-full grid grid-cols-12 gap-4 md:gap-6 py-8 md:py-12 text-left transition-colors hover:bg-brand-surface-hover"
                >
                  {/* Index */}
                  <span className="col-span-2 md:col-span-1 flex items-start pt-1 text-[11px] md:text-xs uppercase tracking-[0.3em] text-brand-text-subtle font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Name + description */}
                  <div className="col-span-10 md:col-span-6 lg:col-span-7">
                    <h3
                      className="font-brand-serif uppercase text-brand-text text-4xl md:text-5xl lg:text-6xl leading-none group-hover:text-[color:var(--brand-accent)] transition-colors"
                      style={{ letterSpacing: 'var(--brand-display-tracking)' }}
                    >
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-brand-text-muted text-sm mt-3 max-w-md leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <span className="hidden md:flex col-span-2 items-start pt-2 text-[11px] uppercase tracking-[0.3em] text-brand-text-subtle">
                    {service.duration} min
                  </span>

                  {/* Price + arrow */}
                  <div className="col-span-12 md:col-span-3 flex items-start md:items-center justify-between md:justify-end gap-6 mt-4 md:mt-0">
                    <span className="font-brand-serif text-3xl md:text-5xl leading-none text-brand-text group-hover:text-[color:var(--brand-accent)] transition-colors">
                      {MXN.format(service.price).replace('MX$', '$')}
                    </span>
                    <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-brand-border group-hover:border-brand-border-hover group-hover:bg-brand-accent group-hover:text-[color:var(--brand-primary-foreground)] transition-all shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer note + CTA */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle">
              Precios en pesos mexicanos · Incluye preparación, toallas y after-service.
            </p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <button
              onClick={onBook}
              className="inline-flex items-center gap-3 px-8 py-3.5 font-semibold tracking-[0.2em] text-xs uppercase transition-transform hover:-translate-y-0.5"
              style={{
                background: 'var(--brand-primary)',
                color: 'var(--brand-primary-foreground)',
                borderRadius: 'var(--brand-radius-pill)',
                boxShadow: 'var(--brand-shadow-cta)',
              }}
            >
              Reservar ahora
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
