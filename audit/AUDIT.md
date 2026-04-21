# BarberRoyal — Paquete de auditoría

Fecha: 2026-04-20
Build bajo inspección: dev server `next 16.2.4 (webpack)` en `http://localhost:3001`
Viewport de captura: 1440×900, deviceScaleFactor 1, Chrome headless.

---

## 1. Capturas de pantalla

Todas las capturas están en [audit/screenshots/](screenshots/). A continuación se describe cada una a nivel de layout, color y jerarquía para la lectura rápida del auditor.

### 1.1 Home — Hero (above the fold)
**Archivo:** [screenshots/01-home-hero.png](screenshots/01-home-hero.png)

- Viewport 1440×900 completo dominado por una **fotografía cinematográfica** de un barbero trabajando (Unsplash), con un tratamiento de color cálido multiply (`#2a1408`) + doble viñeteado (lateral negro + radial central).
- **Navbar sticky** transparente con logo izquierda, 6 links centrales y pill dorada "Agendar cita" a la derecha.
- **Kicker ornamental**: dos líneas doradas laterales flanqueando "BARBERÍA PREMIUM · EST. 2019" en small caps ámbar.
- **Headline serif** enorme (Playfair Display, ~80–88px): "La experiencia en barbería" con la línea siguiente *"que te define."* en itálica sobre un gradiente oro (amber-200 → amber-600 via bg-clip-text).
- **Subhead** en gris claro: "Transformamos cada corte en una obra de arte. Reserva tu cita y descubre el estilo que te define."
- **Dos CTAs horizontales**:
  - Primario: pill `Agendar Cita` con gradiente `from-amber-400 via-amber-500 to-amber-700`, texto marrón muy oscuro (`#1a0f05`), sombra dorada difusa `shadow-[0_20px_60px_-15px_rgba(251,191,36,0.6)]`.
  - Secundario: pill outline blanca 15% "Ver Servicios" con icono chevron-down.
- Debajo, pill con **punto verde pulsante** + "HORARIOS DISPONIBLES HOY" en tracking widest.
- **Barra de stats** (3 columnas separadas por línea superior sutil): `5+ AÑOS DE OFICIO`, `3K+ CLIENTES FIELES`, `4.9★ RATING GOOGLE` — números grandes en Playfair con el mismo gradiente oro.
- Bloque asimétrico visible en la parte inferior izquierda: logo Next.js dev indicator (sólo en dev).

### 1.2 Sección de servicios
**Archivo:** [screenshots/02-services.png](screenshots/02-services.png)

- Fondo negro puro (`#0A0707`). Al tope una línea hair de gradiente ámbar central, y un glow cálido difuso detrás del header.
- **Header centrado**: kicker `— SERVICIOS —`, título serif "El arte de *cuidarte.*" (última palabra itálica dorada), subhead de 2 líneas.
- **Grid 3 columnas** con 3 cards idénticas en proporción (la DB sólo tiene 3 servicios activos):
  - Header de card con gradiente ámbar muy sutil, SVG ornamental esquina superior derecha (tijera estilizada en oro al 25%) y kicker `01 · SERVICIO` en tracking widest.
  - Nombre del servicio en serif (`Corte Clásico`, `Corte + Barba`, `Afeitado Premium`).
  - Descripción corta en gris.
  - Separador y bloque precio/duración: precio en serif con gradiente oro (`$180`, `$280`, `$220`) + pill gris con icono reloj (`30 min`, `45 min`, `30 min`).
  - CTA outline dorado `Reservar este servicio →` de ancho completo.
- **CTA inferior** centrado: kicker "AGENDA EN MENOS DE 60 SEGUNDOS" + pill oro con chevron `Reservar un servicio →`.
- **FloatingBookButton visible** (pill dorada bottom-left "Agendar ahora") y **FloatingWhatsApp** (círculo verde bottom-right). En la captura se superpone el badge dev "N" de Next.js sobre la pill inferior izquierda.

### 1.3 Sección de equipo (barberos)
**Archivo:** [screenshots/03-team.png](screenshots/03-team.png)

- Header idéntico al de servicios: kicker `— MAESTROS BARBEROS —`, título serif "Los mejores *de su oficio.*"
- **Grid 3 columnas** con 3 retratos verticales aspect-ratio 4:5.
  - Cada tarjeta muestra una **fotografía real** (Unsplash) de un hombre con retrato premium, color grade cálido multiply, grain diagonal sutil.
  - Overlay gradient de abajo-oscuro → transparente-arriba para legibilidad.
  - En el footer de la foto: línea dorada 6px + kicker `01 · MAESTRO BARBERO`, nombre en serif, especialidad en gris.
  - Barra inferior fuera de la foto con 5 estrellas doradas + `5.0 · VERIFICADO` y CTA inline `Reservar →`.
