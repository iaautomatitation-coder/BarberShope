# Deploy BarberRoyal a Firebase App Hosting

## Pre-requisitos (una sola vez)

1. **Proyecto Firebase**: `barbershope-1c6a7` (display name: **BarberShope**).
   Consola: https://console.firebase.google.com/u/0/project/barbershope-1c6a7/overview
2. **Firebase CLI** (ya instalado): `firebase 15.15.0`.
3. **Repo git + remoto** (GitHub o GitLab). App Hosting hace CI/CD por push.
4. **Turso DB ya poblada** ✅ (3 services, 3 barbers, 2 testimonials).

---

## Paso 1 — Conectar la cuenta Firebase correcta

El proyecto `barbershope-1c6a7` está bajo una cuenta Google distinta a `iaautomatitation@gmail.com`
(esa cuenta no lo ve en `firebase projects:list`). Dos opciones:

### Opción A — agregar la cuenta dueña al CLI (recomendado)

```bash
firebase login:add
# Se abre el navegador → logueate con la cuenta dueña de barbershope-1c6a7
firebase login:use <email-de-esa-cuenta>
firebase projects:list | grep barbershope-1c6a7   # confirma que aparece
```

### Opción B — invitar `iaautomatitation@gmail.com` al proyecto

Desde la cuenta dueña, en la consola Firebase:
`Project settings → Users and permissions → Add member` → agrega
`iaautomatitation@gmail.com` como **Owner** o **Editor**.

Luego en terminal:
```bash
firebase login --reauth
firebase projects:list | grep barbershope-1c6a7
```

### Seleccionar el proyecto

```bash
cd ~/BarberRoyal-demo
firebase use barbershope-1c6a7
```

El `.firebaserc` (ya creado con ese ID) será reemplazado si ya existe.

---

## Paso 2 — Subir código a git remoto

App Hosting requiere repo en GitHub/GitLab para hacer rollouts automáticos.

```bash
cd ~/BarberRoyal-demo

# Init git (el .git original se corrompió en el caos de Google Drive)
rm -rf .git
git init -b main
git add .
git commit -m "BarberRoyal demo — Obsidian theme + Turso"

# Crea un repo nuevo en GitHub (https://github.com/new) — ej. `barberroyal-demo` privado.
# Luego:
git remote add origin git@github.com:<tu-user>/barberroyal-demo.git
git push -u origin main
```

> `.env` está en `.gitignore` — no subas secrets al repo. Los secrets viven en Google Secret Manager (paso 4).

---

## Paso 3 — Crear backend de App Hosting

Desde el dir del proyecto:

```bash
firebase apphosting:backends:create
```

Te preguntará:
- **Region** → elige `us-central1` o la que prefieras.
- **GitHub/GitLab repo** → selecciona el que acabas de crear.
- **Branch** → `main`.
- **Root directory** → `/` (el `apphosting.yaml` ya está en root).
- **Backend name** → `barberroyal-demo` (o el que quieras).

Al completar, te da una URL tipo `https://barberroyal-demo--barbershope-1c6a7.us-central1.hosted.app`.

---

## Paso 4 — Configurar secrets en Secret Manager

```bash
# Token de Turso (JWT)
firebase apphosting:secrets:set TURSO_AUTH_TOKEN
# Pega: eyJhbGciOiJFZERTQSI... (el de tu .env actual)

# Password para Basic Auth
firebase apphosting:secrets:set DEMO_PASS
# Pega: demo-2026 (o algo más fuerte para producción)
```

Firebase almacena cifrado en Google Secret Manager y expone al build/runtime según `apphosting.yaml`.

### Conceder acceso al service account del backend

Al crear cada secret, el CLI pregunta si quieres dar acceso al backend. Responde **yes** ambas veces.

Si ya existían y olvidaste darle permiso:

```bash
firebase apphosting:secrets:grantaccess TURSO_AUTH_TOKEN --backend barberroyal-demo
firebase apphosting:secrets:grantaccess DEMO_PASS --backend barberroyal-demo
```

---

## Paso 5 — Disparar primer rollout

### Opción A — push a la rama configurada (automático)

Si hiciste push en paso 2, App Hosting ya empezó un rollout. Vé el progreso:

```bash
firebase apphosting:rollouts:list barberroyal-demo
```

### Opción B — forzar rollout manual desde el HEAD actual

```bash
firebase apphosting:rollouts:create barberroyal-demo
```

El build tarda 3-6 min. Cuando termine, la URL pública ya sirve.

---

## Variables de entorno — lista exacta

