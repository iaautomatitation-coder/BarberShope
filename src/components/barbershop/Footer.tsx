'use client';

import { getBrand } from '@/config';

export default function Footer() {
  const brand = getBrand();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-brand-bg-elevated border-t border-brand-border pb-28 md:pb-0">
      <div className="max-w-[110rem] mx-auto px-6 sm:px-10">
        {/* Manifesto — giant editorial statement */}
        <div className="py-20 md:py-28 border-b border-brand-border">
          <span className="text-[10px] uppercase tracking-[0.4em] text-brand-accent">§ Manifiesto</span>
          <p
            className="mt-6 font-brand-serif uppercase leading-[0.9] text-brand-text text-[12vw] md:text-[6vw] lg:text-[7rem] max-w-6xl"
            style={{ letterSpacing: 'var(--brand-display-tracking)' }}
          >
            Corte exacto.<br />
            <span style={{ color: 'var(--brand-accent)', fontStyle: 'var(--brand-display-italic)' }}>Tiempo propio.</span>
          </p>
        </div>

        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brand.logo} alt={brand.name} className="h-8 w-8 object-contain" />
              <div>
                <div
                  className="text-brand-text font-brand-serif uppercase text-base"
                  style={{ letterSpacing: 'var(--brand-display-tracking)' }}
                >
                  {brand.name}
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-brand-accent">
                  Edición 01
                </div>
              </div>
            </div>
            <p className="text-brand-text-muted text-sm leading-relaxed max-w-xs">{brand.slogan}</p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-medium mb-4">
              Navegación
            </h4>
            <ul className="space-y-2">
              {brand.nav.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-brand-text-muted hover:text-brand-text text-xs uppercase tracking-[0.2em] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-medium mb-4">
              Estudio
            </h4>
            <address className="not-italic space-y-1.5 text-sm text-brand-text-muted">
              {brand.contact.address && <div>{brand.contact.address}</div>}
              {brand.contact.phone && <div>{brand.contact.phone}</div>}
              {brand.contact.email && (
                <div>
                  <a href={`mailto:${brand.contact.email}`} className="hover:text-brand-text transition-colors">
                    {brand.contact.email}
                  </a>
                </div>
              )}
            </address>
          </div>
        </div>

        <div className="border-t border-brand-border py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-brand-text-subtle text-[10px] uppercase tracking-[0.3em]">
            © {currentYear} {brand.name}. Todos los derechos reservados.
          </p>
          <p className="text-brand-text-subtle text-[10px] uppercase tracking-[0.3em]">
            Operado por Barber Rollar · CDMX
          </p>
        </div>
      </div>
    </footer>
  );
}