- Barberos visibles: **Carlos Ramírez**, **Luis Hernández**, **Alejandro Santos**. El tercero fue creado más tarde desde el admin (no del seed).
- FloatingBookButton bottom-left aún visible.

### 1.4 Modal de booking — Paso 1
**Archivo:** [screenshots/04-booking-step1.png](screenshots/04-booking-step1.png)

- Overlay oscuro `bg-black/70 backdrop-blur-sm` cubre toda la página.
- Modal centrado ~512px ancho, fondo `gray-900`, borde gris 700, esquinas `rounded-3xl`.
- Header sticky: título sans "Agendar Cita", subtítulo "Paso 1 de 3", botón cerrar X a la derecha, barra de progreso de 3 segmentos con el primero en ámbar.
- Cuerpo:
  - Label "Selecciona un Servicio" → 3 tarjetas clicables listadas verticalmente: nombre del servicio (blanco) + precio ámbar a la derecha (`$180`, `$280`, `$220`), debajo la duración gris (`30 min`, `45 min`, `30 min`).
  - Label "Selecciona un Barbero" → 3 tarjetas con sólo el nombre (`Carlos Ramírez`, `Luis Hernández`, `Alejandro Santos`).
  - Botón `Continuar` full-width, deshabilitado (gris) hasta que haya servicio + barbero seleccionados.
- Todas las tarjetas tienen el mismo estilo outline gris; al seleccionar cambian a borde ámbar + fondo `amber-500/10`.

### 1.5 Modal de booking — Paso final (resumen + datos)
**Archivo:** [screenshots/05-booking-step3.png](screenshots/05-booking-step3.png)

- Mismo contenedor. Header "Paso 3 de 3", barra de progreso llena (3/3 ámbar).
- **Card de resumen** con título ámbar "Resumen de tu Cita":
  - `Servicio: Corte Clásico`
  - `Barbero: Carlos Ramírez`
  - `Fecha: jueves, 23 de abril de 2026`
  - `Hora: 10:00`
  - Separador y total en ámbar: `$180 MXN`.
- 3 campos:
  - `Tu Nombre *` (input placeholder "Nombre completo")
  - `Tu Teléfono *` (input placeholder "55 1234 5678")
  - `Notas (opcional)` (textarea)
- Botonera inferior: `Atrás` outline gris (50% ancho) + `✓ Confirmar Cita` verde (50% ancho), deshabilitada hasta rellenar nombre + teléfono.

### 1.6 /admin/dashboard
**Archivo:** [screenshots/06-admin-dashboard.png](screenshots/06-admin-dashboard.png)

- **Sidebar izquierda** 256px `bg-gray-950`: logo ámbar 40px, bloque "Barber Rollar MX / ADMIN", nav vertical (`Dashboard`, `Citas`, `Clientes`, `Barberos`, `Servicios`, `Configuración`). Item activo con fondo `amber-500/10` + borde `amber-500/20`. Footer de sidebar con link "← Ver sitio público".
- Título "Dashboard" serif bold grande + subtítulo "Resumen operativo de tu barbería" + botón primario `Ver agenda completa`.
- **4 KPI cards** en fila:
  - `Citas hoy: 0` ámbar + `Todo el día`.
  - `Pendientes de confirmar: 0` rosa + `Todo al día`.
  - `Barberos activos: 3` azul + `3 servicios`.
  - `Ingresos estimados hoy: $0` verde.
- **2 paneles** en fila:
  - `Agenda de hoy` — empty state "Sin citas para hoy" + link "Ver toda la agenda →".
  - `Próximas citas` con contador `1` y 1 fila: `MIÉ 22 DE ABR 12:00 · Hugo Sanchez · Corte Clásico · Luis Hernández` + badge verde `• Confirmada`.

### 1.7 /admin/appointments
**Archivo:** [screenshots/07-admin-appointments.png](screenshots/07-admin-appointments.png)

- Cabecera: título "Citas" serif + subtítulo "Gestiona el flujo completo de reservas".
- **Filtros**: chips de estado en fila (`Todas` activa ámbar, `Pendiente`, `Confirmada`, `Reagendada`, `Cancelada`, `Completada`, `No asistió`) + input `date` a la derecha.
- **Tabla** con encabezados en uppercase tracking-wide: `FECHA · HORA · CLIENTE · TELÉFONO · SERVICIO · BARBERO · TOTAL · ESTADO · ACCIONES`.
- 3 filas reales de la DB:
  - `sáb, 25 de abr de 2026 · 15:30 · Test User · 5555555555 · Corte Clásico · Carlos Ramírez · $180 · ●Cancelada · Acciones▾`
  - `mié, 22 de abr de 2026 · 12:00 · Hugo Sanchez · 9933182859 · Corte Clásico · Luis Hernández · $180 · ●Confirmada · Acciones▾`
  - `lun, 20 de abr de 2026 · 16:00 · Alejandro Santos · 9933182859 · Corte Clásico · Carlos Ramírez · $180 · ●Confirmada · Acciones▾`
