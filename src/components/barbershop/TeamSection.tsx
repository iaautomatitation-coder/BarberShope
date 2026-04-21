'use client';

import { useState, useEffect } from 'react';
import { getBrand } from '@/config';

interface Barber {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  active: boolean;
  order: number;
}

export default function TeamSection({ onBook }: { onBook?: () => void }) {
  const brand = getBrand();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/barbers?active=true')
      .then((r) => r.json())
      .then((data) => setBarbers(Array.isArray(data) ? data : []))
      .catch(() => setBarbers([]))
      .finally(() => setLoading(false));
  }, []);

  const fallbacks = brand.images.teamFallbacks;
  const photoFor = (b: Barber, i: number) => b.photo || fallbacks[i % fallbacks.length];

  return (
    <section id="equipo" className="relative py-24 sm:py-36 bg-brand-bg border-t border-brand-border">
      <div className="max-w-[110rem] mx-auto px-6 sm:px-10">
        <header className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 mb-16 sm:mb-24">
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-accent">§ 02 — Equipo</span>
            <span className="hidden md:block h-px w-16 bg-brand-border" />
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <h2
              className="font-brand-serif uppercase leading-[0.9] text-brand-text text-[12vw] md:text-[6.5vw] lg:text-[7rem]"
              style={{ letterSpacing: 'var(--brand-display-tracking)' }}
            >
              La<br />
              <span style={{ color: 'var(--brand-accent)', fontStyle: 'var(--brand-display-italic)' }}>silla.</span>
            </h2>
            <p className="text-brand-text-muted text-base sm:text-lg mt-8 max-w-xl leading-relaxed">
              Cada barbero aquí tiene su estilo. Eliges con quién te sientas. Eliges cómo sales.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-brand-surface animate-pulse" />
            ))}
          </div>
        ) : barbers.length === 0 ? (
          <div className="py-24 text-center text-brand-text-subtle text-sm uppercase tracking-widest border-y border-brand-border">
            Equipo próximamente
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {barbers.map((b, i) => (
              <article key={b.id} className="group relative overflow-hidden bg-[#080808]">
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoFor(b, i)}
                    alt={b.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-[1400ms] group-hover:grayscale-0 group-hover:scale-[1.03]"
                  />
                  {/* copper wash */}
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-45 group-hover:opacity-0 transition-opacity duration-700 pointer-events-none"
                    style={{ background: 'var(--brand-primary)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Huge index number top-left */}
                  <span
                    className="absolute top-6 left-6 font-brand-serif leading-none text-[18vw] md:text-[6rem] lg:text-[7rem] opacity-90 pointer-events-none"
                    style={{
                      color: 'var(--brand-accent)',
                      letterSpacing: 'var(--brand-display-tracking)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Bottom info block */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="h-px w-6 bg-brand-accent" />
                      <span className="text-[10px] uppercase tracking-[0.35em] text-brand-accent">Maestro barbero</span>
                    </div>
                    <h3
                      className="font-brand-serif uppercase text-white text-3xl md:text-4xl leading-none mt-1"
                      style={{ letterSpacing: 'var(--brand-display-tracking)' }}
                    >
                      {b.name}
                    </h3>
                    <p className="text-brand-text-muted text-sm mt-3">
                      {b.specialty || 'Barbero profesional'}
                    </p>
                  </div>
                </div>

                {/* Row action */}
                {onBook && (
                  <button
                    onClick={onBook}
                    className="w-full flex items-center justify-between px-6 py-5 border-t border-brand-border text-xs uppercase tracking-[0.3em] text-brand-text-muted hover:text-brand-accent hover:bg-brand-surface-hover transition-colors"
                  >
                    Reservar con {b.name.split(' ')[0]}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
