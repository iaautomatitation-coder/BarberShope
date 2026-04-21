'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => setTestimonials(Array.isArray(data) ? data : []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="testimonios" className="relative py-24 sm:py-36 bg-brand-bg border-t border-brand-border">
      <div className="max-w-[110rem] mx-auto px-6 sm:px-10">
        <header className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 mb-16 sm:mb-24">
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-accent">§ 04 — Testimonios</span>
            <span className="hidden md:block h-px w-16 bg-brand-border" />
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <h2
              className="font-brand-serif uppercase leading-[0.9] text-brand-text text-[12vw] md:text-[6.5vw] lg:text-[7rem]"
              style={{ letterSpacing: 'var(--brand-display-tracking)' }}
            >
              Lo que<br />
              <span style={{ color: 'var(--brand-accent)', fontStyle: 'var(--brand-display-italic)' }}>dicen.</span>
            </h2>
            <p className="text-brand-text-muted text-base sm:text-lg mt-8 max-w-xl leading-relaxed">
              Las palabras de clientes reales. Sin edición, sin filtros.
            </p>
          </div>
        </header>

        {loading ? (
          <ul className="divide-y divide-brand-border border-y border-brand-border">
            {[1, 2, 3].map((i) => (
              <li key={i} className="py-12 animate-pulse">
                <div className="h-6 w-1/2 bg-brand-surface mb-4" />
                <div className="h-3 w-1/4 bg-brand-surface" />
              </li>
            ))}
          </ul>
        ) : testimonials.length === 0 ? (
          <div className="border-y border-brand-border py-24 text-center">
            <div className="text-[10px] uppercase tracking-[0.4em] text-brand-text-subtle mb-3">
              Próximamente
            </div>
            <div
              className="font-brand-serif uppercase text-brand-text text-4xl md:text-5xl max-w-3xl mx-auto leading-tight"
              style={{ letterSpacing: 'var(--brand-display-tracking)' }}
            >
              Estamos curando las primeras reseñas del estudio.
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-brand-border border-y border-brand-border">
            {testimonials.map((t, i) => (
              <li key={t.id} className="grid grid-cols-12 gap-4 md:gap-8 py-10 md:py-14">
                <div className="col-span-12 md:col-span-2 flex md:flex-col gap-4 md:gap-2 items-center md:items-start">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle font-mono">
                    № {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <svg
                        key={s}
                        className="w-3 h-3"
                        style={{ color: s < t.rating ? 'var(--brand-accent)' : 'rgba(255,255,255,0.15)' }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <blockquote className="col-span-12 md:col-span-8 relative">
                  <span className="absolute -top-6 -left-2 font-brand-serif text-6xl md:text-7xl leading-none text-brand-accent opacity-40 select-none">
                    “
                  </span>
                  <p
                    className="font-brand-serif uppercase text-brand-text text-2xl md:text-3xl lg:text-4xl leading-tight"
                    style={{ letterSpacing: 'var(--brand-display-tracking)' }}
                  >
                    {t.text}
                  </p>
                </blockquote>

                <div className="col-span-12 md:col-span-2 md:text-right">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle mb-1">
                    Cliente verificado
                  </div>
                  <div className="text-brand-text font-medium text-sm uppercase tracking-widest">
                    {t.name}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
