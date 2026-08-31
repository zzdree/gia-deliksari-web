# Changelog

All notable changes to GIA Deliksari Web will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **UI primitives library** (`src/components/ui/`): Button, Badge, Card, LinkCard, Skeleton, EmptyState, Container primitives. Hybrid approach — added alongside existing components without breaking visual continuity.
- **`lib/cn.ts`** — Lightweight class joiner utility (clsx-style).
- **`components/ErrorBoundary.tsx`** — Client-side error boundary with branded fallback UI. Logs caught errors via `console.error` and emits custom event `gia:error` for future observability hook.
- **Button primitive** with 4 variants (gold/maroon/outline/ghost) × 3 sizes (sm/md/lg), full loading + disabled + focus + active state coverage, polymorphic (link | button | external link).
- **Hero section refactor**: CTA buttons now use `Button` primitive while (preserving original Sacred Crimson styling).
- **ErrorBoundary** integrated in `src/app/layout.tsx` wrapping all children.

### Tests
- **Button** (13 cases): variants, sizes, loading, disabled, onClick, link rendering, fullWidth, focus ring.
- **Badge** (8 cases): 7 variants, iconLeft, custom className.
- **ErrorBoundary** (5 cases): healthy child render, fallback on throw, dev-mode error display, reset interaction, home link fallback.

### CI / Workflows
- **`lighthouse.yml`** — Lighthouse CI audit on every push to main. Asserts Performance ≥ 0.9, A11y ≥ 0.95, Best Practices ≥ 0.95, SEO ≥ 0.9. Core Web Vitals: LCP ≤ 4s, CLS ≤ 0.1, TBT ≤ 300ms. Uploads report as 14-day artifact.

### Security
- **Removed bcrypt hash prefix from logs** (`auth.ts:225`). Previously logged 7-char hash prefix to Vercel function logs; now only logs a generic mismatch warning.

### Documentation
- **CHANGELOG.md** — This file, retroactively tracks notable changes.

---

## Earlier History

See git commit history for the full audit trail. Highlights from past weeks:

### 2026-08-23 → 2026-08-31 — Security hardening week
- **Multi-role bcrypt auth** with HMAC-SHA256 signed cookies
- **Rate limiting**: 3 failed attempts per (IP + username) per 5 min → 1 minute lockout
- **Append-only audit log** for sensitive admin/super/kas actions
- **RLS lockdown** migration dropping anon write policies on CMS tables
- **Daily Supabase backup** to GitHub via GH Action (30-day retention)
- **Backblaze B2 mirror** script for disaster recovery
- **Refactored `/super`** from 1019-line monolith into 4 focused components
- **Code-splitting** for `/admin` and `/kas` via `next/dynamic ssr:false`
- **Vercel Cron** auto-sync gallery Drive → DB at 03:00 UTC daily
- **Vitest + RTL** unit tests for super portal components
- **Playwright** e2e smoke (production) + gated mutation suite
- **TypeScript strict** mode enabled