| Variable | Tipo | Scope | Valor |
|---|---|---|---|
| `TURSO_DATABASE_URL` | plain | BUILD + RUNTIME | `libsql://barbershope-iaautomatitation-coder.aws-us-east-1.turso.io` |
| `TURSO_AUTH_TOKEN` | **secret** | BUILD + RUNTIME | (Secret Manager — pega tu JWT) |
| `DEMO_USER` | plain | RUNTIME | `admin` |
| `DEMO_PASS` | **secret** | RUNTIME | (Secret Manager — tu password) |
| `DATABASE_URL` | plain | BUILD + RUNTIME | `file:/tmp/stub.db` (stub — Prisma lo necesita para inicializar aunque no se use) |
| `NEXT_PUBLIC_BRAND` | plain | BUILD + RUNTIME | `obsidian` |

> `DEMO_USER` **no** es secret: Basic Auth transmite ambos en cada request igual, y la protección real viene del password. Aun así, puedes moverlo a secret si prefieres ocultarlo de la consola.

---

## Checklist post-deploy (para validar la URL pública)

Sustituye `HOST` por tu URL (ej. `barberroyal-demo--barbershope-1c6a7.us-central1.hosted.app`).

```bash
HOST=barberroyal-demo--barbershope-1c6a7.us-central1.hosted.app

# 1. Landing responde
curl -s -o /dev/null -w "GET  /                           → %{http_code}\n" https://$HOST/

# 2. Admin pide auth
curl -s -o /dev/null -w "GET  /admin/dashboard (no auth)  → %{http_code}\n" https://$HOST/admin/dashboard

# 3. Admin responde con credenciales
curl -s -o /dev/null -w "GET  /admin/dashboard (auth)     → %{http_code}\n" -u admin:TU-PASS https://$HOST/admin/dashboard

# 4. APIs públicas responden
curl -s "https://$HOST/api/services?active=true" | jq '. | length'   # → 3
curl -s "https://$HOST/api/barbers?active=true"  | jq '. | length'   # → 3

# 5. Mutaciones protegidas
curl -s -o /dev/null -w "PUT  /api/barbers (no auth)      → %{http_code}\n" -X PUT https://$HOST/api/barbers -H "Content-Type: application/json" -d '{"id":"x"}'

# 6. Booking público funciona
curl -s -X POST https://$HOST/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Post-deploy Check","clientPhone":"5550000000","serviceId":"<SID>","barberId":"<BID>","date":"2026-05-01","time":"12:00"}' \
  | jq '.id, .clientName, .status'

# 7. La cita aparece en admin
curl -s -u admin:TU-PASS "https://$HOST/api/appointments" | jq '. | length'
```

Resultado esperado:
```
GET  /                           → 200
GET  /admin/dashboard (no auth)  → 401
GET  /admin/dashboard (auth)     → 200
3
3
PUT  /api/barbers (no auth)      → 401
"cmo8...", "Post-deploy Check", "confirmed"
6  (o el número que tengas)
```

### Verificación visual manual

1. Abre `https://$HOST/` en navegador privado (sin credenciales guardadas).
2. Confirma estética **Obsidian** (fondo negro, Bebas Neue grande, acentos cobre).
3. Click en cualquier "Reservar" → modal abre → completa el flujo → "Confirmar reserva".
4. Visita `https://$HOST/admin/dashboard` → navegador pide Basic Auth → entras con `admin` + tu password.
5. Ve la cita recién creada en `/admin/appointments`.

---

## Troubleshooting

| Síntoma | Causa probable | Fix |
|---|---|---|
| Build falla en "Turbopack: Can't resolve 'tw-animate-css'" | Turbopack no procesa CSS imports de node_modules correctamente | Ya resuelto — `build` usa `--webpack` en `package.json` |
| Runtime 500 con `URL 'undefined'` | Prisma inicializa sin `DATABASE_URL` | `apphosting.yaml` setea `DATABASE_URL=file:/tmp/stub.db` |
| Runtime 500 leyendo DB | Token de Turso faltante o sin acceso al SA | Re-corre `firebase apphosting:secrets:grantaccess` |
| Admin queda abierto (200 sin creds) | En el primer deploy el middleware pasa si env vars faltan | Verifica que `DEMO_USER` y `DEMO_PASS` estén expuestos al RUNTIME scope en `apphosting.yaml` |

---

## Operaciones

```bash
# Limpiar data de demo (borra citas + clientes en Turso)
cd ~/BarberRoyal-demo
source .env
npm run demo:reset

# Re-deploy después de un cambio
git add . && git commit -m "…" && git push   # (si usas CI con GitHub)
# o manualmente:
firebase apphosting:rollouts:create barberroyal-demo
```
