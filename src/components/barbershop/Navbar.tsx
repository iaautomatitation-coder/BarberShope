'use client';

import { useState, useEffect } from 'react';
import { getBrand } from '@/config';

export default function Navbar({ onBook }: { onBook?: () => void }) {
  const brand = getBrand();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBook = () => {
    setMobileOpen(false);
    if (onBook) onBook();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-xl border-b border-brand-border' : 'bg-transparent'
      }`}
      style={scrolled ? { backgroundColor: 'color-mix(in srgb, var(--brand-bg) 80%, transparent)' } : undefined}
    >
      <div className="max-w-[110rem] mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#inicio" className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
            />
            <div className="leading-tight flex items-baseline gap-3">
              <span
                className="font-brand-serif uppercase text-brand-text text-base sm:text-lg"
                style={{ letterSpacing: 'var(--brand-display-tracking)' }}
              >
                {brand.name}
              </span>
              <span className="hidden md:inline text-[9px] uppercase tracking-[0.3em] text-brand-text-subtle">
                Ed. 01
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {brand.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-brand-text-muted hover:text-brand-text px-4 py-2 text-[11px] uppercase tracking-[0.25em] font-medium transition-colors duration-200 group"
              >
                {link.label}
                <span
                  className="absolute left-4 right-4 bottom-1 h-px scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                  style={{ backgroundColor: 'var(--brand-accent)' }}
                />
              </a>
            ))}
            <button
              onClick={handleBook}
              className="ml-4 px-6 py-2.5 text-[11px] uppercase tracking-[0.25em] font-semibold transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'var(--brand-primary)',
                color: 'var(--brand-primary-foreground)',
                borderRadius: 'var(--brand-radius-pill)',
              }}
            >
              Reservar
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-brand-text p-2 hover:bg-brand-surface-hover transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            mobileOpen ? 'max-h-[28rem] pb-4' : 'max-h-0'
          }`}
        >
          <div
            className="flex flex-col gap-1 backdrop-blur-xl p-3 mt-2 border border-brand-border"
            style={{ backgroundColor: 'color-mix(in srgb, var(--brand-bg) 95%, transparent)' }}
          >
            {brand.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-brand-text-muted hover:text-brand-accent px-4 py-3 text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-brand-surface-hover transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleBook}
              className="mt-2 px-4 py-3 text-[11px] uppercase tracking-[0.25em] font-semibold text-center transition-all"
              style={{
                background: 'var(--brand-primary)',
                color: 'var(--brand-primary-foreground)',
              }}
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
