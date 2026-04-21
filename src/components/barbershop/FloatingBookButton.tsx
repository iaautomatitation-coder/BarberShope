'use client';

import { useEffect, useState } from 'react';

export default function FloatingBookButton({ onBook }: { onBook: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const blockStyle = {
    background: 'var(--brand-primary)',
    color: 'var(--brand-primary-foreground)',
    boxShadow: 'var(--brand-shadow-cta)',
    borderRadius: 'var(--brand-radius-pill)',
  } as const;

  return (
    <>
      {/* Mobile — bottom bar */}
      <div
        className={`md:hidden fixed bottom-4 left-4 right-4 z-40 transition-all duration-500 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={onBook}
          className="group relative w-full overflow-hidden font-semibold py-4 px-5 text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3"
          style={blockStyle}
        >
          Reservar ahora
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Desktop — bottom-left floating block */}
      <button
        onClick={onBook}
        aria-label="Reservar cita"
        className={`hidden md:inline-flex fixed bottom-6 left-6 z-40 items-center gap-3 px-6 py-3.5 font-semibold text-[11px] uppercase tracking-[0.3em] transition-all duration-500 hover:-translate-y-0.5 group ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
        style={blockStyle}
      >
        Reservar
        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </>
  );
}
