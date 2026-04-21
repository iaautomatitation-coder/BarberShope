'use client';

import { getBrand } from '@/config';

export default function GallerySection() {
  const brand = getBrand();
  const items = brand.images.gallery;

  return (
    <section id="galeria" className="relative py-24 sm:py-36 bg-brand-bg border-t border-brand-border">
      <div className="max-w-[110rem] mx-auto px-6 sm:px-10">
        <header className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 mb-16 sm:mb-24">
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-accent">§ 03 — Galería</span>
            <span className="hidden md:block h-px w-16 bg-brand-border" />
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <h2
              className="font-brand-serif uppercase leading-[0.9] text-brand-text text-[12vw] md:text-[6.5vw] lg:text-[7rem]"
              style={{ letterSpacing: 'var(--brand-display-tracking)' }}
            >
              El<br />
              <span style={{ color: 'var(--brand-accent)', fontStyle: 'var(--brand-display-italic)' }}>archivo.</span>
            </h2>
            <p className="text-brand-text-muted text-base sm:text-lg mt-8 max-w-xl leading-relaxed">
              Documentación del oficio. Lo que pasa en la silla, sin retoques.
            </p>
          </div>
        </header>

        {/* Museum wall — sparse, alternating layout */}
        <div className="grid grid-cols-12 gap-1 auto-rows-[16vw] md:auto-rows-[12vw] lg:auto-rows-[10rem]">
          {items.map((item, index) => {
            // Irregular layout: alternating spans create museum-wall rhythm
            const layouts = [
              { colSpan: 'col-span-12 md:col-span-6', rowSpan: 'row-span-3' },
              { colSpan: 'col-span-12 md:col-span-6', rowSpan: 'row-span-2' },
              { colSpan: 'col-span-6 md:col-span-4', rowSpan: 'row-span-2' },
              { colSpan: 'col-span-6 md:col-span-4', rowSpan: 'row-span-2' },
              { colSpan: 'col-span-12 md:col-span-4', rowSpan: 'row-span-3' },
              { colSpan: 'col-span-12 md:col-span-8', rowSpan: 'row-span-2' },
            ];
            const l = layouts[index % layouts.length];
            return (
              <figure
                key={index}
                className={`${l.colSpan} ${l.rowSpan} group relative overflow-hidden bg-[#080808]`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.file}
                  alt={item.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-[1400ms] group-hover:grayscale-0 group-hover:scale-[1.02]"
                />
                <div
                  className="absolute inset-0 mix-blend-multiply opacity-45 group-hover:opacity-0 transition-opacity duration-700 pointer-events-none"
                  style={{ background: 'var(--brand-primary)' }}
                />

                {/* Corner index */}
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-brand-text bg-black/60 backdrop-blur-sm px-2 py-1 font-mono">
                  № {String(index + 1).padStart(2, '0')}
                </span>

                {/* Hover caption — bottom slide-up */}
                <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-brand-accent mb-1">
                    <span className="h-px w-5 bg-brand-accent" />
                    Trabajo № {String(index + 1).padStart(2, '0')}
                  </div>
                  <div
                    className="font-brand-serif uppercase text-white text-xl md:text-2xl leading-none"
                    style={{ letterSpacing: 'var(--brand-display-tracking)' }}
                  >
                    {item.description}
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
