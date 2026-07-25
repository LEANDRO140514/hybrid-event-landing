# WORKSPACE_STATUS

- **Product:** The Hybrid Experience (renamed from "The Hybrid Event" in phase HEX-REBRAND-CATALOG, see below)
- **Workspace:** `hybrid-event-landing` (renamed from `hybrid-event-web` — see "Phase RENAME-HYBRID-EVENT-LANDING" below)
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

## Phase COMPITE-CONTENT-FIXES (opened and closed 2026-07-20)

- **Authorized by:** user, in-session, following HEX-REBRAND-CATALOG close. Two small content corrections to the landing, requested directly (no formal PREFLIGHT — ad hoc text-only scope).
- **Scope:**
  1. Display-layer translation of session labels: `AM` → `Matutino`, `PM` → `Vespertino`, everywhere rendered to the user in the EXPERIENCE, COMPITE, and TRES DÍAS sections and the "¿Qué día compito?" FAQ table. The underlying `catalogo.ts` data values (`sesion: 'AM' | 'PM'`) were deliberately left untouched, since they drive the `#compite-{dia}-{am|pm}` deep-link anchor IDs (`groupProductos()` in `LandingPage.tsx`); a new `SESION_LABEL` display map was added instead so the anchors keep working. ASISTE was checked and has no session-time text to translate (Público/Fotógrafo product cards never render `sesion`).
  2. Per-person cost shown in parentheses on every Dobles and Relay (equipo) product card in COMPITE, matching the pattern `½ Hybrid Dobles` already used (`'por pareja ($800 c/u)'`): Dobles → `'por pareja ($1,200 c/u)'`, Relay → `'por equipo ($800 c/u)'`.
- **Files touched:** `src/pages/LandingPage.tsx` (added `SESION_LABEL` map; translated `DIA_COMPITO_ROWS`, `TRES_DIAS`, two hardcoded EXPERIENCE strings; COMPITE group heading now looks up `SESION_LABEL[group.sesion]`), `src/data/catalogo.ts` (`precioUnidad` updated on the 6 Dobles + 3 Relay entries only).
- **Validation:** `tsc -b` clean, `oxlint` 0/0, `vite build` clean (647 modules, 9 PWA precache entries) — run twice, once per fix. Verified in a real browser: page text extracted and confirmed Matutino/Vespertino render correctly in EXPERIENCE/COMPITE/TRES DÍAS/FAQ, and per-person costs render on all Dobles/Relay cards; confirmed the `#compite-*-am/pm` anchors still resolve (anchor IDs unchanged by design).
- **Commit:** `10eb66a` — "fix: traduce AM/PM a Matutino/Vespertino y añade costo por persona en cards de equipo" (both fixes in one commit, per user instruction). **Pushed** to `origin/main` (user explicitly authorized push for this repo earlier in the same session, when the GitHub remote was first created).
- **Known issues:** (none)
- **Pending decisions:** (none)
- **Left untouched, not in scope:** the two `docs/guiones-origen/*.html` files remain untracked, still reserved for a future "guías públicas" phase.
- **Next Authorized Phase:** (none yet — awaiting instruction)

## Outside-session activity (noted, not performed by an agent)

- **Workspace moved:** the user relocated the working copy from `C:\vonde\hybrid-event-landing` to `C:\vonde\enforma-sys\hybrid-event-landing`. Git history and remote (`origin` → `LEANDRO140514/hybrid-event-landing`) are unaffected by a plain folder move.
- **Commit `c36b8ce`** — "docs: preserve original landing scripts" (user, 2026-07-20 23:48 local, outside this session): tracked the two previously-untracked `docs/guiones-origen/{athlete,captain}.html` reference files into git. They remain unused by the app/build, per the original HEX-REBRAND-CATALOG note.

## Phase RENAME-HYBRID-EVENT-LANDING (opened and closed 2026-07-20)

