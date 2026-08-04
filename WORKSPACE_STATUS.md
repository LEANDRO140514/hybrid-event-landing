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

## Phase HEAD-RECONCILIATION-01 (opened and closed 2026-08-03)

- **Authorized by:** user, in-session, "Fase 0 — RECONCILIACIÓN DE ACTA". Documentation-only phase — no `src/` files touched, no commit performed in this phase (change left in the working tree pending explicit user authorization to commit).
- **Trigger:** a RESUME pass (controlled-monorepo-workflow) detected HEAD drift — the prior `NEXT_SESSION_BOOTSTRAP` below documented HEAD `6da9fee` (dirty tree, open phase HEX-LAUNCH-01 REV B awaiting CEO/CTO review). Physical HEAD was `b4f50c0` (clean tree), 10 commits ahead, none documented in this file.
- **Reconciled commit history (`6da9fee` → `b4f50c0`, oldest first):**
  1. `f673a73` feat: prepare landing for ticket sales launch — introduced `src/config/salesConfig.ts` (`status: 'coming_soon'`, `openingLabel: 'Ventas abren el lunes 27 de julio'`)
  2. `c87a1a2` feat: replace stock imagery with Enforma media
  3. `970ba21` docs: document Hybrid Experience launch preparation
  4. `0f6a88f` fix: update Hybrid Experience ticket prices — raised Dobles / ½ Hybrid Dobles to $1,250 c/u and Relay to $850 c/u (supersedes the $1,200/$800 c/u figures recorded under Phase COMPITE-CONTENT-FIXES above; that entry is left unedited as a historical record of what was true at the time, not corrected retroactively)
  5. `84290b2` fix: finalize Hybrid Experience canonical domain and navigation
  6. `b39d432` feat: finalize event-only landing hardening — removed `CorporateLandingPage.tsx` and its route, added `NotFoundPage.tsx`, added real PWA icons (`icon-192.png`, `icon-512.png`) and `public/og/hybrid-experience-social.jpg`, added `vercel.json` redirect `/corporate → enforma.mx`
  7. `5c9a3a1` chore(security): ignore local InsForge metadata — `.gitignore` only
  8. `5cb5848` **[Cursor]** feat(checkout): add spectator sandbox wiring
  9. `9b9cf48` **[Cursor]** fix(checkout): prevent duplicate checkout submissions
  10. `b4f50c0` **[Cursor]** feat(checkout): expand public and press sandbox wiring

  Commits 8–10 are co-authored `Cursor <cursoragent@cursor.com>` — a different agent, working outside this protocol, with no corresponding phase entry until this reconciliation.
- **Checkout sandbox — investigated and RECOGNIZED / ACCEPTED as fail-closed, non-production:**
  - Adds `src/api/checkout.ts`, `src/api/orderStatus.ts`, `src/config/checkoutConfig.ts`, `src/lib/checkoutSession.ts`, `src/lib/submitLock.ts`, `src/pages/CheckoutConfirmPage.tsx`, wired into `ProductCard` in `src/pages/LandingPage.tsx`.
  - Talks to InsForge edge functions (`mp-create-checkout`, `get-order-status`) — no Mercado Pago credentials or payment logic live in this repo; the backend is the payment authority (and its own sales gate — see `SALES_NOT_OPEN`/`SOLD_OUT` error codes in `checkout.ts`).
  - Scoped to a 6-product allowlist only: `PUB-VIE`, `PUB-SAB`, `PUB-DOM`, `FOT-VIE`, `FOT-SAB`, `FOT-DOM` (Público/Fotógrafo). Never touches the other 22 COMPITE/EXPERIENCE/3-day-pass products.
  - `isSandboxCheckoutActive()` (`checkoutConfig.ts`) requires all four: `VITE_CHECKOUT_MODE==='sandbox'` (no "production" mode exists in code), `VITE_CHECKOUT_ENABLED==='true'`, a valid https `VITE_INSFORGE_FUNCTIONS_BASE`, **and** `window.location.hostname !== 'hybrid-experience.enforma.mx'` — the last check is a code-level kill-switch that disables the sandbox unconditionally on the canonical production host, independent of env var configuration.
  - `CheckoutConfirmPage.tsx` (`/checkout/confirmando`) visibly labels itself "Entorno de prueba" and independently re-checks `isSandboxCheckoutActive()` before polling order status.
  - **Disposition:** accepted as-is, fail-closed, outside the production purchase path. Not treated as a violation requiring rollback. The "Not done in this phase" exclusion list under HEX-LAUNCH-01 REV B (Ready2Hybrid/Mercado Pago/forms/payments) is understood to have scoped that specific phase, not to stand as a blanket prohibition on all future checkout-related work — this sandbox is a distinct, narrowly-scoped exception, documented here for the first time.