- Las filas son clicables (abren drawer de detalle), los estados con color codificado (rose / emerald).

### 1.8 Extras capturados

- [screenshots/00-home-full.png](screenshots/00-home-full.png) — landing completa en modo `fullPage` para visión de recorrido vertical.
- [screenshots/08-admin-clients.png](screenshots/08-admin-clients.png) — admin de clientes.

---

## 2. Estructura real de componentes

> Archivos clave del frontend público. Se referencia cada uno con `path:line` para acceso directo.

| # | Componente | LOC | Archivo |
|---|---|---|---|
| 1 | Root page | 39 | [src/app/page.tsx](../src/app/page.tsx) |
| 2 | Hero | 153 | [src/components/barbershop/HeroSection.tsx](../src/components/barbershop/HeroSection.tsx) |
| 3 | Servicios | 182 | [src/components/barbershop/ServicesSection.tsx](../src/components/barbershop/ServicesSection.tsx) |
| 4 | Equipo | 158 | [src/components/barbershop/TeamSection.tsx](../src/components/barbershop/TeamSection.tsx) |
| 5 | Booking Dialog | 414 | [src/components/barbershop/BookingDialog.tsx](../src/components/barbershop/BookingDialog.tsx) |

### 2.1 `page.tsx` (completo)

```tsx
'use client';

import { useState } from 'react';
import Navbar from '@/components/barbershop/Navbar';
import HeroSection from '@/components/barbershop/HeroSection';
import ServicesSection from '@/components/barbershop/ServicesSection';
import GallerySection from '@/components/barbershop/GallerySection';
import TeamSection from '@/components/barbershop/TeamSection';
import TestimonialsSection from '@/components/barbershop/TestimonialsSection';
import ContactSection from '@/components/barbershop/ContactSection';
import Footer from '@/components/barbershop/Footer';
import FloatingWhatsApp from '@/components/barbershop/FloatingWhatsApp';
import FloatingBookButton from '@/components/barbershop/FloatingBookButton';
import BookingDialog from '@/components/barbershop/BookingDialog';

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  return (
    <>
      <Navbar onBook={openBooking} />
      <main>
        <HeroSection onBook={openBooking} />
        <ServicesSection onBook={openBooking} />
        <GallerySection />
        <TeamSection onBook={openBooking} />
        <TestimonialsSection />
        <ContactSection onBook={openBooking} />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <FloatingBookButton onBook={openBooking} />
      <BookingDialog open={bookingOpen} onClose={closeBooking} />
    </>
  );
}
```

**Patrón**: un único estado `bookingOpen` en la raíz; todos los CTAs (hero, servicios, team, contacto, nav, botón flotante) reciben `onBook` y abren el mismo `BookingDialog`. Ningún componente mantiene estado propio del modal.

### 2.2 `HeroSection.tsx`, `ServicesSection.tsx`, `TeamSection.tsx`, `BookingDialog.tsx`

Por tamaño (907 LOC juntas) se referencian directamente en los archivos. Resumen estructural:

