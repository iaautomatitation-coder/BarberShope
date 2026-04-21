'use client';

import { getBrand } from '@/config';

export default function HeroSection({ onBook }: { onBook: () => void }) {
  const brand = getBrand();
  const { hero, stats } = brand;

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-end overflow-hidden bg-brand-bg"
    >
      {/* Hero photograph */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.image}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center saturate-[0.75] scale-105"
        />
        {/* Very dark wash + copper tint on top */}
        <div className="absolute inset-0 bg-black/65" />
        <div
          className="absolute inset-0 mix-blend-multiply opacity-65"
          style={{ background: 'var(--brand-primary)' }}
        />
        <div className="absolute inset-0" style={{ background: 'var(--brand-gradient-hero)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-brand-bg" />
      </div>

      {/* Top-right meta rail */}
      <div className="hidden md:block absolute top-28 right-8 z-10 text-right text-[10px] uppercase tracking-[0.4em] text-brand-text-muted space-y-2 leading-none">
        <div>Est. MMXIX</div>
        <div>N. 19°26&apos;</div>
        <div>W. 99°08&apos;</div>
      </div>

      {/* Left edition marker */}
      <div className="hidden md:flex absolute top-28 left-8 z-10 flex-col items-start gap-3">
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-text-muted">Edición 01</span>
        <span className="h-12 w-px bg-brand-border" />
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-[110rem] mx-auto px-6 sm:px-10 pt-40 pb-16 md:pb-24">
          {/* Kicker */}
          <div className="flex items-center gap-4 mb-10 animate-in fade-in-0 duration-1000">
            <span className="h-px w-16 bg-brand-accent" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.4em] font-medium text-brand-accent">
              {hero.kicker}
            </span>
          </div>

          {/* Headline — editorial asymmetric stack */}
          <h1
            className="font-brand-serif text-brand-text leading-[0.85] uppercase animate-in fade-in-0 slide-in-from-bottom-6 duration-1000"
            style={{ letterSpacing: 'var(--brand-display-tracking)' }}
          >
            <span className="block text-[22vw] sm:text-[18vw] md:text-[15vw] lg:text-[13rem]">
              {hero.title}
            </span>
            <span
              className="block text-[18vw] sm:text-[14vw] md:text-[11vw] lg:text-[9.5rem] pl-[8vw] md:pl-[14vw] lg:pl-[22rem] -mt-2 md:-mt-4"
              style={{
                color: 'var(--brand-accent)',
                fontStyle: 'var(--brand-display-italic)',
              }}
            >
              {hero.titleAccent}
            </span>
          </h1>

          {/* Bottom row: subtitle + CTAs left, stats right */}
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 items-end">
            <div className="md:col-span-7 lg:col-span-6">
              <p className="text-base sm:text-lg text-brand-text-muted max-w-xl leading-relaxed animate-in fade-in-0 duration-1000 delay-200">
                {hero.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 animate-in fade-in-0 duration-1000 delay-300">
                <button
                  onClick={onBook}
                  className="group relative overflow-hidden px-10 py-4 font-semibold tracking-[0.2em] text-sm uppercase transition-transform hover:-translate-y-0.5"
                  style={{
                    background: 'var(--brand-primary)',
                    color: 'var(--brand-primary-foreground)',
                    borderRadius: 'var(--brand-radius-pill)',
                    boxShadow: 'var(--brand-shadow-cta)',
                  }}
                >
                  <span className="relative z-10 inline-flex items-center gap-3">
                    {hero.primaryCta}
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </button>

                <a
                  href="#servicios"
                  className="group px-8 py-4 border border-brand-border hover:border-brand-border-hover text-brand-text text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors hover:bg-brand-surface-hover inline-flex items-center gap-2.5"
                  style={{ borderRadius: 'var(--brand-radius-pill)' }}
                >
                  {hero.secondaryCta}
                  <svg className="w-3 h-3 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>

                <span className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.3em] text-brand-text-muted">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
                    <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  Horarios hoy
                </span>
              </div>
            </div>

            {/* Stats — big numbers, right column */}
            <div className="md:col-span-5 lg:col-span-6 grid grid-cols-3 gap-4 md:gap-6 md:justify-items-end animate-in fade-in-0 duration-1000 delay-500">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-brand-text-subtle">
                    {String(i + 1).padStart(2, '0')} / {String(stats.length).padStart(2, '0')}
                  </span>
                  <span
                    className="font-brand-serif text-4xl sm:text-5xl md:text-6xl text-brand-text leading-none"
                    style={{ color: 'var(--brand-accent)' }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-brand-text-muted">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom thin rail */}
        <div className="absolute bottom-4 left-6 sm:left-10 right-6 sm:right-10 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-brand-text-subtle">
          <span>Scroll</span>
          <span className="hidden sm:inline">— {brand.name} / {brand.slogan}</span>
          <span>Ed. 01</span>
        </div>
      </div>
    </section>
  );
}
