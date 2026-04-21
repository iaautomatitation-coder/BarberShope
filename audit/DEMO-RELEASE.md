# BarberRoyal — Demo publicable

Documento de cierre para la versión que se muestra a clientes.

---

## 1. Combinación oficial

| | Valor |
|---|---|
| **Brand activo** | `default` — Barber Rollar MX (el flagship, más pulido y con más contenido real) |
| **Theme activo** | `classic` (oro premium sobre negro profundo) |
| **Activación** | Sin env var; el valor por defecto de `currentBrand` en [src/config/brand-config.ts](../src/config/brand-config.ts) |
| **Marcador HTML** | `<html data-theme="classic">` verificado en el HTML SSR |

---

## 2. Verificación funcional

HTTP 200 confirmado en todas las superficies relevantes:

```
/                                -> 200
/admin/dashboard                 -> 200
/admin/appointments              -> 200
/admin/clients                   -> 200
/api/services?active=true        -> 200
/api/barbers?active=true         -> 200
/api/stats                       -> 200
/api/appointments                -> 200
/api/barbershop                  -> 200
```

Booking flow recorrido end-to-end vía Puppeteer:

1. Click "Agendar" abre el dialog ✅
2. Step 1 muestra 3 servicios + 3 barberos reales ✅
3. Selección lleva a Step 2 con fecha + slots (20 slots devueltos por `/api/availability`) ✅
4. Slot seleccionado lleva a Step 3 con resumen y total `$180 MXN` ✅
5. `POST /api/appointments` persiste en DB (verificado con 3 citas existentes) ✅

---

## 3. Capturas actualizadas

Todas en [audit/screenshots/](screenshots/):

| # | Screen | Archivo |
|---|---|---|
| 1 | Hero | [01-home-hero.png](screenshots/01-home-hero.png) |
| 2 | Servicios | [02-services.png](screenshots/02-services.png) |
| 3 | Equipo | [03-team.png](screenshots/03-team.png) |
| 4 | Booking Step 1 | [04-booking-step1.png](screenshots/04-booking-step1.png) |
| 5 | Booking Step Final | [05-booking-step3.png](screenshots/05-booking-step3.png) |
| 6 | Admin Dashboard | [06-admin-dashboard.png](screenshots/06-admin-dashboard.png) |
| 7 | Admin Appointments | [07-admin-appointments.png](screenshots/07-admin-appointments.png) |
| + | Landing full-page | [00-home-full.png](screenshots/00-home-full.png) |
| + | Admin Clients | [08-admin-clients.png](screenshots/08-admin-clients.png) |

**Regenerar** en cualquier momento con: `node audit/capture.mjs`

---

## 4. Revisión de consistencia visual

### Tipografía ✅
- Titulares: **Playfair Display** (`var(--brand-font-serif)`) en hero, secciones y cards.
- Itálica de acento consistente: "que te define.", "cuidarte.", "trabajo.", "de su oficio.", "nuestros clientes.", "escríbenos."
- Cuerpo: **Geist Sans** (`var(--brand-font-sans)`), uniforme en descripciones, labels y UI.
- Kickers uppercase con `tracking-[0.35em]` ámbar, mismo tamaño en todas las secciones.

### Paleta de color ✅
- Base: `#0A0707` (brand-bg) en todas las secciones públicas.
- Ámbar: primario `#f59e0b`, accent `#fcd34d`, gradient `from-amber-200 via-amber-500 to-amber-700`.
- Textos: blanco para titulares, gris claro para párrafos, gris sutil para metadata.
- Verde reservado a "disponibilidad hoy" (pulso), "WhatsApp", y "Confirmar cita" — único uso semántico fuera de la paleta, intencional.

### CTAs ✅
- Primario (Agendar): pill ámbar con gradient + sombra dorada — aparece en Hero, Nav, Servicios, Contacto, Flotante, Mobile bar.
- Secundario (Ver Servicios / Ver toda la agenda): outline con border hover ámbar.
- Terciarios por card: outline ámbar que se ilumina en hover del grupo.
- Navegación consistente: botón primario siempre a la derecha del nav.

### Spacing ✅
- Secciones: `py-24 sm:py-32` uniforme.
- Grid gap: `gap-5`/`gap-6` en cards.
- Hero: `pt-32 pb-24 sm:pt-40 sm:pb-32` consistente.
- Separadores horizontales: `h-px` con gradient ámbar en cabeceras de sección.

### Imágenes ✅
- Hero: fotografía real (Unsplash, `photo-1585747860715-2ba37e788b70`) con doble color grade.
- Equipo: 3 retratos reales asignados a barberos sin foto propia (fallback determinista).
- Galería: 6 fotos reales temáticas (corte, barba, textura, herramientas, sesión, silla).

