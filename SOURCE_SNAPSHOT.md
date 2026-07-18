# SOURCE_SNAPSHOT

- **Source path:** `C:\Users\vonde\Proyectos\orchids-hype-pwa-design`
- **Source repository:** Parent repo at `C:\Users\vonde\Proyectos` (git)
- **Source branch:** main
- **Source HEAD (full):** `a595e463ed671da8ee935de5109f654b067146f1`
- **Source HEAD (short):** `a595e46`
- **Snapshot date:** 2026-07-15

## Last 5 Commits

```
a595e46 docs: add The Hype event platform design spec
cc29c86 feat: add multi-OS Quick Start (Mac/Linux/WSL/PowerShell) and update upgrade link
fbf320c feat: redesign README with images, Pro comparison table, and Stripe upgrade CTA
20fc04b feat: initial release of Forge Free v1.5.0
```

## Working Tree Summary

Clean at project level. The parent repository (`C:\Users\vonde\Proyectos`) contains unrelated deleted/untracked files that are NOT part of this project.

## Included Files

109 files from the source project, covering:
- `src/` — All pages (18), components (2), stores (2), hooks (1), API (1), constants (1), config (1), theme (1), routeTree (1), assets (2), App, main
- `public/` — All assets (favicon, icons, fonts, docs, r2r, redirects)
- Configuration — package.json, package-lock.json, tsconfig*.json, vite.config.ts, vercel.json, .oxlintrc.json, .gitignore, .deployignore
- Documentation — README.md, MIGRATION_MANIFEST.md
- Agent config — .orchids/orchids.json

## Excluded Folders

| Path | Reason |
|---|---|
| `node_modules/` | Dependencies (reproducible via package-lock.json) |
| `dist/` | Build artifacts |
| `.git/` | Parent repo history (not project-specific) |

## Excluded Files

None at project level.

## Hash Comparison Method

MD5 content hash of all 109 files. All files: IDENTICAL (0 differences).

## Known Differences

None. Source and destination are byte-identical for all 109 files.

## Evolution — ENFORMA-EXTRACT-1C-FIX (2026-07-18)

- **Date:** 2026-07-18
- **Initial HEAD:** `82327df`
- **Purpose:** Complete the deferred `eventConfig.ts` requirement from ENFORMA-EXTRACT-1C.
- **Primary files modified:**
  - `src/config/eventConfig.ts` — CREATED (canonical event identity)
  - `src/pages/LandingPage.tsx` — imported eventConfig, migrated section header
  - `src/pages/CorporateLandingPage.tsx` — imported eventConfig, migrated product title + footer
  - `src/pages/ConfirmacionPage.tsx` — imported eventConfig, migrated confirmation message
  - `index.html` — updated title, description, apple-mobile-web-app-title to match eventConfig
  - `vite.config.ts` — aligned manifest name/short_name/lang with eventConfig
  - `WORKSPACE_STATUS.md` — updated phase, fixed duplicate line, documented date conflict
  - `MIGRATION_MANIFEST.md` — added historical clarification header
- **Consumers migrated:** 5 files (LandingPage, CorporateLandingPage, ConfirmacionPage, index.html, vite.config.ts)
- **Unresolved conflicts:**
  - Date conflict: `9-11 OCTUBRE 2026` vs `17 Octubre` → REQUIRES_DECISION
  - Theme color mismatch: `#FF3D00` vs `#E6F2B1` → REQUIRES_DECISION
- **Source integrity:** Orchids HEAD `a595e46` — unchanged.
- **Monorepo integrity:** R2R THE HYPE HEAD `baf2901` — unchanged.
