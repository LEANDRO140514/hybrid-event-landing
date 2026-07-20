# WORKSPACE_STATUS

- **Product:** The Hybrid Experience (renamed from "The Hybrid Event" in phase HEX-REBRAND-CATALOG, see below)
- **Workspace:** `hybrid-event-web`
- **Origin:** `C:\Users\vonde\Proyectos\orchids-hype-pwa-design`
- **Creation phase:** ENFORMA-EXTRACT-1A
- **Pruning phase:** ENFORMA-EXTRACT-1B
- **Stabilization phase:** ENFORMA-EXTRACT-1C (partial) / ENFORMA-EXTRACT-1C-FIX (completion)
- **Status:** READY_FOR_NEXT_PHASE (HEX-REBRAND-CATALOG closed — see "Phase HEX-REBRAND-CATALOG" section below for current state; the `ENFORMA-EXTRACT-1D-RECHECK` name below is historical and was superseded)
- **Creation date:** 2026-07-15
- **Pruning date:** 2026-07-15
- **Stabilization date (1C):** 2026-07-17
- **1C-FIX date:** 2026-07-18
- **Agent:** Claude Code
- **Initial HEAD (1C-FIX):** `82327df`
- **Source branch:** main
- **Source HEAD:** `a595e463ed671da8ee935de5109f654b067146f1`
- **Source HEAD short:** `a595e46`
- **Extraction method:** COPY_FULL_THEN_PRUNE
- **Current scope:** The Hybrid Event only — 7 public routes. No App, Shop, or Admin.
- **Pages preserved (7):** LandingPage, RegistroPage, PagoPage, ConfirmacionPage, SpectatorTicketPage, SpectatorConfirmPage, CorporateLandingPage
- **Pages removed (11):** DashboardPage, ProfilePage, TrainingPage, CommunityPage, EventPage, ShopPage, ProductDetailPage, CartPage, MerchCheckoutPage, MerchConfirmacionPage, AdminPage
- **Modules removed (4):** AppLayout, BottomTabNav, cartStore, productStore
- **Routes:** 7 public routes (`/`, `/registro`, `/pago`, `/confirmacion`, `/tickets`, `/tickets/confirmacion`, `/corporate`)
- **No `/app/*` routes:** ✅ Confirmed
- **Build:** PASSED (Vite 8.1.2, 839 modules, PWA generated, 12 precache entries)
- **Typecheck:** PASSED (TypeScript 6.0.2, 0 errors)
- **Lint:** PASSED (oxlint, 0 warnings)
- **Dependencies:** npm ci (427 packages, 0 vulnerabilities, lockfile hash stable)
- **MUI v9 fixes applied:** Removed `containedPrimary`/`filledPrimary`/`outlinedPrimary` style overrides (MUI v9 type incompatibility). Replaced `FormHelperTextProps` with `slotProps.formHelperText`. Added `DOMAINS` export to config.ts.
- **Deferred to Phase 1C:** eventConfig.ts, centralized naming, full theme restore, LandingPage decomposition, PWA icon recovery
- **Resolved in Phase 1C (2026-07-17):**
  - **PWA icons:** `PWA_ICONS_NOT_FOUND` — only `icon.svg` exists. Removed non-existent `icon-192.png` / `icon-512.png` references from `includeAssets`. PWA stabilized with SVG-only icon. Manifest valid, service worker generates correctly (12 precache entries). PWA remains installable.
  - **Centralized naming:** `package.json` name changed from `"the-hype-pwa"` → `"hybrid-event-web"`.
  - **Unused dependencies removed:** `zustand`, `dexie`, `recharts` (37 packages removed, 427 remain, 0 vulnerabilities).
  - **Theme:** Validated — MUI v9 compatible, brutalist dark theme intact.
  - **Routes:** 7 public routes validated — no `/app/*` routes, no residual imports to pruned modules.
  - **LandingPage decomposition:** Deferred — component is stable and self-contained. No blocking issues.