### Footer ✅
- 3 columnas: Brand · Navegación · Cita editorial.
- Nombre dinámico: "Barber Rollar MX", logo, slogan.
- Copyright con año dinámico.
- Padding extra en mobile (`pb-28`) para no colisionar con la barra CTA flotante.

---

## 5. Detalles pendientes (no bloqueantes para demo local, sí para publicar público)

### 🔴 Bloqueadores para exponer URL pública

1. **Auth en `/admin/*`**: hoy cualquiera con la URL puede modificar citas/barberos/servicios. Antes de publicar hay que meter un guard (NextAuth credentials o similar).
2. **Endpoints de mutación públicos**: `POST/PUT/PATCH/DELETE` en `/api/*` no tienen token. Protegerlos junto con el admin.
3. **Rate limiting + captcha** en `POST /api/appointments`: sin esto un bot puede inundar la agenda.

### 🟡 Pulimento recomendado antes de demo grabada

4. **Stats del hero hard-coded** (`5+ / 3K+ / 4.9★`) en [src/config/brand-config.ts:77-81](../src/config/brand-config.ts#L77-L81). Ajustar a los números reales del cliente o quitarlos si no hay data verificable.
5. **Ratings de barberos siempre a 5.0**: se muestra el mismo bloque en los 3. Conectarlos a testimonios reales o quitarlos.
6. **Botón "Confirmar Cita" verde** en Step 3 rompe la paleta ámbar. Sugerencia: cambiarlo al gradient del brand ([BookingDialog.tsx:393](../src/components/barbershop/BookingDialog.tsx#L393)).
7. **Preselección de servicio/barbero**: las cards individuales abren el dialog sin pasar el id elegido; el cliente tiene que re-elegir. Mejora de conversión rápida.
8. **Disponibilidad ignora la duración** en `/api/availability`: un servicio de 45 min no bloquea los 30 min siguientes. Riesgo de doble booking.

### 🟢 Cosmético / opcional

9. **Indicador dev "N" de Next.js** en la esquina tapa el botón flotante — solo en dev mode, desaparece en producción (`next start`).
10. **Dirección real + integración Maps**: el card del mapa en Contacto cae a "Ubicación próximamente" hasta que haya `address` en `/api/barbershop`. Meter una dirección demo (CDMX, México ya está seedeada).
11. **Testimonios reales**: hoy los 6 son de `defaultTestimonials` dentro del componente; el admin no tiene UI para editarlos. Para publicar, seedear 3-4 testimonios reales o construir la UI.
12. **Notificación al cliente**: actualmente solo abre WhatsApp del negocio. Falta email/SMS de confirmación.

### 📦 Deployment

13. `next build` debe correr sin `--webpack`? — confirmar que Turbopack no explote en el entorno de deploy (diferente al path con `@` del dev local).
14. Variables `.env` de producción: `DATABASE_URL` (hoy SQLite file — mover a Postgres/MySQL para producción), futura `NEXT_PUBLIC_BRAND`, secretos de auth.
15. `bun` vs `node`: el script `build` usa `bun .next/standalone/server.js` pero `bun` no está instalado ahora. Alinear runtime del deploy.

---

## 6. Entregable

### 6.1 Brand + theme activos

| | |
|---|---|
| Brand | `default` (Barber Rollar MX) |
| Theme | `classic` |
| Fuente de verdad | [src/config/brand-config.ts](../src/config/brand-config.ts) + [src/config/theme-config.ts](../src/config/theme-config.ts) |
| Inyección | SSR en [src/app/layout.tsx](../src/app/layout.tsx) vía `<style>` con `themeToCssVars()` |

### 6.2 Archivos clave

**Configuración**
- [src/config/brand-config.ts](../src/config/brand-config.ts) — catálogo de marcas (`default`, `urban-cuts`), `getBrand()`, `currentBrand`.
- [src/config/theme-config.ts](../src/config/theme-config.ts) — 5 presets (`classic`, `urban`, `minimal`, `club`, `natural`), `themeToCssVars()`.
- [src/config/index.ts](../src/config/index.ts) — barrel + `getActiveTheme()`.
- [src/app/globals.css](../src/app/globals.css) — registra utilities `bg-brand-*`, `text-brand-*`, `font-brand-*`, `rounded-brand-*`.
- [src/app/layout.tsx](../src/app/layout.tsx) — carga 5 fuentes, inyecta CSS vars del tema al SSR.

**Landing**
- [src/app/page.tsx](../src/app/page.tsx) — composición raíz con estado de booking único.
- [src/components/barbershop/HeroSection.tsx](../src/components/barbershop/HeroSection.tsx)
- [src/components/barbershop/Navbar.tsx](../src/components/barbershop/Navbar.tsx)
- [src/components/barbershop/ServicesSection.tsx](../src/components/barbershop/ServicesSection.tsx)
- [src/components/barbershop/GallerySection.tsx](../src/components/barbershop/GallerySection.tsx)
- [src/components/barbershop/TeamSection.tsx](../src/components/barbershop/TeamSection.tsx)
- [src/components/barbershop/TestimonialsSection.tsx](../src/components/barbershop/TestimonialsSection.tsx)
- [src/components/barbershop/ContactSection.tsx](../src/components/barbershop/ContactSection.tsx)
- [src/components/barbershop/Footer.tsx](../src/components/barbershop/Footer.tsx)
- [src/components/barbershop/FloatingBookButton.tsx](../src/components/barbershop/FloatingBookButton.tsx)
- [src/components/barbershop/FloatingWhatsApp.tsx](../src/components/barbershop/FloatingWhatsApp.tsx)
- [src/components/barbershop/BookingDialog.tsx](../src/components/barbershop/BookingDialog.tsx) — 3 pasos, conectado al backend real.

**Admin**
- [src/app/admin/layout.tsx](../src/app/admin/layout.tsx) + [AdminSidebar.tsx](../src/components/admin/AdminSidebar.tsx)
- [src/app/admin/dashboard/page.tsx](../src/app/admin/dashboard/page.tsx)
- [src/app/admin/appointments/page.tsx](../src/app/admin/appointments/page.tsx)
- [src/app/admin/clients/page.tsx](../src/app/admin/clients/page.tsx)
- [src/app/admin/barbers/page.tsx](../src/app/admin/barbers/page.tsx)
- [src/app/admin/services/page.tsx](../src/app/admin/services/page.tsx)
- [src/app/admin/settings/page.tsx](../src/app/admin/settings/page.tsx)

**Backend**
- Prisma schema: [prisma/schema.prisma](../prisma/schema.prisma) — Barbershop, Service, Barber, Appointment, Client, Testimonial, Gallery.
- API routes: [src/app/api/](../src/app/api/) — services, barbers, appointments (+[id]), availability, stats, clients (+[id]), barbershop, testimonials.
- Lógica compartida: [src/lib/appointment-status.ts](../src/lib/appointment-status.ts), [src/lib/whatsapp.ts](../src/lib/whatsapp.ts), [src/lib/db.ts](../src/lib/db.ts).

### 6.3 Capturas generadas

9 PNG en [audit/screenshots/](screenshots/) — regeneradas con el script reproducible [audit/capture.mjs](capture.mjs).

### 6.4 Checklist final pre-publicación

**Antes de grabar demo local / presentación cliente (HOY)**
- [x] Landing pública se ve premium y consistente.
- [x] Booking flow completo funciona (servicio → barbero → fecha → hora → datos → confirma).
- [x] Admin navegable con data real.
- [x] Capturas generadas.
- [ ] Ajustar stats del hero a números reales del cliente (o removerlos).
- [ ] Quitar "5.0 · verificado" de barberos o conectar a fuente real.
- [ ] Confirmar direccion demo visible en Contacto (hoy: "CDMX, México").

**Antes de subir a URL pública (SIGUIENTE SPRINT)**
- [ ] Auth en `/admin/*` (NextAuth credentials mínimo).
- [ ] Guard de auth en todos los `POST/PUT/PATCH/DELETE` de `/api/*`.
- [ ] Rate limit + captcha en `POST /api/appointments`.
- [ ] Notificación al cliente (email o WhatsApp del cliente, no solo del negocio).
- [ ] Fix race condition en creación de appointments (`db.$transaction`).
- [ ] Fix disponibilidad ignorando duración del servicio.
- [ ] Preseleccionar servicio/barbero cuando se hace click en su card.
- [ ] Cambiar verde del "Confirmar Cita" al brand gradient.
- [ ] Migrar SQLite → Postgres/MySQL.
- [ ] Confirmar runtime de deploy (`bun` vs `node`).

**Smoke test manual para la demo**
- [ ] Abrir `http://localhost:3001/` en Chrome con ventana 1440×900.
- [ ] Scroll suave desde hero hasta footer (confirmar animaciones y flotante CTA).
- [ ] Click en "Agendar cita" del nav → modal abre.
- [ ] Completar flujo con datos dummy, confirmar cita.
- [ ] Ir a `/admin/dashboard` y verificar que la cita nueva aparece en "Próximas citas".
- [ ] Ir a `/admin/appointments` y marcar la cita como "Completada".
- [ ] Regresar al dashboard y ver `completadas +1`.

---

**Estado final**: listo para **demo local con cliente en pantalla compartida**. No listo para URL pública hasta cerrar los bloqueadores de autenticación.
