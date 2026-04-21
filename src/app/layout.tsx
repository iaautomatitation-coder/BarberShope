import type { Metadata } from "next";
import { Bebas_Neue, Fraunces, Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getActiveTheme, getBrand, themeToCssVars } from "@/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const FONT_VARS = [
  geistSans.variable,
  geistMono.variable,
  playfair.variable,
  inter.variable,
  bebas.variable,
  fraunces.variable,
].join(" ");

export function generateMetadata(): Metadata {
  const brand = getBrand();
  return {
    title: `${brand.name} | ${brand.slogan}`,
    description:
      "Barbería profesional con los mejores cortes, barbería y estética masculina. Agenda tu cita en línea.",
    keywords: ["barbería", "barber", "corte de cabello", "barba", "fade", "barbería profesional"],
    icons: { icon: "/logo.svg" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = getActiveTheme();
  const themeCss = `:root{${themeToCssVars(theme)}}`;

  return (
    <html lang="es" suppressHydrationWarning data-theme={theme.id}>
      <head>
        {/* Theme tokens — SSR-injected to avoid FOUC. */}
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body
        className={`${FONT_VARS} antialiased bg-brand-bg text-brand-text font-brand-sans`}
      >
        {children}
      </body>
    </html>
  );
}
