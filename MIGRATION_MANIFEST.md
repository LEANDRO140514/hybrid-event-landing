# MIGRATION MANIFEST — HYBRID-DESIGN Redesign

> **⚠️ Historical migration reference.** This manifest documents the design phase migration from the Orchids sandbox (2026-07-15). It is NOT the current operational authority. Many files referenced here no longer exist in this workspace (removed during ENFORMA-EXTRACT-1B pruning). For current workspace status, see `WORKSPACE_STATUS.md`.
>
> **Origin:** `orchids-hype-pwa-design` (design sandbox)
> **Target:** Monorepo principal (team de desarrollo)
> **Generated:** 2026-07-15
> **Status:** MIGRATION_READY

---

## A) Archivos Modificados

### Páginas del ecosistema interno (post-registro)

| Archivo | Cambios aplicados | Riesgo |
|---------|------------------|--------|
| `src/pages/DashboardPage.tsx` | Rediseño completo: BRAND_FONT en headers, stats como consola, botones brutalistas, countdown con estilo, WOD card | Bajo |
| `src/pages/ProfilePage.tsx` | Rediseño completo: identidad de atleta, stats consola, badges, config | Bajo |
| `src/pages/EventPage.tsx` | Rediseño completo: credencial digital cyber/industrial, QR, info evento | Bajo |
| `src/pages/TrainingPage.tsx` | Rediseño completo: stats banner, feature modules, tipografía de marca | Bajo |
| `src/pages/CommunityPage.tsx` | Rediseño completo: stats banner, feature modules, tipografía de marca | Bajo |
| `src/pages/ShopPage.tsx` | Rediseño completo: grid brutalista, FAB cuadrado, tipografía de marca | Bajo |
| `src/pages/ProductDetailPage.tsx` | Rediseño completo: size selector cuadrado, botón brutalista, a11y | Bajo |
| `src/pages/CartPage.tsx` | Rediseño completo: receipt style, controles 44×44px, a11y labels | Bajo |
| `src/pages/MerchCheckoutPage.tsx` | Rediseño completo: receipt style checkout, tipografía monoespaciada | Bajo |
| `src/pages/MerchConfirmacionPage.tsx` | Rediseño completo: confirmación brutalista, QR receipt | Bajo |

### Páginas públicas / pre-registro

| Archivo | Cambios aplicados | Riesgo |
|---------|------------------|--------|
| `src/pages/LandingPage.tsx` | Countdown container bg: `#111111` + brand border (solo CSS) | Bajo |
| `src/pages/SpectatorTicketPage.tsx` | Touch targets 44×44px, aria-labels, color secundario `#B0B890` | Bajo |

### Componentes compartidos

| Archivo | Cambios aplicados | Riesgo |
|---------|------------------|--------|
| `src/components/BottomTabNav.tsx` | Estilo brutalista: bg `#111111`, borde brand, active color `#E6F2B1`, font monoespaciada | Bajo |

### Sistema de diseño (Theme)

| Archivo | Cambios aplicados | Riesgo |
|---------|------------------|--------|
| `src/theme.ts` | `text.secondary` cambiado de `#A0A880` a `#B0B890` (contraste mejorado) | **MEDIO** — Afecta todos los componentes que usan `color="text.secondary"` |

**Total: 14 archivos modificados (0 creados, 0 eliminados)**

---

## B) Assets

| Asset | Cambio | Notas |
|-------|--------|-------|
| `public/fonts/tt-norms-pro-extra-black-italic/tt-norms-pro-extra-black-italic.ttf` | Sin cambios (pre-existente) | La fuente brand ya estaba en el proyecto. No se agregaron nuevas fuentes. |
| `public/icons/icon.svg` | Sin cambios | Solo se usa como favicon/PWA icon. |
| `public/favicon.svg` | Sin cambios | — |
| `public/icons.svg` | Sin cambios | — |

**No se crearon ni reemplazaron assets durante el rediseño.**

---

## C) Advertencias Críticas

### ⚠️ 1. `src/theme.ts` — `text.secondary`

El color `text.secondary` cambió de `#A0A880` a `#B0B890`. Esto afecta **todos los componentes** que usan la referencia de tema `color="text.secondary"` o `sx={{ color: 'text.secondary' }}`. Verificar que no haya dependencias de diseño que esperen el tono exacto anterior.