- **Hero** ([HeroSection.tsx:33-151](../src/components/barbershop/HeroSection.tsx#L33-L151)): constante `HERO_OPTIONS` con 4 URLs Unsplash (`closeup`, `craftsman`, `interior`, `editorial`), actualmente fija en `craftsman`. Capas: `<img>` full-cover → multiply tint → 2 gradientes radiales → vignette. Contenido centrado con `animate-in fade-in slide-in-from-bottom` escalonados.
- **Services** ([ServicesSection.tsx:60-72](../src/components/barbershop/ServicesSection.tsx#L60-L72)): `useEffect` → `fetch('/api/services?active=true')`; si array vacío usa `defaultServices` hard-coded. Cada card renderiza un `ServiceGlyph` (SVG heurístico por keyword del nombre: fade/corte, barba, ceja, tratamiento; fallback numeral en serif). Click `onBook` abre dialog.
- **Team** ([TeamSection.tsx:16-26](../src/components/barbershop/TeamSection.tsx#L16-L26)): idem, `fetch('/api/barbers?active=true')`. Si `b.photo` está vacío cae sobre 5 portraits Unsplash deterministas por índice ([TeamSection.tsx:38-45](../src/components/barbershop/TeamSection.tsx#L38-L45)).
- **BookingDialog** ([BookingDialog.tsx:23-414](../src/components/barbershop/BookingDialog.tsx#L23-L414)): maquina de estados local con `step: 1|2|3`, fetchs `services`/`barbers`/`barbershop` en `useEffect` al abrir; `fetchAvailability` se dispara al elegir fecha; `handleSubmit` hace `POST /api/appointments`. Maneja 409 revalidando disponibilidad.

---

## 3. Flujo de booking (paso a paso con endpoints y payloads reales)

Flujo disparado al hacer click en cualquier CTA "Agendar".

### 3.1 Click en "Agendar"

`onBook` → `setBookingOpen(true)` en [page.tsx](../src/app/page.tsx). El dialog se monta con `open=true`.

### 3.2 Pre-carga de catálogos (on-open)

```ts
// BookingDialog.tsx:44-49
useEffect(() => {
  if (!open) return;
  fetch('/api/services?active=true').then(...).then(setServices);
  fetch('/api/barbers?active=true').then(...).then(setBarbers);
  fetch('/api/barbershop').then(...).then(setShop);
}, [open]);
```

**Request 1** — `GET /api/services?active=true`
**Respuesta real (snapshot de la DB hoy)**:

```json
[
  {"id":"cmo7ephh30001a13wbmz1qmct","name":"Corte Clásico","description":"Corte tradicional a tijera y máquina.","price":180,"duration":30,"active":true,"order":1,...},
  {"id":"cmo7ephh30002a13w86d3mgzq","name":"Corte + Barba","description":"Corte completo con perfilado y diseño de barba.","price":280,"duration":45,"active":true,"order":2,...},
  {"id":"cmo7ephh30003a13ww6scveqc","name":"Afeitado Premium","description":"Afeitado con toalla caliente y aceites.","price":220,"duration":30,"active":true,"order":3,...}
]
```

**Request 2** — `GET /api/barbers?active=true`
**Respuesta real**:

```json
[
  {"id":"cmo7ephh60004a13w5wupetfy","name":"Carlos Ramírez","specialty":"Cortes clásicos y fades","photo":"","active":true,"order":1,...},
  {"id":"cmo7ephh60005a13wbxjwz68t","name":"Luis Hernández","specialty":"Diseño de barba y afeitado","photo":"","active":true,"order":2,...},
  {"id":"cmo820wj10000a1jer7pmmbcx","name":"Alejandro Santos","specialty":"Corte Caballero","photo":"","active":true,"order":3,...}
]
```

**Request 3** — `GET /api/barbershop` — trae `whatsapp`, `scheduleJson`, socials. Necesario para el link post-confirmación.

### 3.3 Step 1 — usuario elige servicio y barbero

Sólo `setState` local. No hay request. Click en `Continuar` → `setStep(2)`.

### 3.4 Step 2 — fecha + slots

Al cambiar el input `date` se dispara `fetchAvailability(date)`:

**Request 4** — `GET /api/availability?date=2026-04-23&duration=30&barberId=<id>`
**Respuesta real**:

```json
{
  "slots": ["10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30"],
  "dayClosed": false
}
```

Lógica en servidor ([src/app/api/availability/route.ts](../src/app/api/availability/route.ts)):
1. Lee `scheduleJson` de la barbershop para el día de semana.
2. Si el día no está abierto → `{slots:[], dayClosed:true}`.
3. Genera slots en pasos de `duration` min dentro de `[start, end)`.
4. Descarta slots ya reservados (status in `["confirmed","pending","rescheduled"]`).
5. Si la fecha es hoy descarta slots pasados (hora actual del servidor).

### 3.5 Step 3 — cliente confirma

Click en `Confirmar Cita` → `handleSubmit`:

**Request 5** — `POST /api/appointments`
**Payload enviado**:

```json
{
  "clientName": "Hugo Sanchez",
  "clientPhone": "9933182859",
  "clientEmail": "",
  "serviceId": "cmo7ephh30001a13wbmz1qmct",
  "barberId": "cmo7ephh60005a13wbxjwz68t",
  "date": "2026-04-22",
  "time": "12:00",
  "notes": "Hola "
}
```

Lógica en servidor ([src/app/api/appointments/route.ts](../src/app/api/appointments/route.ts)):
1. Valida campos obligatorios (falta uno → `400`).
2. Verifica que `service` y `barber` existan (falta uno → `404`).
3. Busca conflicto `{barberId, date, time, status in ["pending","confirmed","rescheduled"]}`. Si existe → `409` con mensaje en español.
4. Upsert de `Client` por `phone` único.
5. Crea `Appointment` con `status: "confirmed"`, `source: "web"`, `confirmedAt: now()`, `totalPrice: service.price`.
6. Devuelve 201 con el appointment incluyendo `service` y `barber`.

**Respuesta real (201 Created, cita existente en DB)**:

```json
{
  "id": "cmo800ija0002a1ah2paozcz2",
  "clientId": "cmo800iif0000a1ahovv18ws3",
  "clientName": "Hugo Sanchez",
  "clientPhone": "9933182859",
  "clientEmail": "",
  "serviceId": "cmo7ephh30001a13wbmz1qmct",
  "barberId": "cmo7ephh60005a13wbxjwz68t",
  "date": "2026-04-22",
  "time": "12:00",
  "status": "confirmed",
  "source": "web",
  "totalPrice": 180,
  "notes": "Hola ",
  "internalNotes": "",
  "confirmedAt": "2026-04-21T02:22:19.600Z",
  "cancelledAt": null,
  "completedAt": null,
  "createdAt": "2026-04-21T02:22:19.604Z",
  "updatedAt": "2026-04-21T02:22:19.604Z",
  "service": {"id":"cmo7ephh30001a13wbmz1qmct","name":"Corte Clásico","price":180,"duration":30,...},
  "barber":  {"id":"cmo7ephh60005a13wbxjwz68t","name":"Luis Hernández","specialty":"Diseño de barba y afeitado",...}
}
```

### 3.6 Post-confirmación

Al éxito, el dialog muestra pantalla "Cita Confirmada ✓". Si `shop.whatsapp` existe, **abre automáticamente una nueva pestaña** con `wa.me/<num>?text=<mensaje formateado>` vía `window.open(link, '_blank')`. No hay email, no hay SMS.

### 3.7 Datos persistidos

- Tabla `Appointment`: 15 columnas (ver modelo Prisma §4).
- Tabla `Client`: upsert por `phone` único. Si el cliente existía se actualiza `name` y `email` (podría pisar datos buenos con vacíos — ver §7).
- Stats (`/api/stats`) y admin (`/api/appointments`) los muestran en tiempo real.

---

## 4. Modelo de datos (Prisma)

Esquema completo: [prisma/schema.prisma](../prisma/schema.prisma). Modelos relevantes:

```prisma
model Service {
  id           String        @id @default(cuid())
  name         String
  description  String        @default("")
  price        Float
  duration     Int           @default(30)
  active       Boolean       @default(true)
  order        Int           @default(0)
  appointments Appointment[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Barber {
  id           String        @id @default(cuid())
  name         String
  specialty    String        @default("")
  photo        String        @default("")
  active       Boolean       @default(true)
  order        Int           @default(0)
  appointments Appointment[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Appointment {
  id            String    @id @default(cuid())
  clientId      String?
  clientName    String
  clientPhone   String
  clientEmail   String    @default("")
  serviceId     String
  barberId      String
  date          String      // ISO "YYYY-MM-DD" (no DateTime)
  time          String      // "HH:MM" 24h
  status        String    @default("pending")
  source        String    @default("web")
  totalPrice    Float     @default(0)
  notes         String    @default("")
  internalNotes String    @default("")
  confirmedAt   DateTime?
  cancelledAt   DateTime?
  completedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  service       Service   @relation(fields: [serviceId], references: [id])
  barber        Barber    @relation(fields: [barberId], references: [id])
  client        Client?   @relation(fields: [clientId], references: [id])

  @@index([date])
  @@index([status])
  @@index([barberId])
}

model Client {
  id           String        @id @default(cuid())
  name         String
  phone        String        @unique
  email        String        @default("")
  notes        String        @default("")
  appointments Appointment[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}
```

### Observaciones del modelo

- `Appointment.date` es **String**, no DateTime. Esto simplifica comparaciones ISO-string pero impide queries por rango con aritmética temporal nativa — hay que construir strings.
- `Appointment.time` también String `"HH:MM"`. Mismo tradeoff.
- `Appointment.clientName` / `clientPhone` están duplicados respecto a `Client`. Es snapshot defensivo (si se renombra el cliente, la cita original conserva el nombre con el que se reservó). Pero no hay constraint de consistencia.
- `Appointment.status` es un `String` libre con validación en aplicación (`src/lib/appointment-status.ts`). No hay `enum` Prisma — SQLite no soporta enums nativos. Posibles valores: `pending | confirmed | rescheduled | cancelled | completed | no_show`.
- Sin modelo de usuario/auth. `/admin/*` es **público**.
- Las rutas de `POST/PATCH/PUT/DELETE` no tienen autenticación (ver §7).

---

## 5. Estado funcional

### HOME (`/`)
- ✅ Carga correctamente (200 OK en servidor, HTML SSR con referencias Unsplash).
- ✅ Sin errores visuales fatales.
- ⚠️ `⚠ Fast Refresh had to perform a full reload due to a runtime error` aparece en `dev.log` después de ediciones frecuentes, pero desaparece tras recarga dura.
- ⚠️ El indicador "N" de Next.js dev **se superpone** al FloatingBookButton en la esquina inferior izquierda (desktop). En producción no aparece.

### BOOKING
- ✅ El modal abre desde los 5 disparadores (Nav, Hero, cards de servicio, cards de barbero, Contact, FloatingBookButton).
- ✅ Permite completar flujo end-to-end (servicio → barbero → fecha → hora → datos → confirmar).
- ✅ Confirma cita: genera 201 en `/api/appointments`, persiste en DB (verificado con 3 citas reales ya en la tabla), actualiza panel admin, abre WhatsApp si hay número configurado.
- ✅ Bloqueo de conflicto: si se intenta reservar un slot ocupado → 409 "Ese horario ya no está disponible" y vuelve al step 2.

### ADMIN
- ✅ Dashboard (`/admin/dashboard`) funcional: 4 KPI cards + 2 paneles. Muestra stats calculados en `/api/stats`.
- ✅ Citas (`/admin/appointments`) usable: tabla con 3 citas reales, filtros por estado y fecha, drawer de detalle, acciones (confirmar, completar, cancelar, reagendar, no asistió).
- ✅ CRUD funciona en **barberos, servicios, clientes**. Verificado con requests reales (tabla muestra 3 barberos y 3 servicios activos, 1 cliente con 1 cita).
- ✅ Configuración (`/admin/settings`) — guardar/cargar `barbershop` + horario semanal.
- ❌ **Sin autenticación.** Cualquiera con la URL puede entrar y modificar (ver §7).

---

## 6. UX actual — descripción neutra

### Hero
- Fotografía oscura de un barbero trabajando con tratamiento cálido domina la pantalla completa (≈900px vertical).
- Tipografía serif enorme mezcla de recta y itálica con gradiente oro. Mensaje aspiracional, no transaccional.
- Dos CTAs jerarquizados: dorado sólido (primario) y outline (secundario). Un tercer micro-CTA como "HORARIOS DISPONIBLES HOY" con punto verde pulsante.
- Stats de prueba social (`5+ / 3K+ / 4.9★`) debajo separadas por línea fina.
- **Transmite**: barbería premium, oficio tradicional, atmósfera de estudio masculino, aspiración de lujo accesible.

### Servicios
- 3 cards idénticas en tamaño y estructura. Jerarquía: nombre serif grande → descripción gris → precio serif oro dominante → duración pill secundario → CTA outline `Reservar este servicio →`.
- Ornamentos: numeral `01 · SERVICIO` y un SVG decorativo top-right (heurística por nombre del servicio).
- Percepción: **premium**, no genérico. La ausencia de fotografías del servicio en la card mantiene simplicidad editorial, pero pierde impacto emocional vs competidores con foto por servicio.

### Equipo
- 3 retratos verticales con foto real. Diseño editorial tipo "elenco" o "staff picks".
- Información sobre la foto con gradient de legibilidad.
- Footer con 5 estrellas y CTA "Reservar →" que reserva **sin preseleccionar ese barbero** (ver §7).
- Percepción: **premium** y con personalidad, pero las especialidades actuales son cortas y los ratings/estrellas están hard-codeados a 5.0 sin fuente real.

### Booking
- Modal de 3 pasos con progress bar ámbar. Navegación clara: 1 servicio+barbero / 2 fecha+hora / 3 datos+confirmar.
- Textos instructivos simples en español. Validación inline (botón disabled hasta cumplir requisitos).
- **Percepción**: flujo **claro**, lineal, sin sorpresas. Baja fricción. El único momento incómodo es que en el paso 1 hay que elegir **primero servicio y luego barbero**; no permite "cualquier barbero".

### Admin
- Layout clásico sidebar + contenido. Cards de KPI cromáticas (amber/rose/blue/emerald) sobre fondo oscuro.
- Tablas densas con filtros chip y drawer de detalle.
- **Percepción**: **funcional** y coherente con la landing, pero no premium — es utilitario. Cumple para operar pero no venderá el producto por sí solo.

---

## 7. Problemas detectados

### 7.1 Seguridad / producción

| # | Severidad | Problema | Evidencia |
|---|---|---|---|
| S1 | 🔴 Alta | **Admin sin autenticación**. Cualquiera accediendo a `/admin/*` puede crear/editar/eliminar barberos, servicios, clientes, citas. | [src/app/admin/layout.tsx](../src/app/admin/layout.tsx) no tiene guard, los `route.ts` bajo `/api/*` tampoco. |
| S2 | 🔴 Alta | **Endpoints de mutación públicos**. `POST/PUT/PATCH/DELETE` en `/api/appointments`, `/api/barbers`, `/api/services`, `/api/clients`, `/api/barbershop` no piden token ni sesión. | Todos los handlers inician con `await request.json()` sin verificar autorización. |
| S3 | 🟡 Media | **Client upsert puede pisar datos**: en `POST /api/appointments` se hace `client.upsert({ update: { name: body.clientName, email: body.clientEmail \|\| undefined } })` — si el cliente ya tenía email guardado y el nuevo body lo trae vacío, con la actual lógica `\|\| undefined` lo preserva, pero `name` sí se sobrescribe incondicionalmente. Un cliente existente con nombre "Luis Alberto García" reservando con "Luis" queda renombrado silenciosamente. | [src/app/api/appointments/route.ts:60-68](../src/app/api/appointments/route.ts#L60-L68) |
| S4 | 🟡 Media | **No hay rate limiting ni captcha** en booking público. Un bot puede inundar la agenda con citas fake. | Ningún middleware activo. |

### 7.2 UX / Conversión

| # | Problema | Evidencia |
|---|---|---|
| U1 | En el paso 1 del booking **no existe opción "cualquier barbero disponible"**. Obliga a elegir aunque al cliente le sea indiferente. Fricción evitable. | [BookingDialog.tsx:240](../src/components/barbershop/BookingDialog.tsx#L240) exige `selectedService && selectedBarber`. |
| U2 | Las **CTAs "Reservar con él →"** de cada barbero NO preseleccionan ese barbero en el dialog (no se pasa el `barberId` al abrir). | [TeamSection.tsx:128-130](../src/components/barbershop/TeamSection.tsx#L128-L130) sólo llama `onBook()`. |
| U3 | Las **CTAs de cards de servicio** tampoco preseleccionan el servicio elegido. | [ServicesSection.tsx:155](../src/components/barbershop/ServicesSection.tsx#L155). |
| U4 | **Stats del hero hard-coded** (`5+`, `3K+`, `4.9★`). Riesgo reputacional si los números son falsos en producción. | [HeroSection.tsx:128-132](../src/components/barbershop/HeroSection.tsx#L128-L132). |
| U5 | **Ratings de barberos hard-coded a 5.0**. No vienen de datos reales. | [TeamSection.tsx:108-119](../src/components/barbershop/TeamSection.tsx#L108-L119). |
| U6 | **Testimonios tienen nombres completos sin consentimiento explícito**. Los default-seed son ficticios, pero si cargan testimonios reales desde admin el flujo no pide aceptación GDPR/LFPDPPP. | [TestimonialsSection.tsx](../src/components/barbershop/TestimonialsSection.tsx). |
| U7 | El modal de booking **no envía confirmación por email** ni SMS; sólo abre WhatsApp del negocio (no del cliente). El cliente no recibe comprobante. | [BookingDialog.tsx:109-123](../src/components/barbershop/BookingDialog.tsx#L109-L123). |
| U8 | **No hay validación de formato** de teléfono/email del cliente en el step 3. Acepta cualquier cosa. | [BookingDialog.tsx:357-376](../src/components/barbershop/BookingDialog.tsx#L357-L376). |
| U9 | El botón **"Confirmar Cita"** está en verde, rompiendo la paleta ámbar premium establecida en todo el resto del sitio. Disonancia visual. | [BookingDialog.tsx:393](../src/components/barbershop/BookingDialog.tsx#L393). |
| U10 | **No hay estado de éxito con CTAs posteriores**. La pantalla "Cita Confirmada" sólo tiene "Cerrar" — no sugiere agregar al calendario, compartir, ni una acción de upsell. | [BookingDialog.tsx:180-192](../src/components/barbershop/BookingDialog.tsx#L180-L192). |

### 7.3 Lógica / datos

| # | Problema | Evidencia |
|---|---|---|
| L1 | **Race condition en conflicto de horario**. La verificación `findFirst` y la `create` no están en transacción — dos requests concurrentes pueden pasar ambos el check y crear dos citas en el mismo slot. | [src/app/api/appointments/route.ts:44-87](../src/app/api/appointments/route.ts#L44-L87). |
| L2 | **`totalPrice` se congela al precio del servicio al momento de crear la cita**, pero si se edita la cita después (reagendar, cambiar servicio) no se recalcula. El admin puede terminar con citas con precios inconsistentes. | [src/app/api/appointments/[id]/route.ts:26-47](../src/app/api/appointments/[id]/route.ts#L26-L47). |
| L3 | **Disponibilidad no considera duración del servicio al bloquear**. Si un slot se reserva para un servicio de 45 min a las 12:00, los slots de 12:30 siguen apareciendo libres (porque el check es igualdad exacta de `time`). Solapamiento real posible. | [src/app/api/availability/route.ts:61-79](../src/app/api/availability/route.ts#L61-L79). |
| L4 | **El seed crea 3 barberos** pero la DB actual ya tenía 2 seedeados + 1 creado por UI. `prisma db push` y `db:reset` divergerán del código por culpa del `count === 0` guard. | [prisma/seed.mjs:46-65](../prisma/seed.mjs#L46-L65). |
| L5 | **`GET /api/testimonials` probablemente responde 200 con `[]`** porque no hay seed de testimonios y el admin tampoco los edita aún — el componente cae a `defaultTestimonials` del código. Validación: no se han creado desde admin (no hay UI). | No hay página `/admin/testimonials`, solo seed opcional y el handler. |
| L6 | **Galería 100% hard-codeada en código**, no en DB. El admin no puede subir fotos aunque Prisma tiene un modelo `Gallery`. | [src/lib/gallery-config.ts](../src/lib/gallery-config.ts) vs. `prisma/schema.prisma:Gallery`. |

### 7.4 Visuales

| # | Problema | Evidencia |
|---|---|---|
| V1 | **Indicador "N" de Next.js dev overlaps** con el FloatingBookButton (bottom-left). Solo dev. | [screenshots/02-services.png](screenshots/02-services.png). |
| V2 | El hero llena toda la pantalla pero en laptops de 13" (900px) **las stats quedan debajo del fold** — reducen el signal de prueba social above the fold. | [screenshots/01-home-hero.png](screenshots/01-home-hero.png). |
| V3 | El **footer en mobile tiene padding extra `pb-28`** para evitar la barra flotante, pero en desktop queda un gap visual innecesario de 112px. | [Footer.tsx:6](../src/components/barbershop/Footer.tsx#L6). |
| V4 | **Servicios sin fotografía**. El mandato inicial pedía "imágenes de detalle"; actualmente son cards con ornamentos SVG, no imágenes reales. Decisión editorial válida, pero incumple el brief original. | [ServicesSection.tsx](../src/components/barbershop/ServicesSection.tsx). |
| V5 | La foto del Hero **está zoomeada al 105%** (`scale-105`) para ganar drama, pero en viewports muy anchos (>1920px) esto empieza a mostrar compresión JPEG. | [HeroSection.tsx:44](../src/components/barbershop/HeroSection.tsx#L44). |
| V6 | El **scroll indicator del hero** (texto "Scroll" + arrow) aparece en español/inglés mezclado con la UI en español — inconsistencia micro. | [HeroSection.tsx:144](../src/components/barbershop/HeroSection.tsx#L144). |

---

## 8. Resumen ejecutivo

| Capa | Estado | Nota |
|---|---|---|
| Landing pública | ✅ Funcional · 🎨 Premium | Lista para demo; falta autenticación antes de producción. |
| Flujo de booking | ✅ Funcional end-to-end | Crea citas reales, maneja conflictos, notifica vía WhatsApp. |
| Admin panel | ✅ Funcional sin auth | CRUD completo pero público — riesgo crítico. |
| Modelo de datos | ✅ Sólido | SQLite + Prisma; índices en los campos correctos. |
| Autenticación | ❌ Inexistente | Bloqueador para producción. |
| Notificaciones al cliente | ❌ No hay | Sólo abre WhatsApp del negocio, no envía confirmación al cliente. |
| Lógica de disponibilidad | ⚠️ Parcial | No considera duración del servicio al bloquear slots. |

**Prioridades recomendadas para cerrar antes de vender:**

1. **Auth** en `/admin/*` y en todos los `POST/PUT/PATCH/DELETE` (NextAuth credentials o simple JWT).
2. **Confirmación al cliente** (email con Resend/Postmark, o WhatsApp vía Twilio/Meta API).
3. **Fix de disponibilidad por duración** (bloquear rango `[time, time+duration)`).
4. **Transacción atómica** en creación de appointment (findFirst + create dentro de `db.$transaction`).
5. **Preselección** de servicio y barbero al hacer click desde las cards.
