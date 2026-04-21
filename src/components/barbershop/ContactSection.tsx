'use client';

import { useState, useEffect } from 'react';
import { getBrand } from '@/config';
import { buildWhatsAppLink } from '@/lib/whatsapp';

interface BarbershopInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  scheduleJson?: string;
}

interface DayHours {
  open: boolean;
  start: string;
  end: string;
}

const DAYS_ORDER = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DAYS_LABEL: Record<string, string> = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom',
};

export default function ContactSection({ onBook }: { onBook: () => void }) {
  const brand = getBrand();
  const [shop, setShop] = useState<BarbershopInfo>({
    phone: '', whatsapp: '', email: '', address: '',
    facebook: '', instagram: '', tiktok: '', scheduleJson: '{}',
  });

  useEffect(() => {
    fetch('/api/barbershop')
      .then((r) => r.json())
      .then((data) => setShop(data))
      .catch(() => {});
  }, []);

  const hasSocials = shop.facebook || shop.instagram || shop.tiktok;
  // DB takes priority for contact; brand config acts as fallback.
  const whatsapp = shop.whatsapp || brand.contact.whatsapp || '';
  const waLink = whatsapp
    ? buildWhatsAppLink(whatsapp, `Hola, me gustaría agendar una cita en ${brand.name}`)
    : null;

  let hours: Record<string, DayHours> = {};
  try {
    hours = JSON.parse(shop.scheduleJson || '{}');
  } catch {}

  const mapSrc = shop.address
    ? `https://www.google.com/maps?q=${encodeURIComponent(shop.address)}&output=embed`
    : null;

  return (
    <section id="contacto" className="relative py-24 sm:py-32 bg-brand-bg">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[color:var(--brand-primary)]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[color:var(--brand-primary)]/50" />
            <span className="text-brand-accent text-[11px] uppercase tracking-[0.35em] font-medium">Contacto</span>
            <span className="h-px w-8 bg-[color:var(--brand-primary)]/50" />
          </div>
          <h2 className="font-brand-serif text-4xl sm:text-5xl md:text-6xl text-brand-text tracking-tight">
            Visítanos o <span className="italic text-brand-accent">escríbenos.</span>
          </h2>
          <p className="text-brand-text-muted/90 text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Estamos listos para atenderte. Agenda en línea o escríbenos directamente — te respondemos en minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            {/* WhatsApp hero card */}
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative overflow-hidden rounded-brand-lg border border-emerald-500/20 hover:border-emerald-400/50 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-6 transition-all duration-500 hover:-translate-y-0.5"
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500" />
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-brand-lg bg-emerald-500 flex items-center justify-center shrink-0 shadow-[0_15px_30px_-10px_rgba(16,185,129,0.6)]">
                    <svg className="w-6 h-6 text-brand-text" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.695.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-medium">La vía más rápida</div>
                    <div className="font-brand-serif text-xl text-brand-text mt-1">Escríbenos por WhatsApp</div>
                    <div className="text-brand-text-muted text-sm mt-1 truncate">Respuesta en minutos · {shop.whatsapp}</div>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                      Iniciar conversación
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ) : (
              <div className="rounded-brand-lg border border-brand-border bg-brand-surface p-6 text-brand-text-subtle text-sm">
                Configura tu WhatsApp desde el panel de administración.
              </div>
            )}

            {/* Address */}
            <div className="rounded-brand-lg border border-brand-border bg-brand-surface p-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-brand bg-[color:var(--brand-primary)]/10 border border-[color:var(--brand-primary)]/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-medium">Estudio</div>
                  <div className="font-brand-serif text-lg text-brand-text mt-1">Dirección</div>
                  <p className="text-brand-text-muted text-sm mt-1 leading-relaxed">
                    {shop.address || 'Dirección próximamente'}
                  </p>
                  {shop.address && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-brand-accent hover:text-brand-accent font-medium"
                    >
                      Cómo llegar
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="rounded-brand-lg border border-brand-border bg-brand-surface p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-brand bg-[color:var(--brand-primary)]/10 border border-[color:var(--brand-primary)]/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-medium">Horario</div>
                  <div className="font-brand-serif text-lg text-brand-text mt-0.5">Atención</div>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm">
                {DAYS_ORDER.map((key) => {
                  const h = hours[key];
                  return (
                    <li key={key} className="flex items-center justify-between py-1">
                      <span className="text-brand-text-muted uppercase tracking-wider text-xs">{DAYS_LABEL[key]}</span>
                      {h?.open ? (
                        <span className="text-brand-text font-mono text-xs">{h.start} – {h.end}</span>
                      ) : (
                        <span className="text-brand-text-subtle text-xs italic">Cerrado</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Email + Socials */}
            {(shop.email || hasSocials) && (
              <div className="rounded-brand-lg border border-brand-border bg-brand-surface p-6 space-y-4">
                {shop.email && (
                  <a href={`mailto:${shop.email}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-brand bg-[color:var(--brand-primary)]/10 border border-[color:var(--brand-primary)]/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle">Email</div>
                      <div className="text-brand-text text-sm group-hover:text-brand-accent transition-colors">{shop.email}</div>
                    </div>
                  </a>
                )}

                {hasSocials && (
                  <div className="flex items-center gap-3 pt-2 border-t border-brand-border">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-brand-text-subtle mr-1">Síguenos</span>
                    {shop.instagram && (
                      <a href={shop.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg border border-brand-border hover:border-[color:var(--brand-primary)]/50 flex items-center justify-center text-gray-300 hover:text-brand-accent transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                      </a>
                    )}
                    {shop.facebook && (
                      <a href={shop.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg border border-brand-border hover:border-[color:var(--brand-primary)]/50 flex items-center justify-center text-gray-300 hover:text-brand-accent transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                      </a>
                    )}
                    {shop.tiktok && (
                      <a href={shop.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg border border-brand-border hover:border-[color:var(--brand-primary)]/50 flex items-center justify-center text-gray-300 hover:text-brand-accent transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column — Map + Book CTA */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Map */}
            <div className="relative flex-1 min-h-[380px] lg:min-h-[460px] rounded-brand-lg overflow-hidden border border-brand-border bg-gradient-to-br from-[#1a1008] to-[#0a0606]">
              {mapSrc ? (
                <>
                  <iframe
                    src={mapSrc}
                    title="Ubicación del estudio"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full grayscale-[0.6] contrast-[1.1]"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                    <div className="backdrop-blur-md bg-black/60 border border-brand-border rounded-brand px-4 py-3 flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-medium">Nos encuentras en</div>
                      <div className="text-brand-text text-sm mt-0.5 truncate">{shop.address}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-10 text-center">
                  <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(251,191,36,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.4) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                  <div className="relative">
                    <svg className="w-16 h-16 text-brand-accent/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="font-brand-serif text-xl text-brand-text">Ubicación próximamente</div>
                    <p className="text-brand-text-subtle text-sm mt-2">Configura la dirección desde el panel.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Book CTA */}
            <button
              onClick={onBook}
              className="group relative overflow-hidden rounded-brand-lg bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 text-[#1a0f05] px-8 py-5 font-semibold text-base sm:text-lg shadow-[0_25px_60px_-15px_rgba(251,191,36,0.55)] hover:shadow-[0_35px_80px_-15px_rgba(251,191,36,0.8)] transition-all hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Agendar tu cita ahora
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
