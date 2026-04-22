/**
 * PostCSS config for Tailwind v4 + Next.js.
 *
 * Sin este archivo Next.js NO activa @tailwindcss/postcss, y el
 * `@import "tailwindcss"` de globals.css se sirve como import roto,
 * generando 0 utility classes en el bundle.
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