- **Authorized by:** user, in-session, direct instruction: rename the project identifier from `hybrid-event-web` to `hybrid-event-landing` to match the folder name.
- **Scope:** `package.json` `"name"` field; `.claude/launch.json` dev-server config `"name"` (local tooling, gitignored); `package-lock.json` resynced via `npm install`. `WORKSPACE_STATUS.md` "Workspace" identity line updated to the new name; the historical HEX-REBRAND-CATALOG-1C note documenting the *earlier* rename (`the-hype-pwa` → `hybrid-event-web`) was left untouched since it accurately records a past fact.
- **Not renamed (out of scope, no user-facing or functional link to the internal npm package name):** GitHub repo name (`LEANDRO140514/hybrid-event-landing` already matches), PWA manifest `name`/`short_name` (already "The Hybrid Experience" / "Hybrid" — unrelated identifier), source folder names under `src/`.
- **Validation:** `npm install` completed clean (423 packages, up to date structurally, only the `name` field changed); `package-lock.json` confirmed to carry the new name at both `name` fields (root + lockfileVersion entry).
- **Known issues:** (none)
- **Pending decisions:** (none)
- **Next Authorized Phase:** (none yet — awaiting instruction)

## Phase HEX-LANDING-SALES-01 (opened and closed 2026-07-24)