- **Pending finding, NOT resolved this phase — MAJOR:** `src/config/salesConfig.ts` `status` remains `'coming_soon'` with `openingLabel: 'Ventas abren el lunes 27 de julio'` (2026-07-27) — a date roughly a week in the past relative to today (2026-08-03). If `b4f50c0` is what's live at `https://hybrid-experience.enforma.mx/`, all 28 product buttons currently render disabled with stale copy. Not fixed in this phase (documentation-only) — carried into HEX-PRICING-STAGES-01 below.
- **Files touched this phase:** `WORKSPACE_STATUS.md` only. No `src/`, no `catalogo.ts`, no `salesConfig.ts`, no other code.
- **Validation:** N/A — documentation-only, no build/lint/test run.
- **Git:** change left uncommitted in the working tree, pending explicit user authorization to commit.
- **Next Authorized Phase:** HEX-PRICING-STAGES-01 (below).

## Phase HEX-PRICING-STAGES-01 (opened 2026-08-03, closed 2026-08-04) — COMPLETADA / CERRADA

- **Authorized by:** user, in-session, immediately following HEAD-RECONCILIATION-01. Executed as two authorized sub-phases in the same session: Parte 1 (datos) and Parte 2 (UI de venta completa).
- **Objective (as executed):** migrate `src/data/catalogo.ts` to a staged pricing matrix (Lanzamiento/Preventa/Regular) with 3-MSI eligibility per product, for **display purposes only**, and wire the landing UI to present it. Sales remained **CLOSED** throughout — no flip of `salesConfig.status`, no flip of `ventasArrancadas`. The InsForge backend remains the authority for actual charge amounts.
- **Commits (in order):**
  1. `4010ac4` (2026-08-03) — docs(workspace): reconcile HEAD drift and open HEX-PRICING-STAGES-01 (documentation-only; the phase's opening act, not pricing work itself)
  2. `4a8845d` (2026-08-04) — feat(pricing): add staged pricing matrix and 3-MSI eligibility (data layer)
  3. `1ead98c` (2026-08-04) — feat(landing): staged pricing table, prizes, and community section (UI layer)
- **Result:**
  - `src/data/catalogo.ts`: every product now carries `precioPorEtapa: { lanzamiento, preventa, regular } | null` and `msi: boolean`. Legacy `precio` scalar kept (mirrors the `lanzamiento` tier for staged products) — still consumed by the UI, not dead. `getPrecioVigente(producto, etapa)` resolves the display price for a given stage.
  - `src/lib/pricingStage.ts` (new): `resolveEtapaComercial()` — manual-start gate (`SALES_CONFIG.ventasArrancadas`, default `false`) plus date-based stage resolution in America/Mérida (fixed UTC-6, no DST) for the 2026 window: lanzamiento 10–23 ago, preventa 24 ago–13 sep, regular 14 sep–2 oct 23:59. Returns `null` (no stage active) until the switch is flipped.
  - `src/config/salesConfig.ts`: added `ventasArrancadas: false` (independent of `status`); `openingLabel` corrected from the stale "Ventas abren el lunes 27 de julio" to "Próximamente".
  - `src/pages/LandingPage.tsx`:
    - Product cards: price and "c/u" unit computed live from `precioPorEtapa`/`integrantes` instead of static fields; exact MSI messaging block per product (Workout / msi=true / msi=false-not-Workout).
    - New "Asegura tu lugar al mejor precio" section — pricing table grouped by COMPITE/EXPERIENCE/ASISTE, all values derived from `catalogo.ts` (no hardcoded amounts), high-contrast solid-color figures (no `textShadow`/blurred overlays — corrected mid-phase after an explicit legibility note).
    - Cash-prizes table (PRO/OPEN podiums) inside COMPITE → Individual; "Reconocimiento y premios a los mejores tiempos por categoría." line on Dobles, Relay, ½ Hybrid, and Workout.
    - New "¿Por qué perteneces aquí?" section: 6-item benefits grid (icons from the project's existing `@mui/icons-material` — confirmed via `git diff` on `package.json`/`package-lock.json` that no new dependency was added) and the full community manifesto, with "No importa de dónde vienes..." visually set apart.
    - Navbar "SHOP" replaced with "En construcción" (disabled, no navigation to `shop.enforma.mx`) — desktop and mobile menu; a small authorized follow-up in the same phase, unrelated to pricing itself.
- **Verification performed:** `npm run build` (`tsc -b && vite build`) and `npm run lint` (oxlint) clean at every step; live browser verification via dev server (console 0 errors) after each block; desktop (1440px) and mobile (375px) screenshots of the 4 new visual zones (pricing table, prizes table, benefits grid, manifesto) reviewed and approved by the user before this close.
- **Invariant state confirmed unchanged throughout:** `salesConfig.status = 'coming_soon'`, `SALES_CONFIG.ventasArrancadas = false`. Checkout sandbox (`src/api/checkout.ts`, `src/api/orderStatus.ts`, `src/config/checkoutConfig.ts`, `src/lib/checkoutSession.ts`, `src/lib/submitLock.ts`, `src/pages/CheckoutConfirmPage.tsx`) was not touched at any point in this phase — confirmed via `git status`/`git diff` before every commit. Nothing in this phase creates or modifies a payment path; InsForge remains the sole charge authority.
- **Known issues:** (none new)
- **Pending decisions, left open for the next session:**
  1. Push to `origin/main` — local is 3 commits ahead (`4010ac4`, `4a8845d`, `1ead98c`); remote still at `b4f50c0`. Not authorized this phase.
  2. Sales activation — manual flip of `ventasArrancadas` (and separately, `salesConfig.status` to `'open'`) once the InsForge backend is confirmed ready. Explicitly out of scope here; requires its own authorization.
  3. OD-020: `PUB-3D`/`FOT-3D` (3-day passes) are **not** in `SANDBOX_CHECKOUT_PRODUCTS` (`checkoutConfig.ts`), unlike the per-day `PUB-*`/`FOT-*` codes — fail-closed by omission. Confirm whether that's intentional or an oversight.
  4. `producto.precioUnidad` (legacy field in `catalogo.ts`) is no longer read directly by the new pricing table (it derives its own strings via `formatMonto`), but it **is** still read by `unidadConPrecioVigente()` in `LandingPage.tsx` (product cards + COMPITE group heading) — confirmed via grep, not dead code. The "por pareja"/"por equipo"/"por persona" base text now lives in two places (the static field and the dynamic c/u layer on top of it); worth a consolidation pass.
  5. All pre-existing items carried from HEX-LAUNCH-01 REV B / HEAD-RECONCILIATION-01 (canonical URL, media subdomain, bucket policy, og:image confirmation, Club Cumbres in JSON-LD, `#formatos` duplication, VITE_MEDIA_BASE_URL centralization) remain unresolved — untouched by this phase.
- **Next Authorized Phase:** (none yet — awaiting user decision, likely push authorization and/or sales-activation scoping)

```
=== NEXT_SESSION_BOOTSTRAP ===
Workspace: C:\vonde\enforma-sys\hybrid-event-landing
Product/System: The Hybrid Experience (hybrid-event-landing)
Workspace Type: standalone-repo / external-development-workspace
Branch: main
HEAD: 1ead98c (working tree clean)
Last Commits: 1ead98c feat(landing): staged pricing table, prizes, and community section | 4a8845d feat(pricing): add staged pricing matrix and 3-MSI eligibility | 4010ac4 docs(workspace): reconcile HEAD drift and open HEX-PRICING-STAGES-01 | b4f50c0 feat(checkout): expand public and press sandbox wiring [Cursor] | 9b9cf48 fix(checkout): prevent duplicate checkout submissions [Cursor]
Completed Phase: HEX-PRICING-STAGES-01 (closed 2026-08-04) — staged pricing (data + UI), prizes, community section
Open Phase (NOT closed): (none)
Gate: CONTEXT_RECOVERED_READY_FOR_INSTRUCTIONS
Known Issues:
  - Local `main` is 3 commits ahead of `origin/main` (still at `b4f50c0`) — not pushed, awaiting authorization.
  - OD-020: PUB-3D/FOT-3D absent from the sandbox checkout allowlist — confirm intentional.
  - `precioUnidad` legacy field now has two source-of-truth layers (static text + dynamic c/u calc) — candidate for consolidation.
  - FORMATOS/COMPITE content duplication (carried over from HEX-LAUNCH-01 REV B, still not fixed).
  - Hardcoded InsForge hostname still pending centralization via VITE_MEDIA_BASE_URL (carried over, still not fixed).
Pending Decisions:
  1. Push to origin/main.
  2. Sales activation (ventasArrancadas + salesConfig.status flip) — requires backend confirmation first, own authorization.
  3. OD-020 — PUB-3D/FOT-3D sandbox allowlist gap.
  4. precioUnidad consolidation (static field vs. dynamic c/u).
  5. Canonical production URL for the landing.
  6. Definitive public media subdomain for InsForge Storage.
  7. Nombre y política del bucket público de HYBRID EXPERIENCE.
  8. Official 1200×630 social image for og:image (public/og/hybrid-experience-social.jpg exists per commit b39d432 — confirm if approved final asset).
  9. Whether "Club Cumbres" and its address can be published in JSON-LD.
  10. Future of the `#formatos` section (merge or remove — duplicates COMPITE).
  11. When to centralize the current hardcoded InsForge URLs behind VITE_MEDIA_BASE_URL.
Protected Sources: (none)
Next Authorized Phase: (none yet — awaiting user decision)
Files To Read First: WORKSPACE_STATUS.md, src/config/salesConfig.ts, src/data/catalogo.ts, src/lib/pricingStage.ts, src/pages/LandingPage.tsx, src/config/checkoutConfig.ts
Forbidden Actions: push without express authorization, modifying docs/guiones-origen/*.html, flipping salesConfig to `open` or ventasArrancadas to `true` without explicit authorization, moving images into public/, using signed/expiring URLs for public media, exposing InsForge secrets, enabling sandbox checkout on the production host, expanding the sandbox checkout allowlist without explicit authorization
First Command: scripts/workspace-preflight.ps1
=== END_BOOTSTRAP ===
```