### ⚠️ 2. `src/pages/SpectatorTicketPage.tsx` — Lógica de checkout comercial

Este archivo contiene la función `handleCheckout()` que llama a `API_CONFIG.edgeFunctionsUrl`. Al migrar:
- **NO sobreescribir la URL de la edge function** del monorepo original.
- Mantener `VITE_EDGE_FUNCTIONS_URL` apuntando al entorno correcto.

### ⚠️ 3. `src/pages/MerchCheckoutPage.tsx` — Lógica de pago con MercadoPago

Este archivo contiene la lógica de POST a la edge function `merch-checkout`. Al migrar:
- **NO sobreescribir** la configuración de `API_CONFIG.edgeFunctionsUrl` del monorepo.
- La lógica de `clearCart()` y redirección debe mantenerse intacta.

### ⚠️ 4. `src/pages/CartPage.tsx` — Dependencia de `cartStore`

El carrito depende de `useCartStore` (zustand + persist). Al migrar:
- **NO sobreescribir `src/store/cartStore.ts`** — no fue modificado en el rediseño.
- Verificar que la ruta de importación `../store/cartStore` sea correcta en el monorepo.

### ⚠️ 5. `src/pages/EventPage.tsx` — Sesión de atleta

Lee `localStorage.getItem('the-hype-session')`. Al migrar:
- **NO modificar la lógica de sesión** — solo se lee, no se escribe.
- El formato de la sesión (`AthleteSession`) debe coincidir con el monorepo.

### ⚠️ 6. `src/pages/ProductDetailPage.tsx` — Datos mock de productos

Los productos están hardcodeados en el objeto `PRODUCTS` dentro del archivo. Al migrar al monorepo:
- Reemplazar `PRODUCTS` con la fuente de datos real (API/DB).
- La estructura `{ productId, name, price, size }` en `addItem()` debe coincidir con `cartStore`.

---

## D) Archivos NO Modificados (Seguros)

| Archivo | Propósito | Verificado |
|---------|-----------|------------|
| `src/store/cartStore.ts` | Estado del carrito (zustand + persist) | ✅ Sin cambios |
| `src/constants/categories.ts` | Categorías del evento | ✅ Sin cambios |
| `src/config.ts` | Configuración de API y URLs | ✅ Sin cambios |
| `src/App.tsx` | Router y layout raíz | ✅ Sin cambios |
| `src/main.tsx` | Entry point | ✅ Sin cambios |
| `src/api/checkout.ts` | API de checkout | ✅ Sin cambios |
| `src/hooks/useCountdown.ts` | Hook de countdown | ✅ Sin cambios |
| `package.json` | Dependencias | ✅ Sin cambios |
| `vite.config.ts` | Configuración de Vite | ✅ Sin cambios |
| `index.html` | HTML raíz | ✅ Sin cambios |
| `.orchids/orchids.json` | Config de Orchids | ✅ Sin cambios |

---

## E) Resumen de Dependencias

```
dependencies (sin cambios):
  @emotion/react, @emotion/styled, @hookform/resolvers,
  @mui/icons-material, @mui/material, @tanstack/react-router,
  dexie, notistack, react, react-dom, react-hook-form,
  recharts, vite-plugin-pwa, zod, zustand

devDependencies (sin cambios):
  @types/node, @types/react, @types/react-dom,
  @vitejs/plugin-react, oxlint, typescript, vite
```

**No se instalaron dependencias externas no autorizadas durante el rediseño.**

---

## F) Instrucciones de Migración Sugeridas

1. **Copiar archivos página por página** (no en bulk) para evitar sobreescribir lógica de negocio.
2. **Priorizar:** theme.ts → BottomTabNav → páginas con menor riesgo (Training, Community, Shop) → páginas con store/session (Cart, Event, ProductDetail, Checkout).
3. **Verificar imports** de `cartStore`, `API_CONFIG`, `useCountdown` en el monorepo.
4. **Ejecutar build** después de cada 2-3 archivos copiados.
5. **Probar flujo completo:** registro → dashboard → evento → shop → cart → checkout → confirmación.