- **Authorized by:** user, in-session, `READ_ONLY_ABSOLUTO`. Full commercial, visual, content and technical audit of the sales landing (hero, three access architecture question deferred to this phase's follow-up, 28-product catalog, CTA hierarchy, mobile UX, SEO gaps).
- **Output:** delivered inline in-session (18-section report) — not persisted as a repo file. Key findings that shaped `HEX-LAUNCH-01 REV B` below: fake sponsor names in the marquee (P0), placeholder Instagram/WhatsApp links (P0), no fallback for `app.enforma.mx` unavailability (P0), 100% Unsplash stock photography (P1), hero + floating CTA both hard-pointed at `#compite` only (P1), non-keyboard-accessible navbar (P1), sub-44px product CTA touch targets (P1), domains hardcoded instead of using `DOMAINS` (P1), zero analytics instrumentation, zero SEO metadata beyond a generic `<title>`.
- **No files modified.** Read-only phase.
- **Next Authorized Phase:** HEX-LAUNCH-01 REV B (below).

## Phase HEX-LAUNCH-01 REV B (opened 2026-07-24 — NOT CLOSED, awaiting CEO/CTO review)

- **Authorized by:** user, in-session. Objective: prepare the landing for the sales opening planned for **Monday 2026-07-27**, without activating real sales yet.
- **Three-access architecture (approved and implemented):** a new section `#elige-tu-experiencia` renders immediately after the hero, offering three real `<a href>` entry points — **QUIERO COMPETIR** (`#compite`, Individual · Dobles · Relay), **QUIERO EMPEZAR** (`#experience`, Workout Experience · ½ Hybrid), **QUIERO ASISTIR** (`#asiste`, Público · Fotógrafo). These are pure navigation (anchor jump via native `scroll-behavior: smooth`, no JS dependency, keyboard-focusable, visible `:focus-visible` outline). They do **not** filter or unmount any product from the DOM — the three access points sit above the existing COMPITE/EXPERIENCE/ASISTE sections, which are unchanged. Hero CTA and the floating CTA were both changed from "scroll to `#compite` only" to "Elige tu experiencia" → `#elige-tu-experiencia`.
- **28 products confirmed preserved:** `src/data/catalogo.ts` product data (names, codes, prices, day, session, member count, chip flag) is untouched except the domain fix below. Verified live in-browser at both `coming_soon` and a temporary `open` test: 28 `ProductCard`s render, 28 distinct codes generate `https://app.enforma.mx/inscribir?cat=CODE` when open, identical to the pre-existing 28 codes.
- **Sales status control:** new `src/config/salesConfig.ts` (`RegistrationStatus = 'coming_soon' | 'open' | 'closed'`, no time-based auto-activation). Current committed value: **`coming_soon`**, `openingLabel: 'Ventas abren el lunes 27 de julio'`. In `coming_soon`, all 28 product buttons render as a real, focusable, disabled `<button>` reading "Ventas abren el lunes" — no `href`, no navigation to Ready2Hybrid. A page-level banner below the navbar shows the full opening message whenever status isn't `open`.
- **Confianza y contacto:** removed the 7 unconfirmed sponsor names (AlgorithmUs.io, HYBRID LABS, IRONCLAD, NEXUS FIT, PRIMAL GEAR, ZERO GRAVITY, TITAN SPORT) and the animated marquee entirely — replaced with a static factual strip ("HYBRID EXPERIENCE · Organizado por ENFORMA Sports Society · Mérida, Yucatán · 9, 10 y 11 de octubre de 2026"). Footer Instagram now points to the real profile `https://www.instagram.com/enforma.sports_/` with `aria-label="Instagram de ENFORMA Sports Society"`. Removed the fictitious WhatsApp number (`wa.me/5215512345678`, never real) and the unbacked `info@enforma.mx` mailto (no project authority confirms it's monitored) — footer now shows Instagram only. Also corrected a stray fabricated handle `@hybridevent` in the "Preparación" accordion copy to the real `@enforma.sports_`.
- **Mobile conversion (`ProductCard`):** button `minHeight: 44` (measured live: 57–76px across the 28 cards at 360–390px, comfortably above the floor), `precioUnidad` and the chip-included caption raised from 9.6–10.4px/low-opacity to 12px/`rgba(255,255,255,0.65)` (contrast ≈8:1), `:focus-visible` outline added to every product button, the three access cards, the hero CTA and the floating CTA.
- **Domain centralization:** `getInscribirUrl()` in `catalogo.ts` and the navbar `SHOP` button now read `DOMAINS.app` / `DOMAINS.shop` from `src/config.ts` instead of hardcoded strings. Path preserved exactly (`/inscribir?cat=CODIGO`); the 28 codes are unchanged.
- **SEO implemented:** `<title>` and `meta description` set to the approved copy; Open Graph (`og:title`, `og:description`, `og:type=website`) and Twitter Card (`summary`, no image) added; single real `<h1>` on the page (`HYBRID EXPERIENCE`, previously there were three unintentional `<h1>`s inside the venue panel and zero in the hero — now fixed, plus 4 countdown digits that were incorrectly marked up as `<h2>` are now non-heading spans); new `<h2>Elige cómo vivir la experiencia</h2>` and `<h2>Sede y fechas</h2>` added; `Event` JSON-LD injected client-side (scoped to the landing route only, removed on unmount so it never bleeds into `/corporate`) using only already-confirmed data (name, description, dates, `EventScheduled`, `OfflineEventAttendanceMode`, city/region/country, organizer) — **no venue name, street address, image, ticket price or public URL was added to the structured data**, per instruction, even though "Club Cumbres" already appears as approved visible copy elsewhere on the page (flagged as a decision below). PWA manifest `description` in `vite.config.ts` aligned with the new meta description for coherence; `name`/`short_name`/`lang`/`theme_color`/icons untouched.
- **SEO explicitly NOT implemented (blocked, no invented data):**
  - **Canonical URL:** no approved public production URL exists in any authority file (`config.ts`'s `hybrid.enforma.mx` is only an unconfirmed code default, not a documented live domain; `vercel.json` has no domain info). → `CEO_DECISION_REQUIRED: canonical production URL`.
  - **`og:url` / `twitter:url`:** same blocker as canonical, omitted.
  - **`og:image` / `twitter:image`:** no official social-share asset exists. `src/assets/hero.png` was inspected and is a generic purple isometric template placeholder, unrelated to the event brand — not usable. → `CEO_ASSET_REQUIRED: social sharing image`.
  - **`robots.txt` / `sitemap.xml`:** neither file exists; both are blocked on the same canonical-URL decision above (would otherwise require inventing a domain).
- **Validation:** `npm run build` — clean (`tsc -b && vite build`, 646 modules, PWA 9 precache entries). `npm run lint` — clean (oxlint, 0 warnings). Browser-verified (DOM/computed-style inspection, per the same methodology noted in HEX-LANDING-SALES-01) at 1440/1024/768/390/360px: zero horizontal overflow at any width, zero console errors. Temporary `status: 'open'` test performed and reverted — confirmed by re-reading the file and rebuilding (identical output hash to the pre-test build).
- **Known issues / carried over, not in this phase's scope:** the `FORMATOS` section still duplicates COMPITE content with an English "DOUBLES" label inconsistent with the rest of the site (flagged in HEX-LANDING-SALES-01, P2-3 — untouched here); Unsplash-hosted stock photography untouched (explicitly out of scope, `G`); zero analytics (explicitly out of scope, `G`).
- **Pending CEO/CTO decisions before this phase can close:**
  1. `CEO_DECISION_REQUIRED: canonical production URL` — blocks canonical tag, `og:url`, `robots.txt`, `sitemap.xml`.
  2. `CEO_ASSET_REQUIRED: social sharing image` — blocks `og:image`/`twitter:image`.
  3. Whether **"Club Cumbres"** (already shown as approved on-page copy in the Ubicación section) should be added to the `Event` JSON-LD `location` — currently omitted out of caution since the phase instructions explicitly listed "nombre de venue" among the data not to invent in structured data.
  4. Confirm the `openingDate`/`openingLabel` copy and the Monday 2026-07-27 target are still accurate at the moment sales are actually flipped to `open`.
- **Gate to open sales (manual, after this review):** flip `src/config/salesConfig.ts` `status` to `'open'` only after Ready2Hybrid and Mercado Pago are validated — not automated by date/time.
- **Not done in this phase (explicitly out of scope per governance `G`):** Ready2Hybrid, Mercado Pago, forms, payments, QR tickets, analytics/GA/Meta Pixel, new photography, replacing Unsplash, price/category/code changes, press/guest registration, dependency installs, commit, push.
- **Git:** all changes are in the working tree only. No commit, no push performed in this phase.
- **Next Authorized Phase:** superseded by the sub-phase below (same day, same open phase — not a new phase name, just follow-up UX/content requests handled in-session).

### Sub-phase: UX follow-ups & media architecture (2026-07-24, same day, still open)

- **Copy:** the negatively-framed hero-adjacent tagline ("No es CrossFit. No es una carrera...") replaced with an affirmative one ("Esto es deporte híbrido: resistencia y fuerza puestas a prueba en el mismo reloj. El reto completo.") per direct user request.
- **Grid centering:** the 5 product `Grid container`s (Workout, ½ Hybrid, the 4 COMPITE groups, Público, Fotógrafo) left-aligned instead of centering whenever a row didn't fill completely (rows of 3 or the trailing row of 2 out of 5). Root cause: this MUI version's `Grid` is the CSS-Grid-based v2 API (`size={{...}}` prop), which does **not** honor `justifyContent` as a direct component prop — first attempt silently no-opped. Fixed by moving it into `sx={{ justifyContent: 'center' }}` on each container. Verified live: 3-card and 2-card (leftover) rows now center; the one 4-card row (Individual, Domingo) is unaffected, as expected.
- **Back-to-top:** new fixed button, bottom-left (`aria-label="Volver arriba"`, real `<a href="#hero">`, 48×48px, `:focus-visible` outline), mounted only once `window.scrollY > 800` via a scroll-listener `useEffect`. Addresses "no hay regreso" on a ~12,000px page where the only prior fixed control (`Elige tu experiencia`) is one-directional. Verified no overlap with that control at 1440px and 390px.
- **Unsplash → InsForge photography (functional swap, done same day; architecture standard corrected below):** all 28 `ProductCard`s, the hero background, and the Ubicación/venue background now use real ENFORMA photography from InsForge Storage instead of hotlinked Unsplash stock. Mapped by `producto.code` (not just `tipo`, since COMPITE/EXPERIENCE have gender-specific photography): Individual H/M (Open+Pro), Dobles M/H/Mixto (Vie+Sáb), Relay H/M/Mixto, ½ Hybrid (reuses its base-discipline photo), Workout Experience (estación SkiErg), Público (graderío), Fotógrafo (cobertura). Hero and Ubicación are responsive by breakpoint (400/800/largest-available). Zero `images.unsplash.com` references remain in `LandingPage.tsx` — verified by grep. Build/lint clean; all sampled URLs verified to load (200 OK) in-browser; no console errors; no horizontal overflow at 1440/390px.
- **⚠️ Architecture correction (same day, after the above was implemented) — official media standard:** the CEO/CTO clarified that images must **not** live in this repo's `public/` folder as the durable architecture (only minimal technical PWA icons belong there). The approved standard is:
  ```
  InsForge Storage → public bucket → production media subdomain (URLs estables) → landing
  ```
  and the frontend must build image URLs from `VITE_MEDIA_BASE_URL + objectPath` (a public, non-secret env var) rather than each component hardcoding the native InsForge hostname. **Current implementation does not yet follow this** — the URL swap above hardcodes full `https://3e9sriq7.us-east.insforge.app/...` URLs as string constants directly in `LandingPage.tsx` (functionally correct, architecturally not yet centralized). This is intentionally flagged as unresolved, not silently accepted as final. See "Media Constraints" and "Pending CEO/CTO decisions" below — the next imaging-related gate must validate *public, permanent, unsigned URLs + caching + content-type + subdomain config*, not ask for images to be copied into the repo.
- **Media Constraints (governance — binding for future sessions on this repo):**
  - No mover imágenes al repositorio por iniciativa propia; no crear copias dentro de `public/`.
  - No usar signed URLs para contenido público; no exponer claves/tokens de InsForge en el frontend.
  - No hardcodear el hostname final de medios en múltiples componentes — debe salir de una única autoridad (`VITE_MEDIA_BASE_URL` o equivalente) una vez aprobado.
  - No reemplazar un objeto existente bajo la misma URL con caché inmutable; una nueva versión de un asset requiere un nombre nuevo.
  - No cambiar nombres, rutas o bucket sin verificar primero todas las referencias en código.
- **Validation:** `npm run build` clean, `npm run lint` clean, both re-run after each of the three changes above. Browser-verified in-session (DOM/computed-style, per the methodology noted since HEX-LANDING-SALES-01).
- **Not done, explicitly deferred:** migrating the hardcoded InsForge URLs to the `VITE_MEDIA_BASE_URL` + object-path pattern; confirming the InsForge bucket/objects are actually public+permanent+unsigned (assumed true, not independently verified against InsForge config); reviewing cache headers / `Content-Type` / error behavior; deciding the official `og:image` (1200×630) from the now-available real photography; deciding whether "Club Cumbres" (venue name) can be added to `Event` JSON-LD now that a real venue photo exists; migrating hero/Ubicación/cards from CSS `background-image` to `<img>` elements with proper `loading`/`fetchpriority`/`alt` for performance and accessibility.

```
=== NEXT_SESSION_BOOTSTRAP ===
Workspace: C:\vonde\enforma-sys\hybrid-event-landing
Product/System: The Hybrid Experience (hybrid-event-landing)
Workspace Type: standalone-repo / external-development-workspace
Branch: main
HEAD: 6da9fee (working tree has uncommitted changes — see git status)
Last Commits: 6da9fee chore: complete hybrid event landing rename | c36b8ce docs: preserve original landing scripts | f546ddc docs: cierra fase COMPITE-CONTENT-FIXES en WORKSPACE_STATUS.md
Completed Phase: HEX-LANDING-SALES-01 (audit, read-only)
Open Phase (NOT closed): HEX-LAUNCH-01 REV B, including its same-day sub-phase "UX follow-ups & media architecture" — awaiting CEO/CTO review, see sections above
Gate: HEX_LAUNCH_01_REV_B_READY_FOR_CEO_CTO_REVIEW
Known Issues: FORMATOS/COMPITE content duplication (carried over, not fixed); hardcoded InsForge hostname pending centralization via VITE_MEDIA_BASE_URL
Pending Decisions:
  1. Canonical production URL for the landing.
  2. Definitive public media subdomain for InsForge Storage.
  3. Nombre y política del bucket público de HYBRID EXPERIENCE.
  4. Official 1200×630 social image for og:image (now unblocked by the real photography — asset choice pending).
  5. Whether "Club Cumbres" and its address can be published in JSON-LD.
  6. Confirm the Monday 2026-07-27 sales opening is still accurate.
  7. Future of the `#formatos` section (merge or remove — duplicates COMPITE).
  8. When to centralize the current hardcoded InsForge URLs behind VITE_MEDIA_BASE_URL.
Protected Sources: (none)
Next Authorized Phase: (awaiting CEO/CTO decision on the above — likely a scoped media-architecture phase, then the manual flip of salesConfig to `open`)
Files To Read First: WORKSPACE_STATUS.md, src/config/salesConfig.ts, src/pages/LandingPage.tsx, src/data/catalogo.ts, src/config.ts
Forbidden Actions: push without express authorization, modifying docs/guiones-origen/*.html, flipping salesConfig to `open` without explicit authorization, moving images into public/, using signed/expiring URLs for public media, exposing InsForge secrets
First Command: scripts/workspace-preflight.ps1
=== END_BOOTSTRAP ===
```