- **Resolved in Phase 1C-FIX (2026-07-18):**
  - **eventConfig.ts:** CREATED — `src/config/eventConfig.ts` with `name`, `shortName`, `slug`, `organizer`.
  - **Naming authority:** `src/config/eventConfig.ts` is now the single authority for canonical event identity in runtime code.
  - **Consumers migrated:** LandingPage (section header), CorporateLandingPage (product card title, footer), ConfirmacionPage (confirmation message), index.html (title, description, apple-mobile-web-app-title), vite.config.ts (manifest name, short_name, description, lang).
  - **PWA naming:** `name: 'The Hybrid Event'`, `short_name: 'Hybrid'`, `lang: 'es-MX'`.
  - **PWA icons:** SVG-only / `PWA_ICONS_NOT_FOUND` — MINOR, unchanged.
  - **Date conflict:** REQUIRES_DECISION — two dates detected (9-11 Octubre vs 17 Octubre). Neither selected as canonical.
  - **Theme color:** REQUIRES_DECISION — `#FF3D00` vs theme primary `#E6F2B1`.
- **Date conflict:** REQUIRES_DECISION — `9-11 OCTUBRE 2026` (LandingPage hero + CTA section) vs `17 Octubre` (SpectatorConfirmPage ticket). No authoritative source exists. Both preserved as-is in their respective editorial contexts.
- **Known issues (post-1C-FIX):** See ENFORMA-EXTRACT-1C-FIX-REPORT.md.
- **Next phase:** ENFORMA-EXTRACT-1D-RECHECK
- **Git:** No remote. Commit pending.
- **Future monorepo destination:** PENDING
- **Decisions applied:** D-01 (The Hybrid Event), D-02 (per-product themes), D-03 (public spectator tickets → /tickets), D-04 (Shop independent — removed from this workspace)

## Phase HEX-REBRAND-CATALOG (opened 2026-07-20)

- **Authorized by:** user, in-session, following ENFORMA-EXTRACT-1D-RECHECK resume. Supersedes the previously suggested `ENFORMA-EXTRACT-1D-RECHECK` phase name.
- **Scope:** Rebrand "The Hybrid Event" → "The Hybrid Experience" across the site; centralized product catalog (`src/data/catalogo.ts`, 28 products: 13 COMPITE, 7 EXPERIENCE, 8 ASISTE); rebuild COMPITE cards from the catalog; new EXPERIENCE section (½ Hybrid + Workout Experience); rebuild ASISTE section from the catalog; removal of the internal registration/payment flow (see below).
- **REQUIRES_DECISION resolved — event date:** `9, 10 y 11 de octubre de 2026` is canonical. The `17 Octubre` reference (`SpectatorConfirmPage.tsx`) is discarded; that page is removed in this phase (see below).
- **REQUIRES_DECISION resolved — theme color:** `#E6F2B1` (lima sobre negro) is the canonical Hybrid Experience theme color. `#FF3D00` was inherited from the prior "The Hype" stage and is removed from `vite.config.ts` PWA `theme_color`. Note: `CorporateLandingPage.tsx` (the separate `/corporate` ENFORMA multi-product hub) intentionally keeps its own orange/yellow gradient branding — out of scope for this decision.
- **Untracked reference material (authorized, not modified this phase):** `docs/guiones-origen/athlete.html` and `docs/guiones-origen/captain.html` — copied by the user on purpose as input for a future "guías públicas" phase. Not part of the build, not linked from the app, left untouched.
- **.gitignore:** added `.claude/launch.json` (local tooling config, not project-relevant).
- **Internal registration/payment flow removed:** `src/pages/RegistroPage.tsx`, `PagoPage.tsx`, `ConfirmacionPage.tsx`, `SpectatorTicketPage.tsx`, `SpectatorConfirmPage.tsx`, `src/api/checkout.ts`, and their routes in `routeTree.gen.ts` were deleted, along with `src/constants/categories.ts` (its only consumers were the deleted pages and the old COMPITE cards, both superseded by `src/data/catalogo.ts`). Also removed `public/docs/{index,athlete,captain}.html` — a static guide describing the deleted flow step-by-step (MercadoPago/Stripe instructions, old event name, `17 Octubre` date) — and the landing's "Ver Documentación Completa" CTA that linked to it, since it would otherwise become a dead/misleading link. Reason: this landing is marketing-only now — "sin formularios ni pagos" — every product button routes to `app.enforma.mx/inscribir?cat=CODIGO` (Ready2Hybrid, rebuilt in Next.js + InsForge + Mercado Pago). Code remains recoverable at checkpoint commit `b61846c` ("checkpoint: estado previo a eliminar flujo de registro/pago (se reconstruye en ready2hybrid)").
- **`public/r2r/` bundle:** resolved (see CLOSE section below) — removed entirely, was unused static weight from the prior stage.

