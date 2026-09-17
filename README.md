# hybrid-event-landing — Landing maestra de HYBRID EXPERIENCE

Landing original/maestra del evento. Vite + React + TanStack Router + MUI.

Sitio en vivo: **https://hybrid-experience.enforma.mx**

## Estado actual: pre-lanzamiento

`src/config/salesConfig.ts` → `SALES_CONFIG.status = 'coming_soon'`. Con ese
estado, todos los botones "Inscribirse" del landing se muestran deshabilitados
como **"Próximamente"** — nadie puede completar un registro en producción
todavía, independientemente de qué categorías estén visibles o no.

`ventasArrancadas` (mismo archivo) es un kill-switch aparte para el
pricing por etapas (`src/lib/pricingStage.ts`): en `false` por defecto, no se
resuelve ninguna etapa comercial activa hasta que se cambie a mano. Es
independiente de `status` — cambiar uno no cambia el otro.

## Relación con los otros repos

- **`hybrid-registro`** es un clon independiente de este repo (historial de
  git desvinculado), construido como landing de emergencia mientras
  **Ready2Hybrid** (el sistema definitivo) se termina de construir. Corre en
  paralelo, ya en producción, con registro abierto y su propia tabla en
  InsForge (`hybrid_registro_inscripciones`) y sus propios links de pago
  hardcodeados de Mercado Pago/Clip — ver su propio README.
- **Ready2Hybrid** es el sistema futuro que eventualmente reemplaza a ambos.
  Este repo (`hybrid-event-landing`) sigue siendo la base "maestra" de diseño:
  cambios de landing que aplican a ambos (como suspender una categoría) se
  replican aquí y en `hybrid-registro` por separado, no hay un monorepo
  compartido.

## Checkout: sandbox vs. producción

`src/config/checkoutConfig.ts` controla si el checkout real está activo:

| Variable | Uso |
|---|---|
| `VITE_CHECKOUT_MODE` | `off` \| `sandbox` \| `production` |
| `VITE_CHECKOUT_ENABLED` | `'true'` para habilitarlo |
| `VITE_INSFORGE_FUNCTIONS_BASE` | URL https del proyecto InsForge (funciones `mp-create-checkout`, `get-order-status`) |

- **Sandbox** solo se activa fuera del host canónico
  (`hybrid-experience.enforma.mx`) — es decir, nunca en producción.
- **Producción** solo se activa *en* el host canónico.
- `SANDBOX_CHECKOUT_PRODUCTS` (mismo archivo) es un **allowlist explícito por
  `productCode`** — si una categoría no está ahí, no tiene checkout aunque
  `SALES_CONFIG.status` fuera `'open'`. Editar ahí para agregar/quitar
  categorías del checkout (no cambia si se ve o no en el landing — eso es
  aparte, ver abajo).

## Dónde vive cada cosa

| Pieza | Dónde |
|---|---|
| Frontend | Este repo. Deploy: Vercel, proyecto `hybrid-event-landing` (team `enforma-c9d3af17`) |
| Backend / checkout | InsForge, proyecto **enforma** (`https://3e9sriq7.us-east.insforge.app`), funciones `mp-create-checkout` / `get-order-status` |
| Catálogo de productos | `src/data/catalogo.ts` |
| Qué categorías tienen checkout | `src/config/checkoutConfig.ts` (`SANDBOX_CHECKOUT_PRODUCTS`) |
| Qué categorías se ven en el landing | `src/pages/LandingPage.tsx` (arrays `*_PRODUCTS` por sección) |

Importante: **"visible en el landing" y "tiene checkout habilitado" son cosas
separadas.** Suspender una categoría del landing (quitar su card) no la quita
del allowlist de checkout ni del catálogo — solo deja de mostrarse. Ver
siguiente sección.

## Categorías suspendidas del landing (sin tocar catálogo/checkout)

**Workout Experience** y **Fotógrafo** están suspendidas del landing por
falta de interacciones (mismo criterio aplicado en `hybrid-registro`):

- Sin cards en las secciones EXPERIENCE/ASISTE.
- Sin fila en la tabla comparativa de precios (`TABLA_PRECIOS_GRUPOS`).
- Sin menciones sueltas en el resto del copy (hero, itinerario, FAQ, premios,
  metadatos SEO/JSON-LD).

Deliberadamente **no se tocó**: `catalogo.ts` (los productos siguen
existiendo), `checkoutConfig.ts` (`WOD-*`/`FOT-*` siguen en el allowlist de
checkout), ni `salesConfig.ts`/`pricingStage.ts`. Si se reactivan algún día,
es un cambio de landing puro — el backend ya está listo.

Para reactivarlas: revertir el commit correspondiente en `LandingPage.tsx`
(`feat(landing): suspend Workout and Fotógrafo, simplify floating CTA`) o
volver a agregar sus arrays de productos y bloques de JSX a mano.

## Bug conocido, preexistente (no relacionado con lo anterior)

La fila fusionada de categorías sin precio por etapa (antes: Workout y
Fotógrafo; ahora: solo Público) dentro de `TABLA_PRECIOS_GRUPOS` /
`FilaPrecioTabla` (sección "PRECIOS") **nunca se renderiza** — confirmado
comparando contra el código previo a la suspensión de categorías (vía `git
stash`) antes de tocar nada. El grupo `ASISTE` completo falta del DOM en esa
tabla comparativa; el resto del landing (incluidas las cards de Público más
abajo) funciona bien. Pendiente de diagnóstico — no es efecto de la
suspensión de Workout/Fotógrafo.

## Desarrollo

```bash
npm install
npm run dev       # servidor local, puerto 3000
npm run build     # tsc -b && vite build
npm run lint      # oxlint
```

### Variables de entorno (`.env`, no versionado)

```
VITE_INSFORGE_FUNCTIONS_BASE=https://3e9sriq7.us-east.insforge.app
VITE_CHECKOUT_MODE=sandbox        # off | sandbox | production
VITE_CHECKOUT_ENABLED=true
VITE_APP_DOMAIN=...
VITE_ADMIN_DOMAIN=...
VITE_CORPORATE_DOMAIN=...
VITE_EVENT_DOMAIN=...
VITE_REGISTRATION_DOMAIN=...
VITE_SHOP_DOMAIN=...
```

### Deploy

```bash
vercel --prod --scope enforma-c9d3af17
```

El dominio `hybrid-experience.enforma.mx` ya está enlazado al proyecto en
Vercel; el deploy a producción lo actualiza automáticamente. Si el directorio
local no está vinculado todavía: `vercel link --yes --scope enforma-c9d3af17
--project hybrid-event-landing`.
