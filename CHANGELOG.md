# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- `.editorconfig` for consistent coding style across all editors
- `.vscode/settings.json` committed as team configuration (Tailwind CSS validation, dist exclusion)
- GitHub Actions CI workflow (lint, type-check, build on every PR)
- Husky git hooks: `commit-msg` (commitlint) + `pre-commit` (lint-staged)
- `CHANGELOG.md` tracking file

### Changed
- `.gitignore`: `.vscode/settings.json` is now tracked (team settings)
- `tailwind.css`: Added `@theme` palette overrides with hex values to fix oklch browser compatibility
- `.browserslistrc`: Updated to explicit minimum versions (Chrome 100+, Firefox 102+, Safari 15.4+)

### Fixed
- `EmptyState.tsx`: Now uses `EmptyState.module.css` instead of inline Tailwind + inline styles
- `ErrorState.tsx`: Now uses `ErrorState.module.css` instead of inline Tailwind + inline styles
- `KpiCard.tsx`, `Timeline.tsx`: Import and use their CSS modules
- `IncidentDetail.tsx`: Removed unused `XCircle` import; replaced all `style={{ fontWeight }}` with Tailwind utilities
- `Login.tsx`, `Documents.tsx`, `Providers.tsx`: Replaced inline `fontWeight` styles with Tailwind utilities
- `Reports.tsx`: Dynamic chart colors now use Tailwind classes instead of inline styles
- `Dashboard.tsx`: Progress bar converted from `<div style={{ width }}>` to `<svg>` (no inline styles)
- `ImageWithFallback.tsx`: Removed `style` prop passthrough to fallback `<div>`
- `Tabs.module.css`: `scrollbar-width` moved to `@supports` block for correct progressive enhancement
- ARIA `aria-pressed` and `aria-checked` now use explicit string values (`"true"` / `"false"`)
- Accessibility: Added `aria-label` to icon-only buttons across Documents, IncidentForm, IncidentsList, Providers
- CSS compat: `text-size-adjust` (standard) added alongside `-webkit-text-size-adjust`

---

## [0.2.0] — 2025-03-11

### Added
- Full multi-tenant SaaS backend integration with Supabase
- `CONTRIBUTING.md`, `README.md`, `.github/pull_request_template.md`
- GitHub issue templates: bug report, feature request

---

## [0.1.0] — 2025-01-15

### Added
- Initial project scaffold from Figma/UPC design
- Dashboard, Assets, Incidents, Documents, Providers, Reports, Settings pages
- Mock data layer with automatic Supabase fallback via `useData` hook
- Tailwind CSS v4 + shadcn/ui component library
- Supabase schema (`schema.sql`, `rls.sql`, `seed.sql`)