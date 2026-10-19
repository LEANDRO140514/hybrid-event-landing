# AGENTS.md

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **ready2hybrid** (API base `https://4bg9ufz2.us-east.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->

## Reglas del proyecto Hybrid Experience (HEX-2026)

Evento: 13–15 nov 2026, Club Cumbres, Mérida. Producción backend: InsForge `4bg9ufz2`.
Origen legacy: proyecto InsForge `enforma` (hybrid-registro), solo lectura desde aquí.

### Qué copia sirve para qué (máquina "algorithmus", C:\Users\algor\dev\)

- Funciones de pago (`mp-*`, `openpay-*`, `send-ticket-email`) y migraciones: SOLO desde `ready2hybrid-prorroga` (main).
- Panel ops (PWA ops.enforma.mx y funciones `ops-*`, `legacy-sync`): SOLO desde `ready2hybrid-ops-sources`.
- Landing pública: SOLO desde `hybrid-event-landing`.
- Nunca desplegar funciones de pago desde `ready2hybrid-ops-sources` (va atrás de main y revierte precios).
- Las demás copias son históricas o experimentales; no despliegues desde ellas.

### Capa de pagos (máxima precaución)

- `webhook_apply_payment_tx` vive en la definición de 0038. No se reemplaza sin plan, diff contra la definición viva, rollback y pase explícito.
- 0046 (Openpay dual-provider) vive en `docs/openpay/`, nunca en una carpeta de migraciones hasta su ventana aprobada.
- Openpay está apagado para clientes (`OPENPAY_ENABLED` falso) hasta certificación.
- Cada redeploy de checkout exige prueba de humo: crear preferencia real sin pagar y confirmar `init_point`, precio vigente y `expiration_date_to`.
- Reenviar un boleto rota el QR y revoca el anterior: nunca reenviar boletos reales para "probar".
- Un número de operación aprobado = una inscripción. Deduplicar siempre por id de pago entre checkout y legacy.

### Reglas de negocio vigentes

- Preventa hasta 19 oct 23:59; regular desde 20 oct 00:00 (America/Merida).
- Venta en línea de competidores cierra el 13 nov 2026 a las 11:00 America/Merida.
- Desde el 13 nov 00:00: solo pago con tarjeta para todos los productos.
- Pases PUB-3D y PUB-DOM: cancelados (apagados en checkout). WOD y FOT no se venden.
- Competidores: presentarse en mesas al menos 3 h antes de su competencia y escribir al WhatsApp oficial 990 230 2378 (https://wa.me/529902302378) para su kit.
- Toda venta nueva entra por la landing. hybrid-registro solo para cortesías (staff, jueces, invitados) con monto $0.
- Legacy pagado con monto 0 = cortesía: cuenta como inscripción, no como venta.
- No hay reembolsos parciales. Devolución = total desde Mercado Pago + revocar boleto + egreso en Tesorería.

### Antes de publicar

- Build exactamente como el host (respetar `.vercelignore`; `insforge/` no se sube a Vercel; nada en `src/` importa de `insforge/`).
- Tests + typecheck + build. Fallos preexistentes conocidos: dos tests de "0004" y `ticket-pdf-image` (jspdf).
- Anotar el deployment actual para rollback y reportarlo.
- Sincronización legacy: siempre DRY-RUN con diff y conteos antes de aplicar.

### Seguridad

- Nunca leer, imprimir ni manejar secretos/llaves en scripts locales o logs. Si se necesitan, detenerse y pedirlos al humano.
- Tesorería: nada se borra; un movimiento pagado solo se cancela con motivo.