### Sub-phase: descriptive content (opened same day)
- **Scope:** "¿Qué es el deporte híbrido?" intro (replaces the old generic About copy) with 3 entry-level links; new "TRES DÍAS" narrative timeline section (between Formatos and COMPITE) deep-linking into per-day/session COMPITE groups (`#compite-vie-pm`, `#compite-sab-am`, `#compite-sab-pm`, `#compite-dom-am`) and into `#experience`; per-format descriptions (`FORMATO_DESCRIPCIONES`) shown under each COMPITE group header and reused verbatim in the EXPERIENCE section's Workout/½ Hybrid copy; FAQ trimmed and replaced with the 6 purchase-decision questions plus 2 kept practical ones (cronometraje, estacionamiento) — dropped items now covered elsewhere (what-is / prior-experience / what-to-bring merged, category-change request dropped as non-decision-relevant).
- **Validation:** `tsc -b`, `oxlint` (0/0), `vite build` all pass; verified in a real browser (0 console errors) including expanding the new "¿Qué día compito?" table and clicking a TRES DÍAS deep link to confirm it lands on the right COMPITE group.

### CLOSE — Phase HEX-REBRAND-CATALOG (closed 2026-07-20)

- **Commits (in order):**
  1. `b61846c` — checkpoint: estado previo a eliminar flujo de registro/pago
  2. `a522bd9` — refactor: elimina flujo interno de registro/pago (se reconstruye en ready2hybrid)
  3. `06d09be` — feat: rebrand a Hybrid Experience + catalogo 28 productos + secciones COMPITE/EXPERIENCE/ASISTE (incluye la sub-fase de contenido descriptivo)
  4. `3754592` — chore: elimina dependencias no utilizadas (react-hook-form, @hookform/resolvers, zod)
  5. `e70e439` — chore: elimina bundle r2r no utilizado
  6. `5a8e1a7` — chore: limpia globIgnores('r2r/**') obsoleto tras eliminar public/r2r/
- **Validation at close:** `tsc -b` clean, `oxlint` 0/0, `vite build` clean (647 modules, 9 PWA precache entries), `npm install` after dependency removal reported 0 vulnerabilities. Working tree clean at close except the two authorized untracked reference files below.
- **Known issues:** (none)
- **Pending decisions:** (none) — both prior REQUIRES_DECISION items (event date, theme color) resolved above.
- **Left for a future phase, not authorized this phase:** the two `docs/guiones-origen/*.html` files remain untracked, staged as input for a future "guías públicas" phase.
- **Next Authorized Phase:** (none yet — awaiting instruction)

```
=== NEXT_SESSION_BOOTSTRAP ===
Workspace: C:\vonde\hybrid-event-landing
Product/System: The Hybrid Experience (hybrid-event-web)
Workspace Type: standalone-repo / external-development-workspace
Branch: main
HEAD: 5a8e1a7
Last Commits: 5a8e1a7 chore: limpia globIgnores('r2r/**') obsoleto tras eliminar public/r2r/ | e70e439 chore: elimina bundle r2r no utilizado | 3754592 chore: elimina dependencias no utilizadas (react-hook-form, @hookform/resolvers, zod)
Completed Phase: HEX-REBRAND-CATALOG
Gate: READY_FOR_INSTRUCTIONS
Known Issues: (none)
Pending Decisions: (none)
Protected Sources: (none)
Next Authorized Phase: (awaiting instruction)
Files To Read First: WORKSPACE_STATUS.md, src/data/catalogo.ts, src/pages/LandingPage.tsx
Forbidden Actions: push, modifying docs/guiones-origen/*.html
First Command: scripts/workspace-preflight.ps1
=== END_BOOTSTRAP ===
```
